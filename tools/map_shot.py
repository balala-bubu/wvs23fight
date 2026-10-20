"""Screenshot one map headlessly (2 players, 4 players, and a "fighters up high" view).
Usage: python3 tools/map_shot.py <mapId> [outDir] [highY]     -> <outDir>/<mapId>_2p.png, _4p.png, _high.png
Needs Python playwright + Chromium, same as tools/smoke_test.py (three.js r128 is cached in the temp dir)."""
import sys, os, glob, asyncio, threading, http.server, functools, subprocess, tempfile
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = sys.argv[1]; OUT = sys.argv[2] if len(sys.argv) > 2 else tempfile.gettempdir()
HIGH = float(sys.argv[3]) if len(sys.argv) > 3 else 14   # how high the 'fighters up high' shot lifts them (KO is above y=48)
CACHE = os.path.join(tempfile.gettempdir(), 'wvs_three')
THREE = os.path.join(CACHE, 'node_modules/three/build/three.min.js')
if not os.path.exists(THREE):
    os.makedirs(CACHE, exist_ok=True)
    subprocess.run('npm init -y >/dev/null && npm i three@0.128.0 --silent', shell=True, cwd=CACHE, check=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
PORT = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
def chrome():
    for pat in ['/opt/pw-browsers/chromium-*/chrome-linux/chrome', os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')]:
        hits = sorted(glob.glob(pat))
        if hits: return hits[-1]
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        async def route(r):
            u = r.request.url
            if 'three.min.js' in u: await r.fulfill(path=THREE, content_type='application/javascript')
            elif 'peerjs' in u: await r.fulfill(body='', content_type='application/javascript')
            elif f'127.0.0.1:{PORT}' in u: await r.continue_()
            else: await r.abort()
        await pg.route('**/*', route)
        await pg.goto(f'http://127.0.0.1:{PORT}/index.html'); await pg.wait_for_timeout(1500)
        kinds = await pg.evaluate('CHAR_ORDER')
        if MAP not in await pg.evaluate('MAP_ORDER'): sys.exit(f'map {MAP!r} is not registered')
        for n in (2, 4):
            lineup = [kinds[j % len(kinds)] for j in range(n)]
            await pg.evaluate(f"(()=>{{ sel.count={n}; sel.p={lineup!r}; sel.map='{MAP}'; startGame(); }})()")
            await pg.wait_for_timeout(5500)
            await pg.screenshot(path=os.path.join(OUT, f'{MAP}_{n}p.png'))
        await pg.evaluate(f"G.fighters.forEach(f=>{{ f.y={HIGH}; f.vy=0; }})")
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=os.path.join(OUT, f'{MAP}_high.png'))
        print('page errors:', sorted(set(errs)) or 'none')
        await b.close()
asyncio.run(main())
