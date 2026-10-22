/* 珍妮 Jennie — 大喇喇主唱。吉他當武器、會丟早餐、低機率丟火鍋。Everything this character needs lives in this file. */
'use strict';
/* ---------- textures ---------- */
const JEN_SKIN = '#f1cdb2', JEN_SKIN_C = ['#e9c2a6','#f6d7c0','#ecc6aa'];
const JEN_HAIR = '#2b1d17', JEN_TIP = '#7a5638';
const jenSkinTex = tex(16,16,(g)=>speckle(g,16,16,JEN_SKIN,JEN_SKIN_C,.4));
function jenHairDraw(g, tips){
  speckle(g,32,32,JEN_HAIR,['#36261d','#221712','#3d2a20'],.45);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(10,6,4,.25)' : 'rgba(120,85,60,.18)'; g.fillRect(x + ((x*7)%3) - 1, 0, 1, 32); }
  if (tips){                                                                       // 髮尾挑染淺棕
    const gr = g.createLinearGradient(0,10,0,32); gr.addColorStop(0,'rgba(122,86,56,0)'); gr.addColorStop(.6,'rgba(140,100,66,.7)'); gr.addColorStop(1,'rgba(176,134,92,.95)');
    g.fillStyle = gr; g.fillRect(0,0,32,32);
    for (let x=1;x<32;x+=3){ g.fillStyle='rgba(200,160,115,.35)'; g.fillRect(x,18 + (x%5),1,14); }
  }
}
const jenHairTex = tex(32,32,(g)=>jenHairDraw(g,false)), jenTipTex = tex(32,32,(g)=>jenHairDraw(g,true));
function jenFace(g, mode){
  speckle(g,64,64,JEN_SKIN,JEN_SKIN_C,.3); shadeFace(g);
  g.fillStyle = mode==='eat' ? 'rgba(240,110,110,.38)' : 'rgba(240,120,120,.24)';             // 腮紅
  const br = mode==='eat' ? 8 : 6;
  g.beginPath(); g.ellipse(13,45,br,br*.7,0,0,7); g.fill(); g.beginPath(); g.ellipse(51,45,br,br*.7,0,0,7); g.fill();
  g.fillStyle='#3a2519'; g.fillRect(15,27,10,2); g.fillRect(39,27,10,2);                 // 眉毛
  if (mode==='shock'){ g.fillRect(16,25,8,2); g.fillRect(40,25,8,2); }
  g.strokeStyle='#160d0a'; g.lineWidth=1.8;
  const open = (x, big)=>{
    if (big){ g.fillStyle='#fbf7f2'; g.beginPath(); g.ellipse(x,37,4.6,4.2,0,0,7); g.fill(); }
    g.fillStyle='#24160f'; g.beginPath(); g.ellipse(x,37,big?2.6:3.2,big?2.8:3.0,0,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(x+1,35,1.4,1.4);
    g.beginPath(); g.moveTo(x-5.5,35.5); g.quadraticCurveTo(x,32,x+5.5,35.5); g.stroke();
    g.strokeStyle='rgba(120,70,50,.6)'; g.lineWidth=1; g.beginPath(); g.arc(x,38,4.6,Math.PI*.2,Math.PI*.8); g.stroke();   // 臥蠶
    g.strokeStyle='#160d0a'; g.lineWidth=1.8;
  };
  const happy = (x)=>{ g.lineWidth=2.2; g.beginPath(); g.arc(x,39.5,4.6,Math.PI*1.12,Math.PI*1.88); g.stroke(); g.lineWidth=1.8; };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.5,Math.PI*.15,Math.PI*.85); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='grin' || mode==='sing' || mode==='eat'){ happy(20); happy(44); }
  else if (mode==='shock'){ open(20,true); open(44,true); }
  else { open(20); open(44); }
  g.fillStyle='rgba(165,95,72,.35)'; g.fillRect(30,41,4,3);                               // 鼻子
  const braces = (x0, x1, y)=>{                                                          // 牙套
    g.fillStyle='#fbfaf6'; g.fillRect(x0,y,x1-x0,3.4);
    g.fillStyle='#a9b0b8'; g.fillRect(x0,y+1.3,x1-x0,1);
    g.fillStyle='#8e959e'; for (let x=x0+1;x<x1-1;x+=3) g.fillRect(x,y+.8,1.8,1.8);
  };
  if (mode==='sing' || mode==='shock'){
    g.fillStyle='#5a1a1a'; g.beginPath(); g.ellipse(32,51,mode==='sing'?6:4,mode==='sing'?6:5,0,0,7); g.fill();
    braces(27,37,45.5); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,54.5,3.5,1.8,0,0,7); g.fill();
  } else if (mode==='eat'){
    g.fillStyle='#b8564e'; g.beginPath(); g.ellipse(32,50,4,2.5,0,0,7); g.fill();
    g.fillStyle='#e8b04a'; g.fillRect(29,48,6,2);                                         // 嘴邊還有蛋餅
  } else if (mode==='cry'){
    g.strokeStyle='#a84f50'; g.lineWidth=2.4; g.beginPath(); g.moveTo(25,53); g.quadraticCurveTo(32,46,39,53); g.stroke();
  } else if (mode==='dizzy'){
    g.strokeStyle='#b05050'; g.lineWidth=2.2; g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(28,46,32,50); g.quadraticCurveTo(36,54,40,50); g.stroke();
  } else {                                                                               // 大笑，露出牙套
    g.fillStyle='#6b1f1f'; g.beginPath(); g.moveTo(23,46); g.quadraticCurveTo(32,58,41,46); g.closePath(); g.fill();
    braces(24.5,39.5,46); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,53,4,1.8,0,0,7); g.fill();
  }
  // 空氣瀏海（有縫）＋ 兩側頭髮
  g.fillStyle=JEN_HAIR; g.fillRect(0,0,64,10);
  for (let i=0;i<11;i++){ const x=i*6, d=(i===5)?-4:(i===4||i===6)?-2:0; g.beginPath(); g.moveTo(x-1,9); g.lineTo(x+5,9); g.lineTo(x+2+(i%3)*.5, 18+(i%2)*4+d); g.closePath(); g.fill(); }
  g.fillRect(0,0,6,64); g.fillRect(58,0,6,64);
  g.beginPath(); g.moveTo(6,18); g.lineTo(10,18); g.lineTo(7,40); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(58,18); g.lineTo(54,18); g.lineTo(57,40); g.closePath(); g.fill();
  g.fillStyle='rgba(130,95,70,.5)'; [9,22,35,48].forEach(x=>g.fillRect(x,1,1,8));
}
const jenFaces = {};
['normal','grin','sing','eat','cry','dizzy','shock'].forEach(k=>jenFaces[k] = tex(64,64,(g)=>jenFace(g,k)));
// 白色寬鬆 T 恤
function jenTeeBase(g, w, h){ speckle(g,w,h,'#f5f3ee',['#ece9e2','#faf9f5','#e6e2da'],.35); g.fillStyle='rgba(160,150,135,.12)'; for (let y=6;y<h;y+=9) g.fillRect(0,y + (y%2),w,1); }
const jenTeeFront = tex(32,46,(g)=>{
  jenTeeBase(g,32,46);
  g.fillStyle='#e4e0d6'; g.beginPath(); g.ellipse(16,0,7,4.5,0,0,Math.PI); g.fill();             // 圓領羅紋
  g.fillStyle='#d6d1c6'; g.fillRect(9,3,14,1);
  g.fillStyle='#2b2b2f'; g.font='bold 4px sans-serif'; g.textAlign='center'; g.fillText('JENNIE  LIVE',16,17);
  g.fillStyle='#55555c'; g.font='3px sans-serif'; g.fillText('♪ BREAKFAST TOUR ♪',16,21);
  g.fillStyle='rgba(150,140,125,.2)'; g.fillRect(6,30,1,14); g.fillRect(25,28,1,16);              // 衣服皺褶
});
const jenTeeTex = tex(32,32,(g)=>jenTeeBase(g,32,32));
const jenDenimTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#8fb4dc',['#82a8d2','#a2c2e6','#b0cdec','#7a9fca'],.55);
  g.fillStyle='rgba(255,255,255,.18)'; for (let i=0;i<32;i+=3) g.fillRect((i*5)%32,i,6,1);       // 刷白
  g.fillStyle='rgba(60,90,130,.18)'; for (let x=0;x<32;x+=4) g.fillRect(x,0,1,32);
});
const jenWideDenimTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#9dbde0',['#90b2d8','#adcbea','#86a8d0'],.55);
  g.fillStyle='rgba(255,255,255,.16)'; for (let i=0;i<32;i+=4) g.fillRect((i*7)%32,i,7,1);
  g.fillStyle='rgba(60,90,130,.14)'; for (let x=1;x<32;x+=4) g.fillRect(x,0,1,32);
});
// 第二套：酒紅 MALIBU 帽T
const jenHoodTex = tex(32,32,(g)=>{ speckle(g,32,32,'#7d1f2c',['#742030','#86242f','#6c1a26'],.45); g.fillStyle='rgba(0,0,0,.08)'; for (let y=0;y<32;y+=3) g.fillRect(0,y,32,1); });
const jenHoodFront = tex(96,128,(g)=>{ g.scale(2,2);
  speckle(g,48,64,'#7d1f2c',['#742030','#86242f','#6c1a26'],.45);
  g.fillStyle='#ece6da'; g.beginPath(); g.moveTo(16,0); g.lineTo(32,0); g.lineTo(24,12); g.closePath(); g.fill();   // 白色高領
  g.fillStyle='#5e1520'; g.beginPath(); g.moveTo(14,0); g.lineTo(16,0); g.lineTo(24,12); g.lineTo(24,14); g.closePath(); g.fill(); g.beginPath(); g.moveTo(34,0); g.lineTo(32,0); g.lineTo(24,12); g.lineTo(24,14); g.closePath(); g.fill();
  g.font='900 11px sans-serif'; g.textAlign='center'; g.lineWidth=3; g.strokeStyle='#efe6d4'; g.strokeText('MALIBU',24,34);
  g.fillStyle='#7d1f2c'; g.fillText('MALIBU',24,34); g.lineWidth=1; g.strokeStyle='#efe6d4'; g.strokeText('MALIBU',24,34);
  g.fillStyle='#efe6d4'; g.font='bold 4px sans-serif'; g.fillText('C A L I F O R N I A',24,41);
  g.strokeStyle='#5c1520'; g.lineWidth=1; g.beginPath(); g.moveTo(9,64); g.lineTo(12,50); g.lineTo(36,50); g.lineTo(39,64); g.stroke();   // 口袋
  g.fillStyle='#f2ece0'; g.fillRect(20,11,1,10); g.fillRect(27,11,1,12);                        // 抽繩
});
const jenNoteTex = tex(32,32,(g)=>{
  g.fillStyle='#fff'; g.beginPath(); g.ellipse(10,24,6,4.5,-.4,0,7); g.fill(); g.beginPath(); g.ellipse(24,20,6,4.5,-.4,0,7); g.fill();
  g.fillRect(14,4,3,20); g.fillRect(28,0,3,20); g.fillRect(14,2,17,5);
});
const jenSignTex = tex(128,40,(g)=>{
  g.fillStyle='#fff6df'; g.fillRect(0,0,128,40); g.fillStyle='#e0533a'; g.fillRect(0,0,128,7); g.fillRect(0,33,128,7);
  g.fillStyle='#c0392b'; g.font='900 20px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('早餐吃到飽',64,21);
});
const jenStageSignTex = tex(128,32,(g)=>{
  g.fillStyle='#1a1424'; g.fillRect(0,0,128,32); g.fillStyle='#ff6fa8'; g.font='900 16px sans-serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('JENNIE LIVE ♪',64,17);
});

/* ---------- 3D 早餐 ---------- */
const jenDarkM = L({color:0x1c1c22}), jenSteelM = L({color:0xc9ced6}), jenWoodM = L({color:0x8a5a32});
function jenFood(kind, s){
  s = s || 1;
  const g = new THREE.Group(), M = (c)=>L({color:c});
  if (kind==='danbing'){                                                                 // 蛋餅：切三段看得到蛋
    const crepe = M(0xf0d6a0), egg = M(0xf6c63c), crisp = M(0xd9a05a);
    for (let i=-1;i<=1;i++){
      const sl = cyl(0.32,0.32,0.42,crepe,14); sl.rotation.x = Math.PI/2; sl.position.set(i*0.52,0,0); g.add(sl);
      const ring2 = cyl(0.33,0.33,0.3,crisp,14); ring2.rotation.x = Math.PI/2; ring2.position.set(i*0.52,0,0); g.add(ring2);
      const yolk = cyl(0.2,0.2,0.44,egg,12); yolk.rotation.x = Math.PI/2; yolk.position.set(i*0.52,0,0); g.add(yolk);
      [[-.06,.07],[.08,-.04]].forEach(([dx,dy])=>g.add(at(rbox(0.06,0.06,0.04,.3,M(0x4f9a3c)),i*0.52+dx,dy,0.23)));
    }
    g.add(at(rbox(1.5,0.05,0.2,.4,M(0x5a2a14)),0,0.31,0));                              // 醬油膏
  } else if (kind==='teppan'){                                                           // 鐵板麵
    g.add(at(cyl(0.86,0.86,0.08,jenWoodM,18),0,-0.12,0));
    g.add(cyl(0.78,0.78,0.1,jenDarkM,18));
    const nm = M(0xe9c56a);
    for (let i=0;i<7;i++){ const t = new THREE.Mesh(new THREE.TorusGeometry(0.2 + (i%3)*0.04,0.05,5,12), nm); t.rotation.set(Math.PI/2 + (i%2)*.4, 0, i); t.position.set(Math.cos(i*1.7)*0.32, 0.1 + (i%2)*0.04, Math.sin(i*1.7)*0.3); g.add(t); }
    const sauce = new THREE.Mesh(new THREE.SphereGeometry(0.34,10,6), M(0x5b2c12)); sauce.scale.set(1,.25,1); sauce.position.set(-0.15,0.16,0.05); g.add(sauce);
    g.add(at(cyl(0.3,0.32,0.05,M(0xfbf8ee),14),0.32,0.12,0.2));                           // 荷包蛋
    const yk = new THREE.Mesh(new THREE.SphereGeometry(0.12,10,6,0,Math.PI*2,0,Math.PI/2), M(0xf3b21f)); yk.position.set(0.32,0.15,0.2); g.add(yk);
    g.rotation.x = 0.55;
  } else if (kind==='lapancake'){                                                        // 地瓜拉餅：折半、紙袋包著
    const half = new THREE.Group(); half.rotation.z = Math.PI/2; g.add(half);
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.66,0.66,0.2,18,1,false,0,Math.PI), M(0xe4b263)); p1.rotation.x = Math.PI/2; half.add(p1);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.24,18,1,false,0,Math.PI), M(0xf2d08e)); p2.rotation.x = Math.PI/2; half.add(p2);
    const pot = M(0xf08a2a); [[-.32,.46],[0,.58],[.3,.48],[-.12,.3],[.16,.32]].forEach(([x,y],i)=>{ const b = rbox(0.17,0.15,0.3,.4,pot); b.position.set(x,y,0); b.rotation.z = i; g.add(b); });
    [[-.4,.2],[.42,.15],[0,.08]].forEach(([x,y])=>g.add(at(rbox(0.18,0.05,0.26,.3,M(0xb07a34)),x,y,0.13)));   // 酥皮層
    g.add(at(rbox(1.42,0.42,0.32,.15,M(0xf7f3e8)),0,-0.2,0));                              // 紙袋
    g.add(at(rbox(1.44,0.06,0.33,.1,M(0xd94a3c)),0,-0.08,0));
  } else if (kind==='milktea'){                                                          // 奶茶
    g.add(cyl(0.34,0.26,1.0,M(0xc9925b),14));
    g.add(at(cyl(0.345,0.3,0.32,M(0xfbf8ee),14),0,-0.05,0));
    g.add(at(cyl(0.36,0.36,0.06,M(0xf2f2f2),14),0,0.52,0));
    const st = cyl(0.05,0.05,0.9,M(0xff7fa8),6); st.position.set(0.1,0.85,0); st.rotation.z = -0.2; g.add(st);
    [-.25,-.1,.05].forEach((y,i)=>g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.07,6,4), M(0x2b1a12)),(i-1)*0.12,y-0.3,0.24)));   // 珍珠
  } else if (kind==='burger'){                                                           // 早餐店漢堡
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.6,14,8,0,Math.PI*2,0,Math.PI/2), M(0xd99a4e)); top.scale.set(1,.7,1); top.position.y = 0.2; g.add(top);
    [[-.2,.5],[.15,.55],[0,.42]].forEach(([x,y])=>g.add(at(rbox(0.07,0.03,0.05,.3,M(0xfaf0d0)),x,y,0.3)));
    g.add(at(cyl(0.63,0.63,0.08,M(0x7cb342),14),0,0.15,0));
    g.add(at(rbox(1.0,0.06,1.0,.05,M(0xf4c430)),0,0.08,0));
    g.add(at(cyl(0.58,0.58,0.16,M(0x7a3b22),14),0,-0.02,0));
    g.add(at(cyl(0.6,0.56,0.2,M(0xe0a95c),14),0,-0.2,0));
    g.rotation.x = 0.3;
  } else if (kind==='radish'){                                                           // 蘿蔔糕
    [-0.4,0.4].forEach((x,i)=>{ g.add(at(rbox(0.7,0.24,0.6,.15,M(0xece2c6)),x,i*0.05,0)); g.add(at(rbox(0.72,0.06,0.62,.1,M(0xc98a3e)),x,0.13+i*0.05,0)); });
  } else if (kind==='hotpot'){                                                           // 大火鍋
    g.add(at(cyl(0.95,0.82,0.75,jenSteelM,22),0,-0.1,0));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95,0.06,6,24), jenSteelM); rim.rotation.x = Math.PI/2; rim.position.y = 0.28; g.add(rim);
    [-1,1].forEach(sx=>{ const h = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.05,5,10,Math.PI), jenDarkM); h.position.set(sx*1.0,0.14,0); h.rotation.z = sx*Math.PI/2; g.add(h); });
    g.add(at(cyl(0.9,0.9,0.05,M(0xd8401f),22),0,0.25,0));                               // 麻辣湯
    const div = rbox(0.06,0.12,1.8,.1,jenSteelM); div.position.y = 0.28; g.add(div);        // 鴛鴦鍋隔板
    const white = new THREE.Mesh(new THREE.CylinderGeometry(0.88,0.88,0.06,22,1,false,0,Math.PI), M(0xf1e4c4)); white.position.y = 0.26; white.rotation.y = Math.PI; g.add(white);
    [[.4,.3],[.55,-.2],[-.45,.25],[-.3,-.4],[.2,-.5]].forEach(([x,z],i)=>g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.13,8,6), M(i%2?0xc8b8a0:0xd4a07a)),x,0.32,z)));   // 丸子
    [[-.55,-.05],[.3,.55]].forEach(([x,z])=>g.add(at(rbox(0.22,0.18,0.22,.1,M(0xf7f1dc)),x,0.33,z)));   // 豆腐
    [[.1,.1],[-.15,.5]].forEach(([x,z],i)=>{ const v = rbox(0.42,0.04,0.2,.3,M(0x4f9a3c)); v.position.set(x,0.31,z); v.rotation.y = i*1.3; g.add(v); });
    const corn = cyl(0.12,0.12,0.36,M(0xf2c73a),8); corn.rotation.z = 1.2; corn.position.set(0.6,0.36,0.1); g.add(corn);
    g.rotation.x = 0.4;
  }
  g.scale.multiplyScalar(s);
  return g;
}
const JEN_FOODS = [
  {k:'danbing',   n:'蛋餅'},
  {k:'teppan',    n:'鐵板麵'},
  {k:'lapancake', n:'地瓜拉餅'},
  {k:'milktea',   n:'奶茶'},
  {k:'burger',    n:'早餐店漢堡'},
];

/* ---------- 道具 ---------- */
function jenGuitarMesh(){                                                                // 拿來打人的木吉他（握琴頸，琴身往 -y）
  const g = new THREE.Group(), bodyM = L({color:0xd99a52}), sideM = L({color:0x7a4320}), neckM = L({color:0x4a2a16});
  g.add(at(rbox(0.18,1.5,0.12,.2,neckM),0,-0.55,0));
  g.add(at(rbox(0.26,0.4,0.1,.2,L({color:0x2a1a10})),0,0.25,0));                        // 琴頭
  [-1,1].forEach(s=>[0,1].forEach(i=>g.add(at(cyl(0.035,0.035,0.12,jenSteelM,5),s*0.16,0.15+i*0.14,0))));
  const up = rbox(0.82,0.72,0.3,.48,bodyM); up.position.set(0,-1.55,0); g.add(up);
  const lo = rbox(1.05,0.9,0.3,.48,bodyM); lo.position.set(0,-2.25,0); g.add(lo);
  const band = rbox(1.07,1.6,0.22,.48,sideM); band.position.set(0,-1.95,0); g.add(band);
  [1,-1].forEach(sz=>{ const hole = cyl(0.17,0.17,0.02,jenDarkM,14); hole.rotation.x = Math.PI/2; hole.position.set(0,-1.75,sz*0.16); g.add(hole); });
  g.add(at(rbox(0.36,0.08,0.06,.2,L({color:0x3a2214})),0,-2.4,0.16));                   // 下弦枕
  for (let i=0;i<4;i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.012,2.4,0.012), jenSteelM),-0.06+i*0.04,-1.2,0.17));
  return g;
}
function jenLuteMesh(){                                                                  // 背在胸前彈的吉他
  const g = new THREE.Group(); g.position.set(0.15,0.95,0.66); g.rotation.set(0.05,0,0.8);
  const bodyM = L({color:0xd99a52}), sideM = L({color:0x7a4320});
  g.add(rbox(1.05,0.85,0.3,.48,bodyM)); g.add(at(rbox(0.8,0.62,0.3,.48,bodyM),0,0.56,0)); g.add(at(rbox(1.07,1.45,0.22,.48,sideM),0,0.25,0));
  const hole = cyl(0.16,0.16,0.02,jenDarkM,14); hole.rotation.x = Math.PI/2; hole.position.set(0,0.3,0.16); g.add(hole);
  g.add(at(rbox(0.16,1.6,0.1,.2,L({color:0x4a2a16})),0,1.55,0.05));
  g.add(at(rbox(0.26,0.34,0.1,.2,L({color:0x2a1a10})),0,2.45,0.05));
  const strap = new THREE.Mesh(new THREE.TorusGeometry(1.1,0.05,4,16,Math.PI*.9), L({color:0xe35d8c})); strap.position.set(0,0.9,-0.2); strap.rotation.z = 0.2; g.add(strap);
  return g;
}
function jenMicMesh(){                                                                   // 手持麥克風：頭在 -y（手往上舉時靠近嘴巴）
  const g = new THREE.Group();
  g.add(at(cyl(0.08,0.06,0.7,jenDarkM,8),0,-0.15,0));
  g.add(at(cyl(0.12,0.1,0.12,jenSteelM,10),0,-0.52,0));
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2,12,8), L({color:0xb8bec6})); head.position.y = -0.7; g.add(head);
  g.add(at(cyl(0.09,0.09,0.06,L({color:0xff6fa8}),8),0,0.12,0));
  return g;
}
function jenMicStand(){                                                                  // 下必殺：麥克風架
  const g = new THREE.Group();
  g.add(at(cyl(0.7,0.8,0.1,jenDarkM,16),0,0.05,0));
  g.add(at(cyl(0.06,0.06,3.4,jenSteelM,8),0,1.75,0));
  const boom = cyl(0.05,0.05,1.2,jenSteelM,6); boom.rotation.z = 1.0; boom.position.set(0.45,3.6,0); g.add(boom);
  const mic = new THREE.Mesh(new THREE.SphereGeometry(0.24,12,8), L({color:0xb8bec6})); mic.position.set(0.95,3.95,0); g.add(mic);
  g.add(at(cyl(0.09,0.12,0.4,jenDarkM,8),0.82,3.78,0));
  g.add(at(rbox(0.5,0.3,0.05,.3,L({color:0xff6fa8})),0,2.4,0.08));
  return g;
}
function jenSpeaker(){
  const g = new THREE.Group(), cab = L({color:0x18161c}), cone = L({color:0x3a3640});
  g.add(rbox(3.2,4.6,2.0,.15,cab));
  [[0,0.9,0.95],[0,-0.9,1.2]].forEach(([x,y,r])=>{
    const c = cyl(r,r*0.8,0.2,cone,20); c.rotation.x = Math.PI/2; c.position.set(x,y,1.02); g.add(c);
    const d = cyl(r*0.3,r*0.3,0.24,jenSteelM,12); d.rotation.x = Math.PI/2; d.position.set(x,y,1.05); g.add(d);
  });
  g.add(at(rbox(2.6,0.3,0.1,.3,L({color:0xff6fa8})),0,2.05,1.0));
  g.cones = g.children.slice(1);
  return g;
}

/* ---------- model ---------- */
function buildJennie(parent){
  const hairM = L({map:jenHairTex}), tipM = L({map:jenTipTex}), faceM = L({map:jenFaces.normal}), skinM = L({map:jenSkinTex});
  const teeM = L({map:jenTeeTex}), teeFrontM = L({map:jenTeeFront});
  const hoodM = L({map:jenHoodTex}), hoodFrontM = L({map:jenHoodFront});
  const teeMats = [teeM,teeM,teeM,teeM,teeFrontM,teeM], hoodMats = [hoodM,hoodM,hoodM,hoodM,hoodFrontM,hoodM];
  const denimM = L({map:jenDenimTex}), wideM = L({map:jenWideDenimTex});
  const teeBits = [], hoodBits = [];
  const c = buildChar({
    skinM, faceM, headW:1.0, headH:1.12,
    torsoMat:teeMats, sleeveMat:()=>teeM, sleeve:[0.74,0.82],
    pantsM:denimM, shoeM:L({color:0xf4f2ec}), soleM:L({color:0xdedad2}),
    collar(chest){
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.34,0.06,5,16), L({color:0xe6e2d8})); rib.rotation.x = Math.PI/2; rib.position.set(0,2.24,0.04); chest.add(rib); teeBits.push(rib);
      const hem = rbox(1.7,0.32,1.0,.3,teeM); hem.position.set(0,0.05,0); chest.add(hem); teeBits.push(hem);   // 寬鬆下擺蓋住短褲頭
      const lanyard = (col, bits)=>{
        const m = L({color:col}), grp = new THREE.Group();
        [-1,1].forEach(s=>{ const st = rbox(0.07,1.3,0.03,.2,m); st.position.set(s*0.2,1.62,0.48); st.rotation.z = -s*0.2; st.position.x = s*0.33; grp.add(st); });
        chest.add(grp); bits.push(grp); return grp;
      };
      lanyard(0x2f9a45, teeBits);                                                        // 綠色掛繩
      const red = lanyard(0xe2423a, hoodBits);                                           // 紅色掛繩＋識別證
      const card = rbox(0.42,0.6,0.04,.15,L({color:0xd9e2ee})); card.position.set(0,0.62,0.5); red.add(card);
      red.add(at(rbox(0.1,0.12,0.05,.3,jenSteelM),0,0.98,0.5));
      const hood = rbox(1.3,0.7,0.5,.5,hoodM); hood.position.set(0,2.05,-0.55); hood.rotation.x = 0.35; chest.add(hood); hoodBits.push(hood);
      const tn = cyl(0.3,0.32,0.34,L({color:0xece6da}),12); tn.position.y = 2.32; chest.add(tn); hoodBits.push(tn);   // 高領內搭
      const band = rbox(1.66,0.3,0.98,.3,L({color:0x6c1a26})); band.position.y = 0.05; chest.add(band); hoodBits.push(band);
    },
    hair(head){
      head.add(at(rbox(1.14,0.56,1.14,.68,hairM),0,0.48,-0.02));                         // 頭頂
      head.add(at(rbox(1.14,1.1,0.48,.55,hairM),0,-0.06,-0.34));                         // 後腦
      [-0.42,-0.21,0,0.21,0.42].forEach((x,i)=>{ const st = rbox(0.28,1.0 + (i%2)*0.14,0.32,.5,tipM); st.position.set(x,-0.86 - (i%2)*0.06,-0.4); st.rotation.z = -x*0.15; head.add(st); });
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.16,0.9,0.7,.45,hairM),s*0.53,0.1,0.0));                         // 側邊
        const side = rbox(0.3,1.25,0.74,.5,tipM); side.position.set(s*0.57,-0.55,-0.02); side.rotation.z = s*0.06; head.add(side);
        const curl = rbox(0.26,0.42,0.6,.5,tipM); curl.position.set(s*0.5,-1.18,0.0); curl.rotation.z = -s*0.55; head.add(curl);   // 髮尾內彎
        const frame = rbox(0.13,1.0,0.16,.5,hairM); frame.position.set(s*0.47,-0.15,0.46); frame.rotation.z = s*0.05; head.add(frame);   // 臉旁碎髮
      });
      head.add(at(rbox(1.04,0.22,0.14,.45,hairM),0,0.43,0.47));                           // 空氣瀏海
      [-0.38,-0.19,0,0.19,0.38].forEach((x,i)=>{ const f = rbox(0.15,0.3 + (i%2)*0.06,0.1,.5,hairM); f.position.set(x,0.24,0.5); f.rotation.z = (i-2)*0.06; head.add(f); });
    },
  }, parent);
  c.torso = c.chest.children[0];
  c.head.children.forEach(o=>{ if (o.isMesh && Math.abs(Math.abs(o.position.x) - 0.52) < .01 && Math.abs(o.position.y - 0.02) < .01) o.visible = false; });   // 耳朵藏進頭髮裡
  // 手：黑色髮圈（右手腕）＋ 帽T 袖口
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.17,0.04,5,12), L({color:0x18161a})); tie.rotation.x = Math.PI/2; tie.position.y = -0.82; c.R.el.add(tie); teeBits.push(tie);
  [c.R, c.Lf].forEach(a=>{ const cuff = cyl(0.2,0.2,0.22,L({color:0x6c1a26}),10); cuff.position.y = -0.88; a.el.add(cuff); hoodBits.push(cuff); });
  // 腿：短褲 or 寬褲
  const legs = [c.joints.rHp, c.joints.lHp].map(hp=>{
    const thigh = hp.children[0], kn = hp.children.find(o=>o.children && o.children.length >= 2), calf = kn.children[0];
    const shorts = rbox(0.76,0.86,0.82,.32,denimM); shorts.position.set(0,-0.36,0); hp.add(shorts); teeBits.push(shorts);
    const cuffR = rbox(0.8,0.14,0.86,.3,L({color:0xc9dbea})); cuffR.position.set(0,-0.76,0); hp.add(cuffR); teeBits.push(cuffR);
    const sock = cyl(0.31,0.3,0.24,L({color:0xfaf9f5}),10); sock.position.y = -1.22; kn.add(sock); teeBits.push(sock);
    return {thigh, calf};
  });
  // 道具
  const guitar = jenGuitarMesh(); c.R.hd.add(guitar);
  const lute = jenLuteMesh(); c.chest.add(lute);
  const mic = jenMicMesh(); c.R.hd.add(mic);
  const food = jenFood('danbing', .6); food.position.set(0,-0.3,0.3); c.R.hd.add(food);
  c.props = {guitar, lute, mic, food};
  c.setOutfit = (o)=>{
    const hood = o==='hoodie';
    c.torso.material = hood ? hoodMats : teeMats;
    [c.R, c.Lf].forEach(a=>{ a.sh.children[0].material = hood ? hoodM : teeM; a.sh.children[1].material = hood ? hoodM : skinM; a.el.children[0].material = hood ? hoodM : skinM; a.sh.children[0].scale.set(hood ? 0.84 : 1, 1, hood ? 0.84 : 1); const k1 = hood ? 1.42 : 1, k2 = hood ? 1.38 : 1; a.sh.children[1].scale.set(k1,1,k1); a.el.children[0].scale.set(k2,1,k2); });
    teeBits.forEach(b=>b.visible = !hood); hoodBits.forEach(b=>b.visible = hood);
    legs.forEach(l=>{ l.thigh.material = hood ? wideM : skinM; l.calf.material = hood ? wideM : skinM; l.thigh.scale.set(hood?1.25:0.92,1,hood?1.2:0.92); l.calf.scale.set(hood?1.35:0.9,1,hood?1.28:0.9); });
  };
  c.setOutfit('tee');
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = jenFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = jenFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ---------- 火鍋湯：落地留下一攤冒煙的湯，站在上面會被燙到跳起來 ---------- */
function jenSoup_watch(p, owner){
  let lx = p.x, ly = p.y;
  G.finals.push({owner, t:0, update(F, dt){
    if (G.projs.indexOf(p) >= 0){ lx = p.x; ly = p.y; return false; }
    if (lx > MAIN.x1 && lx < MAIN.x2 && ly > -2) jenSoup_spawn(owner, lx);
    return true;
  }});
}
function jenSoup_spawn(owner, x){
  SFX.jenSplash(); G.shake = Math.max(G.shake, reduce ? .1 : .35);
  burst(x, 1, 0xd8401f, 14, 9); burst(x, 1, 0xf3e6c8, 6, 7);
  pop('火鍋翻了！！', x, 6, 'red');
  const g = new THREE.Group(), geo = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI*2, 0, Math.PI/2);
  const mat = new THREE.MeshLambertMaterial({color:0xd8401f, transparent:true, opacity:.85, depthWrite:false});
  const body = new THREE.Mesh(geo, mat); body.scale.set(3.6, .22, 1.4); g.add(body);
  const oilM = new THREE.MeshBasicMaterial({color:0xffa04a, transparent:true, opacity:.6, depthWrite:false, fog:false});
  const oil = new THREE.Mesh(geo, oilM); oil.scale.set(1.4,.2,.5); oil.position.set(-1,.05,.3); g.add(oil);
  const bits = [[1.4,.4,0xd4a07a],[-2,.1,0xc8b8a0],[.3,-.4,0x4f9a3c],[-.7,.6,0xf7f1dc]].map(([dx,dz,col])=>{ const b = new THREE.Mesh(new THREE.SphereGeometry(.18,8,6), L({color:col})); b.position.set(dx,.12,dz); g.add(b); return b; });
  const steam = [];
  for (let i=0;i<6;i++){ const s = spriteOf(puffTex, 1.2, 0xffffff); s.material.opacity = .5; s.material.alphaTest = 0; s.position.set((i-2.5)*1.1, .5, .6); g.add(s); steam.push({s, ph:i*.37}); }
  g.position.set(x, .02, .4); g.scale.setScalar(.1); scene.add(g);
  const F = {owner, t:0, dur:4, x, mesh:g, tick:{}, update(F, dt){
    const k = Math.min(1, F.t/.25), fade = Math.max(0, Math.min(1, (F.dur - F.t)/.8));
    g.scale.setScalar(.1 + .9*k);
    mat.opacity = .85*fade; oilM.opacity = .6*fade;
    for (const st of steam){ const u = ((F.t*.8 + st.ph) % 1); st.s.position.y = .5 + u*4; st.s.scale.setScalar(.8 + u*1.6); st.s.material.opacity = .55*(1-u)*fade; }
    for (const v of G.fighters){
      if (v===F.owner || v.state==='dead' || v.invuln > 0) continue;
      if (v.y < 1.5 && Math.abs(v.x - F.x) < 3.9){
        F.tick[v.slot] = (F.tick[v.slot] || 0) - dt;
        if (F.tick[v.slot] <= 0){
          F.tick[v.slot] = .45; v.pct = Math.min(999, v.pct + 2); v.slowT = Math.max(v.slowT, .5);
          if (v.onGround && v.state!=='shield'){ v.vy = 12; v.onGround = false; v.y += .05; }
          pop(Math.random() < .5 ? '好燙！' : '燙燙燙～', v.x, v.y+7.5, 'red'); burst(v.x, v.y+1, 0xffffff, 3, 4);
        }
      }
    }
    return F.t >= F.dur;
  }, dispose(F){ scene.remove(g); g.traverse(n=>{ if (n.geometry && n.geometry!==geo) n.geometry.dispose(); if (n.material) n.material.dispose(); }); geo.dispose(); }};
  G.finals.push(F);
}

/* ---------- 側必殺：飆高音聲波 ---------- */
function jenWave_spawn(f){
  const dir = f.face, g = new THREE.Group(), mats = [];
  for (let i=0;i<3;i++){
    const m = new THREE.MeshBasicMaterial({color: i===1 ? 0xffd166 : 0xff8fc4, transparent:true, opacity:.85, depthWrite:false, fog:false});
    const arc = new THREE.Mesh(new THREE.TorusGeometry(1.2 + i*0.55, 0.14, 4, 18, Math.PI*.7), m); arc.rotation.z = -Math.PI*.35; arc.position.x = -i*0.5; g.add(arc); mats.push(m);
  }
  if (dir < 0) g.rotation.y = Math.PI;
  const F = {owner:f, t:0, x:f.x + dir*1.4, y:f.y + 4.2, mesh:g, hit:new Set(), update(F, dt){
    F.x += dir*24*dt; const sc = 1 + F.t*2.2;
    g.position.set(F.x, F.y, .8); g.scale.setScalar(sc);
    mats.forEach(m=>m.opacity = .85*Math.max(0, 1 - F.t/.7));
    for (const v of G.fighters){
      if (v===f || F.hit.has(v) || !v.hittable()) continue;
      if (Math.abs(v.x - F.x) < 1.6 && Math.abs(v.y + 3 - F.y) < 1.6 + sc*1.2){ F.hit.add(v); applyHit(f, v, {dmg:9, kb:9, sc:.75, ang:28, onHit:'jenRinging'}, dir, v.x, v.y+3.5); }
    }
    return F.t > .7;
  }, dispose(F){ scene.remove(g); g.traverse(n=>{ if (n.geometry) n.geometry.dispose(); }); mats.forEach(m=>m.dispose()); }};
  G.finals.push(F);
}

/* ---------- 下必殺：麥克風架大合唱（被唱到的人會被迫跟著跳舞） ---------- */
function jenStand_spawn(f){
  G.finals.filter(F=>F.jenStand && F.owner===f).forEach(F=>F.t = Math.max(F.t, F.dur - .01));
  const g = jenMicStand(); g.scale.setScalar(.9);
  const F = {jenStand:1, owner:f, t:0, dur:4.2, x:f.x + f.face*1.6, y:f.y, vy:0, onG:f.onGround, mesh:g, next:.35, update(F, dt){
    if (!F.onG){ F.vy -= 40*dt; F.y += F.vy*dt; if (F.y <= 0 && F.x > MAIN.x1 && F.x < MAIN.x2 && F.vy < 0){ F.y = 0; F.onG = true; SFX.jenStomp(); } if (F.y < -20) return true; }
    g.position.set(F.x, F.y, -.2); g.rotation.z = F.onG ? Math.sin(F.t*10)*.04 : 0;
    if (F.onG && F.t >= F.next){
      F.next += .8; SFX.jenSing(Math.floor(F.t*1.25)); ring(F.x, F.y + 3, 5); burst(F.x + .9, F.y + 3.6, 0xff8fc4, 5, 6);
      for (const v of G.fighters){
        if (v===f || !v.hittable()) continue;
        const dx = v.x - F.x, dy = v.y + 2.5 - (F.y + 2.5);
        if (dx*dx + dy*dy < 5.6*5.6) applyHit(f, v, {dmg:4, kb:5, sc:.15, ang:78, onHit:'jenDance'}, Math.sign(dx) || 1, v.x, v.y + 3);
      }
    }
    const fade = Math.min(1, (F.dur - F.t)/.3); g.scale.setScalar(.9*Math.max(.05, fade));
    return F.t >= F.dur;
  }};
  scene.add(g); g.position.set(F.x, F.y, -.2);
  G.finals.push(F);
}

/* ---------- 大招：珍妮演唱會 ---------- */
function jenFinal(f, opp){
  f.finalT = 3.9; banner('珍妮演唱會 LIVE！'); SFX.boom(); pop('大家準備好了嗎～！', f.x, f.y+8, 'big');
  const g = new THREE.Group(); scene.add(g);
  const sx = [Math.max(MAIN.x1 + 3, f.x - 11), Math.min(MAIN.x2 - 3, f.x + 11)];
  const spk = sx.map((x,i)=>{ const s = jenSpeaker(); s.position.set(x, 20 + i*2, -1.5); s.rotation.y = i ? -0.25 : 0.25; g.add(s); return s; });
  const beams = [0xff6fa8, 0x6fc8ff, 0xffd166].map((col,i)=>{
    const m = new THREE.Mesh(new THREE.ConeGeometry(3.4, 24, 18, 1, true), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:0, depthWrite:false, side:THREE.DoubleSide, fog:false}));
    m.position.set(f.x + (i-1)*1.2, 12, -1); m.rotation.z = (i-1)*0.22; g.add(m); return m;
  });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(8,2), new THREE.MeshBasicMaterial({map:jenStageSignTex, fog:false, transparent:true, opacity:0})); sign.position.set(f.x, 17, -2); g.add(sign);
  const notes = [];
  for (let i=0;i<10;i++){ const n = spriteOf(jenNoteTex, 1.3, [0xff6fa8,0xffd166,0x6fc8ff][i%3]); n.visible = false; g.add(n); notes.push({n, vx:0, vy:0, t:9}); }
  const BEATS = [1.3, 1.8, 2.3, 2.8, 3.4];
  G.finals.push({owner:f, target:opp, t:0, mesh:g, bi:0, update(F, dt){
    // 喇叭從天而降
    spk.forEach((s,i)=>{
      const tl = Math.min(1, F.t/(.8 + i*.15)); s.position.y = 20 + i*2 - (18 + i*2)*tl*tl;
      if (tl >= 1 && !s.landed){ s.landed = true; G.shake = Math.max(G.shake, reduce ? .1 : .6); burst(s.position.x, .5, 0xd8d0c0, 12, 7); SFX.jenStomp();
        for (const v of G.fighters){ if (v!==f && v.hittable() && Math.abs(v.x - s.position.x) < 2.2 && v.y < 5) applyHit(f, v, {dmg:8, kb:8, sc:.4, ang:60}, Math.sign(v.x - s.position.x) || 1, v.x, v.y+2); }
      }
      s.scale.setScalar(1 + Math.max(0, (s.pump||0)));
      s.pump = Math.max(0, (s.pump||0) - dt*1.2);
    });
    const on = Math.min(1, Math.max(0, (F.t - .6)/.4));
    beams.forEach((b,i)=>{ b.material.opacity = on*(.16 + .08*Math.sin(F.t*8 + i*2)); b.rotation.z = (i-1)*0.22 + Math.sin(F.t*2 + i)*.15; b.position.x = f.x + (i-1)*1.2; });
    sign.material.opacity = on;
    f.m.setFace(F.t > .6 ? 'sing' : 'grin');
    while (F.bi < BEATS.length && F.t >= BEATS[F.bi]){
      const last = F.bi === BEATS.length - 1; F.bi++;
      spk.forEach(s=>{ s.pump = last ? .4 : .22; ring(s.position.x, 2.5, last ? 9 : 6); });
      SFX.jenSing(F.bi + 2); if (last){ SFX.boom(); G.flash = .45; pop('～♪♪ 安可安可！！', f.x, f.y+9, 'big'); }
      notes.forEach((o,i)=>{ if (i%2 === F.bi%2 || last){ const s = spk[i%2]; o.n.visible = true; o.n.position.set(s.position.x, 3 + Math.random()*2, 0); o.vx = (Math.random()-.5)*14; o.vy = 8 + Math.random()*6; o.t = 0; } });
      for (const v of G.fighters){
        if (v===f || !v.hittable()) continue;
        const dir = Math.sign(v.x - f.x) || f.face;
        if (!last) applyHit(f, v, {dmg:5, kb:4, sc:0, ang:85}, dir, v.x, v.y+3);
        else { v.pct = Math.min(999, v.pct + 12); launch(v, 22 + v.pct*.11, 55, dir); spark(v.x, v.y+3, 3); SFX.hit(40); pop('震撼！', v.x, v.y+8, 'big'); }
      }
    }
    for (const o of notes){ if (!o.n.visible) continue; o.t += dt; o.vy -= 10*dt; o.n.position.x += o.vx*dt; o.n.position.y += o.vy*dt; if (o.t > 1.4) o.n.visible = false; }
    if (F.t > 3.7){ const u = Math.min(1, (F.t - 3.7)/.5); spk.forEach(s=>s.position.y = 2.3 + u*u*22); beams.forEach(b=>b.material.opacity *= 1 - u); sign.material.opacity = 1 - u; }
    return F.t > 4.2;
  }, dispose(F){ scene.remove(g); g.traverse(n=>{ if (n.geometry) n.geometry.dispose(); if (n.material && n.material.map !== jenStageSignTex && n.material.map !== jenNoteTex) n.material.dispose(); }); }});
}

/* ---------- results ---------- */
function jenNotesSetup(R, x, y, z){
  R.jenNotes = [];
  for (let i=0;i<8;i++){ const n = spriteOf(jenNoteTex, 1.1, [0xff6fa8,0xffd166,0x6fc8ff,0xa8e06f][i%4]); n.visible = false; n.position.set(x, y, z); scene.add(n); R.items.push(n); R.jenNotes.push({n, ph:i*.55, x, y, z}); }
}
function jenNotesUpdate(R, on){
  for (const o of R.jenNotes){
    const u = ((R.t*.7 + o.ph) % 1.6)/1.6;
    o.n.visible = on; o.n.position.set(o.x + Math.sin(u*6 + o.ph*3)*1.2 + (o.ph%1 - .5)*2.4, o.y + u*5, o.z); o.n.material.opacity = 1 - u;
  }
}
function jenWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const tb = new THREE.Group();                                                           // 早餐店桌
  tb.add(at(rbox(6.2,0.3,2.6,.08,L({color:0xf4efe2})),0,2.7,0));
  tb.add(at(rbox(6.24,0.12,2.64,.05,L({color:0xe0533a})),0,2.56,0));
  [-1,1].forEach(a=>[-1,1].forEach(b=>tb.add(at(cyl(0.1,0.1,2.6,jenSteelM,6),a*2.8,1.3,b*1.1))));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5.2,1.6), new THREE.MeshBasicMaterial({map:jenSignTex, fog:false})); sign.position.set(0,6.4,-0.6); tb.add(sign);
  [-1,1].forEach(s=>tb.add(at(cyl(0.05,0.05,3.4,jenSteelM,5),s*2.4,4.4,-0.7)));
  const kinds = ['danbing','teppan','lapancake','burger','radish','milktea'];
  R.jenDishes = kinds.map((k,i)=>{
    const d = new THREE.Group(); d.add(at(cyl(0.6,0.6,0.06,L({color:0xffffff}),14),0,-0.36,0));
    const fd = jenFood(k, .82); d.add(fd); d.position.set(-2.35 + (i%3)*2.35, 3.3, i < 3 ? -0.5 : 0.6); tb.add(d); return d;
  });
  tb.position.set(wp.x + 5.2, RS_Y, -0.5); tb.rotation.y = -0.3; scene.add(tb); R.items.push(tb); R.jenTable = tb;
  jenNotesSetup(R, wp.x, RS_Y + 7, 1);
}
function jenWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props;
  for (const n in P_) P_[n].visible = false;
  const names = ['蛋餅！','鐵板麵！','地瓜拉餅！','漢堡！','蘿蔔糕！','奶茶～'];
  if (R.t < 3.0){                                                                         // 早餐吃到飽
    const bite = Math.sin(R.t*11) > 0;
    applyPose(m, bite ? POSE.jenEat : POSE.jenEatB, k); m.setFace(bite ? 'eat' : 'grin'); P_.food.visible = true;
    once('jw0', .15, ()=>popAt('早餐吃到飽！！', W, 9, 'big'));
    R.jenDishes.forEach((d,i)=>{
      const tEat = .45 + i*.4;
      if (R.t > tEat){ const fd = d.children[1]; fd.scale.setScalar(Math.max(.001, .82*(1 - (R.t - tEat)/.3))); }
      once('jd'+i, tEat, ()=>{ SFX.jenChomp(); popAt(names[i], W, 7.5 + (i%2)*.8); });
    });
    once('jw1', 2.75, ()=>{ SFX2.cheer(); popAt('吃飽了～好幸福！', W, 9.5, 'big'); });
    jenNotesUpdate(R, false);
  } else {                                                                                // 快樂歌唱
    const beat = Math.floor(R.t*3.2);
    applyPose(m, beat%4 === 3 ? POSE.singHigh : (beat%2 ? POSE.danceA : POSE.danceB), k); m.setFace('sing'); P_.mic.visible = true;
    m.holder.rotation.y = .25 + Math.sin(R.t*6)*.2;
    once('jw2', 3.1, ()=>popAt('♪ 早餐～好好吃～ ♪', W, 9.5, 'big'));
    for (let i=0;i<8;i++) once('jn'+i, 3.05 + i*.36, ()=>SFX.jenSing(i));
    once('jw3', 4.7, ()=>popAt('明天也要吃到飽～！', W, 9.5, 'big'));
    jenNotesUpdate(R, true);
  }
}
function jenLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0; Lz.m.holder.rotation.y = -0.1;
  const stage = new THREE.Group();
  const st = jenMicStand(); st.position.set(0.9, 0, 1.6); st.rotation.y = Math.PI; st.scale.setScalar(.95); stage.add(st);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(3.2, 16, 18, 1, true), new THREE.MeshBasicMaterial({color:0xfff1b8, transparent:true, opacity:.22, depthWrite:false, side:THREE.DoubleSide, fog:false}));
  beam.position.set(0, 8, 0); stage.add(beam);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(3, 24), new THREE.MeshBasicMaterial({color:0xfff1b8, transparent:true, opacity:.35, depthWrite:false, fog:false})); pool.rotation.x = -Math.PI/2; pool.position.y = .06; stage.add(pool);
  const dark = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), new THREE.MeshBasicMaterial({color:0x05040a, transparent:true, opacity:0, depthWrite:false, fog:false})); dark.position.set(0, 6, 3.4); stage.add(dark);
  stage.position.set(lp.x, RS_Y, lp.z); scene.add(stage); R.items.push(stage);
  R.jenBeam = beam; R.jenPool = pool; R.jenDark = dark;
  jenNotesSetup(R, lp.x, RS_Y + 7, lp.z + 1);
}
function jenLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m;
  for (const n in m.props) m.props[n].visible = false;
  if (R.t < 2.6){                                                                         // 在舞台上唱歌
    applyPose(m, Math.floor(R.t*3)%3 === 2 ? POSE.singHigh : POSE.standSing, k); m.setFace('sing');
    once('jl0', .2, ()=>popAt('♪ 今天～也要～加油喔～ ♪', Lz, 8.5));
    for (let i=0;i<6;i++) once('jls'+i, .1 + i*.4, ()=>SFX.jenSing(i));
    jenNotesUpdate(R, true);
  } else {
    jenNotesUpdate(R, false);
    const off = R.t > 3.0 || (R.t > 2.6 && Math.sin(R.t*60) > 0);                          // 燈閃兩下後熄滅
    R.jenBeam.visible = !off; R.jenPool.visible = !off;
    R.jenDark.material.opacity = off ? Math.min(.72, (R.t - 2.9)*2.2) : 0;
    once('jl1', 2.6, ()=>SFX.jenBuzz());
    once('jl2', 3.0, ()=>{ SFX.jenOff(); pop('啪。', Lz.m.holder.position.x + 2, RS_Y + 9, 'big'); });
    if (R.t < 4.0){ applyPose(m, POSE.standSing, k); m.setFace('shock'); once('jl3', 3.4, ()=>popAt('……欸？燈呢？', Lz, 8.5, 'blue')); }
    else { applyPose(m, POSE.sob, k); m.setFace('cry'); once('jl4', 4.1, ()=>{ SFX.sob(); popAt('我還沒唱完啦～～', Lz, 8.5, 'blue'); }); }
    once('jl5', 4.9, ()=>pop('（工作人員：場地時間到了喔）', Lz.m.holder.position.x - 1, RS_Y + 4, 'blue'));
  }
}

registerChar('jennie', {
  stats: { name:'珍妮', en:'Jennie', tag:'主唱・很會笑・唱跳・早餐大胃王', weight:1.0, run:14, air:11, jumpV:26, djV:23, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'嘿嘿！', sfx:'swing'},
    side:{t:[.26,.1,.32], pose:['batWind','batHit'], prop:'guitar', box:[3.1,3.4,1.8], dmg:16, kb:12, sc:1.1, ang:36, text:'吉他掄下去！', sfx:'jenStrum'},
    up:{t:[.16,.14,.3], pose:['upWind','singHigh'], prop:'mic', box:[0.4,6.8,2.1], dmg:12, kb:11, sc:1, ang:88, text:'高音～♪', sfx:'jenHigh', fire:[[.16,'jenNoteBurst']]},
    down:{t:[.2,.12,.3], pose:['stompWind','stompHit'], box:[0,0.9,3.1], dmg:12, kb:9, sc:.85, ang:70, text:'踩拍子！', sfx:'jenStomp', fire:[[.2,'jenStompFx']]},
    nair:{t:[.06,.22,.15], pose:['jenSpin','jenSpin'], box:[0,3,2.3], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.12,.1,.22], pose:['batWind','batHit'], prop:'guitar', box:[2.7,3.4,1.6], dmg:10, kb:8, sc:.9, ang:40, air:1, sfx:'jenStrum'},
    uair:{t:[.1,.12,.2], pose:['air','singHigh'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.2,.1,.26], pose:['spikeWind','spikeHit'], prop:'guitar', box:[0.6,0.2,1.8], dmg:13, kb:7, sc:.8, ang:-65, air:1, sfx:'jenStrum'},
    nB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], prop0:'food', fire:[[.2,'jenBrekkie']], air:1, sfx:'swing'},
    sB:{t:[.18,.3,.3], pose:['sing','singHigh'], poseSwitch:.15, prop:'mic', fire:[[.18,'jenWave']], air:1, text:'飆～高～音～！', textCls:'big', sfx:'jenHigh'},
    uB:{t:[.05,.55,.1], pose:['danceA','laughUp'], poseSwitch:.22, start:'jenUp', box:[0.4,5.2,1.8], dmg:7, kb:9, sc:.5, ang:80, helpless:1, air:1, text:'安可～！', textCls:'big'},
    dB:{t:[.2,.1,.35], pose:['plantMic','plantMic'], fire:[[.2,'jenStand']], air:1, text:'大家一起唱！', sfx:'jenChord'},
  },
  fire: {
    jenBrekkie(f){
      if (Math.random() < .08){                                                          // 低機率：大火鍋
        const p = proj({owner:f, x:f.x+f.face*1.8, y:f.y+5, vx:f.face*12, vy:15, g:30, r:1.4, life:2.6, dmg:15, kb:13, sc:1.0, ang:45, mesh:jenFood('hotpot', 1.25)});
        jenSoup_watch(p, f); pop('吃火鍋啦！！', f.x, f.y+8, 'big'); SFX.jenPot(); return;
      }
      const it = JEN_FOODS[Math.floor(Math.random()*JEN_FOODS.length)];
      const o = {owner:f, x:f.x+f.face*1.6, y:f.y+4.6, vx:f.face*15, vy:11, g:28, r:.95, life:2.2, bounce:1, dmg:6, kb:6, sc:.5, ang:48, soft:1, spin:1, mesh:jenFood(it.k, 1)};
      if (it.k==='teppan'){ o.spin = 0; o.slow = 1.2; o.vx = f.face*13; o.dmg = 7; }                     // 黑胡椒醬：黏黏的變慢
      else if (it.k==='lapancake'){ o.bounce = 3; o.dmg = 5; }                                            // 會彈很多下
      else if (it.k==='milktea'){ o.vx = f.face*24; o.vy = 3; o.g = 8; o.bounce = 0; o.soft = 0; o.dmg = 7; o.kb = 7; }   // 直直飛
      proj(o); pop(it.n + '！', f.x, f.y+7);
    },
    jenNoteBurst(f){ burst(f.x, f.y+7, 0xff8fc4, 6, 7); burst(f.x, f.y+7, 0xffd166, 4, 6); },
    jenStompFx(f){ ring(f.x, f.y+.5, 4); burst(f.x - 2, f.y+.4, 0xd8d0c0, 5, 5); burst(f.x + 2, f.y+.4, 0xd8d0c0, 5, 5); G.shake = Math.max(G.shake, reduce ? .05 : .2); },
    jenWave(f){ jenWave_spawn(f); },
    jenStand(f){ jenStand_spawn(f); },
  },
  start: {
    jenUp(f){ f.vy = 36; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xff8fc4, 10, 9); burst(f.x, f.y+1, 0xffd166, 6, 7); SFX.jenSing(3); },
  },
  onhit: {
    jenRinging(a, v){ v.state = 'stun'; v.stunT = .5; v.move = null; pop('耳朵嗡嗡嗡～', v.x, v.y+7.5, 'blue'); },
    jenDance(a, v){ v.state = 'stun'; v.stunT = .7; v.move = null; v.vy = 13; v.onGround = false; v.y += .05; pop('跟著跳！', v.x, v.y+7.5); },
  },
  poses: {
    sing: P({rSh:[-2.05,0,0.45], rEl:[-1.95], lSh:[-0.5,0,0.8], lEl:[-0.6], head:[-0.25], chest:[-0.1], drop:-0.05}),
    singHigh: P({rSh:[-2.15,0,0.45], rEl:[-1.85], lSh:[-2.4,0,0.7], lEl:[-0.3], head:[-0.5], chest:[-0.25], drop:0}),
    standSing: P({rSh:[-1.5,0,0.2], rEl:[-1.2], lSh:[-1.4,0,-0.15], lEl:[-1.1], head:[-0.2], chest:[0.05], drop:0}),
    danceA: S_({rSh:[-2.7,0,-0.4], rEl:[-0.3], lSh:[-0.4,0,0.7], lEl:[-1.2], chest:[0,0.3,0.15], head:[-0.1,0,0.15], rHp:[-0.15,0,-0.1], lHp:[-0.6,0,0.15], lKn:[1.0], rKn:[0.2], drop:-0.1}),
    danceB: S_({lSh:[-2.7,0,0.4], lEl:[-0.3], rSh:[-0.4,0,-0.7], rEl:[-1.2], chest:[0,-0.3,-0.15], head:[-0.1,0,-0.15], lHp:[-0.15,0,0.1], rHp:[-0.6,0,-0.15], rKn:[1.0], lKn:[0.2], drop:-0.1}),
    jenSpin: S_({rSh:[-0.2,0,-1.45], lSh:[-0.2,0,1.45], rEl:[-0.2], lEl:[-0.2], rHp:[-0.7,0,-0.1], rKn:[1.2], lHp:[0,0,0.1], lKn:[0.1], head:[-0.15], drop:-0.05}),
    stompWind: S_({rHp:[-1.25,0,-0.1], rKn:[1.4], lHp:[0,0,0.05], lKn:[0.1], rSh:[-0.5,0,-1.1], lSh:[-0.5,0,1.1], rEl:[-0.6], lEl:[-0.6], chest:[-0.15], head:[-0.1], drop:0}),
    stompHit: S_({rHp:[-0.55,0,-0.35], lHp:[-0.55,0,0.35], rKn:[0.95], lKn:[0.95], rSh:[-0.3,0,-1.4], lSh:[-0.3,0,1.4], rEl:[-0.2], lEl:[-0.2], chest:[0.25], head:[0.1], drop:-0.75}),
    plantMic: S_({rSh:[-0.9,0,-0.1], rEl:[-0.1], lSh:[-2.5,0,0.5], lEl:[-0.3], chest:[0.45], head:[-0.1], rHp:[-0.6], lHp:[-0.4], rKn:[0.8], lKn:[0.6], drop:-0.5}),
    jenEat: P({rSh:[-1.4,0,0.55], rEl:[-2.25], lSh:[-1.0,0,-0.25], lEl:[-1.7], head:[0.1], chest:[0.15], drop:-0.05}),
    jenEatB: P({rSh:[-1.1,0,0.4], rEl:[-1.8], lSh:[-1.0,0,-0.25], lEl:[-1.7], head:[-0.1], chest:[0.05], drop:-0.05}),
    guitarGuard: S_({lSh:[-1.0,0,-0.45], lEl:[-1.25], rSh:[-0.45,0,0.35], rEl:[-1.55], head:[0.2], chest:[0.25], drop:-0.35, rKn:[0.5], lKn:[0.5], rHp:[-0.4], lHp:[-0.2]}),
  },
  sfx: {
    jenStrum(){ [0,4,7,12].forEach((s,k)=>tone(NOTE(s-5),.5,'sawtooth',.05,1,k*.025)); noise(.12,.12,2400); },
    jenHigh(){ tone(NOTE(19),.5,'triangle',.16,1.02); tone(NOTE(31),.35,'sine',.05,1,.05); },
    jenStomp(){ noise(.12,.35,300); tone(90,.18,'sine',.3,.6); },
    jenChord(){ [0,4,7].forEach((s,k)=>tone(NOTE(s),.7,'triangle',.12,1,k*.06)); },
    jenSing(i){ const mel = [0,2,4,7,9,7,4,12,11,7]; const n = mel[(i|0) % mel.length]; tone(NOTE(n+7),.32,'triangle',.18); tone(NOTE(n+7)*1.005,.32,'sine',.08); },
    jenChomp(){ noise(.06,.25,1200); noise(.06,.2,900,.12); },
    jenPot(){ tone(220,.4,'square',.08,.5); noise(.4,.15,600); },
    jenSplash(){ noise(.5,.35,900); noise(.3,.2,3000,.08); tone(160,.3,'sine',.15,.5); },
    jenBuzz(){ tone(120,.25,'sawtooth',.06); noise(.2,.08,4000,.05); },
    jenOff(){ noise(.08,.4,700); tone(70,.4,'sine',.25,.5); },
  },
  build: buildJennie, face: jenFaces.normal, portraitBg: '#ffc2d9',
  portrait(g){
    g.fillStyle = JEN_HAIR; g.fillRect(4,3,56,12); g.fillRect(1,9,9,48); g.fillRect(54,9,9,48);
    for (let i=0;i<8;i++){ g.beginPath(); g.moveTo(6+i*7,14); g.lineTo(12+i*7,14); g.lineTo(8.5+i*7,21+(i%2)*3); g.closePath(); g.fill(); }
    g.fillStyle = '#9c7350'; g.fillRect(1,46,9,11); g.fillRect(54,46,9,11);
    g.fillStyle = '#f5f3ee'; g.fillRect(16,60,32,4); g.fillStyle = '#2f9a45'; g.fillRect(22,60,2,4); g.fillRect(40,60,2,4);
  },
  skins: [
    { name:'MALIBU 帽T', apply(c){ c.setOutfit('hoodie'); },
      portrait(g){ g.fillStyle = '#7d1f2c'; g.fillRect(8,58,48,6); g.fillStyle = '#ece6da'; g.fillRect(26,58,12,6); g.fillStyle = '#e2423a'; g.fillRect(22,58,2,6); g.fillRect(40,58,2,6); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#ff6fa8','#ffe066',0x6fc8ff); h.position.set(0.05,0.74,-0.02); c.head.add(h); } },
  ],
  // 防禦：吉他擋在胸前，粉紅泡泡＋繞圈的音符
  shield(){
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(3.2,14,10), new THREE.MeshBasicMaterial({color:0xffb8d6, transparent:true, opacity:.24, depthWrite:false})));
    for (let i=0;i<4;i++){ const n = spriteOf(jenNoteTex, 1.0, [0xff6fa8,0xffd166,0x6fc8ff,0xa8e06f][i]); const a = i/4*Math.PI*2; n.position.set(Math.cos(a)*2.7, (i%2)*0.8 - 0.4, Math.sin(a)*2.7); g.add(n); }
    return g;
  },
  shieldAnim(f){ f.shieldMesh.position.set(f.x, f.y+2.6, 0); f.shieldMesh.rotation.y += .08; },
  shieldPose: 'guitarGuard', shieldProp: 'lute', breakText: '弦斷了！', brokePose: 'dizzy',
  finalPose: 'singHigh', finalProp: 'mic',
  introPose: 'peace', readyPose: (t)=> Math.sin(t*8) > 0 ? POSE.danceA : POSE.danceB, selectSfx: ()=>SFX.jenSing(7),
  winSub: '"早餐吃飽，才有力氣唱歌！"',
  final: jenFinal, winSetup: jenWinSetup, winUpdate: jenWinUpdate, loseSetup: jenLoseSetup, loseUpdate: jenLoseUpdate,
  longWin: true, longLose: true,
});
