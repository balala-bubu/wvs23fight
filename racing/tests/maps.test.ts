import {describe,it,expect} from 'vitest'
import {CANDY_VALLEY} from '../src/maps/candyValley'
import {validateTrack} from '../src/maps/definition'
import {TrackSpline} from '../src/engine/spline'
import * as THREE from 'three'
describe('editable track definitions',()=>{
 it('preserves the original route and valid feature data',()=>{expect(validateTrack(CANDY_VALLEY)).toEqual([]);expect(CANDY_VALLEY.points).toHaveLength(20);expect(CANDY_VALLEY.itemRows).toHaveLength(4)})
 it('allows a new route without editing racing or character logic',()=>{const map={...CANDY_VALLEY,id:'my-first-track',points:CANDY_VALLEY.points.map(([x,z,y])=>[x<-90?x-8:x,z,y] as [number,number,number])};expect(validateTrack(map)).toEqual([]);const s=new TrackSpline(map.points.map(([x,z,y])=>({x,y,z})),{closed:true,step:1,halfWidth:map.halfWidth});expect(s.length).toBeGreaterThan(500);expect(s.closest(new THREE.Vector3(-163,1,-135)).distance).toBeLessThan(1)})
 it('reports malformed control points, positioning and off-road crates',()=>{const map=structuredClone(CANDY_VALLEY);map.points[0][0]=NaN;map.pads[0].fraction=.2;map.itemRows[0].lanes=[100];expect(validateTrack(map)).toEqual(expect.arrayContaining(['控制點必須是有限數值的 [x,z,y]','每個設施必須擇一指定 at 或 fraction','道具箱 lanes 必須位於路面內']))})
})
