"""Headless phone <-> big-screen connection test: one host page + phone pages + a local PeerJS server.
Usage: python3 tools/phone_test.py
Checks (each prints PASS/FAIL, exit code 1 if any fails):
  1. the host opens a room and shows a 4-digit code
  2. a phone connects and the host shows it
  3. double-tapping 連線 on the phone creates ONE player, not a ghost
  4. a phone that leaves frees its slot quickly
  5. a phone that goes silent is dropped after ~10 s (heartbeat)
  6. QR page (?room=NNNN) shows the waiting picture and no form, and cancelling mid-connect leaves no ghost
Needs Python playwright + a Chromium + node/npm (downloads three r128, peerjs and peer from npm on first run).
Not covered: real phones / iOS Safari, real GPUs (this runs on software rendering)."""
import sys, os, glob, asyncio, subprocess, tempfile, socket, time, atexit

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(tempfile.gettempdir(), 'wvs_phone')
NM = os.path.join(CACHE, 'node_modules')
if not os.path.exists(os.path.join(NM, 'peer')) or not os.path.exists(os.path.join(NM, 'three')):
    os.makedirs(CACHE, exist_ok=True)
    subprocess.run('npm init -y >/dev/null && npm i three@0.128.0 peerjs@1.5.4 peer@1.0.2 --silent', shell=True, cwd=CACHE, check=True)
THREE = open(os.path.join(NM, 'three/build/three.min.js')).read()
PEERJS = open(os.path.join(NM, 'peerjs/dist/peerjs.min.js')).read()

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

# local PeerJS signalling server (IPv4 only: some sandboxes have no IPv6)
PEER_PORT = free_port()
open(os.path.join(CACHE, 'server.js'), 'w').write(
    "const { PeerServer } = require('./node_modules/peer');\n"
    "PeerServer({ port: %d, host: '127.0.0.1', path: '/' });\nsetInterval(()=>{}, 1<<30);\n" % PEER_PORT)
peer_proc = subprocess.Popen(['node', 'server.js'], cwd=CACHE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
atexit.register(lambda: peer_proc.terminate())
for _ in range(40):
    try: socket.create_connection(('127.0.0.1', PEER_PORT), 0.2).close(); break
    except OSError: time.sleep(0.25)

PORT = free_port()   # the page server runs as its own process (in-thread it starved the second page in tests)
web_proc = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1', '--directory', ROOT],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
atexit.register(lambda: web_proc.terminate())
for _ in range(40):
    try: socket.create_connection(('127.0.0.1', PORT), 0.2).close(); break
    except OSError: time.sleep(0.25)
BASE = 'http://127.0.0.1:%d/brawl.html' % PORT

# make the game's `new Peer(...)` talk to the local server, no STUN needed
WRAP = (";(function(){var P=window.Peer;var W=function(id,opts){if(id&&typeof id==='object'){opts=id;id=undefined;}"
        "opts=Object.assign({host:'127.0.0.1',port:%d,path:'/',secure:false,config:{iceServers:[]}},opts||{});"
        "return id?new P(id,opts):new P(opts);};W.prototype=P.prototype;window.Peer=W;})();" % PEER_PORT)

def slow(ms):   # delay the phone's offer so "connecting" lasts a while (delay setLocalDescription: delaying setRemoteDescription breaks ICE ordering)
    return ("(function(){var o=RTCPeerConnection.prototype.setLocalDescription;"
            "RTCPeerConnection.prototype.setLocalDescription=function(){var a=arguments,s=this;"
            "return new Promise(function(r){setTimeout(function(){r(o.apply(s,a))}," + str(ms) + ")})};})();")

SLOTS = "()=>({n:(party&&party.slots||[]).filter(Boolean).length, first:[...document.querySelectorAll('#padList span')].map(s=>s.textContent)[0]})"
RESULTS = []
def check(name, ok, detail=''):
    RESULTS.append(ok); print(('PASS  ' if ok else 'FAIL  ') + name + (('  — ' + str(detail)) if detail != '' else ''))

def chrome():
    # Playwright's own browser by default (the full /opt/pw-browsers Chromium crawls with two WebGL pages on software GL);
    # set WVS_CHROME=/path/to/chrome to use another one
    return os.environ.get('WVS_CHROME') or None

async def wait_slots(host, want, limit):
    """seconds until the host shows `want` phone slots, or None"""
    t0 = time.time()
    while time.time() - t0 < limit:
        if (await host.evaluate(SLOTS))['n'] == want: return round(time.time() - t0, 1)
        await host.wait_for_timeout(250)
    return None

async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
                                                                  '--disable-features=WebRtcHideLocalIpsWithMdns'])
        ctx = await b.new_context(viewport={'width': 1100, 'height': 650})
        await ctx.route('**/three.min.js', lambda r: r.fulfill(body=THREE, content_type='application/javascript'))
        await ctx.route('**/peerjs.min.js', lambda r: r.fulfill(body=PEERJS + WRAP, content_type='application/javascript'))
        errs = []
        def watch(pg, tag): pg.on('pageerror', lambda e: errs.append(tag + ': ' + str(e)))

        # 1. host opens a room
        host = await ctx.new_page(); watch(host, 'host')
        await host.goto(BASE); await host.wait_for_timeout(1200)
        await host.click('#goParty'); await host.click('#goHost'); await host.click('#start')
        code = None
        for _ in range(40):
            await host.wait_for_timeout(250)
            c = await host.evaluate("document.getElementById('partyCode').textContent")
            if c.isdigit(): code = c; break
        check('1. host opens a room', bool(code), code)
        if not code: await b.close(); return
        qr = BASE + '?room=' + code

        # 2. a phone connects (via the QR link)
        pad = await ctx.new_page(); watch(pad, 'phone1')
        await pad.goto(qr)
        t = await wait_slots(host, 1, 10)
        check('2. phone connects and the host shows it', t is not None, '%ss' % t)

        # 3. leaving frees the slot right away
        await pad.evaluate('leavePad()')
        t = await wait_slots(host, 0, 14)
        check('3. phone leaves -> slot freed fast', t is not None and t <= 3, '%ss' % t)
        await pad.close()

        # 4. double tap on 連線 -> exactly one player
        pad = await ctx.new_page(); watch(pad, 'phone2')
        await pad.goto(BASE); await pad.wait_for_timeout(1200)
        await pad.click('#asPad'); await pad.fill('#codeIn', code)
        await pad.dblclick('#joinBtn')
        await wait_slots(host, 1, 10); await host.wait_for_timeout(3000)
        n = (await host.evaluate(SLOTS))['n']
        check('4. double tap on 連線 -> one player, no ghost', n == 1, 'slots=%d' % n)
        await pad.close()
        await wait_slots(host, 0, 8)

        # 5. a phone that goes silent (page frozen, link still open) is dropped by the heartbeat timeout
        pad = await ctx.new_page(); watch(pad, 'phone3')
        await pad.goto(qr)
        await wait_slots(host, 1, 10)
        await pad.evaluate('party.room.presence=()=>Promise.resolve()')   # no more heartbeats
        t = await wait_slots(host, 0, 20)
        check('5. silent phone is dropped after ~10 s', t is not None and t <= 16, '%ss' % t)
        await pad.close()

        # 6. QR page while connecting: waiting picture, no form; cancel leaves no ghost
        pad = await ctx.new_page(); watch(pad, 'phone4'); await pad.add_init_script(slow(4000))
        await pad.goto(qr); await pad.wait_for_timeout(1500)
        st = await pad.evaluate("""()=>({auto:document.getElementById('joinUI').classList.contains('auto'),
          pic:!!document.querySelector('#waitPic canvas'), input:getComputedStyle(document.getElementById('codeIn')).display,
          btn:getComputedStyle(document.getElementById('joinBtn')).display, h:document.getElementById('joinH').textContent})""")
        check('6a. QR page shows the waiting picture and no form', st['auto'] and st['pic'] and st['input'] == 'none' and st['btn'] == 'none' and code in st['h'], st)
        await pad.click('#joinBack')
        t = await wait_slots(host, 1, 9)
        check('6b. cancel while connecting leaves no ghost', t is None, 'slots appeared after %ss' % t if t is not None else '')
        await pad.close()

        # 7. phone taps 再來一局, then the screen goes back to character select: the phone must be free to pick again
        TRACK = "window.__pcs=[];(function(){var O=RTCPeerConnection;window.RTCPeerConnection=function(a,b){var p=new O(a,b);window.__pcs.push(p);return p;};window.RTCPeerConnection.prototype=O.prototype;})();"
        pad = await ctx.new_page(); watch(pad, 'phone5'); await pad.add_init_script(TRACK)
        await pad.goto(qr)
        await wait_slots(host, 1, 10); await host.wait_for_timeout(800)
        slot = await host.evaluate("party.slots.findIndex(Boolean)")
        await host.evaluate("()=>{ startGame(); G.winner=G.fighters[0]; showOver(); }")
        await pad.wait_for_timeout(1500)
        await pad.evaluate("document.getElementById('padStart').click()")
        await host.wait_for_timeout(400)
        await host.evaluate("enterSelect()")
        await host.wait_for_timeout(2500)
        st = await host.evaluate("(s)=>({mode:G.mode, ready:SEL.ready[s]})", slot)
        lock = await pad.evaluate("document.getElementById('padSelBox').classList.contains('lock')")
        check('7a. after 再來一局 + back to select, phone is not stuck as ready', st['mode'] == 'select' and not st['ready'] and not lock, dict(st, lock=lock))
        want = await host.evaluate("(s)=>CHAR_ORDER.find(k=>k!==sel.p[s])", slot)
        await pad.evaluate("(k)=>document.querySelector('[data-pick=\"'+k+'\"]').click()", want)
        await host.wait_for_timeout(1500)
        got = await host.evaluate("(s)=>sel.p[s]", slot)
        check('7b. phone can change its character there', got == want, '%s -> %s' % (want, got))

        # 8. phone P1 picks a computer player's costume (tapping the costume before 決定 too)
        await pad.evaluate("document.getElementById('padGo').click()")   # 準備好了
        await host.wait_for_timeout(1200)
        cpu = await host.evaluate("activeSlot()")
        k = await host.evaluate("CHAR_ORDER.find(k=>skinCount(k)>1 && k!==sel.p[%d])" % max(cpu, 0))
        if cpu >= 1 and k:
            await pad.evaluate("(k)=>document.querySelector('[data-pick=\"'+k+'\"]').click()", k); await pad.wait_for_timeout(500)
            await pad.evaluate("document.getElementById('padSkins').children[1].click()"); await pad.wait_for_timeout(500)
            await pad.evaluate("document.getElementById('padGo').click()"); await host.wait_for_timeout(1200)   # 決定電腦 -> costume step
            await pad.evaluate("document.getElementById('padGo').click()"); await host.wait_for_timeout(1200)   # 決定造型
            r = await host.evaluate("(c)=>({p:sel.p[c], skin:sel.skin[c], ready:SEL.ready[c], mode:G.mode})", cpu)
            check('8. phone picks the computer player\'s costume', r['p'] == k and r['skin'] == 1 and (r['ready'] or r['mode'] == 'mapsel'), r)
        else:
            check('8. phone picks the computer player\'s costume', False, 'no CPU turn (act=%s) or no character with costumes' % cpu)

        # 9. the phone's link drops (screen sleep / Wi-Fi hiccup): it reconnects by itself, no code needed
        await pad.evaluate("window.__pcs.forEach(p=>{try{p.close()}catch(e){}})")
        await pad.wait_for_timeout(300)
        down = await pad.evaluate("!party.room.linked()")
        t0, ok, who = time.time(), False, ''
        while time.time() - t0 < 15:
            await pad.wait_for_timeout(500)
            who = await pad.evaluate("document.getElementById('padSlot').textContent")
            if await pad.evaluate("party.room.linked()") and who.startswith('P') and (await host.evaluate(SLOTS))['n'] == 1: ok = True; break
        check('9. dropped phone link reconnects by itself', down and ok, 'link went down=%s, back after %.1fs, phone shows %s' % (down, time.time() - t0, who))
        await pad.close()

        check('no page errors', not errs, errs[:3] if errs else '')
        await b.close()

try:
    asyncio.run(main())
finally:
    peer_proc.terminate(); web_proc.terminate()
print('\n%d/%d passed' % (sum(RESULTS), len(RESULTS)))
sys.exit(0 if RESULTS and all(RESULTS) else 1)
