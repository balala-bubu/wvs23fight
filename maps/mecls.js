/* map: mecls — 台大機械系承先教室. Loaded after js/core.js and the characters.
   Everything lives inside one block so no top-level names can clash with other files.
   Layout: the stage is the teacher's dais; the front wall of the classroom (wood panels, chalkboard,
   pull-down screen, door) is at z=-42; platforms are classroom desks. */
'use strict';
{
  const CJK = '"Noto Sans TC","Microsoft JhengHei","PingFang TC","Noto Sans CJK TC",sans-serif';

  /* ---------- textures ---------- */
  const skyT = tex(4,64,(g)=>{ const gr = g.createLinearGradient(0,0,0,64); gr.addColorStop(0,'#8a8780'); gr.addColorStop(1,'#6c6a64'); g.fillStyle = gr; g.fillRect(0,0,4,64); });
  skyT.magFilter = THREE.LinearFilter;

  // pale grey floor tile with joints (photo: grey-white tile floor)
  const floorT = (rep)=>tex(32,32,(g)=>{ speckle(g,32,32,'#d9d9d3',['#cfcfc9','#e3e3dd','#d3d4cd'],.35); g.fillStyle='#b6b7b0'; g.fillRect(0,0,32,1); g.fillRect(0,0,1,32); },rep);
  const stageTopT = floorT([16,4]), roomFloorT = floorT([16,15]), pitFloorT = floorT([60,60]);

  // light-oak wall panels with a seam on the left edge of every tile
  const panelT = tex(32,64,(g)=>{
    speckle(g,32,64,'#dcc29a',['#d3b68b','#e4cba4','#cfb184'],.3);
    g.fillStyle='rgba(150,110,60,.22)'; for(let x=3;x<30;x+=5+((rnd()*3)|0)) g.fillRect(x,0,1,64);
    g.fillStyle='#a98b5f'; g.fillRect(0,0,1,64); g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(1,0,1,64);
    g.fillStyle='rgba(120,90,50,.35)'; g.fillRect(0,40,32,1);                        // cabinet door line
  },[50,1]);
  const skirtT = tex(32,32,(g)=>{ speckle(g,32,32,'#cdb088',['#c2a47a','#d6ba92'],.3); g.fillStyle='#9c7e52'; g.fillRect(0,0,1,32); },[12,1]);
  const wallT = tex(16,16,(g)=>speckle(g,16,16,'#eeede8',['#e6e5df','#f4f3ee'],.4),[60,6]);
  const deskTopT = tex(32,32,(g)=>{ speckle(g,32,32,'#e0c398',['#d8b98c','#e8cfa6'],.25); g.fillStyle='rgba(150,110,60,.18)'; for(let y=3;y<32;y+=5) g.fillRect(0,y,32,1); });
  const deskFrontT = tex(32,16,(g)=>{ speckle(g,32,16,'#caa974',['#c19f6a','#d3b480'],.3); g.fillStyle='rgba(120,85,45,.3)'; for(let x=4;x<32;x+=7) g.fillRect(x,0,1,16); });

  const ceilT = tex(32,32,(g)=>{ speckle(g,32,32,'#efeee9',['#e8e7e2','#f5f4ef'],.5); g.fillStyle='#c9c8c2'; g.fillRect(0,0,32,1); g.fillRect(0,0,1,32); for(let i=0;i<10;i++){ g.fillStyle='#d6d5cf'; g.fillRect((rnd()*30)|0,(rnd()*30)|0,2,1); } },[110,16]);
  const ventT = tex(32,32,(g)=>{ g.fillStyle='#f2f1ec'; g.fillRect(0,0,32,32); g.fillStyle='#9a9b98'; g.fillRect(3,3,26,26); g.fillStyle='#e9e8e3'; for(let y=6;y<28;y+=4){ g.fillRect(4,y,24,2); } g.fillStyle='#6d6e6c'; g.fillRect(14,14,4,4); });

  const boardT = tex(256,112,(g)=>{                                                  // chalkboard in a wooden frame
    g.fillStyle='#c9a773'; g.fillRect(0,0,256,112); g.fillStyle='#a8895a'; g.fillRect(0,0,256,3); g.fillRect(0,0,3,112); g.fillRect(253,0,3,112);
    g.fillStyle='#2b4a3d'; g.fillRect(6,6,244,88);
    for(let i=0;i<260;i++){ g.fillStyle='rgba(235,240,235,'+(.03+rnd()*.06)+')'; g.fillRect(8+((rnd()*236)|0), 8+((rnd()*84)|0), 10+((rnd()*30)|0), 2); }
    g.fillStyle='rgba(238,242,236,.9)'; g.font='bold 13px '+CJK; g.textBaseline='top';
    g.fillText('F = m a', 14, 12); g.fillText('σ = E ε', 14, 34); g.fillText('PV = nRT', 14, 56); g.fillText('Q = m c ΔT', 100, 12);
    g.font='bold 12px '+CJK; g.fillText('機械設計', 150, 70);
    g.strokeStyle='rgba(238,242,236,.85)'; g.lineWidth=1.5;                          // a chalk gear
    g.beginPath(); g.arc(196,44,13,0,7); g.stroke(); g.beginPath(); g.arc(196,44,5,0,7); g.stroke();
    for(let k=0;k<10;k++){ const a=k*Math.PI/5; g.beginPath(); g.moveTo(196+Math.cos(a)*13,44+Math.sin(a)*13); g.lineTo(196+Math.cos(a)*18,44+Math.sin(a)*18); g.stroke(); }
    g.beginPath(); g.moveTo(104,44); g.lineTo(140,44); g.lineTo(140,80); g.lineTo(104,80); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(104,80); g.lineTo(140,44); g.stroke();
    g.fillStyle='#b99a69'; g.fillRect(4,94,248,10);                                  // chalk tray
    g.fillStyle='#f4f4f0'; g.fillRect(30,96,10,4); g.fillStyle='#f0d8a0'; g.fillRect(48,96,9,4); g.fillStyle='#f4f4f0'; g.fillRect(150,96,11,4);
  });
  boardT.magFilter = THREE.LinearFilter;

  const slideT = tex(320,180,(g)=>{                                                  // what the projector is showing
    g.fillStyle='#fbfaf5'; g.fillRect(0,0,320,180); g.fillStyle='#e2e8c8'; g.fillRect(0,0,320,10); g.fillRect(0,170,320,10);
    g.fillStyle='#8a9a4a'; g.fillRect(24,28,5,56);
    g.fillStyle='#4a4f3a'; g.textBaseline='top'; g.font='bold 24px '+CJK; g.fillText('機械工程學系', 40, 28); g.font='bold 15px '+CJK; g.fillStyle='#7c8060'; g.fillText('承先教室', 40, 62);
    g.font='bold 15px '+CJK; g.fillStyle='#6b6f55'; g.fillText('今天的課：齒輪與傳動', 24, 112); g.fillText('帶筆、帶水、帶好心情', 24, 136);
    g.strokeStyle='#b9c28a'; g.lineWidth=4; g.beginPath(); g.arc(256,70,34,0,7); g.stroke(); g.beginPath(); g.arc(256,70,13,0,7); g.stroke();
    for(let k=0;k<12;k++){ const a=k*Math.PI/6; g.beginPath(); g.moveTo(256+Math.cos(a)*34,70+Math.sin(a)*34); g.lineTo(256+Math.cos(a)*46,70+Math.sin(a)*46); g.stroke(); }
    g.strokeStyle='#d4d9b0'; g.beginPath(); g.arc(296,128,18,0,7); g.stroke();
  });
  slideT.magFilter = THREE.LinearFilter;

  const clockT = tex(64,64,(g)=>{
    g.fillStyle='#e6e4dc'; g.beginPath(); g.arc(32,32,31,0,7); g.fill(); g.fillStyle='#fbfaf6'; g.beginPath(); g.arc(32,32,27,0,7); g.fill();
    g.fillStyle='#333'; for(let k=0;k<12;k++){ const a=k*Math.PI/6; g.fillRect(32+Math.cos(a)*23-1,32+Math.sin(a)*23-1,2,2); }
    g.strokeStyle='#222'; g.lineWidth=3; g.beginPath(); g.moveTo(32,32); g.lineTo(32+Math.cos(-1.05)*14,32+Math.sin(-1.05)*14); g.stroke();
    g.lineWidth=2; g.beginPath(); g.moveTo(32,32); g.lineTo(32+Math.cos(.5)*21,32+Math.sin(.5)*21); g.stroke();
    g.fillStyle='#c33'; g.beginPath(); g.arc(32,32,2,0,7); g.fill();
  });
  clockT.magFilter = THREE.LinearFilter;

  const paperT = tex(16,24,(g)=>{ g.fillStyle='#fbfbf8'; g.fillRect(0,0,16,24); g.fillStyle='#8a8f98'; for(let y=3;y<22;y+=3) g.fillRect(2,y,12-((rnd()*5)|0),1); g.fillStyle='#d44'; g.fillRect(2,1,5,1); });

  /* ---------- materials ---------- */
  const oak = L({map:panelT, color:0x8a7456}), oakSkirt = L({map:skirtT, color:0xc8b58f}), wallM = L({map:wallT, color:0xa4a39e});
  const deskTop = L({map:deskTopT}), deskEdge = L({color:0xf4e2b4}), deskFront = L({map:deskFrontT, color:0x9a7a4c});
  const metal = L({color:0x8d9094}), metalDark = L({color:0x5e6064});
  const white = L({color:0xf3f2ee}), woodDark = L({color:0xb08e5c});
  const glow = new THREE.MeshBasicMaterial({color:0xe0e0d8, side:THREE.FrontSide});

  const g = new THREE.Group(); scene.add(g);
  const W = 20, WALL_Z = -42, CEIL = 21;

  /* ---------- room shell ---------- */
  const pit = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:pitFloorT, color:0x77756f})); pit.rotation.x = -Math.PI/2; pit.position.y = -26; g.add(pit);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(420,60), wallM); wall.position.set(0,-9,WALL_Z-0.8); g.add(wall);          // y -39 .. 21
  const dado = new THREE.Mesh(new THREE.PlaneGeometry(420,40.5), oak); dado.position.set(0,-5.75,WALL_Z); g.add(dado);   // wood panels, y -26 .. 14.5
  g.add(at(rbox(420,0.7,0.5,.05,woodDark),0,14.6,WALL_Z+0.25));                                                              // top rail of the panels
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(420,60), new THREE.MeshBasicMaterial({map:ceilT, color:0x9a9993}));
  ceil.rotation.x = Math.PI/2; ceil.position.set(0,CEIL,WALL_Z+30); g.add(ceil);                                              // faces down, invisible from above

  /* ---------- dais (the stage) ---------- */
  const topM = L({map:stageTopT, color:0xdcdcd4});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[oakSkirt,oakSkirt,topM,oakSkirt,oakSkirt,oakSkirt]),0,-0.7,0));
  g.add(at(rbox(W*2+0.6,0.22,0.5,.08,L({color:0xf4e2b4})),0,-0.04,4.3));                                                   // bright front lip
  g.add(at(rbox(W*2+0.6,0.06,0.5,.02,L({color:0x5e5a52})),0,0.02,-4.6));                                                   // groove: back floor starts here
  const daisBack = new THREE.Mesh(new THREE.PlaneGeometry(W*2+0.6, -4.5-WALL_Z), L({map:roomFloorT, color:0xa3a39c})); daisBack.rotation.x = -Math.PI/2; daisBack.position.set(0,-0.01,(-4.5+WALL_Z)/2); g.add(daisBack);
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), L({color:0xa08e6e, emissive:0x2a2418})); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);

  /* ---------- platforms = classroom desks ---------- */
  const plats = [ {x1:-16,x2:-8,y:7.5}, {x1:8,x2:16,y:7.5}, {x1:-3.5,x2:3.5,y:13} ];
  const addDesk = (p)=>{
    const w = p.x2-p.x1, cx = (p.x1+p.x2)/2;
    g.add(at(rbox(w,0.6,4,.12,[deskEdge,deskEdge,deskTop,deskEdge,deskEdge,deskEdge]),cx,p.y-0.33,0));
    g.add(at(rbox(w-1.4,1.7,0.22,.1,deskFront),cx,p.y-1.45,1.7));                                                           // modesty panel
    for (const sx of [-1,1]) for (const z of [-1.5,1.5]) g.add(at(cyl(.17,.17,3.5,metal,6),cx+sx*(w/2-.9),p.y-2.3,z));
    for (const sx of [-1,1]) g.add(at(rbox(.35,.22,3.6,.1,metalDark),cx+sx*(w/2-.9),p.y-4.1,0));                           // floor runners
    for (const sx of [-1,1]) g.add(at(rbox(.22,.22,3.2,.1,metal),cx+sx*(w/2-.9),p.y-1.0,0));                              // frame rail
  };
  plats.forEach(addDesk);
  // things on the desks (visual only)
  const bottle = (x,y,z)=>{ const b = new THREE.Group(); b.position.set(x,y,z); g.add(b);
    b.add(at(cyl(.38,.38,1.5,L({color:0xa6d4ee, transparent:true, opacity:.8}),10),0,.75,0)); b.add(at(cyl(.2,.2,.22,L({color:0x2f5fb0}),8),0,1.6,0)); };
  bottle(-14.6,7.5,-0.5); bottle(14.3,7.5,0.3);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(2.2,3.2), L({map:paperT, side:THREE.DoubleSide})); paper.rotation.x = -Math.PI/2; paper.rotation.z = .25; paper.position.set(-11.2,7.53,.2); g.add(paper);
  const paper2 = paper.clone(); paper2.position.set(11.6,7.53,-.1); paper2.rotation.z = -.2; g.add(paper2);
  g.add(at(rbox(1.6,.12,2.4,.04,white),0.8,13.06,0.2)); g.add(at(rbox(.14,.9,.14,.04,L({color:0x2f5fb0})),-1.2,13.5,0));  // a notebook and a pen

  /* ---------- front wall: chalkboard, screen, door, clock ---------- */
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(14,6.125), L({map:boardT})),-21,8.4,WALL_Z+0.5));                          // chalkboard
  g.add(at(rbox(14.6,0.5,0.4,.1,oak),-21,2.6,WALL_Z+0.45));
  // pull-down projector screen: case on top, white sheet, black border
  g.add(at(rbox(23,.9,.9,.3,L({color:0xdedfdc})),6,17.0,WALL_Z+1.1));
  g.add(at(rbox(22.8,13,.5,.02,L({color:0x1c1c1c})),6,10.2,WALL_Z+0.75));
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(22,12.4), new THREE.MeshBasicMaterial({map:slideT, color:0xb4b4ae})),6,10.2,WALL_Z+1.2));
  g.add(at(rbox(23,.4,.3,.1,metalDark),6,3.5,WALL_Z+1.1));
  // door on the right with a little window and handle
  g.add(at(rbox(7.6,12.2,.4,.05,woodDark),22,6.1,WALL_Z+0.4));
  g.add(at(rbox(6.4,11.2,.2,.05,oak),22,6.1,WALL_Z+0.62));
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2.4,4.4), L({color:0x39434d})),22,8.6,WALL_Z+0.95));
  g.add(at(rbox(.35,1.5,.4,.12,metal),19.7,5.8,WALL_Z+1.0));
  const clock = new THREE.Mesh(new THREE.CircleGeometry(1.9,24), new THREE.MeshBasicMaterial({map:clockT})); clock.position.set(22,17,WALL_Z+0.5); g.add(clock);
  // notice paper + speakers + light switch
  g.add(at(new THREE.Mesh(new THREE.PlaneGeometry(2,2.7), L({map:paperT})),-12.6,7.2,WALL_Z+0.55));
  for (const x of [-27,31]) g.add(at(rbox(2.4,3.4,2,.2,L({color:0x1d1d1f})),x,17.8,WALL_Z+1.2));
  g.add(at(rbox(.9,1.3,.2,.06,white),15.8,7.2,WALL_Z+0.5));

  /* ---------- teacher's podium, stool, laptop ---------- */
  g.add(at(rbox(4.6,5.8,3,.06,L({color:0xa98b5c})),-2.5,2.9,-14));
  g.add(at(rbox(4.9,.35,3.3,.06,L({color:0x8f7345})),-2.5,5.9,-14));
  g.add(at(rbox(3.4,.18,2.2,.05,L({color:0x7c7f86})),-2.5,6.15,-14.1));                                                    // laptop base
  const lid = at(rbox(3.4,2.1,.14,.04,L({color:0x8b8e95})),-2.5,7.2,-15.1); lid.rotation.x = -.18; g.add(lid);
  g.add(at(cyl(.06,.06,2.6,black,6),-1.2,7.6,-14.1)); g.add(at(cyl(.2,.2,.5,black,8),-1.2,8.9,-14.1));                      // microphone stand
  const stool = (x,z)=>{ g.add(at(cyl(1.5,1.5,.45,L({color:0xe6b94c}),12),x,3.4,z)); g.add(at(cyl(.22,.22,3.2,black,6),x,1.6,z));
    g.add(at(cyl(1.4,1.4,.18,black,10),x,.15,z)); g.add(at(cyl(1.15,1.15,.12,metal,10),x,2.0,z)); };
  stool(3.2,-12);

  /* ---------- ceiling: light panels, vents, ceiling fans, projector ---------- */
  const lightP = (x,z,w,d)=>{ const m = new THREE.Mesh(new THREE.PlaneGeometry(w,d), glow); m.rotation.x = Math.PI/2; m.position.set(x,CEIL-0.3,z); g.add(m);
    const fr = new THREE.Mesh(new THREE.PlaneGeometry(w+.5,d+.5), L({color:0xcfcfca})); fr.rotation.x = Math.PI/2; fr.position.set(x,CEIL-0.15,z); g.add(fr); };
  for (const z of [-34,-22,-10]) for (const x of [-30,-10,10,30]) lightP(x,z,12,1.4);
  for (const [x,z] of [[-20,-28],[22,-16]]){ const v = new THREE.Mesh(new THREE.PlaneGeometry(5,5), new THREE.MeshBasicMaterial({map:ventT})); v.rotation.x = Math.PI/2; v.position.set(x,CEIL-0.2,z); g.add(v); }
  const fan = (x,z)=>{                                                                                                       // round ceiling circulator with spinning blades
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.3,.5,16), L({color:0xe9e8e3})); hub.position.set(x,CEIL-.5,z); g.add(hub);
    g.add(at(cyl(2.6,2.6,.2,L({color:0xcfcfca}),16),x,CEIL-.2,z));
    const blades = new THREE.Group(); blades.position.set(x,CEIL-.95,z); g.add(blades);
    for (let k=0;k<6;k++){ const b = rbox(2.4,.1,.7,.2,L({color:0xf2f1ec})); b.position.set(Math.cos(k*Math.PI/3)*1.3,0,Math.sin(k*Math.PI/3)*1.3); b.rotation.y = -k*Math.PI/3; blades.add(b); }
    blades.add(at(cyl(.5,.5,.2,L({color:0xbdbcb6}),10),0,0,0));
    hub.onBeforeRender = ()=>{ if (!reduce) blades.rotation.y = performance.now()*0.0035; };
  };
  fan(-5,-24); fan(26,-26);
  const projector = new THREE.Group(); projector.position.set(6,CEIL-1.6,-9); g.add(projector);                              // ceiling projector pointing at the screen
  projector.add(at(rbox(3.2,1.1,2.8,.15,L({color:0xf1f0ec})),0,0,0)); projector.add(at(cyl(.45,.45,.5,black,10),0,-.1,-1.5));
  projector.rotation.x = -.04; projector.add(at(cyl(.08,.08,.8,metal,6),0,.9,0));
  projector.children[1].rotation.x = Math.PI/2;

  /* ---------- 憶中老師 (advisor) standing beside the podium ---------- */
  {
    const skin = '#d6a47c', skinC = ['#cc9a72','#e0b08a'];
    const tSkinT = tex(16,16,(gg)=>speckle(gg,16,16,skin,skinC,.4));
    const tFace = (mode)=>tex(64,64,(gg)=>{
      speckle(gg,64,64,skin,skinC,.35); shadeFace(gg);
      for (let i=0;i<70;i++){ gg.fillStyle='rgba(40,30,28,.35)'; gg.fillRect(10+((rnd()*44)|0), 53+((rnd()*10)|0), 1, 1); }       // light stubble
      gg.fillStyle='rgba(225,110,100,.42)'; gg.beginPath(); gg.ellipse(10,48,6,4,0,0,7); gg.fill(); gg.beginPath(); gg.ellipse(54,48,6,4,0,0,7); gg.fill();   // rosy cheeks
      gg.strokeStyle='#2a1f1a'; gg.lineWidth=1.5; gg.beginPath(); gg.moveTo(11,27); gg.quadraticCurveTo(19,21,27,24); gg.stroke(); gg.beginPath(); gg.moveTo(37,24); gg.quadraticCurveTo(45,21,53,27); gg.stroke();   // raised, friendly brows
      gg.strokeStyle='#1d1310'; gg.lineWidth=2;
      gg.lineWidth=2.2; gg.beginPath(); gg.arc(19,40,5,Math.PI*1.12,Math.PI*1.88); gg.stroke(); gg.beginPath(); gg.arc(45,40,5,Math.PI*1.12,Math.PI*1.88); gg.stroke();   // ^ ^ happy eyes
      gg.fillStyle='rgba(225,238,245,.10)'; gg.fillRect(9,31,20,13); gg.fillRect(35,31,20,13);                                    // lenses
      gg.strokeStyle='#33333a'; gg.lineWidth=1.3; gg.strokeRect(9.5,31.5,19,12); gg.strokeRect(35.5,31.5,19,12);                              // rectangular frames
      gg.fillStyle='#202026'; gg.fillRect(29,34,6,2);
      if (mode==='laugh'){ gg.fillStyle='#5a1c18'; gg.beginPath(); gg.ellipse(32,52,11,8,0,0,7); gg.fill(); gg.fillStyle='#f6f2e8'; gg.fillRect(23,45,18,4); gg.fillStyle='#d9736a'; gg.fillRect(26,56,12,3); }
      else { gg.fillStyle='#5a1c18'; gg.beginPath(); gg.moveTo(18,46); gg.quadraticCurveTo(32,48,46,46); gg.quadraticCurveTo(44,58,32,58); gg.quadraticCurveTo(20,58,18,46); gg.closePath(); gg.fill();
        gg.fillStyle='#f6f2e8'; gg.beginPath(); gg.moveTo(20,47); gg.quadraticCurveTo(32,49,44,47); gg.lineTo(43,51); gg.quadraticCurveTo(32,53,21,51); gg.closePath(); gg.fill(); gg.fillStyle='#d9736a'; gg.fillRect(27,55,10,2); }   // big U-shaped smile with teeth
    });
    const faces = { normal:tFace('normal'), laugh:tFace('laugh') };
    const shirtT = tex(32,32,(gg)=>{ speckle(gg,32,32,'#86aee6',['#7aa4de','#94b9ee'],.35); gg.fillStyle='rgba(255,255,255,.1)'; for(let y=0;y<32;y+=3) gg.fillRect(0,y,32,1); });
    const shirtFrontT = tex(32,32,(gg)=>{
      speckle(gg,32,32,'#86aee6',['#7aa4de','#94b9ee'],.35); gg.fillStyle='rgba(255,255,255,.1)'; for(let y=0;y<32;y+=3) gg.fillRect(0,y,32,1);
      gg.fillStyle='#dfe9f6'; gg.beginPath(); gg.moveTo(4,0); gg.lineTo(16,9); gg.lineTo(28,0); gg.lineTo(24,0); gg.lineTo(16,5); gg.lineTo(8,0); gg.closePath(); gg.fill();       // collar V
      gg.fillStyle='#d3e0f2'; gg.fillRect(15,8,2,24);                                                                              // placket
      gg.fillStyle='#f4f8ff'; for (const y of [11,17,23,29]) gg.fillRect(15,y,2,2);                                                // buttons
      gg.strokeStyle='#5f86c4'; gg.lineWidth=1; gg.strokeRect(21.5,11.5,7,7); gg.fillStyle='rgba(120,150,200,.25)'; gg.fillRect(22,12,6,2);   // chest pocket
    });
    const tHair = L({map:blackHairTex}), tFaceM = L({map:faces.normal}), tShirt = L({map:shirtT}), tPants = L({map:tex(32,32,(gg)=>speckle(gg,32,32,'#2f3441',['#383e4c','#272b36'],.5))});
    const holder = new THREE.Group(); holder.position.set(-6.3,0,-12); holder.rotation.y = .3; holder.scale.setScalar(SC*1.2); g.add(holder);
    const c = buildChar({
      skinM:L({map:tSkinT}), faceM:tFaceM, headW:1.0, headH:1.15,
      torsoMat:[tShirt,tShirt,tShirt,tShirt,L({map:shirtFrontT}),tShirt], sleeveMat:()=>tShirt, sleeve:[0.62,0.8],
      pantsM:tPants, shoeM:L({color:0x25252b}), soleM:greySole,
      collar(chest){ const cm = L({color:0xdfe9f6}); for (const sx of [-1,1]){ const k = rbox(0.5,0.2,0.34,.3,cm); k.position.set(sx*0.3,2.2,0.38); k.rotation.z = -sx*0.5; chest.add(k); } },
      hair(head){                                                                                                                    // short black hair, receding at the front
        head.add(at(rbox(0.98,0.3,0.74,.5,tHair),0,0.56,-0.16));
        head.add(at(rbox(0.5,0.09,0.12,.4,tHair),0,0.55,0.4));
        head.add(at(rbox(1.08,0.95,0.5,.6,tHair),0,0.1,-0.32));
        [-1,1].forEach(sx=>head.add(at(rbox(0.1,0.42,0.46,.4,tHair),sx*0.5,0.24,-0.04)));
      },
      face(head){
        const fm = L({color:0x202026}), gl = new THREE.Group(); gl.position.set(0,0,0.56); head.add(gl);
        [-1,1].forEach(sx=>{ const arm = new THREE.Mesh(new THREE.BoxGeometry(0.025,0.025,0.62), fm); arm.position.set(sx*0.5,0.04,-0.3); gl.add(arm); });
      },
    }, holder);
    c.root.scale.set(1.06,1,1.1); c.head.scale.setScalar(1.2);                                                                    // slightly big head = friendlier
    c.props = {}; c.setOld = ()=>{}; c.setFace = ()=>{};
    // name tag
    const tag = tex(160,40,(gg)=>{ gg.fillStyle='rgba(120,60,50,.85)'; gg.fillRect(2,4,156,32); gg.strokeStyle='#ffd9a0'; gg.lineWidth=2; gg.strokeRect(2,4,156,32);
      gg.fillStyle='#fff1d0'; gg.font='bold 21px '+CJK; gg.textBaseline='middle'; gg.textAlign='center'; gg.fillText('憶中老師 ♥',80,21); });
    tag.magFilter = THREE.LinearFilter;
    const label = new THREE.Sprite(new THREE.SpriteMaterial({map:tag, transparent:true, fog:false})); label.scale.set(4.4,1.1,1); label.position.set(0,8.3,0); holder.add(label);
    // idle show: thumbs-up → big laugh → peace sign → stand, looping
    const driver = new THREE.Mesh(new THREE.PlaneGeometry(.01,.01), new THREE.MeshBasicMaterial({transparent:true, opacity:0, depthWrite:false}));
    driver.frustumCulled = false; holder.add(driver);
    let last = performance.now(), face = 'normal';
    driver.onBeforeRender = ()=>{
      const now = performance.now(), dt = Math.min(.1,(now-last)/1000); last = now;
      const t = (now/1000) % 7.5, k = 1-Math.exp(-dt*9);
      let pz = POSE.thumbs, f = 'normal';
      if (reduce){ pz = POSE.thumbs; }
      else if (t < 2.2) pz = POSE.thumbs;
      else if (t < 4.4){ pz = POSE.laugh; f = 'laugh'; }
      else if (t < 6) pz = POSE.peace;
      else { pz = POSE.cheer; f = 'laugh'; }
      applyPose(c, pz, k);
      if (!reduce) c.hips.position.y += (f==='laugh' ? Math.abs(Math.sin(now/1000*14))*0.16 : Math.sin(now/1000*3)*0.05);
      if (f !== face){ face = f; tFaceM.map = faces[f]; tFaceM.needsUpdate = true; }
    };
  }

  registerMap('mecls', { name:'機械系承先教室', group:g, W, plats, sky:skyT, fog:0x6f6c66, fogNear:120, fogFar:420,
    hemi:[0xe8e8e8,0x8a8174], sun:0xfff1da, rim:0xd8e6ff });
}
