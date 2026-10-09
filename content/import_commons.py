"""Import explicitly selected, licensed Commons photographs without cropping."""
import concurrent.futures
import hashlib
import html
import io
import json
from pathlib import Path
import re
import urllib.request
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
selections=json.loads((ROOT/'content/commons-selections.json').read_text())
ALT={'whale-shark':'Walhai mit hellem Fleckenmuster im blauen Meerwasser.','garden-cross-spider':'Weibliche Gartenkreuzspinne auf einem Blatt; helle Kreuzzeichnung auf dem Hinterleib.','dromedary':'Junges Dromedar von der Seite mit einem Höcker und langen Beinen im Zoo Landau.','white-tailed-eagle':'Erwachsener Seeadler im Flug mit ausgebreiteten Flügeln und hellem Schwanz.'}
def clean(value):return html.unescape(re.sub('<[^>]+>','',value)).strip()
def fetch(p):
 info=p['imageinfo'];meta=info['extmetadata'];ident=p['id'];target=ROOT/'public/images/animals'/f'{ident}.webp';target.parent.mkdir(parents=True,exist_ok=True)
 if not target.exists():
  request=urllib.request.Request(info.get('thumburl') or info['url'],headers={'User-Agent':'WunderKompassEducation/1.0'})
  with urllib.request.urlopen(request,timeout=30) as response:data=response.read()
  with Image.open(io.BytesIO(data)) as opened:
   im=ImageOps.exif_transpose(opened).convert('RGB');im.thumbnail((1000,800),Image.Resampling.LANCZOS);im.save(target,'WEBP',quality=87,method=6)
 with Image.open(target) as im:w,h=im.size
 return {'id':ident,'src':f'/images/animals/{ident}.webp','author':clean(meta.get('Artist',{}).get('value','Wikimedia Commons')),'license':clean(meta['LicenseShortName']['value']),'license_url':meta.get('LicenseUrl',{}).get('value') or info['descriptionurl'],'source_page_url':info['descriptionurl'],'alt_de':ALT[ident],'width':w,'height':h,'transformations_de':'Proportional verkleinert und als WebP gespeichert. Kein Beschnitt und keine Veränderung der Tiermerkmale.','fit':'contain','sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:assets=list(pool.map(fetch,selections))
photos=json.loads((ROOT/'app/world-photos.json').read_text());photos.update({p['id']:p for p in assets})
(ROOT/'app/world-photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2)+'\n')
(ROOT/'public/world/photo-credits.json').write_text(json.dumps({'schema_version':1,'assets':list(photos.values())},ensure_ascii=False,indent=2)+'\n')
print('Imported',len(assets),'photographs')
