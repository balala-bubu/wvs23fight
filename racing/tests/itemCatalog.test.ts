import {describe,it,expect} from 'vitest'
import {ITEM_KINDS,itemCharges,itemWeights} from '../src/game/itemCatalog'
import {NTU_CAMPUS} from '../src/maps/ntuCampus'
import {ACTIVE_MAP} from '../src/maps/active'
import {validateTrack} from '../src/maps/definition'
import {TrackSpline} from '../src/engine/spline'
import zh from '../src/i18n/zh-TW.json'
describe('expanded race items and NTU route',()=>{
 it('gives each item a visible name, description, valid charges and finite rank weights',()=>{
  expect(ITEM_KINDS).toHaveLength(23)
  for(const k of ITEM_KINDS){expect((zh as Record<string,string>)['item.'+k]).toBeTruthy();expect((zh as Record<string,string>)['item.'+k+'.desc']).toBeTruthy();expect(itemCharges(k)).toBeGreaterThan(0);for(let p=0;p<6;p++)expect(itemWeights(p,6)[k]).toBeGreaterThanOrEqual(0)}
  expect(itemCharges('partyBox')).toBe(8);expect(itemCharges('tripleShell')).toBe(3);expect(itemWeights(0,6).rocket).toBe(0);expect(itemWeights(5,6).rocket).toBeGreaterThan(0)
 })
 it('activates a valid campus circuit with spaced item rows and a gentler jump',()=>{
  expect(ACTIVE_MAP.id).toBe('ntu-campus');expect(validateTrack(NTU_CAMPUS)).toEqual([])
  const s=new TrackSpline(NTU_CAMPUS.points.map(([x,z,y])=>({x,y,z})),{closed:true,step:1,halfWidth:8});expect(s.length).toBeGreaterThan(700);expect(s.length).toBeLessThan(1200);expect(NTU_CAMPUS.ramps).toHaveLength(0)
 })
})
