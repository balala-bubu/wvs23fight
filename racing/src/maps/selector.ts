import {ACTIVE_MAP} from './active'
import {MAPS,signatureFor} from './catalog'
export function mapSelectorMarkup():string{return `<label class="track-selector">賽道 <select data-track-select data-nav aria-label="選擇賽道">${MAPS.map(m=>`<option value="${m.id}"${m.id===ACTIVE_MAP.id?' selected':''}>${m.name}</option>`).join('')}</select></label>`}
export function trackUrl(href:string,id:string,room?:string):string{const url=new URL(href);if(!MAPS.some(m=>m.id===id))return url.href;url.searchParams.set('track',id);url.searchParams.delete('room');url.searchParams.delete('autojoin');if(room&&/^\d{6}$/.test(room)){url.searchParams.set('room',room);url.searchParams.set('autojoin','1')}url.hash='';return url.href}
export function bindMapSelection():void{document.addEventListener('change',e=>{const select=e.target;if(select instanceof HTMLSelectElement&&select.matches('[data-track-select]'))location.assign(trackUrl(location.href,select.value))})}
export function followHostMap(signature:string,room:string):boolean{const map=MAPS.find(m=>signatureFor(m)===signature);if(!map||map.id===ACTIVE_MAP.id)return false;location.replace(trackUrl(location.href,map.id,room));return true}
