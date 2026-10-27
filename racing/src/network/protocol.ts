import {ITEM_KINDS} from '../game/itemCatalog'
/** Data-only racing protocol. No media, executable code, or asset transfer. */
export const PROTOCOL = 4
export const SNAPSHOT_HZ = 15
export const INPUT_HZ = 30
export const RACER_WIDTH = 52
const MAGIC = 51025, HEADER = 14
export type Seat = { slot:number; character:string; kart:string; skin?:number; ready:boolean; connected:boolean }
export type Controls = {seq:number; throttle:number; brake:number; steer:number; drift:boolean; item:number}
export type Frame = {race:number;seq:number;time:number;phase:number;phaseTime:number;raceTime:number;countdown:number;racers:number[][];crates:number[];traps:number[][];bees:number[][];shots:number[][]}
const finite=(n:unknown):n is number=>typeof n==='number'&&Number.isFinite(n)
const int=(n:unknown,min:number,max:number):n is number=>finite(n)&&Number.isInteger(n)&&n>=min&&n<=max
export function readControls(value:unknown):Controls|null {
 if(value instanceof ArrayBuffer){if(value.byteLength!==28)return null;value=Array.from(new Float32Array(value))}
 if(!Array.isArray(value)||value.length!==7||!value.every(finite))return null
 const [seq,throttle,brake,steer,drift,item,version]=value
 if(version!==PROTOCOL||!int(seq,0,16777215)||throttle<0||throttle>1||brake<0||brake>1||Math.abs(steer)>1||!int(drift,0,1)||!int(item,0,16777215))return null
 return {seq,throttle,brake,steer,drift:!!drift,item}
}
export const writeControls=(c:Controls)=>new Float32Array([c.seq,c.throttle,c.brake,c.steer,+c.drift,c.item,PROTOCOL]).buffer
export function packFrame(f:Frame):ArrayBuffer {
 const values=[MAGIC,PROTOCOL,f.race,f.seq,f.time,f.phase,f.phaseTime,f.raceTime,f.countdown,f.racers.length,f.crates.length,f.traps.length,f.bees.length,f.shots.length,...f.racers.flat(),...f.crates,...f.traps.flat(),...f.bees.flat(),...f.shots.flat()]
 return new Float32Array(values).buffer
}
export function readFrame(data:unknown):Frame|null {
 if(!(data instanceof ArrayBuffer)||data.byteLength%4||data.byteLength<HEADER*4||data.byteLength>32768)return null
 const a=new Float32Array(data)
 if(a[0]!==MAGIC||a[1]!==PROTOCOL||!int(a[2],1,1000000)||!int(a[3],0,16777215)||!int(a[5],0,3)||!int(a[9],1,6)||!int(a[10],0,128)||!int(a[11],0,10)||!int(a[12],0,12)||!int(a[13],0,24))return null
 if(a.length!==HEADER+a[9]*RACER_WIDTH+a[10]+a[11]*7+a[12]*4+a[13]*8||!a.every(n=>Number.isFinite(n)&&Math.abs(n)<1e8))return null
 let p=HEADER;const take=(n:number)=>Array.from(a.slice(p,p+=n)),racers=Array.from({length:a[9]},()=>take(RACER_WIDTH)),crates=take(a[10]),traps=Array.from({length:a[11]},()=>take(7)),bees=Array.from({length:a[12]},()=>take(4)),shots=Array.from({length:a[13]},()=>take(8))
 for(const shot of shots)if(!int(shot[0],0,3)||!int(shot[7],0,5))return null
 for(const r of racers)if(!int(r[20],0,ITEM_KINDS.length)||!int(r[21],0,ITEM_KINDS.length)||!int(r[23],1,6)||!int(r[25],0,6)||!int(r[29],0,1))return null
 return {race:a[2],seq:a[3],time:a[4],phase:a[5],phaseTime:a[6],raceTime:a[7],countdown:a[8],racers,crates,traps,bees,shots}
}
export const mixAngle=(a:number,b:number,t:number)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t
/** Server-time jitter buffer. Packet arrival jitter cannot move the playout clock backwards. */
export class FrameBuffer {
 private frames:{f:Frame;at:number}[]=[]
 private offsets:number[]=[]
 private offset=0
 private playhead=-Infinity
 clear(){this.frames=[];this.offsets=[];this.offset=0;this.playhead=-Infinity}
 push(f:Frame,at:number):boolean {
  const last=this.frames.at(-1)
  if(last&&(f.seq<=last.f.seq||f.time<last.f.time))return false
  const observed=at-f.time*1000
  this.offsets.push(observed);if(this.offsets.length>30)this.offsets.shift()
  const baseline=Math.min(...this.offsets)
  this.offset=this.frames.length?this.offset+Math.max(-8,Math.min(8,baseline-this.offset)):observed
  this.frames.push({f,at});if(this.frames.length>24)this.frames.shift();return true
 }
 sample(now:number,delay=110):Frame|null {
  if(!this.frames.length)return null
  const target=Math.max(this.playhead,now-this.offset-delay);this.playhead=target
  let left=this.frames[0],right=left
  for(const entry of this.frames){const t=entry.f.time*1000;if(t<=target)left=entry;if(t>=target){right=entry;break}right=entry}
  if(left===right){
    const age=Math.min(.1,Math.max(0,(target-left.f.time*1000)/1000)),f=left.f
    if(!age||f.phase<2)return f
    return {...f,time:f.time+age,raceTime:f.raceTime+age,phaseTime:f.phaseTime+age,racers:f.racers.map(r=>{if(r[32]>0)return r;const v=[...r];v[0]+=v[4]*age;v[1]+=v[5]*age;v[2]+=v[6]*age;return v})}
  }
  const a=left.f,b=right.f,span=b.time-a.time,t=span>0?Math.max(0,Math.min(1,(target/1000-a.time)/span)):1
  const same=a.phase===b.phase
  return {...b,time:a.time+(b.time-a.time)*t,raceTime:same?a.raceTime+(b.raceTime-a.raceTime)*t:b.raceTime,phaseTime:same?a.phaseTime+(b.phaseTime-a.phaseTime)*t:b.phaseTime,
    racers:b.racers.map((r,i)=>{const l=a.racers[i];if(!l||Math.hypot(r[0]-l[0],r[2]-l[2])>12||r[32]>0||l[32]>0)return r;const v=[...r];for(const j of [0,1,2,4,5,6,7,9,12,14,16])v[j]=l[j]+(r[j]-l[j])*t;v[3]=mixAngle(l[3],r[3],t);return v})}
 }
 get newest(){return this.frames.at(-1)}
}
