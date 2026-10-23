/* characters/ichung.js — 憶中老師 (I-Chung)
   機械系教授・教職員壘球強打・脫口秀主持人・我們的指導老師
   外型沿用 maps/mecls.js 裡那位站在講桌旁的「憶中老師」，再加上照片裡的藍色運動 T 恤／灰藍 Polo。
   全域前綴一律 ic / IC_。 */
'use strict';

/* =================== 貼圖 =================== */
const IC_SKIN = '#d6a47c', IC_SKIN_C = ['#cc9a72','#e0b08a'];
const icSkinTex = tex(16,16,(g)=>speckle(g,16,16,IC_SKIN,IC_SKIN_C,.4));

function icFace(g, mode){
  speckle(g,64,64,IC_SKIN,IC_SKIN_C,.35); shadeFace(g);
  for (let i=0;i<70;i++){ g.fillStyle='rgba(40,30,28,.32)'; g.fillRect(10+((rnd()*44)|0), 53+((rnd()*10)|0), 1, 1); }     // 淡淡的鬍渣
  g.fillStyle='rgba(225,110,100,.40)'; g.beginPath(); g.ellipse(10,48,6,4,0,0,7); g.fill(); g.beginPath(); g.ellipse(54,48,6,4,0,0,7); g.fill();
  // 眉毛：永遠是上揚的、很好親近的那種
  g.strokeStyle='#2a1f1a'; g.lineWidth=1.6;
  if (mode==='shout'){ g.beginPath(); g.moveTo(11,24); g.quadraticCurveTo(19,28,27,26); g.stroke(); g.beginPath(); g.moveTo(37,26); g.quadraticCurveTo(45,28,53,24); g.stroke(); }
  else { g.beginPath(); g.moveTo(11,27); g.quadraticCurveTo(19,21,27,24); g.stroke(); g.beginPath(); g.moveTo(37,24); g.quadraticCurveTo(45,21,53,27); g.stroke(); }
  // 眼睛
  g.strokeStyle='#1d1310'; g.lineWidth=2.2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(14,40); g.lineTo(25,40); g.stroke(); g.beginPath(); g.moveTo(39,40); g.lineTo(50,40); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,42,3,13); g.fillRect(44,42,3,13);
  } else if (mode==='shout'){
    g.fillStyle='#1d1310'; g.beginPath(); g.ellipse(19,40,4,4.6,0,0,7); g.fill(); g.beginPath(); g.ellipse(45,40,4,4.6,0,0,7); g.fill();
  } else {
    g.beginPath(); g.arc(19,40,5,Math.PI*1.12,Math.PI*1.88); g.stroke(); g.beginPath(); g.arc(45,40,5,Math.PI*1.12,Math.PI*1.88); g.stroke();   // ^ ^ 笑眼
  }
  // 眼鏡（長方框）
  g.fillStyle='rgba(225,238,245,.10)'; g.fillRect(9,31,20,13); g.fillRect(35,31,20,13);
  g.strokeStyle='#33333a'; g.lineWidth=1.3; g.strokeRect(9.5,31.5,19,12); g.strokeRect(35.5,31.5,19,12);
  g.fillStyle='#202026'; g.fillRect(29,34,6,2);
  // 嘴巴
  if (mode==='laugh' || mode==='shout'){
    g.fillStyle='#5a1c18'; g.beginPath(); g.ellipse(32,52,11,8,0,0,7); g.fill();
    g.fillStyle='#f6f2e8'; g.fillRect(23,45,18,4); g.fillStyle='#d9736a'; g.fillRect(26,56,12,3);
  } else if (mode==='cry'){
    g.fillStyle='#5a1c18'; g.beginPath(); g.moveTo(21,56); g.quadraticCurveTo(32,48,43,56); g.quadraticCurveTo(32,53,21,56); g.closePath(); g.fill();
  } else {
    g.fillStyle='#5a1c18'; g.beginPath(); g.moveTo(18,46); g.quadraticCurveTo(32,48,46,46); g.quadraticCurveTo(44,58,32,58); g.quadraticCurveTo(20,58,18,46); g.closePath(); g.fill();
    g.fillStyle='#f6f2e8'; g.beginPath(); g.moveTo(20,47); g.quadraticCurveTo(32,49,44,47); g.lineTo(43,51); g.quadraticCurveTo(32,53,21,51); g.closePath(); g.fill();
    g.fillStyle='#d9736a'; g.fillRect(27,55,10,2);
  }
}
const icFaces = {
  normal: tex(64,64,(g)=>icFace(g,'normal')),
  laugh:  tex(64,64,(g)=>icFace(g,'laugh')),
  shout:  tex(64,64,(g)=>icFace(g,'shout')),
  cry:    tex(64,64,(g)=>icFace(g,'cry')),
};

/* 藍色運動 T（照片裡那件）：細網眼 + 胸前白色折線 logo */
const IC_TEE = '#1f6fc4';
function icTeeBase(g){
  speckle(g,32,32,IC_TEE,['#2a7cd2','#19619f'],.4);
  g.fillStyle='rgba(255,255,255,.055)'; for (let y=0;y<32;y+=2) g.fillRect(0,y,32,1);
}
const icTeeTex = tex(32,32,icTeeBase);
const icTeeFrontTex = tex(96,128,(g)=>{
  g.scale(3,4);                                                   // 以 32×32 的座標作畫，但畫布夠大，字才不會糊
  icTeeBase(g);
  g.fillStyle='#223a55'; g.beginPath(); g.moveTo(10,0); g.quadraticCurveTo(16,5,22,0); g.lineTo(22,2); g.quadraticCurveTo(16,7,10,2); g.closePath(); g.fill();   // 領口
  g.strokeStyle='#ffffff'; g.lineWidth=1.1; g.lineJoin='round';
  g.beginPath(); g.moveTo(7,13); g.lineTo(12,13); g.lineTo(15,10); g.lineTo(19,10); g.lineTo(25,13); g.stroke();      // 上面那道折線
  g.beginPath(); g.moveTo(9,20); g.lineTo(16,24); g.lineTo(23,20); g.stroke();                                         // 下面的 V
});
const icTeePantsTex = tex(32,32,(g)=>speckle(g,32,32,'#232733',['#2b3040','#1c202a'],.5));

/* 灰藍 Polo（機場／分享會那件）：橫條 + 領子 + 門襟 + 口袋 */
const IC_POLO = '#7f93ab';
function icPoloBase(g){
  speckle(g,32,32,IC_POLO,['#8a9eb6','#71859d'],.35);
  g.fillStyle='rgba(255,255,255,.10)'; for (let y=1;y<32;y+=4) g.fillRect(0,y,32,1);
  g.fillStyle='rgba(30,45,70,.16)'; for (let y=3;y<32;y+=4) g.fillRect(0,y,32,1);
}
const icPoloTex = tex(32,32,icPoloBase);
const icPoloFrontTex = tex(96,128,(g)=>{
  g.scale(3,4);
  icPoloBase(g);
  g.fillStyle='#e9eef5'; g.fillRect(15,4,2,12);                                           // 門襟
  g.fillStyle='#fdfefe'; g.fillRect(15.2,7,1.6,1.6); g.fillRect(15.2,12,1.6,1.6);          // 釦子
  g.fillStyle='rgba(255,255,255,.75)'; g.fillRect(4,14,24,1.2);                            // 胸前那條白線
  g.strokeStyle='#59697e'; g.lineWidth=.8; g.strokeRect(20.5,18.5,6,6); g.fillStyle='rgba(255,255,255,.12)'; g.fillRect(21,19,5,2);   // 口袋
});
const icPoloPantsTex = tex(32,32,(g)=>speckle(g,32,32,'#2f3441',['#383e4c','#272b36'],.5));

/* 白 T 恤＋漁夫帽（出隊爬山那張） */
function icWhiteBase(g){ speckle(g,32,32,'#f4f4f0',['#ffffff','#e6e6e0'],.3); }
const icWhiteTex = tex(32,32,icWhiteBase);
const icWhiteFrontTex = tex(96,128,(g)=>{
  g.scale(3,4);
  icWhiteBase(g);
  g.fillStyle='#e2e2dc'; g.beginPath(); g.moveTo(11,0); g.quadraticCurveTo(16,4,21,0); g.lineTo(21,1.6); g.quadraticCurveTo(16,6,11,1.6); g.closePath(); g.fill();
  g.strokeStyle='#d9533f'; g.lineWidth=.9; g.beginPath(); g.arc(16,15,3.2,0,7); g.stroke();                 // 胸前小圓 logo
  g.fillStyle='#3a6ab0'; g.fillRect(14.6,13.6,2.8,2.8);
});
const icBlackPantsTex = tex(32,32,(g)=>speckle(g,32,32,'#1d1d22',['#26262c','#161619'],.5));

/* =================== 模型 =================== */
function buildIchung(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:icFaces.normal}), skinM = L({map:icSkinTex});
  const teeM = L({map:icTeeTex}), teeFrontM = L({map:icTeeFrontTex});
  const poloM = L({map:icPoloTex}), poloFrontM = L({map:icPoloFrontTex});
  const teePantsM = L({map:icTeePantsTex}), poloPantsM = L({map:icPoloPantsTex});
  const whiteM = L({map:icWhiteTex}), whiteFrontM = L({map:icWhiteFrontTex}), blackPantsM = L({map:icBlackPantsTex});
  const teeMats  = [teeM, teeM, teeM, teeM, teeFrontM, teeM];
  const poloMats = [poloM, poloM, poloM, poloM, poloFrontM, poloM];
  const whiteMats = [whiteM, whiteM, whiteM, whiteM, whiteFrontM, whiteM];

  const c = buildChar({
    skinM, faceM, headW:1.0, headH:1.15,
    torsoMat: teeMats, sleeveMat: ()=>teeM, sleeve:[0.64,0.84],
    pantsM: teePantsM, shoeM:L({color:0x25252b}), soleM:greySole,
    collar(chest){
      const cm = L({color:0xdfe9f6}), bits = [];
      for (const sx of [-1,1]){ const k = rbox(0.5,0.2,0.34,.3,cm); k.position.set(sx*0.3,2.2,0.38); k.rotation.z = -sx*0.5; chest.add(k); bits.push(k); }
      chest.userData.poloCollar = bits;
    },
    hair(head){                                                               // 短黑髮，前額微微後退（照片裡的髮線）
      head.add(at(rbox(0.98,0.3,0.74,.5,hairM),0,0.56,-0.16));
      head.add(at(rbox(0.5,0.09,0.12,.4,hairM),0,0.55,0.4));
      head.add(at(rbox(1.08,0.95,0.5,.6,hairM),0,0.1,-0.32));
      [-1,1].forEach(sx=>head.add(at(rbox(0.1,0.42,0.46,.4,hairM),sx*0.5,0.24,-0.04)));
    },
    face(head){                                                               // 眼鏡腳（鏡框畫在臉上）
      const fm = L({color:0x202026}), gl = new THREE.Group(); gl.position.set(0,0,0.56); head.add(gl);
      [-1,1].forEach(sx=>{ const arm = new THREE.Mesh(new THREE.BoxGeometry(0.025,0.025,0.62), fm); arm.position.set(sx*0.5,0.04,-0.3); gl.add(arm); });
    },
  }, parent);
  c.root.scale.set(1.06,1,1.08);
  c.head.scale.setScalar(1.14);                                               // 頭大一點＝比較親切
  c.torso = c.chest.children[0];
  const poloCollar = c.chest.userData.poloCollar || [];
  const sleeves = [c.R.sh.children[0], c.Lf.sh.children[0]];
  sleeves.forEach(s=>{ if (s) s.scale.y = 0.62; });                            // 短袖
  const legs = [c.joints.rHp.children[0], c.joints.lHp.children[0], c.joints.rKn.children[0], c.joints.lKn.children[0]];

  c.setOutfit = (o)=>{
    const polo = (o === 'polo'), white = (o === 'white');
    c.torso.material = white ? whiteMats : polo ? poloMats : teeMats;
    sleeves.forEach(s=>{ if (s) s.material = white ? whiteM : polo ? poloM : teeM; });
    const pm = white ? blackPantsM : polo ? poloPantsM : teePantsM;
    legs.forEach(l=>{ if (l) l.material = pm; });
    poloCollar.forEach(k=>k.visible = polo);
  };

  /* ---- 漁夫帽＋背包（出隊爬山那套） ---- */
  const bucket = new THREE.Group(); c.head.add(bucket); bucket.visible = false;
  {
    const hm = L({map:tex(16,16,(g)=>speckle(g,16,16,'#cbb28c',['#d6bd96','#bda67f'],.45))});
    bucket.add(at(cyl(0.56,0.62,0.42,hm,16),0,0.66,-0.02));                 // 帽冠
    const brim = cyl(0.95,0.95,0.09,hm,18); brim.position.set(0,0.47,-0.02); brim.rotation.x = 0.08; bucket.add(brim);
    bucket.add(at(cyl(0.63,0.63,0.08,L({color:0xb49a74}),16),0,0.52,-0.02));  // 帽帶
    const cord = at(cyl(0.02,0.02,0.5,L({color:0xa8906c}),5),0,-0.2,0.5); cord.rotation.x = 0.25; bucket.add(cord);
  }
  const pack = new THREE.Group(); c.chest.add(pack); pack.visible = false;
  {
    const pm = L({color:0x24242a});
    pack.add(at(rbox(1.1,1.4,0.55,.3,pm),0,1.4,-0.72));                      // 背包本體
    for (const sx of [-1,1]){ const st = rbox(0.17,1.5,0.1,.3,pm); st.position.set(sx*0.34,1.45,0.5); st.rotation.z = -sx*0.07; pack.add(st); }
  }
  c.setHat = (on)=>{ bucket.visible = pack.visible = !!on; };

  /* ---- 道具 ---- */
  // 壘球棒
  const bat = new THREE.Group();
  const batM = L({color:0xc49a62});
  bat.add(at(cyl(0.085,0.085,0.5,L({color:0x2b2b33}),8),0,-0.25,0));
  bat.add(at(cyl(0.1,0.16,1.9,batM,10),0,-1.45,0));
  bat.add(at(cyl(0.165,0.165,0.3,batM,10),0,-2.5,0));
  c.R.hd.add(bat);
  // 大鐵鎚（砸牆用）
  const hammer = new THREE.Group();
  hammer.add(at(cyl(0.075,0.075,2.1,L({color:0x7a5a38}),8),0,-1.05,0));
  const hh = at(rbox(0.52,0.46,1.0,.1,L({color:0x6c7078})),0,-2.2,0); hammer.add(hh);
  hammer.add(at(rbox(0.2,0.5,0.2,.06,L({color:0x9aa0a8})),0,-2.2,0));
  c.R.hd.add(hammer);
  // 麥克風
  const mic = new THREE.Group();
  mic.add(at(cyl(0.06,0.07,0.52,L({color:0x24242a}),8),0,-0.26,0));
  mic.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.15,10,8), L({color:0x9fa4ad})),0,-0.62,0));
  c.R.hd.add(mic);
  // 手機（開 IG 用）
  const phone = new THREE.Group();
  phone.add(at(rbox(0.42,0.78,0.07,.08,L({color:0x1b1b22})),0,-0.4,0));
  const scr = at(rbox(0.36,0.66,0.02,.04,new THREE.MeshBasicMaterial({color:0xff5f8d, fog:false})),0,-0.4,0.05); phone.add(scr);
  c.R.hd.add(phone);
  // 水泥磚（蓋廁所搬的東西）
  const brick = new THREE.Group();
  const brickT = tex(32,32,(g)=>{ speckle(g,32,32,'#b06a4a',['#bd7553','#9c5c3f'],.5); g.fillStyle='rgba(240,236,228,.75)'; g.fillRect(0,15,32,2); g.fillRect(15,0,2,15); });
  brick.add(at(rbox(1.5,0.8,1.0,.08,L({map:brickT})),0,-0.55,0));
  c.R.hd.add(brick);

  /* ---- 大招：印度巫師袍 / 巫師帽 / 白鬍子 ---- */
  const wiz = new THREE.Group(); c.hips.add(wiz); wiz.visible = false;
  {
    const robeCols = [0xff9933, 0xf7f7f2, 0x138808];
    for (let i=0;i<3;i++){
      const geo = new THREE.CylinderGeometry(0.72 + i*0.26, 1.05 + i*0.34, 0.62, 18, 1, true);
      const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:robeCols[i], side:THREE.DoubleSide}));
      m.position.y = -0.2 - i*0.52; wiz.add(m);
    }
    const star = new THREE.Mesh(new THREE.TorusGeometry(0.5,0.05,5,14), new THREE.MeshBasicMaterial({color:0xffe066, fog:false}));
    star.rotation.x = Math.PI/2; star.position.y = -1.5; wiz.add(star);
  }
  const wizHat = new THREE.Group(); c.head.add(wizHat); wizHat.visible = false;
  {
    wizHat.add(at(cyl(1.25,1.25,0.08,L({color:0xff9933}),16),0,0.66,-0.04));
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.72,1.7,16), new THREE.MeshLambertMaterial({color:0x138808}));
    cone.position.set(0,1.56,-0.04); wizHat.add(cone);
    wizHat.add(at(cyl(0.76,0.76,0.16,L({color:0xf7f7f2}),16),0,0.78,-0.04));
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.16,8,6), new THREE.MeshBasicMaterial({color:0xffe066, fog:false}));
    bell.position.set(0,2.42,-0.04); wizHat.add(bell);
  }
  const beard = new THREE.Group(); c.head.add(beard); beard.visible = false;
  {
    const bm = L({color:0xf2f0ea});
    beard.add(at(rbox(0.72,0.78,0.3,.45,bm),0,-0.62,0.42));
    beard.add(at(rbox(0.46,0.5,0.26,.45,bm),0,-1.1,0.36));
    beard.add(at(rbox(0.62,0.14,0.2,.4,bm),0,-0.16,0.56));
  }
  c.setWizard = (on)=>{ wiz.visible = wizHat.visible = beard.visible = !!on; };

  /* ---- 防禦：機器人裝甲（機械系專用） ---- */
  const armor = new THREE.Group(); c.chest.add(armor); armor.visible = false;
  {
    const plate = L({color:0x9aa3ad}), dark = L({color:0x4d545d});
    armor.add(at(rbox(1.5,1.5,1.2,.18,plate),0,1.35,0));
    armor.add(at(rbox(1.62,0.22,1.26,.1,dark),0,0.72,0));
    for (const sx of [-1,1]) armor.add(at(rbox(0.5,0.52,0.72,.2,plate),sx*0.9,2.0,0));
    const core = new THREE.Mesh(new THREE.CircleGeometry(0.27,14), new THREE.MeshBasicMaterial({color:0x6fe3ff, fog:false}));
    core.position.set(0,1.4,0.63); armor.add(core); armor.userData.core = core;
  }
  c.setArmor = (on)=>{ armor.visible = !!on; };
  c.armorCore = armor.userData.core;

  c.props = {bat, hammer, mic, phone, brick};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = icFaces[f] ? f : 'normal'; if (k !== faceNow){ faceNow = k; faceM.map = icFaces[k]; faceM.needsUpdate = true; } };
  c.setOutfit('tee'); c.setHat(false);
  return c;
}

/* =================== 召喚學生（隨機一位其他角色的縮小版，衝出去攻擊） =================== */
function icPickStudent(){
  const ks = CHAR_ORDER.filter(k => k !== 'ichung' && CHARS[k] && CHARS[k].build);
  return ks.length ? ks[(rnd() * ks.length) | 0] : null;
}
function icBuildStudent(kind){
  const holder = new THREE.Group();
  const body = new THREE.Group(); body.scale.setScalar(SC * 0.72); body.position.y = -1.5; holder.add(body);
  let c = null;
  try { c = CHARS[kind].build(body); } catch (e) { c = null; }
  if (c && c.props) for (const n in c.props) c.props[n].visible = false;
  holder.kid = c;
  return holder;
}

/* =================== 印度朋友（立體小人，大招時從兩邊跑出來） =================== */
const IC_KURTA = ['#e8743c','#2f8f5b','#d8c23a','#c0453f','#3f6fc0','#8b4fae'];
const icFanSkinTex = tex(16,16,(g)=>speckle(g,16,16,'#8a5a36',['#7d5130','#9a6a42'],.4));
const icFanFaceTex = tex(64,64,(g)=>{
  speckle(g,64,64,'#8a5a36',['#7d5130','#9a6a42'],.35); shadeFace(g);
  g.fillStyle='#17110e'; g.fillRect(13,25,12,3); g.fillRect(39,25,12,3);
  g.fillStyle='#120d0a'; g.beginPath(); g.ellipse(20,38,4.4,4.8,0,0,7); g.fill(); g.beginPath(); g.ellipse(44,38,4.4,4.8,0,0,7); g.fill();
  g.fillStyle='#ffffff'; g.fillRect(18,36,2,2); g.fillRect(42,36,2,2);
  g.fillStyle='#1a1310'; g.beginPath(); g.moveTo(21,47); g.quadraticCurveTo(32,44,43,47); g.quadraticCurveTo(32,50,21,47); g.closePath(); g.fill();   // 鬍子
  g.fillStyle='#5a1c18'; g.beginPath(); g.ellipse(32,54,8,5,0,0,7); g.fill(); g.fillStyle='#f6f2e8'; g.fillRect(26,50,12,3);
});
const icFanMats = IC_KURTA.map(col=>L({map:tex(32,32,(g)=>{
  speckle(g,32,32,col,[col,col],.25);
  g.fillStyle='rgba(255,255,255,.3)'; g.fillRect(15,0,2,32);
  g.fillStyle='rgba(255,255,255,.18)'; for (let y=4;y<32;y+=7) g.fillRect(0,y,32,1);
})}));
const icFanSkinM = L({map:icFanSkinTex}), icFanFaceM = L({map:icFanFaceTex});
const icFanPantsM = L({color:0xe8e4da}), icFanHairM = L({map:blackHairTex});

function icBuildFan(){
  const holder = new THREE.Group();
  const body = new THREE.Group(); body.scale.setScalar(SC*0.78); body.position.y = -1.55; holder.add(body);
  const kurta = icFanMats[(rnd()*icFanMats.length)|0];
  const c = buildChar({
    skinM:icFanSkinM, faceM:icFanFaceM, headW:1.0, headH:1.1,
    torsoMat:kurta, sleeveMat:()=>kurta, sleeve:[0.64,0.9],
    pantsM:icFanPantsM, shoeM:L({color:0x4a3a2c}), soleM:greySole,
    collar(chest){},
    hair(head){ head.add(at(rbox(1.12,0.46,1.12,.6,icFanHairM),0,0.5,-0.02)); head.add(at(rbox(1.06,0.86,0.5,.6,icFanHairM),0,0.1,-0.3)); },
    face(head){},
  }, body);
  c.props = {}; c.setOld = ()=>{}; c.setFace = ()=>{};
  holder.kid = c;
  return holder;
}

/* =================== 大招：Magical Moment =================== */
function icFoodMesh(kind){
  const g = new THREE.Group();
  if (kind === 0){                                                             // 咖哩（碗）
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.85,14,10,0,Math.PI*2,Math.PI/2,Math.PI/2), new THREE.MeshLambertMaterial({color:0xf3efe4, side:THREE.DoubleSide}));
    g.add(bowl);
    const curry = at(new THREE.Mesh(new THREE.CircleGeometry(0.78,16), L({color:0xd98c22})),0,-0.04,0);
    curry.rotation.x = -Math.PI/2; g.add(curry);
    g.rotation.x = 0.4;
  } else if (kind === 1){                                                      // 烤餅（naan，折起來的半圓）
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.95,0.95,0.18,16,1,false,0,Math.PI), L({color:0xe0b874}));
    n.rotation.z = Math.PI/2; n.rotation.y = 0.3; g.add(n);
    for (let i=0;i<4;i++){ const sp = at(new THREE.Mesh(new THREE.SphereGeometry(0.1,6,5), L({color:0xa97b3e})), (rnd()-.5)*1.2, 0.11, (rnd()-.5)*0.9); g.add(sp); }
  } else if (kind === 2){                                                      // 印度奶茶
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.28,0.8,14), L({color:0xf6f3ec})); g.add(cup);
    const tea = at(new THREE.Mesh(new THREE.CircleGeometry(0.34,14), L({color:0xc08a52})),0,0.41,0);
    tea.rotation.x = -Math.PI/2; g.add(tea);
    g.add(at(cyl(0.05,0.05,0.9,L({color:0xd8d2c4}),6),0.12,0.7,0));
  } else if (kind === 3){                                                      // 優格（小杯）
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.3,0.6,14), L({color:0xfaf7f0})); g.add(cup);
    g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.38,12,8), L({color:0xfffdf7})),0,0.3,0));
  } else {                                                                     // masala 料理（盤子＋配料）
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.0,0.86,0.14,18), L({color:0xf0ece2})); g.add(plate);
    const cols = [0xd9722a, 0xe0b23a, 0x6b8f3a, 0xb24b2c];
    for (let i=0;i<7;i++){ const b = at(new THREE.Mesh(new THREE.SphereGeometry(0.2 + rnd()*0.1,7,6), L({color:cols[(rnd()*cols.length)|0]})), (rnd()-.5)*1.3, 0.14, (rnd()-.5)*1.3); g.add(b); }
    g.rotation.x = 0.45;
  }
  return g;
}

function icFlagFilter(){                                                       // 印度國旗濾鏡，掛在相機上所以永遠蓋滿畫面
  const t = tex(64,64,(g)=>{
    g.fillStyle='#ff9933'; g.fillRect(0,0,64,22);
    g.fillStyle='#ffffff'; g.fillRect(0,22,64,20);
    g.fillStyle='#138808'; g.fillRect(0,42,64,22);
    g.strokeStyle='#0a3d91'; g.lineWidth=1.6; g.beginPath(); g.arc(32,32,7,0,7); g.stroke();
    for (let i=0;i<12;i++){ const a = i/12*Math.PI*2; g.beginPath(); g.moveTo(32,32); g.lineTo(32+Math.cos(a)*7, 32+Math.sin(a)*7); g.stroke(); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(46,17),
    new THREE.MeshBasicMaterial({map:t, transparent:true, opacity:0, depthTest:false, depthWrite:false, fog:false}));
  m.position.set(0,0,-11); m.renderOrder = 998; m.frustumCulled = false;
  return m;
}

function icFinal(f, opp){
  f.finalT = 4.8;
  banner('Magical Moment！'); SFX.icMagic(); pop('This is a magical moment！', f.x, f.y+8, 'big');
  if (f.m.setWizard) f.m.setWizard(true);
  const filter = icFlagFilter(); camera.add(filter); if (!camera.parent) scene.add(camera);
  G.finals.push({owner:f, target:opp, t:0, filter, next:0.55, nextFan:0.9, hit:new Set(), boomed:false,
    update(F, dt){
      const o = F.t < .5 ? F.t/.5*.26 : F.t > 4.2 ? Math.max(0, (4.8 - F.t)/.6*.26) : .26;
      F.filter.material.opacity = o;
      // 天上掉下來的印度食物
      if (F.t > F.next && F.t < 3.9){
        F.next = F.t + 0.17;
        const kind = (rnd()*5)|0;
        const mesh = icFoodMesh(kind);
        const x = Math.max(MAIN.x1 + 2, Math.min(MAIN.x2 - 2, f.x + (rnd() - .5) * 26));
        proj({owner:f, x, y:19 + rnd()*5, vx:(rnd()-.5)*2, vy:-4, g:26, r:1.1, life:3.2,
              dmg:5, kb:5, sc:.25, ang:60, spin:1, mesh});
        if (rnd() < .4) SFX.icTabla();
      }
      // 剛開 IG 就被一堆印度人加好友：他們從兩邊跑過來
      if (F.t > F.nextFan && F.t < 3.7){
        F.nextFan = F.t + 0.65;
        const dir = rnd() < .5 ? 1 : -1;
        // 隨機挑一層平台跑，不要全部擠在最下面
        const surf = (PLATS.length && rnd() < .62) ? PLATS[(rnd()*PLATS.length)|0] : null;
        const sy = surf ? surf.y : (MAIN.y || 0);
        const sx1 = surf ? surf.x1 : MAIN.x1, sx2 = surf ? surf.x2 : MAIN.x2;
        const h = icBuildFan(); h.rotation.y = dir > 0 ? Math.PI/2 : -Math.PI/2;
        const p = proj({owner:f, x:dir > 0 ? sx1 - 4 : sx2 + 4, y:sy + 1.55, vx:dir*19, vy:0, g:0, r:1.5,
                        life:Math.min(2.6, (sx2 - sx1 + 9)/19),
                        dmg:6, kb:6, sc:.4, ang:40, mesh:h});
        p.kid = h.kid;
        if (!F.said){ F.said = true; pop('IG 一開就被印度人加爆！', f.x, f.y + 7, 'blue'); }
      }
      // 最後的大爆炸
      if (F.t > 4.0 && !F.boomed){
        F.boomed = true; SFX.boom(); G.flash = .45; G.shake = reduce ? .25 : 1.1;
        banner('咖哩降臨！');
        for (const v of G.fighters){
          if (v === f || !v.hittable()) continue;
          v.pct += 16; launch(v, 21 + v.pct*.11, 55, v.x >= f.x ? 1 : -1);
          burst(v.x, v.y + 3, 0xffb347, 18, 12); SFX.hit(40);
        }
      }
      if (F.t > 4.6 && f.m.setWizard) f.m.setWizard(false);
      return F.t > 4.8;
    },
    dispose(F){ camera.remove(F.filter); if (F.filter.material.map) F.filter.material.map.dispose(); F.filter.material.dispose(); freeObj(F.filter); if (f.m.setWizard) f.m.setWizard(false); }});
}

/* =================== 勝利：從印度飛回台灣，全場為老師歡呼 =================== */
function icWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  R.icHome = {x:wp.x, y:wp.y, z:wp.z};
  // 身後的小夥伴們（場上其餘角色的縮小版）
  R.icCrew = [];
  const kinds = CHAR_ORDER.filter(k => k !== 'ichung');
  kinds.forEach((k, i)=>{
    let c = null;
    try { const h = new THREE.Group(); const b = new THREE.Group(); b.scale.setScalar(SC*0.46); h.add(b); c = CHARS[k].build(b); c.holder = h; } catch (e) { c = null; }
    if (!c) return;
    const row = i < 9 ? 0 : 1, idx = i < 9 ? i : i - 9, n = i < 9 ? 9 : kinds.length - 9;
    const h = c.holder;
    h.position.set(wp.x - (n - 1) * 0.95 + idx * 1.9 + (row ? 0.95 : 0), RS_Y, -4.2 - row * 3.2);
    h.scale.setScalar(.001); h.visible = false; scene.add(h); R.items.push(h);
    if (c.props) for (const nm in c.props) c.props[nm].visible = false;
    R.icCrew.push({c, h, ph: i * 0.7});
  });
  // 飛機（載他從印度飛回台灣）
  R.icJet = null;
  try {
    if (typeof buildJet === 'function'){ const j = buildJet(); j.scale.setScalar(1.3); scene.add(j); R.items.push(j); R.icJet = j; }
  } catch (e) { R.icJet = null; }
  // 回到台灣就升旗
  {
    const ft = tex(96,64,(g)=>{
      g.fillStyle='#fe0000'; g.fillRect(0,0,96,64);
      g.fillStyle='#000095'; g.fillRect(0,0,48,32);
      g.fillStyle='#ffffff';
      g.save(); g.translate(24,16);
      for (let i=0;i<12;i++){ g.rotate(Math.PI/6); g.beginPath(); g.moveTo(-3.4,0); g.lineTo(0,-12); g.lineTo(3.4,0); g.closePath(); g.fill(); }
      g.restore();
      g.beginPath(); g.arc(24,16,6.4,0,7); g.fill();
      g.fillStyle='#000095'; g.beginPath(); g.arc(24,16,5.1,0,7); g.fill();
      g.fillStyle='#ffffff'; g.beginPath(); g.arc(24,16,4.2,0,7); g.fill();
    });
    const pole = new THREE.Group();
    pole.add(at(cyl(0.13,0.13,10,L({color:0xd8d4cc}),8),0,5,0));
    pole.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6), L({color:0xffe066})),0,10.1,0));
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(5.4,3.6),
      new THREE.MeshBasicMaterial({map:ft, side:THREE.DoubleSide, fog:false, transparent:true}));
    flag.position.set(2.8,8.2,0); pole.add(flag);
    pole.position.set(R.icHome.x + 6.5, RS_Y, R.icHome.z - 2.5); scene.add(pole); R.items.push(pole);
    R.icFlag = {pole, flag};
    pole.visible = false;
  }
  // 雲（飛回來的尾巴）
  R.icCloud = [];
  for (let i=0;i<7;i++){
    const m = new THREE.Mesh(new THREE.SphereGeometry(1.1 + rnd()*0.6, 8, 6), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.0, fog:false}));
    scene.add(m); R.items.push(m); R.icCloud.push(m);
  }
}
function icWinUpdate(R, dt, k){
  const W = R.W, m = W.m, hp = m.holder.position, P_ = m.props, H = R.icHome;
  for (const n in P_) P_[n].visible = false;
  if (R.t < 1.9){                                                              // 飛回台灣
    const u = R.t / 1.9;
    hp.x = H.x + 22 * (1 - u); hp.y = H.y + 9 * (1 - u * u); hp.z = H.z - 3 * (1 - u);
    m.holder.rotation.z = -0.25 * (1 - u);
    applyPose(m, POSE.icFly, k); m.setFace('laugh');
    if (R.icJet){ R.icJet.visible = true; R.icJet.position.set(hp.x + 0.6, hp.y + 1.5, hp.z - 1.3); R.icJet.rotation.z = -0.1 * (1 - u); }
    R.icCloud.forEach((c, i)=>{ const q = Math.max(0, u - i * .06); c.position.set(hp.x + 2.4 + i * 1.9, hp.y + 0.4 + Math.sin(i) * .7, hp.z - 1.4); c.material.opacity = Math.max(0, .55 - q * .55); });
    once('icw0', .25, ()=>{ SFX2.jet(); popAt('回來囉～', W, 9, 'big'); });
  } else {
    hp.x = H.x; hp.y = H.y; hp.z = H.z; m.holder.rotation.z = 0;
    if (R.icJet){ const q = R.t - 1.9; R.icJet.position.set(H.x + 0.6 - q*42, H.y + 1.5 + q*16, H.z - 1.3); R.icJet.visible = q < 0.9; }
    R.icCloud.forEach(c=>{ c.material.opacity = Math.max(0, c.material.opacity - dt); });
    if (R.icFlag && R.t > 2.1){                                              // 回到台灣，升旗
      const F = R.icFlag, q = Math.min(1, (R.t - 2.1) / 1.6);
      F.pole.visible = true;
      F.flag.position.y = -1.0 + 9.2 * q;                                    // 一路升到旗桿頂
      F.flag.position.z = Math.sin(R.t * 3) * .12;                            // 風吹
      F.flag.rotation.y = Math.sin(R.t * 2.2) * .12;
      once('icwF', 2.2, ()=>SFX2.fanfare());
    }
    if (R.t < 3.3){
      applyPose(m, POSE.icShout, k); m.setFace('shout');
      once('icw1', 2.0, ()=>{ SFX2.fanfare(); G.shake = reduce ? .1 : .4; popAt('This is Real Magical Moment!', W, 9.5, 'big'); });
    } else {
      applyPose(m, Math.sin(R.t * 9) > 0 ? POSE.cheer : POSE.thumbs, k); m.setFace('laugh');
      once('icw2', 3.5, ()=>SFX2.cheer());
      once('icw3', 3.9, ()=>popAt('謝謝你喜歡世志！', W, 9.5, 'big'));
      once('icw4', 5.0, ()=>popAt('老師最棒！', W, 8.5, 'big'));
    }
  }
  // 大家跳出來歡呼
  if (R.t > 3.0) for (const q of R.icCrew){
    const u = Math.min(1, (R.t - 3.0 - q.ph * .12) / .3);
    if (u <= 0) continue;
    q.h.visible = true; q.h.scale.setScalar(Math.max(.001, u * (1 + Math.sin(u * Math.PI) * .3)));
    applyPose(q.c, Math.sin(R.t * 8 + q.ph) > 0 ? POSE.cheer : POSE.peace, k);
    q.h.position.y = RS_Y + Math.max(0, Math.sin(R.t * 8 + q.ph)) * .7;
  }
}

/* =================== 戰敗：夢到被印度食物和印度人包圍，被睿睿拖去印度 =================== */
function icLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  R.icL = {x:lp.x, y:lp.y, z:lp.z};
  R.icDream = [];
  for (let i=0;i<6;i++){ const f = icFoodMesh(i % 5); f.visible = false; scene.add(f); R.items.push(f); R.icDream.push(f); }
  R.icFans = [];
  for (let i=0;i<3;i++){ const h = icBuildFan(); h.visible = false; h.position.set(lp.x, RS_Y + 1.55, lp.z); scene.add(h); R.items.push(h); R.icFans.push(h); }
  R.icSer = null;
  try {
    if (CHARS.serene){ const h = new THREE.Group(); const b = new THREE.Group(); b.scale.setScalar(SC); h.add(b); const c = CHARS.serene.build(b);
      if (c.props) for (const n in c.props) c.props[n].visible = false;
      h.position.set(lp.x - 9, RS_Y, lp.z + 1); scene.add(h); R.items.push(h); R.icSer = {c, h}; }
  } catch (e) { R.icSer = null; }
}
function icLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, hp = m.holder.position, L0 = R.icL;
  for (const n in m.props) m.props[n].visible = false;
  m.setFace('cry');
  if (R.t < 3.4){                                                              // 躺著做惡夢
    applyPose(m, POSE.flat, k); m.holder.rotation.z = 1.5; hp.y = L0.y + .5; hp.x = L0.x;
    once('icl0', .3, ()=>pop('Zzz…', L0.x - 2.6, RS_Y + 3.4, 'blue'));
    once('icl1', 1.0, ()=>{ SFX.icTabla(); pop('夢到印度了…', L0.x, RS_Y + 5.5, 'blue'); });
    // 食物繞著他轉
    R.icDream.forEach((f, i)=>{
      if (R.t < .8) return; f.visible = true;
      const a = R.t * 1.5 + i / 6 * Math.PI * 2;
      f.position.set(L0.x + Math.cos(a) * 4.4, RS_Y + 4.6 + Math.sin(a * 2) * .7, L0.z + Math.sin(a) * 2.4);
      f.rotation.y += dt * 2;
    });
    // 印度朋友圍過來跳舞
    R.icFans.forEach((h, i)=>{
      if (R.t < 1.6) return; h.visible = true;
      const a = -R.t * 1.1 + i / 3 * Math.PI * 2;
      h.position.set(L0.x + Math.cos(a) * 6.2, RS_Y + 1.55, L0.z + Math.sin(a) * 2.8 - 1);
      h.rotation.y = -a + Math.PI / 2;
      if (h.kid) applyPose(h.kid, Math.sin(R.t * 9 + i) > 0 ? POSE.cheer : POSE.peace, k);
    });
    once('icl2', 2.4, ()=>pop('不要啊～', L0.x, RS_Y + 6.5, 'big'));
  } else {                                                                     // 被睿睿拖走
    const u = Math.min(1, (R.t - 3.4) / 2.2);
    // 躺著被拖：頭朝 -x、腳朝 +x，身體跟著地面顛一下
    applyPose(m, POSE.flat, k); m.holder.rotation.z = -1.5 + Math.sin(R.t * 11) * .05;
    hp.x = L0.x - 14 * u; hp.y = L0.y + .5 + Math.abs(Math.sin(R.t * 11)) * .12;
    R.icDream.forEach(f=>f.visible = false);
    R.icFans.forEach((h, i)=>{ h.position.x = L0.x + 4 - 14 * u - i * 2.2; h.position.y = RS_Y + 1.55; if (h.kid) applyPose(h.kid, POSE.cheer, k); });
    if (R.icSer){
      const S = R.icSer, J = S.c.joints;
      // 睿睿倒退走，兩隻手真的抓著老師的腳踝
      S.h.position.set(hp.x - 4.0, RS_Y, L0.z + .35); S.h.rotation.y = Math.PI / 2;
      applyPose(S.c, POSE.icPull, k);
      const sw = Math.sin(R.t * 8);
      J.rHp.rotation.x = sw * .5; J.lHp.rotation.x = -sw * .5;
      J.rKn.rotation.x = Math.max(0, -sw) * .7; J.lKn.rotation.x = Math.max(0, sw) * .7;
      S.h.rotation.z = -.1 - sw * .03;
      if (S.c.setFace) try { S.c.setFace('normal'); } catch (e) {}
      // 拖行的灰塵
      if (Math.random() < dt * 12) burst(hp.x + 1.6, RS_Y + .2, 0xcfc4b0, 2, 3);
    }
    once('icl3', 3.6, ()=>{ SFX.icWhoosh(); popAt('睿睿：老師，再去一次印度啦！', Lz, 7.5, 'blue'); });
    once('icl4', 4.8, ()=>popAt('我還沒講完笑話…', Lz, 7, 'blue'));
  }
}

/* =================== 註冊 =================== */
registerChar('ichung', {
  stats: { name:'憶中', en:'I-Chung', tag:'機械系教授・壘球強打・脫口秀', weight:1.0, run:11, air:10, jumpV:26, djV:23, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'這個考試會考！'},
    side:{t:[.26,.1,.34], pose:['batWind','batHit'], box:[3.0,3.6,1.8], dmg:16, kb:13, sc:1.15, ang:34, prop:'bat', sfx:'batCrack', text:'全壘打！'},
    up:{t:[.2,.12,.3], pose:['icCarry','icCarryUp'], box:[0.6,7.0,1.9], dmg:13, kb:11, sc:1, ang:88, prop:'brick', sfx:'swing'},
    down:{t:[.24,.1,.34], pose:['bookUp','bookSlam'], box:[2.0,1.0,1.9], dmg:13, kb:9, sc:.9, ang:68, prop:'hammer', sfx:'icClang', text:'砸牆！',
          box2:{at:.3, dur:.12, box:[4.4,1.2,2.2], dmg:7, kb:7, sc:.5, ang:72}},
    nair:{t:[.06,.2,.16], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.12,.1,.22], pose:['batWind','batHit'], box:[2.4,3.4,1.6], dmg:11, kb:9, sc:.9, ang:38, air:1, prop:'bat', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.2,.1,.26], pose:['spikeWind','spikeHit'], box:[0.7,0.5,1.8], dmg:13, kb:7, sc:.8, ang:-66, air:1, prop:'hammer', sfx:'icClang'},
    nB:{t:[.26,.06,.36], pose:['throwWind','throwHit'], fire:[[.26,'icStudent']], air:1, sfx:'swing', text:'學生出列！'},
    sB:{t:[.1,.52,.3], pose:['icSpin','icSpin'], box:[1.9,4.0,2.4], dmg:9, kb:7, sc:.55, ang:48, dash:17, air:1, onHit:'icDizzy', sfx:'icWhoosh', text:'轉起來！'},
    uB:{t:[.05,.55,.12], pose:['icHeli','icHeli'], start:'icUp', prop:'hammer', box:[0.5,5.4,1.9], dmg:8, kb:8, sc:.5, ang:80, helpless:1, air:1, sfx:'icWhoosh'},
    dB:{t:[.18,.5,.32], pose:['icMic','icMic'], prop:'mic', box:[2.4,4.2,3.0], dmg:5, kb:3, sc:.2, ang:50, air:1, onHit:'icLaugh', sfx:'icPing', text:'這個笑話你們聽過嗎？'},
  },
  fire: {
    icStudent(f){
      const kind = icPickStudent();
      if (!kind) return;
      const h = icBuildStudent(kind);
      h.rotation.y = f.face > 0 ? Math.PI/2 : -Math.PI/2;
      const p = proj({owner:f, x:f.x + f.face*2.3, y:f.y + 1.5, vx:f.face*24, vy:0, g:0, r:1.5, life:1.15,
                      dmg:10, kb:10, sc:.8, ang:35, mesh:h});
      p.kid = h.kid;
      const nm = (CH[kind] && CH[kind].name) || '學生';
      pop(nm + '：老師我來了！', f.x, f.y + 7.5, 'big');
      SFX.icPing(); burst(f.x + f.face*1.4, f.y + 2, 0xffe066, 6, 5);
    },
  },
  start: { icUp(f){ f.vy = 36; f.vx = f.face*5; f.onGround = false; f.jumps = 0; f.ff = false; SFX.icWhoosh(); } },
  onhit: {
    icDizzy(att, v){ v.state = 'stun'; v.stunT = .55; v.move = null; pop('轉暈了', v.x, v.y + 7.5, 'blue'); },
    icLaugh(att, v){ v.state = 'stun'; v.stunT = .8; v.move = null; if (att) att.meter = Math.min(100, (att.meter || 0) + 8); pop('笑到站不起來', v.x, v.y + 7.5, 'blue'); },
  },
  poses: {
    icCarry:  S_({rSh:[-2.5,0,-0.25], lSh:[-2.5,0,0.25], rEl:[-0.7], lEl:[-0.7], chest:[-0.1], rKn:[0.35], lKn:[0.35], drop:-0.25}),
    icCarryUp:S_({rSh:[-3.0,0,-0.1], lSh:[-3.0,0,0.1], rEl:[-0.1], lEl:[-0.1], chest:[-0.35], head:[-0.3], drop:0.1}),
    icSpin:   S_({rSh:[0,0,-1.5], lSh:[0,0,1.5], rEl:[-0.25], lEl:[-0.25], chest:[0,0,0], rKn:[0.2], lKn:[0.2], drop:-0.05}),
    icMic:    S_({rSh:[-2.0,0,-0.3], rEl:[-1.45], rHd:[0,0.35,0], lSh:[-0.65,0,0.55], lEl:[-1.1], head:[0,0,0.05], chest:[0,0.12,0]}),
    icPhone:  S_({rSh:[-1.35,0,-0.35], rEl:[-1.6], lSh:[-1.2,0,0.4], lEl:[-1.75], head:[0.28], chest:[0.12]}),
    icHeli:   S_({rSh:[-2.9,0,-0.2], lSh:[-1.0,0,0.9], rEl:[-0.2], lEl:[-0.6], rHp:[-0.25], lHp:[-0.15], rKn:[0.5], lKn:[0.4], drop:0}),
    icFly:    S_({rSh:[-2.9,0,-0.45], lSh:[-2.9,0,0.45], rEl:[0], lEl:[0], rHp:[0.35], lHp:[0.3], rKn:[-0.25], lKn:[-0.2], chest:[-0.2], head:[-0.25], drop:0}),
    icPull:   S_({rSh:[-1.35,0,-0.28], lSh:[-1.3,0,0.28], rEl:[-0.25], lEl:[-0.25], chest:[0.3], head:[0.2], drop:-0.3, rKn:[0.3], lKn:[0.3]}),
    icShout:  S_({rSh:[-2.7,0,-0.5], lSh:[-2.7,0,0.5], rEl:[-0.3], lEl:[-0.3], head:[-0.3], chest:[-0.2], rKn:[0.15], lKn:[0.15], drop:-0.1}),
  },
  sfx: {
    icWhoosh(){ noise(.26,.16,900); tone(300,.22,'sine',.06,180); },
    icClang(){ tone(220,.16,'square',.1,-90); noise(.18,.2,2400); tone(880,.12,'triangle',.05,-300); },
    icPing(){ tone(880,.1,'sine',.08); tone(1320,.12,'sine',.06,0,.07); },
    icTabla(){ tone(180,.12,'sine',.12,-60); noise(.08,.08,700); },
    icMagic(){ for (let i=0;i<6;i++) tone(440 * Math.pow(1.26, i), .5, 'triangle', .055, 60, i * .05); noise(.5,.08,1600); },
  },
  build: buildIchung, face: icFaces.normal, portraitBg: '#86aee6',
  portrait(g){                                                                 // 短黑髮＋後退的髮線
    g.fillStyle = '#17120f';
    g.fillRect(10,6,44,13); g.fillRect(6,12,10,16); g.fillRect(48,12,10,16);
    g.fillStyle = IC_SKIN; g.fillRect(18,6,10,7); g.fillRect(36,6,10,7);
  },
  skins: [
    { name:'漁夫帽白T', apply(c){ c.setOutfit('white'); c.setHat(true); },
      portrait(g){ g.fillStyle = '#cbb28c'; g.fillRect(2,16,60,7); g.fillRect(14,6,36,11); } },
    { name:'灰藍 Polo', apply(c){ c.setOutfit('polo'); },
      portrait(g){ g.fillStyle = IC_POLO; g.fillRect(14,54,36,10); } },
    { name:'生日帽', hat:['#1f6fc4','#ffe066','#ffffff'], apply(c){ const h = birthdayHat('#1f6fc4','#ffe066',0xffffff); h.position.set(0.04,0.7,-0.02); c.head.add(h); } },
  ],
  // 防禦：套上機器人裝甲（機械系的本行）
  shield(){
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(3.2,12,8), new THREE.MeshBasicMaterial({color:0x9fd9ff, transparent:true, opacity:.2, depthWrite:false})));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.9,0.18,6,18), new THREE.MeshBasicMaterial({color:0x6fe3ff, transparent:true, opacity:.6, depthWrite:false}));
    ring.rotation.x = Math.PI/2; g.add(ring);
    return g;
  },
  shieldAnim(f){ f.shieldMesh.position.set(f.x, f.y + 2.8, 0); f.shieldMesh.rotation.y += .18; },
  shieldPose: 'block', shieldProp: null, breakText: '裝甲爆開了！', brokePose: 'dizzy',
  finalPose: 'laughUp', finalProp: null,
  animate(f, m, s, t, dt){
    // 表情
    if (s === 'final') m.setFace('laugh');
    else if (s === 'move' && f.moveId === 'dB') m.setFace('laugh');
    else if (s === 'move' && (f.moveId === 'side' || f.moveId === 'down')) m.setFace('shout');
    else if (f.sobbing > 0) m.setFace('cry');
    else m.setFace('normal');
    // 防禦時穿上裝甲
    if (m.setArmor) m.setArmor(s === 'shield');
    if (s === 'shield' && m.armorCore) m.armorCore.material.color.setHSL(.53, 1, .55 + Math.sin(t * 10) * .12);
    // 側必殺：真的轉圈圈，還會把旁邊的人捲進來
    if (s === 'move' && f.moveId === 'sB'){
      m.body.rotation.y += dt * 22;
      for (const v of G.fighters){
        if (v === f || v.state === 'dead') continue;
        const d = v.x - f.x;
        if (Math.abs(d) < 7 && Math.abs(v.y - f.y) < 6) v.vx -= Math.sign(d) * dt * 16;
      }
      if (Math.random() < dt * 20) spark(f.x + (Math.random() - .5) * 3, f.y + 2 + Math.random() * 3, .8);
    } else if (m.body.rotation.y) {
      m.body.rotation.y = 0;
    }
    // 跑出來的印度朋友要跑步
    for (const p of G.projs) if (p.owner === f && p.kid) applyPose(p.kid, runPose(p.t * 16), 1);
  },
  introPose: 'thumbs', readyPose: (t)=> Math.sin(t * 10) > 0 ? POSE.cheer : POSE.laugh, selectSfx: ()=>SFX.whistle(),
  winSub: '"This is a magical moment."',
  final: icFinal, winSetup: icWinSetup, winUpdate: icWinUpdate, loseSetup: icLoseSetup, loseUpdate: icLoseUpdate,
  longWin: true, longLose: true,
});
