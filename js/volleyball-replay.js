/* Bounded visual history. Playback never advances or rewrites the live match. */
'use strict';
class VolleyReplay {
  constructor(){this.reset();}
  reset(){this.frames=[];this.active=false;this.playing=false;this.cursor=0;this.lead=0;}
  record(state,force=false){
    const last=this.frames[this.frames.length-1];
    if(last&&state.time<=last.time)return;
    if(!force&&last&&state.time-last.time<1/30)return;
    this.frames.push({time:state.time,combo:state.combo,strike:state.strike?{...state.strike}:null,flight:state.flight?{...state.flight}:null,
      ball:{...state.ball},players:state.players.map(p=>({...p}))});
    while(this.frames.length>120||this.frames[0].time<state.time-3.6)this.frames.shift();
  }
  begin(state){
    this.record(state,true);if(this.frames.length<3)return false;
    this.end=this.frames[this.frames.length-1].time;
    this.cursor=Math.max(this.frames[0].time,this.end-1.6);
    if(this.end-this.cursor<.4)return false;
    this.active=true;this.playing=false;this.lead=.3;return true;
  }
  tick(dt){
    if(!this.active)return;
    if(this.lead>0){this.lead-=dt;if(this.lead<=0)this.playing=true;return;}
    this.cursor+=dt*.8;if(this.cursor>=this.end)this.stop();
  }
  stop(){this.active=false;this.playing=false;}
  sample(){
    let i=0;while(i<this.frames.length-2&&this.frames[i+1].time<this.cursor)i++;
    const a=this.frames[i],b=this.frames[i+1]||a;if(!a)return null;
    const k=Math.max(0,Math.min(1,(this.cursor-a.time)/Math.max(.001,b.time-a.time)));
    const blend=(x,y)=>({...x,x:x.x+(y.x-x.x)*k,y:x.y+(y.y-x.y)*k,z:x.z+(y.z-x.z)*k});
    return {...a,ball:blend(a.ball,b.ball),players:a.players.map((p,n)=>blend(p,b.players[n]))};
  }
}
if(typeof module!=='undefined')module.exports={VolleyReplay};
