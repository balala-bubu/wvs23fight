/* 睿睿 Serene — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- textures ---------- */
const SER_SKIN = '#f0cfb6', SER_SKIN_C = ['#e8c4a8','#f5d8c2','#ecc8ae'];
const SER_HAIR = '#a65a32';
const serSkinTex = tex(16,16,(g)=>speckle(g,16,16,SER_SKIN,SER_SKIN_C,.4));
function serHairDraw(g, root){
  speckle(g,32,32,SER_HAIR,['#b86a3c','#8e4626','#9c5230'],.45);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(70,30,15,.14)' : 'rgba(215,140,90,.18)'; g.fillRect(x + ((x*7)%3) - 1, 0, 1, 32); }
  if (root){ const gr = g.createLinearGradient(0,0,0,32); gr.addColorStop(0,'rgba(48,26,18,.95)'); gr.addColorStop(.55,'rgba(70,36,22,.55)'); gr.addColorStop(1,'rgba(70,36,22,0)'); g.fillStyle = gr; g.fillRect(0,0,32,32); }
}
const serHairTex = tex(32,32,(g)=>serHairDraw(g,false)), serRootTex = tex(32,32,(g)=>serHairDraw(g,true));
function serFace(g, mode){
  speckle(g,64,64,SER_SKIN,SER_SKIN_C,.3); shadeFace(g);
  // blush (very red when drunk)
  g.fillStyle = mode==='drunk' ? 'rgba(235,70,70,.55)' : 'rgba(240,120,120,.26)';
  const br = mode==='drunk' ? 8 : 6;
  g.beginPath(); g.ellipse(14,45,br,br*.65,0,0,7); g.fill(); g.beginPath(); g.ellipse(50,45,br,br*.65,0,0,7); g.fill();
  // brows
  g.fillStyle='#6b3b22'; g.fillRect(15,26,10,2); g.fillRect(39,26,10,2);
  // eyes
  g.strokeStyle='#140c0a'; g.lineWidth=1.8;
  const open = (x, wing, big)=>{
    if (big){ g.fillStyle='#fbf7f2'; g.beginPath(); g.ellipse(x,37,5,4,0,0,7); g.fill(); }
    g.fillStyle='#2a1a14'; g.beginPath(); g.ellipse(x,37,big?3.4:3.2,big?3.4:2.6,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35,1,1);
    g.beginPath(); g.moveTo(x-6,36); g.quadraticCurveTo(x,32,x+6,36); g.lineTo(x+6+wing*2.5,33); g.stroke();   // winged liner
  };
  const closedUp = (x)=>{ g.beginPath(); g.arc(x,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.5,Math.PI*.15,Math.PI*.85); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='drunk'){ closedDown(20); closedDown(44); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='wink'){ open(20,-1); closedUp(44); }
  else if (mode==='shout'){ open(20,-1,true); open(44,1,true); }
  else { open(20,-1); open(44,1); }
  // nose
  g.fillStyle='rgba(160,90,70,.35)'; g.fillRect(30,40,4,4);
  // mouth
  if (mode==='shout'){ g.fillStyle='#5a1a1a'; g.beginPath(); g.ellipse(32,51,7,6,0,0,7); g.fill(); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,54,4,2,0,0,7); g.fill(); }
  else if (mode==='cry'){ g.strokeStyle='#a84f50'; g.lineWidth=2.4; g.beginPath(); g.moveTo(25,52); g.quadraticCurveTo(32,46,39,52); g.stroke(); }
  else if (mode==='drunk' || mode==='dizzy'){ g.strokeStyle='#b05050'; g.lineWidth=2.4; g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(28,46,32,50); g.quadraticCurveTo(36,54,40,50); g.stroke(); }
  else { g.fillStyle='#c76a6a'; g.beginPath(); g.moveTo(25,48); g.quadraticCurveTo(32,53,39,48); g.quadraticCurveTo(32,50.5,25,48); g.closePath(); g.fill(); }
  // see-through fringe + face-framing hair
  g.fillStyle=SER_HAIR; g.fillRect(0,0,64,11);
  for (let i=0;i<10;i++){ const x=i*6.6, d=(i===4||i===5)?-3:0; g.beginPath(); g.moveTo(x-1,10); g.lineTo(x+8,10); g.lineTo(x+3+(i%3), 19+(i%2)*4+d); g.closePath(); g.fill(); }
  g.fillRect(0,0,6,64); g.fillRect(58,0,6,64);
  g.fillStyle='rgba(205,135,85,.6)'; [8,21,33,46].forEach(x=>g.fillRect(x,2,1,9));
}
const serFaces = {};
['normal','cry','wink','drunk','dizzy','shout'].forEach(k=>serFaces[k] = tex(64,64,(g)=>serFace(g,k)));
function serLace(g, w, h, y0, y1){
  for (let y=y0;y<y1;y++) for (let x=0;x<w;x++){ g.fillStyle = (x+y)%3 ? '#ece5d9' : '#f4efe6'; g.fillRect(x,y,1,1); }
  g.fillStyle = '#c4b8a4';
  for (let x=1;x<w;x+=5) for (let y=y0;y<y1;y++){ const zx = x + ((y>>1)%2 ? 1 : 0) + ((y>>2)%2 ? 1 : 0); g.fillRect(zx, y, 1, 1); }
}
const serLaceTex = tex(32,32,(g)=>serLace(g,32,32,0,32));
const serCamiFront = tex(32,46,(g)=>{
  serLace(g,32,46,0,46);
  g.fillStyle = '#fbf9f4'; g.beginPath(); g.moveTo(3,14); g.quadraticCurveTo(16,19,29,14); g.lineTo(32,46); g.lineTo(0,46); g.closePath(); g.fill();
  g.fillStyle = '#fbf9f4'; g.fillRect(6,3,2,12); g.fillRect(24,3,2,12);
  g.strokeStyle = '#d9d0bf'; g.lineWidth = 1; g.beginPath(); g.moveTo(3,14.5); g.quadraticCurveTo(16,19.5,29,14.5); g.stroke();
  g.fillStyle = 'rgba(170,150,125,.22)'; g.fillRect(0,15,3,31); g.fillRect(29,15,3,31);
  g.fillStyle = 'rgba(170,150,125,.2)'; for (let x=2;x<32;x+=4) g.fillRect(x,40,1,6);
  g.fillStyle = '#aeb5bd'; g.fillRect(11,2,1,7); g.fillRect(20,2,1,7); g.fillRect(12,9,1,2); g.fillRect(19,9,1,2); g.fillRect(13,11,6,1);
});
const serCamiSide = tex(32,46,(g)=>{ serLace(g,32,46,0,46); g.fillStyle = '#f6f3ec'; g.fillRect(0,15,32,31); g.fillStyle = 'rgba(170,150,125,.18)'; g.fillRect(0,15,32,1); });
const serTightsTex = tex(16,16,(g)=>speckle(g,16,16,'#ead2c0',['#e2c7b3','#f0dccd'],.4));
const serSiriTex = tex(64,128,(g)=>{
  const bg = g.createLinearGradient(0,0,0,128); bg.addColorStop(0,'#1a1430'); bg.addColorStop(1,'#05040a'); g.fillStyle=bg; g.fillRect(0,0,64,128);
  const o = g.createRadialGradient(32,60,2,32,60,20); o.addColorStop(0,'#ffffff'); o.addColorStop(.35,'#ff6fd8'); o.addColorStop(.65,'#6f8bff'); o.addColorStop(1,'rgba(60,220,255,0)');
  g.fillStyle=o; g.beginPath(); g.arc(32,60,20,0,7); g.fill();
  g.fillStyle='#fff'; g.font='900 12px sans-serif'; g.textAlign='center'; g.fillText('嘿 Siri', 32, 24);
  g.font='700 8px sans-serif'; g.fillText('鎖定最近的人…', 32, 98); g.fillStyle='#ff5a6a'; g.fillText('● 目標確認', 32, 112);
  g.fillStyle='#444'; g.fillRect(24,4,16,3);
});
const serShoutTex = tex(64,32,(g)=>{
  g.fillStyle='#fff3a0'; g.strokeStyle='#5a2a10'; g.lineWidth=4; g.font='900 22px sans-serif'; g.textAlign='center';
  g.strokeText('欸～！！', 32, 24); g.fillText('欸～！！', 32, 24);
});

/* ---------- props ---------- */
const serDarkM = L({color:0x1d1d22}), serSilverM = L({color:0xd8dde3}), serGlassM = new THREE.MeshLambertMaterial({color:0xeaf6ff, transparent:true, opacity:.55}), serWineM = L({color:0x8a1426});
function serPhoneMesh(s){
  const g = new THREE.Group();
  g.add(rbox(0.5,0.92,0.08,.25,serDarkM));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.42,0.82), new THREE.MeshBasicMaterial({map:serSiriTex})); scr.position.z = 0.045; g.add(scr);
  g.scale.setScalar(s || 1); return g;
}

/* 落地緩速區：飛行道具第一次落到地面時，留下一攤約 3 秒的黏液，只拖慢對手（不改 core，靠 G.finals 更新） */
const serPud_GEO = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI*2, 0, Math.PI/2);
function serPud_watch(p, owner){
  let done = false;
  G.finals.push({owner, t:0, update(F, dt){
    if (done || G.projs.indexOf(p) < 0) return true;
    if (p.y - p.r <= .3 && p.x > MAIN.x1 && p.x < MAIN.x2){ done = true; serPud_spawn(owner, p.x); return true; }
    return false;
  }});
}
function serPud_spawn(owner, x){
  const old = G.finals.filter(F=>F.pud && F.owner===owner);
  if (old.length >= 2) old[0].t = Math.max(old[0].t, old[0].dur - .8);
  const C = serPud_CFG, g = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({color:C.color, transparent:true, opacity:C.op, depthWrite:false});
  const body = new THREE.Mesh(serPud_GEO, mat); body.scale.set(C.rx, .22, 1.3); g.add(body);
  const sh = new THREE.Mesh(serPud_GEO, new THREE.MeshBasicMaterial({color:C.shine, transparent:true, opacity:.55, depthWrite:false, fog:false}));
  sh.scale.set(C.rx*.45, .2, .5); sh.position.set(-C.rx*.25, .05, .25); g.add(sh);
  g.position.set(x, .02, .4); g.scale.set(.1, .1, .1); scene.add(g);
  const F = {pud:1, owner, t:0, dur:3, x, mesh:g, seen:new Set(), update(F, dt){
    const k = Math.min(1, F.t/.25), fade = Math.min(1, (F.dur - F.t)/1);
    g.scale.set(.1 + .9*k, .1 + .9*k, .1 + .9*k);
    mat.opacity = C.op*Math.max(0, fade); sh.material.opacity = .55*Math.max(0, fade);
    for (const v of G.fighters){
      if (v===F.owner || v.state==='dead') continue;
      if (v.onGround && v.y < 2 && Math.abs(v.x - F.x) < C.rx + .8){
        v.slowT = Math.max(v.slowT, .3);
        if (!F.seen.has(v)){ F.seen.add(v); pop(C.text, v.x, v.y+7.5); }
      } else F.seen.delete(v);
    }
    if (Math.random() < dt*3) burst(F.x + (Math.random()-.5)*C.rx*1.6, .5, C.bubble, 1, 2);
    return F.t >= F.dur;
  }, dispose(F){ scene.remove(F.mesh); mat.dispose(); sh.material.dispose(); }};
  G.finals.push(F);
}

const serPud_CFG = {color:0xe9b83a, shine:0xfff3c0, bubble:0xfff6d0, op:.8, rx:3.4, text:'腳底黏黏的～'};
function serBeerMesh(s){
  const g = new THREE.Group();
  g.add(cyl(0.2,0.2,0.56,serSilverM,10));
  g.add(at(cyl(0.205,0.205,0.24,L({color:0x2f8f4e}),10),0,-0.02,0));
  g.add(at(cyl(0.16,0.2,0.05,serSilverM,10),0,0.3,0));
  g.scale.setScalar(s || 1); return g;
}
function serWineGlass(){
  const g = new THREE.Group();
  g.add(at(cyl(0.18,0.18,0.03,serGlassM,10),0,0.05,0.1));
  g.add(at(cyl(0.03,0.03,0.6,serGlassM,6),0,-0.28,0.1));
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.14,0.5,12,1,true), serGlassM); bowl.position.set(0,-0.84,0.1); g.add(bowl);
  const wine = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.13,0.3,12), serWineM); wine.position.set(0,-0.72,0.1); g.add(wine);
  g.wine = wine; return g;
}
function serBottle(champ){
  const g = new THREE.Group(), body = L({color: champ ? 0x2b4a2f : 0x3a1420});
  g.add(at(cyl(0.08,0.09,0.5,body,8),0,-0.15,0));
  g.add(at(cyl(0.22,0.22,1.3,body,10),0,-1.05,0));
  g.add(at(cyl(0.225,0.225,0.4,L({color: champ ? 0xf2d27a : 0xf2ead8}),10),0,-1.0,0));
  if (champ) g.add(at(cyl(0.1,0.1,0.3,L({color:0xf2c14e}),8),0,0.05,0));
  return g;
}
function serGavel(){
  const g = new THREE.Group(), wood = L({color:0x7a4a26});
  g.add(at(cyl(0.06,0.06,1.4,wood,6),0,-0.7,0));
  const head = cyl(0.22,0.22,0.85,wood,10); head.rotation.x = Math.PI/2; head.position.set(0,-1.5,0); g.add(head);
  [-1,1].forEach(s=>{ const b = cyl(0.235,0.235,0.08,L({color:0xc9a24a}),10); b.rotation.x = Math.PI/2; b.position.set(0,-1.5,s*0.3); g.add(b); });
  return g;
}
/* the bath-pouf skirt: ruffled tulle tiers with wavy hems */
function serTierGeo(rT, rB, h, waves, amp, ph){
  const geo = new THREE.CylinderGeometry(rT, rB, h, 96, 5, true), pos = geo.attributes.position, col = [];
  for (let i=0;i<pos.count;i++){
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), a = Math.atan2(z, x), k = (h/2 - y)/h;
    const w = Math.sin(a*waves + ph), rs = 1 + w*amp*k*k;
    pos.setXYZ(i, x*rs, y + Math.cos(a*waves + ph)*amp*.7*k*k, z*rs);
    const sh = .74 + .26*k + w*.05*k; col.push(sh, sh, sh);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals(); return geo;
}
function serSkirt(hips){
  const g = new THREE.Group(); g.position.set(0,-0.08,0); g.scale.set(1,1,.82); hips.add(g);
  const mA = new THREE.MeshLambertMaterial({color:0x9f8ff0, vertexColors:true, side:THREE.DoubleSide});
  const mB = new THREE.MeshLambertMaterial({color:0xbcb0f8, vertexColors:true, side:THREE.DoubleSide});
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.82,1.15,1.0,16,1,true), new THREE.MeshLambertMaterial({color:0x8f80c8, side:THREE.DoubleSide})); inner.position.y = -0.55; g.add(inner);
  [[0.82,1.22,0.55,-0.2,8,.06,0,mB],[0.92,1.42,0.6,-0.48,10,.08,1.1,mA],[1.0,1.58,0.6,-0.78,12,.09,2.3,mB],[1.12,1.5,0.42,-1.06,14,.1,.6,mA]].forEach(([rT,rB,h,y,wv,am,ph,M])=>{
    const t = new THREE.Mesh(serTierGeo(rT,rB,h,wv,am,ph), M); t.position.y = y; g.add(t);
  });
  return {g, mA, mB};
}

/* ---------- model ---------- */
function buildSerene(parent){
  const hairM = L({map:serHairTex}), faceM = L({map:serFaces.normal}), skinM = L({map:serSkinTex});
  const laceM = L({map:serLaceTex}), frontM = L({map:serCamiFront}), sideM = L({map:serCamiSide});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.12,
    torsoMat:[sideM,sideM,laceM,laceM,frontM,sideM], sleeveMat:()=>laceM, sleeve:[0.58,0.72],
    pantsM:L({map:serTightsTex}), shoeM, soleM:greySole,
    collar(chest){
      chest.add(at(cyl(0.29,0.31,0.36,laceM,10),0,2.34,0));                       // high lace neck
      const pep = new THREE.Mesh(serTierGeo(0.84,1.0,0.34,9,.1,0), L({color:0xfaf7f0, vertexColors:true, side:THREE.DoubleSide})); pep.scale.set(1,1,0.62); pep.position.y = 0.12; chest.add(pep);
      const heart = new THREE.Group(); [-1,1].forEach(s=>heart.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.07,6,4),serSilverM),s*0.055,0.03,0)));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1,0.14,6),serSilverM); tip.rotation.x = Math.PI; tip.position.y = -0.06; heart.add(tip);
      heart.position.set(0,1.62,0.49); chest.add(heart);
    },
    hair(head){
      const rootM = L({map:serRootTex});
      head.add(at(rbox(1.12,0.54,1.12,.68,rootM),0,0.5,-0.02));
      head.add(at(rbox(1.12,1.25,0.46,.55,hairM),0,-0.12,-0.34));
      [-0.42,-0.21,0,0.21,0.42].forEach((x,i)=>{ const st = rbox(0.27,1.35 + (i%2)*0.3 - Math.abs(x)*.3,0.3,.5,hairM); st.position.set(x,-0.95 - (i%2)*0.15,-0.38); st.rotation.z = -x*0.12; head.add(st); });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.15,0.85,0.66,.45,hairM),s*0.53,0.08,0.0));
        const side = rbox(0.3,1.75,0.74,.5,hairM); side.position.set(s*0.55,-0.6,0.0); side.rotation.z = s*0.05; head.add(side);
        const flick = rbox(0.24,0.5,0.5,.5,hairM); flick.position.set(s*0.68,-1.52,0.02); flick.rotation.z = s*0.55; head.add(flick);
      });
      head.add(at(rbox(1.02,0.26,0.14,.45,hairM),0,0.4,0.47)); [-0.3,0.02,0.3].forEach((x,i)=>{ const f = rbox(0.26,0.22,0.12,.5,hairM); f.position.set(x,0.24,0.48); f.rotation.z = (i-1)*0.1; head.add(f); });
    },
  }, parent);
  c.root.scale.set(0.93,0.9,0.93);                                               // a bit shorter
  // long lace sleeves (swap the bare-arm parts to lace) + scrunchie cuffs
  [c.R, c.Lf].forEach(a=>{
    a.sh.children[1].material = laceM; a.el.children[0].material = laceM;
    const cuffM = L({color:0xf1eadc});
    for (let i=0;i<8;i++){ const b = new THREE.Mesh(new THREE.SphereGeometry(0.075,6,4), cuffM); const an = i/8*Math.PI*2; b.position.set(Math.cos(an)*0.17,-0.98,Math.sin(an)*0.17); a.el.add(b); }
  });
  const sk = serSkirt(c.hips);
  c.skirt = sk.g;
  c.setSkirt = (a, b)=>{ sk.mA.color.setHex(a); sk.mB.color.setHex(b); };
  const wine = serWineGlass(); c.R.hd.add(wine);
  const beer = serBeerMesh(1); beer.position.set(0,-0.3,0.12); c.R.hd.add(beer);
  const phone = serPhoneMesh(1); phone.position.set(0,-0.38,0.14); c.R.hd.add(phone);
  const bottle = serBottle(false); c.R.hd.add(bottle);
  const champ = serBottle(true); c.R.hd.add(champ);
  const gavel = serGavel(); c.R.hd.add(gavel);
  c.props = {wine, beer, phone, bottle, champ, gavel};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = serFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = serFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- ultimate: "Hey Siri" — a giant phone locks onto the nearest foe and slams down ---------- */
function serFinal(f, opp){
  const tgt = nearestFoe(f) || opp;
  f.finalT = 4.0; banner('嘿 Siri！幫我找最近的人！'); SFX.siri(); pop('嘿 Siri～！！', f.x, f.y+7.5, 'big');
  const mesh = new THREE.Group();
  mesh.add(rbox(5.2,9.6,0.7,.4,serDarkM));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.6,8.9), new THREE.MeshBasicMaterial({map:serSiriTex, fog:false})); scr.position.z = 0.37; mesh.add(scr);
  mesh.scale.setScalar(.01); scene.add(mesh);
  const ret = new THREE.Group();
  const rm = new THREE.MeshBasicMaterial({color:0xff3a5a, transparent:true, opacity:.85, side:THREE.DoubleSide, depthWrite:false, fog:false});
  ret.add(new THREE.Mesh(new THREE.RingGeometry(2.2,2.55,24), rm));
  [0,1,2,3].forEach(i=>{ const b = new THREE.Mesh(new THREE.PlaneGeometry(0.25,1.2), rm); b.rotation.z = i*Math.PI/2; b.position.set(Math.sin(i*Math.PI/2)*2.9, Math.cos(i*Math.PI/2)*2.9, 0); ret.add(b); });
  scene.add(ret);
  G.finals.push({owner:f, target:tgt, t:0, mesh, ret, x:tgt.x, y:11.5, landY:4.9, hit:new Set(), landed:false, update(F, dt){
    const T = F.target;
    // 0~0.7s: follow the target · 0.7~2.7s: position locked, warning only (time to escape) · 2.7s+: slam down
    const LOCK = .7, DROP = 2.7;
    if (F.t < LOCK){
      if (T.state!=='dead'){ F.x += (T.x - F.x)*(1 - Math.exp(-dt*8)); F.gy = Math.max(0, T.y); F.landY = Math.max(4.9, T.y + 4.9); }
      F.y = (F.gy || 0) + 11.5 + Math.sin(F.t*6)*.4;
      F.mesh.scale.setScalar(Math.min(1, F.t*3)); F.mesh.rotation.z = Math.sin(F.t*9)*.08;
      F.ret.visible = true; F.ret.position.set(F.x, (F.gy || 0) + 3, 1.2); F.ret.rotation.z += dt*4; F.ret.scale.setScalar(1.4 - Math.min(.4, F.t*.6));
    } else if (F.t < DROP){
      if (!F.locked){ F.locked = true; pop('鎖定：' + (T.D ? T.D.name : '？') + '！快逃！', F.x, F.y - 6, 'red'); SFX.siri(); }
      const left = DROP - F.t;
      F.y = (F.gy || 0) + 11.5 + Math.sin(F.t*30)*.15*(1 - left);            // shakes harder right before the drop
      F.mesh.scale.setScalar(1); F.mesh.rotation.z = Math.sin(F.t*24)*.05;
      F.ret.position.set(F.x, (F.gy || 0) + 3, 1.2); F.ret.scale.setScalar(1);
      F.ret.visible = Math.floor(F.t*(left < .4 ? 16 : 6))%2===0;           // blinks faster when it's about to fall
    } else if (!F.landed){
      F.y -= dt*48; F.mesh.rotation.z *= .8; F.ret.visible = Math.floor(F.t*20)%2===0;
      if (F.y <= F.landY){ F.y = F.landY; F.landed = true; F.landT = F.t; SFX.boom(); SFX.siri(); G.shake = reduce ? .2 : 1.4; G.flash = .3; burst(F.x, F.landY - 4.6, 0xffffff, 20, 12); pop('叮咚！找到你了！', F.x, F.landY + 6, 'big'); }
    } else {
      F.ret.visible = false;
      if (F.t - F.landT > .45){ F.y += dt*16; F.mesh.scale.setScalar(Math.max(.01, F.mesh.scale.x - dt*1.2)); }
    }
    F.mesh.position.set(F.x, F.y, 0);
    // anything under the falling phone gets smacked — every fighter, not just the target
    if (F.t >= DROP && (!F.landed || F.t - F.landT < .15)){
      for (const v of G.fighters){
        if (v===F.owner || F.hit.has(v) || !v.hittable()) continue;
        if (Math.abs(v.x - F.x) < 3.4 && v.y + 5.3 > F.y - 4.8 && v.y < F.y + 4.8){
          F.hit.add(v); v.pct += 22; launch(v, 36 + v.pct*.12, 70, Math.sign(v.x - F.x) || F.owner.face);
          SFX.hit(40); spark(v.x, v.y+3, 4); pop('手機砸臉！', v.x, v.y+8.5, 'big');
        }
      }
    }
    return F.t > 4.0;
  }, dispose(F){ scene.remove(F.mesh); scene.remove(F.ret); }});
}

/* ---------- results ---------- */
// win: raise the red wine, down it in one go, then a selfie that pops up as a polaroid
function serWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const pol = new THREE.Group();
  pol.add(rbox(3.4,4.1,0.12,.08,L({color:0xfbfaf6})));
  const pt = new THREE.CanvasTexture(portraitCanvas('serene', W.m.skin||0)); pt.magFilter = pt.minFilter = THREE.NearestFilter; pt.generateMipmaps = false;
  const ph = new THREE.Mesh(new THREE.PlaneGeometry(3,3), new THREE.MeshBasicMaterial({map:pt, fog:false})); ph.position.set(0,0.35,0.07); pol.add(ph);
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(3,0.6), new THREE.MeshBasicMaterial({map:tex(96,20,(g)=>{ g.fillStyle='#fbfaf6'; g.fillRect(0,0,96,20); g.fillStyle='#5a3a8a'; g.font='900 13px sans-serif'; g.textAlign='center'; g.fillText('#乾杯女王 🍷', 48, 15); }), fog:false}));
  cap.position.set(0,-1.6,0.07); pol.add(cap);
  pol.position.set(wp.x + 4.4, RS_Y + 7.2, -1); pol.rotation.z = -0.12; pol.scale.setScalar(.001); scene.add(pol); R.items.push(pol); R.pol = pol;
}
function serWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props;
  for (const n in P_) P_[n].visible = false;
  if (R.t < 1.3){
    applyPose(m, POSE.toast, k); P_.wine.visible = true; m.setFace('normal');
    once('sw0', .25, ()=>{ SFX.clink(); popAt('乾杯～！！', W, 8.5, 'big'); });
  } else if (R.t < 2.6){
    applyPose(m, POSE.drink, k); P_.wine.visible = true; m.setFace('drunk');
    P_.wine.wine.scale.y = Math.max(.01, 1 - (R.t - 1.3)/1.1);
    once('sw1', 1.45, ()=>{ SFX.fizz(); popAt('咕嚕咕嚕……', W, 8.5); });
    once('sw2', 2.4, ()=>{ SFX2.cheer(); popAt('一飲而盡！', W, 9, 'big'); });
  } else if (R.t < 4.1){
    applyPose(m, POSE.selfie, k); P_.phone.visible = true; m.setFace('wink');
    once('sw3', 3.2, ()=>{ SFX.cork(); popAt('喀嚓！📸', W, 9, 'big'); const p = m.holder.position; burst(p.x + .8, p.y + 6.5, 0xffffff, 16, 9); });
  } else {
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.peace, k); P_.wine.visible = R.t < 4.6 ? false : Math.sin(R.t*9) > 0; m.setFace('shout');
    once('sw4', 4.3, ()=>{ SFX.yell(); popAt('下一攤揪起來！🍻', W, 9.5, 'big'); });
  }
  if (R.t > 3.3){ const u = Math.min(1, (R.t - 3.3)/.35); R.pol.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.25))); R.pol.position.y = RS_Y + 7.2 + Math.sin(R.t*2)*.15; }
}
// lose: drinks herself to sleep, then a convenience-store clerk returns her forgotten phone
const serClerkShirt = tex(32,32,(g)=>{ speckle(g,32,32,'#f4f4f0',['#ecece6','#fafaf6'],.3); g.fillStyle='#f07a28'; g.fillRect(0,10,32,4); g.fillStyle='#1f8a4c'; g.fillRect(0,14,32,4); g.fillStyle='#d8322a'; g.fillRect(0,18,32,4); });
const serClerkFace = tex(64,64,(g)=>{
  speckle(g,64,64,'#d9aa86',['#cf9f7c','#e2b592'],.35); shadeFace(g);
  g.fillStyle='#151110'; g.fillRect(0,0,64,18); g.fillStyle='#1d1512'; g.fillRect(14,25,11,2); g.fillRect(39,25,11,2);
  g.strokeStyle='#1d1310'; g.lineWidth=2; g.beginPath(); g.arc(20,37,5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,37,5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  g.fillStyle='#4a1715'; g.beginPath(); g.moveTo(24,48); g.quadraticCurveTo(32,56,40,48); g.closePath(); g.fill();
});
function serBuildClerk(){
  const holder = new THREE.Group(), body = new THREE.Group(); body.scale.setScalar(SC); holder.add(body);
  const shirtM = L({map:serClerkShirt}), skinM = L({color:0xd9aa86}), hairM = L({map:blackHairTex}), capM = L({color:0x1f8a4c});
  const c = buildChar({
    skinM, faceM:L({map:serClerkFace}), headW:1.0, headH:1.15,
    torsoMat:shirtM, sleeveMat:()=>shirtM, sleeve:[0.64,0.85],
    pantsM:L({color:0x2a2a30}), shoeM, soleM:greySole,
    collar(chest){},
    hair(head){ head.add(at(rbox(1.12,0.5,1.12,.62,hairM),0,0.47,-0.02)); head.add(at(rbox(1.16,0.3,1.16,.4,capM),0,0.66,0)); head.add(at(rbox(0.9,0.08,0.5,.2,capM),0,0.55,0.7)); },
  }, body);
  const phone = serPhoneMesh(1); phone.position.set(0,-0.38,0.14); c.R.hd.add(phone);
  c.holder = holder; return c;
}
function serLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  R.serLp = {x:lp.x, z:lp.z, ry:Lz.m.holder.rotation.y};
  const ck = serBuildClerk(); ck.holder.position.set(lp.x + 12, RS_Y, lp.z + 1); ck.holder.rotation.y = -Math.PI/2 + 0.4; scene.add(ck.holder); R.items.push(ck.holder);
  applyPose(ck, POSE.stand, 1); R.clerk = ck; R.clerkPh = 0;
}
function serLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, hp = m.holder.position, s0 = R.serLp, ck = R.clerk;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 1.4){
    applyPose(m, POSE.tipsy, k); m.props.beer.visible = true; m.setFace('drunk');
    m.holder.rotation.z = Math.sin(R.t*3.5)*.14;
    once('sl0', .2, ()=>popAt('我…我還可以喝……', Lz, 7.5, 'blue'));
    once('sl1', .9, ()=>{ SFX.hic(); popAt('嗝！', Lz, 8); burst(hp.x, hp.y + 6, 0xfff6d0, 4, 2); });
  } else {
    const u = Math.min(1, (R.t - 1.4)/.45);
    m.holder.rotation.z = 1.5*u*u; hp.y = RS_Y + .5*u;
    applyPose(m, POSE.faint, k); m.setFace('drunk');
    once('sl2', 1.85, ()=>{ SFX.soft(); G.shake = reduce ? .1 : .4; burst(hp.x - 2, RS_Y + .5, 0xd8d0c0, 10, 5); });
    once('sz1', 2.1, ()=>pop('Zzz…', hp.x - 3, RS_Y + 3, 'blue'));
    once('sz2', 3.0, ()=>pop('Zzz…', hp.x - 3.4, RS_Y + 3.4, 'blue'));
  }
  // the clerk walks in with the phone
  if (R.t > 2.2){
    const cp = ck.holder.position, stop = s0.x + 2.6;
    if (cp.x > stop){ cp.x = Math.max(stop, cp.x - 7*dt); R.clerkPh += dt*9; applyPose(ck, runPose(R.clerkPh), k); }
    else applyPose(ck, POSE.handOver, k);
    once('ck1', 3.6, ()=>pop('彈弓大賽志工的手機……', cp.x, RS_Y + 8.4));
    once('ck2', 4.5, ()=>pop('忘在思樂冰機器上面了！', cp.x, RS_Y + 8.4, 'big'));
    once('ck3', 5.2, ()=>{ SFX.siri(); pop('（嘿 Siri：我在這裡～）', cp.x - 1, RS_Y + 5.5, 'blue'); });
    once('ck4', 5.5, ()=>pop('……嗝。謝謝。', hp.x - 2.5, RS_Y + 3, 'blue'));
  }
}

registerChar('serene', {
  stats: { name:'睿睿', en:'Serene', tag:'酒國女神・政治系・揪團王', weight:0.85, run:16, air:12.5, jumpV:33, djV:29, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.08,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'乾杯！', dash:5, sfx:'clink'},
    side:{t:[.24,.1,.32], pose:['batWind','batHit'], box:[2.9,3.4,1.7], dmg:15, kb:12, sc:1.1, ang:36, prop:'bottle', text:'紅酒瓶！', sfx:'swing'},
    up:{t:[.16,.12,.28], pose:['upWind','upHit'], box:[0.5,7.0,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'beer', text:'開罐噴泉！', sfx:'fizz', fire:[[.18,'serFoam']]},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:12, kb:9, sc:.85, ang:70, prop:'gavel', text:'肅靜！', sfx:'gavel'},
    nair:{t:[.06,.22,.15], pose:['twirl','twirl'], box:[0,3,2.3], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['batWind','batHit'], box:[2.5,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'bottle', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.6,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'beer', sfx:'fizz'},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'gavel', sfx:'gavel'},
    nB:{t:[.2,.05,.3], pose:['shoutWind','shout'], fire:[[.2,'serShout']], air:1, sfx:'yell'},
    sB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], prop0:'beer', fire:[[.2,'serBeer']], air:1, sfx:'swing'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, prop:'champ', start:'serChamp', box:[0.4,5.2,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.15,.2,.45], pose:['cheer','toast'], poseSwitch:.4, prop:'beer', box:[0,3.8,4.4], dmg:3, kb:2, sc:.1, ang:50, onHit:'serPull', air:1, text:'揪起來！喝一杯！', sfx:'yell',
        box2:{at:.5, dur:.12, box:[1.6,3.8,2.2], dmg:9, kb:10, sc:.8, ang:40}},
  },
  fire: {
    serFoam(f){ burst(f.x, f.y+7, 0xfff6d0, 12, 8); burst(f.x, f.y+6, 0xf2c14e, 5, 5); },
    serShout(f){ const s = new THREE.Sprite(new THREE.SpriteMaterial({map:serShoutTex, transparent:true, alphaTest:.3, fog:false})); s.scale.set(3.6,1.8,1); proj({owner:f, x:f.x+f.face*1.8, y:f.y+4.6, vx:f.face*20, vy:0, g:0, wave:.3, r:1.3, life:.8, dmg:8, kb:9, sc:.6, ang:35, mesh:s}); },
    serBeer(f){ serPud_watch(proj({owner:f, x:f.x+f.face*1.3, y:f.y+4.4, vx:f.face*16, vy:12, g:30, r:.9, life:2, bounce:1, dmg:7, kb:6, sc:.5, ang:45, onHit:'serTipsy', mesh:serBeerMesh(1.6), spin:1}), f); pop('請你喝！', f.x, f.y+7); },
  },
  start: {
    serChamp(f){ f.vy = 35; f.vx = f.face*5; f.onGround = false; f.jumps = 0; f.ff = false; pop('砰！開香檳！', f.x, f.y+7); burst(f.x, f.y+1, 0xfff6d0, 14, 10); burst(f.x, f.y+1, 0xf2c14e, 6, 7); SFX.cork(); },
  },
  onhit: {
    serTipsy(a, v){ v.slowT = 1.6; pop('喝茫了～', v.x, v.y+7.5, 'blue'); },
    serPull(a, v){ if (!a) return; v.vx = (Math.sign(a.x - v.x) || 1)*16; v.vy = 4; v.state = 'stun'; v.stunT = .35; v.move = null; pop('被揪了！', v.x, v.y+7.5); },
  },
  poses: {
    twirl: S_({rSh:[0,0,-1.5], lSh:[0,0,1.5], rEl:[-0.15], lEl:[-0.15], rHp:[0,0,-0.12], lHp:[0,0,0.12], rKn:[0.1], lKn:[0.1], head:[-0.1], drop:-0.05}),
    toast: P({rSh:[-2.5,0,-0.25], rEl:[-0.5], lSh:[-0.3,0,0.25], lEl:[-1.5], head:[-0.15], chest:[-0.05]}),
    drink: P({rSh:[-2.2,0,0.45], rEl:[-1.9], lSh:[-0.2,0,0.3], lEl:[-0.4], head:[-0.6], chest:[-0.25], drop:-0.05}),
    tipsy: S_({rSh:[-1.6,0,-0.25], rEl:[-1.5], lSh:[0.2,0,0.6], lEl:[-0.4], head:[0.25,0,0.4], chest:[0.1,0,-0.2], rHp:[-0.1,0,-0.2], lHp:[0.1,0,0.2], drop:-0.2}),
    faint: P({rSh:[0,0,-1.3], lSh:[0,0,1.2], rEl:[-0.2], lEl:[-0.3], head:[0.2,0,0.3], rHp:[-0.1], lHp:[0.15], rKn:[0.3], lKn:[0.1], drop:0}),
    shout: S_({rSh:[-1.1,0,-0.7], lSh:[-1.1,0,0.7], rEl:[-0.9], lEl:[-0.9], chest:[-0.3], head:[-0.25], drop:-0.1}),
    shoutWind: S_({rSh:[-0.3,0,-0.3], lSh:[-0.3,0,0.3], rEl:[-1.8], lEl:[-1.8], chest:[0.3], head:[0.2]}),
    phoneCall: P({rSh:[-2.7,0,-0.3], rEl:[-0.3], lSh:[-0.4,0,0.6], lEl:[-1.2], head:[-0.35], chest:[-0.15]}),
    handOver: P({rSh:[-1.45,0,-0.1], rEl:[-0.3], lSh:[0,0,0.1], lEl:[-0.2], chest:[0.15], head:[0.1]}),
  },
  sfx: {
    clink(){ tone(2200,.18,'sine',.08); tone(3300,.14,'sine',.05,1,.02); },
    fizz(){ noise(.5,.2,5000); noise(.3,.12,2500,.1); },
    gavel(){ noise(.08,.35,500); tone(180,.12,'square',.14,.6); noise(.08,.3,500,.16); tone(180,.12,'square',.12,.6,.16); },
    yell(){ tone(520,.28,'sawtooth',.12,1.4); tone(780,.22,'square',.06,1.3,.05); },
    siri(){ tone(660,.12,'sine',.1); tone(990,.14,'sine',.1,1,.12); tone(1320,.2,'sine',.08,1,.24); },
    cork(){ noise(.06,.4,1600); tone(900,.12,'sine',.1,2.2); },
    hic(){ tone(420,.08,'square',.1,1.8); },
  },
  build: buildSerene, face: serFaces.normal, portraitBg: '#c9b8f0',
  portrait(g){
    g.fillStyle = SER_HAIR; g.fillRect(4,4,56,14); g.fillRect(1,10,9,54); g.fillRect(54,10,9,54);
    for (let i=0;i<7;i++){ g.beginPath(); g.moveTo(8+i*7,16); g.lineTo(16+i*7,16); g.lineTo(11+i*7,23+(i%2)*3); g.closePath(); g.fill(); }
    g.fillStyle = '#f3efe8'; g.fillRect(18,60,28,4);
  },
  skins: [
    { name:'淺藍沐浴球', apply(c){ c.setSkirt(0x93bdf0, 0xbcd6fa); },
      portrait(g){                                                                  // 淺藍色的蓬蓬裙
        g.fillStyle = '#93bdf0'; g.fillRect(0,54,64,10);
        g.fillStyle = '#bcd6fa'; for (let x=0;x<64;x+=8){ g.beginPath(); g.arc(x+4,56,5,0,7); g.fill(); }
        g.fillStyle = 'rgba(255,255,255,.45)'; for (let x=2;x<64;x+=8) g.fillRect(x,60,3,1);
      } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#b9a7f0','#ffffff',0xffd166); h.position.set(0.05,0.7,-0.02); c.head.add(h); } },
  ],
  // shield: spin and block with the pouf skirt — spinning too long makes her dizzy
  shield(){
    const g = new THREE.Group();
    const m1 = new THREE.MeshBasicMaterial({color:0xd8ccff, transparent:true, opacity:.28, depthWrite:false});
    const m2 = new THREE.MeshBasicMaterial({color:0xf0eaff, transparent:true, opacity:.45, depthWrite:false});
    g.add(new THREE.Mesh(new THREE.SphereGeometry(3.1,12,8), m1));
    for (let i=0;i<3;i++){ const t = new THREE.Mesh(new THREE.TorusGeometry(2.6 - i*.4,0.35,5,16), m2); t.rotation.x = Math.PI/2; t.position.y = -0.6 + i*.6; g.add(t); }
    return g;
  },
  shieldAnim(f){ f.shieldMesh.position.set(f.x, f.y+2.6, 0); f.shieldMesh.rotation.y += .35; },
  shieldPose: 'twirl', shieldProp: null, breakText: '裙子轉壞了！', brokePose: 'dizzy',
  finalPose: 'phoneCall', finalProp: 'phone',
  animate(f, m, s, t, dt){
    if (s==='shield'){
      f.serSpin = (f.serSpin || 0) + dt;
      m.body.rotation.y += dt*16; m.skirt.scale.set(1.18,0.9,1.18);
      if (f.serSpin > 1.4){ f.state = 'stun'; f.stunT = .9; f.move = null; f.serSpin = 0; f.serDizzy = .9; pop('轉太久…好暈～', f.x, f.y+7.5, 'blue'); SFX.hic(); }
    } else {
      f.serSpin = Math.max(0, (f.serSpin || 0) - dt*1.5);
      let r = m.body.rotation.y; r = Math.atan2(Math.sin(r), Math.cos(r)); m.body.rotation.y = r*Math.exp(-dt*18);
      m.skirt.scale.x += (1 - m.skirt.scale.x)*.2; m.skirt.scale.z = m.skirt.scale.x; m.skirt.scale.y += (1 - m.skirt.scale.y)*.2;
    }
    f.serDizzy = (f.serDizzy || 0) - dt;
    if (s==='stun' && f.serDizzy > 0){ m.setFace('dizzy'); if (Math.random() < dt*8) burst(f.x, f.y+6.5, 0xfff3a0, 1, 2); }
    else if (s==='final' || (s==='move' && f.move && f.move.fire && f.move.fire[0][1]==='serShout')) m.setFace('shout');
    else if (f.slowT > 0) m.setFace('drunk');
  },
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.toast : POSE.cheer, selectSfx: ()=>SFX.clink(),
  winSub: '"Cheers! 下一攤！"',
  final: serFinal, winSetup: serWinSetup, winUpdate: serWinUpdate, loseSetup: serLoseSetup, loseUpdate: serLoseUpdate,
  longWin: true, longLose: true,
});
