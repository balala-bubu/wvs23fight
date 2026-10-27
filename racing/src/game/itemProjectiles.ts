import * as T from 'three'
import {sharedSkillProp} from '../custom/sharedCharacters'
const phoneGeo=new T.BoxGeometry(.85,1.35,.15),caseMat=new T.MeshStandardMaterial({color:'#273344',roughness:.4}),screenMat=new T.MeshStandardMaterial({color:'#9fd9f0',emissive:'#23495c'}),buttonGeo=new T.BoxGeometry(.22,.07,.03)
const bombGeo=new T.BoxGeometry(.95,.95,.95),bombMat=new T.MeshStandardMaterial({color:'#433c50',flatShading:true}),goldMat=new T.MeshStandardMaterial({color:'#ffcb67'}),fuseGeo=new T.CylinderGeometry(.05,.05,.4,5)
export function makeShot(kind:number):T.Group{
 if(kind===2){const g=sharedSkillProp('bwa');g.scale.setScalar(.6);return g}
 if(kind===3){const g=sharedSkillProp('waffle');g.rotation.x=.25;return g}
 const g=new T.Group()
 if(kind===0){g.add(new T.Mesh(phoneGeo,caseMat));const screen=new T.Mesh(new T.BoxGeometry(.69,1.05,.02),screenMat);screen.position.z=.09;g.add(screen);for(let i=0;i<3;i++){const row=new T.Mesh(buttonGeo,i%2?caseMat:goldMat);row.position.set(0,.25-i*.25,.11);g.add(row)}g.rotation.z=.12}
 else {g.add(new T.Mesh(bombGeo,bombMat));const band=new T.Mesh(new T.BoxGeometry(1.01,.2,1.01),goldMat);g.add(band);const fuse=new T.Mesh(fuseGeo,goldMat);fuse.position.y=.62;fuse.rotation.z=.35;g.add(fuse);const label=new T.Mesh(new T.BoxGeometry(.38,.4,.02),new T.MeshStandardMaterial({color:'#eb7962'}));label.position.z=.49;g.add(label)}
 return g
}
