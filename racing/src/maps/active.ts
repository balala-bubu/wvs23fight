import {mapForId,signatureFor} from './catalog'
// Each world is built once from a validated URL choice. Changing track reloads its physics/scenery.
export let ACTIVE_MAP=mapForId(typeof location==='undefined'?null:new URL(location.href).searchParams.get('track'))
export let MAP_SIGNATURE=signatureFor(ACTIVE_MAP)

export function setActiveMap(id:string):void{ACTIVE_MAP=mapForId(id);MAP_SIGNATURE=signatureFor(ACTIVE_MAP)}
