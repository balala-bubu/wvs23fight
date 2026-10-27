import {describe,it,expect,vi} from 'vitest'
import * as THREE from 'three'
// Inventory tests do not load browser-only character textures or projectile artwork.
vi.mock('../src/custom/sharedCharacters', () => ({sharedDriver:vi.fn(),SHARED_IDS:[]}))
vi.mock('../src/game/itemProjectiles', () => ({makeShot:vi.fn()}))
import {Items} from '../src/game/items'
import type {Racer} from '../src/game/racer'
import {packFrame,readFrame,RACER_WIDTH,type Frame} from '../src/network/protocol'

function racer(item:Racer['item']=null,reserveItem:Racer['item']=null):Racer {
 return {item,reserveItem,itemUses:0,reserveUses:0,useDelay:0,roulette:0,rouletteItem:null,shieldTime:0,goo:0,coins:0,place:2,finished:false,position:new THREE.Vector3(),kart:{forward:new THREE.Vector3(0,0,1),spinOut:vi.fn(),boost:vi.fn(),cancelDrift:vi.fn()}} as unknown as Racer
}
function items() {
 const instance=Object.create(Items.prototype) as Items
 Object.assign(instance,{time:0,crates:[],traps:[],bees:[],shots:[],shards:[],fx:{ring:vi.fn()},hooks:{got:vi.fn(),sfx:vi.fn(),blocked:vi.fn()},stepExtras:vi.fn()})
 return instance
}
describe('two-slot inventory',()=>{
 it('promotes a multi-use reserve after the active item runs out and blocks duplicate input',()=>{
  const i=items(),r=racer('coin','triplePepper');r.reserveUses=3
  i.use(r,[r]);expect(r.coins).toBe(2);expect(r.item).toBe('triplePepper');expect(r.itemUses).toBe(3);expect(r.reserveItem).toBeNull();expect(i.use(r,[r])).toBeNull()
 })
 it('keeps the active multi-use item until all charges are spent',()=>{
  const i=items(),r=racer('triplePepper','coin');r.reserveUses=1
  for(let n=0;n<2;n++){r.useDelay=0;i.use(r,[r]);expect(r.item).toBe('triplePepper')}
  r.useDelay=0;i.use(r,[r]);expect(r.item).toBe('coin');expect(r.itemUses).toBe(1)
 })
 it('preserves crates with both slots full and fills the reserve without overwriting the active item',()=>{
  const i=items(),crate={pos:new THREE.Vector3(),respawn:0,mesh:{visible:true}}
  const breakCrate=vi.fn(()=>{crate.respawn=1.2});Object.assign(i,{crates:[crate],breakCrate})
  const full=racer('shield','coin');i.step(.01,[full],0);expect(breakCrate).not.toHaveBeenCalled()
  const r=racer('shield');i.step(.01,[r],0);expect(breakCrate).toHaveBeenCalledOnce();expect(r.rouletteItem).not.toBeNull()
  const rolled=r.rouletteItem;i.step(.5,[r],0);expect(r.item).toBe('shield');expect(r.reserveItem).toBe(rolled)
 })
 it('steals the active item with its charges and promotes the victim reserve',()=>{
  const i=items(),r=racer('ghost','shield'),victim=racer('tripleBee','coin');r.reserveUses=1;victim.itemUses=2;victim.reserveUses=1
  i.use(r,[r,victim]);expect(r.item).toBe('tripleBee');expect(r.itemUses).toBe(2);expect(r.reserveItem).toBe('shield');expect(victim.item).toBe('coin');expect(victim.reserveItem).toBeNull()
 })
 it('clears both slots and pending roulette on an unprotected lightning victim',()=>{
  const i=items(),r=racer('lightning'),victim=racer('shield','coin');victim.roulette=.4;victim.rouletteItem='pepper'
  i.use(r,[r,victim]);expect(victim.item).toBeNull();expect(victim.reserveItem).toBeNull();expect(victim.roulette).toBe(0);expect(victim.rouletteItem).toBeNull()
 })
 it('round trips reserve ids and counts and rejects invalid charges',()=>{
  const row=Array(RACER_WIDTH).fill(0);row[23]=1;row[51]=3;row[52]=2
  const frame:Frame={race:1,seq:1,time:1,phase:2,phaseTime:1,raceTime:1,countdown:0,racers:[row],crates:[],traps:[],bees:[],shots:[]}
  expect(readFrame(packFrame(frame))?.racers[0].slice(51)).toEqual([3,2]);row[52]=9;expect(readFrame(packFrame(frame))).toBeNull()
 })
})
