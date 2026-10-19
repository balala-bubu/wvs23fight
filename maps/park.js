/* map: park — loaded after js/core.js and the characters */
'use strict';
/* --- map 1: autumn park --- */
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const far = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:grassTex})); far.rotation.x = -Math.PI/2; far.position.y = -26; g.add(far);
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[stoneM,stoneM,cobM,stoneM,stoneM,stoneM]),0,-0.7,0));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), rockM); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-15,x2:-7,y:7}, {x1:7,x2:15,y:7}, {x1:-3.5,x2:3.5,y:13} ];
  plats.forEach(p=>addPlatform(g,p,cobM,stoneM,rockM));
  lampPost(g,-W+1.4,-3.2); lampPost(g,W-1.4,-3.2);
  for(let i=0;i<64;i++){
    const x = -130 + rnd()*260, z = -34 - rnd()*90, s = 14 + rnd()*12;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:folTex[(rnd()*4)|0], alphaTest:.5, fog:true}));
    const tint = .78 + rnd()*.25; sp.material.color.setRGB(tint,tint*.97,tint*.92);
    sp.scale.set(s,s,1); sp.position.set(x, -26 + s*0.5 + 3, z); g.add(sp);
  }
  registerMap('park', { name:'秋日公園', group:g, W, plats, sky:skyTex, fog:0xd8a786, fogNear:55, fogFar:190, hemi:[0xffe4c8,0x4a3828], sun:0xffc18a, rim:0xff8a5a });
}

