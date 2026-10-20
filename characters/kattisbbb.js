/* 凱蒂 Kattis — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- textures ---------- */
const KT_SKIN = '#f2d6c0', KT_SKIN_C = ['#eacfb8','#f6dcc8','#eed2bc'];
const KT_HAIR = '#241b1c';
const ktSkinTex = tex(16,16,(g)=>speckle(g,16,16,KT_SKIN,KT_SKIN_C,.4));
const ktHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,KT_HAIR,['#2e2325','#1a1213','#281d1f'],.45);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(0,0,0,.18)' : 'rgba(120,95,100,.16)'; g.fillRect(x + ((x*5)%3) - 1, 0, 1, 32); }
});
function ktFace(g, mode){
  speckle(g,64,64,KT_SKIN,KT_SKIN_C,.3); shadeFace(g);
  g.fillStyle='rgba(240,130,125,.22)'; g.beginPath(); g.ellipse(13,45,6,4,0,0,7); g.fill(); g.beginPath(); g.ellipse(51,45,6,4,0,0,7); g.fill();
  g.fillStyle='rgba(150,100,75,.5)';                                           // freckles
  [[14,41],[17,43],[11,43],[20,44],[50,41],[47,43],[53,43],[44,44],[29,41],[35,42],[32,40],[26,43],[38,44]].forEach(([x,y])=>g.fillRect(x,y,1,1));
  g.fillStyle='#2a1e1e'; const by = mode==='genius' ? 24 : 27; g.fillRect(15,by,9,2); g.fillRect(40,by,9,2);
  g.strokeStyle='#150e0e'; g.lineWidth=1.8;
  const open = (x, rx, ry, ir)=>{
    g.fillStyle='#fbf7f2'; g.beginPath(); g.ellipse(x,37,rx,ry,0,0,7); g.fill();
    g.fillStyle='#2a1a14'; g.beginPath(); g.ellipse(x,37,ir,ir,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35,2,2); g.fillRect(x-2,39,1,1);
    g.beginPath(); g.arc(x,37,rx,Math.PI*1.05,Math.PI*1.95); g.stroke();
  };
  const closedUp = (x)=>{ g.beginPath(); g.arc(x,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.5,Math.PI*.15,Math.PI*.85); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='grin'){ closedUp(20); closedUp(44); }
  else if (mode==='wink'){ open(20,5,4,3.2); closedUp(44); }
  else if (mode==='genius'){
    open(19,8.5,8.5,6); open(45,8.5,8.5,6);
    g.fillStyle='#fff'; [[15,31],[41,31]].forEach(([x,y])=>{ g.fillRect(x,y,3,3); g.fillRect(x-1,y+1,5,1); g.fillRect(x+1,y-1,1,5); });
  }
  else if (mode==='shout'){ open(20,5.5,5,3.6); open(44,5.5,5,3.6); }
  else { open(20,5,4,3.2); open(44,5,4,3.2); }
  g.fillStyle='rgba(160,90,70,.35)'; g.fillRect(30,40,4,4);                    // nose
  if (mode==='shout'){ g.fillStyle='#5a1a1a'; g.beginPath(); g.ellipse(32,51,7,6,0,0,7); g.fill(); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,54,4,2,0,0,7); g.fill(); }
  else if (mode==='grin'){ g.fillStyle='#6a1f22'; g.beginPath(); g.ellipse(32,50,7,5,0,0,7); g.fill(); g.fillStyle='#fff'; g.fillRect(26,46,12,3); }
  else if (mode==='cry'){ g.strokeStyle='#a84f50'; g.lineWidth=2.4; g.beginPath(); g.moveTo(25,52); g.quadraticCurveTo(32,46,39,52); g.stroke(); }
  else if (mode==='dizzy'){ g.strokeStyle='#b05050'; g.lineWidth=2.4; g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(28,46,32,50); g.quadraticCurveTo(36,54,40,50); g.stroke(); }
  else if (mode==='genius'){ g.strokeStyle='#b05a5c'; g.lineWidth=2.2; g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(33,55,41,46); g.stroke(); }
  else { g.strokeStyle='#b05a5c'; g.lineWidth=2; g.beginPath(); g.moveTo(26,49); g.quadraticCurveTo(32,53,38,49); g.stroke(); }
  // see-through curtain fringe + face-framing hair
  g.fillStyle=KT_HAIR; g.fillRect(0,0,64,10);
  for (let i=0;i<10;i++){ const x=i*6.6, mid=(i===4||i===5); g.beginPath(); g.moveTo(x-1,9); g.lineTo(x+8,9); g.lineTo(x+3+(i<5?-1:1)*(mid?3:0), (mid?15:20)+(i%2)*3); g.closePath(); g.fill(); }
  g.fillRect(0,0,6,64); g.fillRect(58,0,6,64);
  g.fillStyle='rgba(130,105,110,.4)'; [8,21,33,46,56].forEach(x=>g.fillRect(x,2,1,8));
}
const ktFaces = {};
['normal','cry','dizzy','grin','wink','genius','shout'].forEach(k=>ktFaces[k] = tex(64,64,(g)=>ktFace(g,k)));
function ktKnit(g, w, h, base, cols){
  speckle(g,w,h,base,cols,.35);
  for (let y=0;y<h;y+=2){ g.fillStyle='rgba(0,0,0,.14)'; g.fillRect(0,y,w,1); }
  for (let x=1;x<w;x+=3){ g.fillStyle='rgba(255,255,255,.05)'; g.fillRect(x,0,1,h); }
}
const KT_OL = ['#66643f','#53512f','#5d5b3b'];
const ktBlackSide = tex(32,32,(g)=>speckle(g,32,32,'#1b1b1f',['#222227','#16161a','#1f1f24'],.4));
const ktBlackFront = tex(32,46,(g)=>{ speckle(g,32,46,'#1b1b1f',['#222227','#16161a','#1f1f24'],.4); g.fillStyle='#2a2a30'; g.fillRect(10,0,12,2); });
const ktCardiSide = tex(32,32,(g)=>ktKnit(g,32,32,'#5d5b3b',KT_OL));
const ktCardiFront = tex(32,46,(g)=>{
  ktKnit(g,32,46,'#5d5b3b',KT_OL);
  g.fillStyle='#f3f1ea'; g.beginPath(); g.moveTo(9,0); g.lineTo(23,0); g.lineTo(16,20); g.closePath(); g.fill();   // white tee in the V
  g.fillStyle='#2b2b30'; g.fillRect(12,9,3,2); g.fillRect(17,9,3,2);
  g.strokeStyle='#3f3d26'; g.lineWidth=1.5; g.beginPath(); g.moveTo(9,0); g.lineTo(16,20); g.lineTo(23,0); g.stroke(); g.beginPath(); g.moveTo(16,20); g.lineTo(16,46); g.stroke();
});
const ktPantsTex = tex(32,32,(g)=>speckle(g,32,32,'#34445f',['#3b4c69','#2d3c56','#384866'],.5));
const ktBadgeTex = tex(16,22,(g)=>{ g.fillStyle='#f6f6f0'; g.fillRect(0,0,16,22); g.fillStyle='#3f9a3a'; g.fillRect(0,0,16,5); g.fillStyle='#e3523a'; g.fillRect(3,8,10,6); g.fillStyle='#f2c14e'; g.fillRect(5,16,6,3); });
const ktBallTex = tex(64,32,(g)=>{
  g.fillStyle='#f6f1de'; g.fillRect(0,0,64,32);
  for (let i=0;i<8;i++){ g.fillStyle = i%2 ? '#2d6cc0' : '#f1c232'; g.fillRect(i*8,9,8,14); }
  g.strokeStyle='#8a7a50'; g.lineWidth=1; for (let i=0;i<8;i++){ g.beginPath(); g.moveTo(i*8,0); g.lineTo(i*8,32); g.stroke(); }
});
const ktPosterTex = tex(32,44,(g)=>{
  const gr = g.createLinearGradient(0,0,32,44); gr.addColorStop(0,'#ff9ecb'); gr.addColorStop(1,'#ffe08a'); g.fillStyle=gr; g.fillRect(0,0,32,44);
  g.fillStyle='#fff'; g.fillRect(4,6,24,18); g.fillStyle='#5b8def'; g.fillRect(6,8,20,14); g.fillStyle='#2b2b30'; g.fillRect(4,28,18,3); g.fillRect(4,34,12,3);
});
const ktYoungTex = tex(128,64,(g)=>{
  g.fillStyle='#fff3a0'; g.strokeStyle='#c2377a'; g.lineWidth=7; g.font='900 40px sans-serif'; g.textAlign='center';
  g.strokeText('我才19歲！', 64, 46); g.fillText('我才19歲！', 64, 46);
});

/* ---------- props ---------- */
const ktDarkM = L({color:0x2b2b30});
function ktBall(s){ return new THREE.Mesh(new THREE.SphereGeometry(0.5*s,12,8), L({map:ktBallTex})); }
function ktScreen(w, h){ return new THREE.Mesh(new THREE.PlaneGeometry(w,h), new THREE.MeshBasicMaterial({map:ktPosterTex, fog:false})); }
function ktPad(){ const g = new THREE.Group(); g.add(rbox(1.5,2.1,0.1,.15,ktDarkM)); const s = ktScreen(1.3,1.9); s.position.z = 0.06; g.add(s); g.position.set(0,-0.7,0.2); return g; }
function ktPhone(){ const g = new THREE.Group(); g.add(rbox(0.62,1.1,0.1,.2,ktDarkM)); const s = ktScreen(0.52,0.95); s.position.z = 0.06; g.add(s); g.position.set(0,-0.38,0.14); return g; }
// the shield: a golden 3D "19" in a bubble
function ktShield(){
  const g = new THREE.Group(), gold = L({color:0xffc233});
  const seg = (x,y,w,h)=>g.add(at(rbox(w,h,0.55,.25,gold),x,y,0));
  seg(-1.7,0,0.5,3.4); g.add(at((()=>{ const f = rbox(0.9,0.45,0.55,.25,gold); f.rotation.z = 0.7; return f; })(),-2.05,1.5,0));
  seg(1.1,1.5,1.9,0.45); seg(0.25,0.8,0.45,1.6); seg(1.95,0.8,0.45,1.6); seg(1.1,0.1,1.9,0.45); seg(1.95,-0.8,0.45,1.5); seg(1.1,-1.5,1.9,0.45);
  const bm = new THREE.MeshBasicMaterial({color:0xffc8e6, transparent:true, opacity:.22, depthWrite:false});
  g.add(new THREE.Mesh(new THREE.SphereGeometry(3.4,12,8), bm));
  return g;
}

/* ---------- model ---------- */
function buildKattis(parent){
  const hairM = L({map:ktHairTex}), faceM = L({map:ktFaces.normal}), skinM = L({map:ktSkinTex});
  const sideM = L({map:ktBlackSide}), frontM = L({map:ktBlackFront}), sleeveM = L({map:ktBlackSide});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.12,
    torsoMat:[sideM,sideM,sideM,sideM,frontM,sideM], sleeveMat:()=>sleeveM, sleeve:[0.6,0.8],
    pantsM:L({map:ktPantsTex}), shoeM, soleM:greySole,
    collar(chest){                                                                // green lanyard + ID badge
      const strapM = L({color:0x3f9a3a});
      [-1,1].forEach(s=>{ const st = rbox(0.07,1.05,0.05,.3,strapM); st.position.set(s*0.15,1.82,0.5); st.rotation.z = -s*0.31; chest.add(st); });
      chest.add(at(rbox(0.6,0.84,0.07,.2,L({map:ktBadgeTex})),0,0.92,0.52));
    },
    hair(head){
      head.add(at(rbox(1.12,0.54,1.12,.68,hairM),0,0.5,-0.02));
      head.add(at(rbox(1.12,1.4,0.46,.55,hairM),0,-0.2,-0.34));
      [-0.42,-0.21,0,0.21,0.42].forEach((x,i)=>{ const st = rbox(0.27,1.6 + (i%2)*0.3 - Math.abs(x)*.3,0.3,.5,hairM); st.position.set(x,-1.05 - (i%2)*0.15,-0.38); st.rotation.z = -x*0.12; head.add(st); });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.15,0.85,0.66,.45,hairM),s*0.53,0.08,0.0));
        const side = rbox(0.3,1.95,0.74,.5,hairM); side.position.set(s*0.55,-0.7,0.0); side.rotation.z = s*0.05; head.add(side);
        const flick = rbox(0.24,0.5,0.5,.5,hairM); flick.position.set(s*0.66,-1.7,0.02); flick.rotation.z = s*0.4; head.add(flick);
      });
      head.add(at(rbox(1.02,0.26,0.14,.45,hairM),0,0.4,0.47)); [-0.34,-0.12,0.12,0.34].forEach((x,i)=>{ const f = rbox(0.26,0.26,0.12,.5,hairM); f.position.set(x,0.22,0.48); f.rotation.z = (x<0?1:-1)*0.12; head.add(f); });
    },
  }, parent);
  c.root.scale.set(1.04,1.14,1.04);                                               // tall
  const headY = c.head.position.y;
  c.setBig = (on)=>{ c.head.scale.setScalar(on ? 1.55 : 1); c.head.position.y = headY + (on ? 0.3 : 0); };
  const ball = ktBall(1); ball.position.set(0,-0.35,0.15); c.R.hd.add(ball);
  const pad = ktPad(); c.R.hd.add(pad);
  const phone = ktPhone(); c.R.hd.add(phone);
  c.props = {ball, pad, phone};
  c.ktSide = sideM; c.ktFront = frontM; c.ktSleeve = sleeveM;
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = ktFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = ktFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- ultimate: 高智商天才 → 我很年輕爆炸 ---------- */
function ktFinal(f, opp){
  const GEN = 7.5, base = CH.kattisbbb;
  f.finalT = .8; banner('高智商天才！'); SFX.ktBrain(); pop('IQ 200！', f.x, f.y+7.5, 'big');
  f.D = Object.assign({}, base, {run:base.run*1.18, air:base.air*1.1});
  const rm1 = new THREE.MeshBasicMaterial({color:0xff7ac8, transparent:true, opacity:.8, side:THREE.DoubleSide, depthWrite:false, fog:false});
  const rm2 = new THREE.MeshBasicMaterial({color:0xffe066, transparent:true, opacity:.8, side:THREE.DoubleSide, depthWrite:false, fog:false});
  const boom = new THREE.Group();
  boom.add(new THREE.Mesh(new THREE.RingGeometry(.86,1,32), rm1)); boom.add(new THREE.Mesh(new THREE.RingGeometry(.6,.7,32), rm2));
  boom.visible = false; scene.add(boom);
  const lab = new THREE.Sprite(new THREE.SpriteMaterial({map:ktYoungTex, transparent:true, fog:false})); lab.visible = false; scene.add(lab);
  G.finals.push({owner:f, target:opp, t:0, hit:new Set(), booming:false, bt:0, update(F, dt){
    if (f.state==='dead') return true;
    if (F.t < GEN){
      f.ktIQ = GEN - F.t;                                                           // big head, big eyes, faster attacks (see animate)
      if (Math.random() < dt*10) burst(f.x + (Math.random()-.5)*2.5, f.y + 4 + Math.random()*4.5, 0xffe066, 1, 3);
      return false;
    }
    if (!F.booming){
      F.booming = true; f.ktIQ = 0; f.D = base;
      SFX.ktBoom(); G.shake = reduce ? .2 : 1.2; G.flash = .25; banner('我、很、年、輕！'); pop('我才19歲！！', f.x, f.y+8.5, 'big');
      boom.visible = true; lab.visible = true;
    }
    F.bt += dt;
    const u = Math.min(1, F.bt/.5), R = 1 + u*10;
    boom.position.set(f.x, f.y+4, 0.5); boom.scale.setScalar(R); rm1.opacity = .8*(1 - u*.7); rm2.opacity = .8*(1 - u*.7);
    const ls = Math.min(1, u*3); lab.position.set(f.x, f.y+8.4, 1); lab.scale.set(7*ls, 3.5*ls, 1);
    for (const v of G.fighters){                                                   // everybody nearby feels old and dumb for 1 s
      if (v===f || F.hit.has(v) || !v.hittable()) continue;
      if (Math.abs(v.x - f.x) < R && Math.abs(v.y - f.y) < R*.8 + 2){
        F.hit.add(v); v.pct += 6; v.state = 'stun'; v.stunT = 1.0; v.move = null; v.vx = (Math.sign(v.x - f.x) || 1)*5;
        SFX.hit(20); spark(v.x, v.y+3, 4); pop('我老了…好笨…', v.x, v.y+8.5, 'blue');
      }
    }
    return F.bt > .9;
  }, dispose(F){ scene.remove(boom); scene.remove(lab); f.ktIQ = 0; f.D = base; }});
}

/* ---------- results ---------- */
// win: volleyball spike → story selfie poster → genius pose
function ktWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const pol = new THREE.Group();
  pol.add(rbox(3.4,4.1,0.12,.08,L({color:0xfbfaf6})));
  const pt = new THREE.CanvasTexture(portraitCanvas('kattisbbb', W.m.skin||0)); pt.magFilter = pt.minFilter = THREE.NearestFilter; pt.generateMipmaps = false;
  const ph = new THREE.Mesh(new THREE.PlaneGeometry(3,3), new THREE.MeshBasicMaterial({map:pt, fog:false})); ph.position.set(0,0.35,0.07); pol.add(ph);
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(3,0.6), new THREE.MeshBasicMaterial({map:tex(96,20,(g)=>{ g.fillStyle='#fbfaf6'; g.fillRect(0,0,96,20); g.fillStyle='#c2377a'; g.font='900 12px sans-serif'; g.textAlign='center'; g.fillText('#大二才19歲', 48, 15); }), fog:false}));
  cap.position.set(0,-1.6,0.07); pol.add(cap);
  pol.position.set(wp.x + 4.4, RS_Y + 7.2, -1); pol.rotation.z = -0.12; pol.scale.setScalar(.001); scene.add(pol); R.items.push(pol); R.pol = pol;
}
function ktWinUpdate(R, dt, k){
  const W = R.W, m = W.m;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.8){
    applyPose(m, (R.t % .9) < .5 ? POSE.serveWind : POSE.serveHit, k); m.props.ball.visible = true; m.setFace('grin');
    once('kw0', .3, ()=>popAt('扣殺得分！', W, 8.5, 'big'));
    once('kw0b', .55, ()=>SFX.batCrack());
  } else if (R.t < 3.6){
    applyPose(m, POSE.selfie, k); m.props.phone.visible = true; m.setFace('wink');
    once('kw1', 2.0, ()=>{ SFX.ktSnap(); popAt('發限動！📸', W, 9, 'big'); const p = m.holder.position; burst(p.x + .8, p.y + 6.5, 0xffffff, 16, 9); });
  } else {
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.peace, k); m.setFace('genius');
    once('kw3', 3.8, ()=>{ SFX2.cheer(); popAt('高智商天才就是我！', W, 9.5, 'big'); });
    once('kw4', 4.9, ()=>popAt('我才19歲欸～', W, 9.5, 'big'));
  }
  if (R.t > 2.3){ const u = Math.min(1, (R.t - 2.3)/.35); R.pol.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.25))); R.pol.position.y = RS_Y + 7.2 + Math.sin(R.t*2)*.15; }
}
// lose: a volleyball bonks her head, she sobs about being only 19
function ktLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  const b = ktBall(1.6); b.position.set(lp.x, RS_Y + 14, lp.z); scene.add(b); R.items.push(b); R.kb = b; R.kbx = 0;
}
function ktLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, hp = m.holder.position, b = R.kb;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.0){
    applyPose(m, POSE.stand, k); m.setFace('normal');
    once('kl0', .1, ()=>popAt('這球我接得到！', Lz, 8.5, 'blue'));
  } else {
    applyPose(m, POSE.sob, k); m.setFace('cry');
    once('kl2', 1.5, ()=>popAt('我才19歲…怎麼就輸了…', Lz, 8.5, 'blue'));
    once('kl3', 3.0, ()=>popAt('美宣還沒交稿…', Lz, 8.5, 'blue'));
    once('kl4', 4.3, ()=>popAt('IQ 200 也救不了排球……', Lz, 8.5, 'blue'));
  }
  if (R.t < .5){ const u = R.t/.5; b.position.y = RS_Y + 14 - u*u*6.5; b.position.x = hp.x; }
  else if (R.t < 1.5){ const u = R.t - .5; b.position.y = RS_Y + 0.8 + 6.7*(1-u) + 6*u*(1-u); b.position.x = hp.x + 4.5*u; R.kbx = b.position.x; b.rotation.z -= dt*5; }
  else { b.position.y = RS_Y + 0.8; R.kbx += dt*2*Math.max(0, 1 - (R.t - 1.5)/2); b.position.x = R.kbx; b.rotation.z -= dt*3; }
  once('kl1', .5, ()=>{ SFX.soft(); popAt('砰！', Lz, 8, 'big'); burst(hp.x, hp.y + 7, 0xffffff, 8, 5); });
}

registerChar('kattisbbb', {
  stats: { name:'凱蒂', en:'Kattis', tag:'排球・美宣・高智商', weight:1.05, run:16, air:12.5, jumpV:33, djV:29, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.08,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'快攻！', dash:5},
    side:{t:[.22,.1,.32], pose:['serveWind','serveHit'], box:[3.0,3.6,1.7], dmg:14, kb:12, sc:1.1, ang:36, prop:'ball', text:'發球！', sfx:'batCrack'},
    up:{t:[.14,.12,.28], pose:['upWind','upHit'], box:[0.5,7.2,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'ball', text:'攔網！', sfx:'swing'},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:11, kb:9, sc:.85, ang:70, prop:'pad', text:'交稿！', sfx:'swing'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.3,3.5,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.8,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'ball'},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'ball', text:'扣殺！', sfx:'batCrack'},
    nB:{t:[.2,.05,.28], pose:['serveWind','serveHit'], prop0:'ball', fire:[[.2,'ktServe']], air:1, sfx:'swing'},
    sB:{t:[.14,.28,.3], pose:['dive','dive'], box:[2.1,3.0,1.5], dmg:9, kb:8, sc:.5, ang:40, dash:26, air:1, text:'魚躍救球！', sfx:'swing'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, prop:'ball', start:'ktUp', box:[0.4,5.2,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1, text:'跳發！'},
    dB:{t:[.15,.35,.35], pose:['selfie','selfie'], prop:'phone', box:[0,3.8,4.2], dmg:4, kb:3, sc:.2, ang:50, onHit:'ktFlash', air:1, text:'發限動！', sfx:'ktSnap'},
  },
  fire: {
    ktServe(f){ proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.6, vx:f.face*24, vy:3, g:12, r:.9, life:1.2, dmg:7, kb:7, sc:.5, ang:40, mesh:ktBall(1.6), spin:1}); },
  },
  start: {
    ktUp(f){ f.vy = 34; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xffffff, 8, 6); },
  },
  onhit: {
    ktFlash(a, v){ v.state = 'stun'; v.stunT = .5; v.move = null; pop('被閃到！', v.x, v.y+7.5, 'blue'); },
  },
  sfx: {
    ktSnap(){ tone(1800,.08,'square',.08); tone(900,.12,'sine',.08,1,.05); noise(.06,.2,4000); },
    ktBrain(){ tone(400,.25,'sine',.1,2.5); tone(800,.25,'triangle',.08,2,.12); tone(1600,.3,'sine',.06,1.5,.24); },
    ktBoom(){ noise(.4,.4,900); tone(160,.45,'sawtooth',.14,.4); tone(1200,.3,'sine',.08,.5,.05); },
  },
  build: buildKattis, face: ktFaces.normal, portraitBg: '#ffc2dc',
  portrait(g){
    g.fillStyle = KT_HAIR; g.fillRect(4,4,56,14); g.fillRect(1,10,9,54); g.fillRect(54,10,9,54);
    for (let i=0;i<7;i++){ g.beginPath(); g.moveTo(8+i*7,16); g.lineTo(16+i*7,16); g.lineTo(11+i*7,23+(i%2)*3); g.closePath(); g.fill(); }
    g.fillStyle = '#1b1b1f'; g.fillRect(10,60,44,4); g.fillStyle = '#3f9a3a'; g.fillRect(28,60,2,4); g.fillRect(34,60,2,4);
  },
  skins: [
    { name:'針織外套', apply(c){
      c.ktSide.map = ktCardiSide; c.ktFront.map = ktCardiFront; c.ktSleeve.map = ktCardiSide;
      [c.ktSide, c.ktFront, c.ktSleeve].forEach(m=>{ m.needsUpdate = true; });
      [c.R, c.Lf].forEach(a=>{ a.sh.children[1].material = c.ktSleeve; a.el.children[0].material = c.ktSleeve; });
    } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#ffb3d1','#ffffff',0xffd166); h.position.set(0.05,0.7,-0.02); c.head.add(h); } },
  ],
  // shield: hold up a golden 3D "19"
  shield(){ return ktShield(); },
  shieldAnim(f){ const t = performance.now()/1000; f.shieldMesh.position.set(f.x, f.y+3.6, 0.8); f.shieldMesh.rotation.y = Math.sin(t*2.2)*.6; },
  shieldPose: 'block', shieldProp: null, breakText: '19歲破功了！', brokePose: 'dizzy',
  finalPose: 'ponder', finalProp: null,
  animate(f, m, s, t, dt){
    const iq = f.ktIQ > 0 && s !== 'dead';
    m.setBig(iq);
    if (iq){
      m.setFace(s==='stun' ? 'dizzy' : 'genius');
      if (s==='move' && f.move){                                                   // genius: attacks come out ~65% faster
        const st = f.move.t[0]; let ex = dt*.65;
        if (f.moveT < st) ex = Math.min(ex, Math.max(0, st - f.moveT - .002));
        f.moveT += ex;
      }
    }
  },
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.cheer : POSE.laugh, selectSfx: ()=>SFX.whistle(),
  winSub: '"我才19歲欸！"',
  final: ktFinal, winSetup: ktWinSetup, winUpdate: ktWinUpdate, loseSetup: ktLoseSetup, loseUpdate: ktLoseUpdate,
  longWin: true, longLose: true,
});
