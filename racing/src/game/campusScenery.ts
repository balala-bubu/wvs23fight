import * as T from 'three'
import type {Track} from './track'
import type {Scenery} from './scenery'
/** Original low-poly NTU-inspired landmarks; intentionally compressed for racing. */
export function buildCampusScenery(scene:T.Scene,track:Track,shadowSize:number):Scenery{
 scene.background=new T.Color('#bedfea');scene.fog=new T.Fog('#c7e0df',180,520)
 scene.add(new T.HemisphereLight('#edf9ff','#72865d',2.1))
 const sun=new T.DirectionalLight('#fff1ce',2.8);sun.position.set(-70,130,50);sun.castShadow=true
 sun.shadow.mapSize.set(shadowSize,shadowSize);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:330});sun.shadow.bias=-.0008;sun.shadow.normalBias=.08;scene.add(sun,sun.target)
 const mats=new Map<string,T.MeshStandardMaterial>()
 const mat=(c:string)=>{let m=mats.get(c);if(!m){m=new T.MeshStandardMaterial({color:c,roughness:.85,flatShading:true});mats.set(c,m)}return m}
 function box(x:number,y:number,z:number,w:number,h:number,d:number,c:string,parent:T.Object3D=scene){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const ground=box(-20,-.65,-65,1200,1,1200,'#83ac70');ground.castShadow=false
 function label(text:string,x:number,y:number,z:number,width:number,rot=0){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;const c=canvas.getContext('2d')!;c.fillStyle='#153c42';c.fillRect(0,0,1024,192);c.strokeStyle='#e8cd8b';c.lineWidth=12;c.strokeRect(8,8,1008,176);c.textAlign='center';c.textBaseline='middle';c.font='900 76px "WVS UI",sans-serif';c.fillStyle='#fff3ce';c.fillText(text,512,98,960);const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const p=new T.Mesh(new T.PlaneGeometry(width,width*192/1024),new T.MeshBasicMaterial({map:tex}));p.position.set(x,y,z);p.rotation.y=rot;const back=new T.Mesh(p.geometry,p.material);back.rotation.y=Math.PI;p.add(back);scene.add(p);return p}
 function building(x:number,z:number,w:number,d:number,h:number,title:string){box(x,h/2,z,w,h,d,'#a56b53');box(x,h+.5,z,w+1.5,1,d+1.5,'#596f64');box(x,1,z,w+1,2,d+1,'#c5b69b');for(let row=0;row<3;row++)for(let i=0;i<Math.floor(w/4);i++){box(x-w/2+2+i*4,3+row*3,z+d/2+.08,1.7,1.8,.12,'#a4c9cd');box(x-w/2+2+i*4,3+row*3,z-d/2-.08,1.7,1.8,.12,'#a4c9cd')}label(title,x,h+3,z+d/2+.2,Math.min(w,23))}
 // The west-east avenue ends at the main library; Male Eight is on the east leg.
 building(247,-25,36,30,15,'總圖書館');box(247,9,-9,13,13,1,'#d6bd91');for(const x of [238,247,256])box(x,4,-7.5,1.1,8,2,'#e9daba');box(247,.3,-3,30,.5,6,'#c8b89a')
 // Large arch windows, entrance and offset tower distinguish the library from a generic block.
 for(const x of [234,241,248,255,262]){const arch=new T.Mesh(new T.CircleGeometry(1.6,14,0,Math.PI),mat('#7babb5'));arch.position.set(x,10,-9.8);scene.add(arch);box(x,8,-9.7,3.2,4,.15,'#7babb5')}
 box(268,11,-25,7,22,9,'#a56b53');box(268,22.5,-25,8,1,10,'#596f64')
 building(90,-30,36,22,10,'文學院');building(158,-30,30,20,10,'行政大樓');building(477,95,42,19,13,'男八宿舍');building(473,133,32,16,12,'男六舍')
 for(let i=0;i<11;i++){box(458,1.2,79+i*3,.25,2,1.4,'#536d65');const wheel=new T.Mesh(new T.TorusGeometry(.7,.09,4,10),mat('#303b38'));wheel.rotation.y=Math.PI/2;wheel.position.set(456,1,78+i*3);scene.add(wheel)}
 label('長興街・男八舍',451,5,104,20,-Math.PI/2)
 // Fu Bell and small planted courts sit beside, rather than across, the racing line.
 box(112,.8,-24,12,1.6,10,'#c8b79b');for(const x of [108,116])for(const z of [-27,-21])box(x,4.8,z,1,8,1,'#985a47');box(112,9,-24,13,1.4,11,'#5b6357')
 const bell=new T.Mesh(new T.CylinderGeometry(1,1.5,2,12),mat('#c9a45a'));bell.position.set(112,6,-24);scene.add(bell);label('傅鐘',112,11,-18,10)
 // Street furniture gives the long return leg a recognisable scale.
 for(let x=70;x<400;x+=35){box(x,1,194,4,.25,1.2,'#8d6849');box(x,.5,194,.25,1,1.2,'#53605c');box(x+1.8,2.8,196,.2,5.5,.2,'#53605c');box(x+1.8,5.5,196,1.6,.25,1,'#ead9aa')}
 label('總圖 → 男八',290,4,68,18);label('回大門・舟山路方向',200,4,187,28)
 // Instanced palms frame Coconut Palm Boulevard, with shared geometries/materials.
 const positions:T.Vector3[]=[];for(let x=20;x<=215;x+=14)for(const z of [-13,13])positions.push(new T.Vector3(x,0,z))
 const trunk=new T.InstancedMesh(new T.CylinderGeometry(.4,.65,10,6),mat('#8f7656'),positions.length),leaves=new T.InstancedMesh(new T.ConeGeometry(3.2,1.3,5),mat('#3f8260'),positions.length*5);const dummy=new T.Object3D()
 positions.forEach((p,i)=>{dummy.position.copy(p).add(new T.Vector3(0,5,0));dummy.rotation.set(0,0,.035*Math.sin(i));dummy.scale.set(1,1,1);dummy.updateMatrix();trunk.setMatrixAt(i,dummy.matrix);for(let k=0;k<5;k++){const a=k*Math.PI*2/5;dummy.position.copy(p).add(new T.Vector3(Math.cos(a)*1.8,10+Math.sin(k)*.25,Math.sin(a)*1.8));dummy.rotation.set(.7*Math.sin(a),a,.7*Math.cos(a));dummy.scale.set(1,.6,1.6);dummy.updateMatrix();leaves.setMatrixAt(i*5+k,dummy.matrix)}});trunk.castShadow=true;leaves.castShadow=true;scene.add(trunk,leaves)
 // Peripheral trees avoid the road and shortcut; no frame-by-frame foliage animation.
 const treeGeo=new T.IcosahedronGeometry(3.2,1),treeMat=mat('#50885b'),spots:T.Vector3[]=[]
 for(let i=0;i<160;i++){const x=-60+(i*73%620),z=-120+(i*47%390),p=new T.Vector3(x,0,z);if(track.main.closest(p).distance<17||track.short.closest(p).distance<11||positions.some(q=>q.distanceTo(p)<6))continue;if((z<10&&z>-60)||(x>440&&z>55&&z<160))continue;spots.push(p)}
 const trees=new T.InstancedMesh(treeGeo,treeMat,spots.length);spots.forEach((p,i)=>{dummy.position.copy(p).setY(4);dummy.rotation.set(0,i,0);dummy.scale.setScalar(.8+(i%4)*.12);dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix)});trees.castShadow=true;scene.add(trees)
 // Start gantry at the western entrance; roadway stays clear underneath.
 const start=track.main.at(0),gate=new T.Group();gate.position.copy(start.pos);gate.rotation.y=Math.atan2(start.tan.x,start.tan.z);scene.add(gate)
 box(-10,1.5,0,4,3,3,'#8a6551',gate);box(10,1.5,0,4,3,3,'#8a6551',gate);box(-17,1,0,10,2,2,'#ac9780',gate);box(17,1,0,10,2,2,'#ac9780',gate);box(-9,4.5,0,.18,3,.18,'#e6dab2',gate);box(9,4.5,0,.18,3,.18,'#e6dab2',gate)
 const banner=label('臺大・總圖男八巡遊',start.pos.x,6.6,start.pos.z,22);banner.rotation.y=gate.rotation.y+Math.PI
 const startLights:T.Mesh[]=[];for(let i=0;i<3;i++){const m=new T.Mesh(new T.SphereGeometry(.55,12,8),new T.MeshBasicMaterial({color:'#263e35'}));m.position.set((i-1)*1.5,4.8,-.8);gate.add(m);startLights.push(m)}
 label('國立臺灣大學',-17,3,-7,12,Math.PI/2)
 return {sun,startLights,update(_time,_dt,focus){sun.position.set(focus.x-70,focus.y+130,focus.z+50);sun.target.position.copy(focus)},setShadowMap(size){sun.shadow.mapSize.set(size,size);sun.shadow.map?.dispose();sun.shadow.map=null}}
}
