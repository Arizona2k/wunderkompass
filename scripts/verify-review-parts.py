"""Verify every official native ZIP and expose originals without repacking them.

The caller supplies fresh GitHub artifact metadata and expected run/source/build.
Transport validity never replaces native checks or semantic/personal review.
"""
import hashlib
import json
import re
import stat
import zipfile
from pathlib import Path, PurePosixPath

LIMIT = 200 * 1024 * 1024


def require(condition, message):
    if not condition:
        raise ValueError(message)


def safe_name(name):
    require(isinstance(name, str) and name and not name.startswith('/') and
            not re.search(r'[\\\x00-\x1f:*?"<>|]', name) and
            all(p not in ('', '.', '..') for p in name.split('/')),
            'Unsafe original path')
    return name


def unique_json(data):
    def pairs(rows):
        result = {}
        for key, value in rows:
            require(key not in result, 'Duplicate JSON key')
            result[key] = value
        return result
    return json.loads(data, object_pairs_hook=pairs)


def file_hash(file):
    h = hashlib.sha256()
    with open(file, 'rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


class VerifiedReviewParts:
    def __init__(self, index_zip, part_zips, official_artifacts, *,
                 repository, run_id, attempt, source, build, context):
        self.archives = []
        self.members = {}
        self.file_records = {}
        self.index = None
        try:
            self._verify(index_zip, part_zips, official_artifacts, repository,
                         str(run_id), str(attempt), source, build, context)
        except BaseException:
            self.close()
            raise

    def _verify(self, index_zip, part_zips, official_artifacts, repository,
                run_id, attempt, source, build, context):
        base = f'browser-evidence-{run_id}-{attempt}'
        require(re.fullmatch(r'[0-9]+', run_id) and
                re.fullmatch(r'[0-9]+', attempt), 'Invalid run identity')
        require(re.fullmatch(r'[a-f0-9]{64}', source) and
                re.fullmatch(r'[a-f0-9]{16}', build), 'Expected source/build required')
        require(context['repository'] == repository and context['runId'] == run_id
                and context['attempt'] == attempt, 'Expected native context mismatch')
        metadata = {a['name']: a for a in official_artifacts}
        require(len(metadata) == len(official_artifacts), 'Duplicate native artifact name')

        def official_zip(file, name, receipt=None):
            file = Path(file)
            a = metadata.get(name)
            require(a is not None and a.get('expired') is False and
                    str(a['workflow_run']['id']) == run_id,
                    'Missing or wrong-run native artifact')
            require(0 < file.stat().st_size == a['size_in_bytes'] <= LIMIT,
                    'Native archive size mismatch or transport boundary exceeded')
            digest = file_hash(file)
            require(a.get('digest') == 'sha256:' + digest,
                    'Native official whole-ZIP SHA256 mismatch')
            if receipt is not None:
                require(str(a['id']) == receipt['id'] and
                        receipt['digest'] == digest,
                        'Part receipt differs from native artifact')
            archive = zipfile.ZipFile(file)
            self.archives.append(archive)
            require(sum(i.file_size for i in archive.infolist()) <= LIMIT,
                    'Native part expands beyond bounded original transport')
            names = [safe_name(i.filename) for i in archive.infolist()]
            require(len(names) == len(set(names)), 'Duplicate ZIP original')
            for info in archive.infolist():
                mode = info.external_attr >> 16
                require(not info.is_dir() and stat.S_IFMT(mode) in (0, stat.S_IFREG) and
                        not info.flag_bits & 1 and info.file_size <= LIMIT,
                        'Nonregular, encrypted or oversized ZIP original')
            return archive

        index_archive = official_zip(index_zip, base + '-index')
        require(set(index_archive.namelist()) == {
            'review-parts.json', 'review-parts.json.sha256', 'SHA256SUMS.txt'},
            'Unexpected common index files')
        raw = index_archive.read('review-parts.json')  # zipfile also verifies CRC.
        require(index_archive.read('review-parts.json.sha256').decode() ==
                hashlib.sha256(raw).hexdigest() + '  review-parts.json\n',
                'Common index whole-SHA mismatch')
        index = unique_json(raw)
        self.index = index
        require(index['schemaVersion'] == 1 and
                index['kind'] == 'wunderkompass-original-review-parts' and
                index['complete'] is True and index['name'] == base and
                index['runId'] == run_id and index['attempt'] == attempt and
                index['repository'] == repository and index['sourceDigest'] == source
                and index['build'] == build and index['context'] == context and
                index['limitBytes'] == LIMIT,
                'Incomplete or wrong-context original transport')
        require(index['parts'] and len(index['parts']) == len(part_zips),
                'Missing or extra original ZIP part')
        part_names = [p['name'] for p in index['parts']]
        require(len(part_names) == len(set(part_names)) and
                set(part_zips) == set(part_names), 'Duplicate or missing part')
        actual_names = {name for name in metadata if name == base + '-index' or
                        name.startswith(base + '-part-')}
        require(actual_names == set(part_names) | {base + '-index'},
                'Native run contains unindexed evidence part')
        sums, total = [], 0
        for number, part in enumerate(index['parts'], 1):
            require(part['number'] == number and part['name'] ==
                    base + '-part-' + str(number).zfill(3) and
                    0 < part['maximumZIPBytes'] <= LIMIT and part['files'],
                    'Invalid original part order or boundary')
            archive = official_zip(part_zips[part['name']], part['name'], part['artifact'])
            require(Path(part_zips[part['name']]).stat().st_size <= part['maximumZIPBytes'],
                    'Measured archive exceeds conservative ZIP bound')
            expected = {safe_name(row['path']): row for row in part['files']}
            require(len(expected) == len(part['files']) and
                    set(archive.namelist()) == set(expected),
                    'Missing, extra or duplicate original file')
            for info in archive.infolist():
                name = info.filename
                require(name not in self.members, 'Original repeated across parts')
                row = expected[name]
                require(type(row['bytes']) is int and row['bytes'] == info.file_size
                        and re.fullmatch(r'[a-f0-9]{64}', row['sha256']),
                        'Original byte length or digest malformed')
                h = hashlib.sha256()
                with archive.open(info) as stream:
                    for block in iter(lambda: stream.read(1024 * 1024), b''):
                        h.update(block)
                require(h.hexdigest() == row['sha256'], 'Original file SHA256 mismatch')
                self.members[name] = (archive, info)
                self.file_records[name] = row
                total += info.file_size
                sums.append(row['sha256'] + '  ' + name)
        require(index['files'] == len(self.members) and index['originalBytes'] == total,
                'Incomplete common original inventory')
        expected_sums = '\n'.join(sorted(sums, key=lambda s: s.encode('utf8'))) + '\n'
        require(index_archive.read('SHA256SUMS.txt').decode() == expected_sums,
                'Common SHA256 file directory differs')
        require(unique_json(self.read('ci-context.json')) == context,
                'Actual original native context differs')
        review = unique_json(self.read('review-manifest.json'))
        require(review['sourceDigest'] == source and review['build'] == build and
                review['status'] == index['reviewStatus'],
                'Actual original review binding differs')
        retained = [r for r in review['screenshots'] if r['retained']]
        expected_names = {'review-manifest.json', *review['reports'],
                          *(r.get('storedAs', r['file']) for r in retained)}
        require(expected_names == set(self.members),
                'Common transport omitted or added a curated original')
        for capture in retained:
            name = safe_name(capture.get('storedAs', capture['file']))
            row = self.file_records[name]
            require(row['bytes'] == capture['bytes'] and row['sha256'] == capture['sha256'],
                    'Retained capture identity differs from common inventory')
        # Passed is a transport result only. Existing native/semantic/personal
        # predicates must consume these exact reports and original PNGs.
        self.receipt = dict(status='passed original transport only', parts=len(part_zips),
                            files=len(self.members), originalBytes=total,
                            runId=run_id, attempt=attempt, source=source, build=build)

    def namelist(self):
        return list(self.members)

    def infolist(self):
        return [info for archive, info in self.members.values()]

    def open(self, name):
        archive, info = self.members[name]
        return archive.open(info)

    def read(self, name):
        archive, info = self.members[name]
        return archive.read(info)

    def close(self):
        for archive in self.archives:
            archive.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('parameters', help='JSON with downloaded native ZIP paths, fresh official metadata and expected identity')
    args = parser.parse_args()
    p = unique_json(Path(args.parameters).read_bytes())
    with VerifiedReviewParts(**p) as verified:
        print(json.dumps(verified.receipt))
