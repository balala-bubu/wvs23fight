import {describe,it,expect} from 'vitest'
import {TouchState} from '../src/ui/touchState'
import {parseSave} from '../src/engine/save'
describe('mobile pointer ownership',()=>{
 it('holds steering and drift independently across fingers',()=>{const s=new TouchState();s.press(1,'left');s.press(2,'drift');expect(s.steer).toBe(-1);expect(s.held('drift')).toBe(true);s.release(1);expect(s.steer).toBe(0);expect(s.held('drift')).toBe(true);s.release(2);expect(s.held('drift')).toBe(false)})
 it('does not release an action still held by another finger and cancels opposing arrows',()=>{const s=new TouchState();s.press(1,'drift');s.press(2,'drift');s.release(1);expect(s.held('drift')).toBe(true);s.press(3,'left');s.press(4,'right');expect(s.steer).toBe(0);s.release(3);expect(s.steer).toBe(1);s.clear();expect(s.size).toBe(0);expect(s.held('drift')).toBe(false)})
 it('switches a captured steering finger between directions without affecting another action',()=>{const s=new TouchState();s.press(5,'left');s.press(6,'item');s.press(5,'right');expect(s.steer).toBe(1);expect(s.held('item')).toBe(true)})
})
describe('saved touch preferences',()=>{
 it('migrates old saves with split direction keys and valid visibility',()=>{const d=parseSave('{"version":2,"character":"yu"}');expect(d.touchLayout).toBe('buttons');expect(d.touchSize).toBe(1);expect(d.touchOpacity).toBe(.8)})
 it('retains selected controls and constrains corrupt settings',()=>{const d=parseSave(JSON.stringify({version:2,touchLayout:'stick',touchSize:9,touchOpacity:-4}));expect(d.touchLayout).toBe('stick');expect(d.touchSize).toBe(1.2);expect(d.touchOpacity).toBe(.35);const bad=parseSave(JSON.stringify({version:2,touchSize:'bad',touchOpacity:'bad'}));expect(bad.touchSize).toBe(1);expect(bad.touchOpacity).toBe(.8)})
})
