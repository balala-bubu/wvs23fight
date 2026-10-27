import type {TrackDefinition} from './definition'
export const CANDY_VALLEY:TrackDefinition={
 id:'candy-valley',name:'糖果山谷',halfWidth:8,shoulder:2.4,shortHalfWidth:4.6,
 points:[[-40,0,0],[30,0,0],[75,-10,0],[98,-45,.5],[95,-90,1],[70,-118,1],[35,-120,1],[12,-100,1.5],[10,-70,2],[-10,-48,2.5],[-40,-45,3],[-62,-65,5],[-72,-100,7.5],[-80,-140,4],[-100,-165,1.5],[-135,-165,1],[-155,-135,1],[-150,-90,.5],[-128,-45,0],[-100,-8,0]],
 shortcut:{from:[84,-22],via:[[74,-50,.4],[69,-82,.8]],to:[55,-110]},
 pads:[{path:'main',at:[-72,-100],offset:1.5,lateral:0,length:5,width:5.5},{path:'main',at:[10,-78],lateral:-3,length:5,width:4.5},{path:'main',at:[-150,-96],lateral:3.5,length:5,width:4.5},{path:'short',fraction:.25,lateral:0,length:5,width:5}],
 ramps:[{path:'main',at:[-72,-100],offset:9,length:8,width:7.2,lip:1.35}],
 itemRows:[{path:'main',at:[12,0],lanes:[-5.4,-1.8,1.8,5.4]},{path:'main',at:[-30,-44],lanes:[-5.4,-1.8,1.8,5.4]},{path:'main',at:[-152,-118],lanes:[-5.4,-1.8,1.8,5.4]},{path:'short',fraction:.83,lanes:[-1.6,1.6]}],
 fluff:{from:.36,to:.7},arch:{path:'main',at:[-72,-100],offset:-10},
}
