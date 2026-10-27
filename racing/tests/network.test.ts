import {describe,it,expect} from 'vitest'
import {FrameBuffer,packFrame,readFrame,readControls,writeControls,mixAngle,RACER_WIDTH,SNAPSHOT_HZ,PROTOCOL,type Frame} from '../src/network/protocol'
const frame=(seq=1):Frame=>{const r=Array(RACER_WIDTH).fill(0);r[0]=10;r[23]=1;r[25]=0;r[29]=0;return {race:1,seq,time:10+(seq-1)*.1,phase:2,phaseTime:5,raceTime:5,countdown:0,racers:Array.from({length:6},()=>[...r]),crates:Array(24).fill(1),traps:[[1,2,3,0,0,0,1]],bees:[[4,5,6,0]],shots:[[2,5,6,7,0,1,0,0]]}}
describe('data-only network protocol',()=>{
 it('round trips real controls as a 28 byte packet',()=>{const c={seq:12,throttle:1,brake:0,steer:-1,drift:true,item:2};expect(writeControls(c).byteLength).toBe(28);expect(readControls(writeControls(c))).toEqual(c)})
 it('rejects invalid and non-finite remote input',()=>{for(const v of [null,{},[1,1,0,99,0,0,PROTOCOL],[1,1,0,0,1,-1,PROTOCOL],[1,NaN,0,0,0,0,PROTOCOL],[1,1,0,0,0,0,999],new ArrayBuffer(32)])expect(readControls(v)).toBeNull()})
 it('round trips the whole race including item visibility and ownership-independent positions',()=>{expect(readFrame(packFrame(frame()))).toEqual(frame())})
 it('rejects oversized, truncated, malformed and incompatible state',()=>{expect(readFrame(new ArrayBuffer(40000))).toBeNull();expect(readFrame(packFrame(frame()).slice(0,-4))).toBeNull();const a=new Float32Array(packFrame(frame()));a[1]=99;expect(readFrame(a.buffer)).toBeNull();a[1]=PROTOCOL;a[15]=NaN;expect(readFrame(a.buffer)).toBeNull();a[15]=0;a[14+20]=999;expect(readFrame(a.buffer)).toBeNull()})
 it('interpolates snapshots without rewinding for reordered or duplicate packets',()=>{const buffer=new FrameBuffer(),a=frame(1),b=frame(2);b.racers[0][0]=20;expect(buffer.push(a,100)).toBe(true);expect(buffer.push(b,200)).toBe(true);expect(buffer.push(a,210)).toBe(false);expect(buffer.push(b,220)).toBe(false);expect(buffer.sample(260)?.racers[0][0]).toBeCloseTo(15);buffer.clear();expect(buffer.sample(300)).toBeNull()})
 it('snaps respawns instead of sliding a car through the course',()=>{const b=new FrameBuffer(),a=frame(1),c=frame(2);c.racers[0][0]=100;b.push(a,100);b.push(c,200);expect(b.sample(240)?.racers[0][0]).toBe(100)})
 it('takes the short rotation path across the angle wrap',()=>{expect(Math.abs(mixAngle(Math.PI-.1,-Math.PI+.1,.5)-Math.PI)).toBeLessThan(.001)})
 it('uses server time rather than fluctuating arrival gaps',()=>{
   const b=new FrameBuffer(),packets=Array.from({length:30},(_,i)=>{const f=frame(i+1);f.time=10+i/15;f.racers[0][0]=20*i/15;f.racers[0][4]=20;return {f,at:100+i*1000/15+[0,55,5,80,20,0][i%6]}}).sort((a,c)=>a.at-c.at)
   const errors:number[]=[];let last=-Infinity
   for(let now=100;now<1700;now+=1000/60){while(packets.length&&packets[0].at<=now){const p=packets.shift()!;b.push(p.f,p.at)}const f=b.sample(now);if(!f)continue;const x=f.racers[0][0];expect(x).toBeGreaterThanOrEqual(last-.001);last=x;if(now>300)errors.push(Math.abs(x-(now-210)/1000*20))}
   expect(Math.max(...errors)).toBeLessThan(.05)
 })
 it('bounds extrapolation and resets clocks between races',()=>{const b=new FrameBuffer(),f=frame(1);f.racers[0][4]=20;b.push(f,100);expect(b.sample(1000)?.racers[0][0]).toBeCloseTo(12);expect(b.sample(5000)?.racers[0][0]).toBeCloseTo(12);b.clear();expect(b.push(frame(1),10)).toBe(true)})
 it('keeps normal state payload below 24 KB/s per guest at 15 Hz',()=>{expect(packFrame(frame()).byteLength*SNAPSHOT_HZ).toBeLessThan(24*1024)})
})

describe('expanded item snapshots',()=>{
 it('transports new item ids, uses, statuses, coins and projectile positions',()=>{const f=frame();f.racers[0][20]=23;f.racers[0][42]=8;f.racers[0][49]=7;f.racers[0][50]=10;const decoded=readFrame(packFrame(f))!;expect(decoded.racers[0].slice(42,51)).toEqual(f.racers[0].slice(42,51));expect(decoded.racers[0][20]).toBe(23);expect(decoded.shots).toEqual(f.shots)})
})
