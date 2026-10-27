import type { Character } from './characters'
import type { Stats } from './config'
export const KARTS: {id:string;color:string;accent:string;stats:Stats}[] = [
{id:'0',color:'#ff5f8f',accent:'#ffe066',stats:{speed:3,accel:4,handling:3,weight:3}},
{id:'1',color:'#3fc4a8',accent:'#fff4c8',stats:{speed:3,accel:3,handling:5,weight:2}},
{id:'2',color:'#8a6cf0',accent:'#ffd35c',stats:{speed:5,accel:1,handling:3,weight:4}},
{id:'3',color:'#ffb020',accent:'#ff5d5d',stats:{speed:4,accel:3,handling:2,weight:4}},
{id:'4',color:'#6ec8ff',accent:'#ff8fc7',stats:{speed:2,accel:5,handling:4,weight:2}},
{id:'5',color:'#ff7a45',accent:'#7ef0ff',stats:{speed:3,accel:3,handling:3,weight:4}},
]
export function withKart(c:Character,id:string):Character {
 const k=KARTS.find(k=>k.id===id)??KARTS[0]
 return {...c,kart:k.color,kartAccent:k.accent,stats:{...k.stats}}
}
