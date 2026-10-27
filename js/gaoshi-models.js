/* 世志搞事 model adapter: a snapshot of js/volleyball-models.js (itself a snapshot of the brawl texture/model/pose helpers).
 * Kept as its own copy so 世志搞事 never depends on volleyball or brawl runtimes; only appearance and poses are used. */
'use strict';
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function tex(w, h, draw, rep){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.magFilter = THREE.LinearFilter; t.generateMipmaps = THREE.MathUtils.isPowerOfTwo(w)&&THREE.MathUtils.isPowerOfTwo(h); t.minFilter = t.generateMipmaps?THREE.LinearMipmapLinearFilter:THREE.LinearFilter; t.anisotropy=4;
  if (rep){ t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
function speckle(g, w, h, base, cols, p){
  g.fillStyle = base; g.fillRect(0,0,w,h);
  const alpha=g.globalAlpha;g.globalAlpha=alpha*.22;
  for (let y=0;y<h;y++) for (let x=0;x<w;x++) if (rnd()<p){ g.fillStyle = cols[(rnd()*cols.length)|0]; g.fillRect(x,y,1,1); }
  g.globalAlpha=alpha;
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
const L = (o) => { const m = new THREE.MeshLambertMaterial(o); if(o.color !== undefined) m.color.convertSRGBToLinear(); if(o.emissive !== undefined) m.emissive.convertSRGBToLinear(); return m; };
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
// party-ending cake: tiered, candles tagged with userData.flame so they can be "blown out"
function buildCake(){
  const g = new THREE.Group();
  const icingA = L({color:0xfff3e2}), icingB = L({color:0xffd3ea}), spongeM = L({color:0xe9b27a});
  let y = 0, r = 2.3;
  for (let i=0;i<2;i++){
    const h = i===0 ? 1.7 : 1.2;
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20), i%2 ? icingB : icingA); tier.position.y = y+h/2; g.add(tier);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(r+0.04,r+0.04,0.3,20), i%2 ? icingA : icingB); band.position.y = y+0.18; g.add(band);
    const drip = new THREE.Mesh(new THREE.TorusGeometry(r*0.99,0.14,6,20), i%2 ? icingA : icingB); drip.rotation.x = Math.PI/2; drip.position.y = y+h; g.add(drip);
    y += h; r *= 0.66;
  }
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,0.18,22), L({color:0xd8d0c0})); plate.position.y = -0.09; g.add(plate);
  const colors = [0xff6b6b,0xffd93d,0x5fc0ef,0xb08cff,0x6fe08a];
  for (let i=0;i<colors.length;i++){
    const a = i/colors.length*Math.PI*2, cx = Math.cos(a)*r*0.5, cz = Math.sin(a)*r*0.5;
    const candle = cyl(0.045,0.045,0.55,L({color:colors[i]}),6); candle.position.set(cx,y+0.28,cz); g.add(candle);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.07,0.18,6), L({color:0xffcc33,emissive:0xff9900}));
    flame.position.set(cx,y+0.62,cz); flame.userData.flame = true; g.add(flame);
  }
  return g;
}
function makeModel(kind, skin = 0){
  const holder = new THREE.Group(); scene.add(holder);
  const body = new THREE.Group(); body.scale.setScalar(SC); holder.add(body);
  let c;
  try { c = CHARS[kind].build(body); } catch(error){ scene.remove(holder); throw error; }
  c.holder = holder; c.body = body; c.kind = kind; c.skin = 0;
  if (skin > 0 && CHARS[kind].skins && CHARS[kind].skins[skin-1]){ CHARS[kind].skins[skin-1].apply(c); c.skin = skin; }
  for (const k in c.props) c.props[k].visible = false;
  return c;
}

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
// Blend complete poses so wind-up, contact and follow-through have continuous arcs.
function volleyBlendPose(a,b,t){
  const out={};for(const key in a)out[key]=Array.isArray(a[key])?a[key].map((v,i)=>v+(b[key][i]-v)*t):typeof a[key]==='number'?a[key]+(b[key]-a[key])*t:t<.5?a[key]:b[key];return out;
}
function volleyServePose(progress,after){
  const ready=S_({lSh:[-.9,0,.2],rSh:[.25,0,-.15],rEl:[-.7],chest:[-.08,-.15,0],rHp:[.18],lHp:[-.2],rKn:[.25],lKn:[.15],drop:-.12});
  const follow=S_({rSh:[-.45,.35,.35],rEl:[-.25],lSh:[.3,0,.25],chest:[.4,.5,0],rHp:[-.25],lHp:[.3],rKn:[.35],lKn:[.15],drop:-.12});
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  if(after!=null)return after<.16?volleyBlendPose(POSE.serveHit,follow,smooth(after/.16)):volleyBlendPose(follow,POSE.stance,smooth((after-.16)/.3));
  return progress<.65?volleyBlendPose(ready,POSE.serveWind,smooth(progress/.65)):volleyBlendPose(POSE.serveWind,POSE.serveHit,smooth((progress-.65)/.35));
}
function volleyTossPose(time){
  const low=S_({lSh:[-.85,0,.2],lEl:[-.4],rSh:[.1,0,-.2],rEl:[-.6],rKn:[.2],lKn:[.2],drop:-.12});
  const high=S_({lSh:[-2.8,0,.2],lEl:[-.1],rSh:[-1.8,0,-.3],rEl:[-1.4],head:[-.25],chest:[-.12],rKn:[.2],lKn:[.2],drop:-.12});
  return volleyBlendPose(low,high,Math.min(1,Math.max(0,time/.22)));
}
function volleyShufflePose(phase,direction){
  const pose=runPose(phase),s=Math.sin(phase);pose.rSh=[-.65,0,-.25];pose.lSh=[-.65,0,.25];pose.rHp=[s*.25,0,-direction*Math.max(0,s)*.3];pose.lHp=[-s*.25,0,-direction*Math.max(0,-s)*.3];pose.chest=[.18,0,-direction*.08];return pose;
}
function volleySetPose(progress,after){
  const ready=S_({rHp:[-.18,0,-.24],lHp:[-.18,0,.24],rKn:[.68],lKn:[.68],drop:-.42,chest:[.12],head:[-.25],rSh:[-2.05,0,-.3],lSh:[-2.05,0,.3],rEl:[-1.1],lEl:[-1.1]});
  const loaded=S_({rHp:[-.3,0,-.26],lHp:[-.3,0,.26],rKn:[.9],lKn:[.9],drop:-.6,chest:[.08],head:[-.3],rSh:[-2.45,0,-.24],lSh:[-2.45,0,.24],rEl:[-.85],lEl:[-.85]});
  const release=S_({rHp:[0,0,-.17],lHp:[0,0,.17],rKn:[.08],lKn:[.08],drop:.12,chest:[-.1],head:[-.3],rSh:[-3.0,0,-.18],lSh:[-3.0,0,.18],rEl:[-.1],lEl:[-.1]});
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  if(after!=null)return after<.18?volleyBlendPose(loaded,release,smooth(after/.18)):volleyBlendPose(release,POSE.stance,smooth((after-.18)/.3));
  return volleyBlendPose(ready,loaded,smooth((progress-.45)/.55));
}
function volleyNetFacing(p,ball,task){
  const side=p.team===0?1:-1,base=side===1?Math.PI:0;
  const track=['set','receive','cover','block'].includes(task)?Math.max(-.65,Math.min(.65,Math.atan2((ball.x-p.x)*-side,Math.abs(ball.z-p.z)+2))):0;
  return base+track;
}
function volleyBackstepPose(phase){
  const pose=runPose(-phase);pose.rSh=[-.45,0,-.2];pose.lSh=[-.45,0,.2];pose.chest=[.08,0,0];pose.drop-=.08;return pose;
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


const CHARS = {}, CHAR_ORDER = [], SFX = {};
const JAB1 = {}, JAB2 = {};
function registerChar(kind, definition){
  CHARS[kind] = definition; CHAR_ORDER.push(kind);
  Object.assign(POSE, definition.poses || {});
}

const loveTex = tex(16,16,(g)=>{ const H=['0110000110','1111001111','1111111111','1111111111','0111111110','0011111100','0001111000','0000110000']; H.forEach((r,y)=>[...r].forEach((c,x)=>{ if(c==='1'){ g.fillStyle = y<2 ? '#ffb3c8' : '#ff4f86'; g.fillRect(x+3,y+4,1,1); } })); });
const puffTex = tex(16,16,(g)=>{ g.fillStyle='#fff'; g.beginPath(); g.arc(8,8,7,0,7); g.fill(); });

// Original 18-panel volleyball surface; generated locally, no image download.
function createVolleyBallTexture(){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const g=canvas.getContext('2d'),image=g.createImageData(512,256),palette=[[28,81,196],[255,205,34],[248,247,232]];
  for(let y=0;y<256;y++)for(let x=0;x<512;x++){
    const phi=(x+.5)/512*Math.PI*2,theta=(y+.5)/256*Math.PI,n=[-Math.cos(phi)*Math.sin(theta),Math.cos(theta),Math.sin(phi)*Math.sin(theta)],a=n.map(Math.abs);
    let axis=a[1]>a[0]?1:0;if(a[2]>a[axis])axis=2;const face=axis*2+(n[axis]<0?1:0),u=n[(axis+1)%3]/a[axis],v=n[(axis+2)%3]/a[axis],s=(face%2?v:u),t=(face%2?u:v);
    const band=Math.max(.0001,Math.min(.9999,(s+1)/2+.11*Math.sin(t*Math.PI/2)*(1-s*s))),strip=band*3,panel=Math.floor(strip),edge=Math.min(strip-panel,1-(strip-panel)),other=Math.max(...a.filter((_,i)=>i!==axis)),join=(a[axis]-other)/a[axis];
    const seam=edge<.022||join<.018,base=palette[(panel+face)%3],grain=1-((x*13+y*7)%11)/550,shade=seam?.55:grain,offset=(y*512+x)*4;
    for(let c=0;c<3;c++)image.data[offset+c]=Math.round(base[c]*shade);image.data[offset+3]=255;
  }
  g.putImageData(image,0,0);const texture=new THREE.CanvasTexture(canvas);texture.encoding=THREE.sRGBEncoding;texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.anisotropy=4;return texture;
}
