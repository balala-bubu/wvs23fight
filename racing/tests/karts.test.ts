import { describe, it, expect } from 'vitest'
import { KARTS, withKart } from '../src/game/karts'
import type { Character } from '../src/game/characters'
describe('independent kart selection',()=>{
 const character:Character={id:'yu',stats:{speed:3,accel:4,handling:3,weight:3},fur:'#fff',furDark:'#000',belly:'#eee',kart:'#f00',kartAccent:'#ff0',ui:'#abc'}
 it('uses the chosen vehicle palette and stats without changing the driver or roster',()=>{
   const selected=withKart(character,'2')
   expect(selected.id).toBe('yu');expect(selected.ui).toBe('#abc');expect(selected.stats.speed).toBe(5);expect(selected.kart).toBe('#8a6cf0');expect(character.stats.speed).toBe(3);expect(character.kart).toBe('#f00')
 })
 it('keeps all six original vehicle setups balanced and handles unknown selections',()=>{
   expect(KARTS).toHaveLength(6)
   for(const k of KARTS)expect(Object.values(k.stats).reduce((a,b)=>a+b,0)).toBe(13)
   expect(withKart(character,'unknown').kart).toBe(KARTS[0].color)
 })
})
