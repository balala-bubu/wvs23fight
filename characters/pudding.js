/* 布丁 Pudding — loaded after js/core.js. Everything this character needs lives in this file.
   主題：染過的頭髮髮根長回黑色（布丁頭），所有招式都圍著布丁、焦糖、脫模打轉。 */
'use strict';

/* ---------- textures ---------- */
const PD_SKIN = '#f3d3b8', PD_SKIN_C = ['#ebc7a9','#f8dcc6','#efcdb0'];
const PD_BLOND = '#d8a157', PD_DARK = '#17120f';
const pdSkinTex = tex(16,16,(g)=>speckle(g,16,16,PD_SKIN,PD_SKIN_C,.4));
function pdHairDraw(g, root){
  speckle(g,32,32,PD_BLOND,['#e6b472','#c48c46','#dca862'],.45);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(90,55,20,.14)' : 'rgba(250,215,160,.2)'; g.fillRect(x + ((x*7)%3) - 1, 0, 1, 32); }
  if (root){                                                                    // 髮根黑、往下很快轉成染過的淺色 → 布丁頭
    const gr = g.createLinearGradient(0,0,0,32);
    gr.addColorStop(0,'rgba(8,6,6,1)'); gr.addColorStop(.62,'rgba(8,6,6,1)');
    gr.addColorStop(.74,'rgba(34,24,16,.85)'); gr.addColorStop(.88,'rgba(80,52,26,.35)'); gr.addColorStop(1,'rgba(110,74,34,0)');
    g.fillStyle = gr; g.fillRect(0,0,32,32);
  } else {                                                                      // 髮尾更淺
    const gr = g.createLinearGradient(0,0,0,32);
    gr.addColorStop(0,'rgba(120,80,40,.3)'); gr.addColorStop(1,'rgba(255,225,175,.3)');
    g.fillStyle = gr; g.fillRect(0,0,32,32);
  }
}
const pdHairTex = tex(32,32,(g)=>pdHairDraw(g,false)), pdRootTex = tex(32,32,(g)=>pdHairDraw(g,true));
function pdFace(g, mode){
  speckle(g,64,64,PD_SKIN,PD_SKIN_C,.3); shadeFace(g);
  g.fillStyle = 'rgba(238,146,130,.24)';
  g.beginPath(); g.ellipse(14,45,6,4,0,0,7); g.fill(); g.beginPath(); g.ellipse(50,45,6,4,0,0,7); g.fill();
  g.fillStyle='#3a2a1c'; g.fillRect(15,26,10,2); g.fillRect(39,26,10,2);
  g.strokeStyle='#17100c'; g.lineWidth=1.8;
  const open = (x, big)=>{
    if (big){ g.fillStyle='#fbf7f2'; g.beginPath(); g.ellipse(x,37,5,4.2,0,0,7); g.fill(); }
    g.fillStyle='#241711'; g.beginPath(); g.ellipse(x,37,big?3.4:3.1,big?3.4:2.7,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35,1.4,1.4);
    g.beginPath(); g.moveTo(x-5.6,35.6); g.quadraticCurveTo(x,32.2,x+5.6,35.6); g.stroke();
  };
  const closedUp = (x)=>{ g.beginPath(); g.arc(x,39,4.6,Math.PI*1.12,Math.PI*1.88); g.stroke(); };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.6,Math.PI*.12,Math.PI*.88); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='happy'){ closedUp(20); closedUp(44); }
  else if (mode==='shout'){ open(20,true); open(44,true); }
  else { open(20); open(44); }
  g.fillStyle='rgba(168,104,78,.32)'; g.fillRect(30,40,4,4);
  if (mode==='shout'){ g.fillStyle='#5a1a1a'; g.beginPath(); g.ellipse(32,51,6.5,5.5,0,0,7); g.fill(); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,54,3.6,2,0,0,7); g.fill(); }
  else if (mode==='cry'){ g.strokeStyle='#a84f50'; g.lineWidth=2.4; g.beginPath(); g.moveTo(25,52); g.quadraticCurveTo(32,46,39,52); g.stroke(); }
  else if (mode==='dizzy'){ g.strokeStyle='#b05050'; g.lineWidth=2.4; g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(28,46,32,50); g.quadraticCurveTo(36,54,40,50); g.stroke(); }
  else { g.fillStyle='#c4686a'; g.beginPath(); g.moveTo(25,48); g.quadraticCurveTo(32,53.5,39,48); g.quadraticCurveTo(32,50.5,25,48); g.closePath(); g.fill(); }
  // 瀏海：最上面一截是黑髮根，往下變成染過的淺色
  const fr = g.createLinearGradient(0,0,0,22); fr.addColorStop(0,'#090707'); fr.addColorStop(.42,'#0d0a09'); fr.addColorStop(.62,'#5a3a1a'); fr.addColorStop(1,PD_BLOND);
  g.fillStyle = fr; g.fillRect(0,0,64,11);
  for (let i=0;i<10;i++){ const x=i*6.6, d=(i===4||i===5)?-3:0; g.beginPath(); g.moveTo(x-1,10); g.lineTo(x+8,10); g.lineTo(x+3+(i%3), 20+(i%2)*4+d); g.closePath(); g.fill(); }
  const sd = g.createLinearGradient(0,0,0,64); sd.addColorStop(0,'#090707'); sd.addColorStop(.2,'#0d0a09'); sd.addColorStop(.34,'#8a5a28'); sd.addColorStop(1,'#eec285');
  g.fillStyle = sd; g.fillRect(0,0,6,64); g.fillRect(58,0,6,64);
  g.fillStyle='rgba(255,226,176,.4)'; [9,22,34,47].forEach(x=>g.fillRect(x,6,1,7));
}
const pdFaces = {};
['normal','cry','happy','dizzy','shout'].forEach(k=>pdFaces[k] = tex(64,64,(g)=>pdFace(g,k)));

/* 白T：胸前印字（畫布放大兩倍，字才不會糊） */
const pdTeeFront = tex(96,128,(g)=>{
  g.scale(2,2);
  speckle(g,48,64,'#f7f5f0',['#efece5','#fcfbf7'],.3);
  g.fillStyle='#8f9aa8'; g.beginPath(); g.ellipse(24,4,8,3.4,0,0,7); g.fill();          // 領口
  g.fillStyle='#f7f5f0'; g.beginPath(); g.ellipse(24,2.6,8,3.2,0,0,7); g.fill();
  g.fillStyle='#1f3566'; g.textAlign='center';
  g.font='700 4.3px sans-serif'; g.fillText('SUPERIOR QUALITY', 24, 36);
  g.font='700 4.6px sans-serif'; g.fillText('SINCE 1987', 24, 43);
  g.font='italic 900 9px serif'; g.fillText('California', 24, 54);
  g.fillStyle='rgba(150,150,140,.18)'; g.fillRect(0,0,3,64); g.fillRect(45,0,3,64);
});
const pdTeeSide = tex(32,32,(g)=>speckle(g,32,32,'#f4f2ec',['#eceae2','#faf9f4'],.3));
const pdTankFront = tex(96,128,(g)=>{
  g.scale(2,2);
  speckle(g,48,64,'#efe6d6',['#e7ddcb','#f6efe2'],.32);
  g.fillStyle='#d9cdb8'; g.beginPath(); g.moveTo(14,2); g.quadraticCurveTo(24,13,34,2); g.lineTo(34,0); g.lineTo(14,0); g.closePath(); g.fill();
  g.fillStyle='#f6efe2'; g.fillRect(10,0,3,9); g.fillRect(35,0,3,9);
  g.fillStyle='rgba(170,155,130,.2)'; for (let y=6;y<64;y+=7) g.fillRect(2,y,44,1);
  g.fillStyle='rgba(160,145,120,.22)'; g.fillRect(0,0,3,64); g.fillRect(45,0,3,64);
});
const pdTankSide = tex(32,32,(g)=>speckle(g,32,32,'#ece2d0',['#e3d8c4','#f3ecdf'],.32));
const pdShortsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#1f2025',['#26272d','#17181c'],.45); g.fillStyle='rgba(255,255,255,.07)'; for (let x=1;x<32;x+=6) g.fillRect(x,0,1,32); });
const pdSockTex = tex(16,16,(g)=>{ speckle(g,16,16,'#f6f6f2',['#eceae4','#fdfdfa'],.3); g.fillStyle='rgba(190,190,182,.5)'; for (let x=0;x<16;x+=3) g.fillRect(x,0,1,16); });

/* ---------- 布丁道具（全部立體） ---------- */
const pdCustardM = L({color:0xf6d98c}), pdCaramelM = L({color:0x9d5a1c}), pdTinM = L({color:0xcfd5db}), pdPlateM = L({color:0xf4f2ee});
function pdPuddingMesh(s){                                                       // 脫模後的布丁：下寬上窄＋焦糖淋在頂上
  const g = new THREE.Group();
  g.add(at(cyl(0.6,0.86,0.72,pdCustardM,16),0,0,0));
  const top = cyl(0.61,0.61,0.1,pdCaramelM,16); top.position.y = 0.38; g.add(top);
  for (let i=0;i<5;i++){ const a = i/5*Math.PI*2, d = cyl(0.07,0.05,0.3,pdCaramelM,6); d.position.set(Math.cos(a)*0.56,0.2,Math.sin(a)*0.56); g.add(d); }
  g.scale.setScalar(s || 1); return g;
}
function pdMoldMesh(){                                                           // 布丁模具（鋁杯），握把在 0、杯口朝 -y
  const g = new THREE.Group();
  g.add(at(cyl(0.06,0.06,0.7,pdTinM,8),0,-0.35,0));
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.46,0.72,0.8,16,1,true), new THREE.MeshLambertMaterial({color:0xcfd5db, side:THREE.DoubleSide}));
  cup.position.y = -1.1; g.add(cup);
  g.add(at(cyl(0.46,0.46,0.06,pdTinM,16),0,-0.72,0));
  for (let i=0;i<3;i++){ const r = cyl(0.74 - i*.01,0.74 - i*.01,0.04,pdTinM,16); r.position.y = -1.44 + i*0.02; g.add(r); }
  return g;
}
function pdPlateMesh(){                                                          // 盤子上的大布丁（勝利用）
  const g = new THREE.Group();
  g.add(at(cyl(1.5,1.3,0.12,pdPlateM,20),0,-0.06,0));
  const p = pdPuddingMesh(1.5); p.position.y = 0.56; g.add(p);
  const sauce = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 8, 0, Math.PI*2, 0, Math.PI/2), new THREE.MeshLambertMaterial({color:0x9d5a1c, transparent:true, opacity:.9}));
  sauce.scale.set(1.25,.1,1.25); sauce.position.y = 0.02; g.add(sauce);
  g.pud = p; g.sauce = sauce; return g;
}
function pdSpoonMesh(){
  const g = new THREE.Group();
  g.add(at(cyl(0.045,0.045,0.8,pdTinM,6),0,-0.4,0));
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.17,10,6), pdTinM); b.scale.set(1,.42,1.3); b.position.y = -0.84; g.add(b);
  return g;
}

/* 焦糖水灘：丟出去的布丁落地後留一攤焦糖，踩到的人會變慢（用 G.finals，不改 core） */
const PD_DOME_GEO = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI*2, 0, Math.PI/2);
function pdSauce_watch(p, owner){
  let done = false;
  G.finals.push({owner, t:0, update(F, dt){
    if (done || G.projs.indexOf(p) < 0) return true;
    if (p.y - p.r <= .35 && p.x > MAIN.x1 && p.x < MAIN.x2){ done = true; pdSauce_spawn(owner, p.x); return true; }
    return false;
  }});
}
function pdSauce_spawn(owner, x){
  const old = G.finals.filter(F=>F.pdSauce && F.owner===owner);
  if (old.length >= 2) old[0].t = Math.max(old[0].t, old[0].dur - .6);
  const g = new THREE.Group(), rx = 3.1;
  const mat = new THREE.MeshLambertMaterial({color:0x9d5a1c, transparent:true, opacity:.82, depthWrite:false});
  const body = new THREE.Mesh(PD_DOME_GEO, mat); body.scale.set(rx,.2,1.3); g.add(body);
  const sh = new THREE.Mesh(PD_DOME_GEO, new THREE.MeshBasicMaterial({color:0xe8b06a, transparent:true, opacity:.5, depthWrite:false, fog:false}));
  sh.scale.set(rx*.4,.18,.5); sh.position.set(-rx*.25,.05,.25); g.add(sh);
  g.position.set(x,.02,.4); g.scale.setScalar(.1); scene.add(g);
  G.finals.push({pdSauce:1, owner, t:0, dur:3.2, x, mesh:g, seen:new Set(), update(F, dt){
    const k = Math.min(1, F.t/.25), fade = Math.min(1, (F.dur - F.t)/1);
    g.scale.setScalar(.1 + .9*k);
    mat.opacity = .82*Math.max(0, fade); sh.material.opacity = .5*Math.max(0, fade);
    for (const v of G.fighters){
      if (v===F.owner || v.state==='dead') continue;
      if (v.onGround && v.y < 2 && Math.abs(v.x - F.x) < rx + .8){
        v.slowT = Math.max(v.slowT, .3);
        if (!F.seen.has(v)){ F.seen.add(v); pop('焦糖黏腳！', v.x, v.y+7.5); }
      } else F.seen.delete(v);
    }
    if (Math.random() < dt*3) burst(F.x + (Math.random()-.5)*rx*1.6, .5, 0xe8b06a, 1, 2);
    return F.t >= F.dur;
  }, dispose(F){ scene.remove(F.mesh); mat.dispose(); sh.material.dispose(); }});
}

/* 布丁包覆：被打中的人整個被裝進一顆會抖的布丁裡，定住慢慢浮起，時間到布丁破掉 */
function pdWrap_start(att, v){
  if (G.finals.some(F=>F.pdWrap && F.victim===v)) return;
  const g = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({color:0xf6d98c, transparent:true, opacity:.62, depthWrite:false});
  const body = new THREE.Mesh(new THREE.CylinderGeometry(2.1,3.0,5.4,20,1), mat); g.add(body);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.15,0.4,20), new THREE.MeshLambertMaterial({color:0x9d5a1c, transparent:true, opacity:.75, depthWrite:false}));
  cap.position.y = 2.6; g.add(cap);
  scene.add(g);
  pop('布丁包起來！', v.x, v.y+8, 'big'); SFX.pdWobble();
  G.finals.push({pdWrap:1, owner:att, victim:v, t:0, mesh:g, dur:1.5, update(F, dt){
    const w = F.victim;
    if (w.state==='dead' || F.t >= F.dur){
      if (w.hittable()){
        w.pct += 6; launch(w, 13 + w.pct*.08, 58, Math.sign(w.x - (F.owner ? F.owner.x : w.x - 1)) || 1);
        pop('啵！', w.x, w.y+8, 'big');
      }
      burst(w.x, w.y+3, 0xf6d98c, 16, 10); burst(w.x, w.y+3, 0x9d5a1c, 8, 7); SFX.pdPlop();
      return true;
    }
    w.state = 'stun'; w.stunT = Math.max(w.stunT || 0, .12); w.move = null;
    w.vy = 2.4; w.vx *= Math.exp(-dt*5); w.onGround = false;
    const j = 1 + Math.sin(F.t*18)*.1;
    g.position.set(w.x, w.y + 2.7, 0); g.scale.set(j, 2 - j, j);
    mat.opacity = .62*Math.min(1, (F.dur - F.t)/.3);
    return false;
  }, dispose(F){ scene.remove(F.mesh); mat.dispose(); }});
}

/* ---------- model ---------- */
function buildPudding(parent){
  const hairM = L({map:pdHairTex}), rootM = L({map:pdRootTex}), faceM = L({map:pdFaces.normal}), skinM = L({map:pdSkinTex});
  const teeF = L({map:pdTeeFront}), teeS = L({map:pdTeeSide}), tankF = L({map:pdTankFront}), tankS = L({map:pdTankSide});
  const teeMats = [teeS,teeS,teeS,teeS,teeF,teeS], tankMats = [tankS,tankS,tankS,tankS,tankF,tankS];
  const teeBits = [], tankBits = [];
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.12,
    torsoMat:teeMats, sleeveMat:()=>teeS, sleeve:[0.62,0.8],
    pantsM:L({map:pdShortsTex}), shoeM, soleM:greySole,
    collar(chest){
      const lan = new THREE.Group();                                             // 綠色識別證掛繩（V 字）
      const lm = L({color:0x3fae5a});
      [-1,1].forEach(s=>{ const b = rbox(0.07,1.05,0.07,.3,lm); b.position.set(s*0.33,1.84,0.49); b.rotation.z = -s*0.2; lan.add(b); });
      lan.add(at(rbox(0.36,0.5,0.06,.08,L({color:0xf5f5f0})),0,1.18,0.5));
      lan.add(at(rbox(0.3,0.12,0.07,.04,L({color:0x2f8f4c})),0,1.37,0.51));
      chest.add(lan); chest.userData.lan = lan;
    },
    hair(head){                                                                   // 頭頂黑髮根 → 往下染成淺色的長髮
      const crown = at(rbox(1.14,0.6,1.14,.66,rootM),0,0.48,-0.02); head.add(crown); head.userData.crown = crown;
      head.add(at(rbox(1.12,1.3,0.46,.55,hairM),0,-0.2,-0.34));
      [-0.42,-0.21,0,0.21,0.42].forEach((x,i)=>{ const st = rbox(0.28,1.5 + (i%2)*0.3 - Math.abs(x)*.35,0.3,.5,hairM); st.position.set(x,-1.08 - (i%2)*0.15,-0.38); st.rotation.z = -x*0.12; head.add(st); });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.16,0.88,0.68,.45,rootM),s*0.53,0.1,0.0));
        const side = rbox(0.3,1.95,0.76,.5,hairM); side.position.set(s*0.55,-0.72,0.0); side.rotation.z = s*0.04; head.add(side);
        const flick = rbox(0.24,0.52,0.5,.5,hairM); flick.position.set(s*0.66,-1.72,0.02); flick.rotation.z = s*0.42; head.add(flick);
      });
      head.add(at(rbox(1.02,0.26,0.14,.45,rootM),0,0.42,0.47));
      [-0.3,0.02,0.3].forEach((x,i)=>{ const f = rbox(0.26,0.22,0.12,.5,hairM); f.position.set(x,0.26,0.48); f.rotation.z = (i-1)*0.1; head.add(f); });
    },
  }, parent);
  c.root.scale.set(0.92,0.88,0.92);                                               // 跟心瑩差不多高
  c.hairRoot = c.head.userData.crown;
  c.lanyard = c.chest.userData.lan;
  // 側邊頭髮蓋住耳朵，把核心加的耳朵藏起來
  c.head.children.forEach(o=>{ if (o.isMesh && Math.abs(o.position.x) > 0.4 && Math.abs(o.position.y - 0.02) < .01) o.visible = false; });
  // 短褲＋裸腿＋白短襪
  [c.R, c.Lf].forEach(a=>{ a.sh.children[0].scale.y = 0.6; teeBits.push(a.sh.children[0]); });
  const sockM = L({map:pdSockTex}), shortsM = L({map:pdShortsTex});
  [[c.joints.rHp, c.joints.rKn], [c.joints.lHp, c.joints.lKn]].forEach(([hp, kn])=>{
    hp.children[0].material = skinM; hp.children[0].scale.set(.9,1,.9);
    hp.add(at(rbox(0.76,0.86,0.82,.3,shortsM),0,-0.36,0));
    hp.add(at(rbox(0.8,0.16,0.86,.3,shortsM),0,-0.76,0));
    kn.children[0].material = skinM; kn.children[0].scale.set(.9,1,.9);
    kn.add(at(rbox(0.56,0.5,0.6,.26,sockM),0,-1.22,0));
  });
  c.torso = c.chest.children[0];
  c.setOutfit = (o)=>{
    const tank = o === 'tank';
    c.torso.material = tank ? tankMats : teeMats;
    teeBits.forEach(m=>m.visible = !tank); tankBits.forEach(m=>m.visible = tank);
    c.lanyard.visible = !tank;
  };
  c.setOutfit('tee');
  const mold = pdMoldMesh(); c.R.hd.add(mold);
  const pud = pdPuddingMesh(1.3); pud.position.y = -0.7; c.R.hd.add(pud);
  const plate = pdPlateMesh(); plate.position.y = -0.9; plate.scale.setScalar(.7); c.R.hd.add(plate);
  const spoon = pdSpoonMesh(); c.R.hd.add(spoon);
  c.props = {mold, pud, plate, spoon};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = pdFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = pdFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- 大招：天降超大布丁 ---------- */
function pdFinal(f, opp){
  const tgt = nearestFoe(f) || opp;
  f.finalT = 3.4; banner('天降超大布丁！'); SFX.pdWobble(); pop('脫模囉～！', f.x, f.y+7.5, 'big');
  const cx = Math.min(MAIN.x2 - 4, Math.max(MAIN.x1 + 4, tgt ? tgt.x : f.x + f.face*6));
  const mesh = new THREE.Group();
  const big = pdPuddingMesh(5.4); mesh.add(big);
  scene.add(mesh);
  const shadow = new THREE.Mesh(PD_DOME_GEO, new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:.3, depthWrite:false, fog:false}));
  shadow.scale.set(4.2,.05,1.8); shadow.position.set(cx,.04,.4); scene.add(shadow);
  G.finals.push({owner:f, target:tgt, t:0, mesh, shadow, x:cx, y:24, vy:0, landed:false, landT:0, bump:0, burst:false, hit:new Set(), update(F, dt){
    if (!F.landed){
      F.vy -= 46*dt; F.y += F.vy*dt;
      if (F.y <= 2.3){
        F.y = 2.3; F.landed = true; F.landT = F.t; SFX.pdPlop(); G.shake = reduce ? .2 : 1.5; G.flash = .25;
        burst(F.x, .6, 0xf6d98c, 22, 13); burst(F.x, .6, 0x9d5a1c, 10, 9);
        pop('啪嘰——！', F.x, 7.5, 'big');
      }
      F.mesh.rotation.z = Math.sin(F.t*7)*.06;
    } else {
      const u = F.t - F.landT;
      const j = 1 + Math.sin(u*13)*Math.max(0, .3 - u*.08);                        // 落地後整顆抖
      F.mesh.scale.set(j, 2 - j, j); F.mesh.rotation.z = Math.sin(u*11)*.05*Math.max(0, 1 - u);
      // 每一次抖都把旁邊的人彈一下（小跳不擊飛）
      const n = Math.floor(u/.42);
      if (n > F.bump && n <= 3){
        F.bump = n; SFX.pdWobble();
        for (const v of G.fighters){
          if (v===F.owner || !v.hittable()) continue;
          if (Math.abs(v.x - F.x) < 5.6 && v.y < 8) applyHit(F.owner, v, {dmg:4, kb:4, sc:0, ang:80, soft:1}, Math.sign(v.x - F.x) || 1, v.x, v.y+3);
        }
      }
      if (!F.burst && u > 1.5){                                                    // 最後焦糖爆開、才真的擊飛
        F.burst = true; SFX.pdPlop(); SFX.boom(); G.shake = reduce ? .2 : 1.2; G.flash = .3;
        burst(F.x, 2.6, 0x9d5a1c, 26, 16); burst(F.x, 2.6, 0xf6d98c, 20, 13);
        pop('焦糖大噴發！', F.x, 8.5, 'big');
        for (const v of G.fighters){
          if (v===F.owner || F.hit.has(v) || !v.hittable()) continue;
          if (Math.abs(v.x - F.x) < 7 && v.y < 10){
            F.hit.add(v); v.pct += 18; launch(v, 23 + v.pct*.11, 48, Math.sign(v.x - F.x) || F.owner.face);
            SFX.hit(36); spark(v.x, v.y+3, 4);
          }
        }
        pdSauce_spawn(F.owner, Math.max(MAIN.x1 + 2, F.x - 5));
        pdSauce_spawn(F.owner, Math.min(MAIN.x2 - 2, F.x + 5));
      }
      if (u > 1.5){ F.mesh.scale.multiplyScalar(Math.max(.02, 1 - dt*3)); F.shadow.material.opacity *= Math.max(0, 1 - dt*3); }
    }
    F.mesh.position.set(F.x, F.y, 0);
    F.shadow.scale.x = 4.2*(1 - Math.min(.5, (F.y - 2.3)/40)); F.shadow.scale.z = F.shadow.scale.x*.4;
    return F.t > 3.4;
  }, dispose(F){ scene.remove(F.mesh); scene.remove(F.shadow); }});
}

/* ---------- results ---------- */
/* 勝利：把模具倒扣、完美脫模，焦糖淋下去，挖一口吃掉 */
function pdWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const table = new THREE.Group();
  table.add(at(rbox(4.2,0.3,3,.1,L({color:0xcfa070})),0,0,0));
  [-1,1].forEach(s=>table.add(at(cyl(0.16,0.16,2.6,L({color:0xa07a50}),8),s*1.6,-1.45,0)));
  table.position.set(wp.x + 3.4, RS_Y + 1.5, 0.6); scene.add(table); R.items.push(table); R.pdTable = table;
  const plate = pdPlateMesh(); plate.scale.setScalar(1.5); plate.position.set(wp.x + 3.4, RS_Y + 1.65, 0.6); plate.visible = false;
  scene.add(plate); R.items.push(plate); R.pdPlate = plate;
}
function pdWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props;
  for (const n in P_) P_[n].visible = false;
  if (R.t < 1.5){
    applyPose(m, POSE.pdFlip, k); P_.mold.visible = true; m.setFace('shout');
    once('pw0', .3, ()=>{ SFX.pdWobble(); popAt('脫模——！', W, 8.5, 'big'); });
    once('pw1', 1.25, ()=>{ SFX.pdPlop(); popAt('啵！', W, 8.5, 'big'); G.shake = reduce ? .1 : .4;
      const p = R.pdPlate.position; burst(p.x, p.y + 2, 0xf6d98c, 14, 8); });
    R.pdPlate.visible = R.t > 1.25;
  } else if (R.t < 3.1){
    applyPose(m, POSE.pdServe, k); m.setFace('happy'); R.pdPlate.visible = true;
    const j = 1 + Math.sin(R.t*14)*Math.max(0, .22 - (R.t - 1.5)*.1);
    R.pdPlate.pud.scale.set(1.5*j, 1.5*(2 - j), 1.5*j);
    once('pw2', 1.8, ()=>popAt('完美！一點都沒有塌！', W, 9, 'big'));
    once('pw3', 2.6, ()=>{ SFX.pdPlop(); popAt('焦糖加好加滿～', W, 8.5); });
  } else if (R.t < 4.6){
    applyPose(m, POSE.pdEat, k); P_.spoon.visible = true; m.setFace('happy'); R.pdPlate.visible = true;
    once('pw4', 3.4, ()=>{ SFX.pdWobble(); popAt('挖一口……', W, 8.5); });
    once('pw5', 4.0, ()=>{ SFX2.cheer(); popAt('好ㄉ～！', W, 9, 'big'); const p = m.holder.position; burst(p.x, p.y + 6.5, 0xf6d98c, 14, 8); });
  } else {
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.peace, k); m.setFace('shout'); R.pdPlate.visible = true;
    once('pw6', 4.8, ()=>{ SFX2.fanfare(); popAt('布丁頭今天也很爭氣！', W, 9.5, 'big'); });
  }
}
/* 戰敗：布丁塌掉融成一灘，她蹲著哭，然後髮根又長出一截黑的 */
function pdLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  const g = new THREE.Group();
  const pud = pdPuddingMesh(2.2); g.add(pud);
  const pool = new THREE.Mesh(PD_DOME_GEO, new THREE.MeshLambertMaterial({color:0xd8b26a, transparent:true, opacity:.9}));
  pool.scale.set(.1,.05,.1); g.add(pool);
  g.position.set(lp.x + 3.2, RS_Y + 0.1, 0.8); scene.add(g); R.items.push(g);
  R.pdMelt = {g, pud, pool};
  R.pdRoot0 = Lz.m.hairRoot ? Lz.m.hairRoot.scale.y : 1;
}
function pdLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, M_ = R.pdMelt;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.3){
    applyPose(m, POSE.pdServe, k); m.setFace('normal');
    M_.pud.scale.setScalar(2.2);
    once('pl0', .25, ()=>popAt('等一下……', Lz, 8));
    once('pl1', .9, ()=>{ SFX.pdWobble(); popAt('它好像在晃……', Lz, 8, 'blue'); });
  } else {
    const u = Math.min(1, (R.t - 1.3)/.7);
    M_.pud.scale.set(2.2*(1 + u*.6), 2.2*Math.max(.06, 1 - u), 2.2*(1 + u*.6));
    M_.pool.scale.set(.1 + u*3.4, .05 + u*.14, .1 + u*1.5);
    applyPose(m, POSE.sob, k); m.setFace('cry');
    once('pl2', 1.6, ()=>{ SFX.pdPlop(); G.shake = reduce ? .1 : .4; popAt('塌掉了——！', Lz, 8.5, 'big');
      burst(M_.g.position.x, RS_Y + 1, 0xd8b26a, 14, 7); });
    once('pl3', 2.6, ()=>popAt('我的布丁……', Lz, 8, 'blue'));
    // 髮根又長長了一截
    if (R.t > 3.2 && m.hairRoot){
      const v = Math.min(1, (R.t - 3.2)/1.2);
      m.hairRoot.scale.y = R.pdRoot0*(1 + v*2.1); m.hairRoot.position.y = 0.48 - v*0.42;
      once('pl4', 3.5, ()=>popAt('……頭頂也黑回來了。', Lz, 8.5, 'big'));
      once('pl5', 4.6, ()=>{ SFX2.sigh(); popAt('又變成布丁頭了啦！', Lz, 9, 'big'); });
    }
  }
}

registerChar('pudding', {
  stats: { name:'布丁', en:'Pudding', tag:'布丁頭・髮根黑回來・焦糖控', weight:0.85, run:14, air:11.5, jumpV:33, djV:29, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.09,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'抖一下！', sfx:'pdWobble'},
    side:{t:[.24,.1,.32], pose:['batWind','batHit'], box:[2.9,3.4,1.7], dmg:15, kb:12, sc:1.1, ang:36, prop:'mold', text:'布丁模具！', sfx:'swing'},
    up:{t:[.16,.12,.28], pose:['upWind','upHit'], box:[0.5,7.0,1.9], dmg:12, kb:11, sc:1, ang:88, text:'布丁頭脫模！', sfx:'pdPlop', fire:[[.18,'pdPop']]},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:12, kb:9, sc:.85, ang:70, prop:'mold', text:'焦糖蓋章！', sfx:'pdPlop'},
    nair:{t:[.06,.22,.15], pose:['pdJiggle','pdJiggle'], box:[0,3,2.3], dmg:7, kb:6, sc:.6, ang:45, air:1, sfx:'pdWobble'},
    fair:{t:[.1,.1,.2], pose:['batWind','batHit'], box:[2.4,3.4,1.5], dmg:9, kb:8, sc:.9, ang:40, air:1, prop:'mold', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.6,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'pud'},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'mold', sfx:'pdPlop'},
    nB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], prop0:'pud', fire:[[.2,'pdThrow']], air:1, text:'請你吃布丁！', sfx:'swing'},
    sB:{t:[.14,.3,.34], pose:['pdRoll','pdRoll'], box:[1.7,3.2,2.0], dmg:10, kb:7, sc:.5, ang:42, dash:26, air:1, roll:1, text:'布丁滾滾！', sfx:'pdWobble'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, prop:'mold', start:'pdLaunch', box:[0.4,5.2,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.18,.14,.42], pose:['pdJiggle','throwHit'], box:[2.2,3.6,2.4], dmg:6, kb:2, sc:.1, ang:50, onHit:'pdWrap', air:1, text:'布丁包覆！', sfx:'pdWobble'},
  },
  fire: {
    pdThrow(f){
      pdSauce_watch(proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.4, vx:f.face*17, vy:11, g:30, r:.95, life:2, bounce:1,
        dmg:8, kb:6, sc:.5, ang:45, slow:1.2, mesh:pdPuddingMesh(1.7)}), f);
      pop('接好喔～', f.x, f.y+7);
    },
    pdPop(f){ burst(f.x, f.y+7.4, 0xf6d98c, 12, 8); burst(f.x, f.y+7, 0x9d5a1c, 5, 5); },
  },
  start: {
    pdLaunch(f){ f.vy = 36; f.vx = f.face*5; f.onGround = false; f.jumps = 0; f.ff = false;
      pop('啵！彈出去！', f.x, f.y+7); burst(f.x, f.y+1, 0xf6d98c, 14, 10); burst(f.x, f.y+1, 0x9d5a1c, 6, 7); SFX.pdPlop(); },
  },
  onhit: {
    pdWrap(a, v){ pdWrap_start(a, v); },
  },
  poses: {
    pdJiggle: S_({rSh:[0,0,-1.45], lSh:[0,0,1.45], rEl:[-0.2], lEl:[-0.2], rHp:[0,0,-0.1], lHp:[0,0,0.1], rKn:[0.12], lKn:[0.12], head:[-0.1], drop:-0.08}),
    pdRoll: S_({rSh:[-2.6,0,-0.3], lSh:[-2.6,0,0.3], rEl:[-1.6], lEl:[-1.6], rHp:[-1.5], lHp:[-1.5], rKn:[1.7], lKn:[1.7], chest:[0.6], head:[0.5], drop:-0.9}),
    pdFlip: P({rSh:[-2.5,0,-0.35], rEl:[-1.2], lSh:[-2.2,0,0.35], lEl:[-1.1], head:[-0.3], chest:[-0.1]}),
    pdServe: P({rSh:[-1.4,0,-0.15], rEl:[-0.4], lSh:[-1.2,0,0.2], lEl:[-0.5], head:[0.15], chest:[0.1]}),
    pdEat: P({rSh:[-2.1,0,0.4], rEl:[-1.8], lSh:[-1.1,0,0.25], lEl:[-0.6], head:[-0.3], chest:[-0.15], drop:-0.08}),
  },
  sfx: {
    pdWobble(){ tone(300,.22,'sine',.1,.6); tone(450,.18,'sine',.06,1.6,.04); tone(240,.2,'sine',.05,.7,.1); },
    pdPlop(){ noise(.05,.3,900); tone(520,.14,'sine',.12,.35); tone(260,.16,'sine',.08,.5,.05); },
  },
  build: buildPudding, face: pdFaces.normal, portraitBg: '#f2d79c',
  portrait(g){
    g.fillStyle = PD_BLOND; g.fillRect(1,8,10,56); g.fillRect(53,8,10,56); g.fillRect(4,4,56,16);
    for (let i=0;i<7;i++){ g.beginPath(); g.moveTo(8+i*7,17); g.lineTo(16+i*7,17); g.lineTo(11+i*7,25+(i%2)*3); g.closePath(); g.fill(); }
    g.fillStyle = PD_DARK; g.fillRect(6,2,52,10); g.fillRect(2,6,9,8); g.fillRect(53,6,9,8);
    g.fillStyle = '#6a4620'; g.fillRect(6,12,52,4);
  },
  skins: [
    { name:'小可愛背心', apply(c){ c.setOutfit('tank'); },
      portrait(g){ g.fillStyle = '#efe6d6'; g.fillRect(16,56,32,8); g.fillStyle='#d9cdb8'; g.fillRect(16,56,32,2); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#f6d98c','#9d5a1c',0xfff0c0); h.position.set(0.05,0.72,-0.02); c.head.add(h); } },
  ],
  // 防禦：整個人被一顆半透明的布丁罩住，一直抖；撐太久布丁會融掉
  shield(){
    const g = new THREE.Group();
    const m1 = new THREE.MeshBasicMaterial({color:0xf6d98c, transparent:true, opacity:.3, depthWrite:false});
    const m2 = new THREE.MeshBasicMaterial({color:0x9d5a1c, transparent:true, opacity:.38, depthWrite:false});
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(2.3,3.1,5.4,16,1), m1));
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.35,2.35,0.35,16), m2); cap.position.y = 2.6; g.add(cap);
    for (let i=0;i<4;i++){ const a = i/4*Math.PI*2, d = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.1,0.8,6), m2); d.position.set(Math.cos(a)*2.2, 2.1, Math.sin(a)*2.2); g.add(d); }
    return g;
  },
  shieldAnim(f){
    const j = 1 + Math.sin(performance.now()*.016)*.12;
    f.shieldMesh.position.set(f.x, f.y+2.6, 0);
    f.shieldMesh.scale.multiply(new THREE.Vector3(j, 2 - j, j));
  },
  shieldPose: 'pdJiggle', shieldProp: null, breakText: '布丁融掉了！', brokePose: 'dizzy',
  finalPose: 'pdFlip', finalProp: 'mold',
  animate(f, m, s, t, dt){
    if (s==='shield'){ f.shieldHP -= 5*dt; if (Math.random() < dt*4) drip(f.x + (Math.random()-.5)*4, f.y + .6, 0xd8b26a); }
    if (s==='move' && f.move && f.move.roll){ m.body.rotation.z -= f.face*dt*17; }
    else { let r = m.body.rotation.z; r = Math.atan2(Math.sin(r), Math.cos(r)); m.body.rotation.z = r*Math.exp(-dt*18); }
    if (s==='stun') m.setFace('dizzy');
    else if (s==='final' || (s==='move' && f.move === f.M.up)) m.setFace('shout');
    else if (f.slowT > 0) m.setFace('cry');
    else m.setFace('normal');
  },
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.pdJiggle : POSE.cheer, selectSfx: ()=>SFX.pdWobble(),
  winSub: '"Pudding head, still sweet."',
  final: pdFinal, winSetup: pdWinSetup, winUpdate: pdWinUpdate, loseSetup: pdLoseSetup, loseUpdate: pdLoseUpdate,
  longWin: true, longLose: true,
});
