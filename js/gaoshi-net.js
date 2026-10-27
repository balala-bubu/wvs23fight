/* 世志土木 — online rooms over PeerJS, the 阿瓦隆 way: every device shows the whole game and plays one character;
 * the room host runs the rules. No screen sharing. 4-digit room code, QR and ?room= link. */
'use strict';
var GaoshiNet = (function(){
  const PREFIX = 'wvs-gaoshi-v1-', V = 1;
  function peerOptions(){
    // ?peerhost=127.0.0.1&peerport=9000 points at a local PeerJS server (used by the automated test)
    const q = new URLSearchParams(location.search), o = {};
    if (q.get('peerhost')){ o.host = q.get('peerhost'); o.port = +q.get('peerport') || 9000; o.path = q.get('peerpath') || '/'; o.secure = false; }
    return Object.assign(o, window.GAOSHI_PEER_OPTIONS || {});
  }
  function available(){
    if (typeof Peer === 'undefined') return '連線元件沒有載入，請確認網路後重新整理';
    if (typeof RTCPeerConnection === 'undefined') return '這個瀏覽器（或預覽視窗）不支援連線，請用正式網址開啟';
    return '';
  }
  const newCode = ()=> String(1000 + crypto.getRandomValues(new Uint32Array(1))[0] % 9000);
  const pack = (m)=> Object.assign({v:V}, m);

  // host: on.open(code), on.data(peerId, msg), on.leave(peerId), on.error(text)
  function host(on){
    const net = {role:'host', code:'', links:new Map(), peer:null, closed:false};
    let tries = 0;
    function start(){
      net.code = newCode();
      const peer = new Peer(PREFIX + net.code, peerOptions()); net.peer = peer;
      peer.on('open', ()=>on.open(net.code));
      peer.on('error', (e)=>{ if (e.type === 'unavailable-id' && tries++ < 5){ peer.destroy(); start(); } else if (!net.closed) on.error('開房失敗（' + e.type + '），請重新試一次'); });
      peer.on('connection', (c)=>{
        c.on('open', ()=>net.links.set(c.peer, c));
        c.on('data', (m)=>{ if (m && m.v === V) on.data(c.peer, m); });
        c.on('close', ()=>{ if (net.links.delete(c.peer)) on.leave(c.peer); });
        c.on('error', ()=>{ if (net.links.delete(c.peer)) on.leave(c.peer); });
      });
    }
    net.send = (id, m)=>{ const c = net.links.get(id); if (c && c.open) c.send(pack(m)); };
    net.broadcast = (m)=>{ const p = pack(m); for (const c of net.links.values()) if (c.open) c.send(p); };
    net.close = ()=>{ net.closed = true; for (const c of net.links.values()) try { c.close(); } catch(_){} if (net.peer) net.peer.destroy(); };
    start(); return net;
  }
  // guest: on.open(myId), on.data(msg), on.lost(), on.error(text)
  function join(code, on){
    const net = {role:'guest', code, peer:null, conn:null, closed:false};
    const peer = new Peer(peerOptions()); net.peer = peer;
    const timer = setTimeout(()=>{ if (!net.conn || !net.conn.open){ on.error('連不上房號 ' + code + '，請確認房號後再試'); net.close(); } }, 15000);
    peer.on('open', (id)=>{
      const c = peer.connect(PREFIX + code, {reliable:true, serialization:'json'}); net.conn = c;
      c.on('open', ()=>{ clearTimeout(timer); on.open(id); });
      c.on('data', (m)=>{ if (m && m.v === V) on.data(m); });
      c.on('close', ()=>{ if (!net.closed) on.lost(); });
    });
    peer.on('error', (e)=>{ clearTimeout(timer); if (!net.closed) on.error(e.type === 'peer-unavailable' ? '找不到房號 ' + code + '，請確認房主已經開房' : '連線失敗（' + e.type + '）'); });
    net.send = (m)=>{ if (net.conn && net.conn.open) net.conn.send(pack(m)); };
    net.close = ()=>{ net.closed = true; clearTimeout(timer); try { if (net.conn) net.conn.close(); } catch(_){} peer.destroy(); };
    return net;
  }
  function joinURL(code){ const u = new URL(location.href); u.search = ''; u.hash = ''; u.searchParams.set('room', code); return u.href; }
  function drawQR(canvas, text){
    if (typeof qrcode !== 'function' || !canvas) return false;
    const qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    const n = qr.getModuleCount(), px = 5, quiet = 3, g = canvas.getContext('2d'); canvas.width = canvas.height = (n + quiet*2) * px;
    g.fillStyle = '#fff'; g.fillRect(0, 0, canvas.width, canvas.height); g.fillStyle = '#120e0c';
    for (let r=0;r<n;r++) for (let c=0;c<n;c++) if (qr.isDark(r, c)) g.fillRect((c+quiet)*px, (r+quiet)*px, px, px);
    return true;
  }
  return { host, join, available, joinURL, drawQR };
})();
