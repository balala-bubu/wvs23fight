// 背景音樂 — one looping AudioBufferSourceNode, routed through core's `master` gain (so the iOS mute-switch / TV tricks in audioOn() still apply).
// Track choice is derived from G.mode + curMap; core only calls Music.sync() in applyMap / enterMapSel / startGame / toMenu to make switches instant
// (a 250 ms poll covers everything else: pause ducking, fade-out on the results screen, first tap unlocking audio).

// 地圖代號 → mp3 檔名（放在 audio/）。沒列的地圖、或檔案還沒上傳的 → 不播（MUSIC_DEFAULT 想要預設曲就填檔名）
const MUSIC = {
  lobby:     'lobby.mp3',      // 大廳／選角／標題
  amusement: 'amusement.mp3',  // 遊樂園
  dayu:      'school.mp3',     // 兩所國小共用
  qimei:     'school.mp3',
  mecls:     'mecls.mp3',      // 承先教室
  park:      'park.mp3',       // 秋日公園
  ntu:       'ntu.mp3',        // 台大總圖
  maogong:   'maogong.mp3',    // 貓公部落
  sea:       'sea.mp3',        // 海底王國
  space:     'space.mp3',      // 太空戰場
  india:     'maogong.mp3'     // 印度街頭（暫時沿用）
};
const MUSIC_DEFAULT = null;

const Music = (()=>{
  const DIR = 'audio/', VOL = 0.35, PAUSE_K = 0.35, FADE = 0.25, FADE_END = 0.8, KEY = 'wvs_music_muted';
  let muted = false;
  try{ muted = localStorage.getItem(KEY) === '1'; }catch(_){}
  let ctx = null, gain = null, src = null, cur = null;      // cur = file currently playing (or being faded out)
  let bufFile = null, buf = null;                           // only the current track stays decoded
  const bad = {};                                           // file -> time of last failed load (retry after 20 s)
  let token = 0, busy = false;

  function want(){
    const m = G.mode;
    if (m === 'pad' || m === 'result') return null;
    const id = m === 'play' ? curMap : 'lobby';
    return (id in MUSIC) ? MUSIC[id] : (MUSIC_DEFAULT || null);
  }
  function target(){ return muted ? 0 : VOL * (G.paused ? PAUSE_K : 1); }
  function ramp(to, sec){
    if (!gain || !ctx) return;
    const t = ctx.currentTime, g = gain.gain;
    try{ g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + Math.max(.01, sec)); }catch(_){ g.value = to; }
  }
  function killSrc(){
    if (src){ try{ src.onended = null; src.stop(); }catch(_){} try{ src.disconnect(); }catch(_){} }
    src = null; cur = null;
  }
  const wait = (ms)=>new Promise(r=>setTimeout(r, ms));
  async function load(file, c){
    if (bufFile === file && buf) return buf;
    if (bad[file] && performance.now() - bad[file] < 20000) return null;
    try{
      const r = await fetch(DIR + file + (typeof V === 'string' ? V : ''));
      if (!r.ok) throw new Error(r.status);
      const ab = await r.arrayBuffer();
      const b = await new Promise((res, rej)=>{ const p = c.decodeAudioData(ab, res, rej); if (p && p.catch) p.catch(rej); });
      bufFile = file; buf = b; return b;
    }catch(e){ bad[file] = performance.now(); return null; }
  }
  async function step(){
    if (busy) return; busy = true;
    try{
      if (typeof AC === 'undefined' || !AC || !master || AC.state !== 'running') return;
      if (ctx !== AC){ killSrc(); gain = null; ctx = AC; }   // audio context was (re)created → rebuild
      const f = want();
      if (!gain){ gain = ctx.createGain(); gain.gain.value = 0; gain.connect(master); }
      if (f && f === cur && src){ ramp(target(), .3); return; }   // same track: just follow mute / pause
      const my = ++token;
      if (src){                                                    // fade the old one out first
        ramp(0, f ? FADE : FADE_END); await wait((f ? FADE : FADE_END) * 1000 + 20);
        if (my !== token || ctx !== AC) return;
        killSrc();
      }
      if (!f) return;
      if (buf && bufFile !== f){ buf = null; bufFile = null; }    // drop the previous decode before loading the next
      const b = await load(f, ctx);
      if (!b || my !== token || ctx !== AC || want() !== f) return;
      src = ctx.createBufferSource(); src.buffer = b; src.loop = true; src.connect(gain);
      gain.gain.cancelScheduledValues(ctx.currentTime); gain.gain.setValueAtTime(0, ctx.currentTime);
      src.start(0); cur = f; ramp(target(), FADE);
    }catch(e){ /* music must never break the game */ }
    finally{ busy = false; }
  }
  function sync(){ try{ step(); }catch(_){} }

  // mute button (top right, remembered in localStorage)
  let btn = null;
  function paint(){ if (btn){ btn.textContent = muted ? '🔇' : '🔊'; btn.title = muted ? '開啟音樂' : '關閉音樂'; btn.setAttribute('aria-label', btn.title); btn.setAttribute('aria-pressed', muted ? 'true' : 'false'); } }
  function toggle(){
    muted = !muted; try{ localStorage.setItem(KEY, muted ? '1' : '0'); }catch(_){}
    paint(); ramp(target(), .2); sync();
  }
  function mkBtn(){
    const st = document.createElement('style');
    st.textContent = '#musicBtn{position:fixed;z-index:60;top:calc(env(safe-area-inset-top,0px) + 10px);right:calc(env(safe-area-inset-right,0px) + 10px);width:36px;height:36px;padding:0;border-radius:50%;background:rgba(20,15,12,.6);border:1px solid var(--line,#555);color:#fff;font-size:17px;line-height:34px;text-align:center;cursor:pointer;opacity:.75;-webkit-tap-highlight-color:transparent}#musicBtn:hover{opacity:1}';
    document.head.appendChild(st);
    btn = document.createElement('button'); btn.id = 'musicBtn'; btn.type = 'button'; btn.tabIndex = -1;
    btn.onclick = (e)=>{ e.stopPropagation(); toggle(); btn.blur(); };
    document.body.appendChild(btn); paint();
  }
  mkBtn();
  setInterval(()=>{ if (btn) btn.hidden = G.mode === 'pad'; sync(); }, 250);
  return { sync, toggle, get muted(){ return muted; } };
})();
