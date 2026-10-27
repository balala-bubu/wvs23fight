import {ACTIVE_MAP} from '../maps/active'
import { sharedPortrait, sharedSkinName } from '../custom/sharedCharacters'
import type {RaceRoom} from './room'
import type {I18n} from '../engine/i18n'
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
export class RaceLobby {
 private root:HTMLElement
 constructor(root:HTMLElement,private room:RaceRoom,private i18n:I18n,private portraits:Map<string,string>,select:()=>void,exit:()=>void,chooseMap:()=>void=()=>room.start()){
  this.root=root
  root.innerHTML=`<div class="net-shell panel"><div class="net-heading"><small>WVS ONLINE / PEERJS</small><h2>連線競速</h2></div><div class="net-entry"><div class="net-options"><label>玩家 <select data-net-capacity><option value="2">2 人</option><option value="3">3 人</option><option value="4" selected>4 人</option><option value="6">6 人</option></select></label><label>圈數 <select data-net-laps><option value="1">1 圈</option><option value="3" selected>3 圈</option><option value="5">5 圈</option></select></label></div><div class="net-big"><button class="btn btn-primary" data-nav data-net-host><b>開房</b><span>邀請朋友一起競速</span></button><div class="net-join"><label for="race-room-code">六位數房號</label><input id="race-room-code" inputmode="numeric" maxlength="6" autocomplete="off" pattern="[0-9]{6}" placeholder="123456"><button class="btn" data-nav data-net-join>加入房間</button></div></div></div><div class="net-room" hidden><div class="net-code"><span>房號</span><strong data-net-code></strong><button class="btn" data-net-copy>複製邀請連結</button></div><div class="net-rules" data-net-rules></div><div class="net-seats" data-net-seats></div><div class="net-actions"><button class="btn" data-nav data-net-select>選角色・選車・準備</button><button class="btn btn-primary" data-nav data-net-start>選擇地圖 →</button></div></div><p class="net-status" data-net-status role="status" aria-live="polite"></p><p class="net-note">各裝置自行顯示畫面，只傳操作與遊戲狀態。<br>空位由電腦補上，共 6 台車。房主比賽時請保持此頁開啟。</p><div class="net-footer"><span data-net-stats></span><button class="btn" data-nav data-net-exit>返回</button></div></div>`
  this.q<HTMLButtonElement>('[data-net-host]').onclick=()=>void room.host(+this.q<HTMLSelectElement>('[data-net-capacity]').value,+this.q<HTMLSelectElement>('[data-net-laps]').value)
  this.q<HTMLButtonElement>('[data-net-join]').onclick=()=>void room.join(this.q<HTMLInputElement>('#race-room-code').value.trim())
  this.q<HTMLInputElement>('#race-room-code').oninput=e=>{const el=e.target as HTMLInputElement;el.value=el.value.replace(/\D/g,'')}
  this.q<HTMLInputElement>('#race-room-code').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();void room.join((e.target as HTMLInputElement).value)}}
  this.q<HTMLButtonElement>('[data-net-select]').onclick=()=>{room.edit();select()}
  this.q<HTMLButtonElement>('[data-net-start]').onclick=()=>chooseMap()
  this.q<HTMLButtonElement>('[data-net-exit]').onclick=()=>{room.leave();exit()}
  this.q<HTMLButtonElement>('[data-net-copy]').onclick=async()=>{const url=new URL(location.href);url.searchParams.set('track',ACTIVE_MAP.id);url.searchParams.set('room',room.code);url.searchParams.delete('autojoin');url.hash='';try{await navigator.clipboard.writeText(url.href);room.status='邀請連結已複製';this.render()}catch{room.status='請將六位數房號告訴朋友';this.render()}}
 }
 private q<T extends HTMLElement=HTMLElement>(s:string){return this.root.querySelector<T>(s)!}
 render(){const r=this.room,entry=r.stage==='entry'||r.stage==='connecting';this.q('.net-entry').hidden=!entry;this.q('.net-room').hidden=entry
  this.q<HTMLButtonElement>('[data-net-host]').disabled=r.stage==='connecting';this.q<HTMLButtonElement>('[data-net-join]').disabled=r.stage==='connecting'
  this.q('[data-net-code]').textContent=r.code;this.q('[data-net-status]').textContent=r.status
  this.q('[data-net-rules]').textContent=`${ACTIVE_MAP.name}・真人 ${r.capacity} 人以內・${r.laps} 圈・空位由電腦補上`
  this.q('[data-net-seats]').innerHTML=Array.from({length:r.capacity},(_,slot)=>{const seat=r.seats.find(s=>s.slot===slot);return `<div class="net-seat ${seat?.ready?'is-ready':''}" style="--pc:${['#ff7a3d','#4fa3ff','#5fd36a','#d070e0','#f2c14e','#63d7d1'][slot]}"><b>P${slot+1}${slot===0?' 房主':''}${slot===r.slot?'・你':''}</b>${seat?`<img src="${(seat.skin?sharedPortrait(seat.character,seat.skin):this.portraits.get(seat.character))??''}" alt=""><strong>${escape(this.i18n.t('char.'+seat.character+'.name'))}</strong><small>${escape(this.i18n.t('kart.'+seat.kart+'.name'))}・${escape(sharedSkinName(seat.character,seat.skin??0))}</small><span>${!seat.connected?'電腦接手':seat.ready?'OK! 已準備':'選擇中'}</span>`:'<span class="waiting">等待玩家加入</span>'}</div>`}).join('')
  this.q<HTMLButtonElement>('[data-net-start]').hidden=r.role!=='host';this.q<HTMLButtonElement>('[data-net-start]').disabled=!r.canStart
  this.q<HTMLButtonElement>('[data-net-select]').disabled=r.stage!=='lobby'
  this.q<HTMLButtonElement>('[data-net-exit]').textContent=r.active?'離開房間':'返回主頁'
  this.q('[data-net-stats]').textContent=r.active?`接收 ${(r.rxRate/1024).toFixed(1)} KB/s・傳送 ${(r.txRate/1024).toFixed(1)} KB/s${r.role==='guest'?'・'+Math.round(r.rtt)+' ms':''}`:''
 }
 prefill(code:string){this.q<HTMLInputElement>('#race-room-code').value=code}
}
