/* map: ntu — loaded after js/core.js and the characters */
'use strict';
/* --- map 2: NTU main library --- */
const ntuSkyTex = tex(4,64,(g)=>{
  const gr=g.createLinearGradient(0,0,0,64);
  gr.addColorStop(0,'#5d8fc9'); gr.addColorStop(.42,'#9cc0e2'); gr.addColorStop(.55,'#e9e2cf'); gr.addColorStop(1,'#d9e3c8');
  g.fillStyle=gr; g.fillRect(0,0,4,64);
});
ntuSkyTex.magFilter = THREE.LinearFilter;
const libTex = tex(160,96,(g)=>{
  const brick = (x,y,w,h)=>{ g.fillStyle='#ad5f3f'; g.fillRect(x,y,w,h); for(let i=0;i<w*h*.35;i++){ g.fillStyle=['#9c5235','#ba6c49','#a45a3a','#c27552'][(rnd()*4)|0]; g.fillRect(x+((rnd()*w)|0), y+((rnd()*h)|0), 1, 1); } };
  const cream = (x,y,w,h)=>{ g.fillStyle='#e8dcc2'; g.fillRect(x,y,w,h); for(let i=0;i<w*h*.2;i++){ g.fillStyle=['#ddd0b4','#f1e7d0'][(rnd()*2)|0]; g.fillRect(x+((rnd()*w)|0), y+((rnd()*h)|0), 1, 1); } };
  const win = (x,y,w,h,arch)=>{ g.fillStyle='#e8dcc2'; g.fillRect(x-1,y-1,w+2,h+2); g.fillStyle='#3a3f48'; g.fillRect(x,y,w,h); if(arch){ g.beginPath(); g.arc(x+w/2,y,w/2,Math.PI,0); g.fillStyle='#e8dcc2'; g.fill(); g.beginPath(); g.arc(x+w/2,y,w/2-1,Math.PI,0); g.fillStyle='#3a3f48'; g.fill(); } g.fillStyle='#8a94a2'; g.fillRect(x+w/2,y,1,h); };
  g.clearRect(0,0,160,96);
  // wings
  brick(4,28,152,60); brick(14,18,30,12); brick(116,18,30,12);
  cream(14,16,30,3); cream(116,16,30,3); cream(4,27,152,2);
  // central block + pediment
  brick(48,20,64,68);
  g.beginPath(); g.moveTo(44,22); g.lineTo(80,6); g.lineTo(116,22); g.closePath(); g.fillStyle='#ad5f3f'; g.fill();
  g.strokeStyle='#e8dcc2'; g.lineWidth=2; g.stroke();
  g.fillStyle='#e8dcc2'; g.beginPath(); g.arc(80,15,3,0,7); g.fill(); g.fillStyle='#8a94a2'; g.beginPath(); g.arc(80,15,2,0,7); g.fill();
  // cream inner portal with big arched window
  g.beginPath(); g.moveTo(58,32); g.lineTo(80,24); g.lineTo(102,32); g.closePath(); g.fillStyle='#e8dcc2'; g.fill();
  cream(60,32,40,30);
  g.beginPath(); g.arc(80,44,13,Math.PI,0); g.fillStyle='#4a5260'; g.fill(); g.fillStyle='#4a5260'; g.fillRect(67,44,26,18);
  g.fillStyle='#9aa6b4'; for(let x=70;x<92;x+=4) g.fillRect(x,34,1,28); for(let y=40;y<62;y+=5) g.fillRect(67,y,26,1);
  // windows rows
  for (const x of [20,32,124,136]){ win(x,34,6,8); win(x,50,6,8); }
  for (const x of [52,104]){ win(x,30,5,8); win(x,46,5,8); }
  win(26,33,10,10,true); win(124,33,10,10,true);
  // balconies
  cream(18,64,22,3); cream(120,64,22,3); cream(60,62,40,3);
  // ground floor arcade
  cream(4,70,152,18);
  for (let i=0;i<9;i++){ const x = 10 + i*16.5; g.fillStyle='#2a2a2e'; g.fillRect(x,76,10,12); g.beginPath(); g.arc(x+5,76,5,Math.PI,0); g.fill(); }
  brick(56,68,48,4);
});
const palmTex = tex(48,48,(g)=>{
  const cols=['#2f5a2a','#3f7334','#4f8a3c','#26491f'];
  for(let k=0;k<11;k++){
    const a = -Math.PI*0.95 + k*(Math.PI*0.95/5) + (rnd()-.5)*.2;
    for(let s=0;s<22;s++){
      const t=s/22, x=24+Math.cos(a)*s*1.05, y=22+Math.sin(a)*s*0.8 + t*t*12;
      g.fillStyle=cols[(rnd()*4)|0]; g.fillRect(x|0,y|0,2,2);
      if(s%2===0){ g.fillRect((x+1)|0,(y+2)|0,1,2); }
    }
  }
  g.fillStyle='#5a4426'; g.fillRect(22,20,4,4);
});
const lawnTex = tex(32,32,(g)=>speckle(g,32,32,'#5f8f3a',['#6b9c42','#548233','#76a64a'],.6),[60,60]);
const lawnTopTex = tex(32,32,(g)=>speckle(g,32,32,'#6a9a40',['#78a84a','#5c8a36','#82b052'],.6),[8,2]);
const brickTex = tex(32,32,(g)=>{ speckle(g,32,32,'#ad5f3f',['#9c5235','#ba6c49','#c27552'],.4); g.fillStyle='rgba(230,215,190,.35)'; for(let y=0;y<32;y+=4){ g.fillRect(0,y,32,1); for(let x=(y/4%2)*4;x<32;x+=8) g.fillRect(x,y,1,4); } },[6,1]);
const hedgeTex = tex(16,16,(g)=>speckle(g,16,16,'#2c4f26',['#365e2d','#23421f','#40683a'],.6));
{
  const g = new THREE.Group(); scene.add(g);
  const W = 21;
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:lawnTex})); lawn.rotation.x = -Math.PI/2; lawn.position.y = -26; g.add(lawn);
  const topM = L({map:lawnTopTex}), sideM = L({map:brickTex}), earthM = L({map:rockTex});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), earthM); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-16,x2:-8,y:7.5}, {x1:8,x2:16,y:7.5} ];
  const creamM = L({color:0xe8dcc2});
  plats.forEach(p=>addPlatform(g,p,creamM,sideM,earthM));
  // the library, standing on the far lawn
  const libM = new THREE.MeshLambertMaterial({map:libTex, alphaTest:.5, side:THREE.DoubleSide});
  const lib = new THREE.Mesh(new THREE.PlaneGeometry(84,50), libM); lib.position.set(0,-26+25,-125); g.add(lib);
  const body = new THREE.Mesh(new THREE.BoxGeometry(79,33,22), L({map:brickTex})); body.position.set(0,-26+16.5,-141); g.add(body);
  // steps
  for (let i=0;i<4;i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(34-i*3,0.9,3), L({color:0xcfc6b2})),0,-26+0.45+i*0.9,-117-i*2.2));
  // palm avenue
  const trunkM = L({color:0x8a7a62});
  const palm = (x,z,h)=>{
    const t = cyl(.55,.8,h,trunkM,6); t.position.set(x,-26+h/2,z); g.add(t);
    const c = new THREE.Sprite(new THREE.SpriteMaterial({map:palmTex, alphaTest:.5, fog:true})); c.scale.set(16,16,1); c.position.set(x,-26+h+3,z); g.add(c);
  };
  // 椰林大道: two rows of palms running toward the library
  for (let i=0;i<7;i++){ const z = -24 - i*14; palm(-24, z, 24+rnd()*5); palm(24, z, 24+rnd()*5); }
  // hedges either side of the library entrance
  for (let i=0;i<8;i++){ const s = 1 + (i%2); g.add(at(rbox(9,5*s/1.5,6,.6,L({map:hedgeTex})),(i<4?-1:1)*(22 + (i%4)*8),-26+2.5,-112 - (i%4)*2)); }
  registerMap('ntu', { name:'台大總圖', group:g, W, plats, sky:ntuSkyTex, fog:0xcdd9df, fogNear:110, fogFar:360, hemi:[0xe6f0ff,0x4a5a38], sun:0xffd6a0, rim:0xa8c8ff });
}

