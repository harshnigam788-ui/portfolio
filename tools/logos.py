import asyncio, json
from playwright.async_api import async_playwright
SITES={'valintry360':'https://valintry360.com','valintry':'https://valintry.com','ignitehcm':'https://www.ignitehcm.com',
'bullseye':'https://bullseyeengagement.com','calance':'https://www.calanceus.com','prateek':'https://prateekgroup.com',
'tag':'https://tagmfg.us','advayan':'https://www.advayan.com','zapfire':'https://zapfire.org','iinfotanks':'https://www.iinfotanks.com'}
JS='''() => {
 const vis=e=>{const r=e.getBoundingClientRect();return r.width>40&&r.height>14&&r.top<220&&r.left<900&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0'};
 const c=[...document.querySelectorAll('img.custom-logo, .custom-logo-link img, a[class*=logo i] img, [class*=logo i] img, img[class*=logo i], img[src*=logo i], img[alt*=logo i], a[class*=brand i] img, header a[href="/"] img, header a[href$=".com/"] img, header svg, [class*=logo i] svg')].filter(vis);
 if(!c.length) return null; const e=c[0]; e.setAttribute('data-logo-pick','1');
 return {tag:e.tagName, src:e.currentSrc||e.src||'', w:e.getBoundingClientRect().width, h:e.getBoundingClientRect().height};
}'''
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--disable-gpu'])
        ctx=await b.new_context(viewport={'width':1440,'height':900},device_scale_factor=3)
        out={}
        for k,u in SITES.items():
            p=await ctx.new_page()
            try:
                await p.goto(u,wait_until='domcontentloaded',timeout=40000)
                try: await p.wait_for_load_state('networkidle',timeout=8000)
                except: pass
                await p.wait_for_timeout(1500)
                info=await p.evaluate(JS)
                if info:
                    el=p.locator('[data-logo-pick="1"]').first
                    await el.screenshot(path=f'logos/{k}.png',omit_background=True)
                # brand colour hints
                theme=await p.evaluate("(document.querySelector('meta[name=theme-color]')||{}).content||''")
                out[k]={**(info or {}),'theme':theme}
                print(k,out[k],flush=True)
            except Exception as e: print('fail',k,str(e)[:100])
            await p.close()
        json.dump(out,open('logos.json','w'),indent=1); await b.close()
asyncio.run(main())
