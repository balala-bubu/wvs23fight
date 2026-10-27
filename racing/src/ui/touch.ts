import type {Action,Input} from '../engine/input'
import type {I18n} from '../engine/i18n'
import type {HudState} from '../game/game'
import {ITEM_ICONS} from './icons'
import {TouchState,type TouchKey} from './touchState'
const arrow=(right:boolean)=>`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="${right?'M14 8l13 12-13 12':'M26 8L13 20l13 12'}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
/** Rush+-inspired split steering and a large independent drift key; optional analog slider. */
export class TouchControls{
 private el:HTMLElement
 private knob:HTMLElement
 private state=new TouchState()
 private stickId=-1
 private stickCenter=0
 private stickX=0
 private wasActive=false
 private hud?:HudState
 private itemMark=''
 constructor(root:HTMLElement,private input:Input,private i18n:I18n,private active:()=>boolean){
  this.el=document.createElement('div');this.el.className='touch';this.el.innerHTML=`
   <div class="steer-buttons" role="group" aria-label="${i18n.t('touch.steering')}"><button class="steer-key steer-left" data-touch-key="left" aria-label="${i18n.t('touch.left')}">${arrow(false)}</button><button class="steer-key steer-right" data-touch-key="right" aria-label="${i18n.t('touch.right')}">${arrow(true)}</button></div>
   <div class="stick" data-stick><div class="stick-track"><span>◀</span><span>▶</span></div><div class="stick-knob" data-knob></div></div>
   <div class="tbtns"><button class="tbtn tbtn-item" data-touch-key="item" data-a="item"><span class="touch-item-icon"></span><span class="touch-item-label" data-l="touch.item"></span><span class="touch-item-count"></span></button><button class="tbtn tbtn-brake" data-touch-key="brake" data-a="brake"><span data-l="touch.brake"></span></button><button class="tbtn tbtn-accelerate" data-touch-key="accelerate" data-a="accelerate" hidden><span data-l="touch.accelerate"></span></button><button class="tbtn tbtn-drift" data-touch-key="drift" data-a="drift"><svg viewBox="0 0 48 24" aria-hidden="true"><path d="M5 21q15-19 37-16M14 22q10-10 26-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg><span data-l="touch.drift"></span><i class="touch-drift-meter"></i></button></div>`
  root.append(this.el);this.knob=this.el.querySelector('[data-knob]')!;const stick=this.el.querySelector<HTMLElement>('[data-stick]')!
  stick.addEventListener('pointerdown',e=>{if(!this.active()||this.stickId!==-1)return;e.preventDefault();this.stickId=e.pointerId;stick.setPointerCapture(e.pointerId);const r=stick.getBoundingClientRect();this.stickCenter=r.left+r.width/2;this.moveStick(e.clientX,r.width)})
  stick.addEventListener('pointermove',e=>{if(e.pointerId===this.stickId)this.moveStick(e.clientX,stick.getBoundingClientRect().width)})
  for(const btn of this.el.querySelectorAll<HTMLButtonElement>('[data-touch-key]')){
   btn.addEventListener('pointerdown',e=>{if(!this.active()||this.state.key(e.pointerId))return;const key=btn.dataset.touchKey as TouchKey;if(key==='item'&&(!this.hud?.item||this.hud.rolling))return;e.preventDefault();btn.setPointerCapture(e.pointerId);this.state.press(e.pointerId,key);this.apply()})
   btn.addEventListener('pointermove',e=>{const key=this.state.key(e.pointerId);if(key!=='left'&&key!=='right')return;const r=this.el.querySelector('.steer-buttons')!.getBoundingClientRect();this.state.press(e.pointerId,e.clientX<r.left+r.width/2?'left':'right');this.apply()})
   btn.addEventListener('contextmenu',e=>e.preventDefault())
  }
  const release=(e:PointerEvent)=>{if(e.pointerId===this.stickId){this.stickId=-1;this.stickX=0;this.knob.style.transform='translate(-50%,-50%)';this.apply()}if(this.state.key(e.pointerId)){this.state.release(e.pointerId);this.apply()}}
  for(const type of ['pointerup','pointercancel','lostpointercapture'] as const)window.addEventListener(type,release)
  window.addEventListener('blur',()=>this.reset());window.addEventListener('orientationchange',()=>this.reset());document.addEventListener('visibilitychange',()=>{if(document.hidden)this.reset()})
  i18n.onChange(()=>this.relabel());this.relabel();const coarse=matchMedia('(pointer:coarse)');const mark=()=>document.body.classList.toggle('touch-device',coarse.matches||input.method==='touch');mark();coarse.addEventListener?.('change',mark);window.addEventListener('touchstart',()=>document.body.classList.add('touch-device'),{passive:true})
  const tick=()=>{const on=this.active();this.el.classList.toggle('on',on);if(on&&!this.wasActive&&coarse.matches)this.input.setTouchSteer(0);if(!on&&this.wasActive)this.reset();this.wasActive=on;const accelerator=this.el.querySelector<HTMLButtonElement>('[data-a="accelerate"]')!;accelerator.hidden=this.input.autoThrottle;this.el.classList.toggle('manual-gas',!this.input.autoThrottle);requestAnimationFrame(tick)};tick()
 }
 updateHud(hud:HudState):void{
  this.hud=hud;const btn=this.el.querySelector<HTMLButtonElement>('[data-a="item"]')!,mark=hud.rolling?'rolling':hud.item??'empty';if(mark!==this.itemMark){this.itemMark=mark;this.el.querySelector('.touch-item-icon')!.innerHTML=hud.item&&!hud.rolling?ITEM_ICONS[hud.item]:hud.rolling?'<span class="touch-roulette">?</span>':'';this.el.querySelector('.touch-item-label')!.textContent=this.i18n.t(hud.rolling?'touch.rolling':hud.item?'item.'+hud.item:'hud.emptyItem')}
  this.el.querySelector('.touch-item-count')!.textContent=hud.itemUses>1?'×'+hud.itemUses:'';btn.classList.toggle('empty',!hud.item||hud.rolling);btn.setAttribute('aria-disabled',String(!hud.item||hud.rolling));btn.setAttribute('aria-label',hud.item?this.i18n.t('item.'+hud.item):this.i18n.t('hud.emptyItem'))
  const drift=this.el.querySelector<HTMLElement>('[data-a="drift"]')!;drift.classList.toggle('charging',hud.drifting);drift.dataset.tier=String(hud.driftTier);drift.style.setProperty('--drift-fill',String(Math.min(1,hud.driftCharge/3)))
 }
 private apply():void{this.input.setTouchSteer(this.stickId!==-1?this.stickX:this.state.steer);for(const key of ['drift','brake','accelerate','item'] as Action[])this.input.setTouchButton(key,this.state.held(key));for(const el of this.el.querySelectorAll<HTMLElement>('[data-touch-key]'))el.classList.toggle('down',this.state.held(el.dataset.touchKey as TouchKey))}
 private reset():void{if(!this.state.size&&this.stickId===-1)return;this.state.clear();this.stickId=-1;this.stickX=0;this.apply();this.input.clearPresses();this.knob.style.transform='translate(-50%,-50%)'}
 private relabel():void{for(const el of this.el.querySelectorAll<HTMLElement>('[data-l]'))el.textContent=this.i18n.t(el.dataset.l!);this.el.querySelector('.steer-buttons')!.setAttribute('aria-label',this.i18n.t('touch.steering'));for(const key of ['left','right'])this.el.querySelector('[data-touch-key="'+key+'"]')!.setAttribute('aria-label',this.i18n.t('touch.'+key));this.itemMark='';if(this.hud)this.updateHud(this.hud)}
 private moveStick(clientX:number,width:number):void{const half=Math.max(1,width/2-20),dx=Math.max(-half,Math.min(half,clientX-this.stickCenter)),raw=dx/half;this.stickX=Math.sign(raw)*Math.pow(Math.max(0,Math.abs(raw)-.08)/.92,1.25);this.input.setTouchSteer(this.stickX);this.knob.style.transform=`translate(calc(-50% + ${dx}px),-50%)`}
}
