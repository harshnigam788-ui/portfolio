import re, json, sys, urllib.request, gzip, concurrent.futures as cf
from urllib.parse import urlparse
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'}
def get(u):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=20); b=r.read()
        if u.endswith('.gz') or b[:2]==b'\x1f\x8b': b=gzip.decompress(b)
        return r.geturl(), b.decode('utf-8','ignore')
    except Exception as e: return None, ''
SITES={'valintry360':'https://valintry360.com','valintry':'https://valintry.com','ignitehcm':'https://www.ignitehcm.com',
'bullseye':'https://bullseyeengagement.com','calance':'https://www.calanceus.com','prateek':'https://prateekgroup.com',
'tag':'https://tagmfg.us','advayan':'https://www.advayan.com','zapfire':'https://zapfire.com','iinfotanks':'https://www.iinfotanks.com'}
def crawl(key, base):
    seen=set(); urls=set(); q=[]
    _,robots=get(base+'/robots.txt'); q+=re.findall(r'(?im)^sitemap:\s*(\S+)',robots)
    q+=[base+'/sitemap.xml',base+'/sitemap_index.xml',base+'/wp-sitemap.xml',base+'/page-sitemap.xml',base+'/post-sitemap.xml']
    while q and len(seen)<60:
        s=q.pop(0)
        if s in seen: continue
        seen.add(s); _,x=get(s)
        locs=re.findall(r'<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)',x)
        for l in locs:
            if re.search(r'\.xml(\.gz)?($|\?)',l): q.append(l)
            elif not re.search(r'\.(jpg|jpeg|png|webp|gif|pdf|svg|mp4)($|\?)',l,re.I): urls.add(l.strip())
    return key, sorted(urls)
out={}
with cf.ThreadPoolExecutor(10) as ex:
    for k,u in ex.map(lambda kv: crawl(*kv), SITES.items()): out[k]=u; print(k,len(u),flush=True)
json.dump(out,open('/home/claude/build/sitemap_urls.json','w'),indent=0)
