/* 心瑩（泡泡老師）— 公衛系、泡泡招式、會帶幼稚園弟弟；防禦是一顆泡泡，撐太久會破 */
'use strict';

// ---------- textures ----------
const XY_SKIN = '#f1d2bb', XY_SKIN_C = ['#ebc8ae','#f6dcc8','#e8c4a8'];
const XY_HAIR = '#3b2620';
const xySkinTex = tex(16,16,(g)=>speckle(g,16,16,XY_SKIN,XY_SKIN_C,.35));
const xyHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,XY_HAIR,['#45302a','#33201b','#4d362d'],.5);
  g.fillStyle='rgba(120,80,60,.35)'; for (let i=0;i<14;i++) g.fillRect((i*7)%32, 0, 1, 32);     // light strands
  g.fillStyle='rgba(20,10,8,.25)'; for (let i=0;i<10;i++) g.fillRect((i*11+3)%32, 0, 1, 32);
});
const xyHairEndTex = tex(32,32,(g)=>{                                                            // lighter, warmer ends
  speckle(g,32,32,'#56382b',['#62402f','#4a3026','#6b4734'],.5);
  g.fillStyle='rgba(150,100,70,.35)'; for (let i=0;i<12;i++) g.fillRect((i*5)%32, 0, 1, 32);
});
function xyFace(g, mode){
  speckle(g,64,64,XY_SKIN,XY_SKIN_C,.3); shadeFace(g);
  g.fillStyle='rgba(240,140,140,.28)';                                                          // rosy cheeks
  g.beginPath(); g.ellipse(14,44,6,3.5,0,0,7); g.fill(); g.beginPath(); g.ellipse(50,44,6,3.5,0,0,7); g.fill();
  g.fillStyle='#4a3026'; g.fillRect(13,26,10,2); g.fillRect(41,26,10,2); g.fillRect(22,27,2,1); g.fillRect(40,27,2,1);   // soft brows
  g.strokeStyle='#1e1411'; g.lineWidth=2; g.lineCap='round';
  if (mode==='cry'){
    [19,45].forEach(x=>{ g.beginPath(); g.moveTo(x-5,37); g.quadraticCurveTo(x,34,x+5,37); g.stroke(); });
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(16,39,3,13); g.fillRect(45,39,3,13);
    g.fillStyle='#7a3030'; g.beginPath(); g.ellipse(32,51,4,2.5,0,0,7); g.fill();
    return;
  }
  if (mode==='gross'){                                                                          // > <  "噁～"
    g.beginPath(); g.moveTo(14,33); g.lineTo(22,37); g.lineTo(14,41); g.stroke();
    g.beginPath(); g.moveTo(50,33); g.lineTo(42,37); g.lineTo(50,41); g.stroke();
    g.strokeStyle='#7a3030'; g.beginPath(); g.moveTo(25,50); for (let x=25;x<=39;x+=3.5) g.lineTo(x, 50 + ((x-25)/3.5 % 2 ? -2 : 1)); g.stroke();
    return;
  }
  // eyes: big smiling crescents with a dark iris peeking + lashes
  [19,45].forEach(x=>{
    g.fillStyle='#2a1a14'; g.beginPath(); g.ellipse(x,37,4.5,3,0,Math.PI,0); g.fill();
    g.fillStyle='#fff'; g.fillRect(x-1,35,2,1);
    g.beginPath(); g.moveTo(x-6,38); g.quadraticCurveTo(x,32,x+6,38); g.stroke();
    g.fillStyle='#1e1411'; g.fillRect(x + (x<32 ? -7 : 5), 36, 2, 1);
  });
  g.fillStyle='rgba(150,95,75,.45)'; g.fillRect(31,42,2,3);                                    // nose
  if (mode==='blow'){ g.fillStyle='#b24a4a'; g.beginPath(); g.arc(32,50,3,0,7); g.fill(); g.fillStyle='#5a1c1c'; g.beginPath(); g.arc(32,50,1.5,0,7); g.fill(); return; }
  g.fillStyle='#7a2b2b'; g.beginPath(); g.moveTo(24,47); g.quadraticCurveTo(32,56,40,47); g.closePath(); g.fill();   // big smile
  g.fillStyle='#fffaf4'; g.fillRect(26,47,12,2);
}
const xyFaces = { normal:tex(64,64,(g)=>xyFace(g,'normal')), cry:tex(64,64,(g)=>xyFace(g,'cry')), gross:tex(64,64,(g)=>xyFace(g,'gross')), blow:tex(64,64,(g)=>xyFace(g,'blow')) };
// fuzzy light-grey knit sweater
const XY_KNIT = '#cfd3d6', XY_KNIT_C = ['#c5c9cd','#d9dde0','#bfc3c7','#e2e5e7'];
const xyKnitTex = tex(32,32,(g)=>{ speckle(g,32,32,XY_KNIT,XY_KNIT_C,.6); g.fillStyle='rgba(255,255,255,.18)'; for (let i=0;i<40;i++) g.fillRect((i*13)%32,(i*7)%32,1,1); });
const xyKnitFront = tex(32,46,(g)=>{
  speckle(g,32,46,XY_KNIT,XY_KNIT_C,.6);
  g.fillStyle='rgba(255,255,255,.18)'; for (let i=0;i<60;i++) g.fillRect((i*13)%32,(i*7)%46,1,1);
  g.fillStyle='rgba(120,125,130,.35)'; for (let x=0;x<32;x+=2) g.fillRect(x,40,1,6);             // ribbed hem
  g.strokeStyle='#4cae5a'; g.lineWidth=1.4;                                                       // green lanyard (V) + badge
  g.beginPath(); g.moveTo(9,0); g.lineTo(15,16); g.moveTo(23,0); g.lineTo(17,16); g.stroke();
  g.fillStyle='#9aa0a6'; g.fillRect(15,16,2,2);
  g.fillStyle='#e9dff2'; g.fillRect(12,18,9,12); g.strokeStyle='#c9bfd6'; g.lineWidth=1; g.strokeRect(12.5,18.5,8,11);
  g.fillStyle='#8a7aa8'; g.fillRect(14,21,5,1); g.fillRect(14,24,4,1);
});
const xyPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#4a2c24',['#54332a','#40261f','#5a382d'],.5); g.fillStyle='rgba(0,0,0,.12)'; for (let x=3;x<32;x+=7) g.fillRect(x,0,1,32); });
const xyBootTex = tex(16,16,(g)=>speckle(g,16,16,'#c9a57c',['#bf9a70','#d4b088','#b88f64'],.5));
// skin: black tee with a holographic swirl logo over a white sheer turtleneck
const xyTeeTex = tex(32,32,(g)=>speckle(g,32,32,'#1b1b1e',['#222226','#141416'],.4));
const xyTeeFront = tex(32,46,(g)=>{
  speckle(g,32,46,'#1b1b1e',['#222226','#141416'],.4);
  const grd = g.createLinearGradient(8,20,26,30); grd.addColorStop(0,'#f2e3a6'); grd.addColorStop(.5,'#cfe8f0'); grd.addColorStop(1,'#e9c0e8');
  g.strokeStyle=grd; g.lineWidth=2;
  for (let i=0;i<3;i++){ g.beginPath(); g.arc(11+i*5,26,2.6,Math.PI*.2,Math.PI*1.9); g.stroke(); }
  g.beginPath(); g.moveTo(25,24); g.quadraticCurveTo(29,27,25,30); g.stroke();
  g.strokeStyle='#4cae5a'; g.lineWidth=1.4; g.beginPath(); g.moveTo(8,0); g.lineTo(13,46); g.stroke();
});
const xyTurtleTex = tex(16,16,(g)=>{ speckle(g,16,16,'#e9e6df',['#f2efe9','#dedad2'],.4); g.fillStyle='rgba(255,255,255,.6)'; for (let i=0;i<10;i++) g.fillRect((i*5)%16,(i*3)%16,1,1); });

// bubbles
const xyBubTex = tex(64,64,(g)=>{
  const grd = g.createRadialGradient(32,32,18,32,32,31);
  grd.addColorStop(0,'rgba(200,235,255,.08)'); grd.addColorStop(.75,'rgba(180,225,255,.25)'); grd.addColorStop(.9,'rgba(255,190,240,.75)'); grd.addColorStop(1,'rgba(160,230,255,0)');
  g.fillStyle=grd; g.beginPath(); g.arc(32,32,31,0,7); g.fill();
  g.fillStyle='rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(22,20,6,3.5,-0.7,0,7); g.fill();
  g.fillStyle='rgba(255,255,255,.7)'; g.beginPath(); g.arc(42,44,2,0,7); g.fill();
});
const xyShellTex = tex(64,64,(g)=>{                                                              // rainbow film for 3D bubbles
  const grd = g.createLinearGradient(0,0,64,64);
  grd.addColorStop(0,'#bfe9ff'); grd.addColorStop(.3,'#f4c6f0'); grd.addColorStop(.55,'#fff1b8'); grd.addColorStop(.8,'#b8f5d8'); grd.addColorStop(1,'#bfe9ff');
  g.fillStyle=grd; g.fillRect(0,0,64,64);
  g.fillStyle='rgba(255,255,255,.55)'; g.fillRect(0,10,64,3); g.fillRect(0,40,64,2);
});
const xyShellM = new THREE.MeshBasicMaterial({map:xyShellTex, transparent:true, opacity:.32, depthWrite:false, side:THREE.DoubleSide});
function xyBubble3D(r){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(r,14,10), xyShellM));
  const hl = spriteOf(xyBubTex, r*2.05); g.add(hl);
  return g;
}

// ---------- kindergarten kid (弟弟) ----------
const xyKidFaceTex = tex(64,64,(g)=>{
  speckle(g,64,64,'#f3d0b4',['#ecc6a8','#f8dcc4'],.3); shadeFace(g);
  g.fillStyle='#1e1411'; g.fillRect(0,0,64,20);
  for (let i=0;i<8;i++){ g.beginPath(); g.moveTo(i*8,18); g.lineTo(i*8+8,18); g.lineTo(i*8+4,25); g.closePath(); g.fill(); }
  g.fillStyle='rgba(240,120,120,.4)'; g.beginPath(); g.arc(14,44,5,0,7); g.fill(); g.beginPath(); g.arc(50,44,5,0,7); g.fill();
  g.fillStyle='#1e1411'; g.beginPath(); g.arc(20,37,4,0,7); g.fill(); g.beginPath(); g.arc(44,37,4,0,7); g.fill();
  g.fillStyle='#fff'; g.fillRect(21,35,2,2); g.fillRect(45,35,2,2);
  g.fillStyle='#8a2b2b'; g.beginPath(); g.arc(32,47,5,0,Math.PI); g.fill();
});
const xyKidSmockTex = tex(32,32,(g)=>{ speckle(g,32,32,'#7fb6e8',['#74acdf','#8cc0ef'],.4); g.fillStyle='#ffffff'; g.fillRect(12,0,8,4); g.fillStyle='#f2c14e'; g.fillRect(14,14,4,4); });
const xyKidHatM = L({color:0xf5c518}), xyKidSkinM = L({color:0xf3d0b4}), xyKidHairM = L({color:0x1e1411});
function xyBuildKid(){
  const holder = new THREE.Group(), body = new THREE.Group(); body.scale.setScalar(SC*0.6); holder.add(body);
  const smockM = L({map:xyKidSmockTex});
  const c = buildChar({
    skinM:xyKidSkinM, faceM:L({map:xyKidFaceTex}), headW:1.3, headH:1.3,
    torsoMat:smockM, sleeveMat:()=>smockM, sleeve:[0.66,0.8],
    pantsM:L({color:0x2f4a8a}), shoeM, soleM:greySole,
    collar(chest){ chest.add(at(rbox(1.0,0.14,0.6,.4,L({color:0xffffff})),0,2.2,0.05)); },
    hair(head){
      head.add(at(rbox(1.36,0.44,1.3,.62,xyKidHairM),0,0.5,-0.02));
      head.add(at(cyl(0.72,0.78,0.42,xyKidHatM,12),0,0.86,0));                                // yellow kindergarten hat
      const brim = cyl(1.0,1.0,0.06,xyKidHatM,14); brim.position.y = 0.66; head.add(brim);
    },
  }, body);
  c.holder = holder; c.body = body; return c;
}

// ---------- model ----------
function buildWxinyy(parent){
  const hairM = L({map:xyHairTex}), endM = L({map:xyHairEndTex}), faceM = L({map:xyFaces.normal}), skinM = L({map:xySkinTex});
  const knitM = L({map:xyKnitTex}), frontM = L({map:xyKnitFront});
  const pantsM = L({map:xyPantsTex}), bootM = L({map:xyBootTex});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.1,
    torsoMat:[knitM,knitM,knitM,knitM,frontM,knitM], sleeveMat:()=>knitM, sleeve:[0.72,0.95],
    pantsM, shoeM:bootM, soleM:L({color:0xe9dcc6}),
    collar(chest){
      const col = at(cyl(0.36,0.4,0.22,knitM,12),0,2.26,0); chest.add(col);                      // round knit neckline
      const hem = at(rbox(1.7,0.32,1.0,.3,knitM),0,0.02,0); chest.add(hem);                       // slouchy ribbed hem
      return chest.userData.xy = {col, hem};
    },
    hair(head){
      const top = at(rbox(1.12,0.52,1.12,.68,hairM),0,0.5,-0.02); head.add(top);
      head.add(at(rbox(1.14,1.3,0.48,.55,hairM),0,-0.12,-0.34));                                  // back
      [-0.42,-0.21,0,0.21,0.42].forEach((x,i)=>{                                                  // long back ends, past shoulders
        const st = rbox(0.27,1.5 + (i%2)*0.25 - Math.abs(x)*.3,0.3,.5,i%2 ? endM : hairM); st.position.set(x,-1.05 - (i%2)*0.12,-0.36); st.rotation.z = -x*0.1; head.add(st);
      });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.15,0.85,0.66,.45,hairM),s*0.53,0.1,0.0));
        const side = rbox(0.3,1.9,0.62,.5,hairM); side.position.set(s*0.56,-0.66,0.08); side.rotation.z = s*0.04; head.add(side);   // face-framing layers
        const lay = rbox(0.22,1.0,0.36,.5,endM); lay.position.set(s*0.5,-0.25,0.34); lay.rotation.z = s*0.12; head.add(lay);
        const tip = rbox(0.22,0.5,0.5,.5,endM); tip.position.set(s*0.62,-1.65,0.06); tip.rotation.z = -s*0.25; head.add(tip);
      });
      // see-through wispy bangs
      head.add(at(rbox(1.02,0.2,0.14,.45,hairM),0,0.44,0.47));
      [-0.36,-0.18,0,0.18,0.36].forEach((x,i)=>{ const f = rbox(0.16,0.26 + (i%2)*0.06,0.1,.5,hairM); f.position.set(x,0.26,0.5); f.rotation.z = (i-2)*0.12; head.add(f); });
      return {top};
    },
    face(head){ [-1,1].forEach(s=>head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.06,6,4), L({color:0xf6f1e8})),s*0.52,-0.08,0.12))); },   // pearl studs
  }, parent);
  c.root.scale.set(0.92,0.88,0.92);                                                               // short, slim
  // long knit sleeves with rib cuffs
  [c.R, c.Lf].forEach(a=>{
    a.sh.children[1].material = knitM; a.el.children[0].material = knitM;
    a.el.add(at(cyl(0.2,0.2,0.22,knitM,8),0,-0.9,0));
  });
  // wide brown trousers + tan suede boots
  [c.joints.rHp, c.joints.lHp].forEach(h=>h.children[0].scale.set(1.22,1,1.2));
  [c.joints.rKn, c.joints.lKn].forEach(k=>{
    k.children[0].scale.set(1.38,1,1.32);
    k.add(at(cyl(0.42,0.36,0.2,pantsM,10),0,-1.28,0));                                            // gathered cuff
    k.add(at(cyl(0.33,0.33,0.4,bootM,10),0,-1.36,0.04));                                          // boot shaft
  });
  c.xyMat = {knitM, frontM, sweater:c.chest.userData.xy};
  // props
  const wandM = L({color:0xff8fc8});
  const wand = new THREE.Group(); c.R.hd.add(wand);
  wand.add(at(cyl(0.06,0.06,1.4,wandM,6),0,-0.75,0));
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.34,0.06,6,14), wandM); loop.position.set(0,-1.75,0); wand.add(loop);
  const film = new THREE.Mesh(new THREE.CircleGeometry(0.3,14), xyShellM); film.position.set(0,-1.75,0); wand.add(film);
  const scalpel = new THREE.Group(); c.R.hd.add(scalpel);
  scalpel.add(at(cyl(0.05,0.05,0.7,L({color:0x6fa2c8}),6),0,-0.4,0));
  scalpel.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.03,0.36,0.14), L({color:0xdfe6ea})),0,-0.92,0.03));
  const bigBub = xyBubble3D(3.3); bigBub.position.y = 3.6; bigBub.visible = false; c.root.add(bigBub);
  c.bigBub = bigBub;
  c.props = {wand, scalpel};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = xyFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = xyFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* 被包住時狂按任何按鈕就能提早掙脫。core 把每次按鍵存成 bAtk/bSp/bJump/bFin 緩衝（按下那一幀會跳高），
   所以只要比較上一幀的數值就能數出按了幾下。F 可以是任何物件（G.finals 項目，或大招裡的一個泡泡）。 */
function escapeMash(F, v, need){
  const b = [v.bAtk, v.bSp, v.bJump, v.bFin];
  if (!F.mashP){ F.mashP = b.slice(); F.mashN = 0; }
  for (let i=0;i<4;i++) if (b[i] > F.mashP[i] + 1e-4) F.mashN++;
  F.mashP = b;
  return F.mashN >= need;
}
function escapeK(F, need){ return Math.min(1, (F.mashN || 0)/need); }    // 0→1，用來把泡泡縮小當進度條

// ---------- bubble trap (a "final" entry so it is cleaned up with the match) ----------
function xyTrap(att, v, sec, size){
  if (v.xyTrapped) return;
  v.xyTrapped = true; v.state = 'stun'; v.stunT = sec; v.move = null; v.vx *= .3; v.vy = 2;
  const mesh = xyBubble3D(size || 3.4); scene.add(mesh);
  pop('被泡泡包住了！快按鈕掙脫！', v.x, v.y+8, 'blue');
  G.finals.push({owner:att, v, t:0, mesh, need:5, update(F, dt){
    const V = F.v;
    if (escapeMash(F, V, F.need) && V.state!=='dead'){
      V.xyTrapped = false; V.state = 'idle'; V.stunT = 0;
      burst(V.x, V.y+3.2, 0xcfeeff, 14, 11); SFX.xyPop(); pop('掙脫！', V.x, V.y+7.5, 'big');
      return true;
    }
    if (V.state==='stun' && V.stunT > 0 && V.state!=='dead'){
      V.vy = 2.6; V.vx *= Math.exp(-dt*4);
      F.mesh.position.set(V.x, V.y + 3.2 + Math.sin(F.t*4)*.15, .3);
      const w = (1 + Math.sin(F.t*7)*.05)*(1 - escapeK(F, F.need)*.3); F.mesh.scale.set(w, 2 - w, w);
      return false;
    }
    V.xyTrapped = false;
    if (V.state!=='dead'){ burst(V.x, V.y+3.2, 0xcfeeff, 12, 9); SFX.xyPop(); pop('啵！', V.x, V.y+7); }
    return true;
  }, dispose(F){ F.v.xyTrapped = false; scene.remove(F.mesh); freeObj(F.mesh); }});
}

// ---------- ultimate: 全班泡泡派對 — bubble rain traps everyone, then they all pop ----------
function xyFinal(f, opp){
  f.finalT = 1.6; banner('泡泡老師的全班泡泡派對！'); SFX.xyBlow(); pop('大家一起吹泡泡～！', f.x, f.y+7.5, 'big');
  const bubs = [], x1 = MAIN.x1 - 4, x2 = MAIN.x2 + 4;
  const aim = nearestFoe(f);
  for (let i=0;i<16;i++){
    const r = 2.2 + Math.random()*1.3, m = xyBubble3D(r);
    const x = i===0 && aim ? aim.x : x1 + (x2 - x1)*(i + Math.random()*.8)/16;
    const b = {m, r, x, y:15 + Math.random()*9, vy:-(8 + Math.random()*4), ph:Math.random()*6};
    m.position.set(b.x, b.y, -.5); scene.add(m); bubs.push(b);
  }
  G.finals.push({owner:f, t:0, bubs, caught:[], update(F, dt){
    for (const b of F.bubs){
      if (!b.m.visible) continue;
      b.y += b.vy*dt; b.x += Math.sin(F.t*2 + b.ph)*1.5*dt; b.m.position.set(b.x, b.y, -.5);
      if (b.y < -12) b.m.visible = false;
      for (const v of G.fighters){
        if (v===f || !v.hittable() || F.caught.some(c=>c.v===v)) continue;
        if (Math.abs(v.x - b.x) < b.r + 1 && v.y + 3 > b.y - b.r && v.y < b.y + b.r){
          F.caught.push({v, b}); v.state = 'stun'; v.stunT = 9; v.move = null; v.vx = 0; v.pct += 4;
          b.vy = 0; SFX.xyPop(); pop('抓到了！狂按才掙脫得開！', v.x, v.y+8, 'blue');
        }
      }
    }
    // 大招的泡泡比較硬：要按 12 下才掙脫得開（下必殺只要 5 下）
    for (let i = F.caught.length - 1; i >= 0; i--){
      const c = F.caught[i];
      if (F.t >= 3.2) continue;
      if (c.v.state!=='dead' && escapeMash(c, c.v, 12)){
        c.b.m.visible = false; c.v.state = 'idle'; c.v.stunT = 0;
        burst(c.v.x, c.v.y+3.2, 0xcfeeff, 16, 12); SFX.xyPop(); pop('掙脫！', c.v.x, c.v.y+7.5, 'big');
        F.caught.splice(i, 1); continue;
      }
      c.v.vy = 3; c.v.vx *= .8; c.b.x = c.v.x; c.b.y = c.v.y + 3.2; c.b.m.position.set(c.b.x, c.b.y, .3);
      const w = 1 - escapeK(c, 12)*.35; c.b.m.scale.set(w, 2 - w, w);
    }
    if (F.t >= 3.2 && !F.popped){
      F.popped = true; SFX.boom(); G.shake = reduce ? .2 : 1; G.flash = .3;
      for (const c of F.caught){
        const v = c.v; c.b.m.visible = false; v.stunT = 0; burst(v.x, v.y+3, 0xcfeeff, 16, 12); burst(v.x, v.y+3, 0xffc8f0, 8, 9);
        if (v.state==='dead') continue;
        v.pct += 16; launch(v, 22 + v.pct*.11, 55, Math.sign(v.x - f.x) || f.face); pop('啵啵啵！！', v.x, v.y+8, 'big');
      }
      F.bubs.forEach(b=>{ if (b.m.visible){ b.m.visible = false; burst(b.x, b.y, 0xcfeeff, 6, 6); } });
    }
    return F.t > 3.6 || (F.t > 3 && !F.caught.length && F.bubs.every(b=>!b.m.visible));
  }, dispose(F){ F.bubs.forEach(b=>{ scene.remove(b.m); freeObj(b.m); }); F.caught.forEach(c=>{ if (c.v.state==='stun' && c.v.stunT > 3) c.v.stunT = 0; }); }});
}

// ---------- results ----------
function xyRiseBubbles(R, x, y, n){
  for (let i=0;i<n;i++){
    const s = spriteOf(xyBubTex, .7 + Math.random()*1.3); s.position.set(x + (Math.random()-.5)*1.5, y + Math.random(), -1 + Math.random()*3);
    scene.add(s); R.items.push(s); R.xyB.push({s, vx:(Math.random()-.5)*4, vy:2.5 + Math.random()*3, life:3 + Math.random()*2});
  }
}
function xyStepBubbles(R, dt){
  for (const b of R.xyB){ if (b.life <= 0) continue; b.life -= dt; b.s.position.x += b.vx*dt + Math.sin(R.t*3 + b.vy)*.02; b.s.position.y += b.vy*dt; if (b.life <= 0) b.s.visible = false; }
}
function xyWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0; R.xyB = []; R.kids = [];
  const spots = [[-4.2,1.6],[4.2,1.4],[-2.6,3.4],[2.8,3.6]];
  spots.forEach(([dx,dz], i)=>{
    const k = xyBuildKid(); k.holder.position.set(wp.x + dx, RS_Y, wp.z + dz); k.holder.rotation.y = dx < 0 ? 0.9 : -0.9;
    scene.add(k.holder); R.items.push(k.holder); applyPose(k, POSE.stand, 1); R.kids.push(k);
  });
}
function xyWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props, hp = m.holder.position;
  for (const n in P_) P_[n].visible = false;
  P_.wand.visible = true;
  if (R.t < 3.2){
    applyPose(m, POSE.xyBlow, k); m.setFace('blow');
    if (Math.floor(R.t*6) !== Math.floor((R.t-dt)*6) && R.t > .4) xyRiseBubbles(R, hp.x + 1.2, hp.y + 7.2, 3);
    once('xw0', .3, ()=>{ SFX.xyBlow(); popAt('吹泡泡囉～！', W, 9, 'big'); });
    once('xw1', 1.6, ()=>SFX.xyBlow());
  } else {
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.peace, k); m.setFace('normal');
    once('xw2', 3.3, ()=>{ SFX2.cheer(); xyRiseBubbles(R, hp.x, hp.y + 6, 14); popAt('泡泡老師最棒！', W, 9.5, 'big'); });
  }
  R.kids.forEach((kd, i)=>{
    const hop = Math.max(0, Math.sin(R.t*9 + i*1.3));
    kd.holder.position.y = RS_Y + hop*0.9;
    applyPose(kd, hop > .3 ? POSE.cheer : POSE.laugh, .3);
  });
  once('xk1', 1.2, ()=>pop('哇～泡泡！', R.kids[0].holder.position.x, RS_Y + 5.5));
  once('xk2', 2.1, ()=>{ SFX.xyKid(); pop('老師好厲害！', R.kids[1].holder.position.x, RS_Y + 5.5); });
  once('xk3', 4.2, ()=>{ SFX.xyKid(); pop('再一次～！', R.kids[2].holder.position.x, RS_Y + 5.5, 'big'); });
  xyStepBubbles(R, dt);
}
function xyLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  R.xyLp = {x:lp.x, z:lp.z};
  Lz.m.holder.rotation.y = -Math.PI/2;                                                           // facing left, behind the chair
  const holder = new THREE.Group(); holder.position.set(lp.x - 3.0, RS_Y, lp.z); holder.rotation.y = -Math.PI/2;
  holder.add(buildWheelchair());
  if (typeof buildTommy === 'function'){
    const body = new THREE.Group(); body.scale.setScalar(SC); holder.add(body);
    const tm = buildTommy(body); for (const n in tm.props) tm.props[n].visible = false;
    tm.setFace('old'); applyPose(tm, POSE.sit, 1); R.tommy = tm;
  }
  scene.add(holder); R.items.push(holder); R.chair = holder;
}
function xyLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, hp = m.holder.position, s0 = R.xyLp;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.0){
    applyPose(m, POSE.dizzy, k); m.setFace('cry');
    once('xl0', .2, ()=>popAt('泡泡都破掉了……', Lz, 7.5, 'blue'));
  } else if (R.t < 3.8){
    const d = Math.min(3.2, (R.t - 1.0)*1.2);
    hp.x = s0.x - d; R.chair.position.x = s0.x - 3.0 - d;
    applyPose(m, POSE.xyPush, k); m.setFace('normal');
    hp.y = RS_Y + Math.abs(Math.sin(R.t*6))*.12;
    once('xl1', 1.2, ()=>{ SFX.soft(); pop('推～推～', hp.x, RS_Y + 7.5); });
    once('xl2', 2.4, ()=>{ if (R.tommy) pop('咳咳……腰好痛……', R.chair.position.x, RS_Y + 6.5, 'blue'); });
  } else {
    m.holder.rotation.y += (0 - m.holder.rotation.y)*Math.min(1, dt*6);                          // turn to camera
    hp.y = RS_Y;
    applyPose(m, POSE.xyWag, k); m.setFace('normal');
    once('xl3', 4.0, ()=>{ SFX.xyKid(); popAt('學長要記得去看醫生喔！', Lz, 8.5, 'big'); });
    once('xl4', 5.0, ()=>{ if (R.tommy) pop('好啦好啦……', R.chair.position.x, RS_Y + 6.5, 'blue'); });
  }
}

// ---------- register ----------
registerChar('wxinyy', {
  stats: { name:'心瑩', en:'Xinying', tag:'泡泡老師・公衛系・幼幼班保母', weight:0.85, run:14, air:11, jumpV:30, djV:26, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.08,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'泡泡拍！', sfx:'xyPop'},
    side:{t:[.24,.12,.32], pose:['batWind','batHit'], box:[2.9,3.6,1.8], dmg:14, kb:12, sc:1.05, ang:36, prop:'wand', text:'泡泡棒！', sfx:'swing', fire:[[.26,'xyWandPop']]},
    up:{t:[.16,.14,.28], pose:['upWind','upHit'], box:[0.4,7.0,2.0], dmg:12, kb:11, sc:1, ang:88, prop:'wand', text:'泡泡噴泉！', sfx:'xyBlow', fire:[[.17,'xyFountain']]},
    down:{t:[.22,.12,.32], pose:['bookUp','bookSlam'], box:[0,0.9,3.3], dmg:11, kb:9, sc:.8, ang:70, prop:'scalpel', text:'青蛙解剖課！', fire:[[.22,'xyFrog']], onHit:'xyGross'},
    nair:{t:[.06,.22,.15], pose:['nair','nair'], box:[0,3,2.3], dmg:7, kb:6, sc:.6, ang:45, air:1, sfx:'xyPop'},
    fair:{t:[.1,.1,.2], pose:['batWind','batHit'], box:[2.4,3.4,1.5], dmg:9, kb:8, sc:.9, ang:40, air:1, prop:'wand', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.4,1.7], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'wand', sfx:'xyPop'},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'scalpel'},
    nB:{t:[.2,.05,.32], pose:['xyBlowWind','xyBlow'], prop:'wand', fire:[[.2,'xyTrapShot']], air:1, text:'泡泡抓住你！', sfx:'xyBlow'},
    sB:{t:[.1,.28,.3], pose:['slide','slide'], box:[1.8,1.6,1.6], dmg:8, kb:7, sc:.5, ang:50, dash:26, air:1, text:'勤洗手！滑～', fire:[[.1,'xyFoam']], onHit:'xySlip', sfx:'xyBlow'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, start:'xyUp', box:[0.2,4.2,2.6], dmg:6, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.15,.05,.4], pose:['xyCall','xyCall'], fire:[[.15,'xyKid']], air:1, text:'弟弟來幫忙！'},
  },
  fire: {
    xyWandPop(f){ burst(f.x + f.face*2.6, f.y+3.6, 0xcfeeff, 8, 7); burst(f.x + f.face*2.6, f.y+3.6, 0xffc8f0, 4, 5); },
    xyFountain(f){ for (let i=0;i<3;i++) burst(f.x, f.y+6 + i*1.2, i%2 ? 0xffc8f0 : 0xcfeeff, 6, 7); },
    xyTrapShot(f){
      proj({owner:f, x:f.x+f.face*1.8, y:f.y+4.4, vx:f.face*10, vy:0, g:0, wave:.6, r:1.2, life:1.9, dmg:4, kb:1, sc:.05, ang:80, onHit:'xyTrapHit', mesh:spriteOf(xyBubTex, 2.4)});
    },
    xyFoam(f){ burst(f.x, f.y+.8, 0xffffff, 12, 7); burst(f.x, f.y+.8, 0xcfeeff, 6, 5); },
    xyFrog(f){                                                                                     // dissection tray with a frog appears at her feet
      const g = new THREE.Group();
      g.add(rbox(3.2,0.18,1.8,.1,L({color:0x9aa3ad})));
      g.add(at(rbox(2.9,0.06,1.5,.1,L({color:0xf3f0e6})),0,0.12,0));
      const frogM = L({color:0x5fae4a});
      g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.5,8,6), frogM),0,0.35,0));
      g.children[2].scale.set(1.2,0.45,0.9);
      g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6), frogM),0.62,0.38,0));
      [-1,1].forEach(s=>{ g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.1,6,4), L({color:0xffffff})),0.75,0.58,s*0.14));
        const leg = rbox(0.7,0.12,0.16,.3,frogM); leg.position.set(-0.6,0.25,s*0.5); leg.rotation.y = s*0.6; g.add(leg); });
      g.position.set(f.x + f.face*1.2, f.y + .1, .6); g.rotation.y = f.face > 0 ? 0 : Math.PI; scene.add(g);
      G.finals.push({owner:f, t:0, mesh:g, update(F){ F.mesh.scale.setScalar(Math.min(1, F.t*8)); return F.t > .8; }});
    },
    xyKid(f){
      const kd = xyBuildKid(); kd.holder.rotation.y = f.face*Math.PI/2;
      SFX.xyKid(); pop('姐姐～我來了！', f.x, f.y+7.5);
      kd.body.position.y = -1.3;
      const p = proj({owner:f, x:f.x+f.face*1.5, y:f.y+1.4, vx:f.face*14, vy:f.onGround ? 6 : 0, g:30, bounce:4, r:1.3, life:1.5, dmg:9, kb:10, sc:.7, ang:40, mesh:kd.holder});
      p.xyKid = kd;
    },
  },
  start: {
    xyUp(f){ f.vy = 32; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; SFX.xyBlow(); pop('泡泡飛高高～', f.x, f.y+7); f.xyUpT = .9; },
  },
  onhit: {
    xyTrapHit(a, v){ xyTrap(a, v, 1.1, 3.2); },
    xyGross(a, v){ v.state = 'stun'; v.stunT = .5; v.move = null; v.vx *= .4; pop('噁～是青蛙！', v.x, v.y+7.5, 'blue'); },
    xySlip(a, v){ v.slowT = 1.2; pop('滑倒了！', v.x, v.y+7.5, 'blue'); },
  },
  poses: {
    xyBlow: P({rSh:[-2.0,0,0.55], rEl:[-1.7], lSh:[-0.2,0,0.25], lEl:[-0.6], head:[-0.12], chest:[-0.05]}),
    xyBlowWind: S_({rSh:[-1.6,0,0.4], rEl:[-2.0], chest:[0.15], head:[0.1]}),
    xyPush: P({rSh:[-1.35,0,0.1], lSh:[-1.35,0,-0.1], rEl:[-0.35], lEl:[-0.35], chest:[0.3], head:[-0.1], rHp:[-0.3], lHp:[0.25], rKn:[0.3], lKn:[0.2], drop:-0.1}),
    xyWag: P({rSh:[-2.3,0,-0.2], rEl:[-0.5], lSh:[0,0,0.35], lEl:[-1.9], head:[0.1,0,0.15], chest:[-0.05], hR:'thumb'}),
    xyCall: S_({rSh:[-2.6,0,-0.4], rEl:[-0.3], lSh:[-0.4,0,0.5], lEl:[-1.6], head:[-0.25], chest:[-0.1]}),
  },
  sfx: {
    xyPop(){ tone(900,.08,'sine',.12,2.2); tone(1500,.06,'sine',.06,1.6,.03); },
    xyBlow(){ noise(.35,.12,3000); [0,.08,.16,.24].forEach((w,i)=>tone(700 + i*220,.07,'sine',.07,2,.1 + w)); },
    xyKid(){ tone(880,.1,'square',.06,1.3); tone(1100,.12,'square',.05,1.2,.1); },
  },
  build: buildWxinyy, face: xyFaces.normal, portraitBg: '#a9dcf5',
  portrait(g){
    g.fillStyle = XY_HAIR; g.fillRect(4,4,56,13); g.fillRect(0,10,10,54); g.fillRect(54,10,10,54);
    for (let i=0;i<6;i++){ g.fillRect(10+i*8,16,4,6 + (i%2)*3); }                                  // wispy bangs
    g.fillStyle = '#cfd3d6'; g.fillRect(14,58,36,6); g.fillStyle = '#4cae5a'; g.fillRect(24,58,2,6); g.fillRect(38,58,2,6);
    g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.arc(54,10,5,0,7); g.strokeStyle='rgba(255,255,255,.9)'; g.lineWidth=1; g.stroke();
    g.beginPath(); g.arc(8,52,3,0,7); g.stroke();
  },
  skins: [
    { name:'黑T高領', apply(c){
        const teeM = L({map:xyTeeTex}), front = L({map:xyTeeFront}), turtle = L({map:xyTurtleTex});
        c.chest.children[0].material = [teeM,teeM,teeM,teeM,front,teeM];
        const sw = c.xyMat.sweater; sw.hem.material = teeM; sw.hem.scale.set(1,0.6,1); sw.col.material = turtle; sw.col.scale.set(0.85,2.2,0.85); sw.col.position.y = 2.38;
        [c.R, c.Lf].forEach(a=>{ const sl = a.sh.children[0]; sl.material = teeM; sl.scale.y = 0.6; sl.position.y = -0.18;
          a.sh.children[1].material = turtle; a.el.children[0].material = turtle; a.el.children.forEach(o=>{ if (o.isMesh && o.material === c.xyMat.knitM) o.material = turtle; }); });
      },
      portrait(g){ g.fillStyle = '#1b1b1e'; g.fillRect(14,58,36,6); g.fillStyle = '#e9e6df'; g.fillRect(26,56,12,4); } },
    { name:'生日帽', hat:['#8fd0f5','#ffffff','#ffc8f0'], apply(c){ const h = birthdayHat('#8fd0f5','#ffffff',0xffc8f0); h.position.set(0.05,0.72,-0.02); c.head.add(h); } },
  ],
  // shield: wrapped in a bubble — it wobbles, thins out and pops if held too long
  shield(){ return xyBubble3D(3.3); },
  shieldAnim(f){
    const sm = f.shieldMesh, tt = performance.now()/1000, hp = Math.max(0, f.shieldHP)/50;
    sm.position.set(f.x, f.y+3.2, .2);
    const wob = (1 - hp)*.12 + .03, s = sm.scale.x;
    sm.scale.set(s*(1 + Math.sin(tt*9)*wob), s*(1 - Math.sin(tt*9)*wob), s);
  },
  shieldPose: 'xyBlow', shieldProp: 'wand', breakText: '泡泡破掉了！', breakColor: 0xcfeeff,
  finalPose: 'xyBlow', finalProp: 'wand',
  animate(f, m, s, t, dt){
    if (s==='shield'){ f.shieldHP -= 6*dt; m.setFace('blow'); }                                  // bubble thins faster than a normal shield
    else if (s==='final') m.setFace('blow');
    else if (s==='move' && f.moveId==='down') m.setFace('gross');
    else if (s==='move' && f.moveId==='nB') m.setFace('blow');
    f.xyUpT = (f.xyUpT || 0) - dt;
    m.bigBub.visible = f.xyUpT > 0 && s!=='dead';
    if (m.bigBub.visible){ const w = 1 + Math.sin(t*10)*.05; m.bigBub.scale.set(w, 2 - w, w); }
    for (const p of G.projs){ if (p.owner===f && p.xyKid) applyPose(p.xyKid, runPose(p.t*16), 1); }
  },
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.xyBlow : POSE.cheer, selectSfx: ()=>SFX.xyPop(),
  winSub: '"小朋友們，吹泡泡囉～"',
  final: xyFinal, winSetup: xyWinSetup, winUpdate: xyWinUpdate, loseSetup: xyLoseSetup, loseUpdate: xyLoseUpdate,
  longWin: true, longLose: true,
});
