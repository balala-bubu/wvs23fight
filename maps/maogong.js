/* map: maogong — 貓公部落（豐濱）白色波浪頂涼亭廣場＋彩虹. Loaded after js/core.js and the characters. */
'use strict';
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;

  /* ---------- textures ---------- */
  const skyT = tex(4,64,(c)=>{ const gr = c.createLinearGradient(0,0,0,64); gr.addColorStop(0,'#7f95ad'); gr.addColorStop(.55,'#b3bec6'); gr.addColorStop(1,'#d6dcdc'); c.fillStyle = gr; c.fillRect(0,0,4,64); });
  skyT.magFilter = THREE.LinearFilter;

  const cloudT = tex(64,32,(c,w,h)=>{
    c.clearRect(0,0,w,h);
    for(let i=0;i<26;i++){ const x = 8+rnd()*48, y = 10+rnd()*14, r = 4+rnd()*8; const gr = c.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(236,240,240,.8)'); gr.addColorStop(1,'rgba(236,240,240,0)'); c.fillStyle = gr; c.fillRect(x-r,y-r,r*2,r*2); }
  });
  cloudT.magFilter = THREE.LinearFilter;

  // 廣場地磚：灰粉磚、白色球場線
  const plazaT = tex(64,32,(c,w,h)=>{
    speckle(c,w,h,'#a79a92',['#b2a59c','#9c8f87','#a39088'],.5);
    c.strokeStyle = 'rgba(70,60,56,.35)'; for(let x=0;x<w;x+=8){ c.beginPath(); c.moveTo(x+.5,0); c.lineTo(x+.5,h); c.stroke(); }
    c.strokeStyle = '#e8e6e0'; c.lineWidth = 1; c.strokeRect(3.5,6.5,w-7,h-13); c.beginPath(); c.moveTo(w/2+.5,6); c.lineTo(w/2+.5,h-6); c.stroke();
  });
  plazaT.magFilter = THREE.LinearFilter;
  const pavT = tex(16,16,(c,w,h)=>speckle(c,w,h,'#9a8f88',['#a89c94','#8c817a'],.5),[80,10]);
  const grassT = tex(32,32,(c,w,h)=>speckle(c,w,h,'#6f9450',['#7a9f58','#628844'],.6),[70,20]);
  const cliffT = tex(64,64,(c,w,h)=>{
    speckle(c,w,h,'#9a9486',['#aaa496','#86806f','#b4ae9e'],.7);
    for(let i=0;i<7;i++){ c.fillStyle='rgba(60,70,40,.5)'; c.fillRect((rnd()*w)|0,0,1+((rnd()*3)|0),h); }
    for(let i=0;i<30;i++){ c.fillStyle = 'rgba(70,98,56,.7)'; c.fillRect((rnd()*w)|0,(rnd()*h)|0,3+((rnd()*5)|0),2); }
  });

  function ridgeTex(base, light, dark, amp, sd, mist){
    return tex(256,96,(c,w,h)=>{
      c.clearRect(0,0,w,h);
      const pts = []; let y = h*0.4;
      for(let x=0;x<=w;x+=4){ y += (Math.sin(x*.05+sd)*.9 + Math.sin(x*.14+sd*2)*.5 + (rnd()-.5)*1.4)*amp*.35; y = Math.max(h*.12, Math.min(h*.62,y)); pts.push([x,y]); }
      c.beginPath(); c.moveTo(0,h); pts.forEach(p=>c.lineTo(p[0],p[1])); c.lineTo(w,h); c.closePath(); c.clip();
      speckle(c,w,h,base,[light,dark,light],.7);
      for(let i=0;i<90;i++){ c.fillStyle = rnd()<.5?light:dark; c.fillRect(rnd()*w,rnd()*h,3+rnd()*4,2+rnd()*3); }
      const gr = c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(200,210,214,'+(mist*.6)+')'); gr.addColorStop(1,'rgba(200,210,214,'+mist+')');
      c.fillStyle = gr; c.fillRect(0,0,w,h);
    });
  }
  function ridge(t, w, h, x, y, z, tint){
    const m = L({map:t, color:tint}); m.transparent = true; m.alphaTest = .5;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w,h), m); p.position.set(x,y,z); g.add(p); return p;
  }

  /* ---------- 天空：雲＋彩虹 ---------- */
  [[-120,70,-230,260,70],[90,85,-230,240,60],[10,55,-240,300,50]].forEach(a=>{
    const m = new THREE.MeshBasicMaterial({map:cloudT, transparent:true, depthWrite:false, fog:false, opacity:.75});
    const p = new THREE.Mesh(new THREE.PlaneGeometry(a[3],a[4]), m); p.position.set(a[0],a[1],a[2]); g.add(p);
  });
  ['#d7584c','#e39a45','#e3d45a','#6aae62','#5b92c8','#8a6cb8'].forEach((col,i)=>{
    const m = new THREE.MeshBasicMaterial({color:new THREE.Color(col), transparent:true, opacity:.34, depthWrite:false, fog:false});
    const t = new THREE.Mesh(new THREE.TorusGeometry(150-i*2.6,1.35,4,80,Math.PI*.62), m);
    t.position.set(-10,-95,-215); t.rotation.z = Math.PI*.16; g.add(t);
  });

  /* ---------- 山與山壁 ---------- */
  ridge(ridgeTex('#4d6e50','#5d8060','#3d5d42',6,2.2,.5), 700,150, 0, 26, -170, 0x98a69e);
  ridge(ridgeTex('#44684a','#557c58','#375a3e',7,4.1,.3),  600,115, 30, 16, -112, 0x93a698);
  const cliff = new THREE.Mesh(new THREE.BoxGeometry(60,70,24), L({map:cliffT, color:0x8f8b80})); cliff.position.set(-92,22,-92); g.add(cliff);
  const cliffTop = new THREE.Mesh(new THREE.IcosahedronGeometry(34,0), L({color:0x466a44})); cliffTop.scale.set(1.2,.5,.6); cliffTop.position.set(-92,58,-92); g.add(cliffTop);
  ridge(ridgeTex('#3f6a46','#52805a','#33583b',5,6.3,.12), 520,70, 20, 2, -66, 0x90a490);

  /* ---------- 地面 ---------- */
  const far = new THREE.Mesh(new THREE.PlaneGeometry(700,500), L({color:0x607a4a})); far.rotation.x = -Math.PI/2; far.position.y = -26; g.add(far);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(700,100), L({map:grassT, color:0xa0ae8c})); lawn.rotation.x = -Math.PI/2; lawn.position.set(0,-8.05,-100); g.add(lawn);
  const pave = new THREE.Mesh(new THREE.PlaneGeometry(700,56), L({map:pavT, color:0xa8a09a})); pave.rotation.x = -Math.PI/2; pave.position.set(0,-3.05,-40); g.add(pave);

  /* ---------- 舞台（廣場地磚）＋平台 ---------- */
  const topM = L({map:plazaT, color:0xc2bab2}), sideM = L({color:0x6c625c}), lipM = L({color:0xe9dcb0});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(W*2+0.7,0.18,0.5), lipM),0,0.04,4.45));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), L({color:0x6c665c})); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-16,x2:-8,y:7.5}, {x1:8,x2:16,y:7.5}, {x1:-3.5,x2:3.5,y:13} ];
  const pTop = L({color:0xf0c27a}), pSide = L({color:0xa06c34}), pEdge = L({color:0xf4e2b4});
  plats.forEach(p=>{
    addPlatform(g,p,pTop,pSide,L({color:0x7a6a56}));
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(p.x2-p.x1+.1,.12,.35),pEdge),(p.x1+p.x2)/2,p.y+0.02,1.95));
  });

  /* ---------- 白色波浪頂涼亭 ---------- */
  const whiteM = L({color:0xb6b6b0}), underM = L({color:0x7e7c76}), steelM = L({color:0xaeaeaa});
  function canopy(cx,cz,R,H,waves,amp,ncol,yBase){
    const grp = new THREE.Group(); grp.position.set(cx,yBase,cz); g.add(grp);
    const geo = new THREE.CylinderGeometry(R*.18,R,H,48,3,true);
    const pos = geo.attributes.position;
    for(let i=0;i<pos.count;i++){
      const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i);
      const ang = Math.atan2(z,x), k = (H/2 - y)/H;           // 0 頂 … 1 邊
      pos.setY(i, y - Math.sin(ang*waves)*amp*k*k);
    }
    geo.computeVertexNormals();
    const roof = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xb8b8b2, side:THREE.DoubleSide})); roof.position.y = H/2; grp.add(roof);
    const cap = at(cyl(R*.2,R*.24,1.6,whiteM,16),0,H+.6,0); grp.add(cap);
    grp.add(at(cyl(R*.1,R*.2,1.2,whiteM,16),0,H+1.8,0));
    return grp;
  }
  // 中央大涼亭（柱子從地面 -8 立到屋簷）
  {
    const R = 36, H = 9, cz = -48, yB = 9;
    const grp = canopy(0,cz,R,H,6,2.2,8,yB);
    for(let i=0;i<8;i++){ const a = i/8*Math.PI*2, r = R*.86; g.add(at(cyl(.7,.7,19,steelM,10),Math.cos(a)*r,1.5,cz+Math.sin(a)*r)); }
    // 簡單骨架環
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R*.86,.35,6,48), steelM); ring.rotation.x = Math.PI/2; ring.position.set(0,yB+2,cz); g.add(ring);
    // 中央大柱
    g.add(at(cyl(2,2,18,L({color:0x8a6a4c}),8),0,0,cz));
  }
  // 右側連續波浪頂（長條）
  {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(110,.8,12,48,1,1), new THREE.MeshLambertMaterial({color:0xb4b4ae}));
    const pos = roof.geometry.attributes.position;
    for(let i=0;i<pos.count;i++) pos.setY(i, pos.getY(i)+Math.sin(pos.getX(i)*.22)*1.4);
    roof.geometry.computeVertexNormals(); roof.position.set(75,5,-36); g.add(roof);
    for(let i=0;i<9;i++) g.add(at(cyl(.45,.45,13,steelM,8),30+i*11.5,-1.5,-31));
  }

  /* ---------- 紅白攤位帳篷（涼亭前） ---------- */
  function tent(x,z,col,s){
    const t = new THREE.Group(); t.position.set(x,-3,z); g.add(t);
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(a=>t.add(at(cyl(.12*s,.12*s,3*s,steelM,5),a[0]*2.2*s,1.5*s,a[1]*2.2*s)));
    const roof = at(new THREE.Mesh(new THREE.ConeGeometry(3.6*s,2*s,4),L({color:col})),0,3.8*s,0); roof.rotation.y = Math.PI/4; t.add(roof);
    t.add(at(new THREE.Mesh(new THREE.BoxGeometry(4*s,.9*s,2*s),L({color:0xb8aa94})),0,.5*s,0));       // 桌
  }
  const reds = [0xa84438,0xb4b0a8];
  for(let i=0;i<9;i++) tent(-34+i*8.6+((i*7)%3), -19-(i%2)*2.2, reds[i%2], 1.2);
  // 左側白帳篷
  [-52,-60,-68].forEach((x,i)=>tent(x,-24-i*2,0xb4b0a8,1.3));

  /* ---------- 小樹與路燈 ---------- */
  function palm(x,z,s){
    const t = new THREE.Group(); t.position.set(x,-3,z); g.add(t);
    t.add(at(cyl(.45*s,.6*s,10*s,L({color:0x6a5238}),6),0,5*s,0));
    for(let i=0;i<7;i++){ const l = new THREE.Mesh(new THREE.BoxGeometry(.25*s,.1*s,6*s), L({color:0x4f8a3e})); l.position.set(0,10*s,0); l.rotation.set(.45,i*Math.PI*2/7,0,'YXZ'); l.translateZ(2.6*s); t.add(l); }
  }
  [-82,-72,60,95,-24,28].forEach((x,i)=>palm(x,-60-(i%3)*8,1.4+(i%2)*.4));
  for(let i=0;i<20;i++){ const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2+rnd()*1.4,0), L({color:0x446a3c})); m.position.set(-110+i*11+rnd()*4,-6.5,-30-rnd()*10); m.scale.y = .8; g.add(m); }

  registerMap('maogong', { name:'貓公部落', group:g, W, plats, sky:skyT, fog:0xb8c2c6, fogNear:75, fogFar:280,
    hemi:[0xe0e6ea,0x6c6a5c], sun:0xf6f0e2, rim:0xb8cce0 });
}
