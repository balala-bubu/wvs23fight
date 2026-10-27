/* 芭樂 Kiafes — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- textures ---------- */
const KIA_SKIN = '#d6a27c', KIA_SKIN_C = ['#cc9672','#dfae8a','#d29c77'];
const kiaSkinTex = tex(16,16,(g)=>speckle(g,16,16,KIA_SKIN,KIA_SKIN_C,.4));
function kiaFace(g, mode){
  speckle(g,64,64,KIA_SKIN,KIA_SKIN_C,.35); shadeFace(g);
  // thick black mushroom fringe, a little parted in the middle
  g.fillStyle = '#141010'; g.fillRect(0,0,64,16);
  for (let i=0;i<11;i++){ const x = i*6, len = (i===5 ? 4 : 9) + (i%3)*2; g.beginPath(); g.moveTo(x-2,15); g.lineTo(x+7,15); g.lineTo(x+2+(i%2), 15+len); g.closePath(); g.fill(); }
  g.fillRect(0,0,5,40); g.fillRect(59,0,5,40);
  g.fillStyle = 'rgba(80,60,50,.5)'; [10,23,37,50].forEach(x=>g.fillRect(x,3,1,10));
  // eyes (narrow, calm)
  g.strokeStyle = '#1d1310'; g.lineWidth = 2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(15,37); g.lineTo(25,35); g.stroke(); g.beginPath(); g.moveTo(39,35); g.lineTo(49,37); g.stroke();
    g.fillStyle = 'rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14);
  } else if (mode==='chew'){
    g.beginPath(); g.arc(20,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  } else if (mode==='smug'){
    g.beginPath(); g.moveTo(15,37); g.lineTo(25,37); g.stroke(); g.beginPath(); g.moveTo(39,37); g.lineTo(49,37); g.stroke();
    g.fillStyle = '#1d1310'; g.fillRect(21,37,3,2); g.fillRect(45,37,3,2);
  } else {
    g.fillStyle = '#1d1310'; g.beginPath(); g.ellipse(20,37,3.6,1.9,0,0,7); g.fill(); g.beginPath(); g.ellipse(44,37,3.6,1.9,0,0,7); g.fill();
    g.beginPath(); g.moveTo(15,36); g.quadraticCurveTo(20,33.5,25,36); g.stroke(); g.beginPath(); g.moveTo(39,36); g.quadraticCurveTo(44,33.5,49,36); g.stroke();
    g.fillStyle = '#fff'; g.fillRect(21,36,1,1); g.fillRect(45,36,1,1);
  }
  // nose
  g.fillStyle = 'rgba(130,75,50,.4)'; g.fillRect(29,40,6,5); g.fillStyle = 'rgba(85,42,28,.7)'; g.fillRect(28,44,2,1); g.fillRect(34,44,2,1);
  // mouth
  if (mode==='cry'){ g.fillStyle = '#4a1715'; g.beginPath(); g.moveTo(24,53); g.quadraticCurveTo(32,47,40,53); g.quadraticCurveTo(32,50,24,53); g.closePath(); g.fill(); }
  else if (mode==='chew'){ g.fillStyle = '#4a1715'; g.fillRect(27,49,10,4); g.fillStyle = '#f08aa0'; g.fillRect(35,50,4,2); g.fillStyle = 'rgba(215,105,85,.3)'; g.fillRect(8,42,9,5); g.fillRect(47,42,9,5); }
  else if (mode==='smug'){ g.strokeStyle = '#7a3a2c'; g.lineWidth = 2; g.beginPath(); g.moveTo(25,49); g.quadraticCurveTo(33,52,40,47); g.stroke(); }
  else { g.strokeStyle = '#8a4434'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(25,49); g.quadraticCurveTo(32,52,39,49); g.stroke(); }
}
const kiaFaces = {};
['normal','cry','chew','smug'].forEach(k=>kiaFaces[k] = tex(64,64,(g)=>kiaFace(g,k)));
const kiaHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#141010',['#221a18','#0a0808'],.5);
  g.fillStyle = '#3a3230'; for (let i=0;i<30;i++){ const x=(rnd()*32)|0, y=(rnd()*32)|0, l=3+((rnd()*5)|0); for (let k=0;k<l;k++) g.fillRect(x%32,(y+k)%32,1,1); }
});
// beige knit polo
function kiaKnit(g, w, h, base){ speckle(g,w,h,base,['#d9d1c2','#e9e3d6'],.35); g.fillStyle = 'rgba(150,135,110,.18)'; for (let y=0;y<h;y+=2) g.fillRect(0,y,w,1); }
const kiaPoloTex = tex(32,32,(g)=>kiaKnit(g,32,32,'#e2dbcd'));
const kiaPoloFront = tex(32,46,(g)=>{
  kiaKnit(g,32,46,'#e2dbcd');
  g.fillStyle = '#d4ccbc'; g.fillRect(14,0,4,15); g.fillStyle = 'rgba(120,105,85,.45)'; g.fillRect(14,0,1,15); g.fillRect(17,0,1,15);
  g.fillStyle = '#f2eee6'; g.fillRect(15,4,2,2); g.fillRect(15,10,2,2);
  g.fillStyle = 'rgba(150,135,110,.3)'; g.fillRect(0,42,32,4);
});
const kiaPoloSleeve = tex(16,16,(g)=>{ kiaKnit(g,16,16,'#e2dbcd'); g.fillStyle = 'rgba(150,135,110,.35)'; g.fillRect(0,12,16,4); });
// white shirt (costume)
const kiaWhiteTex = tex(32,32,(g)=>{ speckle(g,32,32,'#f4f3ef',['#ebe9e3','#fbfaf7'],.3); g.fillStyle = 'rgba(160,160,170,.12)'; for (let x=3;x<32;x+=7) g.fillRect(x,0,1,32); });
const kiaWhiteFront = tex(32,46,(g)=>{
  speckle(g,32,46,'#f4f3ef',['#ebe9e3','#fbfaf7'],.3);
  g.fillStyle = 'rgba(150,150,160,.35)'; g.fillRect(16,0,1,46); g.fillStyle = '#dcdcd6'; for (let y=5;y<46;y+=8) g.fillRect(15,y,3,2);
  g.strokeStyle = 'rgba(150,150,160,.45)'; g.lineWidth = 1; g.strokeRect(20.5,10.5,7,7);
});
const kiaPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#1d1d21',['#26262b','#15151a'],.5); g.fillStyle = 'rgba(255,255,255,.035)'; for (let x=0;x<32;x+=4) g.fillRect(x,0,1,32); });
const kiaGuavaTex = tex(16,16,(g)=>{ speckle(g,16,16,'#9ac553',['#86b244','#b0d66a','#c4dc74'],.5); g.fillStyle = '#d8e48a'; [[3,4],[9,2],[12,9],[5,11],[8,7]].forEach(([x,y])=>g.fillRect(x,y,1,1)); });
const kiaSlideTex = tex(64,40,(g)=>{
  g.fillStyle = '#fbfaf6'; g.fillRect(0,0,64,40); g.fillStyle = '#e8743c'; g.fillRect(0,0,64,9);
  g.fillStyle = '#fff'; g.font = '900 7px sans-serif'; g.fillText('芭樂冷知識', 3, 7);
  g.fillStyle = '#333'; g.font = '700 6px sans-serif'; g.fillText('・你很「芭」道', 4, 18); g.fillText('・「芭」不得你輸', 4, 26); g.fillText('・下課「芭」！', 4, 34);
  g.fillStyle = '#7fbf4a'; g.beginPath(); g.arc(55,28,6,0,7); g.fill();
});
const kiaBoardTex = tex(64,48,(g)=>{
  g.fillStyle = '#f7f8f6'; g.fillRect(0,0,64,48); g.strokeStyle = '#9aa0a6'; g.lineWidth = 3; g.strokeRect(1.5,1.5,61,45);
  g.strokeStyle = '#2a6fd6'; g.lineWidth = 2; g.beginPath(); g.arc(22,24,10,0,7); g.stroke();
  g.fillStyle = '#7fbf4a'; g.beginPath(); g.arc(22,24,8,0,7); g.fill(); g.fillStyle = '#4a8a2a'; g.fillRect(21,13,2,4);
  g.fillStyle = '#d63a3a'; g.font = '900 9px sans-serif'; g.fillText('擋！', 38, 22); g.fillStyle = '#2a6fd6'; g.font = '700 7px sans-serif'; g.fillText('不准過', 37, 34);
});

/* ---------- meshes ---------- */
const kiaGuavaM = L({map:kiaGuavaTex}), kiaPinkM = L({color:0xf2849a}), kiaLeafM = L({color:0x3f8a34}), kiaStemM = L({color:0x5a3e24});
function kiaGuava(s){
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8), kiaGuavaM); b.scale.set(1,0.92,1); g.add(b);
  g.add(at(cyl(0.03,0.04,0.16,kiaStemM,5),0,0.52,0));
  const leaf = rbox(0.34,0.05,0.16,.4,kiaLeafM); leaf.position.set(0.15,0.56,0); leaf.rotation.z = 0.4; g.add(leaf);
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.09,6,4), L({color:0x6a7a3a})),0,-0.47,0));
  g.scale.setScalar(s || 1); return g;
}
function kiaBrush(){
  const g = new THREE.Group();
  g.add(at(cyl(0.06,0.08,2.0,L({color:0xd9a441}),6),0,-1.0,0));
  g.add(at(cyl(0.11,0.09,0.32,L({color:0xbfc4c8}),8),0,-2.1,0));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15,0.55,8), L({color:0xe8743c})); tip.rotation.x = Math.PI; tip.position.y = -2.5; g.add(tip);
  return g;
}
function kiaPointer(){
  const g = new THREE.Group();
  g.add(at(cyl(0.035,0.05,2.8,L({color:0x6a4a2a}),6),0,-1.4,0));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.08,6,4), L({color:0xd63a3a})),0,-2.82,0));
  return g;
}
function kiaHandBoard(){
  const g = new THREE.Group(), face = L({map:kiaBoardTex}), frame = L({color:0x9aa0a6});
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,1.5,2.0), [frame,frame,frame,frame,face,face]),0,-0.95,0.3));
  return g;
}
// a little kid in a yellow kindergarten hat
const kiaKidSkin = L({color:0xe8b893}), kiaKidHat = L({color:0xf5c518}), kiaKidPants = L({color:0x2f4a7a});
const kiaKidFace = tex(16,16,(g)=>{ g.fillStyle = '#e8b893'; g.fillRect(0,0,16,16); g.fillStyle = '#1d1310'; g.fillRect(4,7,2,2); g.fillRect(10,7,2,2); g.fillStyle = '#c0504a'; g.fillRect(6,11,4,2); g.fillStyle = 'rgba(240,120,120,.4)'; g.fillRect(2,10,2,2); g.fillRect(12,10,2,2); });
const kiaKidShirts = [0xff6b6b,0x5fc0ef,0x6fe08a,0xb08cff,0xffa64a,0xff7ac2,0x4ad0c0].map(c=>L({color:c}));
function kiaKid(i){
  const g = new THREE.Group();
  [-1,1].forEach(s=>g.add(at(rbox(0.26,0.55,0.28,.4,kiaKidPants),s*0.17,0.3,0)));
  g.add(at(rbox(0.7,0.72,0.46,.4,kiaKidShirts[i % kiaKidShirts.length]),0,0.9,0));
  [-1,1].forEach(s=>{ const a = rbox(0.18,0.55,0.2,.4,kiaKidSkin); a.position.set(s*0.46,1.05,0); a.rotation.z = s*2.4; g.add(a); });
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.62,0.6,0.56), [kiaKidSkin,kiaKidSkin,kiaKidSkin,kiaKidSkin,L({map:kiaKidFace}),kiaKidSkin]),0,1.58,0));
  g.add(at(cyl(0.38,0.4,0.22,kiaKidHat,10),0,1.95,0));
  g.add(at(cyl(0.5,0.5,0.04,kiaKidHat,12),0,1.86,0.06));
  return g;
}

/* ---------- model ---------- */
function buildKiafes(parent){
  const hairM = L({map:kiaHairTex}), faceM = L({map:kiaFaces.normal}), skinM = L({map:kiaSkinTex});
  const shirtM = L({map:kiaPoloTex}), frontM = L({map:kiaPoloFront}), sleeveM = L({map:kiaPoloSleeve});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.16,
    torsoMat:[shirtM,shirtM,shirtM,shirtM,frontM,shirtM], sleeveMat:()=>[sleeveM,sleeveM,shirtM,shirtM,sleeveM,sleeveM], sleeve:[0.66,0.78],
    pantsM:L({map:kiaPantsTex}), shoeM, soleM:greySole,
    collar(chest){
      [-1,1].forEach(s=>{ const fl = rbox(0.44,0.12,0.36,.3,shirtM); fl.position.set(s*0.22,2.25,0.3); fl.rotation.set(0.5,0,s*-0.35); chest.add(fl); });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.32,0.07,4,12), shirtM); band.rotation.x = Math.PI/2; chest.add(at(band,0,2.24,-0.02));
    },
    hair(head){
      head.add(at(rbox(1.18,0.62,1.18,.7,hairM),0,0.47,-0.02));                         // round mushroom top
      head.add(at(rbox(1.14,1.0,0.56,.6,hairM),0,0.04,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.14,0.62,0.7,.45,hairM),s*0.55,0.14,0.0)));      // sides over the ears
      [[-0.38,0.24,-0.1],[-0.16,0.2,0.06],[0.06,0.23,-0.04],[0.28,0.19,0.1],[0.44,0.24,0.14]].forEach(([x,y,r])=>{
        const f = rbox(0.24,0.36,0.14,.5,hairM); f.position.set(x,y,0.48); f.rotation.z = r; head.add(f);
      });
    },
    face(head){
      const metalM = L({color:0xc9a86a}), lensM = new THREE.MeshBasicMaterial({color:0xf0e8e0,transparent:true,opacity:.14});
      const gl = new THREE.Group(); gl.position.set(0,-0.04,0.56); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18,0.014,4,8), metalM); rim.position.x = s*0.21; rim.rotation.z = Math.PI/8; gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.17,8), lensM); lens.position.set(s*0.21,0,-0.01); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.6), metalM); arm.position.set(s*0.42,0.05,-0.3); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.02,0.02), metalM),0,0.06,0));
    },
  }, parent);
  const guava = kiaGuava(0.75); guava.position.set(0,-0.42,0.18); c.R.hd.add(guava);
  const brush = kiaBrush(); c.R.hd.add(brush);
  const pointer = kiaPointer(); c.R.hd.add(pointer);
  const board = kiaHandBoard(); c.R.hd.add(board);
  c.props = {guava, brush, pointer, board};
  c.kiaShirt = {shirtM, frontM, sleeveM};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = kiaFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = kiaFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- ultimate: "請你吃芭樂！" — a giant guava that bursts into a crowd of kids ---------- */
const KIA_KID_LINES = ['老師好！','哇～！','我要吃芭樂！','下課了！','衝啊！','老師看我！','耶～！'];
function kiaFinal(f, opp){
  const tgt = nearestFoe(f) || opp;
  f.finalT = 1.0; banner('請你吃芭樂！'); SFX.swing(); pop('請你吃芭樂～！', f.x, f.y+7.5, 'big');
  f.face = Math.sign(tgt.x - f.x) || f.face;
  const mesh = kiaGuava(3.2); scene.add(mesh);
  const x0 = f.x + f.face*1.6, y0 = f.y + 5.5, T = .9, gr = 40;
  const tx = tgt.state!=='dead' ? tgt.x : f.x + f.face*10, ty = (tgt.state!=='dead' ? Math.max(0, tgt.y) : 0) + 2.2;
  G.finals.push({owner:f, target:tgt, t:0, mesh, x:x0, y:y0, vx:(tx - x0)/T, vy:(ty - y0 + .5*gr*T*T)/T, gr, T, boom:false, kids:[], hit:new Set(), update(F, dt, t){
    if (!F.boom){
      F.vy -= F.gr*dt; F.x += F.vx*dt; F.y += F.vy*dt;
      F.mesh.position.set(F.x, F.y, 0); F.mesh.rotation.z -= dt*8*Math.sign(F.vx || 1);
      let touch = F.t >= F.T || F.y < -12;
      for (const v of G.fighters){ if (v!==F.owner && v.hittable() && segDist(F.x, F.y, v) < 2.2){ touch = true; break; } }
      if (touch) kiaBoom(F);
      return F.y < -30;
    }
    let alive = 0;
    for (const K of F.kids){
      if (K.done) continue; alive++;
      K.t += dt;
      if (!K.landed){
        K.vy -= 45*dt; K.x += K.vx*dt; K.y += K.vy*dt; K.m.rotation.z += K.spin*dt;
        // kids bonk anyone they fly into
        for (const v of G.fighters){
          if (v===F.owner || K.hit.has(v) || !v.hittable()) continue;
          if (segDist(K.x, K.y + 1, v) < 1.5){ K.hit.add(v); applyHit(F.owner, v, {dmg:4, kb:6, sc:.3, ang:50}, Math.sign(K.vx) || 1, K.x, K.y + 1); }
        }
        const onMain = K.x > MAIN.x1 && K.x < MAIN.x2 && K.y <= 0 && K.y > -2 && K.vy < 0;
        if (onMain){
          K.landed = true; K.y = 0; K.m.rotation.z = 0; K.landT = K.t;
          // splash damage around every landing kid
          burst(K.x, .6, 0xfff3a0, 8, 7); burst(K.x, .6, 0xf2849a, 5, 5); SFX.soft();
          for (const v of G.fighters){
            if (v===F.owner || !v.hittable()) continue;
            if (Math.abs(v.x - K.x) < 3.4 && v.y < 4){ applyHit(F.owner, v, {dmg:6, kb:11, sc:.55, ang:58}, Math.sign(v.x - K.x) || 1, v.x, v.y + 2); }
          }
          pop(K.line, K.x, 3.4);
        }
        if (K.t > 3 || K.y < -25) K.done = true;
      } else {
        K.m.position.y = Math.abs(Math.sin((K.t - K.landT)*14))*.5;
        K.m.rotation.y = Math.sin((K.t - K.landT)*10)*.6;
        if (K.t - K.landT > .9){ K.m.scale.setScalar(Math.max(.01, 1 - (K.t - K.landT - .9)*4)); if (K.t - K.landT > 1.15) K.done = true; }
      }
      if (!K.landed) K.m.position.set(K.x, K.y, 0.6); else K.m.position.x = K.x;
      K.m.visible = !K.done;
    }
    return alive === 0 || F.t > 6;
  }, dispose(F){ scene.remove(F.mesh); F.kids.forEach(K=>scene.remove(K.m)); }});
}
function kiaBoom(F){
  F.boom = true; F.mesh.visible = false;
  const ex = F.x, ey = Math.max(F.y, 1);
  SFX.boom(); SFX.crash(); G.shake = reduce ? .2 : 1.3; G.flash = .35; G.freeze = .12;
  burst(ex, ey, 0x9ac553, 22, 14); burst(ex, ey, 0xf2849a, 18, 12); burst(ex, ey, 0xffffff, 10, 10);
  pop('芭樂爆開了！', ex, ey + 5, 'big');
  for (const v of G.fighters){
    if (v===F.owner || F.hit.has(v) || !v.hittable()) continue;
    if (segDist(ex, ey, v) < 5.5){ F.hit.add(v); applyHit(F.owner, v, {dmg:14, kb:22, sc:1.0, ang:62}, Math.sign(v.x - ex) || F.owner.face, v.x, v.y + 3); }
  }
  for (let i=0;i<7;i++){
    const m = kiaKid(i); m.scale.setScalar(1.15); scene.add(m);
    const a = (i/6 - .5)*1.9;
    F.kids.push({m, x:ex, y:ey, vx:Math.sin(a)*15 + (Math.random()-.5)*3, vy:13 + Math.cos(a)*6 + Math.random()*3, spin:(Math.random()-.5)*14, t:0, landed:false, done:false, hit:new Set(), line:KIA_KID_LINES[i]});
  }
}

/* ---------- results ---------- */
const kiaPicTex = tex(64,64,(g)=>{
  g.fillStyle = '#fbfaf4'; g.fillRect(0,0,64,64);
  g.fillStyle = '#9ac553'; g.beginPath(); g.ellipse(30,36,18,16,0,0,7); g.fill();
  g.fillStyle = '#c4dc74'; g.beginPath(); g.ellipse(24,30,6,5,0,0,7); g.fill();
  g.fillStyle = '#f2849a'; g.beginPath(); g.ellipse(44,40,9,8,0,0,7); g.fill(); g.fillStyle = '#fbd0d8'; g.beginPath(); g.ellipse(44,40,5,4,0,0,7); g.fill();
  g.fillStyle = '#5a3e24'; g.fillRect(29,17,3,5); g.fillStyle = '#3f8a34'; g.beginPath(); g.ellipse(36,18,6,3,.4,0,7); g.fill();
  g.fillStyle = '#1d1310'; g.fillRect(24,36,2,2); g.fillRect(32,36,2,2); g.fillRect(27,41,4,1);
});
const kiaScreenTex = tex(128,72,(g)=>{
  g.fillStyle = '#fbfaf6'; g.fillRect(0,0,128,72); g.fillStyle = '#e8743c'; g.fillRect(0,0,128,16);
  g.fillStyle = '#fff'; g.font = '900 11px sans-serif'; g.fillText('本日重點', 6, 12);
  g.fillStyle = '#333'; g.font = '700 9px sans-serif'; g.fillText('1. 芭樂很好吃', 8, 30); g.fillText('2. 我贏了', 8, 44); g.fillText('3. 下課「芭」！', 8, 58);
  g.fillStyle = '#9ac553'; g.beginPath(); g.arc(106,46,13,0,7); g.fill(); g.fillStyle = '#f2849a'; g.beginPath(); g.arc(110,50,6,0,7); g.fill();
});
const kiaErrTex = tex(128,72,(g)=>{
  g.fillStyle = '#2a5cc8'; g.fillRect(0,0,128,72); g.fillStyle = '#fff'; g.font = '900 22px sans-serif'; g.fillText(':(', 8, 26);
  g.font = '700 10px sans-serif'; g.fillText('簡報沒有回應', 8, 44); g.font = '700 8px sans-serif'; g.fillText('最後存檔：三小時前', 8, 60);
});
function kiaWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  const easel = new THREE.Group(); easel.position.set(wp.x + 4.2, RS_Y, 1.2); easel.rotation.y = -0.5; scene.add(easel); R.items.push(easel);
  const wood = L({color:0x9a6a3c});
  [[-0.9,0.2],[0.9,0.2],[0,-0.7]].forEach(([x,z])=>{ const l = cyl(0.06,0.06,5.2,wood,5); l.position.set(x*0.8,2.5,z); l.rotation.set(z*0.25,0,-x*0.12); easel.add(l); });
  easel.add(at(rbox(3.2,0.15,0.35,.2,wood),0,1.95,0.35));
  easel.add(at(rbox(3.0,3.0,0.1,.1,L({color:0xf4efe2})),0,3.6,0.3));
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(2.7,2.7), new THREE.MeshBasicMaterial({map:kiaPicTex, fog:false})); pic.position.set(0,3.6,0.37); pic.scale.set(.001,1,1); easel.add(pic); R.pic = pic;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(12,6.75), new THREE.MeshBasicMaterial({map:kiaScreenTex, fog:false})); scr.position.set(wp.x + 1.5, RS_Y + 9.5, -12); scr.scale.setScalar(.001); scene.add(scr); R.items.push(scr); R.scr = scr;
  // kids playing around the teacher
  R.kKids = [[-3.2,1.5],[-1.6,3.4],[2.2,3.6],[5.6,3.0]].map(([dx,dz],i)=>{ const m = kiaKid(i+1); m.scale.setScalar(1.25); m.position.set(wp.x + dx, RS_Y, dz); m.rotation.y = dx < 0 ? 0.6 : -0.6; scene.add(m); R.items.push(m); return {m, x:wp.x + dx, z:dz, ph:i*1.3}; });
}
function kiaWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props;
  for (const n in P_) P_[n].visible = false;
  if (R.t < 2.4){
    m.holder.rotation.y = 0.9;
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.kiaPaint : POSE.kiaPaint2, k); P_.brush.visible = true; m.setFace('smug');
    R.pic.scale.x = Math.max(.001, Math.min(1, R.t/2.2)); R.pic.position.x = -1.35*(1 - R.pic.scale.x);
    if (Math.random() < dt*10){ const p = m.holder.position; burst(p.x + 3.2, p.y + 3.4, [0xe8743c,0x9ac553,0x5fc0ef,0xf2849a][(Math.random()*4)|0], 1, 3); }
    once('kw0', .3, ()=>popAt('今天來畫芭樂～', W, 8.5));
    once('kw1', 2.2, ()=>{ SFX.rimshot(); popAt('畫得很「芭」氣吧！', W, 9, 'big'); });
  } else if (R.t < 4.0){
    m.holder.rotation.y = 0.25;
    applyPose(m, POSE.kiaPresent, k); P_.pointer.visible = true; m.setFace('normal');
    once('kw2', 2.6, ()=>{ SFX2.fanfare(); popAt('來看今天的重點！', W, 9, 'big'); });
  } else {
    m.holder.rotation.y = 0.25;
    const bite = Math.sin(R.t*12) > 0;
    applyPose(m, bite ? POSE.kiaMunch : STANCE, k); P_.guava.visible = true; m.setFace(bite ? 'chew' : 'normal');
    once('kw3', 4.1, ()=>{ SFX.crunch(); popAt('咔滋！', W, 8); });
    once('kw4', 4.7, ()=>{ SFX.rimshot(); popAt('這場我「芭」握十足！', W, 9.5, 'big'); });
  }
  if (R.t > 2.6){ const u = Math.min(1, (R.t - 2.6)/.35); R.scr.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.2))); }
  // kids: hop, run little circles, cheer
  R.kKids.forEach((K,i)=>{
    const tt = R.t*2.2 + K.ph;
    if (i%2===0){ K.m.position.x = K.x + Math.sin(tt)*1.2; K.m.position.z = K.z + Math.cos(tt)*.8; K.m.rotation.y = -tt + Math.PI/2; K.m.position.y = RS_Y + Math.abs(Math.sin(tt*4))*.25; }
    else { K.m.position.y = RS_Y + Math.abs(Math.sin(R.t*7 + K.ph))*1.1; K.m.rotation.z = Math.sin(R.t*7 + K.ph)*.15; }
  });
  once('kk0', 1.0, ()=>pop('老師畫得好像！', R.kKids[1].m.position.x, RS_Y + 3.6));
  once('kk1', 3.0, ()=>pop('我也要吃芭樂！', R.kKids[2].m.position.x, RS_Y + 3.6));
  once('kk2', 5.0, ()=>{ SFX2.cheer(); pop('老師最棒～！', R.kKids[3].m.position.x, RS_Y + 3.6, 'big'); });
}
function kiaLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(9,5.1), new THREE.MeshBasicMaterial({map:kiaErrTex, fog:false})); scr.position.set(lp.x - 1, RS_Y + 9, lp.z - 8); scr.scale.setScalar(.001); scene.add(scr); R.items.push(scr); R.kScr = scr;
  const gv = kiaGuava(1.2); gv.visible = false; scene.add(gv); R.items.push(gv); R.kGv = gv;
  R.kL0 = {x:lp.x, z:lp.z};
  // kids waiting off to the side; they run in and use him as a trampoline
  R.kMob = [0,1,2,3].map(i=>{ const m = kiaKid(i+3); m.scale.setScalar(1.2); m.position.set(lp.x + 9 + i*1.6, RS_Y, lp.z + 1 + (i%2)); m.visible = false; scene.add(m); R.items.push(m); return {m, sx:lp.x + 9 + i*1.6, ph:i*.37, n:0}; });
}
function kiaLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, hp = m.holder.position, s0 = R.kL0;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.0){ applyPose(m, POSE.ponder, k); once('kl0', .2, ()=>popAt('我的簡報……', Lz, 7.5, 'blue')); }
  else if (R.t < 2.4){
    applyPose(m, POSE.sob, k); m.setFace('cry');
    once('kl1', 1.0, ()=>{ SFX.crash(); popAt('沒存檔！？', Lz, 8, 'red'); });
    const u = Math.min(1, (R.t - 1.0)/.3); R.kScr.scale.setScalar(Math.max(.001, u));
  } else if (R.t < 3.2){
    // a guava drops on his head
    const head = RS_Y + 6.6, u = Math.min(1, (R.t - 2.4)/.4);
    R.kGv.visible = true; R.kGv.rotation.z += dt*6;
    R.kGv.position.set(s0.x + (u < 1 ? 0 : (R.t - 2.8)*4), u < 1 ? head + 9*(1 - u*u) : head + Math.max(-6, -(R.t - 2.8)*14), s0.z + .3);
    if (u >= 1) once('kl2', 2.8, ()=>{ SFX.spike(); spark(s0.x, head, 2); popAt('咚！', Lz, 8.5, 'big'); });
    applyPose(m, u < 1 ? POSE.sob : POSE.dizzy, k); m.setFace('cry');
  } else {
    // falls flat on his back
    R.kGv.visible = false;
    const u = Math.min(1, (R.t - 3.2)/.4);
    m.holder.rotation.z = -1.5*u*u; hp.y = RS_Y + .5*u; hp.x = s0.x;
    applyPose(m, POSE.helpless, k); m.setFace('cry');
    once('kl3', 3.5, ()=>{ SFX.soft(); G.shake = reduce ? .1 : .3; });
  }
  // kids run in and bounce on him
  if (R.t > 3.5){
    R.kMob.forEach((K,i)=>{
      K.m.visible = true;
      const tx = s0.x + 1.3 + i*1.2, run = Math.min(1, (R.t - 3.5 - K.ph*.4)/.6);
      if (run <= 0) return;
      if (run < 1){ K.m.position.x = K.sx + (tx - K.sx)*run; K.m.position.y = RS_Y + Math.abs(Math.sin(R.t*16))*.3; K.m.position.z = s0.z + .2; K.m.rotation.y = -Math.PI/2; return; }
      const ph = (R.t - 4.1 - K.ph*.4)*2.6 + K.ph, u = ph % 1;
      K.m.position.set(tx, RS_Y + 1.1 + Math.sin(u*Math.PI)*2.6, s0.z + .2); K.m.rotation.y = Math.sin(R.t*3 + i)*.5;
      const nn = Math.floor(ph);
      if (nn !== K.n){ K.n = nn; SFX.soft(); if (i===0) m.chest.scale.y = .85; if (Math.random() < .35) pop(['跳跳床！','好軟喔～','老師起床！','再一次！'][(i+nn)%4], tx, RS_Y + 5); }
    });
    m.chest.scale.y += (1 - m.chest.scale.y)*.2;
    once('kl4', 4.6, ()=>pop('哎唷…別跳了…', s0.x - 2, RS_Y + 3, 'blue'));
    once('kl5', 5.3, ()=>{ SFX.rimshot(); pop('今天真的太「芭樂」了……', s0.x - 2, RS_Y + 4.5, 'blue'); });
  }
}

registerChar('kiafes', {
  stats: { name:'芭樂', en:'Kiafes', tag:'芭樂愛好者・美術老師・諧音梗王', weight:1.0, run:14, air:11, jumpV:30, djV:26, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'這拳很「芭」氣！'},
    side:{t:[.25,.1,.32], pose:['batWind','batHit'], box:[2.9,3.4,1.7], dmg:15, kb:12, sc:1.1, ang:36, prop:'brush', text:'畫龍點睛！', sfx:'swing', onHit:'kiaPaint'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,7.0,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'pointer', text:'舉手發問！', sfx:'swing'},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:12, kb:9, sc:.85, ang:70, prop:'board', text:'下課！', sfx:'spike'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['batWind','batHit'], box:[2.6,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'brush', sfx:'swing', onHit:'kiaPaint'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.8,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'pointer'},
    dair:{t:[.18,.1,.25], pose:['bookUp','bookSlam'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'board', sfx:'spike'},
    nB:{t:[.18,.05,.28], pose:['throwWind','throwHit'], prop0:'guava', fire:[[.18,'kiaGuava']], air:1, sfx:'swing'},
    sB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], fire:[[.2,'kiaSlide']], air:1, text:'看簡報！'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, prop:'brush', start:'kiaRainbow', box:[0.4,5.2,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.15,.2,.32], pose:['kiaPresent','kiaPresent'], prop:'pointer', box:[0,3.8,4.0], dmg:7, kb:9, sc:.5, ang:62, onHit:'kiaRoll', air:1, text:'點名！', sfx:'whistle'},
  },
  fire: {
    kiaGuava(f){ proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.4, vx:f.face*21, vy:7, g:22, r:.9, life:1.4, bounce:1, dmg:7, kb:7, sc:.55, ang:42, mesh:kiaGuava(1.3), spin:1}); pop('芭樂一顆！', f.x, f.y+7); },
    kiaSlide(f){
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.0), new THREE.MeshBasicMaterial({map:kiaSlideTex, side:THREE.DoubleSide, fog:false}));
      proj({owner:f, x:f.x+f.face*2, y:f.y+4.2, vx:f.face*26, vy:0, g:0, wave:.25, r:1.2, life:.85, dmg:8, kb:7, sc:.5, ang:35, onHit:'kiaCold', mesh:m});
      SFX.swing();
    },
  },
  start: {
    kiaRainbow(f){
      f.vy = 33; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; pop('畫一道彩虹！', f.x, f.y+7);
      [0xff6b6b,0xffa64a,0xffd93d,0x6fe08a,0x5fc0ef,0xb08cff].forEach((c,i)=>burst(f.x - f.face*i*.4, f.y + 1 + i*.3, c, 4, 6));
      SFX.chord();
    },
  },
  onhit: {
    kiaPaint(a, v){ [0xe8743c,0x5fc0ef,0x9ac553].forEach(c=>burst(v.x, v.y+3.5, c, 4, 6)); },
    kiaCold(a, v){
      v.state = 'stun'; v.stunT = .6; v.move = null; v.vx *= .3;
      const P = ['你很「芭」道喔！','「芭」不得你輸～','芭比Q了！','這梗有點冷……'];
      pop(P[(Math.random()*P.length)|0], v.x, v.y+8, 'blue'); burst(v.x, v.y+4, 0xbfe6ff, 10, 6); SFX.rimshot();
    },
    kiaRoll(a, v){ pop('到！', v.x, v.y+7.5); },
  },
  poses: {
    kiaPaint: S_({rSh:[-1.6,0,-0.1], rEl:[-0.4], lSh:[-0.7,0,0.35], lEl:[-1.6], chest:[0.1,0.2,0], head:[0.1,0.2,0]}),
    kiaPaint2: S_({rSh:[-1.2,0,-0.3], rEl:[-0.9], lSh:[-0.7,0,0.35], lEl:[-1.6], chest:[0.1,0.2,0], head:[0.1,0.2,0]}),
    kiaPresent: P({rSh:[-2.0,0,-0.55], rEl:[-0.1], lSh:[-0.3,0,0.2], lEl:[-1.5], chest:[-0.05,0.25,0], head:[-0.15,0.3,0]}),
    kiaMunch: S_({rSh:[-1.35,0,0.55], rEl:[-2.25], lSh:[-1.0,0,-0.25], lEl:[-1.7], head:[0.12], chest:[0.15], drop:-0.15}),
    kiaHold: S_({rSh:[-1.5,0,-0.12], lSh:[-1.5,0,0.12], rEl:[-0.45], lEl:[-0.45], chest:[0.1], head:[0.05]}),
  },
  sfx: {
    rimshot(){ tone(160,.08,'square',.12,.7); tone(130,.08,'square',.12,.7,.12); noise(.35,.14,6500,.26); },
    crunch(){ noise(.06,.3,2400); noise(.05,.22,1800,.08); tone(300,.04,'square',.06,.6,.03); },
  },
  build: buildKiafes, face: kiaFaces.normal, portraitBg: '#9ccc6a',
  portrait(g){
    g.fillRect(3,3,58,17); g.fillRect(2,10,7,30); g.fillRect(55,10,7,30);
    for (let i=0;i<8;i++) g.fillRect(8+i*6,18,6,6+(i%3)*2);
    g.strokeStyle = '#c9a86a'; g.lineWidth = 1.5; g.beginPath(); g.arc(22,42,6,0,7); g.stroke(); g.beginPath(); g.arc(42,42,6,0,7); g.stroke();
    g.beginPath(); g.moveTo(28,41); g.lineTo(36,41); g.stroke();
    g.fillStyle = '#e2dbcd'; g.fillRect(16,60,32,4);
  },
  skins: [
    { name:'白襯衫背包', apply(c){
      const S = c.kiaShirt; S.shirtM.map = kiaWhiteTex; S.frontM.map = kiaWhiteFront; S.sleeveM.map = kiaWhiteTex; [S.shirtM,S.frontM,S.sleeveM].forEach(m=>m.needsUpdate = true);
      const strapM = L({color:0x1a1a1e});
      const strap = rbox(0.16,2.6,0.08,.3,strapM); strap.position.set(0.05,1.1,0.5); strap.rotation.z = 0.62; c.chest.add(strap);
      const back = rbox(0.16,2.6,0.08,.3,strapM); back.position.set(0.05,1.1,-0.5); back.rotation.z = -0.62; c.chest.add(back);
      const bag = rbox(0.6,1.25,1.3,.5,strapM); bag.position.set(-0.95,0.1,-0.1); c.chest.add(bag);
    },
      portrait(g){                                                                  // 白襯衫 + 黑色背帶
        g.fillStyle = '#f2f1ea'; g.fillRect(0,54,64,10);
        g.fillStyle = '#d9d7cc'; g.fillRect(0,54,64,1);
        g.fillStyle = '#1a1a1e'; g.save(); g.translate(22,54); g.rotate(.42); g.fillRect(0,0,5,14); g.restore();
        g.save(); g.translate(44,54); g.rotate(-.42); g.fillRect(-5,0,5,14); g.restore();
      } },
    { name:'生日帽', hat:['#9ac553','#f2849a','#ffffff'], apply(c){ const h = birthdayHat('#9ac553','#f2849a',0xffffff); h.position.set(0.05,0.72,-0.02); c.head.add(h); } },
  ],
  // shield: holds up a whiteboard
  shield(){
    const g = new THREE.Group(), face = new THREE.MeshBasicMaterial({map:kiaBoardTex}), frame = new THREE.MeshBasicMaterial({color:0x9aa0a6});
    g.add(new THREE.Mesh(new THREE.BoxGeometry(3.4,2.6,0.12), [frame,frame,frame,frame,face,face]));
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.4,0.14,0.3), frame),0,-1.35,0.1));
    return g;
  },
  shieldAnim(f){ f.shieldMesh.position.set(f.x + f.face*1.9, f.y + 3.4, 0.4); f.shieldMesh.rotation.y = -f.face*0.95; },
  shieldPose: 'kiaHold', shieldProp: null, breakText: '白板被擦掉了！',
  finalPose: 'throwHit', finalProp: null,
  animate(f, m, s, t, dt){ if (s==='move' && f.move && f.move.prop0==='guava' && f.moveT < f.move.t[0]) m.setFace('chew'); else if (s==='final') m.setFace('smug'); },
  introPose: 'thumbs', readyPose: (t)=> Math.sin(t*10) > 0 ? POSE.kiaPresent : POSE.thumbs, selectSfx: ()=>SFX.rimshot(),
  winSub: '"這場我芭握十足！"',
  final: kiaFinal, winSetup: kiaWinSetup, winUpdate: kiaWinUpdate, loseSetup: kiaLoseSetup, loseUpdate: kiaLoseUpdate,
  longWin: true, longLose: true,
});
