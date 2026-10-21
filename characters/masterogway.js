/* 樂 Master Ogway — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';

/* ---------------- textures ---------------- */
const MOG_SKIN = '#e0b596', MOG_SKIN_C = ['#d6a888','#e8c0a2','#dcb092','#d2a383'];
const mogSkinTex = tex(16,16,(g)=>speckle(g,16,16,MOG_SKIN,MOG_SKIN_C,.38));

function mogDrawFace(g, mode){
  speckle(g,64,64,MOG_SKIN,MOG_SKIN_C,.32); shadeFace(g);
  // chubby cheeks
  g.fillStyle='rgba(216,124,104,.26)';
  g.beginPath(); g.ellipse(13,44,7,5,0,0,7); g.fill();
  g.beginPath(); g.ellipse(51,44,7,5,0,0,7); g.fill();
  // flat straight brows
  g.fillStyle='#17110e';
  g.fillRect(12,26,14,3); g.fillRect(38,26,14,3);
  g.fillRect(14,25,10,1); g.fillRect(40,25,10,1);
  if (mode==='cry'){
    g.strokeStyle='#17110e'; g.lineWidth=2;
    g.beginPath(); g.moveTo(14,36); g.lineTo(26,36); g.stroke();
    g.beginPath(); g.moveTo(38,36); g.lineTo(50,36); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,38,3,16); g.fillRect(44,38,3,16);
    g.fillStyle='#4a1715'; g.beginPath(); g.ellipse(32,51,7,5,0,0,7); g.fill();
  } else if (mode==='shout'){
    g.strokeStyle='#17110e'; g.lineWidth=2;
    g.beginPath(); g.moveTo(14,36); g.lineTo(26,33); g.stroke();
    g.beginPath(); g.moveTo(38,33); g.lineTo(50,36); g.stroke();
    g.fillStyle='#3d1211'; g.beginPath(); g.ellipse(32,50,10,8,0,0,7); g.fill();
    g.fillStyle='#d4625c'; g.beginPath(); g.ellipse(32,54,5,3,0,0,7); g.fill();
  } else {
    // small narrow eyes, slightly unimpressed
    g.strokeStyle='#17110e'; g.lineWidth=2;
    g.beginPath(); g.moveTo(13,37); g.quadraticCurveTo(19,33.5,26,37); g.stroke();
    g.beginPath(); g.moveTo(38,37); g.quadraticCurveTo(45,33.5,51,37); g.stroke();
    g.fillStyle='#17110e'; g.fillRect(18,36,3,3); g.fillRect(43,36,3,3);
    // nose
    g.fillStyle='rgba(150,96,70,.4)'; g.fillRect(30,42,4,4);
    g.fillStyle='rgba(110,66,46,.6)'; g.fillRect(28,46,3,1); g.fillRect(33,46,3,1);
    // flat smirk
    g.strokeStyle='#5a2320'; g.lineWidth=2.4; g.lineCap='round';
    g.beginPath(); g.moveTo(23,51); g.quadraticCurveTo(32,49.5,41,52.5); g.stroke();
  }
  // double chin, he is a round guy
  g.strokeStyle='rgba(150,100,76,.35)'; g.lineWidth=1.6;
  g.beginPath(); g.moveTo(22,59); g.quadraticCurveTo(32,62,42,59); g.stroke();
}
const mogFaces = {
  normal: tex(64,64,(g)=>mogDrawFace(g,'normal')),
  cry:    tex(64,64,(g)=>mogDrawFace(g,'cry')),
  shout:  tex(64,64,(g)=>mogDrawFace(g,'shout')),
};

const MOG_GREY = '#b9b9bd', MOG_GREY_C = ['#c4c4c9','#aeaeb3','#cbcbd0'];
const mogHoodTex   = tex(32,32,(g)=>speckle(g,32,32,MOG_GREY,MOG_GREY_C,.5));
const mogHoodFront = tex(32,32,(g)=>{
  speckle(g,32,32,MOG_GREY,MOG_GREY_C,.5);
  g.fillStyle='rgba(120,120,126,.55)'; g.fillRect(0,0,32,4);              // hood collar shadow
  g.fillStyle='#8f8f95'; g.fillRect(6,3,20,2);
  g.strokeStyle='#26262a'; g.lineWidth=1.4; g.lineCap='round';            // drawstrings
  g.beginPath(); g.moveTo(13,5); g.lineTo(12,15); g.stroke();
  g.beginPath(); g.moveTo(19,5); g.lineTo(20,15); g.stroke();
  g.fillStyle='#f0f0f2'; g.fillRect(11,14,3,2); g.fillRect(19,14,3,2);    // aglets
  g.strokeStyle='rgba(120,120,126,.75)'; g.lineWidth=1;                   // kangaroo pocket
  g.beginPath(); g.moveTo(5,21); g.lineTo(27,21); g.stroke();
  g.beginPath(); g.moveTo(5,21); g.lineTo(7,31); g.stroke();
  g.beginPath(); g.moveTo(27,21); g.lineTo(25,31); g.stroke();
  g.fillStyle='rgba(255,255,255,.08)'; for(let y=0;y<32;y+=5) g.fillRect(0,y,32,1);
});
const mogSleeveTex = tex(32,32,(g)=>{
  speckle(g,32,32,MOG_GREY,MOG_GREY_C,.5);
  g.fillStyle='#1e1e22'; g.fillRect(13,0,6,32);                           // black side stripe down the sleeve
  g.fillStyle='rgba(255,255,255,.22)'; g.fillRect(13,0,1,32);
  g.fillStyle='#8f8f95'; g.fillRect(0,29,32,3);                           // cuff
});
const mogPantsTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#232329',['#2b2b32','#1c1c21'],.5);
  g.fillStyle='rgba(255,255,255,.06)'; g.fillRect(15,0,2,32);
});
const mogDenimTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#30557f',['#3a6291','#294a71','#365c88'],.5);
  g.fillStyle='rgba(255,255,255,.45)'; for(let y=2;y<32;y+=4) g.fillRect(0,y,32,1);
});
const mogDenimFront = tex(32,32,(g)=>{
  speckle(g,32,32,'#30557f',['#3a6291','#294a71','#365c88'],.5);
  g.fillStyle='rgba(255,255,255,.4)'; for(let y=2;y<32;y+=4) g.fillRect(0,y,32,1);
  g.fillStyle='#24405f'; g.fillRect(13,0,6,32);                           // placket
  g.strokeStyle='#e8eef6'; g.lineWidth=1;
  g.beginPath(); g.moveTo(12,0); g.lineTo(12,32); g.stroke();
  g.beginPath(); g.moveTo(20,0); g.lineTo(20,32); g.stroke();
  g.fillStyle='#f2f5f9'; [7,13,19,25].forEach(y=>g.fillRect(15,y,2,2));   // buttons
  g.strokeStyle='#e8eef6'; g.strokeRect(3,9,7,6); g.strokeRect(22,9,7,6); // chest pockets
});
const mogBombTex = tex(16,16,(g)=>{
  g.fillStyle='#1b1b20'; g.beginPath(); g.arc(8,9,6,0,7); g.fill();
  g.fillStyle='#45454e'; g.beginPath(); g.arc(6,7,2,0,7); g.fill();
  g.fillStyle='#7a5a33'; g.fillRect(7,1,2,3);
  g.fillStyle='#ffb13d'; g.fillRect(7,0,2,2);
});
const mogWordTex = tex(32,32,(g)=>{
  g.fillStyle='rgba(255,70,60,0)'; g.fillRect(0,0,32,32);
  g.fillStyle='#ffe9a8'; g.beginPath(); g.arc(16,16,9,0,7); g.fill();
  g.fillStyle='#ff5a3c'; g.beginPath(); g.arc(16,16,5,0,7); g.fill();
});

const mogSkinM  = L({map:mogSkinTex});
const mogHairM  = L({map:blackHairTex});
const mogHoodM  = L({map:mogHoodTex});
const mogFrontM = L({map:mogHoodFront});
const mogSlvM   = L({map:mogSleeveTex});
const mogPantsM = L({map:mogPantsTex});

/* ---------------- model ---------------- */
function mogHair(head){
  const H = mogHairM;
  head.add(at(rbox(1.16,0.62,1.2,.6,H),0,0.56,-0.01));                    // bowl top
  head.add(at(rbox(1.12,1.26,0.62,.58,H),0,0.02,-0.3));                   // back
  [-1,1].forEach(s=>{
    head.add(at(rbox(0.22,1.02,1.1,.5,H),s*0.52,0.1,-0.03));              // sides, down past the ears
    const tuft = at(rbox(0.2,0.36,0.3,.5,H),s*0.47,-0.4,0.18); tuft.rotation.z = s*0.28; head.add(tuft);
  });
  // thick straight fringe, a few separate slabs
  [[-0.4,0.2],[-0.13,0.3],[0.13,0.27],[0.4,0.18]].forEach(([x,len],i)=>{
    const p = at(rbox(0.29,0.5+len,0.2,.34,H), x, 0.46-len*0.55, 0.45);
    p.rotation.z = (i-1.5)*0.07; head.add(p);
  });
  head.add(at(rbox(1.1,0.32,0.34,.4,H),0,0.6,0.38));                      // fringe root
  const antenna = at(rbox(0.08,0.42,0.08,.5,H),0.1,0.9,0.04); antenna.rotation.z = -0.35; head.add(antenna);
  return {antenna};
}
function buildMasterogway(parent){
  const faceM = L({map:mogFaces.normal});
  const c = buildChar({
    skinM: mogSkinM, faceM, headW:1.02, headH:1.3,
    torsoMat: [mogHoodM, mogHoodM, mogHoodM, mogHoodM, mogFrontM, mogHoodM],
    sleeveMat: ()=>mogSlvM, sleeve:[0.5,0.95],
    pantsM: mogPantsM, shoeM, soleM: greySole,
    collar(chest){
      chest.add(at(rbox(1.5,0.4,1.02,.45,mogHoodM),0,2.06,0));            // hood bunched at the neck
      chest.add(at(rbox(1.3,0.62,0.56,.5,mogHoodM),0,2.0,-0.42));
    },
    hair: mogHair,
    face(head){},
  }, parent);
  c.root.scale.set(1.24,0.84,1.24);                                       // short, round, heavy
  // bomb in the right hand
  const bomb = new THREE.Group();
  bomb.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.42,10,8), L({map:mogBombTex})),0,-0.5,0));
  bomb.add(at(cyl(0.06,0.05,0.3,L({color:0x8a6a44}),5),0.05,-0.08,0));
  bomb.add(at(spriteOf(puffTex,0.42,0xffb13d),0.08,0.08,0));
  c.R.hd.add(bomb);
  // steel bar (rebar) in the right hand for the smash
  const bar = new THREE.Group();
  const barM = L({color:0x8d8f96});
  bar.add(at(cyl(0.1,0.1,2.8,barM,6),0,-1.4,0));
  for (let i=0;i<9;i++) bar.add(at(cyl(0.13,0.13,0.1,barM,6),0,-0.35-i*0.3,0));
  c.R.hd.add(bar);
  c.props = {bomb, bar};
  c.setOld = ()=>{};
  c.mogHoodM = mogHoodM; c.mogFrontM = mogFrontM; c.mogSlvM = mogSlvM;
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = mogFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = mogFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------------- 大招：樂搞世志 ---------------- */
const MOG_WORDS = ['搞','巨','炸','哇勒個豆','拉完了'];
function mogBeamMesh(){
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,1,14), L({color:0xfff0e6}));
  core.rotation.z = -Math.PI/2; g.add(core);
  const shellM = new THREE.MeshBasicMaterial({color:0xff2b1e, transparent:true, opacity:.6, depthWrite:false});
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(3.0,3.0,1,16), shellM);
  shell.rotation.z = -Math.PI/2; g.add(shell);
  const glowM = new THREE.MeshBasicMaterial({color:0xff7a4a, transparent:true, opacity:.28, depthWrite:false});
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(4.4,4.4,1,16), glowM);
  glow.rotation.z = -Math.PI/2; g.add(glow);
  scene.add(g);
  return {g, core, shell, glow};
}
function masterogwayFinal(f, opp){
  f.finalT = 99; f.state = 'final'; f.move = null;
  banner('樂搞世志！'); SFX.boom();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1,12,10), new THREE.MeshBasicMaterial({color:0xff3a22, transparent:true, opacity:.85, depthWrite:false}));
  scene.add(ball);
  const B = mogBeamMesh(); B.g.visible = false;
  G.finals.push({owner:f, target:opp, t:0, ball, B, hit:new Map(), wordT:0, chant:0, blasted:false, fired:false, x0:f.x, y0:f.y,
    update: masterogwayFinalUpdate,
    dispose(F){
      scene.remove(F.ball); scene.remove(F.B.g);
      const m = F.owner.m; if (m && m.head) m.head.scale.set(1,1,1);
      if (m && m.setFace) m.setFace('normal');
    }});
}
function masterogwayFinalUpdate(F, dt, t){
  const f = F.owner, homeX = MAIN.x1 + 5, homeY = 1.2;
  f.state = 'final'; f.finalT = 99; f.onGround = false; f.vx = 0; f.vy = 0; f.face = 1;
  // 1) fly to the left edge, head swells up past the first platform
  const fly = Math.min(1, F.t/0.55), e = fly*fly*(3-2*fly);
  f.x = F.x0 + (homeX - F.x0)*e;
  f.y = F.y0 + (homeY - F.y0)*e;
  const hs = 1 + 3.4*Math.min(1, F.t/0.8);
  if (f.m && f.m.head) f.m.head.scale.set(hs, hs, hs);
  if (f.m && f.m.setFace) f.m.setFace(F.t > 0.8 ? 'shout' : 'normal');
  const mouthX = f.x + 1.2, mouthY = f.y + 4.2;
  // 2) charge
  if (F.t < 1.25){
    const k = Math.min(1, F.t/1.25);
    F.ball.visible = true;
    F.ball.position.set(mouthX, mouthY, 0);
    F.ball.scale.setScalar(0.6 + k*2.6 + Math.sin(t*22)*.12);
    if (F.chant < 3 && F.t > 0.35 + F.chant*0.3){ pop(MOG_WORDS[F.chant], f.x + 3, f.y + 11 - F.chant, 'red'); F.chant++; SFX.swing(); }
    if (Math.random() < dt*26) burst(mouthX + (Math.random()-.5)*4, mouthY + (Math.random()-.5)*4, 0xff5a3c, 1, 7);
    G.shake = reduce ? .1 : .35;
    return false;
  }
  // 3) fire the beam
  F.ball.visible = false;
  const bt = F.t - 1.25;
  if (!F.fired){ F.fired = true; SFX.boom(); SFX.laugh(); G.flash = .5; banner('哇勒個豆！！'); }
  const len = Math.min(MAIN.x2 + 26 - mouthX, bt*95);
  const wob = 1 + Math.sin(t*26)*.06;
  F.B.g.visible = true;
  [F.B.core, F.B.shell, F.B.glow].forEach((m,i)=>{ m.scale.set(wob*(1+i*.04), len, wob*(1+i*.04)); });
  F.B.g.position.set(mouthX + len/2, mouthY, 0);
  G.shake = reduce ? .15 : .7;
  if (Math.random() < dt*30){
    const p = spriteOf(puffTex, 2.2 + Math.random()*2, 0xff6a3c);
    p.position.set(mouthX + Math.random()*len, mouthY + (Math.random()-.5)*7, (Math.random()-.5)*4);
    scene.add(p); G.fx.push({o:p, t:0, life:.45, grow:2.4, base:2.2});
  }
  // words riding inside the beam
  F.wordT += dt;
  if (F.wordT > .22){ F.wordT = 0; pop(MOG_WORDS[Math.floor(Math.random()*MOG_WORDS.length)], mouthX + Math.random()*Math.min(len, 46), mouthY + (Math.random()-.5)*6, Math.random()<.4 ? 'big' : 'red'); }
  // 4) everyone in the beam gets cooked, then launched
  for (const v of G.fighters){
    if (v===f || !v.hittable()) continue;
    const inBeam = v.x > mouthX - 2 && v.x < mouthX + len && Math.abs((v.y + 3.4) - mouthY) < 6.4;
    if (!inBeam) continue;
    let C = F.hit.get(v); if (!C){ C = {tick:0, n:0}; F.hit.set(v, C); SFX.spike(); pop('被樂化了！', v.x, v.y+9, 'big'); }
    C.tick += dt;
    if (C.tick > .18){ C.tick = 0; C.n++; v.pct += 3; v.meter = Math.min(100, v.meter+2); v.hitstun = .3; v.state = 'hurt'; v.vx = 14; v.vy = 2; spark(v.x, v.y+3, 1.6); }
  }
  if (!F.blasted && bt > 1.55){
    F.blasted = true; G.flash = .7; G.freeze = .16; G.shake = reduce ? .25 : 1.5; SFX.hit(55); SFX.boom();
    for (const [v] of F.hit){ if (!v.hittable()) continue; launch(v, 36 + v.pct*.12, 40, 1); spark(v.x, v.y+3, 5); }
    pop('拉完了！', mouthX + 18, mouthY + 4, 'big');
  }
  if (bt > 1.95){ f.finalT = .01; f.state = 'air'; return true; }
  return false;
}

/* ---------------- 勝利：工程師樂，房子拔地而起 ---------------- */
function mogHardHat(){
  const g = new THREE.Group(), y = L({color:0xf2bf1d}), y2 = L({color:0xd79f0f});
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.62,12,8,0,Math.PI*2,0,Math.PI/2), y);
  g.add(dome);
  g.add(at(cyl(0.86,0.86,0.1,y2,14),0,0.02,0));
  g.add(at(rbox(0.16,0.3,1.2,.4,y2),0,0.3,0));
  return g;
}
function mogBuilding(){
  const g = new THREE.Group();
  const wallTex = tex(32,64,(gg)=>{
    speckle(gg,32,64,'#cfc8bd',['#d8d2c8','#c3bdb3'],.4);
    gg.fillStyle='#4e6a86';
    for(let y=4;y<64;y+=8) for(let x=3;x<32;x+=7) gg.fillRect(x,y,5,5);
    gg.fillStyle='rgba(255,255,255,.35)';
    for(let y=4;y<64;y+=8) for(let x=3;x<32;x+=7) gg.fillRect(x,y,5,1);
    gg.fillStyle='#9a9289'; for(let y=0;y<64;y+=8) gg.fillRect(0,y,32,1);
  },[2,1]);
  const wallM = L({map:wallTex});
  g.add(at(rbox(7,18,6,.1,wallM),0,9,0));
  g.add(at(rbox(7.6,0.6,6.6,.2,L({color:0x8e867c})),0,18.2,0));
  g.add(at(rbox(3.2,1.6,3.2,.2,L({color:0xb8b0a5})),0,19.2,0));
  g.add(at(cyl(0.12,0.12,3.4,L({color:0xc9c2b8}),6),0,21.6,0));
  g.add(at(rbox(2.6,1.0,0.3,.2,L({color:0x7f8a99})),0,1.0,3.05));          // entrance
  return g;
}
function masterogwayWinSetup(R){
  const W = R.W;
  R.hat = mogHardHat(); R.hat.position.set(0,0.62,0); R.hat.scale.setScalar(1.05); W.m.head.add(R.hat); R.attach.push(R.hat);
  R.bld = mogBuilding();
  R.bld.position.set(W.m.holder.position.x + 9, RS_Y - 19, -7);
  scene.add(R.bld); R.items.push(R.bld);
  R.dust = 0;
}
function masterogwayWinUpdate(R, dt, k){
  const W = R.W;
  const rise = Math.max(0, Math.min(1, (R.t - 0.7)/2.6)), e = rise*rise*(3-2*rise);
  R.bld.position.y = RS_Y - 19 + 19*e;
  if (rise > 0 && rise < 1){
    R.dust += dt;
    if (R.dust > .07){ R.dust = 0; const p = spriteOf(puffTex, 2.4 + Math.random()*1.8, 0xd9d2c6);
      p.position.set(R.bld.position.x + (Math.random()-.5)*9, RS_Y + Math.random()*1.5, -7 + (Math.random()-.5)*5);
      scene.add(p); R.puffs.push({o:p, life:1.4, vy:1.2, grow:1.6}); }
    if (Math.floor(R.t*6)!==Math.floor((R.t-dt)*6)) SFX.soft();
    G.shake = reduce ? .1 : .4;
  }
  applyPose(W.m, R.t < 0.7 ? POSE.stand : (R.t < 3.4 ? POSE.ponder : (Math.sin(R.t*9) > 0 ? POSE.thumbs : POSE.cheer)), k);
  once('mogH', .25, ()=>SFX.whistle());
  once('mogW1', 3.5, ()=>{ SFX2.fanfare(); popAt('終於搞完了', R.W, 8.6, 'big'); });
  once('mogW2', 4.8, ()=>{ SFX.boom(); popAt('這個真的有夠炸', R.W, 8.6, 'red'); });
  const up = Math.max(0, Math.min(1, (R.t - 0.8)/2.2)), s = up*up*(3-2*up);
  R.look.set(-6 + 7.5*s, RS_Y + 9 - 5.6*s, -4);
}

/* ---------------- 戰敗：巨頂 → 大鼎 → 幽靈 → 大便 ---------------- */
function mogDing(){
  const g = new THREE.Group();
  const bM = L({color:0x5d4a2e}), bD = L({color:0x44361f});
  g.add(at(cyl(2.5,1.75,3.4,bM,16),0,3.1,0));                              // deep round belly
  g.add(at(cyl(2.85,2.85,0.5,bD,16),0,4.9,0));                             // rim
  g.add(at(cyl(2.6,2.6,0.25,L({color:0x6b5636}),16),0,4.55,0));
  [-1,1].forEach(s=>{
    g.add(at(rbox(0.46,1.6,0.46,.3,bD),s*1.5,5.8,0));                      // upright ears
    g.add(at(rbox(0.46,0.3,0.46,.3,bD),s*1.5,6.6,0));
  });
  [0,1,2].forEach(i=>{ const a = i*Math.PI*2/3 + .5;
    g.add(at(cyl(0.45,0.28,2.6,bD,8),Math.cos(a)*1.55,0.3,Math.sin(a)*1.55)); });   // three legs
  for (let i=0;i<10;i++){ const a = i*Math.PI/5;                           // taotie band
    g.add(at(rbox(0.3,0.5,0.3,.3,L({color:0x3b2f1b})),Math.cos(a)*2.3,4.0,Math.sin(a)*2.3)); }
  return g;
}
function mogGhost(){
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({color:0xeaf4ff, transparent:true, opacity:.65, depthWrite:false});
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10), m),0,1.4,0));
  g.add(at(rbox(1.7,1.6,1.3,.6,m),0,0.5,0));
  [-1,1].forEach(s=>g.add(at(rbox(0.4,0.9,0.4,.5,m),s*1.0,0.9,0)));
  const dot = L({color:0x1a1a22});
  [-1,1].forEach(s=>g.add(at(rbox(0.16,0.26,0.1,.4,dot),s*0.32,1.55,1.02)));
  g.add(at(rbox(0.4,0.2,0.1,.4,dot),0,1.15,1.02));
  return g;
}
function mogPoop(){
  const g = new THREE.Group(), m = L({color:0x5a3a1c}), m2 = L({color:0x6d4824});
  const blob = (r, y, mat)=>{ const s = new THREE.Mesh(new THREE.SphereGeometry(r,12,10), mat); s.scale.y = 0.52; s.position.y = y; g.add(s); };
  blob(2.0, 0.6, m); blob(1.5, 1.4, m2); blob(1.0, 2.0, m); blob(0.55, 2.45, m2);
  g.add(at(cyl(0.02,0.22,0.5,m,8),0,2.85,0));                              // the little swirl tip
  const eye = L({color:0xf5f0e6});
  [-1,1].forEach(s=>g.add(at(rbox(0.3,0.3,0.1,.5,eye),s*0.45,1.45,1.3)));
  return g;
}
function masterogwayLoseSetup(R){
  const Lz = R.Lz, x = Lz.m.holder.position.x, z = Lz.m.holder.position.z;
  R.ding = mogDing(); R.ding.position.set(x, RS_Y + 34, z); R.ding.visible = false; scene.add(R.ding); R.items.push(R.ding);
  R.gh = mogGhost(); R.gh.position.set(x, RS_Y + 1, z + 3.2); R.gh.visible = false; scene.add(R.gh); R.items.push(R.gh);
  R.pp = mogPoop(); R.pp.position.set(x, RS_Y + 30, z + 3.2); R.pp.visible = false; scene.add(R.pp); R.items.push(R.pp);
  R.lx = x; R.lz = z;
}
function masterogwayLoseUpdate(R, dt, k){
  const Lz = R.Lz, t = R.t;
  R.ding.visible = false; R.gh.visible = false; R.pp.visible = false;
  Lz.m.holder.visible = true;
  Lz.m.body.scale.set(SC, SC, SC);
  if (t < 1.0){
    // 比讚：巨頂！
    applyPose(Lz.m, POSE.thumbs, k); Lz.m.setFace('normal');
    once('mogL1', .25, ()=>{ popAt('巨頂！', Lz, 8.4, 'big'); SFX.laughShort(); });
  } else if (t < 1.7){
    // 鼎 falls
    applyPose(Lz.m, POSE.dizzy, k); Lz.m.setFace('cry');
    R.ding.visible = true;
    const d = (t - 1.0)/0.7;
    R.ding.position.y = RS_Y + 34 - 32.5*d*d;
    R.ding.rotation.y = d*2.2;
    once('mogL2', 1.05, ()=>{ SFX.whistle(); popAt('？？', Lz, 8.4, 'blue'); });
  } else if (t < 2.5){
    // squashed
    R.ding.visible = true; R.ding.position.y = RS_Y + 1.5; R.ding.rotation.y = 2.2;
    const sq = Math.max(0.12, 1 - (t-1.7)*7);
    Lz.m.body.scale.set(SC*1.5, SC*Math.max(0.1, sq*0.5), SC*1.5);
    applyPose(Lz.m, POSE.flat || POSE.hurt, k); Lz.m.setFace('cry');
    once('mogL3', 1.72, ()=>{ SFX.crash(); G.shake = reduce ? .3 : 1.6; popAt('壓扁了', Lz, 5.5, 'red'); });
  } else if (t < 3.4){
    // ghost floats out
    R.ding.visible = true; R.ding.position.y = RS_Y + 1.5; R.ding.rotation.y = 2.2;
    Lz.m.holder.visible = false;
    R.gh.visible = true;
    const u = (t - 2.5)/0.9;
    R.gh.position.set(R.lx, RS_Y + 1.5 + u*4.4, R.lz + 3.2);
    R.gh.rotation.z = Math.sin(t*4)*.12;
    once('mogL4', 2.6, ()=>SFX.sob());
    once('mogL5', 3.0, ()=>pop('拉完了……', R.lx, RS_Y + 10, 'blue'));
  } else {
    R.ding.visible = true; R.ding.position.y = RS_Y + 1.5; R.ding.rotation.y = 2.2;
    Lz.m.holder.visible = false;
    R.gh.visible = true; R.gh.position.set(R.lx, RS_Y + 5.9, R.lz + 3.2);
    R.pp.visible = true;
    const d = Math.min(1, (t - 3.4)/0.6);
    R.pp.position.set(R.lx, RS_Y + 30 - 22.2*d*d, R.lz + 3.2);
    if (d >= 1){
      R.pp.position.y = RS_Y + 7.8;
      R.gh.position.y = RS_Y + 5.5 + Math.sin(t*3)*.1;
      once('mogL7', 4.15, ()=>{ SFX.soft(); pop('…還被砸到', R.lx + 1, RS_Y + 11, 'red'); G.shake = reduce ? .15 : .6; });
    }
    once('mogL6', 3.45, ()=>SFX.swing());
  }
}

/* ---------------- register ---------------- */
registerChar('masterogway', {
  stats: { name:'樂', en:'Master Ogway', tag:'天龍人・土木系・樂化傳染', weight:1.4, run:14, air:10, jumpV:26, djV:23, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.3], pose:['jabR','punch2'], box:[2.1,3.6,1.5], dmg:7, kb:9, sc:.75, ang:38, text:'巨！'},
    side:{t:[.26,.12,.34], pose:['batWind','batHit'], box:[3.0,3.4,1.9], dmg:17, kb:13, sc:1.1, ang:36, prop:'bar', sfx:'swing', text:'鋼筋搞起來！'},
    up:{t:[.17,.12,.3], pose:['upWind','upHit'], box:[0.5,6.8,1.9], dmg:13, kb:12, sc:1.0, ang:88, text:'頂上去！'},
    down:{t:[.22,.12,.34], pose:['bookUp','bookSlam'], box:[2.1,1.0,2.0], dmg:13, kb:10, sc:.85, ang:62, sfx:'crash', text:'灌漿！'},
    nair:{t:[.07,.2,.16], pose:['nair','nair'], box:[0,3,2.2], dmg:8, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.11,.1,.22], pose:['jabR','fair'], box:[2.2,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.7], dmg:9, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.2,.12,.28], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.9], dmg:14, kb:7, sc:.8, ang:-68, air:1, text:'砸！'},
    nB:{t:[.18,.08,.3], pose:['laughIn','laugh'], fire:[[.18,'mogShout']], air:1, text:'哇勒個豆！'},
    sB:{t:[.2,.06,.32], pose:['throwWind','throwHit'], fire:[[.2,'mogBomb']], air:1, sfx:'swing', text:'炸了！', prop0:'bomb'},
    uB:{t:[.08,.5,.12], pose:['squat','helpless'], poseSwitch:.22, start:'mogFart', box:[0.4,4.6,1.8], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1, text:'拉完了！'},
    dB:{t:[.2,.55,.34], pose:['ponder','laughUp'], poseSwitch:.25, box:[0,4.4,4.8], dmg:6, kb:4, sc:.25, ang:50, air:1, onHit:'mogLehua', text:'搞 巨 炸'},
  },
  fire: {
    mogShout(f){
      proj({owner:f, x:f.x+f.face*1.8, y:f.y+5.0, vx:f.face*26, vy:0, g:0, r:1.2, life:1.0, dmg:8, kb:8, sc:.6, ang:42, mesh:spriteOf(mogWordTex,1.8,0xff6a4a)});
      SFX.laughShort();
    },
    mogBomb(f){
      proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.6, vx:f.face*19, vy:9, g:34, r:1.1, life:2.2, bounce:1, dmg:15, kb:13, sc:1.0, ang:52, mesh:spriteOf(mogBombTex,1.5)});
      SFX.fire();
    },
  },
  start: {
    mogFart(f){
      f.vy = 30; f.vx = f.face*5; f.onGround = false; f.jumps = 0; f.ff = false;
      SFX.soft(); burst(f.x, f.y+0.8, 0xc7b36a, 10, 7);
    },
  },
  onhit: {
    mogLehua(att, v){
      v.state = 'stun'; v.stunT = .85; v.move = null;
      pop(['搞','巨','炸'][Math.floor(Math.random()*3)], v.x, v.y+7.6, 'red');
      pop('我被樂化了…', v.x, v.y+9.6, 'blue');
      att.buffT = Math.max(att.buffT||0, 4);
    },
  },
  build: buildMasterogway, face: mogFaces.normal, portraitBg: '#9fb8cf',
  portrait(g){ g.fillRect(4,2,56,24); g.fillRect(3,20,10,18); g.fillRect(51,20,10,18); g.fillRect(8,22,48,6); },
  skins: [{ name:'牛仔襯衫', apply(c){
    const dM = L({map:mogDenimTex}), dF = L({map:mogDenimFront});
    c.chest.children.forEach(o=>{ if (o.material && o.material.length===6) o.material = [dM,dM,dM,dM,dF,dM]; else if (o.material && o.material.map===mogHoodTex) o.material = dM; });
    [c.R, c.Lf].forEach(A=>{ [A.sh, A.el].forEach(p=>p.children.forEach(o=>{ if (o.material && o.material.map===mogSleeveTex) o.material = dM; })); });
  }}],
  shieldPose: 'block', shieldProp: null, breakText: '炸了啦！',
  finalPose: 'laughUp', finalProp: null,
  introPose: 'ponder', readyPose: (t)=> Math.sin(t*10) > 0 ? POSE.thumbs : POSE.laugh, selectSfx: ()=>SFX.laughShort(),
  winSub: '"Just build it, bro."',
  final: masterogwayFinal, finalUpdate: masterogwayFinalUpdate,
  winSetup: masterogwayWinSetup, winUpdate: masterogwayWinUpdate,
  loseSetup: masterogwayLoseSetup, loseUpdate: masterogwayLoseUpdate,
  longWin: true, longLose: true,
});
