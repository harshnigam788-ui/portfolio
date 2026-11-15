import json, re, random
d=json.load(open('sitemap_urls.json'))
BAD=re.compile(r'(\?|/tag/|/category/|/author/|/page/\d|/feed|demo|hello-world|elementskit|cjp-|privacy|terms|thank|/lp-|-old\b|-old/|/wp-|/career-job/|cookie|sitemap|/search|disclaimer|/ja/|/attachment)',re.I)
def path(u): return re.sub(r'https?://[^/]+','',u).strip('/')
def cat(u):
    p=path(u).lower()
    if not p: return 'Homepage'
    if re.search(r'case-stud|casestudy|/clients?$|port-',p) or re.search(r'(for-|installation|upgrade|retrofit).*(hospital|dell|coforge|cyber-city)',p): return 'Case study'
    if re.match(r'(blogs?|insights|news|articles)/.+',p): return 'Blog'
    if re.search(r'about|team|advisors|advisory-board|career|csr|media-events|ebook',p): return 'Brand page'
    return 'Service page'
Q={'valintry360':{'Case study':20,'Blog':25,'Service page':24,'Homepage':1,'Brand page':3},
   'valintry':{'Case study':6,'Blog':22,'Service page':40,'Homepage':1,'Brand page':2},
   'ignitehcm':{'Case study':6,'Blog':34,'Service page':12,'Homepage':1,'Brand page':3},
   'bullseye':{'Case study':4,'Blog':30,'Service page':18,'Homepage':1,'Brand page':5},
   'calance':{'Case study':39,'Blog':16,'Service page':30,'Homepage':1,'Brand page':5},
   'prateek':{'Case study':0,'Blog':24,'Service page':30,'Homepage':1,'Brand page':8},
   'tag':{'Service page':44,'Homepage':1,'Brand page':2,'Blog':4,'Case study':2},
   'advayan':{'Service page':38,'Blog':16,'Homepage':1,'Brand page':3,'Case study':2},
   'zapfire':{'Service page':22,'Case study':8,'Blog':4,'Homepage':1,'Brand page':3},
   'iinfotanks':{'Case study':25,'Blog':12,'Service page':20,'Homepage':1,'Brand page':2}}
rnd=random.Random(7); out=[]
for k,us in d.items():
    us=[u for u in dict.fromkeys(us) if not BAD.search(path(u)+'/')]
    # one URL per normalized path (strip trailing slash / scheme / www)
    seen=set(); uu=[]
    for u in us:
        n=path(u).lower().rstrip('/')
        if n not in seen: seen.add(n); uu.append(u)
    by={}
    for u in uu: by.setdefault(cat(u),[]).append(u)
    for c,n in Q[k].items():
        pool=by.get(c,[])
        # prefer shallow pages for service pages; spread for blogs
        if c=='Service page': pool=sorted(pool,key=lambda u:(path(u).count('/'),len(path(u))))
        pick=pool[:n] if c!='Blog' else rnd.sample(pool,min(n,len(pool)))
        out+= [{'client':k,'cat':c,'url':u} for u in pick]
    print(k, {c:len(by.get(c,[])) for c in Q[k]}, '->', sum(1 for o in out if o['client']==k))
json.dump(out,open('selection.json','w'),indent=0); print('total',len(out))
