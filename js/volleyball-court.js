/* Original, lightweight sports-campus arena. Uses existing character materials. */
'use strict';
function createVolleyArena(scene,renderer){
  const root=new THREE.Group();scene.add(root);
  const materialCache=new Map();
  const material=(color,extra={})=>{const key=color+JSON.stringify(extra);if(!materialCache.has(key))materialCache.set(key,new THREE.MeshStandardMaterial({color:new THREE.Color(color).convertSRGBToLinear(),roughness:.78,...extra}));return materialCache.get(key);};
  const mats={cream:material('#f2efdb'),dark:material('#173f48'),metal:material('#46727a'),wood:material('#b98b62'),blue:material('#168f99'),coral:material('#e86f80'),green:material('#69a780'),glass:material('#a5dce3',{transparent:true,opacity:.16,depthWrite:false})};
  function mesh(geo,mat,x,y,z,shadow=false){const o=new THREE.Mesh(geo,typeof mat==='string'?material(mat):mat);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=shadow;root.add(o);return o;}
  function box(w,h,d,m,x,y,z,shadow=false){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,shadow);}
  scene.background=new THREE.Color('#9dd6ed');scene.fog=new THREE.Fog('#b6dde5',66,125);
  scene.add(new THREE.HemisphereLight(0xe7f5ff,0x91a3a0,.8));const sun=new THREE.DirectionalLight(0xfff4dc,1.0);sun.position.set(-16,28,15);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:28,bottom:-28,near:1,far:80});sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xc6e6ff,.3);fill.position.set(15,10,-15);scene.add(fill);
  // Warm wooden concourse, colored competition surface and clean markings.
  box(64,.35,78,mats.wood,0,-.22,0);
  for(let i=-15;i<=15;i++){box(.035,.012,65,'#a77b54',i*2,.002,0);for(let z=-28;z<=28;z+=8)box(1.98,.01,.025,'#9e7958',i*2+1,.007,z+(i%2)*3);}
  box(21,.05,35,mats.cream,0,.02,0);box(19,.05,33,'#8ac9bd',0,.055,0);
  const courtWidth=VOLLEY_COURT.halfWidth*2,halfLength=VOLLEY_COURT.halfLength,netHalf=VOLLEY_COURT.halfWidth+1;
  box(courtWidth,.035,halfLength,mats.blue,0,.095,halfLength/2);box(courtWidth,.035,halfLength,mats.coral,0,.095,-halfLength/2);
  box(courtWidth,.02,3,'#1d7f8c',0,.12,1.5);box(courtWidth,.02,3,'#d55e74',0,.12,-1.5);
  [-VOLLEY_COURT.halfWidth,VOLLEY_COURT.halfWidth].forEach(x=>box(.1,.025,halfLength*2,mats.cream,x,.135,0));[-halfLength,halfLength,-3,3].forEach(z=>box(courtWidth,.025,.1,mats.cream,0,.14,z));
  box(courtWidth,.03,.12,mats.cream,0,.15,0);
  // Surface, lines and net follow the same court dimensions as scoring.
  [-(netHalf+.1),netHalf+.1].forEach((x,i)=>{mesh(new THREE.CylinderGeometry(.10,.10,5.25,8),mats.metal,x,2.6,0,true);box(.48,2.45,.5,i?mats.coral:mats.blue,x,1.28,0,true);});
  const points=[];for(let x=-netHalf;x<=netHalf;x+=.48)points.push(new THREE.Vector3(x,2.3,0),new THREE.Vector3(x,4.55,0));for(let y=2.3;y<=4.55;y+=.32)points.push(new THREE.Vector3(-netHalf,y,0),new THREE.Vector3(netHalf,y,0));
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x244a52,transparent:true,opacity:.62})));
  box((netHalf+.1)*2,.14,.09,mats.cream,0,4.63,0);box((netHalf+.1)*2,.06,.06,mats.cream,0,2.28,0);
  // Skylit sports hall. Wide portals, exposed beams and a distant city.
  for(const z of [-36,36]){
    box(58,1.35,.65,mats.cream,0,.65,z);box(58,.45,.65,mats.cream,0,13.2,z);
    for(let x=-28;x<=28;x+=7){box(.45,14,.5,mats.cream,x,7,z,true);box(6.55,9,.08,mats.glass,x+3.5,7,z);}
    box(58,.14,.18,mats.metal,0,3.8,z);box(58,.14,.18,mats.metal,0,9.8,z);
    for(let i=0;i<12;i++){const x=-38+i*7,h=8+(i*7%13);box(4,h,5,i%2?'#81adb7':'#b1cbd0',x,h/2-1,z+Math.sign(z)*16);for(let y=3;y<h;y+=3)box(3,.45,.03,'#c2dfe2',x,y,z+Math.sign(z)*13.45);}
  }
  for(let x=-27;x<=27;x+=9){box(.65,.6,74,mats.cream,x,14,0);box(.18,.18,73,mats.metal,x+.5,12.9,0);}
  for(const x of [-28,28]){box(.65,1.5,74,mats.cream,x,.75,0);for(let z=-32;z<=32;z+=8){box(.55,14,.55,mats.cream,x,7,z,true);box(.12,9,7.5,mats.glass,x,7,z+4);}}
  // Center-court signage is procedural, keeping downloads small.
  const signTex=tex(512,128,g=>{g.fillStyle='#173f48';g.fillRect(0,0,512,128);g.fillStyle='#fff7d9';g.font='900 46px sans-serif';g.textAlign='center';g.fillText('WVS SPORTS CLUB',256,60);g.font='18px sans-serif';g.fillStyle='#7ed8cc';g.fillText('VOLLEYBALL   /   PLAY TOGETHER',256,100);});
  for(const z of [-35.5,35.5]){const sign=mesh(new THREE.PlaneGeometry(13,3.25),new THREE.MeshBasicMaterial({map:signTex}),0,10,z);if(z>0)sign.rotation.y=Math.PI;}
  // Terraced spectator stands, plants and colorful equipment.
  for(const x of [-18,18]){
    for(let row=0;row<3;row++)box(2,.5,24,row%2?mats.green:mats.cream,x+Math.sign(x)*row*2,.3+row*.55,0);
    for(let row=0;row<3;row++)for(let j=0;j<9;j++){
      const px=x+Math.sign(x)*row*2,pz=-10+j*2.5,py=.6+row*.55,shirt=[mats.blue,mats.coral,mats.green,mats.dark,mats.cream][(row+j)%5];
      mesh(new THREE.CylinderGeometry(.30,.39,.85,6),shirt,px,py+.75,pz);mesh(new THREE.SphereGeometry(.27,8,6),material(['#dfad87','#bb866b','#e6c6a1'][j%3]),px,py+1.38,pz);box(.65,.32,.65,mats.dark,px,py+.25,pz);
    }
    for(const z of [-18,18]){
      mesh(new THREE.CylinderGeometry(.7,.48,1.1,8),mats.cream,x,.55,z,true);
      for(let k=0;k<5;k++){const a=k*1.256;const leaf=mesh(new THREE.SphereGeometry(.68,7,5),mats.green,x+Math.sin(a)*.4,1.9+(k%2)*.4,z+Math.cos(a)*.4);leaf.scale.set(.6,1.4,.5);}
    }
  }
  box(3,1.5,1.5,mats.dark,-12,.8,-15);box(3,.2,1.5,mats.cream,-12,1.6,-15);
  for(const x of [-13,13])for(let j=0;j<7;j++){
    const flag=mesh(new THREE.ConeGeometry(.48,.9,3),j%2?mats.blue:mats.coral,x,10.5,-13+j*4.3);flag.rotation.z=Math.PI;
  }
  // Batch static geometry by material: one hall does not mean hundreds of draw calls.
  root.updateMatrixWorld(true);const batches=new Map();
  for(const o of [...root.children]){if(!o.isMesh||Array.isArray(o.material)||o.material.transparent)continue;
    const key=o.material.uuid+':'+o.castShadow;const list=batches.get(key)||[];list.push(o);batches.set(key,list);}
  for(const list of batches.values()){
    if(list.length<2)continue;const positions=[],normals=[],uvs=[],indices=[];let offset=0;
    for(const o of list){const g=o.geometry.clone().applyMatrix4(o.matrixWorld);positions.push(...g.attributes.position.array);normals.push(...g.attributes.normal.array);uvs.push(...g.attributes.uv.array);const ix=g.index?.array||Array.from({length:g.attributes.position.count},(_,i)=>i);for(const i of ix)indices.push(i+offset);offset+=g.attributes.position.count;root.remove(o);o.geometry.dispose();g.dispose();}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeBoundingSphere();const merged=new THREE.Mesh(geometry,list[0].material);merged.castShadow=list[0].castShadow;merged.receiveShadow=true;root.add(merged);
  }
  return {root,sun,materials:mats};
}
