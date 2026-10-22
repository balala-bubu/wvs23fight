/* Ten（kelsey）— 愛笑、BeReal、哲學系。loaded after js/core.js；所有東西都在這個檔。 */
'use strict';

/* ---------- textures ---------- */
const KEL_SKIN = '#f3d3b6', KEL_SKIN_C = ['#ead0ae','#f9dec6','#efd0b0'];
const KEL_HAIR = '#241a16';
const kelSkinTex = tex(16,16,(g)=>speckle(g,16,16,KEL_SKIN,KEL_SKIN_C,.36));
const kelHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,KEL_HAIR,['#2f231c','#1a1210','#3a2a21'],.42);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(10,6,4,.2)' : 'rgba(190,150,110,.12)'; g.fillRect(x + ((x*7)%3) - 1, 0, 1, 32); }
  const gr = g.createLinearGradient(0,0,0,32); gr.addColorStop(0,'rgba(255,230,200,.16)'); gr.addColorStop(.5,'rgba(0,0,0,.25)'); gr.addColorStop(1,'rgba(120,88,62,.2)');
  g.fillStyle = gr; g.fillRect(0,0,32,32);
});

function kelFace(g, mode){
  speckle(g,64,64,KEL_SKIN,KEL_SKIN_C,.28); shadeFace(g);
  g.fillStyle = '#2a1b14';
  if (mode==='serious'){ g.fillRect(14,24,11,2); g.fillRect(39,24,11,2); }
  else { g.fillRect(14,26,11,2); g.fillRect(39,26,11,2); }
  g.strokeStyle = '#17100c'; g.lineWidth = 2.2;
  const smileEye = (x)=>{ g.beginPath(); g.arc(x,39,5.2,Math.PI*1.08,Math.PI*1.92); g.stroke(); };          // ^ ^ 笑眼
  const openEye = (x, half)=>{
    g.fillStyle='#fbf6f1'; g.beginPath(); g.ellipse(x,37,5,half?2.8:4,0,0,7); g.fill();
    g.fillStyle='#201310'; g.beginPath(); g.ellipse(x,37.4,3.1,half?2.5:3.3,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35.4,1.4,1.4);
  };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.6,Math.PI*.15,Math.PI*.85); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='shout'){ openEye(20); openEye(44); }
  else if (mode==='serious'){ openEye(20,true); openEye(44,true); }
  else { smileEye(20); smileEye(44); }                                                                      // normal / grin 都是笑眼
  g.fillStyle='rgba(165,105,80,.28)'; g.fillRect(30,42,4,4);                                                // nose
  // 腮紅
  if (mode!=='serious'){ g.fillStyle='rgba(240,150,150,.22)'; g.beginPath(); g.ellipse(14,45,6,4,0,0,7); g.fill(); g.beginPath(); g.ellipse(50,45,6,4,0,0,7); g.fill(); }
  // 嘴巴：預設大大的笑
  if (mode==='serious'){ g.strokeStyle='#a4434a'; g.lineWidth=2.2; g.beginPath(); g.moveTo(27,50); g.lineTo(37,50); g.stroke(); }
  else if (mode==='cry'){ g.strokeStyle='#a4434a'; g.lineWidth=2.4; g.beginPath(); g.arc(32,55,6,Math.PI*1.1,Math.PI*1.9); g.stroke(); }
  else {
    const big = mode==='grin' || mode==='shout';
    g.fillStyle='#8c2b33'; g.beginPath(); g.ellipse(32,50, big?9:7.5, big?6:4.2, 0, 0, Math.PI); g.fill();
    g.fillStyle='#fdfaf5'; g.fillRect(24.5,47.2, big?15:15, big?3:2.6);                                     // 牙齒
    if (big){ g.fillStyle='#d4707a'; g.beginPath(); g.ellipse(32,54.4,4,2,0,0,7); g.fill(); }
  }
}
const kelFaces = {
  normal:tex(64,64,(g)=>kelFace(g,'normal')), grin:tex(64,64,(g)=>kelFace(g,'grin')),
  cry:tex(64,64,(g)=>kelFace(g,'cry')), dizzy:tex(64,64,(g)=>kelFace(g,'dizzy')),
  shout:tex(64,64,(g)=>kelFace(g,'shout')), serious:tex(64,64,(g)=>kelFace(g,'serious')),
};

/* 上衣：橄欖綠無袖（照片一，預設）／咖啡短袖／白長袖／黑羽絨／西裝 */
const KEL_OLIVE = '#8d9068';
const kelNeckDraw = (g)=>{ g.strokeStyle='#dfe3ea'; g.lineWidth=1.2; g.beginPath(); g.moveTo(13,0); g.quadraticCurveTo(16,13,19,0); g.stroke(); g.fillStyle='#eef1f6'; g.beginPath(); g.arc(16,12.5,1.6,0,7); g.fill(); };
const kelOliveTex = tex(32,32,(g)=>{ speckle(g,32,32,KEL_OLIVE,['#979a71','#80835e'],.4); });
const kelOliveFront = tex(32,32,(g)=>{ speckle(g,32,32,KEL_OLIVE,['#979a71','#80835e'],.4); g.fillStyle='rgba(0,0,0,.14)'; g.beginPath(); g.ellipse(16,0,9,5,0,0,7); g.fill(); kelNeckDraw(g); });
const KEL_BROWN = '#4a352b';
const kelBrownTex = tex(32,32,(g)=>speckle(g,32,32,KEL_BROWN,['#553e32','#3f2d25'],.4));
const kelBrownFront = tex(32,32,(g)=>{ speckle(g,32,32,KEL_BROWN,['#553e32','#3f2d25'],.4); g.fillStyle='rgba(0,0,0,.18)'; g.fillRect(11,0,10,3); kelNeckDraw(g); });
const kelWhiteTex = tex(32,32,(g)=>{ speckle(g,32,32,'#f4f1ea',['#fbf9f3','#e6e2d9'],.33); g.strokeStyle='rgba(185,180,168,.4)'; g.lineWidth=1; for (let y=3;y<32;y+=5){ g.beginPath(); g.moveTo(0,y); g.lineTo(32,y); g.stroke(); } });
const kelWhiteFront = tex(32,32,(g)=>{ speckle(g,32,32,'#f4f1ea',['#fbf9f3','#e6e2d9'],.33); g.fillStyle='#e8e4da'; g.beginPath(); g.ellipse(16,1,7,4,0,0,7); g.fill(); });
const kelPuffTex = tex(32,32,(g)=>{ speckle(g,32,32,'#1c1f24',['#262a30','#15181c'],.4); g.fillStyle='rgba(255,255,255,.07)'; for (let y=3;y<32;y+=6) g.fillRect(0,y,32,1); g.fillStyle='rgba(0,0,0,.35)'; for (let y=4;y<32;y+=6) g.fillRect(0,y,32,2); });
const kelPuffFront = tex(32,32,(g)=>{ speckle(g,32,32,'#1c1f24',['#262a30','#15181c'],.4); g.fillStyle='rgba(255,255,255,.07)'; for (let y=3;y<32;y+=6) g.fillRect(0,y,32,1); g.fillStyle='#2e3238'; g.fillRect(15,0,2,32); g.fillStyle='#9aa0a8'; for (let y=2;y<32;y+=3) g.fillRect(15,y,2,1); });
const KEL_SUIT = '#2b3142';
const kelSuitTex = tex(32,32,(g)=>speckle(g,32,32,KEL_SUIT,['#333a4d','#242939'],.35));
const kelSuitFront = tex(32,32,(g)=>{
  speckle(g,32,32,KEL_SUIT,['#333a4d','#242939'],.35);
  g.fillStyle='#f2f0ea'; g.beginPath(); g.moveTo(12,0); g.lineTo(20,0); g.lineTo(18,18); g.lineTo(14,18); g.closePath(); g.fill();   // 襯衫
  g.fillStyle='#8d2f3c'; g.beginPath(); g.moveTo(14,4); g.lineTo(18,4); g.lineTo(17.5,20); g.lineTo(14.5,20); g.closePath(); g.fill(); // 領帶
  g.fillStyle='#1e2332'; g.beginPath(); g.moveTo(12,0); g.lineTo(6,14); g.lineTo(11,16); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(20,0); g.lineTo(26,14); g.lineTo(21,16); g.closePath(); g.fill();
});
const kelNavyPants = tex(32,32,(g)=>{ speckle(g,32,32,'#232a3d',['#2b3348','#1d2334'],.4); g.fillStyle='rgba(220,228,245,.35)'; for (let x=2;x<32;x+=6) g.fillRect(x,0,1,32); });
const kelCreamPants = tex(32,32,(g)=>{ speckle(g,32,32,'#e4dcc9',['#ece5d4','#d7cdb8'],.4); g.fillStyle='rgba(150,138,112,.2)'; for (let x=1;x<32;x+=3) g.fillRect(x,0,1,32); });
const kelDarkPants = tex(32,32,(g)=>speckle(g,32,32,'#3a3028',['#443a31','#302821'],.45));

/* 道具貼圖 */
const kelMatTex = tex(32,32,(g)=>{ g.fillStyle='#e9e4d6'; g.fillRect(0,0,32,32); g.fillStyle='#c9566a'; for (let y=0;y<32;y+=8) for (let x=0;x<32;x+=8) if (((x+y)/8)%2===0) g.fillRect(x,y,8,8); g.fillStyle='rgba(0,0,0,.12)'; g.fillRect(0,0,32,2); });
/* BeReal 版型：大張後鏡頭照＋左上角小框自拍＋下面 BeReal. */
function kelBeReal(g, W, H){
  g.fillStyle='#10131a'; g.fillRect(0,0,W,H);
  const px = W*0.06, py = H*0.08, pw = W*0.88, ph = H*0.72;
  g.fillStyle='#6f8fa8'; g.fillRect(px,py,pw,ph*0.45);                                   // 天空
  g.fillStyle='#8f8575'; g.fillRect(px,py+ph*0.45,pw,ph*0.55);                           // 地磚
  g.strokeStyle='rgba(255,255,255,.18)'; g.lineWidth=1;
  for (let x=px;x<px+pw;x+=pw/5){ g.beginPath(); g.moveTo(x,py+ph*0.45); g.lineTo(x,py+ph); g.stroke(); }
  const face = (cx,cy,r,col,bottom)=>{                                                   // 一群在笑的人（身體只畫到框底）
    g.fillStyle='#241a16'; g.beginPath(); g.arc(cx,cy-r*0.25,r*1.25,Math.PI,0); g.fill();
    g.fillStyle='#f3d3b6'; g.beginPath(); g.arc(cx,cy,r,0,7); g.fill();
    g.strokeStyle='#3a2a20'; g.lineWidth=Math.max(1,r*0.22);
    g.beginPath(); g.arc(cx-r*0.4,cy-r*0.05,r*0.3,Math.PI*1.1,Math.PI*1.9); g.stroke();
    g.beginPath(); g.arc(cx+r*0.4,cy-r*0.05,r*0.3,Math.PI*1.1,Math.PI*1.9); g.stroke();
    g.fillStyle='#8c2b33'; g.beginPath(); g.ellipse(cx,cy+r*0.42,r*0.42,r*0.3,0,0,Math.PI); g.fill();
    g.fillStyle=col; g.fillRect(cx-r*1.0, cy+r*1.1, r*2.0, Math.max(0, bottom - (cy+r*1.1)));
  };
  const pb = py + ph;
  face(px+pw*0.52, py+ph*0.62, Math.min(W,H)*0.085, '#f2efe6', pb);
  face(px+pw*0.26, py+ph*0.70, Math.min(W,H)*0.07, '#cfd6dd', pb);
  face(px+pw*0.76, py+ph*0.66, Math.min(W,H)*0.065, '#2a2a30', pb);
  // 左上角小框（前鏡頭）
  const iw = pw*0.34, ih = ph*0.34, ix = px + pw*0.04, iy = py + ph*0.04;
  g.fillStyle='#10131a'; g.fillRect(ix-2,iy-2,iw+4,ih+4);
  g.fillStyle='#55707f'; g.fillRect(ix,iy,iw,ih);
  face(ix+iw*0.5, iy+ih*0.52, Math.min(iw,ih)*0.26, '#f2efe6', iy+ih);
  g.fillStyle='#f4f2ed'; g.font='bold ' + Math.round(H*0.08) + 'px sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText('BeReal.', W/2, py+ph+ (H-py-ph)*0.45);
}
const kelPhoneScr = tex(36,64,(g)=>kelBeReal(g,36,64));
const kelReportTex = tex(96,72,(g)=>{
  g.fillStyle='#fdfbf4'; g.fillRect(0,0,96,72); g.fillStyle='#2b3142'; g.fillRect(0,0,96,10);
  g.fillStyle='#fdfbf4'; g.font='bold 7px sans-serif'; g.textAlign='left'; g.fillText('FINANCIAL REPORT',4,8);
  g.fillStyle='#8a8578'; for (let y=16;y<44;y+=5){ g.fillRect(5,y,40,1.6); }
  g.strokeStyle='#4f7fd0'; g.lineWidth=2; g.beginPath(); g.moveTo(52,40); g.lineTo(62,30); g.lineTo(72,34); g.lineTo(88,16); g.stroke();
  g.fillStyle='#2f9e52'; [[52,52],[60,48],[68,54],[76,44],[84,50]].forEach(([x,y])=>g.fillRect(x,y,6,72-y-4));
  g.fillStyle='#b23a48'; g.font='bold 9px sans-serif'; g.fillText('+ 128%',5,56);
});
const kelPlanTex = tex(48,64,(g)=>{
  g.fillStyle='#fdfaf0'; g.fillRect(0,0,48,64); g.strokeStyle='#c9c2ae'; g.lineWidth=1.5; g.strokeRect(2,2,44,60);
  g.fillStyle='#3a6ea5'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.fillText('教案',24,13);
  g.fillStyle='#8a8578'; for (let y=20;y<58;y+=5) g.fillRect(6,y,36 - (y%10?0:12),1.6);
  g.strokeStyle='#c0392b'; g.lineWidth=1.6; g.beginPath(); g.moveTo(8,34); g.lineTo(40,30); g.stroke(); g.fillStyle='#c0392b'; g.font='bold 8px sans-serif'; g.fillText('再修一次',24,45);
});
const kelHwTex = tex(48,64,(g)=>{
  g.fillStyle='#fbf7ea'; g.fillRect(0,0,48,64); g.strokeStyle='#cfc8b4'; g.lineWidth=1.2; g.strokeRect(2,2,44,60);
  g.fillStyle='#8a8578'; for (let y=12;y<58;y+=5) g.fillRect(6,y,36,1.4);
  g.fillStyle='#c0392b'; g.font='bold 14px sans-serif'; g.textAlign='center'; g.fillText('作業',24,34);
});
const kelPhotoTex = tex(64,80,(g)=>kelBeReal(g,64,80));
/* 野餐食物（中必殺）*/
const KEL_FOODS = [
  {n:'牛奶', t:tex(40,40,(g)=>{ g.fillStyle='#f4f1e8'; g.fillRect(9,6,22,30); g.fillStyle='#4f7fd0'; g.fillRect(9,6,22,7); g.fillStyle='#9aa7b8'; g.fillRect(9,33,22,3); g.fillStyle='#3a4a66'; g.font='bold 8px sans-serif'; g.textAlign='center'; g.fillText('MILK',20,26); })},
  {n:'漢堡', t:tex(40,40,(g)=>{ g.fillStyle='#d99a4e'; g.beginPath(); g.ellipse(20,14,14,8,0,Math.PI,0); g.fill(); g.fillStyle='#7cb342'; g.fillRect(6,20,28,3); g.fillStyle='#8a4b32'; g.fillRect(7,23,26,5); g.fillStyle='#e0a95c'; g.beginPath(); g.ellipse(20,30,14,5,0,0,Math.PI); g.fill(); })},
  {n:'薯條', t:tex(40,40,(g)=>{ g.fillStyle='#c0392b'; g.beginPath(); g.moveTo(10,18); g.lineTo(30,18); g.lineTo(27,36); g.lineTo(13,36); g.closePath(); g.fill(); g.fillStyle='#f2c14e'; [12,17,22,26].forEach((x,i)=>g.fillRect(x,6+i%2*3,4,14)); })},
  {n:'披薩', t:tex(40,40,(g)=>{ g.fillStyle='#e8c07a'; g.beginPath(); g.moveTo(20,4); g.lineTo(34,34); g.lineTo(6,34); g.closePath(); g.fill(); g.fillStyle='#e2a84b'; g.fillRect(6,31,28,4); g.fillStyle='#c0392b'; [[20,16],[15,26],[25,26]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,3,0,7); g.fill(); }); })},
  {n:'三明治', t:tex(40,40,(g)=>{ g.fillStyle='#eccf95'; g.beginPath(); g.moveTo(6,32); g.lineTo(20,8); g.lineTo(34,32); g.closePath(); g.fill(); g.fillStyle='#7cb342'; g.fillRect(9,26,22,3); g.fillStyle='#e07a5f'; g.fillRect(11,22,18,3); })},
  {n:'沙拉', t:tex(40,40,(g)=>{ g.fillStyle='#e9e4d6'; g.beginPath(); g.ellipse(20,24,15,9,0,0,7); g.fill(); g.fillStyle='#5aa83c'; [[13,20],[20,17],[27,21],[16,25],[24,25]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,5,0,7); g.fill(); }); g.fillStyle='#d94f4f'; g.beginPath(); g.arc(22,21,3,0,7); g.fill(); })},
  {n:'柚子', t:tex(40,40,(g)=>{ g.fillStyle='#b5c23f'; g.beginPath(); g.ellipse(20,23,13,12,0,0,7); g.fill(); g.fillStyle='rgba(255,255,255,.18)'; g.beginPath(); g.arc(15,18,4,0,7); g.fill(); g.fillStyle='#4a7a2a'; g.fillRect(18,8,4,5); g.beginPath(); g.ellipse(26,11,5,3,.4,0,7); g.fill(); })},
];
const kelScissorTex = tex(40,40,(g)=>{
  g.strokeStyle='#b8bcc4'; g.lineWidth=4; g.beginPath(); g.moveTo(10,6); g.lineTo(26,28); g.stroke(); g.beginPath(); g.moveTo(30,6); g.lineTo(14,28); g.stroke();
  g.strokeStyle='#e0533a'; g.lineWidth=3.5; g.beginPath(); g.arc(13,32,5,0,7); g.stroke(); g.beginPath(); g.arc(27,32,5,0,7); g.stroke();
  g.fillStyle='#8f949c'; g.beginPath(); g.arc(20,19,2.4,0,7); g.fill();
});
/* 野餐食物的立體模型（丟出去會轉） */
function kelFood3D(n){
  const g = new THREE.Group(), M = (c)=>L({color:c});
  if (n==='牛奶'){
    g.add(at(rbox(0.62,0.95,0.62,.08,M(0xf4f1e8)),0,0,0));
    g.add(at(rbox(0.64,0.3,0.64,.05,M(0x4f7fd0)),0,0.32,0));
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0,0.44,0.34,4,1), M(0xf4f1e8)); roof.rotation.y = Math.PI/4; roof.position.y = 0.64; g.add(roof);
    g.add(at(rbox(0.06,0.12,0.5,.2,M(0xf4f1e8)),0,0.84,0));
    g.add(at(rbox(0.34,0.16,0.02,.1,M(0x3a4a66)),0,-0.05,0.32));
  } else if (n==='漢堡'){
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.62,14,8,0,Math.PI*2,0,Math.PI/2), M(0xd99a4e)); top.scale.set(1,.7,1); top.position.y = 0.22; g.add(top);
    [[-.2,.52],[.18,.56],[0,.44],[.3,.4]].forEach(([x,y])=>g.add(at(rbox(0.07,0.03,0.05,.3,M(0xfaf0d0)),x,y,0.32)));
    g.add(at(cyl(0.66,0.66,0.08,M(0x7cb342),14),0,0.17,0));
    g.add(at(cyl(0.6,0.6,0.08,M(0xd94f4f),14),0,0.1,0));
    g.add(at(cyl(0.6,0.6,0.18,M(0x7a3b22),14),0,-0.02,0));
    g.add(at(cyl(0.62,0.58,0.22,M(0xe0a95c),14),0,-0.22,0));
    g.rotation.x = 0.3;
  } else if (n==='薯條'){
    g.add(at(cyl(0.42,0.3,0.7,M(0xc0392b),4),0,-0.15,0).rotateY(Math.PI/4));
    g.add(at(rbox(0.42,0.1,0.02,.2,M(0xf2c14e)),0,-0.1,0.3));
    for (let i=0;i<7;i++){ const fr = rbox(0.09,0.75,0.09,.2,M(0xf2c14e)); fr.position.set(-0.24 + i*0.08, 0.35 + (i%3)*0.06, (i%2)*0.1 - 0.05); fr.rotation.z = (i-3)*0.06; g.add(fr); }
  } else if (n==='披薩'){
    const sh = new THREE.Shape(); sh.moveTo(0,0.75); sh.lineTo(0.6,-0.5); sh.lineTo(-0.6,-0.5); sh.closePath();
    const sl = new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:0.12, bevelEnabled:false}), M(0xe8c07a)); sl.position.z = -0.06; g.add(sl);
    g.add(at(rbox(1.3,0.2,0.22,.5,M(0xd99a4e)),0,-0.52,0));
    [[0,.25],[-.2,-.15],[.22,-.12]].forEach(([x,y])=>{ const p = cyl(0.12,0.12,0.04,M(0xc0392b),10); p.rotation.x = Math.PI/2; p.position.set(x,y,0.08); g.add(p); });
    [[-.1,.0],[.1,.3]].forEach(([x,y])=>g.add(at(rbox(0.1,0.08,0.03,.3,M(0x4f9a3c)),x,y,0.08)));
  } else if (n==='三明治'){
    [[0xeccf95,0],[0x7cb342,0.13],[0xe07a5f,0.22],[0xf4c430,0.3],[0xeccf95,0.43]].forEach(([c,y],i)=>{
      const sh = new THREE.Shape(); sh.moveTo(-0.62,-0.45); sh.lineTo(0.62,-0.45); sh.lineTo(0,0.55); sh.closePath();
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth: i%4===0 ? 0.12 : 0.07, bevelEnabled:false}), M(c)); m.rotation.x = -Math.PI/2; m.position.y = y; g.add(m);
    });
    g.rotation.x = 1.0;
  } else if (n==='沙拉'){
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.62,16,8,0,Math.PI*2,Math.PI/2,Math.PI/2), new THREE.MeshLambertMaterial({color:0xe9e4d6, side:THREE.DoubleSide})); g.add(bowl);
    [[-.25,.05],[.2,.1],[0,-.2],[.3,-.15],[-.2,-.25]].forEach(([x,z],i)=>g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.2,8,6), M(i%2 ? 0x5aa83c : 0x7cc44e)),x,0.05,z)));
    [[.1,.0],[-.15,.15]].forEach(([x,z])=>g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6), M(0xd94f4f)),x,0.16,z)));
    g.rotation.x = 0.5;
  } else if (n==='柚子'){
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.6,16,12), M(0xb5c23f)); b.scale.set(1,.92,1); g.add(b);
    g.add(at(cyl(0.05,0.06,0.2,M(0x4a7a2a),6),0,0.6,0));
    const lf = rbox(0.4,0.04,0.2,.5,M(0x4a7a2a)); lf.position.set(0.2,0.66,0); lf.rotation.z = 0.4; g.add(lf);
  }
  return g;
}
function kelScissor3D(){
  const g = new THREE.Group(), steel = L({color:0xb8bcc4}), red = L({color:0xe0533a});
  [-1,1].forEach(s=>{
    const arm = new THREE.Group(); arm.rotation.z = s*0.35; g.add(arm);
    arm.add(at(rbox(0.12,1.1,0.05,.3,steel),0,0.45,s*0.03));
    const h = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.07,6,12), red); h.position.set(0,-0.32,s*0.03); arm.add(h);
  });
  g.add(at(cyl(0.07,0.07,0.16,L({color:0x8f949c}),8),0,0,0).rotateX(Math.PI/2));
  return g;
}
const KEL_PHIL = ['亞里斯多德','蘇格拉底','柏拉圖','莊子'];
const kelBustNameTex = KEL_PHIL.map(n=>tex(64,20,(g)=>{ g.fillStyle='#d8d2c4'; g.fillRect(0,0,64,20); g.fillStyle='#3a342c'; g.font='bold 11px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(n,32,11); }));

const kelStoneFaceTex = tex(48,56,(g)=>{
  g.clearRect(0,0,48,56);
  g.fillStyle='rgba(120,114,100,.55)'; g.fillRect(9,12,8,5); g.fillRect(31,12,8,5);           // 眉骨陰影
  g.fillStyle='#8c8778'; g.beginPath(); g.ellipse(14,19,4.5,3,0,0,7); g.fill(); g.beginPath(); g.ellipse(34,19,4.5,3,0,0,7); g.fill();
  g.fillStyle='rgba(90,85,74,.7)'; g.fillRect(22,18,4,14);                                     // 鼻子
  g.fillStyle='#7d786a'; g.fillRect(18,37,12,2.6);                                             // 嘴
});

/* ---------- 小物件 ---------- */
const kelStoneM = L({color:0xd6d2c6}), kelStoneD = L({color:0xb4b0a4}), kelDarkM = L({color:0x1b1e24});
function kelPhone(s){
  const g = new THREE.Group();
  g.add(rbox(0.52*s,1.0*s,0.1*s,.2,kelDarkM));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.42*s,0.84*s), new THREE.MeshBasicMaterial({map:kelPhoneScr, fog:false}));
  scr.position.z = 0.06*s; g.add(scr);
  return g;
}
function kelBust(s, i){
  const g = new THREE.Group();
  g.add(at(rbox(1.15*s,0.3*s,0.9*s,.1,kelStoneD),0,-1.25*s,0));                               // 底座
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.0*s,0.3*s), new THREE.MeshBasicMaterial({map:kelBustNameTex[(i||0)%4], fog:false}));
  nm.position.set(0,-1.25*s,0.47*s); g.add(nm);
  g.add(at(rbox(1.0*s,0.9*s,0.75*s,.3,kelStoneM),0,-0.65*s,0));                                // 胸
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.46*s,10,8), kelStoneM),0,0.15*s,0));      // 頭
  const fc = new THREE.Mesh(new THREE.PlaneGeometry(0.72*s,0.84*s), new THREE.MeshBasicMaterial({map:kelStoneFaceTex, transparent:true, fog:false}));
  fc.position.set(0,0.0*s,0.44*s); g.add(fc);                                                  // 石像的臉
  g.add(at(rbox(0.34*s,0.4*s,0.3*s,.4,kelStoneD),0,-0.3*s,0.26*s));                            // 鬍子
  g.add(at(rbox(0.92*s,0.26*s,0.86*s,.5,kelStoneD),0,0.42*s,-0.03*s));                         // 頭髮
  return g;
}
function kelMat(s){
  const g = new THREE.Group();
  const m = rbox(0.42*s,2.3*s,0.42*s,.3,L({map:kelMatTex}));                                    // 捲起來的野餐墊
  g.add(m);
  return g;
}
function kelMic(s){
  const g = new THREE.Group();
  g.add(at(cyl(0.08*s,0.09*s,1.1*s,kelDarkM,8),0,-0.55*s,0));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.2*s,10,8), L({color:0x9aa0a8})),0,0.05*s,0));
  return g;
}
function kelLaptop(s){
  const g = new THREE.Group();
  const base = rbox(1.5*s,0.12*s,1.0*s,.1,kelDarkM); base.position.y = 0.06*s; g.add(base);
  const lid = rbox(1.5*s,1.0*s,0.1*s,.1,kelDarkM); lid.position.set(0,0.55*s,-0.48*s); lid.rotation.x = -0.25; g.add(lid);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.3*s,0.82*s), new THREE.MeshBasicMaterial({map:kelPlanTex, fog:false}));
  scr.position.set(0,0.55*s,-0.41*s); scr.rotation.x = -0.25; g.add(scr);
  return g;
}
function kelDesk(s){                                                                            // 國小課桌椅
  const g = new THREE.Group();
  const woodM = L({color:0xc8a06a}), legM = L({color:0x6f7681});
  const top = rbox(2.6*s,0.2*s,1.6*s,.1,woodM); top.position.y = 1.7*s; g.add(top);
  [-1,1].forEach(a=>[-1,1].forEach(b=>{ const lg = cyl(0.08*s,0.08*s,1.7*s,legM,6); lg.position.set(a*1.1*s,0.85*s,b*0.6*s); g.add(lg); }));
  const seat = rbox(1.5*s,0.18*s,1.3*s,.1,woodM); seat.position.set(0,1.0*s,1.6*s); g.add(seat);
  const back = rbox(1.5*s,0.9*s,0.16*s,.1,woodM); back.position.set(0,1.6*s,2.2*s); g.add(back);
  [-1,1].forEach(a=>[-1,1].forEach(b=>{ const lg = cyl(0.07*s,0.07*s,1.0*s,legM,6); lg.position.set(a*0.6*s,0.5*s,1.6*s + b*0.5*s); g.add(lg); }));
  const lap = kelLaptop(1.0*s); lap.position.set(0,1.8*s,0); g.add(lap);
  return g;
}
function kelGlasses(s){
  const g = new THREE.Group();
  const fm = L({color:0x2a2a30});
  [-1,1].forEach(a=>{
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.24*s,0.035*s,6,14), fm);
    r.position.set(a*0.27*s,0,0.5*s); g.add(r);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.23*s,12), new THREE.MeshBasicMaterial({color:0xbfe0ff, transparent:true, opacity:.25}));
    lens.position.set(a*0.27*s,0,0.49*s); g.add(lens);
    const arm = cyl(0.025*s,0.025*s,0.5*s,fm,5); arm.rotation.x = Math.PI/2; arm.position.set(a*0.5*s,0,0.28*s); g.add(arm);
  });
  g.add(at(rbox(0.12*s,0.035*s,0.04*s,.4,fm),0,0,0.5*s));
  return g;
}
function kelSmileSprite(texture, size, color){ return spriteOf(texture, size, color); }
const kelSunTex = tex(64,64,(g)=>{
  g.fillStyle='#ffd166'; g.beginPath(); g.arc(32,32,18,0,7); g.fill();
  g.strokeStyle='#ffd166'; g.lineWidth=4; for (let i=0;i<8;i++){ const a=i*Math.PI/4; g.beginPath(); g.moveTo(32+Math.cos(a)*22,32+Math.sin(a)*22); g.lineTo(32+Math.cos(a)*29,32+Math.sin(a)*29); g.stroke(); }
  g.strokeStyle='#8a5a1a'; g.lineWidth=3; g.beginPath(); g.arc(26,28,2.6,Math.PI*1.1,Math.PI*1.9); g.stroke(); g.beginPath(); g.arc(38,28,2.6,Math.PI*1.1,Math.PI*1.9); g.stroke();
  g.beginPath(); g.arc(32,34,6,0,Math.PI); g.stroke();
});
const kelCloudTex = tex(64,48,(g)=>{
  g.fillStyle='#fdfdff'; [[20,28,12],[34,24,14],[46,29,10]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); });
  g.fillRect(14,28,38,12);
  g.strokeStyle='#7f8aa0'; g.lineWidth=2.4; g.beginPath(); g.arc(27,27,2.4,Math.PI*1.1,Math.PI*1.9); g.stroke(); g.beginPath(); g.arc(39,27,2.4,Math.PI*1.1,Math.PI*1.9); g.stroke();
  g.beginPath(); g.arc(33,31,5,0,Math.PI); g.stroke();
});
const kelOfferTex = ['OFFER','顧問 offer','行銷 offer','歡迎加入'].map(t=>tex(64,44,(g)=>{
  g.fillStyle='#fdfaf2'; g.fillRect(0,0,64,44); g.fillStyle='#2b3142'; g.fillRect(0,0,64,9);
  g.fillStyle='#2a2a30'; g.font='bold 10px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(t,32,25);
  g.fillStyle='#b8b2a4'; g.fillRect(8,34,48,1);
}));

/* ---------- model ---------- */
const KEL_TOPS = {
  olive:[kelOliveTex, kelOliveFront, null],
  brown:[kelBrownTex, kelBrownFront, kelBrownTex],
  white:[kelWhiteTex, kelWhiteFront, kelWhiteTex],
  puffer:[kelPuffTex, kelPuffFront, kelPuffTex],
  suit:[kelSuitTex, kelSuitFront, kelSuitTex],
};
function buildKelsey(parent){
  const hairM = L({map:kelHairTex}), faceM = L({map:kelFaces.normal}), skinM = L({map:kelSkinTex});
  const plainM = L({map:kelOliveTex}), frontM = L({map:kelOliveFront}), sleeveM = L({map:kelOliveTex});
  const pantsM = L({map:kelNavyPants});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.12,
    torsoMat:[plainM,plainM,plainM,plainM,frontM,plainM], sleeveMat:()=>sleeveM, sleeve:[0.6,0.42],   // 無袖：短短的肩片
    pantsM, shoeM, soleM:greySole, watch:true,
    collar(chest){
      chest.add(at(cyl(0.3,0.32,0.2,skinM),0,2.3,0));
      const ch = new THREE.Mesh(new THREE.TorusGeometry(0.34,0.025,5,16), L({color:0xdfe3ea}));        // 項鍊
      ch.rotation.x = Math.PI/2 - 0.25; ch.position.set(0,2.18,0.08); chest.add(ch);
      chest.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.07,8,6), L({color:0xeef1f6})),0,1.72,0.47));
    },
    hair(head){
      head.add(at(rbox(1.16,0.58,1.16,.66,hairM),0,0.5,-0.02));                                        // 頭頂
      head.add(at(rbox(1.14,1.25,0.5,.55,hairM),0,-0.12,-0.36));                                       // 後腦
      [-0.42,-0.2,0.02,0.24,0.46].forEach((x,i)=>{                                                     // 後面長髮
        const st = rbox(0.3,1.45 + (i%2)*0.28 - Math.abs(x)*.25,0.32,.5,hairM);
        st.position.set(x,-0.98 - (i%2)*0.12,-0.42); st.rotation.z = -x*0.14; head.add(st);
      });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.17,0.92,0.7,.45,hairM),s*0.53,0.12,0.02));
        const side = rbox(0.34,1.55,0.78,.5,hairM); side.position.set(s*0.56,-0.6,0.02); side.rotation.z = s*0.06; head.add(side);
        const wave = rbox(0.32,0.68,0.64,.5,hairM); wave.position.set(s*0.64,-1.5,0.02); wave.rotation.z = s*0.34; head.add(wave);   // 髮尾外翹
        const flick = rbox(0.26,0.46,0.52,.5,hairM); flick.position.set(s*0.8,-1.92,0.0); flick.rotation.z = s*0.66; head.add(flick);
      });
      [[-0.36,-0.2],[-0.13,-0.07],[0.13,0.07],[0.36,0.2]].forEach(([x,rz])=>{                          // 中分瀏海
        const f = rbox(0.3,0.6,0.22,.5,hairM); f.position.set(x,0.24,0.47); f.rotation.z = rz*2.0; head.add(f);
      });
      head.add(at(rbox(1.02,0.26,0.17,.45,hairM),0,0.44,0.46));
    },
    face(head){},
  }, parent);
  c.root.scale.set(0.95,1.02,0.95);                                                                     // 跟女王差不多高、偏瘦
  c.hairM = hairM;

  const phone = kelPhone(1.5); phone.position.set(0,-0.5,0); c.R.hd.add(phone);
  const mic = kelMic(1.5); mic.position.y = -0.4; c.R.hd.add(mic);
  const mat = kelMat(1.6); mat.position.y = -0.7; c.R.hd.add(mat);
  const bust = kelBust(1.1, 0); bust.position.y = -1.0; c.R.hd.add(bust);
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.5), new THREE.MeshBasicMaterial({map:kelPlanTex, fog:false, side:THREE.DoubleSide}));
  plan.position.y = -0.8; c.R.hd.add(plan);
  c.props = {phone, mic, mat, bust, plan};

  const glasses = kelGlasses(1.0); glasses.position.set(0,0.02,0); glasses.visible = false; c.head.add(glasses);
  c.kelGlasses = glasses;

  const sleeves = [c.R, c.Lf].map(a=>({bare1:a.sh.children[1], bare2:a.el.children[0]}));
  let topNow = 'olive';
  c.setTop = (mode)=>{
    const t = KEL_TOPS[mode] || KEL_TOPS.olive; topNow = KEL_TOPS[mode] ? mode : 'olive';
    plainM.map = t[0]; frontM.map = t[1]; sleeveM.map = t[2] || t[0];
    plainM.needsUpdate = frontM.needsUpdate = sleeveM.needsUpdate = true;
    const long = !!t[2];                                                                                // 有袖子就把手臂換成衣料
    sleeves.forEach(s=>{ s.bare1.material = long ? sleeveM : skinM; s.bare2.material = long ? plainM : skinM; });
  };
  c.setTop('olive');
  c.baseTop = 'olive';
  c.setSuit = (on)=>{ c.setTop(on ? 'suit' : c.baseTop); glasses.visible = !!on; };
  c.setOld = ()=>{};
  c.setPants = (m)=>{ pantsM.map = m; pantsM.needsUpdate = true; };
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = kelFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = kelFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- 下必殺：改教案（被打到的人坐進國小課桌椅改東西） ---------- */
function kelDeskOn(v){
  const g = kelDesk(1.0); g.position.set(v.x + 0.6, v.y, 0.6); scene.add(g);
  G.finals.push({owner:v, target:v, t:0, mesh:g, update(F, dt){
    const k = Math.min(1, F.t/0.18);
    F.mesh.scale.setScalar(0.4 + 0.6*k);
    F.mesh.position.set(v.x + 0.6, v.y, 0.6);
    if (F.t > 1.5) F.mesh.scale.setScalar(Math.max(0.01, 1 - (F.t-1.5)/0.3));
    return F.t > 1.8;
  }});
}

/* ---------- 大招：BeReal ---------- */
const KEL_PAUSE = 2.9;
function kelFinal(f, opp){
  f.finalT = 1.0; banner('⏰ Time to BeReal！'); SFX.boom(); pop('時間到！大家一起拍！', f.x, f.y+7.8, 'big');
  const g = new THREE.Group(); scene.add(g);
  const phones = [];
  [[-9.5,11],[9.5,11],[-9.5,3],[9.5,3]].forEach(([x,y],i)=>{                                       // 左上下、右上下各一支大手機
    const p = kelPhone(6.5); p.position.set(f.x + x, y, 3.4);
    p.rotation.set(0, (x<0?1:-1)*0.4, (x<0?-1:1)*0.2);                                                 // 螢幕朝鏡頭，機身斜斜對著舞台
    g.add(p); phones.push(p);
  });
  const flash = new THREE.Mesh(new THREE.PlaneGeometry(90,60), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0, depthWrite:false, fog:false}));
  flash.position.set(f.x, 10, 3.2); g.add(flash);
  const snaps = G.fighters.filter(v=>v!==f && v.state!=='dead').map(v=>({v, x:v.x, y:v.y, pct:v.pct, hits:0}));
  for (const s of snaps) pop('不要動！', s.v.x, s.v.y+7.5, 'blue');
  G.finals.push({owner:f, target:opp, t:0, mesh:g, fired:false, update(F, dt){
    const inPause = F.t < KEL_PAUSE;
    flash.material.opacity = inPause ? Math.max(0, 0.75 - F.t*2.4) + (Math.sin(F.t*18)>0.93 ? .25 : 0) : Math.max(0, .5 - (F.t-KEL_PAUSE)*2);
    phones.forEach((p,i)=>{ p.position.y += Math.sin(F.t*4 + i)*dt*0.6; });
    if (inPause){
      for (const s of snaps){
        const v = s.v; if (v.state==='dead') continue;
        if (v.pct > s.pct + 0.001){ s.hits++; s.pct = v.pct; }                                          // 被打幾下就記幾下
        v.x = s.x; v.y = s.y; v.vx = 0; v.vy = 0; v.move = null; v.ff = false;
        v.state = 'stun'; v.stunT = .25; v.hitstun = 0;
      }
      if (!F.said && F.t > .5){ F.said = true; pop('大家停下來一下～', f.x, f.y+9, 'big'); }
    } else if (!F.fired){
      F.fired = true; SFX.whistle();
      for (const s of snaps){
        const v = s.v; if (v.state==='dead') continue;
        const n = 1 + s.hits;
        const dmg = 8 + s.hits*5, kb = 14 + s.hits*2.6;
        pop('📸 ×' + n, v.x, v.y+8, 'big');
        for (let i=0;i<Math.min(4,n);i++){
          const sp = spriteOf(kelPhotoTex, 2.2 + s.hits*0.15);
          sp.position.set(v.x + (i-1)*2.4, v.y + 10 + i*1.4, .4);
          scene.add(sp);
          G.finals.push({owner:f, target:v, t:0, mesh:sp, done:false, update(P, pdt){
            const u = Math.min(1, P.t/0.34);
            P.mesh.position.set(v.x + (i-1)*2.4*(1-u), v.y + 10 - 5.5*u, .4);                            // 照片飛向他
            P.mesh.material.rotation += pdt*4;
            if (!P.done && P.t >= 0.34){
              P.done = true;
              if (v.hittable()) applyHit(f, v, {dmg:dmg/Math.min(4,n), kb:kb/Math.min(4,n)*1.6, sc:.9, ang:52}, (v.x >= f.x ? 1 : -1), v.x, v.y+4.5);
              burst(v.x, v.y+4.5, 0xfff3a0, 8, 8);
            }
            return P.t > 1.2;
          }});
        }
      }
    }
    return F.t > KEL_PAUSE + 1.5;
  }});
}

/* ---------- results ---------- */
function kelWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const photo = spriteOf(kelPhotoTex, 4.2); photo.scale.set(4.0,5.0,1); photo.position.set(wp.x + 3.2, RS_Y + 7, 1.6); photo.visible = false;
  scene.add(photo); R.items.push(photo); R.kelPhoto = photo;
  const sun = spriteOf(kelSunTex, 7); sun.position.set(wp.x + 1, RS_Y + 24, -4); sun.visible = false; scene.add(sun); R.items.push(sun); R.kelSun = sun;
  R.kelClouds = [-6,-2.5,4.5,7.5].map((x,i)=>{ const c = spriteOf(kelCloudTex, 5 + (i%2)); c.position.set(wp.x + x, RS_Y + 16 + (i%2)*2, -5); c.visible = false; scene.add(c); R.items.push(c); return c; });
  const rain = new THREE.Group();                                                                        // 彩虹
  ['#e2574c','#e8974a','#efd04f','#67b05e','#4f8ed0','#8a63c0'].forEach((col,i)=>{
    const t = new THREE.Mesh(new THREE.TorusGeometry(11 - i*1.05, .52, 6, 28, Math.PI), new THREE.MeshBasicMaterial({color:new THREE.Color(col), fog:false}));
    rain.add(t);
  });
  rain.position.set(wp.x + 1, RS_Y + 8, -6); rain.visible = false; scene.add(rain); R.items.push(rain); R.kelRain = rain;
  R.kelOffers = kelOfferTex.map((t,i)=>{ const s = spriteOf(t, 3.4); s.position.set(wp.x, RS_Y + 7, 1.2); s.visible = false; scene.add(s); R.items.push(s); return s; });
  R.kelKids = [-1,1].map(s=>{                                                                            // 圍著她的小朋友
    const k = buildChar({
      skinM:L({map:kelSkinTex}), faceM:L({map:kelFaces.grin}), headW:1.0, headH:1.1,
      torsoMat:L({color: s>0 ? 0xf2c14e : 0x6fb3d2}), sleeveMat:()=>L({color: s>0 ? 0xf2c14e : 0x6fb3d2}), sleeve:[0.6,0.8],
      pantsM:L({color:0x3a4a66}), shoeM, soleM:greySole, collar(){}, hair(h){ h.add(at(rbox(1.1,0.5,1.1,.6,L({map:kelHairTex})),0,0.46,-0.02)); }, face(){},
    }, scene);
    k.root.scale.setScalar(0.55);
    k.root.position.set(wp.x + s*4.4, RS_Y, 1.4);
    k.root.visible = false; R.items.push(k.root); return k;
  });
}
function kelWinUpdate(R, dt, k){
  const W = R.W, m = W.m, wp = m.holder.position;
  for (const n in m.props) m.props[n].visible = false;
  R.kelPhoto.visible = false;
  if (R.t < 1.8){                                                                                        // 1) 自拍一張 BeReal
    applyPose(m, POSE.selfie, k); m.setFace(R.t > .8 ? 'grin' : 'normal');
    m.props.phone.visible = true;
    once('kw0', .15, ()=>popAt('BeReal 時間到！', W, 9, 'big'));
    once('kw1', .9, ()=>{ SFX.whistle(); G.flash = .5; burst(wp.x, RS_Y + 8, 0xffffff, 14, 8); popAt('三、二、一——！', W, 9.5, 'big'); });
    if (R.t > 1.0){ R.kelPhoto.visible = true; R.kelPhoto.position.set(wp.x + 3.2, RS_Y + 7 + Math.sin(R.t*5)*.3, 1.6); }
  } else if (R.t < 4.0){                                                                                 // 2) 雲、太陽、彩虹（都在笑）
    applyPose(m, POSE.cheer, k); m.setFace('grin');
    R.kelPhoto.visible = true; R.kelPhoto.position.set(wp.x + 3.2, RS_Y + 7 + Math.sin(R.t*4)*.25, 1.6);
    const u = Math.min(1, (R.t - 1.8)/.9);
    R.kelSun.visible = true; R.kelSun.position.y = RS_Y + 24 - 6*u*(2-u);
    R.kelClouds.forEach((c,i)=>{ c.visible = R.t > 1.9 + i*.18; c.position.y = RS_Y + 15 + (i%2)*2 + Math.sin(R.t*2 + i)*.35; });
    R.kelRain.visible = R.t > 2.5; R.kelRain.scale.setScalar(Math.min(1, (R.t - 2.5)/.7));
    once('kw2', 2.0, ()=>{ SFX2.fanfare(); popAt('大家一起笑一個～', W, 9.5, 'big'); });
    once('kw3', 3.1, ()=>popAt('今天也很快樂！', W, 9.5, 'big'));
  } else {                                                                                               // 3) 小孩和 offer 圍過來
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.thumbs, k); m.setFace('grin');
    R.kelPhoto.visible = true; R.kelPhoto.position.set(wp.x + 3.2, RS_Y + 7.2 + Math.sin(R.t*4)*.25, 1.6);
    R.kelSun.visible = true; R.kelClouds.forEach(c=>{ c.visible = true; });
    R.kelRain.visible = true; R.kelRain.scale.setScalar(1);
    R.kelKids.forEach((kid,i)=>{
      kid.root.visible = true;
      const s = i ? 1 : -1, ph = R.t*3 + i*2;
      kid.root.position.set(wp.x + s*(3.6 + Math.sin(ph)*.5), RS_Y + Math.abs(Math.sin(ph*1.6))*.8, 1.4);
      kid.root.rotation.y = s*-0.5;
      applyPose(kid, Math.sin(ph*1.6) > 0 ? POSE.cheer : POSE.peace, k);
    });
    R.kelOffers.forEach((o,i)=>{
      o.visible = R.t > 4.2 + i*.28;
      const a = R.t*1.4 + i*Math.PI/2;
      o.position.set(wp.x + Math.cos(a)*5.2, RS_Y + 9 + Math.sin(a)*2.2, 1.2);
    });
    once('kw4', 4.3, ()=>{ SFX2.cheer(); popAt('孩子們：老師再講一次！', W, 10); });
    once('kw5', 5.1, ()=>popAt('企業：這個 offer 給你！', W, 10.5, 'big'));
  }
}
function kelLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  R.kelBusts = KEL_PHIL.map((_, i)=>{
    const b = kelBust(2.1, i);
    b.position.set(lp.x + (i%2 ? 1 : -1)*(16 + i*3), RS_Y + 3.0, i < 2 ? 2.6 : 0.2);
    scene.add(b); R.items.push(b); return b;
  });
  R.kelHw = [0,1,2,3,4].map(i=>{
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.9,2.5), new THREE.MeshBasicMaterial({map:kelHwTex, fog:false, side:THREE.DoubleSide}));
    p.position.set(lp.x, RS_Y + 22, 2.2); p.visible = false; scene.add(p); R.items.push(p); return p;
  });
}
function kelLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, lp = m.holder.position;
  for (const n in m.props) m.props[n].visible = false;
  const closed = Math.min(1, Math.max(0, (R.t - .4)/2.0));
  R.kelBusts.forEach((b, i)=>{
    const s = i%2 ? 1 : -1, home = s*(4.4 + (i>1 ? 3.0 : 0));
    const x0 = lp.x + s*(16 + i*3);
    b.position.x = x0 + (lp.x + home - x0)*closed;
    b.position.y = RS_Y + 3.0 + Math.abs(Math.sin(R.t*7 + i))*(closed < 1 ? 1.1 : .45);                   // 左右蹦跳
    b.rotation.y = -s*0.4;
    b.rotation.z = Math.sin(R.t*7 + i)*.07;
  });
  once('kl0', .1, ()=>popAt('欸…你們幹嘛？', Lz, 8.5, 'blue'));
  once('kl1', 1.1, ()=>{ SFX.soft(); G.shake = reduce ? .05 : .2; });
  once('kl2', 2.3, ()=>{ SFX.crash(); G.shake = reduce ? .08 : .35; popAt('被哲學包圍了！', Lz, 9, 'big'); });
  if (R.t < 2.4){ applyPose(m, POSE.stand, k); m.setFace(R.t > 1.2 ? 'shout' : 'normal'); }
  else if (R.t < 4.6){ applyPose(m, POSE.squat, k); m.setFace('dizzy'); }
  else { applyPose(m, POSE.sob, k); m.setFace('cry'); }
  // 然後被作業淹沒
  R.kelHw.forEach((p, i)=>{
    const t0 = 2.7 + i*.35;
    if (R.t < t0){ p.visible = false; return; }
    p.visible = true;
    const u = Math.min(1, (R.t - t0)/.4);
    const restY = RS_Y + 1.4 + i*.9;
    p.position.set(lp.x + (i - 2)*1.0, RS_Y + 22 - (22 - (restY - RS_Y))*(u*(2-u)), 2.2 + i*.12);
    p.rotation.z = (i%2 ? .18 : -.16) + (1-u)*(i%2 ? 2.2 : -2.2);
    once('klp' + i, t0 + .38, ()=>{ SFX.soft(); burst(lp.x, RS_Y + 2 + i, 0xfdfaf0, 6, 5); if (i===4) popAt('作業……改不完……', Lz, 8.5, 'blue'); });
  });
}

registerChar('kelsey', {
  stats: { name:'Ten', en:'Ten', tag:'很會笑・BeReal・教案魔人・哲學系', weight:0.85, run:16, air:12, jumpV:33, djV:29, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'笑死！'},
    side:{t:[.22,.1,.3], pose:['batWind','batHit'], box:[2.7,3.5,1.6], dmg:14, kb:12, sc:1.05, ang:36, prop:'mic', sfx:'swing', text:'各位來賓～'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,6.6,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'phone', text:'往上拍一張！'},
    down:{t:[.26,.12,.34], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:16, kb:11, sc:.95, ang:66, prop:'bust', sfx:'crash', text:'亞里斯多德說！', textCls:'big'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.1,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.7,0.5,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'bust'},
    nB:{t:[.22,.12,.3], pose:['batWind','batHit'], prop:'mat', box:[2.4,3.6,1.6], dmg:5, kb:5, sc:.3, ang:45, fire:[[.22,'kelPicnic']], air:1, sfx:'swing', text:'來野餐！'},
    sB:{t:[.12,.25,.3], pose:['sprint','sprint'], box:[1.9,3.6,1.4], dmg:8, kb:6, sc:.4, ang:40, dash:26, air:1, onHit:'kelPosed', prop0:'phone', text:'一起拍啦！'},
    uB:{t:[.05,.55,.1], pose:['laughUp','laughUp'], start:'kelUp', box:[0.4,5.2,1.8], dmg:7, kb:9, sc:.5, ang:80, helpless:1, air:1, text:'我要上天啦～', textCls:'big'},
    dB:{t:[.18,.5,.32], pose:['piano','piano'], prop:'plan', fire:[[.18,'kelPlan0'],[.42,'kelPlan1']], air:1, text:'這個教案再改一次', textCls:'blue'},
  },
  fire: {
  kelPicnic(f){
    if (Math.random() < .1){                                                                              // 低機率：剪刀，比較痛
      proj({owner:f, x:f.x+f.face*1.8, y:f.y+4.6, vx:f.face*24, vy:4, g:16, r:1.0, life:1.6, dmg:13, kb:13, sc:1.0, ang:40, mesh:kelScissor3D(), spin:1});
      pop('剪刀！？', f.x, f.y+7.5, 'red'); SFX.swing(); return;
    }
    const food = KEL_FOODS[Math.floor(Math.random()*KEL_FOODS.length)];
    proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.6, vx:f.face*15, vy:11, g:28, r:.95, life:2.2, bounce:1, dmg:6, kb:6, sc:.5, ang:48, soft:1, mesh:kelFood3D(food.n), spin:1});
    pop(food.n + '！', f.x, f.y+7);
  },
  kelPlan0(f){ FIRE._kelPlan(f,0); }, kelPlan1(f){ FIRE._kelPlan(f,1); },
  _kelPlan(f,i){
    proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.4+i*.5, vx:f.face*18, vy:i?2:-1, g:3, wave:.9, r:1.0, life:1.4, dmg:5, kb:4, sc:.2, ang:45, onHit:'kelRewrite',
          mesh:spriteOf(kelPlanTex,1.9)});
    SFX.soft();
  },
  },
  start: {
  kelUp(f){ f.vy = 34; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xffe9a8, 10, 9); },
  },
  onhit: {
  kelPosed(att, v){ v.state = 'stun'; v.stunT = .55; v.move = null; pop('比個耶！', v.x, v.y+7.5, 'blue'); },
  kelRewrite(att, v){
    v.state = 'stun'; v.stunT = 1.4; v.move = null; v.vx = 0;
    pop('教案再改一次……', v.x, v.y+7.5, 'blue');
    kelDeskOn(v);
  },
  },
  sfx: {
  shutter(){ noise(.06,.3,2600); tone(1400,.05,'square',.06,-600); },
  },
  skins: [
    { name:'咖啡色上衣', apply(c){ c.baseTop = 'brown'; c.setTop('brown'); c.setPants(kelDarkPants); },
      portrait(g){ g.fillRect(4,4,56,18); } },
    { name:'白長袖＋米褲', apply(c){ c.baseTop = 'white'; c.setTop('white'); c.setPants(kelCreamPants); } },
    { name:'黑羽絨外套', apply(c){ c.baseTop = 'puffer'; c.setTop('puffer'); c.setPants(kelDarkPants); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#8d9068','#ffe066',0xff8fc4); h.position.set(0.05,0.76,-0.02); c.head.add(h); } },
  ],
  build: buildKelsey, face: kelFaces.normal, portraitBg: '#9fb87f',
  portrait(g){
    g.fillRect(5,4,54,18); g.fillRect(3,10,8,30); g.fillRect(53,10,8,30);                                 // 長髮
    g.fillRect(16,20,12,4); g.fillRect(36,20,12,4);
  },
  shieldPose: 'block', breakText: '報表掉了！',
  shield(){
    const g = new THREE.Group();
    const p = new THREE.Mesh(new THREE.PlaneGeometry(6.4,4.8), new THREE.MeshBasicMaterial({map:kelReportTex, fog:false, side:THREE.DoubleSide}));
    g.add(p);
    const bub = new THREE.Mesh(new THREE.SphereGeometry(3.2,12,8), new THREE.MeshBasicMaterial({color:0xbfe0ff, transparent:true, opacity:.16, depthWrite:false}));
    g.add(bub);
    return g;
  },
  shieldAnim(f){
    const sm = f.shieldMesh;
    sm.position.set(f.x - f.face*1.2, f.y + 4.4, -1.6);
    sm.rotation.set(0, 0, Math.sin(performance.now()/420)*.04);
  },
  finalPose: 'selfie', finalProp: 'phone',
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.cheer : POSE.laugh, selectSfx: ()=>SFX.laughShort(),
  animate(f, m, s, t, dt){
    const shielding = (s === 'shield') || (s === 'stun' && f.brokeShield);
    if (shielding !== !!m.kelSuitOn){ m.kelSuitOn = shielding; m.setSuit(shielding); }
    if (shielding) m.setFace('serious');
    else if (s === 'idle' || s === 'run') m.setFace('normal');
    if (s === 'move' && f.moveId === 'dB') m.joints.rEl.rotation.x = -1.5 + Math.sin(t*26)*0.3;
  },
  winSub: '"Say cheese!"',
  final: kelFinal, winSetup: kelWinSetup, winUpdate: kelWinUpdate, loseSetup: kelLoseSetup, loseUpdate: kelLoseUpdate,
  longWin: true, longLose: true,
});
