/* 世志大亂鬥 core: renderer, physics, input, menus, online play. Characters: characters/*.js, maps: maps/*.js */
'use strict';
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:false});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xd8a786, 45, 140);
const camera = new THREE.PerspectiveCamera(34, 1, 0.8, 500);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(pointer: coarse)').matches;
// stop iPhone double-tap / pinch zoom while playing
document.addEventListener('gesturestart', e=>e.preventDefault(), {passive:false});
document.addEventListener('gesturechange', e=>e.preventDefault(), {passive:false});
document.addEventListener('touchmove', e=>{ if (e.touches && e.touches.length > 1) e.preventDefault(); }, {passive:false});
let lastTouchEnd = 0;
document.addEventListener('touchend', e=>{
  const now = Date.now();
  if (now - lastTouchEnd < 320 && (G.mode==='play' || G.mode==='pad' || G.mode==='select')) e.preventDefault();
  lastTouchEnd = now;
}, {passive:false});
document.addEventListener('dblclick', e=>e.preventDefault(), {passive:false});
if (isTouch){
  document.body.classList.add('touch');
  document.getElementById('touchHelp').hidden = false;
  document.getElementById('kbHelp').hidden = true;
}

/* =================== textures =================== */
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function tex(w, h, draw, rep){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  if (rep){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
function speckle(g, w, h, base, cols, p){
  g.fillStyle = base; g.fillRect(0,0,w,h);
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) if (rnd()<p){ g.fillStyle = cols[(rnd()*cols.length)|0]; g.fillRect(x,y,1,1); }
}
function shadeFace(g){
  let gr = g.createLinearGradient(0,0,64,0);
  gr.addColorStop(0,'rgba(90,50,30,.38)'); gr.addColorStop(.22,'rgba(90,50,30,0)');
  gr.addColorStop(.78,'rgba(90,50,30,0)'); gr.addColorStop(1,'rgba(90,50,30,.38)');
  g.fillStyle = gr; g.fillRect(0,0,64,64);
  gr = g.createLinearGradient(0,50,0,64); gr.addColorStop(0,'rgba(90,50,30,0)'); gr.addColorStop(1,'rgba(90,50,30,.35)');
  g.fillStyle = gr; g.fillRect(0,50,64,14);
}

const blackHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#151110',['#241d1a','#0b0908'],.5);
  g.fillStyle='#3d3430';
  for(let i=0;i<34;i++){ let x=(rnd()*32)|0, y=(rnd()*32)|0, l=3+((rnd()*5)|0); for(let k=0;k<l;k++) g.fillRect((x+k)%32,(y+(k>>1))%32,1,1); }
});
const shoeTex = tex(16,16,(g)=>speckle(g,16,16,'#dcd8cf',['#cfcac0','#e8e4dc','#bdb8ad'],.4));


const starTex = tex(16,16,(g)=>{
  g.fillStyle='#fff'; g.fillRect(7,0,2,16); g.fillRect(0,7,16,2); g.fillRect(5,5,6,6);
  g.fillStyle='#fff3a0'; g.fillRect(6,6,4,4);
});
const markTex = tex(16,16,(g)=>{ g.fillStyle='#fff'; g.beginPath(); g.moveTo(2,3); g.lineTo(14,3); g.lineTo(8,13); g.closePath(); g.fill(); });

const cobbleTex = tex(64,64,(g)=>{
  g.fillStyle='#5a4c3f'; g.fillRect(0,0,64,64);
  for(let r=0;r<8;r++){ const off=(r%2)*5; for(let c=-1;c<7;c++){
    const x=c*10+off+1, y=r*8+1, v=(rnd()*30)|0;
    g.fillStyle=`rgb(${128+v},${112+v},${94+v})`; g.fillRect(x,y,8,6);
    g.fillStyle='rgba(255,240,220,.12)'; g.fillRect(x,y,8,1);
    g.fillStyle='rgba(0,0,0,.15)'; g.fillRect(x,y+5,8,1);
  }}
  for(let i=0;i<70;i++){ g.fillStyle=['#b33a1c','#d0702a','#c9a032'][(rnd()*3)|0]; g.fillRect((rnd()*64)|0,(rnd()*64)|0,1+((rnd()*2)|0),1); }
},[6,2]);
const grassTex = tex(64,64,(g)=>{
  speckle(g,64,64,'#4a472b',['#5b5632','#3a3822','#6a5c2c','#545030'],.6);
  for(let i=0;i<140;i++){ g.fillStyle=['#a5401e','#c8662a','#c49a35','#7d2b18'][(rnd()*4)|0]; g.fillRect((rnd()*64)|0,(rnd()*64)|0,2,1); }
},[50,50]);
const stoneTex = tex(32,32,(g)=>speckle(g,32,32,'#b9a68a',['#a8957a','#c8b799','#9c8a70'],.55),[4,1]);
const rockTex = tex(32,32,(g)=>speckle(g,32,32,'#6d5844',['#5c4938','#7e6750','#4b3a2c'],.6),[4,2]);
const skyTex = tex(4,64,(g)=>{
  const gr=g.createLinearGradient(0,0,0,64);
  gr.addColorStop(0,'#b98f86'); gr.addColorStop(.45,'#d9a98d'); gr.addColorStop(.55,'#ebbf97'); gr.addColorStop(1,'#d8a786');
  g.fillStyle=gr; g.fillRect(0,0,4,64);
});
skyTex.magFilter = THREE.LinearFilter;
function foliage(pal){
  return tex(64,64,(g)=>{
    for(let i=0;i<1100;i++){
      const a=rnd()*6.283, r=Math.sqrt(rnd())*29;
      const x=32+Math.cos(a)*r, y=31+Math.sin(a)*r*.92, s=1+((rnd()*3)|0);
      const sh=Math.min(.999,Math.max(0, y/64 + (rnd()-.5)*.55));
      g.fillStyle=pal[Math.floor(sh*pal.length)]; g.fillRect(x|0,y|0,s,s);
    }
  });
}
const folTex = [
  ['#f0522a','#d63a1f','#b8231a','#8a1a14','#5e130f'],
  ['#efb84a','#d99a2a','#b8781e','#8a5a1a','#5a3c14'],
  ['#e07a2e','#c95a22','#a8401c','#7c2e16','#4e1f10'],
  ['#9a9a44','#7a7a34','#5c5e2a','#434620','#2e3018'],
].map(foliage);

/* =================== geometry helpers =================== */
const L = (o) => new THREE.MeshLambertMaterial(o);
function rbox(w,h,d,round,mat,seg=3){
  const g = new THREE.BoxGeometry(w,h,d,seg,seg,seg);
  const p = g.attributes.position, v = new THREE.Vector3(), e = new THREE.Vector3();
  for(let i=0;i<p.count;i++){
    v.fromBufferAttribute(p,i);
    e.set(v.x/(w/2), v.y/(h/2), v.z/(d/2)).normalize();
    e.set(e.x*w/2, e.y*h/2, e.z*d/2);
    v.lerp(e,round); p.setXYZ(i,v.x,v.y,v.z);
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g,mat);
}
const cyl = (r1,r2,h,mat,s=7) => new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,s), mat);
const at = (m,x,y,z) => { m.position.set(x,y,z); return m; };
const pivot = (parent,x,y,z) => { const o = new THREE.Group(); o.position.set(x,y,z); parent.add(o); return o; };
const black = L({color:0x1a1716});
function spriteOf(t, s, color){ const m = new THREE.Sprite(new THREE.SpriteMaterial({map:t, transparent:true, alphaTest:.3, color: color||0xffffff, fog:false})); m.scale.set(s,s,1); return m; }

/* =================== fighters' bodies =================== */
function buildChar(S, parent){
  const root = new THREE.Group(); parent.add(root);
  const hips = pivot(root,0,3.3,0);
  const chest = pivot(hips,0,0,0);
  chest.add(at(rbox(1.6,2.3,0.92,.35,S.torsoMat),0,1.1,0));
  S.collar(chest);
  const neck = pivot(chest,0,2.2,0);
  neck.add(at(cyl(0.24,0.26,0.32,S.skinM),0,0.1,0));
  const head = pivot(neck,0,0.72,0.02);
  head.add(rbox(S.headW,S.headH,1,.6,[S.skinM,S.skinM,S.skinM,S.skinM,S.faceM,S.skinM]));
  const extra = S.hair(head) || {};
  [-1,1].forEach(s=>head.add(at(rbox(0.12,0.26,0.18,.5,S.skinM),s*(S.headW/2+0.02),0.02,0)));
  if (S.face) S.face(head);
  function arm(s){
    const sh = pivot(chest, s*0.92, 2.0, 0);
    sh.add(at(rbox(S.sleeve[0],S.sleeve[1],S.sleeve[0],.4,S.sleeveMat(s)),0,-S.sleeve[1]/2+0.15,0));
    sh.add(at(cyl(0.19,0.17,1.2,S.skinM),0,-0.62,0));
    const el = pivot(sh,0,-1.2,0);
    el.add(at(cyl(0.17,0.14,1.05,S.skinM),0,-0.5,0));
    if (S.watch && s===1) el.add(at(cyl(0.18,0.18,0.12,L({color:0x1d1d22}),8),0,-0.88,0));
    const hd = pivot(el,0,-1.05,0);
    hd.add(at(rbox(0.3,0.36,0.32,.5,S.skinM),0,-0.15,0));
    const th = rbox(0.11,0.24,0.12,.5,S.skinM); hd.add(th);
    const f1 = rbox(0.085,0.32,0.09,.5,S.skinM), f2 = rbox(0.085,0.32,0.09,.5,S.skinM);
    f1.position.x = 0.06; f2.position.x = -0.06; f1.rotation.z = 0.2; f2.rotation.z = -0.2;
    hd.add(f1,f2);
    return {sh,el,hd,th,f:[f1,f2]};
  }
  const R = arm(-1), Lf = arm(1);
  function leg(s){
    const hp = pivot(hips, s*0.4, 0, 0);
    hp.add(at(rbox(0.66,1.7,0.72,.35,S.pantsM),0,-0.78,0));
    const kn = pivot(hp,0,-1.6,0);
    kn.add(at(rbox(0.58,1.5,0.62,.3,S.pantsM),0,-0.7,0));
    kn.add(at(rbox(0.62,0.36,1.02,.4,S.shoeM),0,-1.5,0.16));
    kn.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.6,0.07,0.98),S.soleM),0,-1.66,0.16));
    return {hp,kn};
  }
  const RL = leg(-1), LL = leg(1);
  return { root, hips, chest, head, R, Lf, extra,
    joints:{ rSh:R.sh, rEl:R.el, rHd:R.hd, lSh:Lf.sh, lEl:Lf.el, lHd:Lf.hd, rHp:RL.hp, rKn:RL.kn, lHp:LL.hp, lKn:LL.kn, chest, head } };
}

const shoeM = L({map:shoeTex}), greySole = L({color:0x8f8a80}), blueSole = L({color:0x2a4fb0});
const SC = 0.85;
// ---- costumes: a character lists extra looks in registerChar({skins:[{name, apply(c)}]}); skin 0 is the normal look ----
const skinCount = (kind)=>(CHARS[kind] && CHARS[kind].skins ? CHARS[kind].skins.length : 0) + 1;
const skinName = (kind, s)=>s > 0 && CHARS[kind].skins && CHARS[kind].skins[s-1] ? CHARS[kind].skins[s-1].name : '原版';
const hatTexCache = {};
function hatTex(a, b){
  const key = a + b;
  return hatTexCache[key] || (hatTexCache[key] = tex(32,32,(g)=>{
    g.fillStyle = a; g.fillRect(0,0,32,32); g.fillStyle = b;
    for (let x=-32; x<32; x+=10) for (let y=0; y<32; y++) g.fillRect(x + y, y, 4, 1);   // spiral stripes
    g.fillStyle = '#ffffff'; [[5,4],[21,9],[12,17],[27,22],[6,27]].forEach(([x,y])=>g.fillRect(x,y,2,2));   // dots
  }));
}
// party cone hat; place it on c.head (hair top is about y 0.7)
function birthdayHat(a = '#ff5fa2', b = '#ffe066', pom = 0xffffff){
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.34,0.95,14), L({map:hatTex(a, b)})); cone.position.y = 0.47; g.add(cone);
  const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.34,0.07,5,14), L({color:new THREE.Color(b)})); ruff.rotation.x = Math.PI/2; ruff.position.y = 0.03; g.add(ruff);
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.14,8,6), L({color:pom})),0,0.98,0));
  [-1,1].forEach(s=>{ const st = cyl(0.015,0.015,0.62,black,4); st.position.set(s*0.33,-0.28,0.05); st.rotation.z = s*0.12; g.add(st); });   // elastic
  g.rotation.z = -0.2;
  return g;
}
function makeModel(kind, skin = 0){
  const holder = new THREE.Group(); scene.add(holder);
  const body = new THREE.Group(); body.scale.setScalar(SC); holder.add(body);
  const c = CHARS[kind].build(body);
  c.holder = holder; c.body = body; c.kind = kind; c.skin = 0;
  if (skin > 0 && CHARS[kind].skins && CHARS[kind].skins[skin-1]){ CHARS[kind].skins[skin-1].apply(c); c.skin = skin; }
  for (const k in c.props) c.props[k].visible = false;
  return c;
}

/* soldiers for Tommy's final */
/* =================== stage =================== */
const skyMat = new THREE.MeshBasicMaterial({map:skyTex,side:THREE.BackSide,fog:false});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(260,16,12), skyMat));
const stoneM = L({map:stoneTex}), cobM = L({map:cobbleTex}), rockM = L({map:rockTex});
// collision layout; filled by applyMap()
const MAIN = {x1:-20, x2:20, y:0};
let MAPK = 1;   // stage widening for 3–4 players
const PLATS = [];
const MAPS = {};
function addPlatform(group, p, topM, sideM, underM){
  const w = p.x2-p.x1;
  group.add(at(rbox(w,0.55,4,.2,[sideM,sideM,topM,sideM,sideM,sideM]),(p.x1+p.x2)/2,p.y-0.28,0));
  const r = new THREE.Mesh(new THREE.ConeGeometry(w*0.45,2.2,5), underM); r.rotation.x = Math.PI; r.scale.z = 0.4; r.position.set((p.x1+p.x2)/2,p.y-1.6,0); group.add(r);
}
function lampPost(group, x, z){
  const lamp = new THREE.Group(); lamp.position.set(x,0,z); group.add(lamp);
  lamp.add(at(cyl(0.2,0.28,0.5,black,8),0,0.25,0));
  lamp.add(at(cyl(0.08,0.1,4.6,black,6),0,2.6,0));
  lamp.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.55,0.7,0.55), L({color:0x2b2420, emissive:0x6b4a22})),0,5.2,0));
  const roof = at(new THREE.Mesh(new THREE.ConeGeometry(0.5,0.45,4), black),0,5.78,0); roof.rotation.y = Math.PI/4; lamp.add(roof);
}

const hemi = new THREE.HemisphereLight(0xffe4c8, 0x4a3828, 0.8); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffc18a, 0.95); sun.position.set(-6,12,9); scene.add(sun);
const rimL = new THREE.DirectionalLight(0xff8a5a, 0.35); rimL.position.set(5,4,-8); scene.add(rimL);
let curMap = 'park';
function applyMap(id){
  curMap = id; const M = MAPS[id];
  for (const k in MAPS) MAPS[k].group.visible = k===id;
  M.group.scale.x = MAPK;
  MAIN.x1 = -M.W*MAPK; MAIN.x2 = M.W*MAPK;
  PLATS.length = 0; M.plats.forEach(p=>PLATS.push({x1:p.x1*MAPK, x2:p.x2*MAPK, y:p.y}));
  skyMat.map = M.sky; skyMat.needsUpdate = true;
  scene.fog.color.setHex(M.fog); scene.fog.near = M.fogNear; scene.fog.far = M.fogFar;
  hemi.color.setHex(M.hemi[0]); hemi.groundColor.setHex(M.hemi[1]);
  sun.color.setHex(M.sun); rimL.color.setHex(M.rim);
}

/* =================== post =================== */
const rt = new THREE.WebGLRenderTarget(320,240,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
const post = new THREE.ShaderMaterial({
  uniforms:{ tDiffuse:{value:rt.texture}, lres:{value:new THREE.Vector2(320,240)}, time:{value:0}, dpr:{value:1}, sepia:{value:0}, flash:{value:0} },
  vertexShader:'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader:`
    precision mediump float;
    uniform sampler2D tDiffuse; uniform vec2 lres; uniform float time; uniform float dpr; uniform float sepia; uniform float flash;
    varying vec2 vUv;
    float b2(vec2 a){ a=floor(a); return fract(a.x/2.+a.y*a.y*.75); }
    float b4(vec2 a){ return b2(.5*a)*.25 + b2(a); }
    float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
    void main(){
      vec2 cc = vUv-.5;
      vec2 uv = .5 + cc*(1.+.035*dot(cc,cc));
      vec2 px = floor(uv*lres);
      vec2 suv = (px+.5)/lres;
      float off = .45/lres.x;
      vec3 col;
      col.r = texture2D(tDiffuse, suv+vec2(off,0.)).r;
      col.g = texture2D(tDiffuse, suv).g;
      col.b = texture2D(tDiffuse, suv-vec2(off,0.)).b;
      col = col*vec3(1.05,.98,.9) + vec3(.035,.025,.02);
      float l = dot(col, vec3(.299,.587,.114));
      vec3 sp = vec3(l*1.08+.04, l*.94+.02, l*.74);
      col = mix(col, sp, sepia);
      col *= 1. - sepia*.12*hash(vec2(floor(time*16.),3.));
      float d = b4(px)-.5;
      col = floor(col*40. + d + .5)/40.;
      col *= .95 + .05*sin(gl_FragCoord.y/dpr*2.1);
      col += (hash(px + floor(time*14.))-.5)*(.025 + sepia*.06);
      col *= 1. - dot(cc,cc)*(.85 + sepia*.8);
      col = mix(col, vec3(1.), flash);
      if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) col = vec3(0.);
      gl_FragColor = vec4(col,1.);
    }`
});
const postScene = new THREE.Scene();
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), post));
const postCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
let lastW = 0, lastH = 0;
function resize(){
  const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
  lastW = w; lastH = h;
  renderer.setSize(w,h,false);
  camera.aspect = w/h; camera.updateProjectionMatrix();
  const a = w/h; let lw, lh;
  if (a >= 1){ lh = 380; lw = Math.round(380*a); } else { lw = 380; lh = Math.round(380/a); }
  rt.setSize(lw,lh); post.uniforms.lres.value.set(lw,lh);
  post.uniforms.dpr.value = renderer.getPixelRatio();
}
addEventListener('resize', resize); resize();
// phones (esp. iOS) report the new size late after rotating / toolbar changes: re-check
addEventListener('orientationchange', ()=>{ setTimeout(resize, 120); setTimeout(resize, 500); });
if (window.visualViewport) visualViewport.addEventListener('resize', resize);

/* =================== audio =================== */
let AC = null, master = null;
function audioOn(){
  try{
    if (!AC){ AC = new (window.AudioContext||window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = .45; master.connect(AC.destination); }
    if (AC.state === 'suspended') AC.resume();
  }catch(e){ AC = null; }
}
function tone(freq, dur, type, vol, slide, when){
  if (!AC) return;
  const t = AC.currentTime + (when||0);
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type||'square'; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq*slide), t+dur);
  g.gain.setValueAtTime(vol||.2, t); g.gain.exponentialRampToValueAtTime(.001, t+dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.03);
}
let noiseBuf = null;
function noise(dur, vol, freq, when){
  if (!AC) return;
  if (!noiseBuf){ noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i=0;i<d.length;i++) d[i] = Math.random()*2-1; }
  const t = AC.currentTime + (when||0);
  const s = AC.createBufferSource(); s.buffer = noiseBuf;
  const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq||1000; f.Q.value = .8;
  const g = AC.createGain(); g.gain.setValueAtTime(vol||.3, t); g.gain.exponentialRampToValueAtTime(.001, t+dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t+dur+.03);
}
const NOTE = (n) => 261.63*Math.pow(2, n/12);
const SFX = {
  hit(p){ noise(.12, .22+Math.min(.2,p*.006), 900); tone(150,.15,'sine',.3,.5); },
  soft(){ tone(240,.28,'sine',.35,.42); tone(360,.14,'triangle',.14,.6); },
  swing(){ noise(.18,.14,2600); },
  batCrack(){ noise(.06,.35,3200); tone(900,.06,'square',.08,.6); },
  jump(){ tone(320,.09,'square',.06,1.8); },
  laughShort(){ tone(470,.08,'square',.12,.7); tone(430,.08,'square',.1,.7,.1); },
  laugh(){ for(let i=0;i<7;i++){ const f = 470 + (i%2?70:-10) + Math.random()*50 - i*14; tone(f,.08,'square',.11,.68,i*.11); noise(.04,.06,1900,i*.11); } },
  note(i){ const f = NOTE([0,4,7,12][i%4]); tone(f,.55,'triangle',.24); tone(f*2,.25,'sine',.06); },
  chord(){ [0,4,7,12].forEach(s=>tone(NOTE(s-12),.9,'triangle',.16)); },
  guitar(i){ [[9,12,16],[5,9,12],[7,11,14]][i%3].forEach((s,k)=>tone(NOTE(s-12),.8,'sawtooth',.06,1,k*.04)); },
  sob(){ tone(520,.25,'sine',.1,.7); tone(500,.3,'sine',.08,.65,.3); },
  ko(){ noise(.7,.4,380); tone(90,.6,'sawtooth',.18,.3); },
  whistle(){ tone(2100,.12,'sine',.18); tone(2100,.32,'sine',.18,1,.17); },
  shield(){ tone(520,.05,'square',.06); },
  inject(){ tone(1500,.08,'sine',.14,1.5); },
  spike(){ noise(.1,.3,1500); tone(220,.12,'square',.14,.4); },
  march(){ noise(.05,.12,300); },
  bark(){ tone(520,.09,'square',.14,.55); noise(.06,.12,1400); tone(480,.1,'square',.12,.5,.14); noise(.06,.1,1400,.14); },
  crash(){ noise(.5,.5,600); noise(.3,.4,2400,.05); tone(80,.4,'sawtooth',.25,.4); },
  horn(){ tone(415,.35,'square',.08); tone(523,.35,'square',.06); },
  fire(){ noise(1.2,.25,300); },
  boom(){ noise(.5,.45,200); tone(60,.5,'sine',.4,.5); },
};

/* =================== poses =================== */
const JK = ['rSh','lSh','rEl','lEl','rHd','lHd','rHp','lHp','rKn','lKn','chest','head'];
const DEF = {rSh:[0,0,-0.08],lSh:[0,0,0.08],rEl:[-0.15,0,0],lEl:[-0.15,0,0],rHd:[0,0,0],lHd:[0,0,0],rHp:[0,0,-0.03],lHp:[0,0,0.03],rKn:[0,0,0],lKn:[0,0,0],chest:[0,0,0],head:[0,0,0],turn:0,drop:0,hR:'fist',hL:'fist'};
function P(o, base){
  base = base || DEF; const r = {};
  for (const k of JK){ const v = o[k] || base[k]; r[k] = [v[0]||0, v[1]||0, v[2]||0]; }
  for (const k of ['turn','drop','hR','hL']) r[k] = o[k]!==undefined ? o[k] : base[k];
  return r;
}
const STANCE = P({rSh:[-0.35,0,-0.15], lSh:[-0.45,0,0.15], rEl:[-1.3], lEl:[-1.4], rHp:[-0.2,0,-0.1], lHp:[0.12,0,0.1], rKn:[0.3], lKn:[0.15], chest:[0.1], head:[-0.05], drop:-0.15});
const S_ = (o) => P(o, STANCE);
const POSE = {
  stand: P({}), stance: STANCE,
  thumbs: P({rSh:[-0.15,0,-0.38], lSh:[0,0,0.1], rEl:[-2.35], lEl:[-0.2], rHd:[0,-0.6,0], chest:[0,0.08,0], head:[0.05,0,0.09], hR:'thumb'}),
  peace: P({rSh:[-0.25,0,-0.35], rEl:[-2.45], rHd:[0,0.3,0], lSh:[-0.35,0,0.05], lEl:[-1.25], head:[0,0.1,0.12], chest:[0,0.1,0], hR:'peace'}),
  air: S_({rHp:[-0.9,0,-0.1], rKn:[1.4], lHp:[-0.3,0,0.1], lKn:[0.8], rSh:[-0.6,0,-0.5], lSh:[-0.5,0,0.5], rEl:[-0.8], lEl:[-0.8], drop:0}),
  squat: S_({rHp:[-0.6], lHp:[-0.5], rKn:[1.0], lKn:[0.9], chest:[0.35], drop:-0.7}),
  hurt: S_({rSh:[-0.2,0,-2.0], lSh:[0.3,0,2.1], rEl:[-0.5], lEl:[-0.4], chest:[-0.4,0,0.2], head:[0.4], rHp:[-0.6], lHp:[0.4], rKn:[0.6], lKn:[0.3], drop:0}),
  dizzy: S_({head:[0.25,0,0.3], chest:[0.15,0,0.15], rSh:[0,0,-0.3], lSh:[0,0,0.3], rEl:[-0.1], lEl:[-0.1], drop:-0.1}),
  sob: S_({head:[0.55,0,0], chest:[0.35], rSh:[-1.6,0,0.3], lSh:[-1.6,0,-0.3], rEl:[-2.3], lEl:[-2.3], drop:-0.2}),
  helpless: S_({rSh:[0.2,0,-0.5], lSh:[0.2,0,0.5], rEl:[0], lEl:[0], rHp:[0.2], lHp:[-0.2], rKn:[0.2], lKn:[0.2], drop:0, head:[0.3]}),
  shieldW: S_({rSh:[-1.3,0,0.45], lSh:[-1.3,0,-0.45], rEl:[-1.9], lEl:[-1.9], drop:-0.35, rKn:[0.5], lKn:[0.5], rHp:[-0.4], lHp:[-0.2], chest:[0.25]}),
  old: P({rSh:[-0.5,0,-0.15], rEl:[-0.4], lSh:[0.55,0,0.1], lEl:[-1.4], rHp:[-0.25,0,-0.05], lHp:[-0.25,0,0.05], rKn:[0.35], lKn:[0.35], chest:[0.55], head:[-0.5,0,0.06], drop:-0.14}),
  jabR: S_({rSh:[-1.55,0,0], rEl:[-0.1], chest:[0.1,0.45,0]}),
  jabL: S_({lSh:[-1.55,0,0], lEl:[-0.1], chest:[0.1,-0.45,0]}),
  laughIn: S_({chest:[0.3], head:[0.3], rSh:[-0.3,0,-0.3], lSh:[-0.3,0,0.3]}),
  laugh: S_({rSh:[-0.2,0,-1.3], lSh:[-0.2,0,1.3], rEl:[-0.3], lEl:[-0.3], chest:[-0.35], head:[-0.55]}),
  punch2: S_({rSh:[-1.6,0,0], rEl:[0], lSh:[-1.6,0,0], lEl:[0], chest:[0.25], rHp:[-0.7], rKn:[0.4], lHp:[0.4], drop:-0.35}),
  batWind: S_({chest:[0,-1.0,0], rSh:[-1.2,0,-0.2], lSh:[-1.3,0,0.4], rEl:[-1.3], lEl:[-1.5], drop:-0.25, rHp:[-0.3], rKn:[0.4]}),
  batHit: S_({chest:[0.1,1.0,0], rSh:[-1.55,0,0], lSh:[-1.55,0,0], rEl:[-0.1], lEl:[-0.2], lHp:[-0.5], lKn:[0.3], drop:-0.25}),
  upWind: S_({rSh:[0.4,0,-0.3], lSh:[0.4,0,0.3], rEl:[-0.4], lEl:[-0.4], drop:-0.6, rKn:[0.8], lKn:[0.8], rHp:[-0.6], lHp:[-0.6], chest:[0.4]}),
  upHit: S_({rSh:[-3.0,0,-0.15], lSh:[-3.0,0,0.15], rEl:[-0.1], lEl:[-0.1], chest:[-0.2], head:[-0.3], rHp:[0], lHp:[0], rKn:[0], lKn:[0], drop:0.1}),
  slide: S_({rHp:[-1.45,0,-0.05], lHp:[-1.1,0,0.1], rKn:[0.1], lKn:[0.6], chest:[-0.75], rSh:[-0.3,0,-0.9], lSh:[0.4,0,0.9], drop:-2.0}),
  nair: S_({rSh:[0,0,-1.5], lSh:[0,0,1.5], rEl:[0], lEl:[0], rHp:[-0.5,0,-0.5], lHp:[0.5,0,0.5], rKn:[0], lKn:[0], drop:0}),
  fair: S_({rSh:[-1.6,0,0], rEl:[-0.1], lSh:[0.3,0,0.4], rHp:[-1.2], rKn:[0.1], lHp:[0.2], lKn:[0.9], chest:[0.2,0.3,0], drop:0}),
  dair: S_({rSh:[-2.8,0,-0.2], lSh:[-2.8,0,0.2], rEl:[-0.3], lEl:[-0.3], rHp:[0.1], lHp:[-0.1], rKn:[0], lKn:[0], chest:[-0.1], drop:0}),
  dairHit: S_({rSh:[-0.6,0,-0.1], lSh:[-0.6,0,0.1], rEl:[-0.2], lEl:[-0.2], rHp:[-0.2], lHp:[-0.2], rKn:[0], lKn:[0], drop:0, chest:[0.4]}),
  throwWind: S_({rSh:[-2.8,0,-0.3], rEl:[-1.4], chest:[-0.15,-0.5,0], lSh:[-1.2,0,0.3]}),
  throwHit: S_({rSh:[-1.2,0,-0.1], rEl:[-0.2], chest:[0.35,0.5,0], lSh:[0.2,0,0.3]}),
  piano: S_({rSh:[-1.15,0,0.15], lSh:[-1.15,0,-0.15], rEl:[-0.7], lEl:[-0.7], chest:[0.2], head:[0.15], hR:'peace', hL:'peace', drop:-0.1}),
  laughUp: S_({rSh:[-2.6,0,-0.5], lSh:[-2.6,0,0.5], rEl:[-0.2], lEl:[-0.2], chest:[-0.4], head:[-0.6], rHp:[-0.3], rKn:[0.9], lKn:[0.3], drop:0}),
  spikeWind: S_({rSh:[-3.0,0,-0.4], rEl:[-1.7], lSh:[-2.4,0,0.3], lEl:[-0.3], chest:[-0.35,-0.4,0], drop:0}),
  spikeHit: S_({rSh:[-1.0,0,-0.15], rEl:[-0.05], lSh:[-0.4,0,0.3], chest:[0.45,0.4,0], drop:0}),
  block: S_({rSh:[-3.05,0,-0.05], lSh:[-3.05,0,0.05], rEl:[0], lEl:[0], rHp:[0], lHp:[0], rKn:[0], lKn:[0], drop:0.15, hR:'peace', hL:'peace'}),
  dive: S_({chest:[1.3], rSh:[-1.6,0,0.15], lSh:[-1.6,0,-0.15], rEl:[0], lEl:[0], rHp:[0.5], lHp:[0.4], rKn:[0.3], lKn:[0.2], drop:-2.2, head:[-0.6]}),
  serveWind: S_({lSh:[-2.9,0,0.2], lEl:[0], rSh:[-2.6,0,-0.4], rEl:[-1.6], chest:[-0.2,-0.4,0]}),
  serveHit: S_({rSh:[-1.4,0,-0.1], rEl:[0], lSh:[-0.3,0,0.2], chest:[0.3,0.4,0]}),
  inject: S_({rSh:[-1.55,0,0], rEl:[0], lSh:[0.4,0,0.3], chest:[0.3,0.4,0], rHp:[-0.6], rKn:[0.5], lHp:[0.5], drop:-0.4}),
  setUp: S_({rSh:[-2.9,0,-0.2], lSh:[-2.9,0,0.2], rEl:[-0.6], lEl:[-0.6], drop:0, rHp:[-0.3], rKn:[0.6]}),
  guitar: S_({lSh:[-1.0,0,-0.45], lEl:[-1.25], rSh:[-0.45,0,0.35], rEl:[-1.55], head:[0.45,0,0.1], chest:[0.15], drop:-0.1, hL:'peace'}),
  salute: P({rSh:[-0.5,0,-1.35], rEl:[-1.9], drop:0}),
  hang: P({rSh:[-2.75,0,-0.25], lSh:[-2.75,0,0.25], rEl:[-0.2], lEl:[-0.2], rHp:[-0.3,0,-0.05], lHp:[0.1,0,0.05], rKn:[0.5], lKn:[0.2], chest:[0.15], head:[-0.3], drop:0}),
  // Karl（白狗）
  sprint: S_({chest:[0.65], head:[-0.45], rSh:[0.9,0,-0.25], lSh:[0.9,0,0.25], rEl:[-0.5], lEl:[-0.5], rHp:[-1.2], lHp:[0.55], rKn:[0.5], lKn:[1.0], drop:-0.35}),
  climbUp: S_({rSh:[-3.0,0,-0.15], rEl:[-0.3], lSh:[-1.5,0,0.35], lEl:[-1.3], rHp:[-1.3], rKn:[1.5], lHp:[0.15], lKn:[0.3], chest:[0.25], head:[-0.4], drop:0}),
  climbUp2: S_({lSh:[-3.0,0,0.15], lEl:[-0.3], rSh:[-1.5,0,-0.35], rEl:[-1.3], lHp:[-1.3], lKn:[1.5], rHp:[0.15], rKn:[0.3], chest:[0.25], head:[-0.4], drop:0}),
  bookUp: S_({rSh:[-3.0,0,-0.1], lSh:[-3.0,0,0.1], rEl:[-0.7], lEl:[-0.7], chest:[-0.3], head:[-0.2], drop:0}),
  bookSlam: S_({rSh:[-0.9,0,-0.05], lSh:[-0.9,0,0.05], rEl:[-0.1], lEl:[-0.1], chest:[0.75], head:[0.25], rHp:[-0.8], lHp:[-0.5], rKn:[1.1], lKn:[0.9], drop:-0.8}),
  selfie: S_({rSh:[-1.75,0,-0.35], rEl:[-0.9], lSh:[-0.4,0,0.45], lEl:[-1.6], head:[0.1,0.3,0.18], chest:[0.05,0.2,0], drop:-0.1}),
  ponder: S_({rSh:[-1.25,0,0.55], rEl:[-2.05], lSh:[-0.5,0,0.25], lEl:[-1.9], head:[0.2,-0.2,0.28], chest:[0.15], drop:-0.25, rKn:[0.4], lKn:[0.3], rHp:[-0.3], lHp:[-0.15]}),
  cheer: P({rSh:[-2.9,0,-0.45], lSh:[-2.9,0,0.45], rEl:[-0.25], lEl:[-0.25], head:[-0.35], chest:[-0.15], drop:0}),
};
const HAND = { fist:{th:[-0.12,0.17], f:0.001, fy:-0.2}, thumb:{th:[-0.42,0.04], f:0.001, fy:-0.2}, peace:{th:[-0.16,0.15], f:1, fy:-0.45} };
function runPose(ph){
  const s = Math.sin(ph);
  return S_({rHp:[-s*0.9,0,-0.05], lHp:[s*0.9,0,0.05], rKn:[Math.max(0,s)*1.1+0.2,0,0], lKn:[Math.max(0,-s)*1.1+0.2,0,0],
    rSh:[s*0.8,0,-0.15], lSh:[-s*0.8,0,0.15], rEl:[-1.2], lEl:[-1.2], chest:[0.25], head:[-0.15], drop:-0.1+Math.abs(Math.cos(ph))*0.15});
}
function applyPose(m, Pz, k){
  for (const n in m.joints){ const o = m.joints[n].rotation, t = Pz[n]; o.x += (t[0]-o.x)*k; o.y += (t[1]-o.y)*k; o.z += (t[2]-o.z)*k; }
  m.hips.rotation.y += (Pz.turn - m.hips.rotation.y)*k;
  m.hips.position.y += (3.3 + Pz.drop - m.hips.position.y)*k;
  [[m.R, Pz.hR],[m.Lf, Pz.hL]].forEach(([arm, name])=>{
    const H = HAND[name];
    arm.th.position.y += (H.th[0]-arm.th.position.y)*k; arm.th.position.z += (H.th[1]-arm.th.position.z)*k;
    arm.f.forEach(f=>{ f.scale.y += (H.f-f.scale.y)*k; f.scale.x = f.scale.z = Math.max(0.001, f.scale.y); f.position.y += (H.fy-f.position.y)*k; });
  });
}

/* =================== characters & moves =================== */
// Characters live in characters/*.js and maps in maps/*.js; each file calls registerChar / registerMap.
const CHARS = {}, CHAR_ORDER = [], MAP_ORDER = [];
function registerChar(kind, d){
  CHARS[kind] = d; CHAR_ORDER.push(kind);
  CH[kind] = d.stats; MV[kind] = d.moves;
  Object.assign(FIRE, d.fire || {}); Object.assign(START, d.start || {}); Object.assign(ONHIT, d.onhit || {});
  Object.assign(POSE, d.poses || {}); Object.assign(SFX, d.sfx || {});
}
function registerMap(id, M){ MAPS[id] = M; MAP_ORDER.push(id); M.group.visible = false; }
const CH = {};
const JAB1 = {t:[.05,.07,.12], pose:['jabR','jabR'], box:[1.7,3.7,1.15], dmg:3, kb:4, sc:.12, ang:30};
const JAB2 = {t:[.05,.07,.14], pose:['jabL','jabL'], box:[1.7,3.7,1.15], dmg:3, kb:4, sc:.12, ang:30};
const MV = {};

/* =================== game state =================== */
const G = { mode:'menu', fighters:[], projs:[], fx:[], parts:[], freeze:0, shake:0, flash:0, sepiaT:0, sepia:0, endT:0, finals:[], slowmo:0, zoom:0, victim:null };
const popsEl = document.getElementById('pops');
const v3 = new THREE.Vector3();
const recentPops = [];
function pop(text, x, y, cls){
  v3.set(x, y, 0).project(camera);
  let px = (v3.x*.5+.5)*innerWidth, py = (-v3.y*.5+.5)*innerHeight;
  // nudge upward if another label just appeared at the same spot
  const now = performance.now(), big = cls && cls.includes('big');
  for (let i=recentPops.length-1;i>=0;i--) if (now - recentPops[i].t > 650) recentPops.splice(i,1);
  for (let tries=0; tries<6; tries++){
    const hit = recentPops.some(r=>Math.abs(r.x - px) < (big || r.big ? 150 : 80) && Math.abs(r.y - py) < (big || r.big ? 40 : 28));
    if (!hit) break; py -= big ? 42 : 30;
  }
  recentPops.push({x:px, y:py, t:now, big});
  const el = document.createElement('div'); el.className = 'pop' + (cls ? ' '+cls : ''); el.textContent = text;
  el.style.left = px + 'px'; el.style.top = py + 'px';
  popsEl.appendChild(el); setTimeout(()=>el.remove(), 1000);
}
const banners = [];
function banner(text){
  const el = document.createElement('div'); el.className = 'banner'; el.textContent = text;
  let row = 0; while (banners.some(b=>b.row===row)) row++;
  el.style.top = `calc(30% + ${row*1.25}em)`;
  const rec = {el, row}; banners.push(rec);
  document.body.appendChild(el);
  setTimeout(()=>{ el.remove(); banners.splice(banners.indexOf(rec),1); }, 1700);
}
const partGeo = new THREE.BoxGeometry(.28,.28,.28), partMats = {};
function burst(x, y, color, n, spd){
  const mat = partMats[color] || (partMats[color] = new THREE.MeshBasicMaterial({color}));
  for (let i=0;i<n;i++){
    const m = new THREE.Mesh(partGeo, mat); m.position.set(x, y, (Math.random()-.5)*1.5); scene.add(m);
    const a = Math.random()*Math.PI*2;
    G.parts.push({m, vx:Math.cos(a)*spd*(.4+Math.random()), vy:Math.sin(a)*spd*(.4+Math.random())+spd*.3, life:.45+Math.random()*.35, g:30});
  }
}
function drip(x, y, color){
  const mat = partMats[color] || (partMats[color] = new THREE.MeshBasicMaterial({color}));
  const m = new THREE.Mesh(partGeo, mat); m.position.set(x, y, .6); m.scale.setScalar(.7); scene.add(m);
  G.parts.push({m, vx:(Math.random()-.5)*2, vy:2, life:.6, g:22});
}
function spark(x, y, s){
  const sp = spriteOf(starTex, s); sp.position.set(x, y, 1); scene.add(sp);
  G.fx.push({o:sp, t:0, life:.18, grow:s*2.2, base:s});
}

/* =================== projectiles =================== */
function proj(o){
  o.t = 0; o.mesh.position.set(o.x, o.y, .4); scene.add(o.mesh);
  o.y0 = o.y; G.projs.push(o); return o;
}
const FIRE = {};
const START = {};
const ONHIT = {};

/* =================== fighter =================== */
const BLAST = () => MAIN.x2 + 22;
const SLOTCOL = [0xff7a3d,0x4fa3ff,0x5fd36a,0xd070e0];
function spawnX(i){ const n = sel.count; return MAPK*(n===2 ? (i===0 ? -7 : 7) : n===3 ? [-10,0,10][i] : [-12,-4,4,12][i]); }
function nearestFoe(f){ let best = null, bd = 1e9; for (const o of G.fighters){ if (o===f || o.state==='dead') continue; const d = Math.abs(o.x-f.x) + Math.abs(o.y-f.y)*.5; if (d < bd){ bd = d; best = o; } } return best || G.fighters.find(o=>o!==f); }
let recoverHintShown = false;
class Fighter{
  constructor(slot, model, ctrl){
    this.slot = slot; this.m = model; this.kind = model.kind; this.D = CH[this.kind]; this.M = MV[this.kind]; this.ctrl = ctrl;
    this.color = SLOTCOL[slot];
    this.marker = spriteOf(markTex, .9, this.color); scene.add(this.marker);
    this.aura = new THREE.Mesh(new THREE.SphereGeometry(3.4,12,8), new THREE.MeshBasicMaterial({color:0xf2c14e, transparent:true, opacity:.16, depthWrite:false, fog:false})); scene.add(this.aura);
    this.C = CHARS[this.kind];
    if (this.C.shield) this.shieldMesh = this.C.shield();
    else this.shieldMesh = new THREE.Mesh(new THREE.SphereGeometry(3.3,12,8), new THREE.MeshBasicMaterial({color:0xbfe0ff, transparent:true, opacity:.22, depthWrite:false}));
    scene.add(this.shieldMesh);
    this.hitSet = new Set();
    this.stocks = sel.stocks;
    this.reset(spawnX(slot));
  }
  dispose(){ [this.marker, this.aura, this.shieldMesh].forEach(o=>scene.remove(o)); }
  reset(x){
    Object.assign(this, {x, y:0, vx:0, vy:0, face: x<0?1:-1, pct:0, meter:0, state:'idle', onGround:true, jumps:this.D.jumps, move:null, moveT:0,
      hitstun:0, invuln:0, shieldHP:50, slowT:0, feverT:0, sadT:0, stunT:0, squish:0, dropT:0, floatT:0, bAtk:0, bSp:0, bJump:0, bFin:0,
      jabN:0, jabT:9, ph:0, oldK:0, brokeShield:false, ff:false, sobbing:0, deadT:0, finalT:0, armorHits:0,
      ledgeCD:0, ledgeT:0, ledgeSide:1, combo:0, comboT:0, comboV:null});
    this.m.holder.visible = true;
  }
  hittable(){ return this.state!=='dead' && this.invuln<=0; }
  startMove(id){
    const m = this.M[id]; if (!m) return;
    this.move = m; this.moveId = id; this.moveT = 0; this.state = 'move'; this.hitSet.clear(); this.boxPhase = 0; this.fired = 0;
    if (m.start) START[m.start](this);
    if (m.hop && this.onGround){ this.vy = m.hop; this.onGround = false; }
  }
  endMove(){
    const m = this.move; this.move = null;
    if (this.moveId && this.moveId.startsWith('jab')) this.jabT = 0;
    if (m && m.helpless && !this.onGround) this.state = 'helpless';
    else this.state = this.onGround ? 'idle' : 'air';
  }
  attack(I, dir){
    let id;
    if (this.onGround){
      if (I.u) id = 'up'; else if (I.d) id = 'down';
      else if (dir){ this.face = dir; id = 'side'; }
      else { this.jabN = this.jabT < .4 ? (this.jabN % 3) + 1 : 1; id = 'jab' + this.jabN; }
    } else id = I.u ? 'uair' : I.d ? 'dair' : dir ? 'fair' : 'nair';
    this.startMove(id);
  }
  special(I, dir){
    const id = I.u ? 'uB' : I.d ? 'dB' : dir ? 'sB' : 'nB';
    if (dir && id==='sB') this.face = dir;
    this.startMove(id);
  }
  jump(){
    if (this.onGround){ this.state = 'squat'; this.squatT = .06; }
    else if (this.jumps > 0){ this.vy = this.D.djV; this.jumps--; this.ff = false; SFX.jump(); burst(this.x, this.y, 0xf6eedf, 4, 5); }
    else if (this.state==='air'){ this.startMove('uB'); }  // out of jumps: jump again = recovery move
  }
  breakShield(){
    this.state = 'stun'; this.stunT = 2.2; this.brokeShield = true; this.shieldHP = 30; this.move = null;
    pop(this.C.breakText || '破防了！', this.x, this.y+7.5, 'red'); SFX.boom();
    burst(this.x, this.y+3, this.C.breakColor || 0xbfe0ff, 14, 12);
  }
  ko(){
    const cx = Math.max(-30, Math.min(30, this.x)), cy = Math.max(-14, Math.min(34, this.y));
    burst(cx, cy+2, this.color, 30, 22); burst(cx, cy+2, 0xffffff, 16, 16);
    SFX.ko(); G.flash = .55; G.shake = reduce ? .2 : 1.2;
    this.stocks--; this.state = 'dead'; this.deadT = 1.3; this.m.holder.visible = false; this.move = null;
    banner('KO!');
    if (this.stocks <= 0){ this.deadT = 999; const alive = G.fighters.filter(f=>f.stocks > 0); if (alive.length <= 1){ G.endT = 1.8; G.winner = alive[0] || this; G.lastOut = this; } }
  }
  respawn(){
    Object.assign(this, {x:0, y:13, vx:0, vy:0, pct:0, state:'air', floatT:2, invuln:2.6, jumps:this.D.jumps, move:null, onGround:false, slowT:0, feverT:0, sadT:0, brokeShield:false});
    this.m.holder.visible = true;
  }

  update(dt, I){
    const D = this.D;
    if (I.atk) this.bAtk = .12; if (I.sp) this.bSp = .12; if (I.jump) this.bJump = .12; if (I.fin) this.bFin = .12;
    this.bAtk -= dt; this.bSp -= dt; this.bJump -= dt; this.bFin -= dt;
    this.jabT += dt; this.invuln -= dt; this.slowT -= dt; this.sadT -= dt; this.dropT -= dt; this.squish -= dt; this.sobbing -= dt;
    this.ledgeCD -= dt; this.comboT -= dt;
    if (this.state==='dead'){ this.deadT -= dt; if (this.deadT<=0) this.respawn(); return; }
    if (this.feverT > 0){
      this.feverT -= dt;
      if (this.feverT <= 0){ this.pct += 6; this.state = 'stun'; this.stunT = .8; this.move = null; pop('發燒！', this.x, this.y+7.5, 'red'); burst(this.x, this.y+6, 0xdddddd, 8, 4); }
    }
    if (this.slowT > 0 && Math.random() < dt*6) drip(this.x+(Math.random()-.5)*1.5, this.y+2+Math.random()*3, 0x7a3e12);
    const slow = this.slowT > 0 ? .55 : 1;
    const dir = (I.r?1:0) - (I.l?1:0);

    if (this.floatT > 0){
      this.floatT -= dt;
      if (dir || I.jump || I.atk || I.sp || I.d) this.floatT = 0;
      if (this.floatT > 0){ this.vx = 0; this.vy = 0; return; }
    }

    if (this.state==='ledge'){
      this.ledgeT += dt;
      const toward = dir === -this.ledgeSide;
      const edgeX = this.ledgeSide<0 ? MAIN.x1 : MAIN.x2;
      if (I.jump || I.u || toward || I.atk || I.sp || this.ledgeT > 2.5){
        if (I.d || dir === this.ledgeSide){ this.state = 'air'; this.ledgeCD = .6; this.x = edgeX + this.ledgeSide*1.2; }
        else {
          // hop up onto the stage
          this.x = edgeX - this.ledgeSide*1.0; this.y = 0.3; this.vx = -this.ledgeSide*6; this.vy = I.jump ? 26 : 15; this.onGround = false;
          this.state = 'air'; this.invuln = Math.max(this.invuln, .45); this.ledgeCD = .6; this.jumps = this.D.jumps - 1;
          burst(this.x, 0.3, 0xcfc2a8, 6, 6); SFX.jump();
          if (I.atk){ this.face = -this.ledgeSide; this.startMove('nair'); }
        }
      } else if (I.d || dir === this.ledgeSide){ this.state = 'air'; this.ledgeCD = .6; this.x = edgeX + this.ledgeSide*1.2; }
      return;
    }
    const canAct = this.state==='idle' || this.state==='run' || this.state==='air';
    // turn toward the opponent when attacking without a direction
    if (canAct && !dir && (this.bAtk>0 || this.bSp>0)){
      const o = nearestFoe(this);
      if (o && o.state!=='dead' && Math.abs(o.x - this.x) < 14) this.face = Math.sign(o.x - this.x) || this.face;
    }
    if (canAct){
      if (this.bFin>0 && this.meter>=100){ this.bFin = 0; startFinal(this); return; }
      if (I.shield && this.onGround && this.shieldHP > 5){ this.state = 'shield'; SFX.shield(); }
      else if (this.bAtk>0){ this.bAtk = 0; this.attack(I, dir); }
      else if (this.bSp>0){ this.bSp = 0; this.special(I, dir); }
      else if (this.bJump>0){ this.bJump = 0; this.jump(); }
      else if (this.onGround && I.d && this.onPlat && !I.shield){ this.dropT = .25; this.onGround = false; this.y -= .05; this.state = 'air'; }
    }

    switch (this.state){
      case 'squat':
        if (this.bAtk>0){ this.bAtk = 0; this.attack(I, dir); break; }
        if (this.bSp>0){ this.bSp = 0; this.special(I, dir); break; }
        this.squatT -= dt;
        if (this.squatT <= 0){ this.vy = D.jumpV; this.onGround = false; this.state = 'air'; this.jumps = D.jumps-1; this.ff = false; SFX.jump(); }
        break;
      case 'shield':
        this.shieldHP -= 13*dt;
        if (!I.shield || !this.onGround) this.state = this.onGround ? 'idle' : 'air';
        else if (this.bJump>0){ this.bJump = 0; this.state = 'idle'; this.jump(); }
        if (this.shieldHP <= 0) this.breakShield();
        break;
      case 'move': {
        const m = this.move, st = m.t[0], tot = m.t[0]+m.t[1]+m.t[2];
        const prev = this.moveT; this.moveT += dt;
        if (prev < st && this.moveT >= st){
          if (m.dash) this.vx = this.face*m.dash;
          if (m.text) pop(m.text, this.x, this.y+7, m.textCls);
          if (m.sfx) SFX[m.sfx]();
          if (m.cry) this.sobbing = m.t[1]+m.t[2];
        }
        if (m.fire) while (this.fired < m.fire.length && this.moveT >= m.fire[this.fired][0]){ FIRE[m.fire[this.fired][1]](this); this.fired++; }
        if (m.box2 && this.boxPhase===0 && this.moveT >= m.box2.at){ this.boxPhase = 1; this.hitSet.clear(); }
        if (m.start && this.moveT < .32){ this.vy = Math.max(this.vy, 30); if (Math.random() < .5) burst(this.x, this.y+.5, 0xfff3a0, 1, 3); }  // steady lift
        if (this.moveT >= tot) this.endMove();
        break;
      }
      case 'hitstun':
        this.hitstun -= dt;
        { const spd = Math.hypot(this.vx,this.vy);
          if (spd > 24){ burst(this.x, this.y+3, this.color, 1, 1.5); if (spd > 40) burst(this.x, this.y+3, 0xffffff, 1, 1); } }
        if (this.hitstun <= 0) this.state = this.onGround ? 'idle' : 'air';
        break;
      case 'stun':
        this.stunT -= dt;
        if (this.stunT <= 0){ this.state = this.onGround ? 'idle' : 'air'; this.brokeShield = false; }
        break;
      case 'final':
        this.finalT -= dt; this.vx *= Math.exp(-10*dt);
        if (this.finalT <= 0) this.state = this.onGround ? 'idle' : 'air';
        break;
    }
    if (this.state!=='shield') this.shieldHP = Math.min(50, this.shieldHP + 9*dt);
    if (this.state==='stuck') return;

    // horizontal
    const st = this.state;
    if (this.onGround && (st==='idle' || st==='run')){
      const target = dir*D.run*slow;
      this.vx += (target - this.vx)*Math.min(1, dt*22);
      if (dir && Math.abs(this.vx) > D.run*.8 && Math.random() < dt*8) burst(this.x - dir*.6, .2, 0xcfc2a8, 1, 2);
      if (dir){ this.face = dir; this.state = 'run'; } else this.state = 'idle';
    } else if (this.onGround && st==='move'){
      const m = this.move;
      if (!(m.dash && this.moveT < m.t[0]+m.t[1])) this.vx *= Math.exp(-10*dt);
    } else if (this.onGround){
      this.vx *= Math.exp(-(st==='hitstun' ? 4 : 12)*dt);
    } else if (st==='hitstun'){
      this.vx *= Math.exp(-1.4*dt);
    } else {
      const lim = D.air*slow;
      if (Math.abs(this.vx) > lim + .5) this.vx *= Math.exp(-1.6*dt);
      else if (!(st==='move' && this.move.dash && this.moveT < this.move.t[0]+this.move.t[1])) this.vx += (dir*lim - this.vx)*Math.min(1, dt*5);
    }
    // vertical
    if (!this.onGround){
      const g = st==='hitstun' ? 44 : (st==='helpless' || (st==='move' && this.move.helpless)) ? 50 : 76;
      this.vy -= g*dt;
      if ((st==='air' || st==='helpless') && I.d && this.vy < 4 && !this.ff){ this.ff = true; }
      const maxFall = this.ff ? 36 : 25;
      if (st!=='hitstun' && this.vy < -maxFall) this.vy = -maxFall;
      if (this.ff && st==='air') this.vy = Math.min(this.vy, -maxFall);
    }
    const px = this.x, py = this.y;
    this.x += this.vx*dt; this.y += this.vy*dt;
    // collisions
    let landed = null;
    const surfaces = this.dropT > 0 ? [MAIN] : [MAIN, ...PLATS];
    if (this.vy <= 0){
      for (const s of surfaces){
        if (this.x >= s.x1-.25 && this.x <= s.x2+.25 && py >= s.y-.001 && this.y <= s.y){ landed = s; break; }
      }
    }
    if (this.y < 0 && this.y > -6 && this.x > MAIN.x1 && this.x < MAIN.x2 && !landed){
      if (px <= MAIN.x1) { this.x = MAIN.x1-.01; this.vx = Math.min(0,this.vx); }
      else if (px >= MAIN.x2) { this.x = MAIN.x2+.01; this.vx = Math.max(0,this.vx); }
      else if (py < -5.9){ this.y = -6; this.vy = Math.min(0, -this.vy*0.3); }
    }
    // ledge grab: falling next to the stage edge
    const recovering = st==='helpless' || (st==='move' && this.move.helpless);
    if (!landed && this.ledgeCD <= 0 && ((st==='air' && this.vy <= 0) || recovering)){
      for (const side of [-1,1]){
        const ex = side<0 ? MAIN.x1 : MAIN.x2;
        if (Math.abs(this.x - ex) < 3.4 && this.y < 1.2 && this.y > -8.5 && (this.x - ex)*side > -0.8){
          this.state = 'ledge'; this.ledgeSide = side; this.ledgeT = 0; this.move = null; this.vx = this.vy = 0;
          this.x = ex + side*0.5; this.y = -4.6; this.face = -side; this.jumps = this.D.jumps; this.invuln = Math.max(this.invuln, .8);
          pop('抓到了！', this.x, this.y+7.5); SFX.shield();
          break;
        }
      }
    }
    const wasGround = this.onGround;
    if (landed){
      if (st==='hitstun' && this.vy < -22){ this.y = landed.y; this.vy = -this.vy*.45; this.onGround = false; burst(this.x, this.y, 0xcfc2a8, 6, 6); }
      else {
        this.y = landed.y; this.vy = 0; this.onGround = true; this.onPlat = landed!==MAIN; this.jumps = D.jumps; this.ff = false;
        if (!wasGround){
          if (st==='air' || st==='helpless') this.state = 'idle';
          if (st==='move' && this.move.air && this.moveT > .05) this.endMove();
          if (Math.abs(py-this.y) >= 0 && st!=='move') burst(this.x, this.y, 0xcfc2a8, 3, 3);
        }
      }
    } else {
      this.onGround = false;
      if (this.state==='idle' || this.state==='run' || this.state==='shield' || this.state==='squat') this.state = 'air';
    }
    if (!this.onGround && this.state!=='ledge' && this.ctrl!=='cpu' && !recoverHintShown && this.y < -3 && (this.x < MAIN.x1 || this.x > MAIN.x2)){
      recoverHintShown = true; banner(isTouch ? '搖桿推上＋必殺＝自救！' : '上＋必殺＝自救！');
    }
    if (Math.abs(this.x) > BLAST() || this.y < -24 || this.y > 48) this.ko();
  }

  activeBox(){
    const m = this.move; if (this.state!=='move' || !m) return null;
    if (m.box2 && this.boxPhase===1) return this.moveT < m.box2.at + m.box2.dur ? m.box2 : null;
    if (m.box && this.moveT >= m.t[0] && this.moveT < m.t[0]+m.t[1]) return m;
    return null;
  }

  animate(dt, t){
    const m = this.m;
    if (this.state==='dead'){ this.marker.visible = false; this.aura.visible = false; this.shieldMesh.visible = false; return; }
    let Pz, k = 1 - Math.exp(-dt*14);
    const s = this.state;
    if (s==='move'){
      const mv = this.move; const sw = mv.poseSwitch!==undefined ? mv.poseSwitch : mv.t[0];
      Pz = POSE[this.moveT < sw ? mv.pose[0] : mv.pose[1]]; k = 1 - Math.exp(-dt*30);
    }
    else if (s==='run'){ this.ph += dt*Math.abs(this.vx)*1.1; Pz = runPose(this.ph); }
    else if (s==='air') Pz = POSE.air;
    else if (s==='squat') Pz = POSE.squat;
    else if (s==='shield') Pz = POSE[this.C.shieldPose || 'shieldW'];
    else if (s==='hitstun' || s==='stuck') Pz = POSE.hurt;
    else if (s==='stun') Pz = this.sobbing > 0 ? POSE.sob : (this.brokeShield && this.C.brokePose) ? POSE[this.C.brokePose] : POSE.dizzy;
    else if (s==='helpless') Pz = POSE.helpless;
    else if (s==='ledge') Pz = POSE.hang;
    else if (s==='final') Pz = POSE[this.C.finalPose || 'laughUp'];
    else Pz = STANCE;
    applyPose(m, Pz, k);
    if (s==='stun') m.head.rotation.z += Math.sin(t*9)*0.01;
    if (s==='idle') m.chest.scale.y = 1 + Math.sin(t*3)*0.01;

    // ageing / faces
    const oldTarget = this.C.oldTarget ? this.C.oldTarget(this, s) : 0;
    this.oldK += (oldTarget - this.oldK)*(1-Math.exp(-dt*12));
    m.setOld(this.oldK);
    m.setFace(this.oldK > .5 ? 'old' : (this.sobbing > 0 ? 'cry' : 'normal'));
    if (this.C.animate) this.C.animate(this, m, s, t, dt);
    if (this.sobbing > 0 && Math.random() < dt*14) drip(this.x + this.face*.4, this.y+5.3, 0x9fd0ff);

    // props
    let prop = null;
    if (s==='move'){ const mv = this.move; prop = (this.moveT < mv.t[0] && mv.prop0) ? mv.prop0 : mv.prop || null; }
    if (s==='shield' && this.C.shieldProp) prop = this.C.shieldProp;
    if (s==='final' && this.C.finalProp) prop = this.C.finalProp;
    for (const n in m.props) m.props[n].visible = n===prop;

    // placement
    m.holder.position.set(this.x, this.y, 0);
    const ry = this.face * (Math.PI/2 - 0.4);
    let d = ry - m.holder.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
    m.holder.rotation.y += d * (1 - Math.exp(-dt*20));
    const sq = Math.max(0, this.squish) / .4;
    const wob = sq * Math.cos((1-sq)*14);
    m.body.scale.set(SC*(1+wob*.35), SC*(1-wob*.4), SC*(1+wob*.35));
    m.holder.visible = !(this.invuln > 0 && this.floatT <= 0) || Math.floor(t*14)%2===0;

    this.marker.visible = true;
    this.marker.position.set(this.x, this.y + 7.6 + Math.sin(t*4)*.15, 0);
    const full = this.meter >= 100;
    this.aura.visible = full || this.slowT > 0 || this.sadT > 0;
    this.aura.material.color.setHex(full ? 0xf2c14e : this.sadT > 0 ? 0x6fa8ff : 0x9a5a20);
    this.aura.material.opacity = .1 + Math.sin(t*10)*.06;
    this.aura.position.set(this.x, this.y+3, 0);
    this.shieldMesh.visible = s==='shield';
    if (s==='shield'){
      const r = .45 + .55*Math.max(0, this.shieldHP)/50;
      this.shieldMesh.scale.setScalar(r);
      if (this.C.shieldAnim) this.C.shieldAnim(this); else this.shieldMesh.position.set(this.x, this.y+3, 0);
    }
  }
}

/* =================== hits =================== */
function segDist(cx, cy, f){
  const y1 = f.y + 0.7, y2 = f.y + 5.3; const yy = Math.max(y1, Math.min(y2, cy));
  return Math.hypot(cx - f.x, cy - yy);
}
const ringGeo = new THREE.RingGeometry(.8, 1, 24);
function ring(x, y, s){
  const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({color:0xfff3c0, transparent:true, side:THREE.DoubleSide, depthWrite:false, fog:false}));
  m.position.set(x, y, 1.2); scene.add(m);
  G.fx.push({o:m, t:0, life:.32, grow:s, base:.5});
}
function launch(v, kb, angDeg, dirX){
  const a = angDeg*Math.PI/180, sp = kb*2.35;
  v.vx = Math.cos(a)*sp*dirX; v.vy = Math.sin(a)*sp;
  if (v.onGround && v.vy < 0) v.vy = -v.vy*.5;
  if (v.vy > 0){ v.onGround = false; v.y += .05; }
  v.state = 'hitstun'; v.hitstun = .12 + kb*.022; v.move = null; v.face = -dirX || v.face; v.ff = false;
  v.jumps = Math.max(v.jumps, 1);
}
function applyHit(att, v, h, dirX, hx, hy){
  if (!v.hittable()) return false;
  let dmg = h.dmg, kbBase = h.kb;
  if (att && att.sadT > 0){ dmg *= .7; kbBase *= .7; }
  if (att && att.buffT > 0){ dmg *= att.buffDmg || 1.3; kbBase *= att.buffKb || 1.15; }   // temporary power-up (e.g. 熊化)
  if (v.state==='shield'){
    v.shieldHP -= dmg*1.4; v.vx = dirX*7; SFX.shield(); spark(hx, hy, 1.2);
    if (att) att.meter = Math.min(100, att.meter + dmg*.3);
    if (v.shieldHP <= 0) v.breakShield();
    G.freeze = .04; return true;
  }
  const before = v.pct;
  v.pct = Math.min(999, v.pct + dmg);
  if (att){ att.meter = Math.min(100, att.meter + dmg*1.1); }
  v.meter = Math.min(100, v.meter + dmg*.55);
  let kb = (kbBase + v.pct*h.sc*.12) / v.D.weight;
  const armored = v.state==='move' && v.move && v.move.armor && v.moveT < v.move.t[0] && kb < 26;
  spark(hx, hy, 1.4 + Math.min(2, kb*.06));
  burst(hx, hy, h.soft ? 0xdba04a : 0xfff3a0, h.soft ? 10 : 6, 9);
  if (h.soft){ v.squish = .4; SFX.soft(); pop('噗', hx, hy+1.5); } else SFX.hit(kb);
  if (h.slow){ v.slowT = h.slow; pop('黏黏的', v.x, v.y+7.5); }
  if (h.hr && before > 80 && !armored){ pop('全壘打！', v.x, v.y+8, 'big'); SFX.batCrack(); }
  pop('+' + Math.round(dmg) + '%', hx + (Math.random()-.5)*1.5, hy + 1.2, 'dmg');
  if (att){
    if (att.comboT > 0 && att.comboV === v) att.combo++; else att.combo = 1;
    att.comboV = v; att.comboT = 1.1;
    if (att.combo >= 3) pop(att.combo + ' HIT!', att.x, att.y + 9, 'big');
  }
  G.victim = v;
  G.freeze = Math.min(.2, .05 + dmg*.007);
  G.shake = Math.max(G.shake, reduce ? .1 : Math.min(1, kb*.032));
  const killish = kb*2.35 > 50 || (v.pct > 100 && kb > 16);
  if (!armored && (kb >= 20 || killish)){
    G.zoom = killish ? 1 : .55; G.slowmo = killish ? .55 : .18;
    G.flash = Math.max(G.flash, killish ? .35 : .15);
    ring(hx, hy, killish ? 7 : 4.5); SFX.boom();
    if (killish) pop('致命一擊！', v.x, v.y + 9.5, 'big');
  }
  if (armored){ pop('硬吃！', v.x, v.y+7.5, 'red'); return true; }
  launch(v, kb, h.ang, dirX);
  if (h.onHit) ONHIT[h.onHit](att, v);
  return true;
}
function checkHits(){
  for (const a of G.fighters){
    const b = a.activeBox(); if (!b) continue;
    const hx = a.x + a.face*b.box[0], hy = a.y + b.box[1];
    for (const v of G.fighters){
      if (v===a || a.hitSet.has(v)) continue;
      if (segDist(hx, hy, v) < b.box[2] + 1.35){ a.hitSet.add(v); applyHit(a, v, b, a.face, (hx+v.x)/2, Math.max(v.y+1, Math.min(v.y+5, hy))); }
    }
  }
}
function updateProjs(dt, t){
  for (let i=G.projs.length-1; i>=0; i--){
    const p = G.projs[i];
    p.t += dt; p.life -= dt;
    p.vy -= (p.g||0)*dt;
    if (p.drag){ p.vx *= Math.exp(-p.drag*dt); p.vy *= Math.exp(-p.drag*dt); }
    p.x += p.vx*dt; p.y += p.vy*dt;
    let yy = p.y; if (p.wave) yy += Math.sin(p.t*12)*p.wave*.5;
    p.mesh.position.set(p.x, yy, .4);
    if (p.spin){ p.mesh.rotation.z -= Math.sign(p.vx)*dt*12; p.mesh.rotation.x += dt*3; }
    let dead = p.life <= 0;
    if (!dead && p.y - p.r <= 0 && p.y > -2 && p.x > MAIN.x1 && p.x < MAIN.x2 && p.vy < 0){
      if (p.bounce > 0){ p.bounce--; p.vy = -p.vy*.55; p.vx *= .8; p.y = p.r; SFX.soft(); p.mesh.scale.set(1.3,.6,1.3); setTimeout(()=>p.mesh.scale.set(1,1,1),90); }
      else dead = true;
    }
    if (!dead){
      for (const v of G.fighters){
        if (v===p.owner || !v.hittable()) continue;
        if (segDist(p.x, yy, v) < p.r + 1.0){ applyHit(p.owner, v, p, Math.sign(p.vx)||p.owner.face, p.x, yy); dead = true; break; }
      }
    }
    if (dead){ scene.remove(p.mesh); G.projs.splice(i,1); if (p.soft) burst(p.x, yy, 0xdba04a, 5, 5); }
  }
}

/* =================== finals =================== */
function other(f){ return nearestFoe(f); }
function startFinal(f){
  f.meter = 0; f.state = 'final'; f.move = null; f.vx = 0; G.flash = .6;
  f.C.final(f, other(f));
}
// every entry in G.finals has update(F, dt, t) → true when finished, and optional dispose(F)
function disposeFinal(F){ if (F.dispose) F.dispose(F); else if (F.mesh) scene.remove(F.mesh); }
function updateFinals(dt, t){
  for (let i=G.finals.length-1; i>=0; i--){
    const F = G.finals[i]; F.t += dt;
    if (F.update(F, dt, t)){ disposeFinal(F); G.finals.splice(i,1); }
  }
}

/* =================== results screen =================== */
const RS_Y = 150;
const RS = new THREE.Group(); RS.position.y = RS_Y; RS.visible = false; scene.add(RS);
function burstTex(hex){
  return tex(128,128,(g)=>{
    const c = '#' + hex.toString(16).padStart(6,'0');
    g.fillStyle = '#1b1310'; g.fillRect(0,0,128,128);
    for (let i=0;i<24;i++){
      const a0 = i/24*Math.PI*2, a1 = a0 + Math.PI/24;
      g.beginPath(); g.moveTo(64,64); g.arc(64,64,92,a0,a1); g.closePath();
      g.fillStyle = i%2 ? c : '#2a1d16'; g.globalAlpha = i%2 ? .55 : 1; g.fill(); g.globalAlpha = 1;
    }
    const gr = g.createRadialGradient(64,64,4,64,64,64); gr.addColorStop(0,'rgba(255,240,210,.85)'); gr.addColorStop(.35,'rgba(255,240,210,0)');
    g.fillStyle = gr; g.fillRect(0,0,128,128);
  });
}
const burstMats = { 0: new THREE.MeshBasicMaterial({map:burstTex(0xff7a3d), fog:false}), 1: new THREE.MeshBasicMaterial({map:burstTex(0x4fa3ff), fog:false}) };
burstMats[2] = new THREE.MeshBasicMaterial({fog:false, map: tex(128,128,(g)=>{
  g.fillStyle = '#1b1310'; g.fillRect(0,0,128,128);
  for (let i=0;i<24;i++){ const a0 = i/24*Math.PI*2, a1 = a0 + Math.PI/24;
    g.beginPath(); g.moveTo(64,64); g.arc(64,64,92,a0,a1); g.closePath(); g.fillStyle = ['#ff7a3d','#2a1d16','#4fa3ff','#2a1d16'][i%4]; g.globalAlpha = i%2 ? 1 : .55; g.fill(); g.globalAlpha = 1; }
  const gr = g.createRadialGradient(64,64,4,64,64,64); gr.addColorStop(0,'rgba(255,240,210,.7)'); gr.addColorStop(.3,'rgba(255,240,210,0)'); g.fillStyle = gr; g.fillRect(0,0,128,128);
})});
burstMats.s2 = new THREE.MeshBasicMaterial({map:burstTex(0x5fd36a), fog:false}); burstMats.s3 = new THREE.MeshBasicMaterial({map:burstTex(0xd070e0), fog:false});
const burstDisc = new THREE.Mesh(new THREE.CircleGeometry(120,32), burstMats[0]); burstDisc.position.set(2,8,-30); RS.add(burstDisc);
const resFloor = new THREE.Mesh(new THREE.CircleGeometry(30,24), L({map:cobbleTex})); resFloor.rotation.x = -Math.PI/2; RS.add(resFloor);
const loveTex = tex(16,16,(g)=>{ const H=['0110000110','1111001111','1111111111','1111111111','0111111110','0011111100','0001111000','0000110000']; H.forEach((r,y)=>[...r].forEach((c,x)=>{ if(c==='1'){ g.fillStyle = y<2 ? '#ffb3c8' : '#ff4f86'; g.fillRect(x+3,y+4,1,1); } })); });
const puffTex = tex(16,16,(g)=>{ g.fillStyle='#fff'; g.beginPath(); g.arc(8,8,7,0,7); g.fill(); });
POSE.sit = P({rHp:[-1.55,0,-0.08], lHp:[-1.55,0,0.08], rKn:[1.55], lKn:[1.55], chest:[0.4], head:[-0.25,0,0.1], rSh:[-0.45,0,-0.12], lSh:[-0.45,0,0.12], rEl:[-0.9], lEl:[-0.9], drop:-1.0});
POSE.flat = P({rSh:[0,0,-1.5], lSh:[0,0,1.5], rEl:[0], lEl:[0], rHp:[0,0,-0.4], lHp:[0,0,0.4], drop:0});
const SFX2 = {
  fanfare(){ [0,4,7,12,7,12,16,19].forEach((n,i)=>{ tone(NOTE(n), i===7 ? .7 : .17, 'sawtooth', .09, 1, i*.16); tone(NOTE(n-12), i===7 ? .7 : .17, 'square', .04, 1, i*.16); }); },
  cheer(){ for (let i=0;i<14;i++){ tone(900+Math.random()*700, .18, 'sine', .05, 1.4, i*.06); } noise(.9,.12,2800); },
  jet(){ noise(1.6,.25,500); },
  sigh(){ tone(330,.7,'sine',.12,.6); },
};
let RES = null;
const winTitle = document.getElementById('winTitle'), winName = document.getElementById('winName');
function startResults(){
  const W = G.winner, Lz = (G.lastOut && G.lastOut!==W) ? G.lastOut : G.fighters.find(f=>f!==W);
  G.mode = 'result'; hud.hidden = true; touchEl.hidden = true; quitEl.hidden = true; rotHint.hidden = true;
  G.projs.forEach(p=>scene.remove(p.mesh)); G.projs = [];
  G.finals.forEach(disposeFinal); G.finals = [];
  G.fighters.forEach(f=>{ f.marker.visible = false; f.aura.visible = false; f.shieldMesh.visible = false; });
  G.sepiaT = 0; G.slowmo = 0; G.zoom = 0;
  RS.visible = true; scene.fog.near = 400; scene.fog.far = 900;
  burstDisc.material = burstMats[W.slot < 2 ? W.slot : 's'+W.slot];
  const place = (f, x, z, ry)=>{
    const m = f.m; m.holder.visible = true; m.holder.position.set(x, RS_Y, z); m.holder.rotation.set(0, ry, 0);
    m.body.scale.setScalar(SC); m.setOld(0); m.setFace('normal'); for (const n in m.props) m.props[n].visible = false;
    applyPose(m, POSE.stand, 1);
  };
  place(W, -3.5, 0, 0.25); place(Lz, 9.5, -5, -0.35);
  let extra = 0; G.fighters.forEach(f=>{ if (f!==W && f!==Lz){ place(f, -10.5 - extra*3.4, -6 - extra, 0.5); extra++; } });
  RES = { t:0, W, Lz, items:[], puffs:[], attach:[], fired:{}, look:new THREE.Vector3(1.5, RS_Y+3.4, 0) };
  winName.textContent = W.D.name; winTitle.style.setProperty('--wc', 'var(--p'+(W.slot+1)+')'); winTitle.hidden = false;
  const CW = CHARS[W.kind], CL = CHARS[Lz.kind];
  if (CW.winSetup) CW.winSetup(RES);
  if (CL.loseSetup) CL.loseSetup(RES);
  SFX.ko();
  setTimeout(()=>{ if (G.mode==='result'){ overEl.hidden = false; } }, (CW.longWin || CL.longLose) ? 5800 : 3800);
}
function clearResults(){
  if (!RES) return;
  RES.puffs.forEach(p=>scene.remove(p.o));
  RES.items.concat(RES.attach).forEach(o=>{ if (o.parent) o.parent.remove(o); });
  RES = null; RS.visible = false; winTitle.hidden = true; applyMap(curMap);
}
function once(key, t, fn){ if (RES.t >= t && !RES.fired[key]){ RES.fired[key] = true; fn(); } }
function popAt(text, f, dy, cls){ const p = f.m.holder.position; pop(text, p.x, p.y + (dy||7.5), cls); }
function updateResults(dt, t){
  const R = RES; if (!R) return; R.t += dt;
  const W = R.W, Lz = R.Lz;
  burstDisc.rotation.z += dt*.12;
  const k = 1 - Math.exp(-dt*10);
  const CW = CHARS[W.kind], CL = CHARS[Lz.kind];
  if (CW.winUpdate) CW.winUpdate(R, dt, k); else applyPose(W.m, POSE.cheer, k);
  if (CL.loseUpdate) CL.loseUpdate(R, dt, k); else applyPose(Lz.m, POSE.dizzy, k);
  // puffs / hearts
  for (let i=R.puffs.length-1;i>=0;i--){ const p = R.puffs[i]; p.life -= dt; p.o.position.y += p.vy*dt; const s = p.o.scale.x + p.grow*dt; p.o.scale.set(s,s,1); p.o.material.opacity = Math.min(1, p.life); if (p.life <= 0){ scene.remove(p.o); R.puffs.splice(i,1); } }
  // camera
  const narrow = innerWidth/innerHeight < .8;
  camPos.lerp(v3.set(2.5, RS_Y + 4.6, narrow ? 40 : 25), 1-Math.exp(-dt*4));
  camLook.lerp(R.look, 1-Math.exp(-dt*5));
}

/* =================== input =================== */
const keys = {};
const GAME_KEYS = new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Comma','Period','Slash','Enter','NumpadEnter']);
addEventListener('keydown', e=>{
  if (G.mode==='play' && GAME_KEYS.has(e.code)) e.preventDefault();
  keys[e.code] = true;
  if (e.code==='Escape' && G.mode==='play'){ setPause(!G.paused); return; }
  if (G.mode==='select' && !e.repeat && !(e.target && e.target.tagName==='INPUT')){ if (selKey(e.code)) e.preventDefault(); }
});
addEventListener('keyup', e=>{ keys[e.code] = false; });
addEventListener('blur', ()=>{ for (const k in keys) keys[k] = false; for (const k in TS) TS[k] = false; });
const MAP = [
  {l:['KeyA'], r:['KeyD'], u:['KeyW','Space'], d:['KeyS'], atk:['KeyJ','KeyF'], sp:['KeyK','KeyG'], shield:['KeyL','KeyH'], fin:['KeyU','KeyR']},
  {l:['ArrowLeft'], r:['ArrowRight'], u:['ArrowUp'], d:['ArrowDown'], atk:['Comma','Numpad1'], sp:['Period','Numpad2'], shield:['Slash','Numpad3'], fin:['Enter','NumpadEnter','Numpad0']},
];
const TS = {l:false,r:false,u:false,d:false,atk:false,sp:false,shield:false,fin:false,jump:false};
const prevH = [{},{}];
function readHuman(slot){
  const M = MAP[slot], k = {};
  for (const key in M) k[key] = M[key].some(c=>keys[c]);
  const t = slot===0 ? TS : {};
  const h = {l:k.l||t.l, r:k.r||t.r, u:k.u||t.u, d:k.d||t.d, atk:k.atk||t.atk, sp:k.sp||t.sp, shield:k.shield||t.shield, fin:k.fin||t.fin, ku:k.u, tj:!!t.jump};
  const p = prevH[slot];
  const I = {l:h.l, r:h.r, u:h.u, d:h.d, shield:h.shield, jump:(h.ku && !p.ku) || (h.tj && !p.tj), atk:h.atk && !p.atk, sp:h.sp && !p.sp, fin:h.fin && !p.fin};
  prevH[slot] = h; return I;
}
document.querySelectorAll('#touch .tb').forEach(b=>{
  const k = b.dataset.t;
  const on = (e)=>{ e.preventDefault(); TS[k] = true; b.classList.add('on'); audioOn(); try{ b.setPointerCapture(e.pointerId); }catch(_){} padPress(k); };
  const off = (e)=>{ e.preventDefault(); TS[k] = false; b.classList.remove('on'); };
  b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off);
  b.addEventListener('contextmenu', e=>e.preventDefault());
});
// floating thumb-stick: touch anywhere on the left half
const stickEl = document.getElementById('stick'), knobEl = document.getElementById('knob'), zoneEl = document.getElementById('stickZone');
let stickId = null, sx0 = 0, sy0 = 0;
function stickHome(){
  const pad = document.body.classList.contains('pad');
  if (pad){
    stickEl.style.left = Math.max(140, innerWidth*0.2) + 'px';
    stickEl.style.top = Math.min(innerHeight - 120, Math.max(200, innerHeight*0.62)) + 'px';
  } else {
    stickEl.style.left = (110 + Math.max(0, parseFloat(getComputedStyle(document.documentElement).paddingLeft)||0)) + 'px';
    stickEl.style.top = (innerHeight - 120) + 'px';
  }
  stickEl.style.opacity = '.55'; knobEl.style.transform = '';
}
function stickSet(e){
  let dx = e.clientX - sx0, dy = e.clientY - sy0; const d = Math.hypot(dx,dy), mx = document.body.classList.contains('pad') ? 64 : 48;
  if (d > mx){ dx *= mx/d; dy *= mx/d; }
  knobEl.style.transform = `translate(${dx}px,${dy}px)`;
  const dz = document.body.classList.contains('pad') ? 18 : 14;
  TS.l = dx < -dz; TS.r = dx > dz; TS.u = dy < -dz*1.7; TS.d = dy > dz*1.7;
}
zoneEl.addEventListener('pointerdown', e=>{
  e.preventDefault(); audioOn(); stickId = e.pointerId; sx0 = e.clientX; sy0 = e.clientY;
  stickEl.style.left = sx0 + 'px'; stickEl.style.top = sy0 + 'px'; stickEl.style.opacity = '1';
  try{ zoneEl.setPointerCapture(e.pointerId); }catch(_){}
  stickSet(e);
});
zoneEl.addEventListener('pointermove', e=>{ if (e.pointerId===stickId){ e.preventDefault(); stickSet(e); } });
const stickEnd = (e)=>{ if (e.pointerId!==stickId) return; stickId = null; TS.l = TS.r = TS.u = TS.d = false; stickHome(); };
zoneEl.addEventListener('pointerup', stickEnd); zoneEl.addEventListener('pointercancel', stickEnd);
addEventListener('resize', ()=>{ if (stickId===null) stickHome(); });
stickHome();
const finBtn = document.getElementById('finBtn'), rotHint = document.getElementById('rotHint');
// ---- phone controller page: fixed 800x370 stage, scaled, rotated when the phone is upright ----
const padStage = document.getElementById('padStage'), pKnob = document.getElementById('pKnob'), pZone = document.getElementById('pZone'), pFin = document.getElementById('pFin');
const PW = 800, PH = 370; let padFit = {s:1, rot:false};
function fitPad(){
  const W = innerWidth, H = innerHeight, rot = H > W;
  let s, tx, ty, tf;
  if (!rot){ s = Math.min(W/PW, H/PH); tx = (W - PW*s)/2; ty = (H - PH*s)/2; tf = `translate(${tx}px,${ty}px) scale(${s})`; }
  else { s = Math.min(H/PW, W/PH); tx = (W + PH*s)/2; ty = (H - PW*s)/2; tf = `translate(${tx}px,${ty}px) rotate(90deg) scale(${s})`; }
  padStage.style.transform = tf; padFit = {s, rot};
}
addEventListener('resize', ()=>{ if (G.mode==='pad') fitPad(); });
let pStickId = null, pX0 = 0, pY0 = 0;
function pStickSet(e){
  let dX = e.clientX - pX0, dY = e.clientY - pY0;
  let dx = (padFit.rot ? dY : dX)/padFit.s, dy = (padFit.rot ? -dX : dY)/padFit.s;
  const d = Math.hypot(dx,dy), mx = 70; if (d > mx){ dx *= mx/d; dy *= mx/d; }
  pKnob.style.transform = `translate(${dx}px,${dy}px)`;
  TS.l = dx < -20; TS.r = dx > 20; TS.u = dy < -34; TS.d = dy > 34;
}
pZone.addEventListener('pointerdown', e=>{ e.preventDefault(); if (pStickId!==null) return; pStickId = e.pointerId; pX0 = e.clientX; pY0 = e.clientY; try{ pZone.setPointerCapture(e.pointerId); }catch(_){} pStickSet(e); });
pZone.addEventListener('pointermove', e=>{ if (e.pointerId===pStickId){ e.preventDefault(); pStickSet(e); } });
const pEnd = (e)=>{ if (e.pointerId!==pStickId) return; pStickId = null; TS.l = TS.r = TS.u = TS.d = false; pKnob.style.transform = ''; };
pZone.addEventListener('pointerup', pEnd); pZone.addEventListener('pointercancel', pEnd);
document.querySelectorAll('#padStage .pb').forEach(b=>{
  const k = b.dataset.p;
  b.addEventListener('pointerdown', e=>{ e.preventDefault(); TS[k] = true; b.classList.add('on'); try{ b.setPointerCapture(e.pointerId); }catch(_){} padPress(k); });
  const off = (e)=>{ e.preventDefault(); TS[k] = false; b.classList.remove('on'); };
  b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off);
  b.addEventListener('contextmenu', e=>e.preventDefault());
});
padStage.addEventListener('touchmove', e=>e.preventDefault(), {passive:false});

/* =================== party: phones as controllers =================== */
// Every phone keeps its stick/buttons in room presence (absolute state + press counters);
// the big screen reads them each frame. Presence needs no topic permissions.
let roomApi = null, party = null, roomWhy = '';
let roomPromise = null;
try {
  if (window.claude && typeof window.claude.use === 'function'){
    roomPromise = window.claude.use('room').then(r=>{ roomApi = r; if (!r) roomWhy = 'use=null'; return r; }).catch(e=>{ roomWhy = 'use:' + ((e && e.code) || 'error'); return null; });
  } else roomWhy = 'no-claude';
} catch(e){ roomWhy = 'no-claude'; }
// wait for the room namespace (it can arrive a few seconds after load)
async function getRoom(){
  if (roomApi) return roomApi;
  if (!roomPromise) return null;
  const r = await Promise.race([roomPromise, new Promise(r=>setTimeout(()=>r(null), 11000))]);
  if (r) return r;
  // one fresh attempt (e.g. after the viewer just allowed it)
  try { const again = await window.claude.use('room'); if (again){ roomApi = again; return again; } } catch(_){}
  return null;
}
// why can't we connect? read the permission state and offer the matching fix
async function roomDiag(){
  let pm = null, st = 'unknown';
  try { pm = window.claude && await window.claude.use('permissions'); } catch(_){}
  if (pm){ try { st = await pm.state('room'); } catch(_){} }
  const btns = document.querySelectorAll('.permBtn');
  btns.forEach(b=>{ b.hidden = true; b.onclick = null; });
  let hint = '';
  if (pm && st==='prompt'){
    hint = '請按下面的「允許連線」。';
    btns.forEach(b=>{ b.hidden = false; b.textContent = '允許連線';
      b.onclick = async ()=>{ const r = await pm.request(['room']); if (r && r.room==='granted'){ b.hidden = true; retryParty(); } else roomDiag(); }; });
  } else if (pm && st==='denied'){
    hint = '之前按過「不允許」，請按「打開權限設定」把連線打開。';
    btns.forEach(b=>{ b.hidden = false; b.textContent = '打開權限設定';
      b.onclick = async ()=>{ try { await pm.manage(); } catch(_){ setMsg('請從作品右上角的選單找「權限」，把連線打開，再重新整理。'); return; } const s2 = await pm.state('room'); if (s2==='granted') retryParty(); else roomDiag(); }; });
  } else if (st==='granted'){
    hint = '權限已開，但這個畫面沒接上連線，請重新整理再試。';
  } else {
    hint = '這個畫面不支援即時連線。請改用 Claude App，或在電腦瀏覽器登入 claude.ai 打開這個作品。';
  }
  return `${hint}（${roomWhy || 'error'} · ${st}）`;
}
function setMsg(t){ if (G.mode==='menu' && !joinUI.hidden) joinMsg.textContent = t; else partyMsg.textContent = t; }
function retryParty(){
  roomApi = null; roomWhy = '';
  try { roomPromise = window.claude.use('room').then(r=>{ roomApi = r; if (!r) roomWhy = 'use=null'; return r; }).catch(()=>null); } catch(_){}
  if (!joinUI.hidden) joinAsPad(); else { party = null; hostParty(); } }
// Direct phone<->screen link through PeerJS (used on GitHub Pages / anywhere claude.ai's room isn't available).
// Exposes the same small interface as the room channel: peers(), presence(), leave().
function peerChannel(code, role){
  return new Promise((resolve, reject)=>{
    if (typeof Peer === 'undefined') return reject({code:'no-peerjs', peer:true});
    const hostId = 'shizhi-brawl-' + code;
    let me;
    try { me = role==='host' ? new Peer(hostId, {debug:0}) : new Peer({debug:0}); } catch(e){ return reject({code:'no-peerjs', peer:true}); }
    let myPres = {code}, done = false;
    const conns = new Map();
    const ch = { kind:'peer', code,
      peers(){
        const list = [{peer: me.id || 'me', sameTab:true, presence:myPres}];
        conns.forEach((c,id)=>{ if (c.open) list.push({peer:id, sameTab:false, presence:c.pres || {}}); });
        return list;
      },
      presence(m){
        myPres = Object.assign({}, myPres, m, {code});
        for (const k in myPres) if (myPres[k]===null) delete myPres[k];
        conns.forEach(c=>{ if (c.open) try { c.send(myPres); } catch(_){} });
        return Promise.resolve();
      },
      leave(){ try { me.destroy(); } catch(_){} },
      connected(){ return !me.disconnected; },
    };
    const wire = (c)=>{
      c.pres = {}; conns.set(c.peer, c);
      c.on('data', d=>{ if (d && typeof d==='object') c.pres = d; });
      c.on('open', ()=>{ try { c.send(myPres); } catch(_){} });
      c.on('close', ()=>conns.delete(c.peer));
      c.on('error', ()=>conns.delete(c.peer));
    };
    const fail = (codeStr)=>{ if (!done){ done = true; try { me.destroy(); } catch(_){} reject({code:codeStr, peer:true}); } };
    me.on('open', ()=>{
      if (role==='host'){ done = true; resolve(ch); return; }
      const c = me.connect(hostId, {reliable:true}); wire(c);
      c.on('open', ()=>{ if (!done){ done = true; resolve(ch); } });
      setTimeout(()=>fail('timeout'), 12000);
    });
    if (role==='host') me.on('connection', wire);
    me.on('error', e=>fail((e && e.type) || 'error'));
    // keep the signalling link alive if it drops
    me.on('disconnected', ()=>{ try { if (!me.destroyed) me.reconnect(); } catch(_){} });
  });
}
const PEER_MSG = {
  'peer-unavailable':'找不到這個房號，請確認大螢幕上的號碼（大螢幕要先停在選角畫面）。',
  'unavailable-id':'這個房號剛好被用掉了，請大螢幕重新開房。',
  'timeout':'連線逾時。請確認兩邊都有網路，或換個網路（例如手機熱點）再試。',
  'network':'網路連不上配對伺服器，請換個網路再試。',
  'server-error':'配對伺服器暫時沒回應，稍後再試。',
  'socket-error':'網路連線中斷，請換個網路再試。',
  'browser-incompatible':'這個瀏覽器不支援直接連線，請改用 Safari 或 Chrome。',
};
// open a party channel: claude.ai's room when available, otherwise a direct PeerJS link
async function openChannel(code, role){
  const api = await getRoom();
  if (!api){
    try { return await peerChannel(code, role || 'pad'); }
    catch(e){ if (e && e.code==='no-peerjs') throw {code: roomWhy || 'unavailable'}; throw e; }
  }
  let room = null, kind = 'named';
  try { room = await api.join('shizhi-' + code); }
  catch(e){ kind = 'lobby:' + ((e && e.code) || 'error'); room = api; }
  const ch = {
    kind, code,
    peers: ()=>room.peers().filter(p=>p.sameTab || (p.presence && p.presence.code===code)),
    presence: (m)=>room.presence(Object.assign({code}, m)),
    leave: ()=>{ if (kind==='named') return room.leave(); return room.presence({code:null, host:null, pad:null, inp:null, slots:null, kinds:null, meter:null, stocks:null, st:null, pick:null}); },
    connected: ()=> typeof room.connected === 'function' ? room.connected() : true,
  };
  return ch;
}
const padC = {a:0, b:0, j:0, f:0, st:0};
let padPick = null, padReady = false;
function padPress(k){
  if (G.mode !== 'pad') return;
  const map = {atk:'a', sp:'b', jump:'j', fin:'f'};
  if (map[k]){ padC[map[k]]++; try{ navigator.vibrate && navigator.vibrate(12); }catch(_){} }
}
const padSlotEl = document.getElementById('padSlot'), padStateEl = document.getElementById('padState');
const partyBox = document.getElementById('partyBox'), partyCodeEl = document.getElementById('partyCode'), partyMsg = document.getElementById('partyMsg'), padListEl = document.getElementById('padList');
const joinUI = document.getElementById('joinUI'), padUI = document.getElementById('padUI'), joinMsg = document.getElementById('joinMsg'), codeIn = document.getElementById('codeIn');
const NO_ROOM = '這裡沒辦法連線：要在 claude.ai 登入，而且要被加進這個作品的分享名單。';

async function hostParty(){
  partyBox.hidden = false;
  if (party && party.role==='host') return;
  if (party && party.opening) return;
  partyCodeEl.textContent = '····'; partyMsg.textContent = '開房中…（最多等 10 秒）';
  party = { opening:true };
  let lastErr = null;
  for (let attempt=0; attempt<3; attempt++){
    const code = String(1000 + Math.floor(Math.random()*9000));
    try {
      const room = await openChannel(code, 'host');
      if (sel.mode !== 'party' || G.mode !== 'select'){ room.leave(); party = null; return; }
      party = { role:'host', code, room, slots:[null,null,null,null], prev:[{},{},{},{}], startSeen:{}, lastSent:'' };
      partyCodeEl.textContent = code;
      partyMsg.textContent = '朋友用手機打開這個網址 → 連線 → 加入，輸入房號。最多四支手機（依選的人數），空位由電腦補上。';
      return;
    } catch(e){ lastErr = e; if (!(e && e.code==='unavailable-id')) break; }
  }
  party = null; partyCodeEl.textContent = '----';
  if (lastErr && lastErr.peer) partyMsg.textContent = (PEER_MSG[lastErr.code] || '連線失敗，請重新整理再試。') + `（${lastErr.code}）`;
  else { roomWhy = roomWhy || (lastErr && lastErr.code) || 'error'; partyMsg.textContent = await roomDiag(); }
}
function leaveParty(){ if (party){ try{ party.room.leave(); }catch(_){} party = null; } partyBox.hidden = true; }
function padPeers(){ return party ? party.room.peers().filter(p=>!p.sameTab && p.presence && p.presence.pad) : []; }
function partyHostTick(){
  if (!party || party.role!=='host') return;
  const pads = padPeers(), ids = pads.map(p=>p.peer);
  let changed = false;
  for (let i=0;i<4;i++) if (party.slots[i] && !ids.includes(party.slots[i])){ party.slots[i] = null; changed = true; }
  for (const p of pads){
    if (party.slots.includes(p.peer)) continue;
    const free = party.slots.findIndex((x,k)=>!x && k < sel.count); if (free < 0) break;
    party.slots[free] = p.peer; changed = true;
    const c = (p.presence.inp && p.presence.inp.c) || {};
    party.prev[free] = {j:c.j||0, a:c.a||0, b:c.b||0, f:c.f||0};
    party.startSeen[p.peer] = p.presence.st || 0;
  }
  for (const p of pads){
    const slot = party.slots.indexOf(p.peer); if (slot < 0) continue;
    const st = +p.presence.st || 0;
    if (st > (party.startSeen[p.peer]||0)){ party.startSeen[p.peer] = st; if (G.mode==='result' && RES && RES.t > 3) startGame(); }
  }
  if (changed || G.mode==='select'){
    padListEl.innerHTML = '';
    [0,1,2,3].slice(0,sel.count).forEach(i=>{ const s = document.createElement('span'); const on = !!party.slots[i]; s.className = on ? 'on' : '';
      s.textContent = `P${i+1}：${on ? '手機已連線（' + CH[sel.p[i]].name + '）' : (i===0 ? '鍵盤／觸控' : '電腦')}`; padListEl.appendChild(s); });
  }
  const msg = { host:1, st:G.mode==='result' ? 'over' : G.mode, slots:party.slots, kinds:sel.p,
    meter:G.fighters.map(f=>Math.round(f.meter)), stocks:G.fighters.map(f=>f.stocks) };
  const s = JSON.stringify(msg);
  if (s !== party.lastSent){ party.lastSent = s; party.room.presence(msg).catch(()=>{}); }
}
function readPad(slot){
  const id = party && party.slots[slot];
  const p = id && party.room.peers().find(q=>q.peer===id);
  const inp = (p && p.presence && p.presence.inp) || {}, c = inp.c || {}, prev = party ? party.prev[slot] : {};
  const I = {l:!!inp.l, r:!!inp.r, u:!!inp.u, d:!!inp.d, shield:!!inp.s,
    jump:(c.j||0) > (prev.j||0), atk:(c.a||0) > (prev.a||0), sp:(c.b||0) > (prev.b||0), fin:(c.f||0) > (prev.f||0)};
  if (party) party.prev[slot] = {j:c.j||0, a:c.a||0, b:c.b||0, f:c.f||0};
  return I;
}

/* phone side */
function showJoin(){
  audioOn(); menuEl.hidden = true; joinUI.hidden = false; joinMsg.textContent = ''; codeIn.value = '';
  setTimeout(()=>{ try{ codeIn.focus(); }catch(_){} }, 50);
}
async function joinAsPad(){
  const code = (codeIn.value||'').replace(/\D/g,'');
  if (code.length !== 4){ joinMsg.textContent = '代碼是 4 個數字。'; return; }
  joinMsg.textContent = '連線中…（最多等 10 秒）';
  try {
    const room = await openChannel(code, 'pad');
    party = { role:'pad', code, room, lastSent:'', lastUI:'', since:performance.now() };
    joinUI.hidden = true; padUI.hidden = false; touchEl.hidden = true;
    document.body.classList.add('pad'); G.mode = 'pad'; fitPad();
  } catch(e){
    if (e && e.peer){ joinMsg.textContent = (PEER_MSG[e.code] || '連線失敗，請重新整理再試。') + `（${e.code}）`; return; }
    roomWhy = roomWhy || (e && e.code) || 'error'; joinMsg.textContent = await roomDiag();
  }
}
function leavePad(){
  if (party){ try{ party.room.leave(); }catch(_){} party = null; }
  document.body.classList.remove('pad'); for (const k in TS) TS[k] = false;
  padUI.hidden = true; touchEl.hidden = true; G.mode = 'menu'; padReady = false; showScr('scrOnline');
}
function padTick(){
  if (!party) return;
  const msg = { pad:1, pick:padPick, st:padC.st, rdy:padReady?1:0,
    inp:{ l:TS.l?1:0, r:TS.r?1:0, u:TS.u?1:0, d:TS.d?1:0, s:TS.shield?1:0, c:{a:padC.a, b:padC.b, j:padC.j, f:padC.f} } };
  const s = JSON.stringify(msg);
  if (s !== party.lastSent){ party.lastSent = s; party.room.presence(msg).catch(()=>{}); }
  const peers = party.room.peers();
  const me = peers.find(p=>p.sameTab), host = peers.find(p=>!p.sameTab && p.presence && p.presence.host);
  let who = '連線中…', state = '等待大螢幕開房', slot = -1, hp = host && host.presence;
  if (hp){
    slot = Array.isArray(hp.slots) && me ? hp.slots.indexOf(me.peer) : -1;
    if (slot < 0){ who = '已滿或等待中'; state = '大螢幕已有兩支手把'; }
    else {
      const kind = Array.isArray(hp.kinds) ? hp.kinds[slot] : null;
      who = `P${slot+1}${kind && CH[kind] ? ' · ' + CH[kind].name : ''}`;
      state = hp.st==='play' ? `對戰中 · 剩 ${(hp.stocks||[])[slot] ?? '-'} 條命` : hp.st==='over' ? '比賽結束，按「再來一局」' : hp.st==='select' ? (padReady ? '已準備，等對手…' : '選角色後按「準備好了」') : '等大螢幕選規則…';
      if (hp.st==='play') padReady = false;
      if (!padPick && kind) padPick = kind;
    }
  }
  const ready = !!(hp && slot >= 0 && Array.isArray(hp.meter) && hp.meter[slot] >= 100);
  const ui = who + '|' + state + '|' + ready + '|' + padPick + '|' + slot + '|' + (hp ? hp.st : '') + '|' + padReady;
  if (ui !== party.lastUI){
    party.lastUI = ui;
    padSlotEl.textContent = who; padStateEl.textContent = state;
    padSlotEl.style.color = slot >= 0 ? 'var(--p'+(slot+1)+')' : 'var(--ink)';
    pFin.classList.toggle('ready', ready);
    document.querySelectorAll('[data-pick]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.pick===padPick)));
    const ps = document.getElementById('padStart');
    ps.hidden = !(hp && slot >= 0 && (hp.st==='select' || hp.st==='over'));
    ps.textContent = hp && hp.st==='over' ? '再來一局' : (padReady ? '取消準備' : '準備好了');
    document.querySelector('.pTop .seg').hidden = !(hp && slot >= 0 && hp.st==='select');
  }
}
function aiInput(f, o, dt){
  const I = {l:0,r:0,u:0,d:0,jump:0,atk:0,sp:0,shield:0,fin:0};
  const a = f.ai || (f.ai = {cd:.6, jcd:0, sh:0, think:0});
  a.cd -= dt; a.jcd -= dt;
  if (o.state==='dead' || f.state==='final') return I;
  const dx = o.x - f.x, dy = o.y - f.y, adx = Math.abs(dx);
  if (f.state==='ledge'){ if (f.ledgeT > .3 + Math.random()*.3) I.jump = 1; return I; }
  const off = (f.x < MAIN.x1+.5 || f.x > MAIN.x2-.5 || f.y < -0.5) && !f.onGround;
  if (off){
    const under = f.y < -0.5 && f.x > MAIN.x1 - .5 && f.x < MAIN.x2 + .5;
    if (under){ if (f.x < 0) I.l = 1; else I.r = 1; }
    else if (f.x < 0) I.r = 1; else I.l = 1;
    if (f.vy < 3 && f.jumps > 0 && a.jcd <= 0){ I.jump = 1; I.u = 1; a.jcd = .35; }
    else if (f.jumps === 0 && f.vy < 2 && f.state==='air'){ I.u = 1; I.sp = 1; }
    return I;
  }
  if (f.meter >= 100 && o.state!=='dead' && Math.random() < .03) { I.fin = 1; return I; }
  if (o.state==='move' && adx < 5.5 && f.onGround && Math.random() < .045) a.sh = .35 + Math.random()*.2;
  if (a.sh > 0){ a.sh -= dt; I.shield = 1; return I; }
  if (adx > 3.4){ if (dx > 0) I.r = 1; else I.l = 1; }
  if (dy > 4 && f.onGround && a.jcd <= 0 && adx < 9){ I.jump = 1; I.u = 1; a.jcd = .9; }
  if (adx > 9 && a.cd <= 0 && Math.random() < .03){ I.l = I.r = 0; I.sp = 1; a.cd = 1.1; f.face = Math.sign(dx)||f.face; return I; }
  if (adx < 4.4 && Math.abs(dy) < 4 && a.cd <= 0){
    const r = Math.random();
    I.l = I.r = 0;
    if (r < .32) I.atk = 1;
    else if (r < .58){ dx > 0 ? I.r = 1 : I.l = 1; I.atk = 1; }
    else if (r < .7){ I.d = 1; I.atk = 1; }
    else if (r < .8 && dy > 1){ I.u = 1; I.atk = 1; }
    else if (r < .92){ dx > 0 ? I.r = 1 : I.l = 1; I.sp = 1; }
    else { I.d = 1; I.sp = 1; }
    a.cd = .35 + Math.random()*.55;
  } else if (!f.onGround && adx < 4 && a.cd <= 0){
    if (dy > 1.5) I.u = 1; else if (dy < -2) I.d = 1;
    I.atk = 1; a.cd = .5;
  }
  return I;
}

/* =================== menu / HUD =================== */
const sel = { mode:'cpu', count:2, p:['waffle','tommy','karl','seafood'], skin:[0,0,0,0], map:'park', stocks:3 };
const models = [null, null, null, null];
function rebuild(i){ if (models[i]) scene.remove(models[i].holder); models[i] = makeModel(sel.p[i], sel.skin[i] || 0); }
function rebuildAll(){ for (let i=0;i<4;i++){ if (i < sel.count) rebuild(i); else if (models[i]){ scene.remove(models[i].holder); models[i] = null; } } }
const menuEl = document.getElementById('menu'), overEl = document.getElementById('over'), quitEl = document.getElementById('quit'), touchEl = document.getElementById('touch');
const selEl = document.getElementById('sel'), pauseEl = document.getElementById('pause');
let rulesFrom = 'scrTitle';
function showScr(id){
  ['scrTitle','scrOnline','scrRules'].forEach(k=>{ document.getElementById(k).hidden = k!==id; });
  menuEl.hidden = false; selEl.hidden = true; joinUI.hidden = true;
}
document.getElementById('goSolo').onclick = ()=>{ audioOn(); sel.mode = sel.mode==='2p' ? '2p' : 'cpu'; rulesFrom = 'scrTitle'; document.getElementById('rulesH').textContent = '自己玩 · 規則'; document.getElementById('modeRow').hidden = false; syncMenu(); showScr('scrRules'); };
document.getElementById('goOnline').onclick = ()=>{ audioOn(); showScr('scrOnline'); };
document.getElementById('goHost').onclick = ()=>{ sel.mode = 'party'; rulesFrom = 'scrOnline'; document.getElementById('rulesH').textContent = '開房 · 規則'; document.getElementById('modeRow').hidden = true; syncMenu(); showScr('scrRules'); };
document.querySelectorAll('[data-back]').forEach(b=>b.onclick = ()=>showScr(b.dataset.back));
document.getElementById('rulesBack').onclick = ()=>{ leaveParty(); showScr(rulesFrom); };
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick = ()=>{ sel.mode = b.dataset.mode; syncMenu(); });
document.getElementById('asPad').onclick = showJoin;
document.querySelectorAll('[data-count]').forEach(b=>b.onclick = ()=>{ sel.count = +b.dataset.count; syncMenu(); });
document.querySelectorAll('[data-stocks]').forEach(b=>b.onclick = ()=>{ sel.stocks = +b.dataset.stocks; syncMenu(); });
document.getElementById('joinBtn').onclick = joinAsPad;
codeIn.addEventListener('keydown', e=>{ if (e.key==='Enter') joinAsPad(); });
document.getElementById('joinBack').onclick = ()=>{ joinUI.hidden = true; showScr('scrOnline'); };
document.getElementById('padLeave').onclick = leavePad;
document.getElementById('padStart').onclick = ()=>{ padC.st++; padReady = !padReady; if (party) party.lastUI = ''; };
function syncMenu(){
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.mode===sel.mode)));
  document.querySelectorAll('[data-map]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.map===sel.map)));
  document.querySelectorAll('[data-count]').forEach(b=>b.setAttribute('aria-pressed', String(+b.dataset.count===sel.count)));
  document.querySelectorAll('[data-stocks]').forEach(b=>b.setAttribute('aria-pressed', String(+b.dataset.stocks===sel.stocks)));
  document.getElementById('help2').hidden = sel.mode!=='2p';
}
syncMenu();

/* ---------- character select (ARMS-style) ---------- */
const ROSTER = [];   // filled by boot() from the registered characters
const SEL = { cur:[0,1,2,3], stage:[0,0,0,0], ready:[false,false,false,false], ctrl:['p1','cpu','cpu','cpu'], anim:[9,9,9,9], okT:[9,9,9,9], countdown:0, key:'' };
const selX = (i)=>{ const n = sel.count; return n===2 ? (i===0 ? -5.4 : 5.4) : n===3 ? [-7,0,7][i] : [-8.4,-2.8,2.8,8.4][i]; };
const selRot = (i)=>{ const x = selX(i); return x < 0 ? 0.45 : x > 0 ? -0.45 : 0; };
function portraitCanvas(kind, skin = 0){
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  if (kind==='random'){
    g.fillStyle = '#3a2a20'; g.fillRect(0,0,64,64); g.fillStyle = '#f2c14e'; g.font = '900 40px sans-serif'; g.textAlign = 'center'; g.fillText('?', 32, 46); return c;
  }
  const C = CHARS[kind];
  g.fillStyle = C.portraitBg || '#6f9fe8'; g.fillRect(0,0,64,64);
  try { g.drawImage(C.face.image, 6, 12, 52, 52); } catch(_){}
  g.fillStyle = '#151110';
  if (C.portrait) C.portrait(g);
  if (skin > 0){   // little party hat
    g.save(); g.translate(34,15); g.rotate(0.2);
    g.fillStyle = '#ff5fa2'; g.beginPath(); g.moveTo(-11,0); g.lineTo(11,0); g.lineTo(0,-15); g.closePath(); g.fill();
    g.fillStyle = '#ffe066'; g.fillRect(-7,-5,14,2); g.fillRect(-4,-10,8,2); g.fillRect(-12,-1,24,3);
    g.fillStyle = '#ffffff'; g.fillRect(-2,-18,4,4); g.restore();
  }
  return c;
}
const porEls = [];
function buildPortraits(){
  const box = document.getElementById('portraits');
  ROSTER.forEach((k,i)=>{
    const w = document.createElement('div'); w.className = 'porWrap';
    const b = document.createElement('button'); b.className = 'por'; b.setAttribute('aria-label', k==='random' ? '隨機' : CH[k].name);
    b.appendChild(portraitCanvas(k));
    b.onclick = ()=>{ audioOn(); const s = activeSlot(); if (s < 0) return; if (SEL.stage[s] && SEL.cur[s]!==i) SEL.stage[s] = 0; if (SEL.cur[s]===i) confirmSel(s); else moveSel(s, i - SEL.cur[s]); };
    const n = document.createElement('span'); n.textContent = k==='random' ? '隨機' : CH[k].name;
    const mk = [0,1,2,3].map(j=>{ const e = document.createElement('i'); e.className = 'mk m'+j; e.textContent = (j+1)+'P'; return e; });
    w.append(...mk, b, n); box.appendChild(w); porEls.push({b, mk});
  });
}
function slotCtrl(i){
  if (sel.mode==='party' && party && party.role==='host' && party.slots[i]) return 'pad';
  if (i===0) return 'p1';
  return (i===1 && sel.mode==='2p') ? 'p2' : 'cpu';
}
// the slot that taps / the local keyboard currently drive
function activeSlot(){
  if (SEL.countdown > 0) return -1;
  if (SEL.ctrl[0]==='p1' && !SEL.ready[0]) return 0;
  const p1done = SEL.ctrl[0]!=='p1' || SEL.ready[0];
  for (let i=1;i<sel.count;i++){
    if (SEL.ready[i]) continue;
    if (SEL.ctrl[i]==='p2') return i;
    if (SEL.ctrl[i]==='cpu' && p1done) return i;
  }
  return -1;
}
function enterSelect(){
  audioOn(); clearArena();
  G.mode = 'select'; G.paused = false; pauseEl.hidden = true;
  menuEl.hidden = true; selEl.hidden = false; overEl.hidden = true; hud.hidden = true; quitEl.hidden = true; touchEl.hidden = true; rotHint.hidden = true; winTitle.hidden = true;
  SEL.ready = [false,false,false,false]; SEL.stage = [0,0,0,0]; SEL.countdown = 0; SEL.okT = [9,9,9,9]; SEL.key = '';
  SEL.cur = sel.p.map(k=>ROSTER.indexOf(k));
  SEL.ctrl = [0,1,2,3].map(slotCtrl);
  if (sel.mode==='party') hostParty(); else partyBox.hidden = true;
  RS.visible = true; scene.fog.near = 400; scene.fog.far = 900; burstDisc.material = burstMats[2];
  rebuildAll(); for (let i=0;i<sel.count;i++) placeSel(i); SEL.anim = [0,0,0,0];
  renderSel();
}
function placeSel(i){
  const m = models[i]; if (!m) return;
  m.holder.position.set(selX(i), RS_Y, 1.5); m.holder.rotation.set(0, selRot(i), 0);
  m.body.scale.setScalar(SC); m.setOld(0); m.setFace('normal'); for (const n in m.props) m.props[n].visible = false;
  m.holder.visible = ROSTER[SEL.cur[i]] !== 'random';
}
function moveSel(i, d){
  if (SEL.ready[i]) return;
  if (SEL.stage[i]){   // costume step: left / right changes the look
    const n = skinCount(sel.p[i]);
    sel.skin[i] = ((sel.skin[i] || 0) + d + n*4) % n; rebuild(i);
    placeSel(i); SEL.anim[i] = 0; SFX.shield(); renderSel(); return;
  }
  SEL.cur[i] = (SEL.cur[i] + d + ROSTER.length*4) % ROSTER.length;
  const k = ROSTER[SEL.cur[i]];
  if (k !== 'random' && sel.p[i] !== k){ sel.p[i] = k; sel.skin[i] = 0; rebuild(i); }
  placeSel(i); SEL.anim[i] = 0; SFX.shield(); renderSel();
}
function confirmSel(i){
  if (SEL.ready[i]) return;
  if (ROSTER[SEL.cur[i]]==='random'){ const pool = ROSTER.filter(r=>r!=='random'), k = pool[(Math.random()*pool.length)|0]; sel.p[i] = k; sel.skin[i] = (Math.random()*skinCount(k))|0; rebuild(i); placeSel(i); models[i].holder.visible = true; }
  else if (!SEL.stage[i] && skinCount(sel.p[i]) > 1 && SEL.ctrl[i]!=='pad'){   // pick a costume before OK
    SEL.stage[i] = 1; SEL.anim[i] = 0; SFX.shield(); renderSel(); return;
  }
  SEL.ready[i] = true; SEL.okT[i] = 0;
  { const C = CHARS[sel.p[i]]; if (C.selectSfx) C.selectSfx(); else SFX.whistle(); }
  renderSel(); checkBothReady();
}
function cancelSel(i){
  if (SEL.countdown > 0){ SEL.countdown = 0; }
  if (i >= 0 && SEL.ready[i]){ SEL.ready[i] = false; renderSel(); return; }
  if (i >= 0 && SEL.stage[i]){ SEL.stage[i] = 0; renderSel(); return; }
  for (let j=sel.count-1;j>=0;j--){ if (SEL.ready[j] && (SEL.ctrl[j]==='cpu' || SEL.ctrl[j]==='p1')){ SEL.ready[j] = false; renderSel(); return; } }
  backFromSelect();
}
function backFromSelect(){
  selEl.hidden = true; RS.visible = false; applyMap(sel.map); G.mode = 'menu';
  rebuildAll();
  if (sel.mode==='party'){ leaveParty(); showScr('scrOnline'); } else showScr('scrRules');
}
function checkBothReady(){ if (SEL.ready.slice(0,sel.count).every(Boolean) && SEL.countdown <= 0){ SEL.countdown = 1.4; banner('準備開戰！'); } }
function renderSel(){
  const act = activeSlot();
  for (let i=0;i<4;i++){
    const pl = document.getElementById('plate'+i); pl.hidden = i >= sel.count; if (i >= sel.count) continue;
    const k = ROSTER[SEL.cur[i]], c = SEL.ctrl[i];
    pl.querySelector('.tag').textContent = c==='cpu' ? 'CPU' + (sel.count > 2 ? ' '+(i+1) : '') : c==='pad' ? `P${i+1} · 手機` : `P${i+1}`;
    pl.querySelector('.nm').textContent = k==='random' ? '？？？' : CH[k].name;
    pl.querySelector('.en').textContent = k==='random' ? 'RANDOM' : CH[k].en.toUpperCase();
    pl.classList.toggle('ok', SEL.ready[i]);
    pl.querySelector('.st').textContent = SEL.ready[i] ? 'OK!' + (sel.skin[i] ? ' 🎂' : '') : SEL.stage[i] ? '選造型：' + skinName(sel.p[i], sel.skin[i] || 0) : (c==='cpu' ? (act===i ? '幫電腦選角色' : '等 P1 選好') : c==='pad' ? '手機選擇中…' : '選擇中…');
  }
  porEls.forEach((p,j)=>{
    p.mk.forEach((m,i)=>{ m.hidden = i >= sel.count || SEL.cur[i]!==j; m.textContent = SEL.ctrl[i]==='cpu' ? 'CPU' : (i+1)+'P'; });
    for (let i=0;i<4;i++) p.b.classList.toggle('c'+i, i < sel.count && SEL.cur[i]===j);
    p.b.classList.toggle('hot', act>=0 && SEL.cur[act]===j);
  });
  const skinStep = act >= 0 && SEL.stage[act] && !SEL.ready[act];
  document.getElementById('portraits').hidden = !!skinStep;
  const sb = document.getElementById('skins'); sb.hidden = !skinStep;
  if (skinStep){
    const k = sel.p[act], key = act + k;
    if (sb.dataset.key !== key){
      sb.dataset.key = key; sb.innerHTML = '';
      for (let s=0; s<skinCount(k); s++){
        const w = document.createElement('div'); w.className = 'porWrap';
        const b = document.createElement('button'); b.className = 'por'; b.dataset.skin = s; b.setAttribute('aria-label', skinName(k, s));
        b.appendChild(portraitCanvas(k, s));
        b.onclick = ()=>{ audioOn(); const a = activeSlot(); if (a < 0 || !SEL.stage[a]) return; if ((sel.skin[a]||0)===s) confirmSel(a); else moveSel(a, s - (sel.skin[a]||0)); };
        const n = document.createElement('span'); n.textContent = skinName(k, s);
        w.append(b, n); sb.appendChild(w);
      }
    }
    sb.querySelectorAll('.por').forEach(b=>{ const on = +b.dataset.skin===(sel.skin[act]||0); b.classList.toggle('hot', on); b.classList.toggle('c'+act, on); b.setAttribute('aria-pressed', String(on)); });
  } else sb.dataset.key = '';
  document.getElementById('selOk').disabled = act < 0;
  document.getElementById('selOk').textContent = skinStep ? '決定造型' : act > 0 && SEL.ctrl[act]==='cpu' ? '決定電腦' + (sel.count > 2 ? ' '+(act+1) : '') : '決定';
  const kb = !isTouch ? (sel.mode==='2p' ? 'P1：A／D 換、J 決定、K 取消　P2：←／→ 換、, 決定、. 取消' : 'A／D 或 ←／→ 換角色，J 或 Enter 決定，K 或 Esc 取消') : '點大頭貼換角色，再點一次或按「決定」';
  const kbSkin = !isTouch ? '←／→ 或 A／D 換造型，J 或 Enter 決定，K 或 Esc 回上一步' : '點造型換裝，再點一次或按「決定」';
  document.getElementById('selHint').textContent = SEL.countdown > 0 ? '馬上開始！' : skinStep ? kbSkin : kb;
}
document.getElementById('selOk').onclick = ()=>{ const s = activeSlot(); if (s >= 0) confirmSel(s); };
document.getElementById('selBack').onclick = ()=>{ const s = activeSlot(); cancelSel(s >= 0 ? s : 0); };
function selKey(code){
  const p2keys = {ArrowLeft:-1, ArrowRight:1, Comma:'ok', Period:'no', Enter:'ok'};
  const p1keys = {KeyA:-1, KeyD:1, KeyJ:'ok', KeyK:'no', Space:'ok', KeyF:'ok', KeyG:'no', Escape:'no'};
  let slot = -1, act = null;
  if (sel.mode==='2p' && code in p2keys){ slot = SEL.ctrl[1]==='p2' ? 1 : -1; act = p2keys[code]; }
  else if (code in p1keys || code in p2keys){ slot = activeSlot(); act = code in p1keys ? p1keys[code] : p2keys[code]; if (code==='Escape' && slot < 0) slot = 0; }
  if (act===null) return false;
  if (act==='no'){ cancelSel(slot); return true; }
  if (slot < 0) return true;
  if (act==='ok') confirmSel(slot); else moveSel(slot, act);
  return true;
}
function updateSelect(dt, t){
  // party: phones drive their slots
  const ctrlNow = [0,1,2,3].map(slotCtrl);
  if (ctrlNow.join()!==SEL.ctrl.join()){ SEL.ctrl = ctrlNow; ctrlNow.forEach((c,i)=>{ if (c==='pad') SEL.ready[i] = false; }); renderSel(); }
  if (party && party.role==='host'){
    [0,1,2,3].slice(0,sel.count).forEach(i=>{
      if (SEL.ctrl[i]!=='pad') return;
      const p = party.room.peers().find(q=>q.peer===party.slots[i]); const pr = p && p.presence || {};
      const want = ROSTER.indexOf(pr.pick);
      if (want >= 0 && want !== SEL.cur[i] && !SEL.ready[i]) moveSel(i, want - SEL.cur[i]);
      const rdy = !!pr.rdy;
      if (rdy && !SEL.ready[i]) confirmSel(i);
      else if (!rdy && SEL.ready[i]){ SEL.ready[i] = false; SEL.countdown = 0; renderSel(); }
    });
  }
  burstDisc.rotation.z += dt*.1;
  const k = 1 - Math.exp(-dt*10);
  [0,1,2,3].slice(0,sel.count).forEach(i=>{
    const m = models[i]; if (!m) return;
    SEL.anim[i] += dt; SEL.okT[i] += dt;
    const kind = m.kind; let Pz = STANCE, hop = 0;
    if (SEL.ready[i]) Pz = CHARS[kind].readyPose ? CHARS[kind].readyPose(t) : POSE.salute;
    else if (SEL.anim[i] < .9){ Pz = POSE[CHARS[kind].introPose || 'peace']; hop = Math.sin(Math.min(1, SEL.anim[i]/.45)*Math.PI)*1.3; }
    applyPose(m, Pz, k);
    m.holder.position.y = RS_Y + hop + (SEL.okT[i] < .4 ? Math.sin(SEL.okT[i]/.4*Math.PI)*.8 : 0);
    m.chest.scale.y = 1 + Math.sin(t*2.2 + i)*0.008;
    const spin = SEL.anim[i] < .35 ? (1 - SEL.anim[i]/.35)*Math.PI*2 : 0;
    m.holder.rotation.y = selRot(i) + spin;
  });
  if (SEL.countdown > 0){ SEL.countdown -= dt; if (SEL.countdown <= 0){ selEl.hidden = true; startGame(); return; } }
  const key = SEL.ready.join() + SEL.cur.join() + SEL.ctrl.join() + SEL.stage.join() + sel.skin.join();
  if (key !== SEL.key){ SEL.key = key; renderSel(); }
  const narrow = innerWidth/innerHeight < .8;
  camPos.lerp(v3.set(0, RS_Y + 4.2, (narrow ? 34 : 19) + (sel.count > 2 ? 7 : 0)), 1-Math.exp(-dt*4));
  camLook.lerp(v3.set(0, RS_Y + (narrow ? 2.6 : 3.2), 0), 1-Math.exp(-dt*4));
}

const hud = document.getElementById('hud');
function buildHud(){
  hud.innerHTML = '';
  G.fighters.forEach((f,i)=>{
    const c = document.createElement('div'); c.className = 'card'; c.style.setProperty('--pc', 'var(--p'+(i+1)+')');
    c.innerHTML = `<div class="who"><div class="nm">${f.D.name}<b>${f.ctrl==='cpu' ? 'CPU' : f.ctrl.startsWith('pad') ? 'P'+(i+1)+'·手機' : 'P'+(i+1)}</b></div><div class="stk"></div><div class="meter"><b></b></div></div><div class="pc">0%</div>`;
    hud.appendChild(c); f.hud = {pc:c.querySelector('.pc'), stk:c.querySelector('.stk'), meter:c.querySelector('.meter'), bar:c.querySelector('.meter b'), lastP:-1, lastS:-1};
  });
}
function updateHud(){
  for (const f of G.fighters){
    const h = f.hud; const p = Math.round(f.pct);
    if (p !== h.lastP){ h.lastP = p; h.pc.textContent = p + '%'; const k = Math.min(1, p/150); h.pc.style.color = `rgb(${246},${Math.round(238-150*k)},${Math.round(223-190*k)})`; }
    if (f.stocks !== h.lastS){ h.lastS = f.stocks; h.stk.innerHTML = '<i></i>'.repeat(Math.max(0,f.stocks)); }
    h.bar.style.width = Math.min(100, f.meter) + '%';
    h.meter.classList.toggle('full', f.meter >= 100);
  }
  if (isTouch){
    const p1 = G.fighters[0]; finBtn.classList.toggle('ready', !!p1 && p1.meter >= 100);
    rotHint.hidden = !(innerHeight > innerWidth && G.mode==='play');
  }
}
function clearArena(){
  clearResults(); overEl.hidden = true;
  G.fighters.forEach(f=>f.dispose()); G.fighters = [];
  G.projs.forEach(p=>scene.remove(p.mesh)); G.projs = [];
  G.finals.forEach(disposeFinal); G.finals = [];
  G.parts.forEach(p=>scene.remove(p.m)); G.parts = [];
  G.fx.forEach(x=>scene.remove(x.o)); G.fx = [];
  G.sepiaT = 0; G.endT = 0; G.winner = null; G.lastOut = null; G.slowmo = 0; G.zoom = 0; G.victim = null; G.freeze = 0; G.paused = false;
  for (const k in TS) TS[k] = false;
}
function startGame(){
  audioOn();
  clearArena(); RS.visible = false; MAPK = sel.count===4 ? 1.45 : sel.count===3 ? 1.25 : 1; applyMap(sel.map); recoverHintShown = false;
  rebuildAll();
  G.fighters = []; for (let i=0;i<sel.count;i++){ const c = slotCtrl(i); G.fighters.push(new Fighter(i, models[i], c==='pad' ? 'pad'+i : c)); }
  G.fighters.forEach(f=>{ if (f.C.onSpawn) f.C.onSpawn(f); });
  G.mode = 'play'; menuEl.hidden = true; selEl.hidden = true; overEl.hidden = true; pauseEl.hidden = true; hud.hidden = false; quitEl.hidden = false;
  touchEl.hidden = !(isTouch && G.fighters[0].ctrl==='p1');
  buildHud(); camPos.set(0, 6, 40);
  banner('READY… GO!');
}
function toMenu(){
  clearArena(); leaveParty(); RS.visible = false; applyMap(sel.map); rebuildAll();
  G.mode = 'menu'; overEl.hidden = true; pauseEl.hidden = true; hud.hidden = true; quitEl.hidden = true; touchEl.hidden = true; rotHint.hidden = true; winTitle.hidden = true;
  showScr('scrTitle');
}
function showOver(){
  const w = G.winner;
  document.getElementById('winTxt').textContent = `${w.D.name} 獲勝！`;
  document.getElementById('winSub').textContent = CHARS[w.kind].winSub || 'GAME!';
  startResults();
}
// pause
function setPause(on){
  if (G.mode!=='play') return;
  G.paused = on; pauseEl.hidden = !on; quitEl.hidden = on;
  if (isTouch && G.fighters[0] && G.fighters[0].ctrl==='p1') touchEl.hidden = on;
  for (const k in TS) TS[k] = false;
}
document.getElementById('resume').onclick = ()=>setPause(false);
document.getElementById('pauseSelect').onclick = ()=>enterSelect();
document.getElementById('pauseMenu').onclick = ()=>toMenu();
document.getElementById('start').onclick = ()=>{ audioOn(); enterSelect(); };
document.getElementById('again').onclick = startGame;
document.getElementById('toSelect').onclick = enterSelect;
document.getElementById('toMenu').onclick = toMenu;
quitEl.onclick = ()=>setPause(true);

/* =================== loop =================== */
const camPos = new THREE.Vector3(0, 5, 22), camLook = new THREE.Vector3(0, 3.4, 0);
const clock = new THREE.Clock();
function tick(){
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  if (canvas.clientWidth && (canvas.clientWidth !== lastW || canvas.clientHeight !== lastH)) resize();
  if (G.mode==='pad'){ padTick(); requestAnimationFrame(tick); return; }
  partyHostTick();
  if (G.mode==='select'){
    updateSelect(dt, t);
  } else if (G.mode==='menu'){
    models.forEach((m,i)=>{
      if (!m) return; if (i > 1){ m.holder.visible = false; return; }
      const x = i===0 ? -3.6 : 3.6;
      m.holder.position.set(x, 0, 1.5); m.holder.rotation.y = (i===0 ? .35 : -.35);
      m.body.scale.setScalar(SC);
      applyPose(m, POSE[CHARS[m.kind].introPose || 'peace'], 1 - Math.exp(-dt*8));
      m.chest.scale.y = 1 + Math.sin(t*2.1 + i)*0.006;
      m.setOld(0); m.setFace('normal');
      for (const n in m.props) m.props[n].visible = false;
    });
    const narrow = innerWidth/innerHeight < .8;
    camPos.lerp(v3.set(0, narrow ? 7.5 : 5.2, narrow ? 30 : 21), 1-Math.exp(-dt*3));
    camLook.lerp(v3.set(0, narrow ? 6.5 : 4.4, 0), 1-Math.exp(-dt*3));
  } else if (G.mode==='result'){
    updateResults(dt, t);
  } else {
    const gdt = G.slowmo > 0 ? dt*.3 : dt;
    if (G.mode==='play'){
      if (G.paused){}
      else if (G.freeze > 0) G.freeze -= dt;
      else {
        if (G.slowmo > 0) G.slowmo -= dt;
        const inputs = G.fighters.map((f,i)=> f.ctrl==='cpu' ? aiInput(f, nearestFoe(f), gdt) : f.ctrl.startsWith('pad') ? readPad(+f.ctrl[3]) : readHuman(f.ctrl==='p1' ? 0 : 1));
        G.fighters.forEach((f,i)=>f.update(gdt, inputs[i]));
        updateProjs(gdt, t); updateFinals(gdt, t); checkHits();
        if (G.endT > 0){ G.endT -= dt; if (G.endT <= 0) showOver(); }
      }
      updateHud();
    }
    if (G.mode!=='result') G.fighters.forEach(f=>f.animate(G.freeze > 0 || G.paused ? 0 : gdt, t));
    // hit-stop shudder on whoever just got hit
    if (G.mode!=='result' && G.freeze > 0 && G.victim && G.victim.m.holder.visible){ G.victim.m.holder.position.x += (Math.random()-.5)*.55; G.victim.m.holder.position.y += (Math.random()-.5)*.2; }
    // camera
    const live = G.fighters.filter(f=>f.state!=='dead');
    let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    const lim = MAIN.x2 + 10;
    (live.length ? live : G.fighters).forEach(f=>{ const x = Math.max(-lim, Math.min(lim, f.x)), y = Math.max(-8, Math.min(26, f.y)); minX = Math.min(minX,x); maxX = Math.max(maxX,x); minY = Math.min(minY,y); maxY = Math.max(maxY,y); });
    const narrow = innerWidth/innerHeight < .8;
    let cx = Math.max(MAIN.x1+6, Math.min(MAIN.x2-6, (minX+maxX)/2)), cy = Math.max(0, Math.min(14, (minY+maxY)/2));
    let dist = Math.max((maxX-minX)*(narrow ? 1.9 : 1.05), (maxY-minY)*1.9) + (narrow ? 28 : 15);
    dist = Math.max(narrow ? 32 : 19, Math.min(narrow ? 76 : 56, dist));
    if (G.zoom > 0 && G.victim){ dist *= 1 - G.zoom*.32; cx += (G.victim.x - cx)*G.zoom*.6; cy += (G.victim.y - cy)*G.zoom*.5; }
    const camK = G.zoom > .05 ? 1-Math.exp(-dt*9) : 1-Math.exp(-dt*3.5);
    camPos.lerp(v3.set(cx, cy + 4 + dist*.04, dist), camK);
    camLook.lerp(v3.set(cx, cy + 2.6 + dist*.02, 0), camK);
    G.zoom = Math.max(0, G.zoom - dt*1.6);
  }
  // particles & fx
  for (let i=G.parts.length-1;i>=0;i--){ const p = G.parts[i]; p.life -= dt; p.vy -= p.g*dt; p.m.position.x += p.vx*dt; p.m.position.y += p.vy*dt; p.m.rotation.x += dt*8; if (p.life<=0){ scene.remove(p.m); G.parts.splice(i,1); } }
  for (let i=G.fx.length-1;i>=0;i--){ const x = G.fx[i]; x.t += dt; const k = x.t/x.life; x.o.scale.setScalar(x.base + x.grow*k); x.o.material.opacity = 1-k; x.o.material.rotation += dt*6; if (k>=1){ scene.remove(x.o); G.fx.splice(i,1); } }
  G.shake = Math.max(0, G.shake - dt*2.5); G.flash = Math.max(0, G.flash - dt*2.2);
  if (G.sepiaT > 0) G.sepiaT -= dt;
  G.sepia += ((G.sepiaT > 0 ? 1 : 0) - G.sepia)*(1-Math.exp(-dt*5));
  const sh = G.shake*G.shake;
  camera.position.set(camPos.x + (Math.random()-.5)*sh*2, camPos.y + (Math.random()-.5)*sh*2, camPos.z);
  camera.lookAt(camLook);
  post.uniforms.time.value = t; post.uniforms.sepia.value = G.sepia; post.uniforms.flash.value = G.flash*.7;
  renderer.setRenderTarget(rt); renderer.render(scene, camera);
  renderer.setRenderTarget(null); renderer.render(postScene, postCam);
  requestAnimationFrame(tick);
}

/* =================== boot (runs after every character and map file has loaded) =================== */
function boot(){
  ROSTER.push(...CHAR_ORDER, 'random');
  sel.p = sel.p.map((k,i)=>CHARS[k] ? k : CHAR_ORDER[i % CHAR_ORDER.length]);
  if (!MAPS[sel.map]) sel.map = MAP_ORDER[0];
  const ms = document.getElementById('mapSeg');
  MAP_ORDER.forEach(id=>{ const b = document.createElement('button'); b.dataset.map = id; b.textContent = MAPS[id].name; b.setAttribute('aria-pressed','false');
    b.onclick = ()=>{ sel.map = id; applyMap(id); syncMenu(); }; ms.appendChild(b); });
  const ps = document.getElementById('padPicks');
  CHAR_ORDER.forEach(k=>{ const b = document.createElement('button'); b.dataset.pick = k; b.textContent = CH[k].name; b.setAttribute('aria-pressed','false');
    b.onclick = ()=>{ padPick = k; padReady = false; if (party) party.lastUI = ''; }; ps.appendChild(b); });
  buildPortraits();
  applyMap(sel.map); rebuildAll(); syncMenu();
  tick();
}
