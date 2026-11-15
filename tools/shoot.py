import asyncio, json, os, re, sys, hashlib
from playwright.async_api import async_playwright
SEL=json.load(open('selection.json'))
OUT='shots'; os.makedirs(OUT,exist_ok=True)
HIDE='''[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],#hubspot-messages-iframe-container,
[class*="chat-widget" i],[id*="chat-widget" i],iframe[title*="chat" i],[class*="intercom" i],#onetrust-banner-sdk,.cky-consent-container,
[class*="popup" i][style*="fixed"],.elementor-popup-modal,[id*="tawk" i],[class*="whatsapp" i],[class*="wa-" i][style*="fixed"],
#credential_picker_container,[class*="newsletter-popup" i],.pum-overlay,[class*="modal-backdrop" i],div[aria-modal="true"]{display:none!important;visibility:hidden!important}
html,body{overflow:auto!important}'''
async def one(ctx, i, it, sem, res):
    async with sem:
        p=await ctx.new_page(); fn=f'{OUT}/{i:04d}.jpg'
        try:
            await p.goto(it['url'], wait_until='domcontentloaded', timeout=35000)
            try: await p.wait_for_load_state('networkidle', timeout=9000)
            except: pass
            await p.add_style_tag(content=HIDE)
            await p.evaluate("window.scrollTo(0,0)")
            await p.wait_for_timeout(1600)
            title=await p.title()
            h1=await p.evaluate("(()=>{const h=document.querySelector('h1');return h?h.innerText.trim().slice(0,140):''})()")
            await p.screenshot(path=fn, type='jpeg', quality=82)
            res.append({**it,'i':i,'file':fn,'title':title.strip()[:160],'h1':h1,'final':p.url})
            print('ok',i,it['client'],it['cat'],flush=True)
        except Exception as e:
            print('fail',i,it['url'],str(e)[:80],flush=True)
        finally: await p.close()
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox','--disable-gpu','--mute-audio'])
        ctx=await b.new_context(viewport={'width':1280,'height':960},device_scale_factor=1,
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',locale='en-US')
        sem=asyncio.Semaphore(8); res=[]
        await asyncio.gather(*[one(ctx,i,it,sem,res) for i,it in enumerate(SEL)])
        json.dump(sorted(res,key=lambda r:r['i']),open('shots.json','w'),indent=0)
        await b.close()
asyncio.run(main())
