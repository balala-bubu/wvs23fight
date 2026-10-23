/* Original low-cost ball aura and contact burst, inspired by sports broadcasts. */
'use strict';
class VolleyEffects{
  constructor(scene,reduced=false){
    this.reduced=reduced;this.life=0;this.power=0;this.group=new THREE.Group();scene.add(this.group);
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const g=canvas.getContext('2d'),glow=g.createRadialGradient(64,64,12,64,64,64);glow.addColorStop(0,'rgba(255,255,255,.55)');glow.addColorStop(.45,'rgba(255,255,255,.22)');glow.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=glow;g.fillRect(0,0,128,128);
    this.aura=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));this.group.add(this.aura);
    const shape=new THREE.Shape();for(let i=0;i<24;i++){const a=i/24*Math.PI*2,r=i%2?.49:1.0,x=Math.cos(a)*r,y=Math.sin(a)*r;if(!i)shape.moveTo(x,y);else shape.lineTo(x,y);}shape.closePath();
    this.burst=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));this.group.add(this.burst);
    this.ring=new THREE.Mesh(new THREE.RingGeometry(.78,.91,32),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));this.group.add(this.ring);
    this.clear();
  }
  hit(position,color,grade){this.life=this.reduced?.12:.24;this.power=({weak:.25,normal:.5,nice:.7,good:.85,super:1,block:.65})[grade]||.5;this.burst.position.copy(position);this.ring.position.copy(position);this.burst.material.color.set(color);this.ring.material.color.set(color);}
  clear(){this.life=0;this.group.visible=false;}
  update(dt,ball,camera,active,color,grade){
    this.group.visible=!!active;if(!active)return;this.life=Math.max(0,this.life-dt);this.aura.position.copy(ball);this.aura.material.color.set(color||'#ffffff');const strong=grade==='super'||grade==='good';this.aura.scale.setScalar(strong?1.65:1.18);this.aura.material.opacity=this.reduced?.12:strong?.43:.2;
    const t=1-this.life/(this.reduced?.12:.24);this.burst.visible=this.ring.visible=this.life>0;this.burst.quaternion.copy(camera.quaternion);this.ring.quaternion.copy(camera.quaternion);this.burst.scale.setScalar((.7+t*.65)*(.65+this.power*.55));this.ring.scale.setScalar(.65+t*.8);this.burst.material.opacity=Math.max(0,(1-t)*.6*this.power);this.ring.material.opacity=Math.max(0,(1-t)*.75*this.power);
  }
}
