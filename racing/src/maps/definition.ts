/** Coordinates deliberately follow the original game: [x, z, heightY], in metres. */
export type Point3=[number,number,number]
export type Anchor={path:'main'|'short';at?:[number,number];fraction?:number;offset?:number}
export type TrackDefinition={
 id:string;name:string;theme?:'candy'|'campus'|'dinosaur';points:Point3[];halfWidth:number;shoulder:number;shortHalfWidth:number
 shortcut:{from:readonly [number,number];via:Point3[];to:readonly [number,number]}
 pads:(Anchor&{lateral:number;length:number;width:number})[]
 ramps:(Anchor&{length:number;width:number;lip:number})[]
 itemRows:(Anchor&{lanes:number[]})[]
 fluff:{from:number;to:number};arch:Anchor
}
export function validateTrack(d:TrackDefinition):string[]{
 const errors:string[]=[]
 if(!/^[a-z][a-z0-9-]{1,39}$/.test(d.id))errors.push('id 必須是小寫英文字母、數字或連字號')
 if(!d.name.trim())errors.push('請填寫地圖名稱')
 if(d.points.length<8)errors.push('主賽道至少需要 8 個控制點')
 if(d.points.some(p=>p.length!==3||p.some(n=>!Number.isFinite(n))))errors.push('控制點必須是有限數值的 [x,z,y]')
 for(const p of d.points)if(p.some(n=>Math.abs(n)>2000))errors.push('請將地圖控制在原點周圍 2000 公尺內')
 if(!Number.isFinite(d.halfWidth)||d.halfWidth<4||d.halfWidth>20)errors.push('半路寬建議為 4 到 20 公尺')
 if(!Number.isFinite(d.shoulder)||d.shoulder<1||d.shoulder>6)errors.push('路肩寬度必須為 1 到 6 公尺')
 if(!Number.isFinite(d.shortHalfWidth)||d.shortHalfWidth<2||d.shortHalfWidth>10)errors.push('捷徑半路寬必須為 2 到 10 公尺')
 if(!d.shortcut.via.length||[d.shortcut.from,d.shortcut.to,...d.shortcut.via].some(p=>p.some(n=>!Number.isFinite(n))))errors.push('捷徑必須有有效的入口、中間點與出口')
 if(d.ramps.some(r=>r.path!=='main')||d.arch.path!=='main')errors.push('跳台與裝飾拱門目前只支援主賽道')
 for(const f of [...d.pads,...d.ramps,...d.itemRows,d.arch]){
  if((f.at!==undefined)===(f.fraction!==undefined))errors.push('每個設施必須擇一指定 at 或 fraction')
  if(f.at&&f.at.some(n=>!Number.isFinite(n)))errors.push('設施 at 必須是 [x,z] 數值')
  if(f.fraction!==undefined&&(!Number.isFinite(f.fraction)||f.fraction<0||f.fraction>1))errors.push('fraction 必須介於 0 到 1')
  if(f.offset!==undefined&&!Number.isFinite(f.offset))errors.push('offset 必須是有效公尺數')
 }
 for(const f of [...d.pads,...d.ramps])if(!Number.isFinite(f.length)||!Number.isFinite(f.width)||f.length<=0||f.width<=0)errors.push('加速墊和跳台的長寬必須大於 0')
 for(const r of d.itemRows)if(r.lanes.some(n=>!Number.isFinite(n)||Math.abs(n)>(r.path==='main'?d.halfWidth:d.shortHalfWidth)-.5))errors.push('道具箱 lanes 必須位於路面內')
 if(d.fluff.from<0||d.fluff.to>1||d.fluff.from>d.fluff.to)errors.push('捷徑減速區間必須介於 0 到 1')
 return [...new Set(errors)]
}
