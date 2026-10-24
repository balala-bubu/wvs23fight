'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
// Exercise the actual pose builders and pose application without loading WebGL/assets.
const source=fs.readFileSync(require.resolve('../js/volleyball-models.js'),'utf8');
const context=vm.createContext({assert,console});
vm.runInContext(source.slice(source.indexOf('const JK ='),source.indexOf('const CHARS ='))+`
const arm=()=>({th:{position:{y:0,z:0}},f:[{scale:{x:1,y:1,z:1},position:{y:0}}]});
const model={joints:Object.fromEntries(JK.map(n=>[n,{rotation:{x:0,y:0,z:0}}])),hips:{rotation:{y:0},position:{y:3.3}},R:arm(),Lf:arm()};
let count=0;
for(let i=0;i<=120;i++){
 const t=i/120,phase=t*Math.PI*4;
 for(const pose of [runPose(phase),volleyBackstepPose(phase),volleyShufflePose(phase,-1),volleyShufflePose(phase,1),volleySetPose(t,null),volleySetPose(1,t*.5),volleyServePose(t,null),volleyServePose(1,t*.5)]){
  for(const joint of JK){assert.equal(pose[joint].length,3,joint);assert(pose[joint].every(Number.isFinite),joint);}
  applyPose(model,pose,.25);
  for(const joint of Object.values(model.joints))assert(Object.values(joint.rotation).every(Number.isFinite));
  assert(Number.isFinite(model.hips.position.y));count++;
 }
}
console.log('PASS: '+count+' movement, receive, set and serve poses keep every joint finite through actual pose application');
`,context);
