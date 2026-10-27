// Save as racing/src/maps/myTrack.ts. Then change active.ts to use MY_TRACK.
import {CANDY_VALLEY} from './candyValley'
import type {TrackDefinition} from './definition'
export const MY_TRACK:TrackDefinition={
 ...CANDY_VALLEY,
 id:'my-first-track',
 name:'我的第一張賽道',
 // Shift the west side 8 metres outward while keeping the east-side shortcut intact.
 points:CANDY_VALLEY.points.map(([x,z,y])=>[x < -90 ? x-8 : x,z,y] as [number,number,number]),
 // Features copied from the original remain projected onto the nearest road location.
 // For a totally different route, update shortcut, pads, ramps, itemRows and arch too.
}
