import {DINO_VALLEY} from './dinoValley'
import {NTU_CAMPUS} from './ntuCampus'
import {CANDY_VALLEY} from './candyValley'
import {validateTrack,type TrackDefinition} from './definition'
export const MAPS=[NTU_CAMPUS,CANDY_VALLEY,DINO_VALLEY] as const
export function mapForId(id:string|null):TrackDefinition{return MAPS.find(m=>m.id===id)??NTU_CAMPUS}
export function signatureFor(map:TrackDefinition):string{let hash=2166136261;for(const c of JSON.stringify(map)){hash^=c.charCodeAt(0);hash=Math.imul(hash,16777619)}return map.id+'-'+(hash>>>0).toString(16)}
for(const map of MAPS){const errors=validateTrack(map);if(errors.length)throw Error('地圖設定錯誤：'+errors.join('；'))}
