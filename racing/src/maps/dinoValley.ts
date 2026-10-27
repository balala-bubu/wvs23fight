import type {TrackDefinition} from './definition'
/** Original prehistoric circuit, inspired by themed jungle racing, no Nintendo assets. */
export const DINO_VALLEY:TrackDefinition={
 id:'dino-valley',name:'恐龍・失落火山谷',theme:'dinosaur',halfWidth:8,shoulder:2.4,shortHalfWidth:4.6,
 points:[[-80,20,0],[-10,20,0],[65,10,1],[110,-20,2],[125,-65,3],[105,-105,4],[65,-130,4],[25,-160,2],[-20,-168,1],[-55,-150,1],[-62,-115,2],[-90,-95,3],[-130,-110,4],[-165,-135,5],[-200,-115,4],[-210,-70,2],[-180,-35,1],[-135,-10,0]],
 shortcut:{from:[105,-105],via:[[70,-100,3],[30,-120,2]],to:[-20,-168]},
 pads:[{path:'main',fraction:.12,lateral:0,length:5,width:5.5},{path:'main',fraction:.62,lateral:0,length:5,width:5.5},{path:'short',fraction:.3,lateral:0,length:5,width:5}],
 ramps:[{path:'main',fraction:.64,length:8,width:7,lip:1}],itemRows:[{path:'main',fraction:.07,lanes:[-5.4,-1.8,1.8,5.4]},{path:'main',fraction:.35,lanes:[-5.4,-1.8,1.8,5.4]},{path:'main',fraction:.72,lanes:[-5.4,-1.8,1.8,5.4]},{path:'short',fraction:.8,lanes:[-1.6,1.6]}],fluff:{from:.35,to:.7},arch:{path:'main',fraction:.61},
}
