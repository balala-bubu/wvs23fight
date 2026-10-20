"""Headless smoke test: every character's moves, ultimate, win and loss on every map.
Usage: python3 tools/smoke_test.py [extra.js ...]   (extra files are loaded after the real ones, e.g. a template)
Needs Python playwright + a Chromium; downloads three.js r128 from npm on first run."""
import sys, os, glob, asyncio, threading, http.server, functools, subprocess, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(tempfile.gettempdir(), 'wvs_three')
THREE = os.path.join(CACHE, 'node_modules/three/build/three.min.js')
if not os.path.exists(THREE):
    os.makedirs(CACHE, exist_ok=True)
    subprocess.run('npm init -y >/dev/null && npm i three@0.128.0 --silent', shell=True, cwd=CACHE, check=True)
EXTRA = sys.argv[1:]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
PORT = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
def chrome():
    for pat in ['/opt/pw-browsers/chromium-*/chrome-linux/chrome', os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')]:
        hits = sorted(glob.glob(pat))
        if hits: return hits[-1]
    return None
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ERROR: ' + str(e)))
        async def route(r):
            u = r.request.url
            if 'three.min.js' in u: await r.fulfill(path=THREE, content_type='application/javascript')
            elif 'peerjs' in u: await r.fulfill(body='', content_type='application/javascript')
            elif u.endswith('index.html') and EXTRA:
                html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
                html = html.replace('<script>boot();</script>', ''.join(f'<script src="{x}"></script>' for x in EXTRA) + '<script>boot();</script>')
                await r.fulfill(body=html, content_type='text/html')
            elif f'127.0.0.1:{PORT}' in u: await r.continue_()
            else: await r.abort()
        await pg.route('**/*', route)
        await pg.goto(f'http://127.0.0.1:{PORT}/index.html'); await pg.wait_for_timeout(1500)
        kinds = await pg.evaluate('CHAR_ORDER'); maps = await pg.evaluate('MAP_ORDER')
        print('characters:', kinds, '\nmaps:', maps)
        for r, kind in enumerate(kinds):
            lineup = [kinds[(r+j) % len(kinds)] for j in range(4)]; mp = maps[r % len(maps)]
            await pg.evaluate(f"(()=>{{ sel.count=4; sel.p={lineup!r}; sel.map='{mp}'; startGame(); }})()")
            await pg.wait_for_timeout(1200)
            await pg.evaluate("G.fighters.forEach(f=>{ f.meter=100; if (f.state!=='dead') startFinal(f); })")
            await pg.wait_for_timeout(3000)
            for mv in ['jab3','side','up','down','nair','fair','uair','dair','nB','sB','uB','dB']:
                await pg.evaluate(f"G.fighters.forEach(f=>{{ if (f.state!=='dead' && f.state!=='final'){{ f.state='idle'; f.startMove('{mv}'); }} }})")
                await pg.wait_for_timeout(300)
            await pg.wait_for_timeout(1200)
            await pg.evaluate("[2,3,1].forEach(i=>{ const f=G.fighters[i]; f.stocks=1; f.state='idle'; f.invuln=0; f.ko(); })")
            await pg.wait_for_timeout(13000)
            ok = await pg.evaluate("G.mode==='result' && !overEl.hidden")
            print(f'  {kind:10s} wins vs {lineup[1]:10s} on {mp:8s} -> {"ok" if ok else "RESULT SCREEN DID NOT FINISH"}')
            await pg.evaluate('enterSelect()'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=os.path.join(tempfile.gettempdir(), 'wvs_select.png'))
        print('\nerrors:', len(set(errs))); print('\n'.join(sorted(set(errs))))
        await b.close()
asyncio.run(main())
