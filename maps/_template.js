/* TEMPLATE — copy to maps/<id>.js, add a <script> tag in index.html after the other maps. Not loaded by the game.
   Coordinates: the stage top is y=0 from x=-W..W, the camera looks along -z, background goes at z < -10.
   The whole group is stretched sideways for 3–4 players, so keep collision data in plats/W only. */
'use strict';
const xxSkyTex = tex(4,64,(g)=>{ const gr = g.createLinearGradient(0,0,0,64); gr.addColorStop(0,'#7fb8e8'); gr.addColorStop(1,'#e8f0f8'); g.fillStyle = gr; g.fillRect(0,0,4,64); });
xxSkyTex.magFilter = THREE.LinearFilter;
const xxGroundTex = tex(32,32,(g)=>speckle(g,32,32,'#8a9a6a',['#96a676','#7e8e60'],.6),[60,60]);
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const far = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:xxGroundTex})); far.rotation.x = -Math.PI/2; far.position.y = -26; g.add(far);
  const topM = L({color:0xb0a080}), sideM = L({color:0x8a7a60});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));          // main stage
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), L({map:rockTex})); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-15,x2:-7,y:7}, {x1:7,x2:15,y:7}, {x1:-3.5,x2:3.5,y:13} ];               // pass-through platforms
  plats.forEach(p=>addPlatform(g,p,topM,sideM,L({map:rockTex})));
  // background scenery here (z < -10). For motion use obj.onBeforeRender = ()=>{...} and obj.frustumCulled = false.
  registerMap('xx', { name:'地圖名稱', group:g, W, plats, sky:xxSkyTex, fog:0xd8e4ee, fogNear:60, fogFar:200,
    hemi:[0xffffff,0x556644], sun:0xfff0d0, rim:0xa8c8ff });
}
