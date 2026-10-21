/* 女王 Queen Janice — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';

/* ---------- textures ---------- */
const JN_SKIN = '#f2d3ba', JN_SKIN_C = ['#eac8ad','#f8dcc6','#edcdb2'];
const JN_HAIR = '#3b2419', JN_TIP = '#8d6340';
const jnSkinTex = tex(16,16,(g)=>speckle(g,16,16,JN_SKIN,JN_SKIN_C,.38));
function jnHairDraw(g, tip){
  const base = tip ? JN_TIP : JN_HAIR;
  speckle(g,32,32,base, tip ? ['#9c7049','#7c5436','#a87c52'] : ['#452b1e','#2e1a12','#4e3224'], .45);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(20,10,6,.18)' : 'rgba(200,160,120,.14)'; g.fillRect(x + ((x*5)%3) - 1, 0, 1, 32); }
  if (!tip){ const gr = g.createLinearGradient(0,0,0,32); gr.addColorStop(0,'rgba(18,10,6,.9)'); gr.addColorStop(.6,'rgba(30,18,12,.4)'); gr.addColorStop(1,'rgba(140,99,64,.35)'); g.fillStyle = gr; g.fillRect(0,0,32,32); }
}
const jnHairTex = tex(32,32,(g)=>jnHairDraw(g,false)), jnTipTex = tex(32,32,(g)=>jnHairDraw(g,true));

function jnFace(g, mode){
  speckle(g,64,64,JN_SKIN,JN_SKIN_C,.28); shadeFace(g);
  // brows — straight and a little arched = resting cool face
  g.fillStyle = '#2b1a12';
  g.fillRect(14,26,11,2); g.fillRect(39,26,11,2);
  if (mode==='smug'){ g.fillRect(14,24,11,2); }
  g.strokeStyle = '#140c08'; g.lineWidth = 1.8;
  const liner = (x, s)=>{ g.beginPath(); g.moveTo(x-6,35.5); g.quadraticCurveTo(x,32,x+6,35.5); g.lineTo(x+6+s*3,32.5); g.stroke(); };
  const open = (x, s, half)=>{
    g.fillStyle='#fbf6f1'; g.beginPath(); g.ellipse(x,37,5,half?2.6:3.8,0,0,7); g.fill();
    g.fillStyle='#231510'; g.beginPath(); g.ellipse(x,37.4,3.1,half?2.4:3.2,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35.6,1,1);
    liner(x,s);
  };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.6,Math.PI*.15,Math.PI*.85); g.stroke(); };
  const closedUp = (x)=>{ g.beginPath(); g.arc(x,39,4.6,Math.PI*1.15,Math.PI*1.85); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='shout'){ open(20,-1); open(44,1); }
  else if (mode==='smug'){ open(20,-1,true); closedUp(44); }
  else { open(20,-1,true); open(44,1,true); }                 // default: half-lidded, unimpressed
  // nose
  g.fillStyle = 'rgba(165,105,80,.3)'; g.fillRect(30,41,4,4);
  // mouth — small, one corner up
  g.fillStyle = '#a63a46';
  if (mode==='shout'){ g.beginPath(); g.ellipse(32,50,6,5,0,0,7); g.fill(); g.fillStyle='#5c1d22'; g.beginPath(); g.ellipse(32,51,4,3.2,0,0,7); g.fill(); }
  else if (mode==='cry'){ g.beginPath(); g.arc(32,54,6,Math.PI*1.1,Math.PI*1.9); g.lineWidth=2.4; g.strokeStyle='#a63a46'; g.stroke(); }
  else { g.beginPath(); g.moveTo(26,50); g.quadraticCurveTo(32,52.4,38,48.4); g.lineWidth=2.4; g.strokeStyle='#a63a46'; g.stroke(); }
}
const jnFaces = { normal:tex(64,64,(g)=>jnFace(g,'normal')), cry:tex(64,64,(g)=>jnFace(g,'cry')), smug:tex(64,64,(g)=>jnFace(g,'smug')), shout:tex(64,64,(g)=>jnFace(g,'shout')), dizzy:tex(64,64,(g)=>jnFace(g,'dizzy')) };

// brown track jacket, cream stripe down the sleeve, black tee + green lanyard on the front
const JN_BROWN = '#4b352a';
function jnTrack(g, w, h, stripe){
  speckle(g,w,h,JN_BROWN,['#553c2f','#412d23','#5c4234'],.4);
  if (stripe){ g.fillStyle='#efe6d4'; g.fillRect(w*0.12,0,w*0.1,h); g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(w*0.22,0,2,h); }
}
const jnJackSide = tex(32,32,(g)=>jnTrack(g,32,32,true));
const jnJackPlain = tex(32,32,(g)=>jnTrack(g,32,32,false));
const jnJackFront = tex(32,32,(g)=>{
  jnTrack(g,32,32,false);
  g.fillStyle='#1b1b1e'; g.beginPath(); g.moveTo(10,0); g.lineTo(22,0); g.lineTo(19,13); g.lineTo(13,13); g.closePath(); g.fill();   // black tee at the neckline
  g.fillStyle='#2a1d16'; g.fillRect(15,0,2,32);                                                   // zip line
  g.fillStyle='#cfc4ae'; for (let y=2;y<32;y+=3) g.fillRect(15,y,2,1);                            // zip teeth
  g.fillStyle='#2f9e52'; g.fillRect(12,2,2,16); g.fillRect(18,2,2,16);                            // lanyard
  g.fillStyle='#e9e6df'; g.fillRect(12,18,8,8); g.fillStyle='#8fb6d8'; g.fillRect(13,19,6,4);     // ID card
});
// second photo: white waffle-knit henley
const jnWhiteTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#f3f0e9',['#fbf8f2','#e6e2d8'],.35);
  g.strokeStyle='rgba(190,185,172,.55)'; g.lineWidth=1;
  for (let x=2;x<32;x+=4){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,32); g.stroke(); }
  for (let y=2;y<32;y+=4){ g.beginPath(); g.moveTo(0,y); g.lineTo(32,y); g.stroke(); }
});
const jnWhiteFront = tex(32,32,(g)=>{
  speckle(g,32,32,'#f3f0e9',['#fbf8f2','#e6e2d8'],.35);
  g.strokeStyle='rgba(190,185,172,.55)'; g.lineWidth=1;
  for (let x=2;x<32;x+=4){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,32); g.stroke(); }
  g.fillStyle='#e9e5db'; g.fillRect(13,0,6,16);                                   // henley placket
  g.fillStyle='#cfc8ba'; [3,8,13].forEach(y=>g.fillRect(15,y,2,2));               // buttons
  g.fillStyle='#2f9e52'; g.fillRect(12,2,2,15); g.fillRect(18,2,2,15);
});
const jnJeansTex = tex(32,32,(g)=>{ speckle(g,32,32,'#4a5a74',['#54657f','#41506a'],.45); g.fillStyle='rgba(230,235,245,.1)'; for (let y=0;y<32;y+=3) g.fillRect(0,y,32,1); });
// queen robe for the results costume
const jnRobeTex = tex(32,32,(g)=>{ speckle(g,32,32,'#6b2a6e',['#7d3480','#5a2159'],.4); g.fillStyle='#e3c04a'; g.fillRect(0,28,32,4); });
const jnRobeFront = tex(32,32,(g)=>{
  speckle(g,32,32,'#6b2a6e',['#7d3480','#5a2159'],.4);
  g.fillStyle='#f4efe4'; g.fillRect(13,0,6,32); g.fillStyle='#b8b2a4'; for (let i=0;i<7;i++) g.fillRect(14+(i%2)*3,2+i*4,2,2);        // ermine panel
  g.fillStyle='#e3c04a'; g.fillRect(11,0,2,32); g.fillRect(19,0,2,32);
});
// mahjong tile faces
const jnTileTex = tex(32,40,(g)=>{
  g.fillStyle='#f6f2e4'; g.fillRect(0,0,32,40); g.fillStyle='#d8d2bd'; g.fillRect(0,34,32,6);
  g.strokeStyle='#bdb7a2'; g.lineWidth=2; g.strokeRect(1,1,30,38);
  g.fillStyle='#1f7a3a'; g.font='bold 20px sans-serif'; g.textAlign='center'; g.fillText('發',16,27);
});
const jnTileBack = tex(32,40,(g)=>{ speckle(g,32,40,'#2f7f5c',['#368a66','#276b4e'],.4); });
const jnOfferTexs = ['OFFER','年薪↑','歡迎加入','國企女王'].map(t=>tex(64,44,(g)=>{
  g.fillStyle='#fdfaf2'; g.fillRect(0,0,64,44); g.fillStyle='#c0a040'; g.fillRect(0,0,64,8);
  g.fillStyle='#2a2a30'; g.font='bold 11px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,32,24);
  g.fillStyle='#b8b2a4'; g.fillRect(8,34,48,1); g.fillRect(8,38,32,1);
}));
// 月台上方的橘色方向看板（南勢角 / 迴龍）
const jnSignTexs = [['南勢角','Nanshijiao'],['迴龍','Huilong']].map(([t,en])=>tex(160,64,(g)=>{
  g.fillStyle='#f0a01c'; g.fillRect(0,0,160,64);
  g.fillStyle='rgba(255,230,160,.5)'; g.beginPath(); g.ellipse(120,18,34,16,0,0,7); g.fill();     // 燈的反光
  g.strokeStyle='#1b1b1b'; g.lineWidth=3; g.beginPath(); g.moveTo(26,12); g.lineTo(96,12); g.quadraticCurveTo(104,12,104,20); g.lineTo(104,44); g.quadraticCurveTo(104,52,96,52); g.lineTo(26,52); g.quadraticCurveTo(18,52,18,44); g.lineTo(18,20); g.quadraticCurveTo(18,12,26,12); g.stroke();
  g.fillStyle='#1b1b1b'; g.font='bold 24px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,61,28);
  g.font='11px sans-serif'; g.fillText(en,61,45);
  g.beginPath(); g.moveTo(116,32); g.lineTo(138,32); g.lineTo(138,24); g.lineTo(152,33); g.lineTo(138,42); g.lineTo(138,34); g.closePath(); g.fill();
}));
// 牆上的站名牌：蘆洲 LUZHOU 一月台
const jnStationTex = tex(160,64,(g)=>{
  g.fillStyle='#f2efe6'; g.fillRect(0,0,160,64);
  g.strokeStyle='#2a2a30'; g.lineWidth=2; g.strokeRect(6,16,18,18);
  g.fillStyle='#2a2a30'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('O54',15,25);
  g.font='bold 26px sans-serif'; g.textAlign='left'; g.fillText('蘆洲',30,26);
  g.font='11px sans-serif'; g.fillText('LUZHOU',30,45);
  g.fillText('（蘆洲李宅）',84,24); g.fillText('一月台  Platform 1',84,44);
});
// 列車車身：藍帶、車窗、南勢角 LED
const jnTrainTex = tex(128,64,(g)=>{
  g.fillStyle='#eceae2'; g.fillRect(0,0,128,64);
  g.fillStyle='#d9d6cc'; g.fillRect(0,0,128,6); g.fillRect(0,58,128,6);
  g.fillStyle='#1c2a4a'; g.fillRect(4,12,54,24); g.fillRect(68,12,56,24);                        // 車窗
  g.fillStyle='#3b5a86'; g.fillRect(6,14,50,8); g.fillRect(70,14,52,8);
  g.fillStyle='#17347e'; g.fillRect(0,42,128,10);                                                 // 藍帶
  g.fillStyle='#b6b2a8'; g.fillRect(60,6,8,52);                                                   // 車門縫
  g.fillStyle='#1a1a1a'; g.fillRect(74,16,40,10); g.fillStyle='#ff5a32'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('南勢角',94,21);
});
const jnTrainHeadTex = tex(64,64,(g)=>{
  g.fillStyle='#eceae2'; g.fillRect(0,0,64,64);
  g.fillStyle='#1c2a4a'; g.fillRect(8,14,48,22); g.fillStyle='#17347e'; g.fillRect(0,42,64,10);
  g.fillStyle='#fff3c0'; g.fillRect(6,54,10,5); g.fillRect(48,54,10,5);                            // 頭燈
});
// 月台門（玻璃＋把手）
const jnPsdTex = tex(64,64,(g)=>{
  g.fillStyle='#e9e6dd'; g.fillRect(0,0,64,64);
  g.fillStyle='#6f7a86'; g.fillRect(4,6,56,42);
  g.fillStyle='#2a2a30'; g.fillRect(2,4,60,3); g.fillRect(2,47,60,4); g.fillRect(2,60,60,4);
  g.fillStyle='#f4d33a'; g.fillRect(6,50,24,6); g.fillStyle='#2a2a30'; g.font='bold 5px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('小心月台',18,53);
});

/* ---------- parts ---------- */
const jnGoldM = new THREE.MeshLambertMaterial({color:0xe3c04a, emissive:0x3a2c08});
function jnCrown(s){
  const g = new THREE.Group(); s = s || 1;
  g.add(at(cyl(0.34,0.34,0.17,jnGoldM,12),0,0,0));
  for (let i=0;i<7;i++){ const a = i/7*Math.PI*2; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.09,0.3,5), jnGoldM); sp.position.set(Math.cos(a)*0.32,0.2,Math.sin(a)*0.32); g.add(sp);
    const jw = new THREE.Mesh(new THREE.SphereGeometry(0.055,6,5), L({color: i%2 ? 0xd4405a : 0x4a7fd0})); jw.position.set(Math.cos(a)*0.34,0.36,Math.sin(a)*0.34); g.add(jw); }
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6), L({color:0xd4405a})),0,0.04,0.34));
  g.scale.setScalar(s); return g;
}
function jnTileMesh(sc){
  const f = L({map:jnTileTex}), b = L({map:jnTileBack}), e = L({color:0xe6e0cd});
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.42,0.56,0.26), [f,f,e,e,f,b]);
  m.scale.setScalar(sc || 1); return m;
}
// the tile rack she swings like a bat
function jnRack(){
  const g = new THREE.Group();
  const bar = at(rbox(0.34,2.2,0.4,.3,L({color:0x8a6a44})),0,-1.1,0); g.add(bar);
  for (let i=0;i<5;i++){ const t = jnTileMesh(1.25); t.position.set(0,-0.42 - i*0.42,0.24); g.add(t); }
  return g;
}
// red-coat guard with a shield (used for the block and the final)
function jnGuard(){
  const g = new THREE.Group();
  const coat = L({color:0xb02a2f}), trouser = L({color:0x1b1b22}), skin = L({map:jnSkinTex}), fur = L({color:0x16140f});
  g.add(at(rbox(0.9,1.3,0.6,.3,coat),0,1.5,0));
  g.add(at(rbox(0.95,0.14,0.64,.3,jnGoldM),0,1.9,0));
  [-1,1].forEach(s=>{ g.add(at(rbox(0.26,1.1,0.28,.4,coat),s*0.56,1.5,0)); g.add(at(rbox(0.3,0.9,0.34,.35,trouser),s*0.26,0.45,0)); g.add(at(rbox(0.34,0.2,0.5,.3,L({color:0x101014})),s*0.26,0.08,0.08)); });
  g.add(at(rbox(0.46,0.5,0.46,.5,skin),0,2.35,0));
  g.add(at(cyl(0.3,0.26,0.95,fur,10),0,3.0,0));                                   // bearskin hat
  const sh = new THREE.Mesh(new THREE.BoxGeometry(1.05,1.5,0.12), L({color:0x2f4f9e}));
  sh.position.set(0,1.5,0.5); g.add(sh);
  sh.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.4,0.5,0.14), jnGoldM),0,0.1,0.02));
  return g;
}

/* ---------- model ---------- */
function buildJanice(parent){
  const hairM = L({map:jnHairTex}), tipM = L({map:jnTipTex}), faceM = L({map:jnFaces.normal}), skinM = L({map:jnSkinTex});
  const sideM = L({map:jnJackSide}), plainM = L({map:jnJackPlain}), frontM = L({map:jnJackFront});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.12,
    torsoMat:[plainM,plainM,plainM,plainM,frontM,plainM], sleeveMat:()=>sideM, sleeve:[0.66,0.9],
    pantsM:L({map:jnJeansTex}), shoeM, soleM:greySole,
    collar(chest){
      chest.add(at(cyl(0.3,0.32,0.26,L({color:0x1b1b1e}),10),0,2.3,0));            // black tee collar
      chest.add(at(rbox(1.62,0.1,0.95,.3,jnGoldM),0,2.18,0));                      // zip pull line
    },
    hair(head){
      // top + back volume
      head.add(at(rbox(1.14,0.56,1.14,.66,hairM),0,0.5,-0.02));
      head.add(at(rbox(1.14,1.3,0.46,.55,hairM),0,-0.1,-0.35));
      // long strands down the back, caramel at the ends
      [-0.44,-0.22,0,0.22,0.44].forEach((x,i)=>{
        const st = rbox(0.28,1.5 + (i%2)*0.3 - Math.abs(x)*.3,0.3,.5,hairM); st.position.set(x,-1.0 - (i%2)*0.15,-0.4); st.rotation.z = -x*0.12; head.add(st);
        const tp = rbox(0.28,0.7,0.3,.5,tipM); tp.position.set(x*1.04,-1.92 - (i%2)*0.15,-0.4); tp.rotation.z = -x*0.2; head.add(tp);
      });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.16,0.9,0.68,.45,hairM),s*0.53,0.1,0.02));
        const side = rbox(0.32,1.8,0.76,.5,hairM); side.position.set(s*0.56,-0.65,0.02); side.rotation.z = s*0.05; head.add(side);
        const wave = rbox(0.3,0.8,0.62,.5,tipM); wave.position.set(s*0.62,-1.78,0.02); wave.rotation.z = s*0.3; head.add(wave);
        const flick = rbox(0.24,0.52,0.5,.5,tipM); flick.position.set(s*0.76,-2.3,0.0); flick.rotation.z = s*0.6; head.add(flick);
      });
      // centre-parted curtain fringe, brow level
      [[-0.34,-0.16],[-0.12,-0.05],[0.12,-0.05],[0.34,-0.16]].forEach(([x,rz])=>{
        const f = rbox(0.3,0.58,0.2,.5,hairM); f.position.set(x,0.26,0.47); f.rotation.z = rz*2.2; head.add(f);
      });
      head.add(at(rbox(1.0,0.26,0.16,.45,hairM),0,0.44,0.46));
    },
    face(head){},
  }, parent);
  c.root.scale.set(0.95,1.02,0.95);                                                // tall and slim
  // long sleeves: swap the bare-arm parts to jacket cloth
  [c.R, c.Lf].forEach(a=>{ a.sh.children[1].material = sideM; a.el.children[0].material = plainM; });

  const rack = jnRack(); c.R.hd.add(rack);
  const tile = jnTileMesh(1.6); tile.position.y = -0.6; c.R.hd.add(tile);
  c.props = {rack, tile};

  // crown + robe, used by the shield and the results costume
  const crown = jnCrown(1.05); crown.position.set(0,0.78,-0.02); crown.visible = false; c.head.add(crown);
  const cape = new THREE.Mesh(new THREE.CylinderGeometry(0.75,1.5,2.6,14,1,true), new THREE.MeshLambertMaterial({color:0x7d1f2e, side:THREE.DoubleSide}));
  cape.position.set(0,1.0,-0.42); cape.visible = false; c.chest.add(cape);
  c.jnCrown = crown; c.jnCape = cape;
  c.setCrown = (on)=>{ crown.visible = !!on; };
  const JN_TOPS = {
    jacket:[jnJackPlain, jnJackFront, jnJackSide],
    white:[jnWhiteTex, jnWhiteFront, jnWhiteTex],
    queen:[jnRobeTex, jnRobeFront, jnRobeTex],
  };
  let topNow = 'jacket';
  c.setTop = (mode)=>{
    const t = JN_TOPS[mode] || JN_TOPS.jacket; topNow = JN_TOPS[mode] ? mode : 'jacket';
    plainM.map = t[0]; frontM.map = t[1]; sideM.map = t[2];
    plainM.needsUpdate = frontM.needsUpdate = sideM.needsUpdate = true;
  };
  c.baseTop = 'jacket';
  c.setQueen = (on)=>{ c.setTop(on ? 'queen' : c.baseTop); crown.visible = !!on; cape.visible = !!on; };
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = jnFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = jnFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- ultimate: 天胡・國企女王 ---------- */
const _jnV = new THREE.Vector3();
function jnFinal(f, opp){
  f.finalT = 1.4; banner('天胡・國企女王！'); SFX.boom(); pop('這局我自摸，你們出局', f.x, f.y+7.8, 'big');
  const g = new THREE.Group(); scene.add(g);
  // the mahjong table, flipped on its side and shoved forward
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.6,0.5,5.0), L({color:0x1d6b4c})); g.add(top);
  top.add(at(new THREE.Mesh(new THREE.BoxGeometry(5.9,0.3,5.3), L({color:0x7a5230})),0,-0.3,0));
  [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([a,b])=>{ const lg = at(cyl(0.22,0.22,2.2,L({color:0x7a5230}),8), a*2.3,-1.4,b*2.0); g.add(lg); });
  g.rotation.z = Math.PI/2*f.face*-1;
  const tiles = [];
  for (let i=0;i<16;i++){ const t = jnTileMesh(1.5); scene.add(t); tiles.push({m:t, vx:(Math.random()-.5)*8, vy:14 + Math.random()*14, rz:(Math.random()-.5)*12, x:f.x, y:f.y+4}); }
  G.finals.push({owner:f, target:opp, t:0, mesh:g, x:f.x + f.face*3, hit:new Set(), tiles, update(F, dt){
    F.x += f.face*21*dt;
    F.mesh.position.set(F.x, 4.2 + Math.sin(F.t*5)*0.5, 0);
    F.mesh.rotation.y += dt*4.5; F.mesh.rotation.z += dt*2.2*f.face;
    F.tiles.forEach(t=>{ t.vy -= 42*dt; t.x += t.vx*dt; t.y += t.vy*dt; t.m.position.set(t.x, t.y, .4); t.m.rotation.z += t.rz*dt; t.m.rotation.x += dt*5; });
    if (F.t < .6 && Math.random() < dt*20) spark(F.x + (Math.random()-.5)*5, 4 + Math.random()*4, 2);
    for (const v of G.fighters){
      if (v===f || F.hit.has(v) || !v.hittable()) continue;
      if (Math.abs(v.x - F.x) < 4.0 && v.y < 10){
        F.hit.add(v);
        applyHit(f, v, {dmg:26, kb:24, sc:1.1, ang:44}, f.face, v.x, v.y+3.5);
        SFX.crash(); burst(v.x, v.y+3.5, 0x1d6b4c, 18, 9); pop('推牌！', v.x, v.y+7, 'red');
      }
    }
    if (F.t > 1.5 && !F.offered){ F.offered = true; pop('offer 自己來', F.x, 9, 'big'); }
    return F.t > 2.2;
  }, dispose(F){ scene.remove(F.mesh); F.tiles.forEach(t=>scene.remove(t.m)); }});   // 自訂 dispose 時 core 不會幫忙移除 mesh，桌子要自己清
}

/* ---------- results: 胡牌掀桌 → 換上女王裝 → 一堆 offer ---------- */
function jnTableMesh(){
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(5.6,0.5,5.0), L({color:0x1d6b4c})); top.position.y = 0.25; g.add(top);
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(5.9,0.34,5.3), L({color:0x7a5230})),0,-0.08,0));
  [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([a,b])=>g.add(at(cyl(0.22,0.22,2.4,L({color:0x7a5230}),8), a*2.3,-1.2,b*2.0)));
  const wall = [];
  for (let i=0;i<10;i++){ const t = jnTileMesh(1.3); t.position.set(-2.1 + i*0.47, 0.9, 1.5); g.add(t); wall.push(t); }
  g.tiles = wall;
  return g;
}
function jnWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.setFace('smug');
  const table = jnTableMesh(); table.scale.setScalar(0.85); table.position.set(wp.x + 2.8, RS_Y + 1.8, 2.0); scene.add(table); R.items.push(table); R.jnTable = table;
  R.jnOffers = jnOfferTexs.concat(jnOfferTexs).map((t,i)=>{
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.8), new THREE.MeshBasicMaterial({map:t, transparent:true, fog:false}));
    m.position.set(wp.x + 26 + i*3, RS_Y + 2 + (i%4)*2.2, 2.6 + (i%3)*0.4); m.visible = false; scene.add(m); R.items.push(m); return m;
  });
  R.jnStaff = [];
  for (let i=0;i<3;i++){ const s = jnGuard(); s.scale.setScalar(1.1); s.position.set(wp.x + 24 + i*4, RS_Y, -1.2 + i*1.1); s.rotation.y = -Math.PI/2; s.visible = false; scene.add(s); R.items.push(s); R.jnStaff.push(s); }
}
function jnWinUpdate(R, dt, k){
  const W = R.W, wp = W.m.holder.position, P = W.m.props, T = R.jnTable;
  for (const n in P) P[n].visible = false;
  T.visible = false; R.jnOffers.forEach(o=>o.visible = false); R.jnStaff.forEach(s=>s.visible = false);

  if (R.t < 1.7){                                           // 摸牌、胡了
    T.visible = true; T.position.set(wp.x + 2.8, RS_Y + 1.8, 2.0); T.rotation.set(0,0,0);
    P.tile.visible = true;
    applyPose(W.m, Math.sin(R.t*5) > 0 ? POSE.ponder : POSE.sit, k);
    once('jw0', .3, ()=>{ SFX.jnTile(); popAt('聽好久了', W, 8.2); });
    once('jw1', 1.1, ()=>{ SFX.jnTile(); popAt('自摸，清一色', W, 8.6, 'big'); });
  } else if (R.t < 3.1){                                    // 掀桌（桌子飛起來擋住人物，趁機換裝）
    const u = (R.t - 1.7) / 1.4;
    T.visible = true;
    T.position.set(wp.x + 2.8 - u*2.6, RS_Y + 1.8 + u*9.5, 2.0 + u*1.4);
    T.rotation.set(u*2.2, u*1.4, -u*2.6);
    T.tiles.forEach((t,i)=>{ t.position.y = 0.9 + Math.sin(u*3 + i)*u*2.5; t.rotation.z = u*6 + i; });
    applyPose(W.m, POSE.cheer, k);
    once('jw2', 1.75, ()=>{ SFX.crash(); G.shake = .5; popAt('不玩了', W, 8.6, 'red'); });
    once('jw3', 2.15, ()=>{ W.m.setQueen(true); G.flash = .5; SFX2.fanfare(); });
  } else {                                                  // 一堆公司遞 offer
    W.m.setQueen(true); W.m.setFace('smug');
    applyPose(W.m, Math.sin(R.t*8) > 0 ? POSE.thumbs : POSE.salute, k);
    R.jnStaff.forEach((s,i)=>{
      s.visible = true;
      const tx = wp.x + 5.5 + i*3.2, p = s.position, kk = 1 - Math.exp(-dt*2.6);
      p.x += (tx - p.x)*kk; s.rotation.y = -Math.PI/2;
    });
    R.jnOffers.forEach((o,i)=>{
      if (R.t < 3.15 + i*.1) return;
      o.visible = true;
      const tx = wp.x + 3.4 + (i%4)*2.5, ty = RS_Y + 3.4 + ((i/4)|0)*3.0, p = o.position, kk = 1 - Math.exp(-dt*5.5);
      p.x += (tx - p.x)*kk; p.y += (ty - p.y)*kk;
      o.rotation.z = Math.sin(R.t*3 + i)*.09;
    });
    once('jw4', 3.3, ()=>{ SFX.horn(); popAt('國企女王，請收下 offer！', W, 9.4, 'big'); });
    once('jw5', 4.4, ()=>popAt('實習結束再說', W, 8.6, 'blue'));
    once('jw6', 5.2, ()=>{ SFX2.cheer(); popAt('先排隊', W, 9, 'big'); });
  }
}
function jnLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.setCrown(true);
  const ZW = lp.z - 7.2;                                           // 月台牆面
  const st = new THREE.Group(); st.position.set(lp.x + 1, RS_Y, 0); scene.add(st); R.items.push(st);
  // 牆、天花板、地面磚
  st.add(at(new THREE.Mesh(new THREE.BoxGeometry(34,13,1), L({color:0xd9d4c6})),0,6.5,ZW));
  st.add(at(new THREE.Mesh(new THREE.BoxGeometry(34,0.6,7.6), L({color:0xc9c2b0})),0,12.6,ZW+4));          // 天花板
  st.add(at(new THREE.Mesh(new THREE.BoxGeometry(34,0.3,8.0), L({color:0xcfc8b8})),0,0.14,ZW+4.2));        // 月台地板
  // 月台門
  for (let i=-5;i<=5;i++){
    const d = new THREE.Mesh(new THREE.BoxGeometry(2.9,5.2,0.22), L({map:jnPsdTex}));
    d.position.set(i*3.0, 2.7, ZW + 0.62); st.add(d);
  }
  // 上方橘色方向看板 + 站名牌
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.5,3.0), new THREE.MeshBasicMaterial({map:jnSignTexs[0], fog:false}));
  sign.position.set(-3.6, 9.2, ZW + 0.9); st.add(sign); R.jnSign = sign;
  const name = new THREE.Mesh(new THREE.PlaneGeometry(9.0,3.6), new THREE.MeshBasicMaterial({map:jnStationTex, fog:false}));
  name.position.set(6.4, 9.0, ZW + 0.7); st.add(name);
  // 月台黃線
  const line = new THREE.Mesh(new THREE.BoxGeometry(30,0.16,0.55), L({color:0xf3d24a}));
  line.position.set(lp.x + 1, RS_Y + 0.26, ZW + 2.6); scene.add(line); R.items.push(line);
  // 開過去的列車
  const train = new THREE.Group(); train.visible = false; scene.add(train); R.items.push(train);
  const sideM = L({map:jnTrainTex}), headM = L({map:jnTrainHeadTex}), roofM = L({color:0xc8c5bb});
  for (let i=0;i<6;i++){
    const car = new THREE.Mesh(new THREE.BoxGeometry(7.4,5.0,3.0), [headM,headM,roofM,roofM,sideM,sideM]);
    car.position.x = i*7.7; train.add(car);
  }
  train.position.set(lp.x + 34, RS_Y + 2.8, ZW + 1.9);
  R.jnTrain = train; R.jnTrainX = lp.x + 34;
  const crown = jnCrown(1.0); crown.scale.setScalar(0.85); crown.visible = false; scene.add(crown); R.items.push(crown);
  R.jnDrop = crown; R.jnDropV = 0;
}
function jnLoseUpdate(R, dt, k){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  // 列車進站：從右邊開過去
  if (R.t >= 1.35 && R.t < 3.3){
    R.jnTrain.visible = true;
    R.jnTrainX -= 72*dt; R.jnTrain.position.x = R.jnTrainX;
    if (R.jnTrainX < lp.x - 56) R.jnTrain.visible = false;
  } else R.jnTrain.visible = false;

  if (R.t < 1.4){
    applyPose(Lz.m, POSE.stand, k); Lz.m.setFace('normal');
    R.jnSign.material.map = jnSignTexs[0];
    once('jl0', .3, ()=>popAt('中和新蘆線……', Lz, 8.2));
    once('jlT', 1.1, ()=>SFX.jnTrain());
  } else if (R.t < 2.9){
    applyPose(Lz.m, POSE.helpless, k); Lz.m.setFace('shout');
    once('jl1', 1.75, ()=>{ R.jnSign.material.map = jnSignTexs[1]; R.jnSign.material.needsUpdate = true; SFX.whistle(); noise(.5,.12,800); popAt('往迴龍？！', Lz, 8.8, 'red'); });
    once('jl2', 2.4, ()=>popAt('蘆洲還要再等九分鐘', Lz, 8.4, 'blue'));
  } else {
    applyPose(Lz.m, POSE.sob, k); Lz.m.setFace('cry');
    once('jl3', 3.0, ()=>{
      Lz.m.setCrown(false);
      const c = R.jnDrop; c.visible = true;
      c.position.set(lp.x + 0.2, RS_Y + 6.6, lp.z + 0.5); R.jnDropV = 1;
      SFX.soft();
    });
    if (R.jnDrop.visible && R.jnDrop.position.y > RS_Y + 0.25){
      R.jnDropV -= 48*dt; R.jnDrop.position.y += R.jnDropV*dt; R.jnDrop.rotation.z += dt*4; R.jnDrop.rotation.x += dt*2;
      if (R.jnDrop.position.y <= RS_Y + 0.25){ R.jnDrop.position.y = RS_Y + 0.25; R.jnDrop.rotation.set(Math.PI/2.4,0,.3); tone(520,.12,'triangle',.1); tone(360,.2,'triangle',.08,-.2); }
    }
    once('jl4', 3.6, ()=>popAt('低頭皇冠會掉', Lz, 8.6, 'big'));
    once('jl5', 4.6, ()=>popAt('……那就先掉著', Lz, 8.2));
  }
}

registerChar('janice', {
  stats: { name:'女王', en:'Queen Janice', tag:'冷靜毒舌・麻將霸氣・國企實習', weight:0.85, run:14, air:11, jumpV:33, djV:28, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:9, sc:.7, ang:38, text:'講完了嗎？'},
    side:{t:[.24,.1,.32], pose:['batWind','batHit'], box:[3.0,3.4,1.8], dmg:16, kb:12, sc:1.1, ang:36, prop:'rack', sfx:'batCrack', text:'橫掃推牌'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,6.8,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'rack', sfx:'jnTile', text:'洗牌！'},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.1,0.9,1.8], dmg:12, kb:9, sc:.9, ang:68, prop:'rack', sfx:'crash', text:'拍桌'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.2,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, sfx:'jnTile'},
    nB:{t:[.18,.05,.3], pose:['throwWind','throwHit'], fire:[[.18,'jnSnark']], air:1, sfx:'jnPaper', text:'收下 offer'},
    sB:{t:[.14,.26,.3], pose:['sprint','sprint'], box:[2.0,3.8,1.5], dmg:11, kb:8, sc:.5, ang:38, dash:26, air:1, fire:[[0,'jnDash']], onHit:'jnStun', sfx:'jnTrain', text:'捷運衝刺'},
    uB:{t:[.05,.55,.12], pose:['setUp','upHit'], poseSwitch:.28, start:'jnUp', box:[0.5,5.4,1.8], dmg:8, kb:9, sc:.5, ang:82, helpless:1, air:1, sfx:'whistle', text:'皇冠升天'},
    dB:{t:[.2,.3,.32], pose:['block','thumbs'], fire:[[0,'jnReady']], box:[1.8,3.6,2.2], dmg:6, kb:5, sc:.3, ang:60, air:1, sfx:'jnTile', text:'聽牌了', textCls:'blue'},
  },
  fire: {
    // 中必殺：甩出一封 offer
    jnSnark(f){
      const t = jnOfferTexs[(Math.random()*jnOfferTexs.length)|0];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.5), new THREE.MeshBasicMaterial({map:t, transparent:true, side:THREE.DoubleSide, fog:false}));
      m.rotation.z = -f.face*.25;
      proj({owner:f, x:f.x + f.face*1.8, y:f.y + 4.6, vx:f.face*26, vy:2, g:16, r:1.1, life:1.3, dmg:8, kb:7, sc:.55, ang:42, mesh:m});
    },
    // 下必殺：聽牌狀態（放 fire 時間 0，不放 start —— core 會讓有 start hook 的招式前 .32 秒強制上浮）
    jnReady(f){ f.buffT = 5; f.buffDmg = 1.35; f.buffKb = 1.15; pop('聽牌', f.x, f.y+7.6, 'blue'); },
    // 側必殺：身後生出一列捷運跟著衝（同上，必須放 fire，否則女王會自己飛起來）
    jnDash(f){
      if (f.jnDash) scene.remove(f.jnDash.g);
      const g = new THREE.Group(), mats = [];
      const headM = L({map:jnTrainHeadTex, transparent:true}), sideM = L({map:jnTrainTex, transparent:true}), roofM = L({color:0xc8c5bb, transparent:true});
      mats.push(headM, sideM, roofM);
      for (let i=0;i<3;i++){ const car = new THREE.Mesh(new THREE.BoxGeometry(5.4,3.9,2.4), [headM,headM,roofM,roofM,sideM,sideM]); car.position.x = -i*5.6; g.add(car); }
      scene.add(g); f.jnDash = {g, mats, t:0};
      burst(f.x - f.face*3, f.y + 3, 0x2f5fb0, 10, 7);
    },
  },
  start: {
    jnUp(f){ f.vy = 34; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; if (f.m.setCrown) f.m.setCrown(true); },
  },
  onhit: { jnStun(att, v){ v.state = 'stun'; v.stunT = .6; v.move = null; pop('被噹到了', v.x, v.y+7.5, 'blue'); } },
  sfx: {
    jnTile(){ noise(.06,.16,2600); tone(900,.05,'square',.05); tone(640,.07,'square',.04,0,.05); },
    jnPaper(){ noise(.12,.1,5200); tone(1400,.06,'triangle',.05,-.3); },
    jnTrain(){ noise(.35,.1,900); tone(180,.4,'sawtooth',.06,.5); tone(1200,.12,'sine',.05,-.4); },
  },
  build: buildJanice, face: jnFaces.normal, portraitBg: '#6b4a7e',
  portrait(g){ g.fillRect(2,2,60,22); g.fillRect(2,2,14,50); g.fillRect(48,2,14,50); },
  shield(){
    const g = new THREE.Group();
    [-1,1].forEach(s=>{ const gd = jnGuard(); gd.scale.setScalar(1.45); gd.position.set(s*1.9,-3.4,s*0.5); g.add(gd); });
    g.add(at(jnCrown(3.0),0,2.0,0));
    return g;
  },
  shieldAnim(f){
    const t = performance.now()/1000;
    const r = f.shieldMesh.scale.x || 1;
    f.shieldMesh.position.set(f.x + f.face*1.9, f.y + 3.4*r, 0.8);
    f.shieldMesh.rotation.y = f.face*1.25 + Math.sin(t*2)*.1;
  },
  shieldPose: 'block', shieldProp: null, breakText: '皇冠掉了！',
  finalPose: 'laughUp', finalProp: null,
  animate(f, m, s, t, dt){
    if (s==='final'){ m.setFace('smug'); m.setCrown(true); }
    else if (s==='move' && f.move && (f.move.text==='聽牌了' || f.move.text==='收下 offer')) m.setFace('smug');
    else if (s==='hurt') m.setFace('shout');
    else if (f.buffT > 0) m.setFace('smug');
    else m.setFace('normal');
    if (f.state !== 'shield' && s !== 'final' && !(f.move && f.move.start==='jnUp')) m.setCrown(f.buffT > 0);
    // 側必殺身後的捷運：跟著衝、尾段淡出
    const D = f.jnDash;
    if (D){
      D.t += dt;
      const grow = Math.min(1, D.t/.1), fade = Math.max(0, 1 - Math.max(0, D.t - .45)/.35);
      D.g.visible = fade > .02 && f.state !== 'dead';
      D.g.position.set(f.x - f.face*4.6, f.y + 3.1, -1.4);
      D.g.rotation.y = f.face > 0 ? 0 : Math.PI;
      D.g.scale.set(grow, grow*(.85 + .15*fade), grow);
      D.mats.forEach(mm=>{ mm.opacity = fade; mm.transparent = true; });
      if (Math.random() < dt*30) spark(f.x - f.face*(2 + Math.random()*6), f.y + 1 + Math.random()*4, 1.4);
      if (D.t > .8 || f.state === 'dead'){ scene.remove(D.g); f.jnDash = null; }
    }
  },
  skins: [
    { name:'白針織上衣', apply(c){ c.baseTop = 'white'; c.setTop('white'); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#6b2a6e','#e3c04a',0xffffff); h.position.set(0.05,0.8,-0.02); c.head.add(h); } },
  ],
  introPose: 'peace', readyPose: (t)=> Math.sin(t*9) > 0 ? POSE.thumbs : POSE.ponder, selectSfx: ()=>SFX.whistle(),
  winSub: '"Kneel, or at least stop talking."',
  final: jnFinal, winSetup: jnWinSetup, winUpdate: jnWinUpdate, loseSetup: jnLoseSetup, loseUpdate: jnLoseUpdate,
  longWin: true, longLose: true,
});
