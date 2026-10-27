import * as T from 'three'
import type {Track} from './track'
import type {Scenery} from './scenery'
/** Original low-poly prehistoric props; dinosaurs stay outside the collision corridor. */
export function buildDinoScenery(scene:T.Scene,track:Track,size:number):Scenery{
 scene.background=new T.Color('#b8d2ae');scene.fog=new T.Fog('#bacab0',150,460);scene.add(new T.HemisphereLight('#f6efd0','#486044',2.1))
 const sun=new T.DirectionalLight('#ffdda2',2.8);sun.position.set(-60,110,45);sun.castShadow=true;sun.shadow.mapSize.set(size,size);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:300});sun.shadow.bias=-.001;scene.add(sun,sun.target)
 const mats=new Map<string,T.MeshStandardMaterial>(),mat=(c:string)=>{if(!mats.has(c))mats.set(c,new T.MeshStandardMaterial({color:c,flatShading:true,roughness:.85}));return mats.get(c)!}
 function mesh(geo:T.BufferGeometry,c:string,x:number,y:number,z:number,parent:T.Object3D=scene){const m=new T.Mesh(geo,mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 function box(x:number,y:number,z:number,w:number,h:number,d:number,c:string,p:T.Object3D=scene){return mesh(new T.BoxGeometry(w,h,d),c,x,y,z,p)}
 function rock(x:number,y:number,z:number,r:number,c:string,p:T.Object3D=scene){return mesh(new T.IcosahedronGeometry(r,1),c,x,y,z,p)}
 const ground=box(-30,-1,-60,1200,1.5,1200,'#6d8d49');ground.castShadow=false
 // Distant volcano: crater, solidified channels and a small lava pool, outside the race surface.
 mesh(new T.ConeGeometry(55,65,10),'#675f4a',45,30,-255);mesh(new T.CylinderGeometry(8,12,3,12),'#ef823b',45,62,-255)
 const lava=mesh(new T.CircleGeometry(30,32),'#e98534',-120,.01,-180);lava.rotation.x=-Math.PI/2;lava.scale.y=.6
 // Long-necked herbivores, with recognisable body, tail, four legs and separate moving neck.
 const necks:T.Group[]=[]
 function dinosaur(x:number,z:number,scale:number,color:string){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);const body=rock(0,5,0,4,color,g);body.scale.set(1.7,1,.9);for(const a of [-3,3])for(const b of [-2,2])mesh(new T.CylinderGeometry(.7,.9,5,7),color,a,2.5,b,g);const tail=mesh(new T.ConeGeometry(1.5,10,7),color,-8,5,0,g);tail.rotation.z=Math.PI/2;const neck=new T.Group();neck.position.set(4,6,0);g.add(neck);const stem=mesh(new T.CylinderGeometry(.9,1.4,12,8),color,0,5,0,neck);stem.rotation.z=-.15;rock(1,11,0,1.9,color,neck);for(const zz of [-1.55,1.55])rock(1.7,11.6,zz,.21,'#182b20',neck);necks.push(neck)}
 dinosaur(20,68,1.5,'#6d9f75');dinosaur(46,-58,1.5,'#6d9f75');dinosaur(-147,-67,1.1,'#9fa765');dinosaur(-240,-110,.9,'#7c9c8e')
 // Fossil rib gates on a straight, leaving more than the full road width clear below.
 const arch=track.main.at(track.length*.58),bones=new T.Group();bones.position.copy(arch.pos);bones.rotation.y=track.main.yawAt(arch.s);scene.add(bones)
 for(let i=0;i<5;i++){const rib=mesh(new T.TorusGeometry(14,.65,5,18,Math.PI),'#e6d7af',0,0,(i-2)*5,bones);rib.rotation.z=0;box(-14,2,(i-2)*5,1.2,4,1.2,'#e6d7af',bones);box(14,2,(i-2)*5,1.2,4,1.2,'#e6d7af',bones)}
 // Dense fern/rock silhouettes are instanced and excluded from the driving corridor.
 const spots:T.Vector3[]=[];for(let i=0;i<260;i++){const p=new T.Vector3(-275+(i*83%450),0,-230+(i*59%340));if(track.main.closest(p).distance<17||track.short.closest(p).distance<12)continue;spots.push(p)}
 const foliage=new T.InstancedMesh(new T.ConeGeometry(3,5,6),mat('#315e42'),spots.length),trunks=new T.InstancedMesh(new T.CylinderGeometry(.35,.6,5,5),mat('#725e41'),spots.length),d=new T.Object3D();spots.forEach((p,i)=>{d.position.copy(p).setY(2);d.rotation.set(0,i,0);d.scale.setScalar(.7+(i%4)*.3);d.updateMatrix();foliage.setMatrixAt(i,d.matrix);d.position.y=.5;d.updateMatrix();trunks.setMatrixAt(i,d.matrix)});scene.add(foliage,trunks)
 for(let i=0;i<30;i++){const p=new T.Vector3(-250+(i*71%400),0,-200+(i*47%280));if(track.main.closest(p).distance>17&&track.short.closest(p).distance>12){const b=rock(p.x,2,p.z,4+(i%4),'#8d8a69');b.scale.set(1,1.4,.8)}}
 // Egg nesting ground, distinct from candy props.
 for(let i=0;i<9;i++){const a=i*2.4,egg=mesh(new T.SphereGeometry(1.6,8,6),'#e7d7af',-105+Math.cos(a)*8,1.3,-40+Math.sin(a)*6);egg.scale.y=1.4}
 const start=track.main.at(0),gate=new T.Group();gate.position.copy(start.pos);gate.rotation.y=track.main.yawAt(0);scene.add(gate);box(-12,5,0,2,10,2,'#766647',gate);box(12,5,0,2,10,2,'#766647',gate);box(0,10,0,26,2,2,'#d1bd8d',gate)
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=160;const c=canvas.getContext('2d')!;c.fillStyle='#344d35';c.fillRect(0,0,1024,160);c.fillStyle='#ffe4a3';c.font='900 80px "WVS UI",sans-serif';c.textAlign='center';c.fillText('恐龍・失落火山谷',512,110);const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(25,4),new T.MeshBasicMaterial({map:tex}));sign.position.set(0,12,-.2);sign.rotation.y=Math.PI;gate.add(sign)
 const startLights:T.Mesh[]=[];for(let i=0;i<3;i++){const light=new T.Mesh(new T.SphereGeometry(.6,10,6),new T.MeshBasicMaterial({color:'#263b2b'}));light.position.set((i-1)*1.7,8,-1.1);gate.add(light);startLights.push(light)}
 return {sun,startLights,update(time,_dt,focus){necks.forEach((n,i)=>n.rotation.z=Math.sin(time*.5+i)*.055);sun.position.set(focus.x-60,focus.y+110,focus.z+45);sun.target.position.copy(focus)},setShadowMap(n){sun.shadow.mapSize.set(n,n);sun.shadow.map?.dispose();sun.shadow.map=null}}
}
