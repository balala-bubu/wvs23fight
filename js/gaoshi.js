/* 世志搞事 — game flow, input and HUD.
 * Flow follows 世志大亂鬥: title → character (+ costume) select → map select → match → results.
 * A match is rounds of PICK → PLACE → RACE → SCORE (PLAN.md §6). */
'use strict';
var GaoshiGame = (function(){
  const PH = GaoshiPhysics, RL = GaoshiRules, ART = GaoshiArt, $ = (id)=>document.getElementById(id);
  const COLORS = ['#ff7a3d','#4fa3ff','#5fd36a','#d070e0'], COLOR_N = [0xff7a3d, 0x4fa3ff, 0x5fd36a, 0xd070e0];
  const WX = ART.WX, WY = ART.WY, MODEL_H = 2.15, SEL_H = 6.2;
  const RU = RL.RULES;

  // ---------- sound ----------
  let AC = null;
  function audio(){ if (!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(_){} } if (AC && AC.state !== 'running') AC.resume().catch(()=>{}); }
  function beep(f, d, type='square', vol=.08, slide=0, when=0){
    if (!AC) return; const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
  }
  function noise(d, vol){ if (!AC) return; const b = AC.createBuffer(1, AC.sampleRate*d, AC.sampleRate), a = b.getChannelData(0); for (let i=0;i<a.length;i++) a[i] = (Math.random()*2-1) * (1 - i/a.length);
    const s = AC.createBufferSource(), g = AC.createGain(); s.buffer = b; g.gain.value = vol; s.connect(g).connect(AC.destination); s.start(); }
  const SND = {
    jump:()=>beep(420,.12,'square',.05,380), wall:()=>beep(620,.12,'square',.05,420), land:()=>beep(140,.07,'triangle',.07,-40),
    die:()=>beep(520,.45,'sawtooth',.06,-420), goal:()=>{ [523,659,784,1047].forEach((f,i)=>beep(f,.18,'square',.06,0,i*.09)); },
    tick:()=>beep(880,.06,'square',.05), go:()=>beep(1175,.25,'square',.07), pick:()=>beep(660,.06,'triangle',.08), no:()=>beep(180,.15,'square',.06,-60),
    place:()=>{ beep(300,.08,'triangle',.09,-120); beep(520,.06,'square',.04,0,.06); }, boom:()=>{ noise(.6,.35); beep(90,.5,'sawtooth',.12,-60); },
    coin:()=>{ beep(988,.08,'square',.05); beep(1319,.18,'square',.05,0,.08); }, award:(k)=>beep(523 + k*90,.12,'square',.05),
  };

  // ---------- fighters ----------
  // bounding box of what is actually shown (props held for brawl moves stay hidden and must not count)
  function visibleBox(obj){ const box = new THREE.Box3(), b = new THREE.Box3(); obj.updateMatrixWorld(true);
    obj.traverseVisible(o=>{ if (o.isMesh && o.geometry){ if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); b.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); box.union(b); } }); return box; }
  function makeFighterModel(kind, height, skin){
    const m = makeModel(kind, skin || 0);
    const box = visibleBox(m.body), size = box.getSize(new THREE.Vector3());
    m.body.position.y -= box.min.y; m.baseScale = height / Math.max(.5, size.y);
    m.holder.scale.setScalar(m.baseScale); m.sx = 1; m.sy = 1; m.phase = 0;
    return m;
  }
  // select-screen portraits: render each character's real head (with costume) once into a small image
  const PORT = {}; let portR = null, portScene = null, portCam = null;
  function portrait(kind, skin){
    const key = kind + ':' + (skin||0); if (PORT[key]) return PORT[key];
    try {
      if (!portR){
        const cv = document.createElement('canvas'); cv.width = cv.height = 128;
        portR = new THREE.WebGLRenderer({canvas:cv, antialias:true, alpha:true, preserveDrawingBuffer:true}); portR.outputEncoding = THREE.sRGBEncoding; portR.setClearColor(0x000000, 0);
        portScene = new THREE.Scene(); portScene.add(new THREE.HemisphereLight(0xfff0e0, 0x504038, 1)); const l = new THREE.DirectionalLight(0xffffff, .7); l.position.set(-3, 4, 6); portScene.add(l);
        portCam = new THREE.PerspectiveCamera(28, 1, .05, 100);
      }
      const m = makeModel(kind, skin || 0); scene.remove(m.holder); portScene.add(m.holder);
      applyPose(m, POSE.stand, 1); m.holder.rotation.y = .28; m.holder.updateMatrixWorld(true);
      // frame on the face block itself so long hair, hats or props never shrink the face
      const face = m.head && m.head.children[0] ? m.head.children[0] : m.body;
      const box = visibleBox(face), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
      const span = sz.y * 1.9, dist = span / (2 * Math.tan(portCam.fov * Math.PI / 360));
      c.y += sz.y * .08; portCam.position.set(c.x, c.y, c.z + dist); portCam.lookAt(c);
      portR.render(portScene, portCam); PORT[key] = portR.domElement.toDataURL('image/png');
      portScene.remove(m.holder);
    } catch(e){ console.warn('portrait', kind, e); PORT[key] = ''; }
    return PORT[key];
  }
  function portraitEl(kind, skin){ const im = new Image(); im.alt = ''; im.className = 'por'; const src = portrait(kind, skin); if (src) im.src = src; return im; }
  const disposeModel = (m)=>{ if (m && m.holder) scene.remove(m.holder); };
  const charName = (k)=> (CHARS[k] && CHARS[k].stats && CHARS[k].stats.name) || k;
  const charTag = (k)=> (CHARS[k] && CHARS[k].stats && CHARS[k].stats.tag) || '';
  const setFace = (m, f)=>{ if (m.setFace) try { m.setFace(f); } catch(_){} };
  // sliding down a wall: one hand on the wall, knees up (no ledge-grab pose — there is no ledge assist)
  const WALL_POSE = P({rSh:[-1.5,0,-.25], rEl:[-.5], lSh:[-.5,0,.35], lEl:[-.9], rHp:[-.55,0,-.05], rKn:[.9], lHp:[.1], lKn:[.35], chest:[.1], head:[.05]});

  // ---------- input ----------
  const keys = new Set(); let pressed = [];
  const BIND = [
    {left:['KeyA'], right:['KeyD'], up:['KeyW'], down:['KeyS'], jump:['KeyW','Space'], run:['ShiftLeft'], crouch:['KeyS'], ok:['Space','KeyW'], back:['KeyS','Escape'], place:['Space','KeyF'], rot:['KeyE'], rotL:['KeyQ']},
    {left:['ArrowLeft'], right:['ArrowRight'], up:['ArrowUp'], down:['ArrowDown'], jump:['ArrowUp','Enter','NumpadEnter'], run:['ShiftRight'], crouch:['ArrowDown'], ok:['ArrowUp','Enter','NumpadEnter'], back:['ArrowDown'], place:['Enter','NumpadEnter','Slash'], rot:['Period','ShiftRight'], rotL:['Comma']},
  ];
  const sets = (i)=> S.players === 1 && i === 0 ? [BIND[0], BIND[1]] : [BIND[i]];
  const held = (i, a)=> sets(i).some(b=>b[a].some(k=>keys.has(k)));
  const is = (i, a, code)=> sets(i).some(b=>b[a].includes(code));
  function readInput(i){ const o = {}; for (const a of ['left','right','jump','run','crouch']) o[a] = held(i, a); return o; }
  addEventListener('keydown', (e)=>{
    audio(); if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    if (S.mode !== 'title' && ['Space','Enter','NumpadEnter'].includes(e.code) && !(e.target && e.target.closest && e.target.closest('.sheet'))) e.preventDefault();
    if (!e.repeat) pressed.push(e.code); keys.add(e.code);
  });
  addEventListener('keyup', (e)=>keys.delete(e.code));
  addEventListener('blur', ()=>keys.clear());
  addEventListener('pointerdown', audio);

  // ---------- state ----------
  const S = { mode:'title', players:2, kinds:[], skins:[], stage:[], cur:[], mapId:'rooftops', mapPick:0, models:[],
    items:[], scores:{}, streak:{}, zero:0, round:0, world:null, box:[], picks:[], focus:[], placed:[], cursor:[], ghosts:[], timer:0, after:0,
    time:0, endT:0, count:0, acc:0, rand:Math.random };
  const SCREENS = ['scrTitle','scrSelect','scrMap','scrPick','scrScore','scrPause','scrResult'];
  const MATCH = ['pick','place','race','score','over','pause'];
  function show(id){ for (const s of SCREENS) $(s).hidden = s !== id; $('hud').hidden = !MATCH.includes(S.mode); $('tags').hidden = !['pick','place','race'].includes(S.mode); }
  function flash(text, color){ const d = document.createElement('div'); d.className = 'flash'; d.textContent = text; if (color) d.style.color = color; $('flashBox').replaceChildren(d); setTimeout(()=>{ if (d.parentNode) d.remove(); }, 1300); }
  function clearModels(){ S.models.forEach(disposeModel); S.models = []; $('tags').replaceChildren(); }

  // ---------- title ----------
  function enterTitle(){ S.mode = 'title'; clearModels(); clearGhosts(); const m = GaoshiMaps.byId.rooftops; ART.buildMap(m); show('scrTitle'); }

  // ---------- character + costume select (like 世志大亂鬥) ----------
  const ROSTER = ()=>[...CHAR_ORDER, 'random'];
  function enterSelect(){
    S.mode = 'select'; clearModels(); clearGhosts(); show('scrSelect');
    const R0 = ROSTER();
    for (let i=0;i<S.players;i++){
      if (!CHARS[S.kinds[i]]) S.kinds[i] = CHAR_ORDER[i % CHAR_ORDER.length];
      S.cur[i] = R0.indexOf(S.kinds[i]); S.stage[i] = 'char'; S.skins[i] = S.skins[i] || 0;
    }
    S.kinds.length = S.skins.length = S.stage.length = S.cur.length = S.players;
    for (let i=0;i<S.players;i++) S.models[i] = makeFighterModel(S.kinds[i], SEL_H, S.skins[i]);
    renderSelect();
  }
  const active = ()=> S.stage.findIndex(s=>s !== 'ready');
  function rebuild(i){ disposeModel(S.models[i]); S.models[i] = makeFighterModel(S.kinds[i], SEL_H, S.skins[i]); }
  function moveChar(i, d){
    const R0 = ROSTER(); S.cur[i] = (S.cur[i] + d + R0.length) % R0.length; const k = R0[S.cur[i]];
    if (k !== 'random' && k !== S.kinds[i]){ S.kinds[i] = k; S.skins[i] = 0; rebuild(i); }
    SND.pick(); renderSelect();
  }
  function moveSkin(i, d){ const n = skinCount(S.kinds[i]); S.skins[i] = (S.skins[i] + d + n) % n; rebuild(i); SND.pick(); renderSelect(); }
  function confirmSel(i){
    const k = ROSTER()[S.cur[i]];
    if (S.stage[i] === 'char'){
      if (k === 'random'){ const pool = CHAR_ORDER, r = pool[Math.floor(Math.random()*pool.length)]; S.kinds[i] = r; S.skins[i] = Math.floor(Math.random()*skinCount(r)); rebuild(i); S.stage[i] = 'ready'; }
      else S.stage[i] = skinCount(k) > 1 ? 'skin' : 'ready';
    } else if (S.stage[i] === 'skin') S.stage[i] = 'ready';
    SND.pick(); renderSelect();
    if (S.stage.every(s=>s === 'ready')) setTimeout(()=>{ if (S.mode === 'select' && S.stage.every(s=>s === 'ready')) enterMap(); }, 450);
  }
  function backSel(i){
    if (S.stage[i] === 'ready') S.stage[i] = (ROSTER()[S.cur[i]] !== 'random' && skinCount(S.kinds[i]) > 1) ? 'skin' : 'char';
    else if (S.stage[i] === 'skin') S.stage[i] = 'char';
    else if (i === 0) return enterTitle();
    SND.pick(); renderSelect();
  }
  function renderSelect(){
    const a = active(), skinStep = a >= 0 && S.stage[a] === 'skin';
    const roster = $('roster'), skins = $('skins'); roster.hidden = skinStep; skins.hidden = !skinStep;
    $('selH').textContent = skinStep ? 'P' + (a+1) + ' 選造型' : '選角色';
    if (!skinStep){
      roster.replaceChildren();
      ROSTER().forEach((k, j)=>{ const b = document.createElement('button'); b.className = 'rc' + (k === 'random' ? ' rnd' : ''); b.setAttribute('aria-label', k === 'random' ? '隨機' : charName(k));
        if (k === 'random'){ const q = document.createElement('div'); q.className = 'por q'; q.textContent = '?'; b.appendChild(q); } else b.appendChild(portraitEl(k, 0));
        const nm = document.createElement('span'); nm.className = 'cn'; nm.textContent = k === 'random' ? '隨機' : charName(k); b.appendChild(nm);
        const mk = document.createElement('span'); mk.className = 'mk';
        S.cur.forEach((c,i)=>{ if (c === j){ const t = document.createElement('i'); t.textContent = 'P' + (i+1); t.style.background = COLORS[i]; mk.appendChild(t); b.style.borderColor = COLORS[i]; } });
        b.appendChild(mk);
        b.onclick = ()=>{ const i = active(); if (i < 0) return; if (S.cur[i] === j) confirmSel(i); else { moveChar(i, j - S.cur[i]); } };
        roster.appendChild(b); });
    } else {
      skins.replaceChildren(); const k = S.kinds[a], n = skinCount(k);
      for (let s=0;s<n;s++){ const b = document.createElement('button'); b.className = 'rc' + (s === S.skins[a] ? ' on' : ''); b.style.setProperty('--pc', COLORS[a]); b.appendChild(portraitEl(k, s)); const sn = document.createElement('span'); sn.className = 'cn'; sn.textContent = skinName(k, s); b.appendChild(sn);
        b.onclick = ()=>{ if (S.skins[a] === s) confirmSel(a); else moveSkin(a, s - S.skins[a]); }; skins.appendChild(b); }
      const ok = document.createElement('button'); ok.className = 'rc okb'; ok.textContent = '決定造型'; ok.onclick = ()=>confirmSel(a); skins.appendChild(ok);
    }
    const plates = $('plates'); plates.replaceChildren();
    S.kinds.forEach((k,i)=>{ const d = document.createElement('div'); d.className = 'plate' + (S.stage[i] === 'ready' ? ' ready' : ''); d.style.setProperty('--pc', COLORS[i]);
      d.innerHTML = '<div class="who"></div><div class="nm"></div><div class="tag"></div><div class="st"></div>';
      const isRnd = ROSTER()[S.cur[i]] === 'random' && S.stage[i] === 'char';
      d.querySelector('.who').textContent = 'P' + (i+1); d.querySelector('.nm').textContent = isRnd ? '？' : charName(k);
      d.querySelector('.tag').textContent = isRnd ? '隨機挑一個人和造型' : (S.skins[i] ? '造型：' + skinName(k, S.skins[i]) : charTag(k));
      const keysTxt = i === 0 ? ['A / D', 'W', 'S'] : ['← / →', '↑', '↓'];
      d.querySelector('.st').textContent = S.stage[i] === 'ready' ? '準備好了！（' + keysTxt[2] + ' 取消）' : S.stage[i] === 'skin' ? keysTxt[0] + ' 換造型　' + keysTxt[1] + ' 決定　' + keysTxt[2] + ' 返回' : keysTxt[0] + ' 換人　' + keysTxt[1] + ' 決定';
      plates.appendChild(d); });
  }
  function selectKeys(code){
    for (let i=0;i<S.players;i++){
      const b = BIND[i];
      if (S.stage[i] === 'char'){ if (b.left.includes(code)) moveChar(i, -1); if (b.right.includes(code)) moveChar(i, 1); }
      if (S.stage[i] === 'skin'){ if (b.left.includes(code)) moveSkin(i, -1); if (b.right.includes(code)) moveSkin(i, 1); }
      if (b.ok.includes(code) && S.stage[i] !== 'ready') confirmSel(i);
      else if (b.back.includes(code) && code !== 'Escape') backSel(i);
    }
    if (code === 'Escape') enterTitle();
  }

  // ---------- map select ----------
  const MAP_CARDS = ()=>[...GaoshiMaps.LIST.map(m=>m.id), 'random'];
  function mapThumb(map){
    const cv = document.createElement('canvas'), k = 6; cv.width = 32*k; cv.height = 18*k; const g = cv.getContext('2d');
    const hx = (n)=>'#' + n.toString(16).padStart(6,'0'); const gr = g.createLinearGradient(0,0,0,cv.height); gr.addColorStop(0, hx(map.sky[0])); gr.addColorStop(1, hx(map.sky[1])); g.fillStyle = gr; g.fillRect(0,0,cv.width,cv.height);
    const C = {'#':'#8b92a1', C:'#a04a3a', G:'#6f9a4a', B:'#a8382e', T:'#3f8f3a', M:'#7d7f86', P:'#8a6038', O:'#b9bec4', F:'#f2c14e'};
    map.grid.forEach((row,y)=>[...row].forEach((c,x)=>{ if ('.S'.includes(c)) return; g.fillStyle = C[c] || '#888'; g.fillRect(x*k, y*k, k, k); }));
    return cv;
  }
  function enterMap(){
    S.mode = 'map'; clearModels(); clearGhosts(); show('scrMap');
    const box = $('maps'); box.replaceChildren();
    MAP_CARDS().forEach((id, j)=>{ const b = document.createElement('button'); b.className = 'mapc';
      if (id === 'random'){ const q = document.createElement('div'); q.className = 'q'; q.textContent = '?'; b.appendChild(q); } else b.appendChild(mapThumb(GaoshiMaps.byId[id]));
      const t = document.createElement('b'); t.textContent = id === 'random' ? '隨機' : GaoshiMaps.byId[id].name; b.appendChild(t);
      b.onclick = ()=>{ S.mapPick = j; startMatch(); }; box.appendChild(b); });
    markMap();
  }
  function markMap(){ [...$('maps').children].forEach((b,j)=>b.classList.toggle('on', j === S.mapPick)); const id = MAP_CARDS()[S.mapPick]; if (id !== 'random') ART.buildMap(GaoshiMaps.byId[id]); }
  function mapKeys(code){
    const n = MAP_CARDS().length;
    if (code === 'KeyA' || code === 'ArrowLeft'){ S.mapPick = (S.mapPick - 1 + n) % n; markMap(); SND.pick(); }
    if (code === 'KeyD' || code === 'ArrowRight'){ S.mapPick = (S.mapPick + 1) % n; markMap(); SND.pick(); }
    if (['KeyW','Space','Enter','ArrowUp'].includes(code)) startMatch();
    if (code === 'Escape' || code === 'KeyS' || code === 'ArrowDown') enterSelect();
  }

  // ---------- match ----------
  function startMatch(){
    let id = MAP_CARDS()[S.mapPick]; if (id === 'random') id = GaoshiMaps.LIST[Math.floor(Math.random()*GaoshiMaps.LIST.length)].id;
    S.mapId = id; ART.buildMap(GaoshiMaps.byId[id]); clearModels(); clearGhosts();
    S.items = []; S.scores = {}; S.segs = {}; S.streak = {}; S.zero = 0; S.round = 0;
    for (let i=0;i<S.players;i++){ S.scores[i] = 0;
      const m = makeFighterModel(S.kinds[i], MODEL_H, S.skins[i]); S.models[i] = m;
      const t = document.createElement('div'); t.className = 'tagl'; t.style.setProperty('--pc', COLORS[i]); t.textContent = 'P' + (i+1); $('tags').appendChild(t); m.tag = t; }
    nextRound();
  }
  function freshWorld(){
    const w = PH.makeWorld(GaoshiMaps.byId[S.mapId]); w.items = S.items;
    for (const it of S.items) if (it.type === 'coin'){ it.carrier = undefined; it.cx = it.x + .5; it.cy = it.y + .5; }
    for (let i=0;i<S.players;i++){ const p = PH.addPlayer(w, i); p.px = p.x; p.py = p.y; const m = S.models[i]; m.holder.visible = true; m.holder.rotation.set(0, 0, 0); setFace(m, 'normal'); }
    return w;
  }
  const phaseLabel = (t)=>{ $('phaseName').textContent = '第 ' + S.round + ' 回合 · ' + t; };
  function nextRound(){
    S.round++; S.world = freshWorld(); ART.syncItems(S.items, COLOR_N); ART.placeOverlay(false);
    S.box = RL.partyBox(S.rand, {guaranteeBomb: S.zero >= 2}).map(id=>({id, takers:[]}));
    S.picks = Array(S.players).fill(null); S.after = 0;
    S.mode = 'pick'; S.timer = RU.pickTimeSec; show('scrPick'); phaseLabel('選道具'); renderChips(); enterPickUI();
    $('pickNote').textContent = S.zero >= 2 && S.box.some(c=>c.id === 'bomb') ? '連續兩回合沒人得分，這次一定有炸彈' : '同時抓同一個，兩個人都拿得到';
  }
  function itemIcon(id){
    const cv = document.createElement('canvas'), d = RL.ITEMS[id], k = 22, W = 4*k, H = 3*k; cv.width = W; cv.height = H; const g = cv.getContext('2d');
    const ox = (W - d.w*k)/2, oy = (H - d.h*k)/2;
    if (id === 'plank'){ g.fillStyle = '#b07a44'; g.fillRect(ox, oy+3, d.w*k, k-6); g.fillStyle = '#e0b070'; g.fillRect(ox, oy+3, d.w*k, 4); }
    if (id === 'hay'){ g.fillStyle = '#e2bd55'; g.fillRect(ox, oy, d.w*k, d.h*k); g.fillStyle = '#8a5a2a'; g.fillRect(ox, oy+10, d.w*k, 5); g.fillRect(ox, oy+d.h*k-15, d.w*k, 5); }
    if (id === 'wire'){ g.strokeStyle = '#c3c8cf'; g.lineWidth = 2; for (let i=0;i<6;i++){ g.beginPath(); g.arc(ox + 6 + i*7, oy + k/2, 7, 0, 7); g.stroke(); } g.fillStyle = '#5a4a3a'; g.fillRect(ox, oy+2, 3, k); g.fillRect(ox+d.w*k-3, oy+2, 3, k); }
    if (id === 'saw'){ const cx = W/2, cy = H/2; g.fillStyle = '#d8dce2'; g.beginPath(); for (let i=0;i<32;i++){ const a = i/32*Math.PI*2, r = i%2 ? 26 : 31; g.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r); } g.fill(); g.fillStyle = '#55585e'; g.fillRect(cx-11, cy-11, 22, 22); }
    if (id === 'bomb'){ g.fillStyle = '#222226'; g.beginPath(); g.arc(W/2, H/2+4, 18, 0, 7); g.fill(); g.strokeStyle = '#c9a36a'; g.lineWidth = 3; g.beginPath(); g.moveTo(W/2+8, H/2-12); g.quadraticCurveTo(W/2+14, H/2-24, W/2+22, H/2-20); g.stroke(); g.fillStyle = '#ffb040'; g.beginPath(); g.arc(W/2+23, H/2-21, 4, 0, 7); g.fill(); }
    if (id === 'coin'){ g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(W/2, H/2, 20, 0, 7); g.fill(); g.fillStyle = '#fff2b0'; g.font = '900 20px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('★', W/2, H/2+1); }
    return cv;
  }
  // --- PICK: the party box. Every player steers a cursor with their face and grabs an item; a taken item vanishes in a puff ---
  const SLOTS = [[20,38],[40,64],[60,36],[80,62],[30,58],[70,48]];
  function enterPickUI(){
    const box = $('pbox'); box.querySelectorAll('.pitem,.pcur,.smoke').forEach(e=>e.remove());
    S.box.forEach((c, j)=>{ const d = RL.ITEMS[c.id], s = SLOTS[j % SLOTS.length];
      c.x = s[0] + (Math.random()-.5)*6; c.y = s[1] + (Math.random()-.5)*6;
      const el = document.createElement('div'); el.className = 'pitem'; el.style.left = c.x + '%'; el.style.top = c.y + '%'; el.style.setProperty('--tilt', ((Math.random()-.5)*16).toFixed(1) + 'deg');
      el.appendChild(itemIcon(c.id));
      const nm = document.createElement('b'); nm.textContent = d.name; el.appendChild(nm);
      if (d.trap){ const t = document.createElement('i'); t.className = 'trap'; t.textContent = '陷阱'; el.appendChild(t); }
      const ds = document.createElement('span'); ds.className = 'ds'; ds.textContent = d.desc; el.appendChild(ds);
      box.appendChild(el); c.el = el; });
    S.pc = [];
    for (let i=0;i<S.players;i++){
      S.pc[i] = {x: 50 + (i - (S.players-1)/2) * 14, y: 88};
      const cu = document.createElement('div'); cu.className = 'pcur'; cu.style.setProperty('--pc', COLORS[i]);
      cu.appendChild(portraitEl(S.kinds[i], S.skins[i])); const tg = document.createElement('b'); tg.textContent = 'P' + (i+1); cu.appendChild(tg);
      const hold = document.createElement('div'); hold.className = 'hold'; cu.appendChild(hold);
      box.appendChild(cu); S.pc[i].el = cu; S.pc[i].hold = hold;
    }
    drawPick();
  }
  const itemUnder = (i)=>{ const p = S.pc[i]; let best = -1, bd = 1e9; S.box.forEach((c,j)=>{ if (c.takers.length) return; const d = Math.hypot((c.x - p.x)*1.6, c.y - p.y); if (d < 13 && d < bd){ bd = d; best = j; } }); return best; };
  function drawPick(){
    const hot = S.box.map(()=>[]);
    S.pc.forEach((p,i)=>{ p.el.style.left = p.x + '%'; p.el.style.top = p.y + '%'; if (!S.picks[i]){ const j = itemUnder(i); if (j >= 0) hot[j].push(i); } });
    S.box.forEach((c,j)=>{ if (!c.el) return; c.el.classList.toggle('hot', hot[j].length > 0); c.el.style.setProperty('--pc', hot[j].length ? COLORS[hot[j][0]] : 'transparent'); });
  }
  function tryPick(list){
    // everyone grabbing the same item in the same frame gets a copy (PLAN §6)
    const byCard = {}; for (const [i, j] of list) if (!S.picks[i] && j >= 0) (byCard[j] = byCard[j] || []).push(i);
    for (const j in byCard){ const c = S.box[j];
      if (c.takers.length){ SND.no(); continue; }
      for (const i of byCard[j]){ S.picks[i] = c.id; c.takers.push(i); const h = S.pc[i].hold; h.replaceChildren(itemIcon(c.id)); S.pc[i].el.classList.add('got'); }
      poof(c); SND.pick(); if (byCard[j].length > 1) flash('複製！'); }
    if (S.picks.every(Boolean) && !S.after) S.after = .8;
  }
  function poof(c){
    c.el.classList.add('gone');
    const sm = document.createElement('div'); sm.className = 'smoke'; sm.style.left = c.x + '%'; sm.style.top = c.y + '%';
    for (let k=0;k<9;k++){ const s = document.createElement('i'); const a = k/9*Math.PI*2; s.style.setProperty('--dx', (Math.cos(a)*46).toFixed(0) + 'px'); s.style.setProperty('--dy', (Math.sin(a)*34 - 10).toFixed(0) + 'px'); s.style.animationDelay = (k%3)*.04 + 's'; sm.appendChild(s); }
    $('pbox').appendChild(sm); setTimeout(()=>sm.remove(), 900);
    if (AC){ noise(.25, .12); }
  }
  function pickKeys(codes, dt){
    const list = [], sp = 62;
    for (let i=0;i<S.players;i++){ if (S.picks[i]) continue; const p = S.pc[i];
      const dx = (held(i,'right')?1:0) - (held(i,'left')?1:0), dy = (held(i,'down')?1:0) - (held(i,'up')?1:0), n = Math.hypot(dx, dy) || 1;
      p.x = Math.max(4, Math.min(96, p.x + dx/n*sp*dt*.62)); p.y = Math.max(8, Math.min(94, p.y + dy/n*sp*dt));
      for (const code of codes) if (is(i, 'place', code)) list.push([i, itemUnder(i)]); }
    if (list.length) tryPick(list);
    drawPick();
  }
  function pickPointer(e, click){
    if (S.mode !== 'pick' || !S.pc || !S.pc[0] || S.picks[0]) return;
    const r = $('pbox').getBoundingClientRect(); S.pc[0].x = Math.max(4, Math.min(96, (e.clientX - r.left)/r.width*100)); S.pc[0].y = Math.max(8, Math.min(94, (e.clientY - r.top)/r.height*100));
    if (click) tryPick([[0, itemUnder(0)]]);
  }
  function stepPick(dt){
    if (S.after){ S.after -= dt; if (S.after <= 0) enterPlace(); return; }
    S.timer -= dt;
    if (S.timer <= 0){
      const list = [];
      for (let i=0;i<S.players;i++) if (!S.picks[i]){ const free = S.box.map((c,j)=>j).filter(j=>!S.box[j].takers.length && !list.some(l=>l[1] === j)); list.push([i, free.length ? free[Math.floor(Math.random()*free.length)] : -1]); }
      tryPick(list);
      for (let i=0;i<S.players;i++) if (!S.picks[i]){ const c = S.box[Math.floor(Math.random()*S.box.length)]; S.picks[i] = c.id; S.pc[i].hold.replaceChildren(itemIcon(c.id)); }
      flash('時間到，已替你隨機選擇'); S.after = .9; }
  }
  // --- PLACE ---
  function clearGhosts(){ S.ghosts.forEach(ART.removeObj); S.ghosts = []; }
  function enterPlace(){
    S.mode = 'place'; S.timer = RU.placeTimeSec; S.after = 0; show(null); phaseLabel('放道具'); ART.placeOverlay(true, S.world);
    S.placed = Array(S.players).fill(false); clearGhosts();
    for (let i=0;i<S.players;i++){ const d = RL.ITEMS[S.picks[i]]; S.cursor[i] = {x:Math.round(13 + i*4 - d.w/2), y:Math.round(5 - d.h/2), r:0, rep:0, why:''}; S.ghosts[i] = ART.makeGhost(S.picks[i], COLOR_N[i]); }
    $('hint').textContent = S.players === 1 ? 'WASD 或方向鍵移動、Q／E 旋轉、空白鍵放下；滑鼠點一下放、右鍵或滾輪旋轉' : 'P1：WASD 移動、Q／E 旋轉、空白鍵放下　P2：方向鍵移動、. 旋轉、Enter 放下　滑鼠幫 P1（右鍵旋轉）';
    renderPlaceTags();
  }
  function renderPlaceTags(){
    $('tags').querySelectorAll('.ptag').forEach(e=>e.remove());
    for (let i=0;i<S.players;i++){ const t = document.createElement('div'); t.className = 'tagl ptag'; t.style.setProperty('--pc', COLORS[i]); t.dataset.i = i; $('tags').appendChild(t); }
  }
  function confirmPlace(i){
    if (S.placed[i]) return;
    const c = S.cursor[i], type = S.picks[i], v = RL.canPlace(S.world, type, c.x, c.y, c.r);
    if (!v.ok){ c.why = v.why; c.whyT = 1.4; SND.no(); return; }
    doPlace(i, type, c.x, c.y, c.r);
  }
  function doPlace(i, type, x, y, r){
    S.placed[i] = true; ART.removeObj(S.ghosts[i]); S.ghosts[i] = null;
    if (type === 'bomb'){
      const hits = RL.bombHits(S.world, x, y); for (const h of hits) S.items.splice(S.items.indexOf(h), 1);
      ART.explosion(WX(x + .5), WY(y + .5)); SND.boom(); S.shake = .35; flash('炸掉 ' + hits.length + ' 個道具', COLORS[i]);
    } else { const it = {type, x, y, r:type === 'coin' ? 0 : (r||0), owner:i}; if (type === 'coin'){ it.cx = x + .5; it.cy = y + .5; } S.items.push(it); SND.place(); }
    ART.syncItems(S.items, COLOR_N);
    if (S.placed.every(Boolean) && !S.after) S.after = .7;
  }
  function rotateCursor(i, d){
    const c = S.cursor[i], A = RL.dims(S.picks[i], c.r); c.r = (c.r + d + 4) % 4; const B = RL.dims(S.picks[i], c.r);
    c.x += Math.round((A.w - B.w)/2); c.y += Math.round((A.h - B.h)/2); moveCursor(i, 0, 0); SND.pick();   // keep it turning about its centre
  }
  function moveCursor(i, dx, dy){ const c = S.cursor[i], d = RL.dims(S.picks[i], c.r); c.x = Math.max(0, Math.min(32 - d.w, c.x + dx)); c.y = Math.max(0, Math.min(18 - d.h, c.y + dy)); }
  function placeKeys(codes, dt){
    for (const code of codes) for (let i=0;i<S.players;i++){ if (S.placed[i]) continue;
      if (is(i, 'left', code)) moveCursor(i, -1, 0); if (is(i, 'right', code)) moveCursor(i, 1, 0);
      if (is(i, 'up', code)) moveCursor(i, 0, -1); if (is(i, 'down', code)) moveCursor(i, 0, 1);
      if (is(i, 'rot', code)) rotateCursor(i, 1); if (is(i, 'rotL', code)) rotateCursor(i, -1);
      if (is(i, 'place', code)) confirmPlace(i); }
    // hold to keep moving
    for (let i=0;i<S.players;i++){ if (S.placed[i]) continue; const c = S.cursor[i];
      const dx = (held(i,'right')?1:0) - (held(i,'left')?1:0), dy = (held(i,'down')?1:0) - (held(i,'up')?1:0);
      if (dx || dy){ c.rep += dt; if (c.rep > .28){ c.rep -= .06; moveCursor(i, dx, dy); } } else c.rep = 0; }
  }
  function stepPlace(dt){
    for (const c of S.cursor) if (c && c.whyT) { c.whyT -= dt; if (c.whyT <= 0) c.why = ''; }
    if (S.after){ S.after -= dt; if (S.after <= 0){ ART.placeOverlay(false); startRace(); } return; }
    S.timer -= dt;
    if (S.timer <= 0){ for (let i=0;i<S.players;i++) if (!S.placed[i]){ const c = S.cursor[i], n = RL.nearestLegal(S.world, S.picks[i], c.x, c.y, c.r); if (n) doPlace(i, S.picks[i], n.x, n.y, c.r); else { S.placed[i] = true; ART.removeObj(S.ghosts[i]); } }
      flash('時間到，自動放下'); S.after = S.after || .7; }
  }
  function drawPlace(){
    const tags = $('tags').querySelectorAll('.ptag');
    for (let i=0;i<S.players;i++){
      const c = S.cursor[i], g = S.ghosts[i], t = tags[i];
      if (g){ const ok = RL.canPlace(S.world, S.picks[i], c.x, c.y, c.r).ok; ART.setGhost(g, c.x, c.y, ok, c.r); }
      if (t){ if (S.placed[i]){ t.hidden = true; continue; } t.hidden = false; const d = Object.assign({}, RL.ITEMS[S.picks[i]], RL.dims(S.picks[i], c.r)); const v = new THREE.Vector3(WX(c.x + d.w/2), WY(c.y) + .3, 2.3).project(camera);
        t.style.left = ((v.x + 1)/2*innerWidth) + 'px'; t.style.top = ((1 - v.y)/2*innerHeight) + 'px';
        const bad = RL.canPlace(S.world, S.picks[i], c.x, c.y, c.r); t.textContent = 'P' + (i+1) + ' ' + d.name + (c.why ? '　✕ ' + c.why : (!bad.ok ? '　✕ ' + bad.why : ''));
        t.classList.toggle('bad', !!c.why || !bad.ok); }
    }
  }
  // mouse helps P1 place
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0), hitP = new THREE.Vector3();
  function mouseCell(e){ const v = new THREE.Vector2(e.clientX/innerWidth*2 - 1, -(e.clientY/innerHeight)*2 + 1); ray.setFromCamera(v, camera); if (!ray.ray.intersectPlane(plane, hitP)) return null; return {x:hitP.x + 16, y:18 - hitP.y}; }
  canvas.addEventListener('pointermove', (e)=>{ if (S.mode !== 'place' || S.placed[0]) return; const m = mouseCell(e); if (!m) return; const d = RL.dims(S.picks[0], S.cursor[0].r); S.cursor[0].x = Math.round(m.x - d.w/2); S.cursor[0].y = Math.round(m.y - d.h/2); moveCursor(0, 0, 0); });
  canvas.addEventListener('click', (e)=>{ if (S.mode === 'place' && !S.placed[0]){ const m = mouseCell(e); if (m){ const d = RL.dims(S.picks[0], S.cursor[0].r); S.cursor[0].x = Math.round(m.x - d.w/2); S.cursor[0].y = Math.round(m.y - d.h/2); moveCursor(0,0,0); } confirmPlace(0); } });

  canvas.addEventListener('contextmenu', (e)=>{ if (S.mode === 'place'){ e.preventDefault(); if (!S.placed[0]) rotateCursor(0, 1); } });
  canvas.addEventListener('wheel', (e)=>{ if (S.mode === 'place' && !S.placed[0]){ e.preventDefault(); rotateCursor(0, e.deltaY > 0 ? 1 : -1); } }, {passive:false});
  // --- RACE ---
  function startRace(){
    clearGhosts(); $('tags').querySelectorAll('.ptag').forEach(e=>e.remove());
    S.world = freshWorld(); ART.syncItems(S.items, COLOR_N);
    S.mode = 'race'; S.after = 0; S.time = 0; S.endT = 0; S.count = 1.6; S.acc = 0; S.lastTick = 6; S.timer = RU.raceTimeSec; show(null);
    phaseLabel('跑到終點旗！'); $('hint').textContent = 'P1：A D 移動、W 跳、左 Shift 跑、S 蹲　P2：方向鍵、↑ 跳、右 Shift 跑、↓ 蹲'; renderChips(); flash('預備…');
  }
  function stepRace(dt){
    const w = S.world;
    if (S.count > 0){ S.count -= dt; if (S.count <= 0){ flash('衝！'); SND.go(); } return; }
    S.time += dt; let changed = false;
    w.players.forEach(p=>{ p.px = p.x; p.py = p.y; });
    PH.stepWorld(w, w.players.map((p,i)=>readInput(i)), PH.DT);
    w.players.forEach((p,i)=>{ const m = S.models[i];
      for (const e of p.events){
        if (e === 'jump'){ SND.jump(); m.sx = .75; m.sy = 1.3; ART.burst(WX(p.x), WY(p.y), 0xe8dccb, 5, 2, {gravity:2, size:.35}); }
        if (e === 'walljump'){ SND.wall(); m.sx = .8; m.sy = 1.25; ART.burst(WX(p.x + p.face*-.45), WY(p.y - 1), 0xffffff, 6, 3, {gravity:2, size:.3}); }
        if (e === 'land'){ SND.land(); m.sx = 1.28; m.sy = .76; ART.burst(WX(p.x), WY(p.y), 0xe8dccb, 6, 2.5, {gravity:3, size:.4}); }
        if (e === 'die'){ SND.die(); setFace(m, 'cry'); changed = true; S.shake = .18; ART.burst(WX(p.x), WY(p.y - 1), [COLOR_N[i], 0xffffff], 14, 7, {cubes:true}); flash('P' + (i+1) + ' 倒下了', COLORS[i]); }
        if (e === 'goal'){ SND.goal(); changed = true; ART.burst(WX(p.x), WY(p.y - 1), [0xf2c14e, 0xff7a3d, 0x4fa3ff, 0x5fd36a, 0xd070e0], 30, 9, {cubes:true, up:4}); flash('P' + (i+1) + ' 抵達！', COLORS[i]); }
        if (e === 'coin'){ SND.coin(); changed = true; }
        if (e === 'postmortem') flash('P' + (i+1) + ' 的身體飛到旗子上了！', COLORS[i]);
      } });
    if (changed) renderChips();
    const left = Math.max(0, RU.raceTimeSec - S.time), sec = Math.ceil(left); S.timer = left;
    if (left <= 5 && sec < S.lastTick){ S.lastTick = sec; SND.tick(); }
    if ((PH.raceOver(w) || left <= 0) && !S.endT) S.endT = S.time;
    if (S.endT && S.time - S.endT > 1.3) enterScore();
  }
  // --- SCORE: a paper board, one row per player, hatched blocks stacked to the win line ---
  const AW_COLOR = {goal:'#2f3c6e', first:'#3f9d4c', solo:'#2b8fd8', trap:'#ef7d2c', coin:'#d9a414', comeback:'#8c8f2a'};
  const AW_RANK = ['trap','comeback','solo','coin','first','goal'];
  function seg(a, isNew, delay){
    const s = document.createElement('i'); s.className = 'seg' + (isNew ? ' new' : ''); s.style.setProperty('--c', AW_COLOR[a.k]); s.style.setProperty('--w', (a.v / RU.winFifths * 100) + '%');
    s.title = RL.AWARD_NAME[a.k]; if (isNew) s.style.animationDelay = delay + 's'; return s;
  }
  function enterScore(){
    S.mode = 'score'; const w = S.world, res = PH.roundResult(w), sr = RL.scoreRound(res, S.streak);
    S.streak = RL.nextStreak(res, S.streak);
    const anyPts = Object.values(sr.awards).some(a=>a.length); S.zero = anyPts && sr.verdict === 'normal' ? 0 : S.zero + 1;
    for (const p of w.players) if (p.done && p.coin){ const k = S.items.indexOf(p.coin); if (k >= 0) S.items.splice(k, 1); }   // delivered coins are used up
    const board = $('board'); board.querySelectorAll('.brow,.stamp').forEach(e=>e.remove());
    const grid = $('bgrid'); grid.replaceChildren();
    for (let k=0;k<=RU.pointsToWin;k++){ const l = document.createElement('i'); l.className = 'gl' + (k === 0 || k === RU.pointsToWin ? ' solid' : ''); l.style.left = (k/RU.pointsToWin*100) + '%'; if (k > 0 && k < RU.pointsToWin){ const n = document.createElement('span'); n.textContent = k; l.appendChild(n); } grid.appendChild(l); }
    let delay = .3;
    for (let i=0;i<S.players;i++){
      const list = sr.awards[i], p = w.players[i];
      const row = document.createElement('div'); row.className = 'brow'; row.style.setProperty('--pc', COLORS[i]);
      const who = document.createElement('div'); who.className = 'who'; who.appendChild(portraitEl(S.kinds[i], S.skins[i]));
      const nm = document.createElement('div'); nm.className = 'nm'; nm.innerHTML = '<b></b><span></span>'; nm.querySelector('b').textContent = charName(S.kinds[i]);
      nm.querySelector('span').textContent = p.done ? '' : !p.alive ? '倒下' : '沒到'; who.appendChild(nm); row.appendChild(who);
      const lane = document.createElement('div'); lane.className = 'lane';
      (S.segs[i] || []).forEach(a=>lane.appendChild(seg(a, false)));
      list.forEach(a=>{ lane.appendChild(seg(a, true, delay)); setTimeout(()=>{ if (S.mode === 'score') SND.award(AW_RANK.length - AW_RANK.indexOf(a.k)); }, delay*1000); delay += .45; });
      const top = list.slice().sort((a,b)=>AW_RANK.indexOf(a.k) - AW_RANK.indexOf(b.k))[0];
      if (top){ const t = document.createElement('em'); t.className = 'awbig'; t.textContent = RL.AWARD_NAME[top.k]; t.style.color = AW_COLOR[top.k]; t.style.animationDelay = (delay - .2) + 's'; lane.appendChild(t); }
      row.appendChild(lane); board.appendChild(row);
      S.segs[i] = (S.segs[i] || []).concat(list); S.scores[i] += RL.total(list);
    }
    if (sr.verdict !== 'normal'){ const st = document.createElement('div'); st.className = 'stamp'; st.textContent = (sr.verdict === 'easy' ? '太簡單了！' : '太難了！') + (anyPts ? '只有金幣算分' : '沒有人得分！'); board.appendChild(st); }
    const win = RL.winners(S.scores, S.round);
    $('scNext').textContent = win.length ? '看結果' : '下一回合'; S.winners = win;
    $('bWin').textContent = win.length ? (win.length > 1 ? '平手！' : charName(S.kinds[win[0]]) + ' 獲勝！') : '獲勝！';
    show('scrScore'); renderChips(); S.after = 0; S.scoreT = 0;
  }
  function leaveScore(){ if (S.winners.length) enterOver(); else nextRound(); }
  // --- GAME OVER ---
  function enterOver(){
    S.mode = 'over'; const win = S.winners;
    $('resTitle').textContent = win.length > 1 ? '平手！' + win.map(i=>charName(S.kinds[i])).join('、') : charName(S.kinds[win[0]]) + ' 贏了！';
    $('resWhy').textContent = win.length > 1 ? '同分同時達標（驟死賽下一版加入）' : (S.scores[win[0]] >= RU.winFifths ? '先拿到 ' + RU.pointsToWin + ' 分' : '打完 ' + RU.roundLimit + ' 回合，分數最高');
    const rank = $('resRank'); rank.replaceChildren();
    [...Array(S.players).keys()].sort((a,b)=>S.scores[b]-S.scores[a]).forEach(i=>{ const d = document.createElement('div'); d.style.setProperty('--pc', COLORS[i]); d.innerHTML = '<b></b><span></span>'; d.querySelector('b').textContent = 'P' + (i+1); d.querySelector('span').textContent = charName(S.kinds[i]) + '　' + (S.scores[i]/5).toFixed(1).replace('.0','') + ' 分'; rank.appendChild(d); });
    for (let i=0;i<S.players;i++){ const m = S.models[i]; m.holder.rotation.z = 0; setFace(m, win.includes(i) ? 'normal' : 'cry'); }
    show('scrResult'); $('rRetry').focus(); SND.goal();
  }
  // small HUD bar: one cell per 1/5 point
  function bar(i, before, gained){
    const b = document.createElement('div'); b.className = 'bar';
    for (let k=0;k<RU.winFifths;k++){ const c = document.createElement('i'); if (k < before) c.className = 'f'; else if (k < before + gained) c.className = 'n'; if ((k+1) % 5 === 0) c.classList.add('pt'); b.appendChild(c); }
    b.style.setProperty('--pc', COLORS[i]); return b;
  }
  function renderChips(){
    const L0 = $('chipsL'), R0 = $('chipsR'); L0.replaceChildren(); R0.replaceChildren(); const w = S.world;
    for (let i=0;i<S.players;i++){ const p = w && w.players[i]; const d = document.createElement('div');
      d.className = 'chip' + (S.mode === 'race' && p && p.done ? ' done' : S.mode === 'race' && p && !p.alive ? ' dead' : ''); d.style.setProperty('--pc', COLORS[i]);
      d.innerHTML = '<div class="top"><b></b><span class="n"></span><span class="s"></span></div>'; d.querySelector('b').textContent = 'P' + (i+1); d.querySelector('.n').textContent = charName(S.kinds[i]);
      d.querySelector('.s').textContent = S.mode !== 'race' || !p ? (S.scores[i]/5).toFixed(1).replace('.0','') + ' 分' : p.done ? '抵達第 ' + (w.order.indexOf(i)+1) + (p.coin ? ' ●' : '') : !p.alive ? '倒下' : (p.coin ? '帶著金幣' : '跑關中');
      d.appendChild(bar(i, S.scores[i], 0)); (i % 2 ? R0 : L0).appendChild(d); }
  }
  function pause(on){ if (on && ['pick','place','race'].includes(S.mode)){ S.paused = S.mode; S.mode = 'pause'; show('scrPause'); $('pResume').focus(); } else if (!on && S.mode === 'pause'){ S.mode = S.paused; show(S.mode === 'pick' ? 'scrPick' : null); } }

  // ---------- per-frame models ----------
  const k_ = (dt, r)=>1 - Math.exp(-dt * r);
  function animateFighters(dt, alpha){
    const w = S.world, now = performance.now();
    w.players.forEach((p,i)=>{
      const m = S.models[i]; if (!m) return;
      m.holder.visible = !p.gone;
      const x = p.px + (p.x - p.px) * alpha, y = p.py + (p.y - p.py) * alpha;
      m.holder.position.set(WX(x), WY(y), 0);
      const ry = p.face * (Math.PI/2 - 0.4); let d = ry - m.holder.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); m.holder.rotation.y += d * k_(dt, 20);
      let pose, kk = k_(dt, 16);
      if (S.mode === 'over'){ pose = S.winners.includes(i) ? (Math.sin(now/170) > 0 ? POSE.thumbs : POSE.peace) : (POSE.sob || POSE.hurt); m.holder.rotation.z *= .9; }
      else if (S.mode === 'pick' || S.mode === 'place') pose = Math.sin(now/900 + i) > .7 ? POSE.thumbs : POSE.stand;
      else if (!p.alive){ pose = POSE.hurt; m.holder.rotation.z += ((p.face > 0 ? 1.35 : -1.35) - m.holder.rotation.z) * k_(dt, 6); }
      else if (p.done){ pose = Math.sin(now/180) > 0 ? POSE.thumbs : POSE.peace; m.holder.rotation.z *= .9; }
      else if (p.onGround && p.crouch) pose = POSE.squat;
      else if (p.onGround && Math.abs(p.vx) > .4){ m.phase += Math.abs(p.vx) * dt * (p.run ? 1.15 : 1.4); pose = runPose(m.phase); kk = k_(dt, 24); }
      else if (p.onGround) pose = POSE.stand;
      else if (p.wall && p.vy > 0) pose = WALL_POSE;
      else pose = POSE.air;
      applyPose(m, pose, kk);
      const ty = p.crouch && p.alive ? .62 : 1, tx = p.crouch && p.alive ? 1.12 : 1, rec = Math.min(1, .16 * dt * 60);
      m.sx += (tx - m.sx) * rec; m.sy += (ty - m.sy) * rec;
      m.holder.scale.set(m.baseScale * m.sx, m.baseScale * m.sy, m.baseScale * m.sx);
      if (m.tag){ const v = new THREE.Vector3(WX(x), WY(y) + p.h + .55, 0).project(camera);
        m.tag.style.left = ((v.x + 1) / 2 * innerWidth) + 'px'; m.tag.style.top = ((1 - v.y) / 2 * innerHeight) + 'px'; m.tag.style.opacity = p.done || p.gone ? .45 : 1; }
    });
  }
  function animateSelect(dt){
    const n = S.models.length, t = performance.now()/1000;
    S.models.forEach((m,i)=>{ const x = n === 1 ? 0 : (i === 0 ? -7 : 7);
      m.holder.position.set(x, 4.2, 4); m.holder.rotation.set(0, (n === 1 ? 0 : (i === 0 ? .45 : -.45)) + Math.sin(t*.8 + i)*.12, 0);
      applyPose(m, S.stage[i] === 'ready' ? (Math.sin(t*5) > 0 ? POSE.thumbs : POSE.peace) : S.stage[i] === 'skin' ? (POSE.selfie || POSE.peace) : POSE.stand, k_(dt, 10)); });
  }

  // ---------- loop ----------
  let last = performance.now();
  function frame(now){
    const dt = Math.min(.1, (now - last) / 1000); last = now; const t = now/1000;
    const codes = pressed; pressed = [];
    if (S.mode === 'select') codes.forEach(selectKeys);
    else if (S.mode === 'map') codes.forEach(mapKeys);
    else if (S.mode === 'pause'){ if (codes.includes('Escape')) pause(false); }
    else if (['pick','place','race'].includes(S.mode) && codes.includes('Escape')) pause(true);
    else if (S.mode === 'score' && codes.some(c=>['Space','Enter','KeyW','ArrowUp','NumpadEnter'].includes(c)) && S.scoreT > .8) leaveScore();
    if (S.mode === 'pick'){ pickKeys(codes, dt); stepPick(dt); }
    if (S.mode === 'place'){ placeKeys(codes, dt); stepPlace(dt); drawPlace(); }
    if (S.mode === 'race'){ S.acc += dt; while (S.acc >= PH.DT){ stepRace(PH.DT); S.acc -= PH.DT; if (S.mode !== 'race') break; } }
    if (S.mode === 'score'){ S.scoreT += dt; }
    if (MATCH.includes(S.mode) && S.world){
      animateFighters(dt, S.mode === 'race' ? Math.min(1, S.acc / PH.DT) : 1);
      ART.updateItems(dt, t, S.items);
      const tm = Math.max(0, S.timer), sec = Math.ceil(tm); $('timer').textContent = S.mode === 'score' || S.mode === 'over' ? '' : sec; $('timer').classList.toggle('low', tm <= 5);
    } else if (S.mode === 'select') animateSelect(dt);
    const hz = S.world && S.mode === 'race' ? S.world.hazards[0] : null;
    ART.update(dt, t, hz);
    // screen shake (skipped with reduced motion)
    if (S.shake > 0 && !reduceMotion){ S.shake -= dt; camera.position.x = (Math.random()-.5)*S.shake; camera.position.y = 9.4 + (Math.random()-.5)*S.shake; } else if (camera.position.x !== 0){ camera.position.x = 0; camera.position.y = 9.4; }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function boot(){
    document.querySelectorAll('[data-players]').forEach(b=>b.onclick = ()=>{ audio(); S.players = +b.dataset.players; enterSelect(); });
    $('selBack').onclick = ()=>{ const i = active(); if (i > 0 || (i === 0 && S.stage[0] !== 'char')) backSel(Math.max(0, i)); else enterTitle(); };
    $('mapBack').onclick = enterSelect;
    $('pResume').onclick = ()=>pause(false); $('pMap').onclick = enterMap; $('pChar').onclick = enterSelect; $('pTitle').onclick = enterTitle;
    $('pRestart').onclick = startMatch; $('scNext').onclick = leaveScore;
    $('pbox').addEventListener('pointermove', (e)=>pickPointer(e, false)); $('pbox').addEventListener('pointerdown', (e)=>pickPointer(e, true));
    $('rRetry').onclick = startMatch; $('rMap').onclick = enterMap; $('rChar').onclick = enterSelect; $('rTitle').onclick = enterTitle;
    if (matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) $('touchNote').hidden = false;
    enterTitle(); $('scrTitle').querySelector('.big').focus();
    requestAnimationFrame(frame);
  }
  return { boot, S };
})();
