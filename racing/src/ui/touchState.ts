import type {Action} from '../engine/input'
export type TouchKey=Action|'left'|'right'
/** Pointer ownership: one finger releasing must not release another finger's button. */
export class TouchState{
 private pointers=new Map<number,TouchKey>()
 press(id:number,key:TouchKey){this.pointers.set(id,key)}
 release(id:number){this.pointers.delete(id)}
 key(id:number){return this.pointers.get(id)}
 held(key:TouchKey){return [...this.pointers.values()].includes(key)}
 get steer(){return Number(this.held('right'))-Number(this.held('left'))}
 get size(){return this.pointers.size}
 clear(){this.pointers.clear()}
}
