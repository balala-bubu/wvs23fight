import type {TrackDefinition} from './definition'
/** Route prototype: west main gate → Coconut Avenue/library → east Male 8 → south return.
 * Building order follows campus references; scale and unverified connecting corners are game adaptations. */
export const NTU_CAMPUS:TrackDefinition={
 id:'ntu-campus',name:'臺大・總圖男八巡遊',theme:'campus',halfWidth:7,shoulder:2,shortHalfWidth:4,
 points:[[0,0,0],[65,0,0],[145,0,0],[220,0,0],[249,23,0],[280,48,0],[340,52,0],[402,62,0],[440,86,0],[442,122,0],[403,145,0],[330,165,0],[240,170,0],[150,150,0],[90,120,0],[35,96,0],[5,64,0],[-12,29,0]],
 shortcut:{from:[150,150],via:[[112,128,0],[75,110,0]],to:[35,96]},
 pads:[{path:'main',fraction:.12,lateral:0,length:5,width:5},{path:'main',fraction:.45,lateral:0,length:5,width:5},{path:'main',fraction:.78,lateral:0,length:5,width:5},{path:'short',fraction:.3,lateral:0,length:5,width:5}],ramps:[],
 itemRows:[{path:'main',fraction:.13,lanes:[-4.5,-1.5,1.5,4.5]},{path:'main',fraction:.4,lanes:[-4.5,-1.5,1.5,4.5]},{path:'main',fraction:.68,lanes:[-4.5,-1.5,1.5,4.5]},{path:'short',fraction:.75,lanes:[-1.5,1.5]}],fluff:{from:.25,to:.7},arch:{path:'main',fraction:.01},
}
