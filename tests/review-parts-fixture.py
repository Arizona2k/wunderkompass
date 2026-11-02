"""Synthetic transport countercases only; never native release evidence."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import zipfile

spec = importlib.util.spec_from_file_location('verify_review_parts', 'scripts/verify-review-parts.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
context = dict(repository='fixture/repo', runId='123', attempt='2', head='a'*40)
source, build = 'b'*64, 'c'*16
base = 'browser-evidence-123-2'
originals = {'ci-context.json': json.dumps(context).encode(),
             'review-manifest.json': json.dumps(dict(sourceDigest=source, build=build, status='passed')).encode(),
             '.original.png': bytes(range(256))*13,
             'nested/ä.xml': b'<original>preserved</original>', 'empty.json': b''}
sha = lambda b: hashlib.sha256(b).hexdigest()
originals['review-manifest.json'] = json.dumps(dict(sourceDigest=source, build=build, status='passed',
    reports=['ci-context.json', 'nested/ä.xml', 'empty.json'],
    screenshots=[dict(file='.original.png', retained=True, bytes=len(originals['.original.png']), sha256=sha(originals['.original.png']))])).encode()


with tempfile.TemporaryDirectory(prefix='wk-review-zip-test-') as tmp:
    root = Path(tmp)

    def archive(file, files):
        with zipfile.ZipFile(file, 'w', compression=zipfile.ZIP_DEFLATED) as z:
            for name, data in files.items():
                z.writestr(name, data)

    def metadata(file, name, number):
        return dict(name=name, id=number, expired=False, size_in_bytes=file.stat().st_size,
                    digest='sha256:'+module.file_hash(file), workflow_run=dict(id=123))

    groups = [dict(list(originals.items())[:2]), dict(list(originals.items())[2:])]
    parts, paths, official = [], {}, []
    for number, group in enumerate(groups, 1):
        name = base+'-part-'+str(number).zfill(3)
        file = root/(name+'.zip'); archive(file, group)
        a = metadata(file, name, number); official.append(a); paths[name] = str(file)
        parts.append(dict(number=number, name=name, maximumZIPBytes=module.LIMIT,
                          files=[dict(path=n, bytes=len(b), sha256=sha(b)) for n,b in group.items()],
                          artifact=dict(id=str(a['id']), digest=a['digest'][7:], url='https://github.com/fixture/repo/actions/runs/123/artifacts/'+str(number))))
    index = dict(schemaVersion=1, kind='wunderkompass-original-review-parts', complete=True,
                 name=base, runId='123', attempt='2', repository='fixture/repo', sourceDigest=source,
                 build=build, context=context, limitBytes=module.LIMIT, reviewStatus='passed',
                 parts=parts, files=len(originals), originalBytes=sum(map(len,originals.values())))

    def index_archive(value, number=90, sums_override=None):
        data = (json.dumps(value)+'\n').encode(); file = root/f'index-{number}.zip'
        sums = '\n'.join(sorted([sha(b)+'  '+n for n,b in originals.items()], key=lambda x:x.encode()))+'\n'
        archive(file, {'review-parts.json': data, 'review-parts.json.sha256': (sha(data)+'  review-parts.json\n').encode(),
                       'SHA256SUMS.txt': (sums if sums_override is None else sums_override).encode()})
        return file, metadata(file, base+'-index', number)

    iz, im = index_archive(index)
    args = dict(index_zip=str(iz), part_zips=paths, official_artifacts=official+[im],
                repository='fixture/repo', run_id='123', attempt='2', source=source, build=build, context=context)
    with module.VerifiedReviewParts(**args) as v:
        assert set(v.namelist()) == set(originals)
        for n,b in originals.items(): assert v.read(n) == b
        assert v.receipt['files'] == 5

    rejected = 0

    def reject(p):
        global rejected
        try:
            with module.VerifiedReviewParts(**p): pass
        except (ValueError, zipfile.BadZipFile, KeyError):
            rejected += 1
        else:
            raise AssertionError('Countercase incorrectly accepted')

    p=copy.deepcopy(args); p['part_zips'].pop(next(iter(paths))); reject(p)
    p=copy.deepcopy(args); p['part_zips']['unexpected']=str(iz); reject(p)
    p=copy.deepcopy(args); p['source']='d'*64; reject(p)
    p=copy.deepcopy(args); p['build']='d'*16; reject(p)
    p=copy.deepcopy(args); p['attempt']='3'; reject(p)
    p=copy.deepcopy(args); p['official_artifacts'][0]['digest']='sha256:'+'0'*64; reject(p)
    p=copy.deepcopy(args); p['official_artifacts'][0]['size_in_bytes']+=1; reject(p)
    p=copy.deepcopy(args); p['official_artifacts'][0]['workflow_run']['id']=456; reject(p)
    p=copy.deepcopy(args); p['official_artifacts'][0]['expired']=True; reject(p)
    p=copy.deepcopy(args); p['official_artifacts'][0]['id']=500; reject(p)
    p=copy.deepcopy(args); extra=copy.deepcopy(official[0]);extra['name']=base+'-part-003';p['official_artifacts'].append(extra);reject(p)
    bad=copy.deepcopy(index);bad['complete']=False;new,meta=index_archive(bad,91);p=copy.deepcopy(args);p.update(index_zip=str(new),official_artifacts=official+[meta]);reject(p)
    new,meta=index_archive(index,92,sums_override='wrong\n');p=copy.deepcopy(args);p.update(index_zip=str(new),official_artifacts=official+[meta]);reject(p)
    altered=dict(groups[1]);altered['.original.png']=b'changed actual payload';changed=root/'changed.zip';archive(changed,altered)
    p=copy.deepcopy(args);p['part_zips'][parts[1]['name']]=str(changed);p['official_artifacts'][1]=metadata(changed,parts[1]['name'],2);reject(p)
    # Make the outer native checksum and index's ZIP receipt consistent too:
    # the independently retained common original SHA must still reject it.
    bad=copy.deepcopy(index);bad['parts'][1]['artifact']['digest']=module.file_hash(changed)
    new,meta=index_archive(bad,93);p.update(index_zip=str(new),official_artifacts=p['official_artifacts'][:2]+[meta]);reject(p)
    print(json.dumps(dict(actualSyntheticOriginalsVerified=5, rejectedCountercases=rejected,
                          scope='synthetic countercases only, no native or release claim')))
