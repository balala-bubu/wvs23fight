import {describe,it,expect} from 'vitest'
import * as THREE from 'three'
import {ChaseCamera} from '../src/game/camera'
describe('chase camera across stalled frames and boosts',()=>{
 it('keeps a usable projection when changing from flyover to chase after a stalled frame',()=>{
  Object.assign(globalThis,{innerWidth:844,innerHeight:390})
  const c=new ChaseCamera(),p=new THREE.Vector3(-70,.6,18)
  c.mode='flyby';c.update(.016,p,1.7,1.7,0,false,false,0);c.punch(.8)
  c.mode='chase';c.snap()
  for(const dt of [-.25,3,.016,0,.1]){c.update(dt,p,1.7,1.7,30,true,false,0);expect(c.camera.fov).toBeGreaterThan(39);expect(c.camera.fov).toBeLessThan(96);c.camera.updateMatrixWorld();const vertical=p.clone().add(new THREE.Vector3(0,2,0)).project(c.camera).y-p.clone().project(c.camera).y;expect(vertical).toBeGreaterThan(0)}
 })
})
