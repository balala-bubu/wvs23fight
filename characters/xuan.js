/* 璿 Xuan — 玄學少女。擲筊決定運勢，攻擊力時好時壞。loaded after js/core.js */
'use strict';

/* ================= textures ================= */
const XU_SKIN = '#f1d0b6', XU_SKIN_C = ['#e8c4a8','#f7dac4','#edc9ae'];
const XU_HAIR = '#15110f';
const xuSkinTex = tex(16,16,(g)=>speckle(g,16,16,XU_SKIN,XU_SKIN_C,.35));
function xuHairDraw(g){
  speckle(g,32,32,XU_HAIR,['#221a18','#0c0908','#2b211e'],.4);
  for (let x=0;x<32;x+=2){ g.fillStyle = x%4 ? 'rgba(0,0,0,.22)' : 'rgba(150,135,135,.16)'; g.fillRect(x + ((x*5)%3) - 1, 0, 1, 32); }
  const gr = g.createLinearGradient(0,0,0,32); gr.addColorStop(0,'rgba(255,255,255,0)'); gr.addColorStop(.42,'rgba(190,175,180,.20)'); gr.addColorStop(.7,'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0,0,32,32);
}
const xuHairTex = tex(32,32,xuHairDraw);

function xuFace(g, mode){
  speckle(g,64,64,XU_SKIN,XU_SKIN_C,.28); shadeFace(g);
  g.fillStyle = 'rgba(236,140,135,.22)';
  g.beginPath(); g.ellipse(15,45,6,3.8,0,0,7); g.fill(); g.beginPath(); g.ellipse(49,45,6,3.8,0,0,7); g.fill();
  g.fillStyle = '#241a16'; g.fillRect(15,27,10,2); g.fillRect(39,27,10,2);                       // brows
  g.strokeStyle = '#120c0a'; g.lineWidth = 1.8;
  const open = (x, w)=>{
    g.fillStyle = '#fbf6f1'; g.beginPath(); g.ellipse(x,37,5,3.8,0,0,7); g.fill();
    g.fillStyle = '#2a1b14'; g.beginPath(); g.ellipse(x,37,3.2,3.2,0,0,7); g.fill();
    g.fillStyle = '#fff'; g.fillRect(x+1,35,1.4,1.4);
    g.beginPath(); g.moveTo(x-6,36); g.quadraticCurveTo(x,32.5,x+6,36); g.lineTo(x+6+w*2.2,34); g.stroke();
  };
  const closedUp = (x)=>{ g.beginPath(); g.arc(x,39,4.6,Math.PI*1.12,Math.PI*1.88); g.stroke(); };
  const closedDown = (x)=>{ g.beginPath(); g.arc(x,35,4.6,Math.PI*.12,Math.PI*.88); g.stroke(); };
  const spiral = (x)=>{ for (let r=1.5;r<=4.5;r+=1.5){ g.beginPath(); g.arc(x,37,r,r,r+Math.PI*1.4); g.stroke(); } };
  const star = (x)=>{ g.fillStyle='#ffd34d'; for (let i=0;i<5;i++){ const a=-Math.PI/2+i*Math.PI*2/5; g.beginPath(); g.moveTo(x,37); g.lineTo(x+Math.cos(a)*4.6,37+Math.sin(a)*4.6); g.lineTo(x+Math.cos(a+1.0)*2,37+Math.sin(a+1.0)*2); g.closePath(); g.fill(); } };
  if (mode==='cry'){ closedDown(20); closedDown(44); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14); }
  else if (mode==='dizzy'){ spiral(20); spiral(44); }
  else if (mode==='lucky'){ star(20); star(44); }
  else if (mode==='doom'){ closedUp(20); closedUp(44); g.fillStyle='rgba(90,110,170,.35)'; g.fillRect(10,30,44,12); }
  else if (mode==='wink'){ open(20,-1); closedUp(44); }
  else if (mode==='shout'){ open(20,-1); open(44,1); }
  else { open(20,-1); open(44,1); }
  g.fillStyle = 'rgba(165,100,78,.3)'; g.fillRect(30,41,4,4);                                     // nose
  if (mode==='shout'){ g.fillStyle='#5a1a1a'; g.beginPath(); g.ellipse(32,51,6.5,5.5,0,0,7); g.fill(); g.fillStyle='#e07a7a'; g.beginPath(); g.ellipse(32,54,3.6,2,0,0,7); g.fill(); }
  else if (mode==='cry' || mode==='doom'){ g.strokeStyle='#a84f50'; g.lineWidth=2.4; g.beginPath(); g.moveTo(25,52); g.quadraticCurveTo(32,46,39,52); g.stroke(); }
  else { g.fillStyle='#c4706c'; g.beginPath(); g.moveTo(25,48); g.quadraticCurveTo(32,53,39,48); g.quadraticCurveTo(32,50.5,25,48); g.closePath(); g.fill(); }
  // 齊瀏海（厚、蓋到 y≈25）＋兩側長髮框住臉
  g.fillStyle = XU_HAIR; g.fillRect(0,0,64,16);
  for (let i=0;i<11;i++){ const x = i*6, d = (i===5)?2:0; g.beginPath(); g.moveTo(x-1,15); g.lineTo(x+7,15); g.lineTo(x+3+(i%3), 23+(i%2)*3+d); g.closePath(); g.fill(); }
  g.fillRect(0,0,7,64); g.fillRect(57,0,7,64);
  g.fillStyle = 'rgba(170,160,165,.3)'; [9,22,34,47].forEach(x=>g.fillRect(x,2,1,12));
}
const xuFaces = {};
['normal','cry','wink','dizzy','shout','lucky','doom'].forEach(k=>xuFaces[k] = tex(64,64,(g)=>xuFace(g,k)));

/* 原版：米白針織開襟外套＋灰色細肩帶背心 */
function xuKnit(g, w, h, base, line){
  for (let y=0;y<h;y++) for (let x=0;x<w;x++){ g.fillStyle = ((x+y)%3 && (x*7+y*3)%5) ? base : line; g.fillRect(x,y,1,1); }
  g.fillStyle = 'rgba(255,255,255,.18)'; for (let y=0;y<h;y+=3) g.fillRect(0,y,w,1);
}
const xuCardiTex = tex(32,46,(g)=>xuKnit(g,32,46,'#e7ded0','#d6cbb8'));
const xuCardiFront = tex(32,46,(g)=>{
  xuKnit(g,32,46,'#e7ded0','#d6cbb8');
  // 灰色背心（V 開口）
  g.fillStyle = '#8d9299'; g.beginPath(); g.moveTo(6,3); g.lineTo(26,3); g.lineTo(22,34); g.lineTo(10,34); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.22)'; for (let x=8;x<25;x+=3) g.fillRect(x,5,1,28);
  g.fillStyle = '#a6abb1'; g.fillRect(8,1,2,6); g.fillRect(22,1,2,6);                              // 細肩帶
  // 外套門襟（往兩側開，露出灰背心）
  g.fillStyle = '#f2ece1'; g.beginPath(); g.moveTo(0,0); g.lineTo(7,0); g.lineTo(3,46); g.lineTo(0,46); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(32,0); g.lineTo(25,0); g.lineTo(29,46); g.lineTo(32,46); g.closePath(); g.fill();
  g.fillStyle = 'rgba(150,138,118,.35)'; g.fillRect(4,0,1,46); g.fillRect(27,0,1,46);
  g.fillStyle = '#efe8db'; g.fillRect(0,41,32,5);                                                  // 下襬羅紋
  g.fillStyle = 'rgba(150,138,118,.3)'; for (let x=1;x<32;x+=3) g.fillRect(x,41,1,5);
});
const xuSkirtTex = tex(16,16,(g)=>speckle(g,16,16,'#22222a',['#2b2b34','#17171d'],.45));
const xuSockTex = tex(16,16,(g)=>speckle(g,16,16,'#f3f0e8',['#e8e4da','#fbf9f3'],.35));

/* 高中版：白 T（紅色點點蝴蝶結印花）＋牛仔短褲 */
const xuTeeFront = tex(96,128,(g)=>{
  g.scale(2,2);
  speckle(g,48,64,'#f6f5f2',['#eeedea','#fdfdfb'],.3);
  const bow = (cx, cy, s, rot)=>{
    g.save(); g.translate(cx,cy); g.rotate(rot); g.fillStyle = '#cf2a2f';
    g.beginPath(); g.ellipse(-s*1.05,0,s,s*.72,-.25,0,7); g.fill();
    g.beginPath(); g.ellipse(s*1.05,0,s,s*.72,.25,0,7); g.fill();
    g.beginPath(); g.ellipse(0,0,s*.4,s*.42,0,0,7); g.fill();
    g.fillStyle = '#fff';
    [[-1.4,-.3],[-.8,.35],[-1.5,.45],[1.4,-.3],[.85,.35],[1.5,.45],[-.55,-.45],[.6,-.45]].forEach(([dx,dy])=>{ g.beginPath(); g.arc(dx*s,dy*s,s*.16,0,7); g.fill(); });
    g.restore();
  };
  bow(24,26,7.5,-0.06);
  g.fillStyle = 'rgba(190,180,170,.25)'; g.fillRect(0,56,48,8);
  g.fillStyle = '#e9e7e2'; g.beginPath(); g.ellipse(24,3,7,3.2,0,0,7); g.fill();                   // 領口
});
const xuTeeTex = tex(32,46,(g)=>speckle(g,32,46,'#f6f5f2',['#eeedea','#fdfdfb'],.3));
const xuDenimTex = tex(16,16,(g)=>{
  speckle(g,16,16,'#7f9cc2',['#8fa9cb','#6f8cb2'],.5);
  g.fillStyle = 'rgba(255,255,255,.14)'; for (let y=0;y<16;y+=2) g.fillRect(0,y,16,1);
});
const xuBadgeTex = tex(96,128,(g)=>{
  g.scale(2,2);
  g.fillStyle = '#fbfaf6'; g.fillRect(0,0,48,64);
  g.fillStyle = '#2f6fb0'; g.fillRect(0,0,48,16);
  g.fillStyle = '#fff'; g.font = '900 11px sans-serif'; g.textAlign = 'center'; g.fillText('2026', 24, 12);
  g.fillStyle = '#c62828'; g.font = '900 13px sans-serif'; g.fillText('工作人員', 24, 34);
  g.fillStyle = '#4b5560'; g.font = '700 7px sans-serif'; g.fillText('璿 XUAN', 24, 46);
  g.fillStyle = '#d8d2c6'; g.fillRect(4,52,40,2);
  g.strokeStyle = '#c9c3b6'; g.lineWidth = 1; g.strokeRect(.5,.5,47,63);
  g.fillStyle = '#b9b3a6'; g.beginPath(); g.ellipse(24,20,4,2.4,0,0,7); g.fill();                  // 掛孔
});
const xuLanyardTex = tex(16,16,(g)=>{
  g.fillStyle = '#9fb6d6'; g.fillRect(0,0,16,16);
  g.fillStyle = '#eef3fa'; for (let y=1;y<16;y+=4) g.fillRect(1,y,14,2);
});

/* 法陣、符咒、塔羅、命盤 */
const xuSigilTex = tex(128,128,(g)=>{
  g.translate(64,64);
  g.strokeStyle = 'rgba(176,140,255,.95)'; g.lineWidth = 3;
  g.beginPath(); g.arc(0,0,58,0,7); g.stroke();
  g.lineWidth = 2; g.beginPath(); g.arc(0,0,46,0,7); g.stroke(); g.beginPath(); g.arc(0,0,22,0,7); g.stroke();
  g.strokeStyle = 'rgba(214,190,255,.9)'; g.lineWidth = 2.4;
  g.beginPath(); for (let i=0;i<5;i++){ const a = -Math.PI/2 + i*Math.PI*4/5; g[i?'lineTo':'moveTo'](Math.cos(a)*44, Math.sin(a)*44); } g.closePath(); g.stroke();
  g.fillStyle = 'rgba(232,216,255,.9)';
  for (let i=0;i<8;i++){ const a = i*Math.PI/4; g.save(); g.rotate(a); for (let k=0;k<3;k++) g.fillRect(-9, -54 + k*5, 18, 3); g.restore(); }
  g.fillStyle = 'rgba(255,245,210,.95)'; g.beginPath(); g.arc(0,0,8,0,7); g.fill();
});
const xuTalisTex = tex(32,64,(g)=>{
  g.fillStyle = '#f2d98a'; g.fillRect(0,0,32,64);
  g.fillStyle = 'rgba(190,150,70,.3)'; for (let y=0;y<64;y+=4) g.fillRect(0,y,32,1);
  g.strokeStyle = '#b61f22'; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.moveTo(16,6); g.lineTo(16,56); g.stroke();
  [14,26,38,48].forEach((y,i)=>{ g.beginPath(); g.moveTo(16,y); g.lineTo(16 + (i%2?9:-9), y+7); g.stroke(); });
  g.beginPath(); g.moveTo(8,8); g.lineTo(24,8); g.stroke();
  g.beginPath(); g.arc(16,58,4,0,7); g.stroke();
});
const xuCardTex = tex(64,96,(g)=>{
  g.fillStyle = '#2a2250'; g.fillRect(0,0,64,96);
  g.strokeStyle = '#e6c766'; g.lineWidth = 3; g.strokeRect(5,5,54,86);
  g.fillStyle = '#e6c766';
  for (let i=0;i<5;i++){ const a = -Math.PI/2 + i*Math.PI*4/5, b = -Math.PI/2 + (i+1)*Math.PI*4/5;
    g.beginPath(); g.moveTo(32+Math.cos(a)*22, 48+Math.sin(a)*22); g.lineTo(32+Math.cos(b)*22, 48+Math.sin(b)*22); g.lineWidth = 3; g.strokeStyle='#e6c766'; g.stroke(); }
  g.beginPath(); g.arc(32,48,8,0,7); g.fill();
});
const xuStarTex = tex(32,32,(g)=>{
  g.fillStyle = '#ffe79a'; g.translate(16,16);
  for (let i=0;i<4;i++){ g.save(); g.rotate(i*Math.PI/4); g.beginPath(); g.moveTo(0,-15); g.lineTo(3,0); g.lineTo(0,15); g.lineTo(-3,0); g.closePath(); g.fill(); g.restore(); }
});

/* ================= props（一律立體） ================= */
const xuOrbGlassM = new THREE.MeshLambertMaterial({color:0xc8b4ff, transparent:true, opacity:.5});
const xuOrbCoreM = new THREE.MeshBasicMaterial({color:0xfff0c0, transparent:true, opacity:.9, fog:false});
const xuGoldM = L({color:0xcfa84e}), xuRedM = L({color:0xb62a2a}), xuWoodM = L({color:0x6d4a2c});
function xuOrbMesh(s){
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.42,16,12), xuOrbGlassM); g.add(ball);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.18,10,8), xuOrbCoreM); g.add(core);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.44,0.05,6,18), xuGoldM); ring.rotation.x = Math.PI/2; ring.position.y = -0.3; g.add(ring);
  g.scale.setScalar(s || 1); g.userData.core = core; g.userData.ball = ball;
  return g;
}
function xuBwaMesh(){      // 筊杯：半圓柱，紅色，一面平一面圓
  const g = new THREE.Group();
  const half = new THREE.Mesh(new THREE.CylinderGeometry(0.26,0.2,0.5,14,1,false,0,Math.PI), xuRedM);
  half.rotation.z = Math.PI/2; g.add(half);
  const flat = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.04,0.46), L({color:0x8c1f1f})); flat.position.y = -0.01; g.add(flat);
  return g;
}
function xuTalisMesh(){
  const g = new THREE.Group();
  const m = L({map:xuTalisTex});
  const p = rbox(0.34,0.9,0.04,.1,[m,m,m,m,m,m]); p.position.y = -0.52; g.add(p);
  return g;
}
function xuCardMesh(){
  const g = new THREE.Group();
  const m = L({map:xuCardTex});
  const p = rbox(0.42,0.62,0.03,.08,[m,m,m,m,m,m]); p.position.y = -0.42; p.rotation.z = 0.2; g.add(p);
  return g;
}
function xuBagMesh(bodyColor, strapColor){        // 斜背小包
  const g = new THREE.Group();
  g.add(at(rbox(0.72,0.5,0.3,.2,L({color:bodyColor})),0,0,0));
  g.add(at(rbox(0.74,0.16,0.32,.2,L({color:bodyColor})),0,0.2,0.01));
  g.add(at(cyl(0.05,0.05,0.1,xuGoldM,8),0.3,0.06,0.16));
  const strap = new THREE.Group();
  const s1 = rbox(0.11,1.5,0.09,.3,L({color:strapColor})); s1.position.set(0.1,0.95,0); s1.rotation.z = -0.32; strap.add(s1);
  g.add(strap);
  return g;
}

/* ================= 運勢系統 ================= */
/* 好運：傷害 ×1.5；壞運：傷害 ×0.72 但補滿防禦。沿用 core 的 buffT/buffDmg/buffKb，不動 core。 */
function xuSetLuck(f, good){
  f.xuLuck = good ? 1 : -1;
  f.buffT = good ? 8 : 6;
  f.buffDmg = good ? 1.5 : 0.72;
  f.buffKb = good ? 1.2 : 0.85;
  if (!good) f.shieldHP = 50;
  xuAura(f, good);
}
function xuAura(f, good){
  G.finals.filter(F=>F.xuAu && F.owner===f).forEach(F=>F.kill = true);
  const g = new THREE.Group();
  const col = good ? 0xffd34d : 0x6d6ea8;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25,0.09,6,22), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.8, fog:false}));
  ring.rotation.x = Math.PI/2.3; g.add(ring);
  for (let i=0;i<4;i++){ const s = spriteOf(xuStarTex, good ? 0.8 : 0.6, col); const a = i/4*Math.PI*2; s.position.set(Math.cos(a)*1.3, 0, Math.sin(a)*1.3); g.add(s); }
  scene.add(g);
  G.finals.push({xuAu:1, owner:f, t:0, mesh:g, update(F, dt){
    if (F.kill || F.owner.buffT <= 0 || F.owner.state==='dead') return true;
    g.position.set(F.owner.x, F.owner.y + (good ? 8.3 : 7.9) + Math.sin(F.t*3)*.2, 0);
    g.rotation.y += dt*(good ? 2.4 : 1.1);
    return false;
  }});
}
/* 擲筊：丟出去 → 0.5 秒後開獎。冷卻 9 秒，冷卻中擲只會丟出筊杯、不開獎 */
const XU_CAST_CD = 9;
function xuCastBwa(f){
  for (let i=0;i<2;i++){
    const m = xuBwaMesh();
    proj({owner:f, x:f.x + f.face*(0.8 + i*0.5), y:f.y + 4.8, vx:f.face*(5 + i*2), vy:17 - i*2, g:48, r:.55, life:1.3,
      dmg:4, kb:5, sc:.3, ang:50, bounce:1, spin:1, soft:1, mesh:m});
  }
  SFX.xuCast();
  if (f.xuCd > 0){ pop('神明還在忙…(' + Math.ceil(f.xuCd) + 's)', f.x, f.y+8, 'blue'); return; }
  f.xuCd = XU_CAST_CD;
  G.finals.push({owner:f, t:0, mesh:null, update(F, dt){
    if (F.t < .5) return false;
    const r = Math.random();
    if (r < .26){ xuSetLuck(f, true); pop('聖筊！大吉・攻擊變強', f.x, f.y+8, 'big'); SFX.xuChime(); burst(f.x, f.y+5, 0xffd34d, 14, 9); }
    else if (r < .62){ f.meter = Math.min(100, f.meter + 20); pop('笑筊…再問一次', f.x, f.y+8, 'blue'); SFX.xuWood(); }
    else { xuSetLuck(f, false); pop('陰筊…凶（但防禦補滿）', f.x, f.y+8, 'red'); SFX.xuDoom(); burst(f.x, f.y+5, 0x6d6ea8, 10, 7); }
    return true;
  }, dispose(){} });
}
/* 上必殺：踩著符咒升天 */
function xuUpStart(f){
  f.vy = 35; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false;
  SFX.xuWhoosh();
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({map:xuTalisTex, transparent:true, side:THREE.DoubleSide});
  const p = new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.6), m); p.rotation.x = -Math.PI/2.2; g.add(p);
  scene.add(g);
  G.finals.push({owner:f, t:0, mesh:g, update(F, dt){
    g.position.set(F.owner.x, F.owner.y + 0.2, 0.2);
    g.rotation.y += dt*5; m.opacity = Math.max(0, 1 - F.t/0.9);
    return F.t > .9;
  }});
}
/* 下必殺：地上的封運法陣 */
function xuSigil_spawn(f){
  G.finals.filter(F=>F.xuSig && F.owner===f).forEach(F=>F.t = Math.max(F.t, F.dur - .4));
  const x = f.x, g = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({map:xuSigilTex, transparent:true, opacity:.9, depthWrite:false, fog:false});
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(6.4,6.4), mat); disc.rotation.x = -Math.PI/2; g.add(disc);
  const ringM = new THREE.MeshBasicMaterial({color:0xb08cff, transparent:true, opacity:.5, depthWrite:false, fog:false});
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7,0.08,6,26), ringM); ring.rotation.x = Math.PI/2; ring.position.y = .3; g.add(ring);
  g.position.set(x, .08, .35); scene.add(g);
  SFX.xuSeal();
  G.finals.push({xuSig:1, owner:f, t:0, dur:5, x, mesh:g, seen:new Set(), update(F, dt){
    const k = Math.min(1, F.t/.25), fade = Math.min(1, (F.dur - F.t)/1);
    g.scale.set(k, 1, k); mat.opacity = .9*Math.max(0, fade); ringM.opacity = .5*Math.max(0, fade);
    ring.rotation.z += dt*1.6; ring.position.y = .3 + Math.sin(F.t*3)*.15;
    for (const v of G.fighters){
      if (v===F.owner || v.state==='dead') continue;
      if (v.onGround && v.y < 2.5 && Math.abs(v.x - F.x) < 3.2){
        v.slowT = Math.max(v.slowT, .3); v.sadT = Math.max(v.sadT, .4);
        if (!F.seen.has(v)){ F.seen.add(v); pop('運勢被封住了！', v.x, v.y+7.5, 'blue'); }
      } else F.seen.delete(v);
    }
    return F.t > F.dur;
  }});
}

/* ================= model ================= */
function buildXuan(parent){
  const hairM = L({map:xuHairTex}), faceM = L({map:xuFaces.normal}), skinM = L({map:xuSkinTex});
  const cardiM = L({map:xuCardiTex}), cardiFrontM = L({map:xuCardiFront});
  const teeM = L({map:xuTeeTex}), teeFrontM = L({map:xuTeeFront}), denimM = L({map:xuDenimTex});
  const skirtM = L({map:xuSkirtTex}), sockM = L({map:xuSockTex});
  const cardiMats = [cardiM,cardiM,cardiM,cardiM,cardiFrontM,cardiM];
  const teeMats = [teeM,teeM,teeM,teeM,teeFrontM,teeM];
  const cardiBits = [], hsBits = [];

  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.14,
    torsoMat:cardiMats, sleeveMat:()=>cardiM, sleeve:[0.66,0.86],
    pantsM:skirtM, shoeM:L({color:0xf2efe6}), soleM:greySole,
    collar(chest){
      // 細金項鍊（原版）
      const neck = new THREE.Group();
      for (let i=-3;i<=3;i++){ const b = new THREE.Mesh(new THREE.SphereGeometry(0.045,6,4), xuGoldM); b.position.set(i*0.1, 1.98 - Math.abs(i)*0.045, 0.5); neck.add(b); }
      const pend = new THREE.Mesh(new THREE.OctahedronGeometry(0.08), xuGoldM); pend.position.set(0,1.78,0.52); neck.add(pend);
      chest.add(neck); chest.userData.neck = neck;
      // 掛繩＋識別證（高中版）
      const lan = new THREE.Group(), lanM = L({map:xuLanyardTex});
      [-1,1].forEach(s=>{ const b = rbox(0.1,1.1,0.06,.2,lanM); b.position.set(s*0.33, 1.72, 0.5); b.rotation.z = -s*0.2; lan.add(b); });
      const clip = rbox(0.1,0.16,0.07,.2,L({color:0xbdc3c9})); clip.position.set(0,1.14,0.52); lan.add(clip);
      const bm = L({map:xuBadgeTex});
      const badge = rbox(0.56,0.76,0.04,.06,[bm,bm,bm,bm,bm,bm]); badge.position.set(0,0.68,0.54); lan.add(badge);
      chest.add(lan); chest.userData.lan = lan;
    },
    hair(head){
      // 頂部＋後腦
      head.add(at(rbox(1.1,0.56,1.12,.66,hairM),0,0.5,-0.02));
      head.add(at(rbox(1.12,1.35,0.46,.5,hairM),0,-0.2,-0.34));
      [-0.4,-0.14,0.14,0.4].forEach((x,i)=>{ const st = rbox(0.3,1.6 + (i%2)*0.3,0.32,.45,hairM); st.position.set(x,-1.2 - (i%2)*0.12,-0.38); st.rotation.z = -x*0.1; head.add(st); });
      // 兩側長直髮（蓋到胸口）
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.16,0.9,0.7,.42,hairM),s*0.53,0.1,0.0));
        const side = rbox(0.32,2.05,0.76,.45,hairM); side.position.set(s*0.55,-0.78,0.0); side.rotation.z = s*0.035; head.add(side);
        const tip = rbox(0.26,0.52,0.56,.45,hairM); tip.position.set(s*0.6,-1.92,-0.04); tip.rotation.z = s*0.2; head.add(tip);
      });
      // 齊瀏海（立體片）
      head.add(at(rbox(1.02,0.3,0.16,.4,hairM),0,0.4,0.47));
      [-0.34,-0.11,0.12,0.35].forEach((x,i)=>{ const f = rbox(0.26,0.3,0.14,.45,hairM); f.position.set(x,0.2,0.48); f.rotation.z = (i-1.5)*0.07; head.add(f); });
    },
  }, parent);
  c.root.scale.set(0.92,0.88,0.92);                                   // 跟心瑩一樣高
  c.torso = c.chest.children[0];
  // 側髮蓋住耳朵，藏起來免得穿出一條膚色
  c.head.children.forEach(o=>{ if (o.isMesh && Math.abs(o.position.x) > 0.4 && Math.abs(o.position.y - 0.02) < .01) o.visible = false; });

  // 原版：黑短裙＋裸腿＋白短襪；高中版：牛仔短褲
  const legs = [c.joints.rHp, c.joints.lHp].map((hp, i)=>({hp, kn:[c.joints.rKn, c.joints.lKn][i]}));
  const skirt = new THREE.Group();
  skirt.add(at(rbox(1.5,0.95,1.05,.2,skirtM),0,-0.46,0));
  skirt.add(at(rbox(1.56,0.2,1.1,.22,L({color:0x16161c})),0,-0.92,0));
  c.hips.add(skirt); cardiBits.push(skirt);
  const shorts = new THREE.Group();
  shorts.add(at(rbox(1.46,0.92,1.04,.2,denimM),0,-0.44,0));
  [-1,1].forEach(s=>{ const cuff = rbox(0.76,0.2,0.84,.2,L({color:0x6b87ad})); cuff.position.set(s*0.4,-0.9,0); shorts.add(cuff); });
  c.hips.add(shorts); hsBits.push(shorts);
  const socks = [];
  legs.forEach(l=>{ const sk = rbox(0.62,0.5,0.66,.25,sockM); sk.position.y = -1.22; l.kn.add(sk); socks.push(sk); });

  const redBag = xuBagMesh(0xb3242c, 0xb3242c); redBag.position.set(-0.55,1.05,0.42); redBag.rotation.z = 0.1; c.chest.add(redBag); cardiBits.push(redBag);
  const whiteBag = xuBagMesh(0xf0ece2, 0xf0ece2); whiteBag.position.set(-0.58,1.0,0.42); whiteBag.rotation.z = 0.1; c.chest.add(whiteBag); hsBits.push(whiteBag);
  cardiBits.push(c.chest.userData.neck); hsBits.push(c.chest.userData.lan);

  c.setOutfit = (o)=>{
    const hs = o === 'hs';
    c.torso.material = hs ? teeMats : cardiMats;
    [c.R, c.Lf].forEach(a=>{
      a.sh.children[0].material = hs ? teeM : cardiM;
      a.sh.children[0].scale.set(1, hs ? 0.6 : 1, 1);                 // 高中版是短袖
      a.sh.children[1].material = hs ? skinM : cardiM;
      a.el.children[0].material = hs ? skinM : cardiM;
    });
    legs.forEach(l=>{ l.hp.children[0].material = skinM; l.kn.children[0].material = skinM; l.hp.children[0].scale.set(0.9,1,0.9); l.kn.children[0].scale.set(0.9,1,0.9); });
    socks.forEach(s=>s.visible = !hs);
    cardiBits.forEach(b=>b.visible = !hs); hsBits.forEach(b=>b.visible = hs);
  };
  c.setOutfit('cardi');

  const orb = xuOrbMesh(1); orb.position.set(0,-0.55,0); c.R.hd.add(orb);
  const talis = xuTalisMesh(); c.R.hd.add(talis);
  const card = xuCardMesh(); c.R.hd.add(card);
  const bwa = new THREE.Group();
  [-1,1].forEach(s=>{ const b = xuBwaMesh(); b.position.set(s*0.2,-0.42,0); b.rotation.z = s*0.3; bwa.add(b); });
  c.R.hd.add(bwa);
  c.props = {orb, talis, card, bwa};
  c.orb = orb;
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = xuFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = xuFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

/* ================= 大招：命盤定格 ================= */
function xuMash(F, v, need){
  const b = [v.bAtk, v.bSp, v.bJump, v.bFin];
  if (!F.mashP){ F.mashP = b.slice(); F.mashN = 0; }
  for (let i=0;i<4;i++) if (b[i] > F.mashP[i] + 1e-4) F.mashN++;
  F.mashP = b;
  return F.mashN >= need;
}
function xuFinal(f, opp){
  const tgt = nearestFoe(f) || opp;
  f.finalT = 3.6; banner('命盤定格！'); SFX.xuChime(); pop('讓我看看你的命……', f.x, f.y+7.8, 'big');
  const mesh = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(3.0,20,14), new THREE.MeshLambertMaterial({color:0xc0a8ff, transparent:true, opacity:.42}));
  mesh.add(ball);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(1.1,12,10), new THREE.MeshBasicMaterial({color:0xfff2c8, transparent:true, opacity:.8, fog:false})); mesh.add(glow);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2,0.16,8,28), xuGoldM); ring.rotation.x = Math.PI/2.4; mesh.add(ring);
  const dial = new THREE.Mesh(new THREE.PlaneGeometry(5.4,5.4), new THREE.MeshBasicMaterial({map:xuSigilTex, transparent:true, opacity:.85, depthWrite:false, fog:false}));
  dial.rotation.x = -Math.PI/2; dial.position.y = -3.4; mesh.add(dial);
  mesh.position.set(tgt ? tgt.x : f.x, 22, .2); scene.add(mesh);

  G.finals.push({owner:f, target:tgt, t:0, mesh, need:12, phase:0, hit:new Set(), update(F, dt){
    const v = F.target;
    const alive = v && v.state !== 'dead';
    const cx = alive ? v.x : mesh.position.x;
    // 1) 水晶球從天而降
    if (F.t < .9){
      mesh.position.set(cx, 22 - (22 - 4.2)*Math.min(1, F.t/.9), .2);
      ring.rotation.z += dt*4;
      return false;
    }
    if (F.phase === 0){
      F.phase = 1; SFX.xuSeal(); G.shake = Math.max(G.shake, reduce ? .1 : .4); burst(cx, 4, 0xc0a8ff, 18, 10);
      if (alive) pop('被關進水晶球了！快按鈕掙脫！', v.x, v.y+8, 'blue');
    }
    mesh.position.set(cx, 4.2 + Math.sin(F.t*3)*.2, .2);
    ring.rotation.z += dt*3; dial.rotation.z += dt*2.2;
    glow.scale.setScalar(1 + Math.sin(F.t*9)*.12);
    // 2) 困住＋狂按掙脫
    if (alive && F.phase === 1){
      if (xuMash(F, v, F.need)){
        F.phase = 3; v.state = 'idle'; v.stunT = 0;
        burst(v.x, v.y+3.2, 0xffffff, 16, 12); SFX.xuShatter(); pop('掙脫！', v.x, v.y+7.5, 'big');
        return true;
      }
      v.state = 'stun'; v.stunT = .4; v.move = null; v.vy = 2.2; v.vx *= Math.exp(-dt*5);
      const k = 1 - (F.mashN || 0)/F.need*.3;
      ball.scale.setScalar(k);
      if (F.t > 2.5) F.phase = 2;
    }
    // 3) 開命盤：算「對手」的命，運氣越差被轟得越遠
    if (F.phase === 2){
      F.phase = 3;
      SFX.xuShatter(); G.flash = .5; G.shake = Math.max(G.shake, reduce ? .12 : .55);
      burst(cx, 4.2, 0xfff0c0, 22, 14); burst(cx, 4.2, 0xc0a8ff, 18, 12);
      const dir = f.face;
      let worst = 0;
      for (const u of G.fighters){
        if (u === f || F.hit.has(u) || !u.hittable()) continue;
        if (Math.abs(u.x - cx) < 5 && u.y < 11){
          F.hit.add(u);
          const isTarget = u === v;
          // 每個人各自擲一卦：身上有壞運的更凶，有好運的能擋一下
          let r = Math.random();
          if (u.buffT > 0 && (u.buffDmg || 1) < 1) r -= .34;
          else if (u.buffT > 0) r += .26;
          if (!isTarget) r += .18;                         // 被濺到的人沒那麼衰
          const fate = r < .3 ? 2 : r < .66 ? 1 : 0;        // 2 大凶 / 1 中平 / 0 小吉
          worst = Math.max(worst, fate);
          u.pct += [10, 17, 26][fate];
          u.state = 'idle'; u.stunT = 0;
          launch(u, [14, 21, 30][fate] + u.pct*.11, 55, Math.sign(u.x - cx) || dir);
          SFX.hit(fate === 2 ? 55 : 35); spark(u.x, u.y+3, fate === 2 ? 6 : 4);
          pop(['小吉，算你好運', '中平…有點痛', '大凶！今年犯太歲'][fate], u.x, u.y+7.5, ['blue', '', 'red'][fate]);
          if (fate === 2) burst(u.x, u.y+3.2, 0x6d6ea8, 14, 11);
        }
      }
      if (worst === 2){ banner('大凶！'); SFX.xuDoom(); xuSetLuck(f, true); pop('你的凶…是我的吉', f.x, f.y+8, 'big'); }
      else if (worst === 1) banner('中平。');
      else { banner('小吉…算你好運'); pop('怎麼會這麼準…不對', f.x, f.y+8, 'blue'); }
      return true;
    }
    return F.t > 4.2;
  }});
}

/* ================= results ================= */
function xuWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.body.rotation.y = 0;
  const orb = xuOrbMesh(4.2); orb.position.set(wp.x + 2.6, RS_Y + 7.0, wp.z + 1.0); scene.add(orb); R.items.push(orb); R.xuOrb = orb;
  R.xuStars = [];
  for (let i=0;i<14;i++){
    const s = spriteOf(xuStarTex, 0.9 + Math.random()*0.7, 0xffe79a);
    s.position.set(wp.x + (Math.random()-.5)*10, RS_Y + 10 + Math.random()*8, wp.z + (Math.random()-.5)*4);
    s.visible = false; scene.add(s); R.items.push(s); R.xuStars.push({s, vy: 2 + Math.random()*2.5, y0: s.position.y});
  }
}
function xuWinUpdate(R, dt, k){
  const W = R.W, m = W.m, P_ = m.props;
  for (const n in P_) P_[n].visible = false;
  const core = R.xuOrb && R.xuOrb.userData.core;
  if (R.t < 2.0){
    P_.orb.visible = true;
    applyPose(m, POSE.ponder, k); m.setFace('normal');
    once('xuw0', .3, ()=>popAt('我幫你算一下喔……', W, 8.2));
    if (R.xuOrb){ R.xuOrb.rotation.y += dt*1.2; if (core) core.material.opacity = .5 + Math.sin(R.t*8)*.25; }
  } else {
    P_.card.visible = true;
    applyPose(m, Math.sin(R.t*9) > 0 ? POSE.cheer : POSE.peace, k); m.setFace('lucky');
    once('xuw1', 2.1, ()=>{ SFX.xuChime(); SFX2.fanfare(); popAt('大吉！我就說吧～', W, 9.2, 'big'); R.xuStars.forEach(o=>o.s.visible = true); });
    if (R.xuOrb){ R.xuOrb.rotation.y += dt*3; if (core){ core.material.opacity = .95; R.xuOrb.position.y = RS_Y + 7.0 + Math.sin(R.t*4)*.4; } }
    R.xuStars.forEach((o, i)=>{
      o.s.position.y -= o.vy*dt*2.2;
      o.s.material.rotation += dt*(1 + i*.1);
      if (o.s.position.y < RS_Y) o.s.position.y = o.y0;
    });
  }
}
function xuLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.body.rotation.y = 0;
  R.xuCards = [];
  for (let i=0;i<7;i++){
    const m = L({map:xuCardTex});
    const card = rbox(0.9,1.3,0.06,.08,[m,m,m,m,m,m]);
    card.position.set(lp.x + (i-3)*1.1 + (Math.random()-.5), RS_Y + 6 + Math.random()*3, lp.z + 1.2 + (Math.random()-.5));
    card.rotation.set(0,0,Math.random()*3);
    scene.add(card); R.items.push(card);
    R.xuCards.push({card, vy: -2 - Math.random()*3, spin:(Math.random()-.5)*4, rest: RS_Y + 0.08});
  }
  const orb = xuOrbMesh(2.0); orb.position.set(lp.x + 1.2, RS_Y + 1.0, lp.z + 1.4); scene.add(orb); R.items.push(orb); R.xuOrb2 = orb;
}
function xuLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, lp = m.holder.position;
  for (const n in m.props) m.props[n].visible = false;
  R.xuCards.forEach(o=>{
    if (o.card.position.y > o.rest){ o.card.position.y = Math.max(o.rest, o.card.position.y + o.vy*dt*3); o.card.rotation.z += o.spin*dt; }
    else { o.card.rotation.x = -Math.PI/2; o.card.position.y = o.rest; }
  });
  if (R.xuOrb2){ R.xuOrb2.position.x += dt*1.6; R.xuOrb2.rotation.z -= dt*4; }
  if (R.t < 1.4){
    applyPose(m, POSE.dizzy, k); m.setFace('dizzy');
    once('xul0', .2, ()=>{ SFX.xuDoom(); popAt('怎麼…沒算到這一招……', Lz, 7.6, 'blue'); });
  } else {
    applyPose(m, POSE.sob, k); m.setFace('cry');
    once('xul1', 1.5, ()=>{ SFX2.sigh(); popAt('下次換你算啦……', Lz, 7.4, 'blue'); });
  }
}

/* ================= register ================= */
registerChar('xuan', {
  stats: { name:'璿', en:'Xuan', tag:'很玄・水晶球占卜・運氣全靠擲筊', weight:1.0, run:11, air:9.5, jumpV:30, djV:26, jumps:2 },
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'天靈靈！'},
    side:{t:[.26,.12,.34], pose:['batWind','batHit'], box:[2.9,3.4,1.8], dmg:15, kb:12, sc:1.1, ang:36, prop:'orb', sfx:'xuWhoosh', text:'水晶球砸！'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,6.6,1.9], dmg:12, kb:11, sc:1, ang:88, prop:'bwa', sfx:'xuWood'},
    down:{t:[.2,.1,.32], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:11, kb:9, sc:.85, ang:70, prop:'talis', sfx:'xuSeal'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.1,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1, prop:'card'},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.26], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.8], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'orb'},
    // 中必殺：擲筊占卜（自己的運勢）
    nB:{t:[.26,.08,.62], pose:['throwWind','throwHit'], prop0:'bwa', fire:[[.24,'xuBwaFire']], air:1, text:'擲筊！'},
    // 側必殺：水晶球滾出去
    sB:{t:[.2,.08,.36], pose:['serveWind','serveHit'], prop0:'orb', fire:[[.2,'xuOrbRoll']], air:1, text:'滾吧水晶球～'},
    // 上必殺：踩符咒升天（自救）
    uB:{t:[.05,.55,.12], pose:['setUp','upHit'], poseSwitch:.3, start:'xuRise', box:[0.5,5.2,1.8], dmg:8, kb:9, sc:.55, ang:82, helpless:1, air:1, prop:'talis'},
    // 下必殺：封運法陣
    dB:{t:[.24,.14,.4], pose:['ponder','bookSlam'], prop:'talis', fire:[[.26,'xuSealFire']], air:1, text:'封！'},
  },
  fire: {
    xuBwaFire(f){ xuCastBwa(f); },
    xuOrbRoll(f){
      const m = xuOrbMesh(1.9);
      proj({owner:f, x:f.x + f.face*2.0, y:f.y + 2.2, vx:f.face*19, vy:1, g:34, r:.85, life:2.0,
        dmg:11, kb:9, sc:.8, ang:38, bounce:2, spin:1, slow:1.2, mesh:m});
      SFX.xuWhoosh();
    },
    xuSealFire(f){ xuSigil_spawn(f); },
  },
  start: { xuRise(f){ xuUpStart(f); } },
  sfx: {
    xuChime(){ tone(NOTE(12),.5,'sine',.16,0,0); tone(NOTE(16),.5,'sine',.12,0,.06); tone(NOTE(19),.6,'sine',.1,0,.12); },
    xuWood(){ tone(240,.08,'square',.14,-60); noise(.06,.1,900); },
    xuCast(){ tone(300,.07,'square',.12,-80); tone(260,.09,'square',.1,-70,.08); },
    xuDoom(){ tone(150,.5,'sine',.2,-70); noise(.3,.12,180); },
    xuWhoosh(){ noise(.22,.14,520); tone(520,.2,'sine',.08,-260); },
    xuSeal(){ tone(NOTE(7),.3,'triangle',.14,0); tone(NOTE(0),.4,'triangle',.12,0,.05); noise(.12,.08,300); },
    xuShatter(){ noise(.35,.3,2200); tone(900,.25,'triangle',.12,-600); },
  },
  build: buildXuan, face: xuFaces.normal, portraitBg: '#9d85d8',
  portrait(g){ g.fillRect(6,2,52,22); g.fillRect(4,16,13,46); g.fillRect(47,16,13,46); g.fillRect(6,2,52,10); },
  skins: [
    { name:'高中工作人員', apply(c){ c.setOutfit('hs'); },
      portrait(g){ g.fillStyle = '#f6f5f2'; g.fillRect(10,52,44,12); g.fillStyle = '#cf2a2f'; g.fillRect(24,55,16,5); g.fillStyle = '#9fb6d6'; g.fillRect(29,50,6,8); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#b08cff','#ffe066',0xfff0c0); h.position.set(0.04,0.76,-0.02); c.head.add(h); } },
  ],
  // 防禦：八卦光盤擋在身前
  shield(){
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(3.2,14,10), new THREE.MeshBasicMaterial({color:0xc0a8ff, transparent:true, opacity:.22, depthWrite:false})));
    const disc = new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4), new THREE.MeshBasicMaterial({map:xuSigilTex, transparent:true, opacity:.8, depthWrite:false, fog:false}));
    disc.position.z = 1.9; g.add(disc); g.userData.disc = disc;
    return g;
  },
  shieldAnim(f){
    f.shieldMesh.position.set(f.x, f.y + 3.0, 0);
    const d = f.shieldMesh.userData.disc; if (d) d.rotation.z += .05;
    f.shieldMesh.rotation.y += .02;
  },
  shieldPose: 'ponder', shieldProp: 'talis', breakText: '法陣碎了！', brokePose: 'dizzy',
  finalPose: 'ponder', finalProp: 'orb',
  animate(f, m, s, t, dt){
    if (f.xuCd > 0) f.xuCd -= dt;                               // 擲筊冷卻
    // 水晶球核心隨運勢變色；運勢中的表情
    const core = m.orb && m.orb.userData.core;
    if (core){
      const good = f.buffT > 0 && f.xuLuck === 1, bad = f.buffT > 0 && f.xuLuck === -1;
      core.material.color.setHex(good ? 0xffd34d : bad ? 0x6d6ea8 : 0xfff0c0);
      core.material.opacity = .6 + Math.sin(t*6)*.25;
    }
    if (f.buffT > 0 && (s === 'idle' || s === 'run')) m.setFace(f.xuLuck === 1 ? 'lucky' : 'doom');
    else if (s === 'idle' || s === 'run') m.setFace('normal');
  },
  onSpawn(f){ f.xuLuck = 0; f.xuCd = 0; },
  introPose: 'ponder', readyPose: (t)=> Math.sin(t*10) > 0 ? POSE.peace : POSE.ponder, selectSfx: ()=>SFX.xuChime(),
  winSub: '"Let me read your fortune."',
  final: xuFinal, winSetup: xuWinSetup, winUpdate: xuWinUpdate, loseSetup: xuLoseSetup, loseUpdate: xuLoseUpdate,
  longWin: false, longLose: false,
});
