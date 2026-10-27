import {describe,it,expect} from 'vitest'
import {MAPS,mapForId,signatureFor} from '../src/maps/catalog'
import {trackUrl} from '../src/maps/selector'
describe('two selectable worlds',()=>{
 it('selects each complete track and safely defaults on unknown ids',()=>{expect(MAPS.map(m=>mapForId(m.id).id)).toEqual(['ntu-campus','candy-valley','dino-valley']);expect(mapForId('bad').id).toBe('ntu-campus');expect(new Set(MAPS.map(signatureFor)).size).toBe(3)})
 it('preserves the hosted path while removing a previous room on map changes',()=>{const u=new URL(trackUrl('https://example.com/game/index.html?room=123456&autojoin=1','candy-valley'));expect(u.pathname).toBe('/game/index.html');expect(u.searchParams.get('track')).toBe('candy-valley');expect(u.searchParams.has('room')).toBe(false)})
 it('can follow a verified host world with a fresh join after rebuilding',()=>{const u=new URL(trackUrl('https://example.com/?track=ntu-campus','candy-valley','123456'));expect(u.searchParams.get('room')).toBe('123456');expect(u.searchParams.get('autojoin')).toBe('1')})
})

import {ACTIVE_MAP,MAP_SIGNATURE,setActiveMap} from '../src/maps/active'
import {ITEM_SKILL_SOURCES,ITEM_KINDS} from '../src/game/itemCatalog'
it('switches the selected map signature in place and restores it',()=>{const before=ACTIVE_MAP.id;try{setActiveMap('dino-valley');expect(ACTIVE_MAP.theme).toBe('dinosaur');expect(MAP_SIGNATURE).toBe(signatureFor(mapForId('dino-valley')))}finally{setActiveMap(before)}})
it('records an explicit real character skill for all item variants',()=>{expect(Object.keys(ITEM_SKILL_SOURCES).sort()).toEqual([...ITEM_KINDS].sort());expect(ITEM_SKILL_SOURCES.shell.character).toBe('jackson');expect(ITEM_SKILL_SOURCES.boomerang.move).toContain('xuBwaFire');expect(ITEM_SKILL_SOURCES.rocket.move).toContain('whiteDog')})
