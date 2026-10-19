/* map: india — loaded after js/core.js and the characters */
'use strict';
/* --- map 4: Indian street --- */
const indSkyTex = tex(4,64,(g)=>{
  const gr=g.createLinearGradient(0,0,0,64);
  gr.addColorStop(0,'#e9b97a'); gr.addColorStop(.45,'#f3d39a'); gr.addColorStop(.6,'#f6e2b6'); gr.addColorStop(1,'#e8c79a');
  g.fillStyle=gr; g.fillRect(0,0,4,64);
});
indSkyTex.magFilter = THREE.LinearFilter;
const dustTex = tex(32,32,(g)=>speckle(g,32,32,'#c9a77a',['#d6b68a','#b8966a','#ddc29a','#a8865c'],.6),[60,60]);
const roadTex = tex(32,32,(g)=>{ speckle(g,32,32,'#b89a72',['#c4a87e','#a88a62','#cfb58c'],.6); g.fillStyle='rgba(70,50,30,.25)'; g.fillRect(0,9,32,2); g.fillRect(0,21,32,2); for(let i=0;i<10;i++){ g.fillStyle=['#e07a1a','#d8283c','#f2c14e'][i%3]; g.fillRect((rnd()*32)|0,(rnd()*32)|0,1,1); } },[8,2]);
const indBrickTex = tex(32,32,(g)=>{ speckle(g,32,32,'#a8603c',['#b86c46','#985434','#c27a52'],.4); g.fillStyle='rgba(235,215,180,.35)'; for(let y=0;y<32;y+=4){ g.fillRect(0,y,32,1); for(let x=(y/4%2)*4;x<32;x+=8) g.fillRect(x,y,1,4); } },[6,1]);
const awningTex = tex(16,16,(g)=>{ for(let x=0;x<16;x+=4){ g.fillStyle = x%8 ? '#f4f0e6' : '#e0483c'; g.fillRect(x,0,4,16); } },[4,1]);
const awning2Tex = tex(16,16,(g)=>{ for(let x=0;x<16;x+=4){ g.fillStyle = x%8 ? '#f2c14e' : '#2f9a6a'; g.fillRect(x,0,4,16); } },[4,1]);
function facadeTex(base, trim, shut, sign){
  return tex(64,96,(g)=>{
    speckle(g,64,96,base,[trim+'',base],.15);
    g.fillStyle='rgba(0,0,0,.12)'; for(let i=0;i<40;i++) g.fillRect((rnd()*64)|0,(rnd()*96)|0,1+((rnd()*3)|0),1);
    for (let r=0;r<4;r++) for (let c=0;c<3;c++){
      const x = 6 + c*20, y = 6 + r*16;
      g.fillStyle = '#2a2420'; g.fillRect(x,y,12,10);
      g.fillStyle = shut; g.fillRect(x-3,y,3,10); g.fillRect(x+12,y,3,10);
      g.fillStyle = trim; g.fillRect(x-1,y-2,14,2);
      if (r%2) { g.fillStyle = '#3a3230'; g.fillRect(x-2,y+10,16,1); for(let k=0;k<16;k+=3) g.fillRect(x-2+k,y+7,1,3); }
    }
    g.fillStyle = trim; g.fillRect(0,68,64,3);
    g.fillStyle = '#3a2a20'; g.fillRect(4,78,56,18);
    g.fillStyle = sign[0]; g.fillRect(6,71,52,7);
    g.fillStyle = sign[1]; g.font = 'bold 7px sans-serif'; g.textAlign = 'center'; g.fillText(sign[2], 32, 77);
    for (let x=6;x<58;x+=6){ g.fillStyle = ['#e07a1a','#f2c14e','#d8283c','#4fa3ff'][(x/6)%4|0]; g.fillRect(x,80,4,6); }
  });
}
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const far = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:dustTex})); far.rotation.x = -Math.PI/2; far.position.y = -26; g.add(far);
  const street = new THREE.Mesh(new THREE.PlaneGeometry(400,70), L({map:dustTex})); street.rotation.x = -Math.PI/2; street.position.set(0,-3,-43); g.add(street);
  const topM = L({map:roadTex}), sideM = L({map:indBrickTex});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), L({map:rockTex})); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  // market-stall awnings as platforms
  const plats = [ {x1:-16,x2:-8,y:7}, {x1:8,x2:16,y:7}, {x1:-4,x2:4,y:12.5} ];
  const aw = [L({map:awningTex}), L({map:awning2Tex}), L({map:awningTex})], poleM = L({color:0x6b4423});
  plats.forEach((p,i)=>{
    const w = p.x2 - p.x1, cx = (p.x1+p.x2)/2;
    g.add(at(rbox(w,0.35,4,.2,[aw[i],aw[i],aw[i],aw[i],aw[i],aw[i]]),cx,p.y-0.18,0));
    const fr = new THREE.Mesh(new THREE.BoxGeometry(w,0.5,0.06), aw[i]); fr.position.set(cx,p.y-0.55,2.02); g.add(fr);
    if (p.y < 10) [-1,1].forEach(sd=>g.add(at(cyl(0.1,0.1,p.y,poleM,5),cx+sd*(w/2-0.3),p.y/2,-1.6)));
  });
  // chai stall under the left awning
  g.add(at(rbox(5,2,1.6,.15,L({color:0x8a5a34})),-12,1,-1.6));
  g.add(at(cyl(0.45,0.4,0.9,L({color:0xb8b8c0}),10),-13,2.45,-1.6));
  [-11.5,-11,-10.5].forEach(x=>g.add(at(cyl(0.14,0.11,0.3,L({color:0xd88a4a}),6),x,2.15,-1.4)));
  // building row along the street
  const pal = [['#e98aa8','#f6e2c8','#2f9a6a'],['#f2c14e','#c8402c','#3a6fae'],['#5fc4b8','#f4f0e6','#e07a1a'],['#c86a3a','#f2d49a','#2f9a6a'],['#9a7ad8','#f6e2c8','#f2c14e'],['#f0a050','#ffffff','#d8283c']];
  const signs = [['#f2c14e','#c8402c','चाय CHAI'],['#2f9a6a','#ffffff','होटल HOTEL'],['#d8283c','#ffffff','MASALA'],['#3a6fae','#ffffff','मिठाई SWEETS'],['#ffffff','#d8283c','SAREE'],['#f2c14e','#2a2420','JUICE']];
  const fac = pal.map((c,i)=>L({map:facadeTex(c[0],c[1],c[2],signs[i])}));
  const plain = pal.map(c=>L({color:new THREE.Color(c[0]).multiplyScalar(.85)}));
  let x = -96;
  for (let i=0; x < 96; i++){
    const w = 10 + rnd()*6, h = 18 + rnd()*16, k = i%6, z = -24 - rnd()*3;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w,h,10), [plain[k],plain[k],plain[k],plain[k],fac[k],plain[k]]); b.position.set(x + w/2, -3 + h/2, z - 5); g.add(b);
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(w+0.6,0.6,10.6), L({color:0xe8dcc2})), x + w/2, -3 + h, z - 5));
    if (i%3===0){ const tank = cyl(1,1,2,L({color:0x2a2a2e}),8); tank.position.set(x + w*0.7, -3 + h + 1.3, z - 6); g.add(tank); }
    x += w + 0.4;
  }
  // a temple tower in the distance
  const tm = L({color:0xd8a060});
  for (let i=0;i<6;i++) g.add(at(new THREE.Mesh(new THREE.BoxGeometry(18-i*2.6,6,10-i*1.2), tm),40,-3+30+i*6,-90));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(2,8,6), L({color:0xf2c14e})),40,-3+30+36+1.5,-90));
  // tangled power lines + marigold garlands across the street
  const wireM = L({color:0x1d1d22}), mariM = [L({color:0xff8a1a}), L({color:0xffc21a})];
  const sag = (x1,y1,x2,y2,z,dip,make)=>{
    const pts = []; for (let i=0;i<=12;i++){ const u = i/12; pts.push(new THREE.Vector3(x1+(x2-x1)*u, y1+(y2-y1)*u - Math.sin(u*Math.PI)*dip, z)); }
    make(pts);
  };
  for (let i=0;i<9;i++){
    const xa = -70 + i*16;
    sag(xa, 16+rnd()*6, xa+20+rnd()*8, 15+rnd()*6, -16 - (i%3)*1.5, 2+rnd()*3, pts=>g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,0.06,3), wireM)));
  }
  const ballGeo = new THREE.SphereGeometry(0.32,6,4);
  [[-38,-4],[-8,-2],[22,-4]].forEach(([xa,dy])=>sag(xa,20+dy,xa+26,20+dy,-14,4,pts=>{
    const curve = new THREE.CatmullRomCurve3(pts);
    for (let i=0;i<=40;i++){ const p = curve.getPoint(i/40); const m = new THREE.Mesh(ballGeo, mariM[i%2]); m.position.copy(p); g.add(m); }
  }));
  // poles
  [-70,-38,-6,26,58].forEach(px=>g.add(at(cyl(0.3,0.35,26,L({color:0x6a6a6a}),6),px,10,-17)));
  // tuk-tuks driving along the street
  const tuk = (col)=>{
    const t = new THREE.Group(), body = L({color:col}), roof = L({color:0x1f6a3a}), tire = L({color:0x1d1d22});
    t.add(at(rbox(3.4,1.6,2.2,.4,body),0,1.4,0));
    t.add(at(rbox(1.2,1.4,2.0,.4,body),1.6,2.4,0));
    t.add(at(rbox(3.6,0.3,2.4,.3,roof),-0.1,3.6,0));
    [[-1.5,1],[-1.5,-1],[1.5,1],[1.5,-1]].forEach(([px,pz])=>t.add(at(cyl(0.06,0.06,1.6,black,4),px,2.8,pz)));
    [[-1.1,1.15],[-1.1,-1.15],[1.7,0]].forEach(([px,pz])=>{ const w = cyl(0.5,0.5,0.35,tire,10); w.rotation.x = Math.PI/2; w.position.set(px,0.5,pz); t.add(w); });
    t.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.3,0.4), L({color:0xfff2b0, emissive:0x806a20})),2.25,2.0,0));
    return t;
  };
  const tuks = [{o:tuk(0xf2c81e), z:-12, sp:9, x0:-60}, {o:tuk(0x2f9a6a), z:-19, sp:-7, x0:40}];
  tuks.forEach(T=>{ T.o.position.set(T.x0,-3,T.z); T.o.rotation.y = T.sp > 0 ? 0 : Math.PI; g.add(T.o); });
  const t0 = performance.now();
  const driver = tuks[0].o.children[0]; driver.frustumCulled = false;
  driver.onBeforeRender = ()=>{ const t = (performance.now() - t0)/1000;
    tuks.forEach(T=>{ let px = T.x0 + T.sp*t; px = ((px + 90) % 180 + 180) % 180 - 90; T.o.position.x = px; T.o.position.y = -3 + Math.abs(Math.sin(t*12 + T.z))*.08; }); };
  // a cow resting on the street
  const cow = new THREE.Group(); cow.position.set(17,-3,-11); cow.rotation.y = 0.5; g.add(cow);
  const cowM = L({color:0xf0ece2}), hornM = L({color:0xd8c8a0});
  cow.add(at(rbox(3.4,1.5,1.5,.5,cowM),0,1.9,0));
  cow.add(at(rbox(0.9,0.7,1.0,.6,cowM),0.6,2.9,0));
  const ch = new THREE.Group(); ch.position.set(2.1,2.3,0); cow.add(ch);
  ch.add(rbox(0.9,0.85,0.8,.5,cowM)); ch.add(at(rbox(0.45,0.4,0.6,.5,L({color:0xd8a8a0})),0.5,-0.2,0));
  [-1,1].forEach(sd=>{ const h = new THREE.Mesh(new THREE.ConeGeometry(0.1,0.6,4), hornM); h.position.set(-0.1,0.6,sd*0.3); h.rotation.x = sd*0.4; ch.add(h); ch.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.08),black),0.3,0.15,sd*0.3)); });
  [[1.2,0.5],[1.2,-0.5],[-1.2,0.5],[-1.2,-0.5]].forEach(([px,pz])=>cow.add(at(rbox(0.32,1.2,0.32,.4,cowM),px,0.6,pz)));
  for (let i=0;i<8;i++) cow.add(at(new THREE.Mesh(ballGeo, mariM[i%2]), 1.6, 2.0 + Math.sin(i/7*Math.PI)*-0.4 + 0.2, -0.7 + i*0.2));
  registerMap('india', { name:'印度街頭', group:g, W, plats, sky:indSkyTex, fog:0xe8c79a, fogNear:60, fogFar:210, hemi:[0xfff0d0,0x6a4a30], sun:0xffd08a, rim:0xff9a5a });
}
