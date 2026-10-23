/* Fixed-player 2v2 volleyball. Browser-independent simulation shared by keyboard,
 * phone and AI inputs. All scores follow ball contacts, net or floor collisions. */
'use strict';
const VOLLEY_COURT=Object.freeze({halfWidth:7.7,halfLength:15.4,netHeight:4.63,ballRadius:.36});
class VolleyMatch {
  constructor({mode='solo',difficulty='normal',practice=false,onEvent=()=>{}}={}){
    this.mode=mode;this.practice=practice;this.difficulty=difficulty;this.onEvent=onEvent;
    this.humans=({solo:[0],coop:[0,1],versus:[0,2],four:[0,1,2,3]})[mode]||[0];
    this.players=Array.from({length:4},(_,i)=>({id:i,team:i>>1,human:this.humans.includes(i),x:i%2?-2.5:2.5,z:(i<2?1:-1)*(i%2?2.7:9.8),tx:i%2?-2.5:2.5,tz:(i<2?1:-1)*(i%2?2.7:9.8),y:0,vy:0,move:0,offset:0,aim:0,pose:'stance',poseTime:0,swing:0,jumpLock:0,jumpKind:null,quick:false,slideVX:0,diveTime:0}));
    this.score=[0,0];this.receivers=[0,2];this.blockers=[1,3];this.server=0;this.serverSlot=[0,2];this.status='play';this.paused=false;this.time=0;this.serial=0;this.combo=0;this.perfects=0;this.touches=0;this.rally=0;this.longest=0;this.ball={x:2.5,y:3.4,z:13.4,vx:0,vy:0,vz:0};this.flight=null;this.pointTime=0;this.lastTouch=0;this.reason='';this.stats={aiContacts:0,aiRoutineMisses:0,blocks:0};
    this.config=({easy:{reaction:.25,speed:8.5,window:.36},normal:{reaction:.16,speed:10.2,window:.30},hard:{reaction:.09,speed:12,window:.25}})[difficulty];this.serveReady();
  }
  emit(type,data={}){this.onEvent({type,...data});}
  side(team){return team===0?1:-1;}
  teammate(id){return (id>>1)*2+(id%2?0:1);}
  bodyPoint(p,kind){return {x:p.x,y:kind==='spike'?4.25+p.y:kind==='set'?4.25:kind==='serve'?4.3:2.25,z:p.z-this.side(p.team)*.35};}
  serveReady(){
    this.status='play';this.rally=0;this.combo=0;this.flight=null;this.stage='ready';this.stageTime=0;this.server=this.practice?1:this.server;this.lastTouch=this.server;this.strike={grade:'normal',color:'#ffffff',combo:0};
    const server=this.serverSlot[this.server],side=this.side(this.server);this.active=server;
    for(const p of this.players){p.offset=0;p.aim=0;p.swing=0;p.quick=false;p.slideVX=0;p.diveTime=0;p.y=p.vy=0;p.pose='stance';p.poseTime=0;p.tx=p.id===this.receivers[p.team]?2.5:-2.5;p.tz=this.side(p.team)*(p.id===this.receivers[p.team]?9.8:2.7);p.x=p.tx;p.z=p.tz;}
    const p=this.players[server];p.x=p.tx=2.5;p.z=p.tz=13.4*side;this.ball={x:p.x,y:3.3,z:p.z-.3*side,vx:0,vy:0,vz:0};this.emit('serve',{team:this.server,player:server});
  }
  task(id){
    const p=this.players[id];if(this.status!=='play')return 'wait';
    if(this.stage==='ready')return id===this.active?'toss':p.team===this.server?'wait':id===this.receivers[p.team]?'receive':'block';
    if(this.flight&&this.flight.recipient===id)return this.flight.kind;
    if(this.flight&&this.flight.kind==='set'&&this.teammate(this.flight.recipient)===id)return 'approach';
    if(this.flight&&p.team!==this.flight.team)return id===this.blockers[p.team]?'block':'receive';
    return 'cover';
  }
  input(id,action,value=0){
    const p=this.players[id];if(!p||!p.human||this.status!=='play'||this.paused)return;
    if(action==='aim'){if(['spike','serve'].includes(this.task(id)))p.aim=Math.max(-1,Math.min(1,Number(value)||0))*this.side(p.team);return;}
    if(action==='move'){p.move=Math.max(-1,Math.min(1,value));return;}
    const task=this.task(id);
    if(action==='action'){
      if(task==='approach'||task==='block'||(task==='spike'&&p.y<.45))this.input(id,'jump');
      else if(['toss','serve','receive','set','spike'].includes(task))this.input(id,'hit');
      return;
    }
    if(action==='jump'){
      if(p.y>.08||p.jumpLock>0)return;
      p.jumpAge=0;p.vy=10.5;p.jumpLock=.75;p.jumpKind=task==='block'?'block':'spike';p.pose=task==='block'?'block':'spikeWind';p.poseTime=.85;
      if(task==='approach'){p.slideVX=Math.abs(p.move)>.35?p.move*this.side(p.team)*4:0;p.quick=!!this.flight&&this.flight.contactTime-this.flight.t<.28;if(!p.quick)this.emit('hint',{player:id,text:'等隊友托高球，再起跳'});}
      this.emit('jump',{player:id,task,slide:p.slideVX!==0});return;
    }
    if(action!=='hit'||p.swing>0)return;
    if(task==='toss'){this.toss();return;}
    if(task==='spike'&&p.y<.25){this.emit('hint',{player:id,text:'先起跳，再扣球！'});return;}
    p.swing=task==='spike'?.32:.20;p.pose=task==='receive'?'shieldW':task==='set'?'setUp':task==='serve'?'serveHit':'spikeHit';p.poseTime=.35;
    if(this.flight&&this.flight.recipient===id){
      const remaining=this.flight.contactTime-this.flight.t;
      if(task==='receive'&&remaining<.30&&remaining>-.1)this.tryDive(p);
      if(remaining>.35)this.emit('hint',{player:id,text:'太早了，等球靠近身體'});
      else if(remaining<-.13)this.emit('hint',{player:id,text:'晚了一點，下次提早揮動'});
      this.tryContact(p);
    }
  }
  toss(){
    const p=this.players[this.active],start={x:p.x,y:3.6,z:p.z-this.side(p.team)*.3};this.stage='serve';
    this.sendFlight('serve',p.team,p.id,start,{x:p.x,y:4.8,z:start.z},.60,12);p.pose='serveWind';p.poseTime=1.2;
  }
  sendFlight(kind,team,recipient,start,end,duration,g=12){
    this.flight={grade:this.strike?.grade||'normal',color:this.strike?.color||'#ffffff',id:++this.serial,kind,team,recipient,t:0,contactTime:duration,g,start:{...start},end:{...end},handledNet:false};
    this.ball={...start,vx:(end.x-start.x)/duration,vy:(end.y-start.y+.5*g*duration*duration)/duration,vz:(end.z-start.z)/duration};
    this.active=recipient;this.stage=kind;if(kind==='spike'){this.players[recipient].attackLocked=false;this.players[recipient].attackSteer=false;}
    const p=this.players[recipient];p.tx=end.x;p.tz=end.z+this.side(team)*.35;
    this.emit('flight',{kind,team,player:recipient,id:this.serial});
  }
  tryDive(p){
    const f=this.flight;if(!f||f.kind!=='receive'||f.recipient!==p.id||p.diveTime>0)return;
    const distance=Math.hypot(f.end.x-p.x,f.end.z+.35*this.side(p.team)-p.z);
    if(distance>1.7&&distance<3.8){p.diveTime=.5;this.emit('dive',{player:p.id});}
  }
  quality(delta){return Math.abs(delta)<.13?'nice':Math.abs(delta)<.30?'good':'weak';}
  tryContact(p,automatic=false){
    const f=this.flight;if(!f||p.id!==f.recipient)return false;
    const delta=f.t-f.contactTime,window=automatic?.12:f.kind==='spike'?.55:this.config.window;
    if(delta<-(automatic?.03:window)||delta>window)return false;
    const dist=Math.hypot(this.ball.x-p.x,this.ball.z-(p.z-this.side(p.team)*.35));
    const reach=automatic?1.9:f.kind==='spike'?3.4:2.0;if(dist>reach)return false;
    if(f.kind==='spike'&&(p.y<(automatic?1.1:.25)||Math.abs(this.ball.y-(4.25+p.y))>(automatic?1.35:3.0)))return false;
    if(f.kind==='receive'&&Math.abs(this.ball.y-2.25)>2.2)return false;
    if(f.kind==='set'&&Math.abs(this.ball.y-4.25)>1.5)return false;
    const quality=p.diveTime>0?'good':this.quality(delta);this.contact(p,quality,delta);return true;
  }
  contact(p,quality,delta=0){
    const old=this.flight,kind=old.kind,side=this.side(p.team),mate=this.players[this.teammate(p.id)];
    this.lastTouch=p.team;this.touches++;this.rally++;this.longest=Math.max(this.longest,this.rally);
    if(!p.human)this.stats.aiContacts++;
    if(kind==='receive')this.combo=0;
    const previousCombo=this.combo;
    if(kind!=='serve')this.combo=quality==='weak'?Math.max(0,this.combo-1):quality==='nice'||this.combo>0?Math.min(3,this.combo+1):0;
    const grade=quality==='weak'&&previousCombo===0?'weak':this.combo>=3?'super':this.combo===2?'good':this.combo===1?'nice':'normal';
    this.strike={grade,color:({weak:'#a984db',normal:'#ffffff',nice:'#65f58a',good:'#ffd34e',super:'#d74dff'})[grade],combo:this.combo};
    if(quality==='nice'&&p.human)this.perfects++;
    p.pose=kind==='receive'?'shieldW':kind==='set'?'setUp':kind==='serve'?'serveHit':'spikeHit';p.poseTime=.42;p.swing=0;
    this.emit('contact',{...this.strike,player:p.id,kind,quality,combo:this.combo,timing:delta,slide:p.slideVX!==0});
    const start={x:this.ball.x,y:this.ball.y,z:this.ball.z};
    if(kind==='receive'){
      this.receivers[p.team]=mate.id;this.blockers[p.team]=p.id;
      mate.tx=Math.max(-4.5,Math.min(4.5,p.x*.35-1));mate.tz=side*5.6;
      this.sendFlight('set',p.team,mate.id,start,{x:mate.tx,y:4.25,z:mate.tz-side*.35},1.2,12);
      p.tx=Math.max(-5.5,Math.min(5.5,p.x));p.tz=side*2.1;
    }else if(kind==='set'){
      const quick=mate.quick,duration=quick?.62:1.28;mate.tx=Math.max(-5.7,Math.min(5.7,mate.x+(mate.slideVX?mate.slideVX*duration:mate.offset*.35)));mate.tz=side*2.1;
      this.sendFlight('spike',p.team,mate.id,start,{x:mate.tx,y:6.7,z:mate.tz-side*.35},duration,12);
      this.flight.attack=mate.slideVX?'slide':quick?'quick':'normal';
      mate.quick=false;p.tx=-mate.tx*.45;p.tz=side*9.9;
    }else{
      const target=this.attackTarget(p,kind),strong=kind==='spike'&&this.combo>=3,weak=grade==='weak';
      const accuracy=1-Math.min(1,Math.abs(delta)/.55);
      let time=kind==='serve'?(weak?1.9:1.65-accuracy*.2):weak?2.0:(1.4-accuracy*.32)*(strong?.76:this.combo>=2?.9:1);
      if(this.practice)time=Math.max(time,1.2);
      // Off-center late/early swings can miss the sideline; AI never rolls a random error.
      if(p.human&&Math.abs(delta)>.24)target.x+=Math.sign(p.aim||delta)*Math.min(.6,(Math.abs(delta)-.24)*2);
      const end={x:target.x,y:2.25,z:target.z};
      // Choose gravity so the serve and soft return clear the net naturally.
      const gravity=12;
      const nextTeam=1-p.team,recipient=this.receivers[nextTeam];
      this.sendFlight('receive',nextTeam,recipient,start,end,time,gravity);
      this.flight.power=strong?3:weak?0:this.combo>=2?2:1;this.flight.source=kind;this.flight.attack=old.attack||'normal';
      this.players[recipient].offset=0;
      p.tx=Math.max(-5.6,Math.min(5.6,p.x));p.tz=kind==='serve'?side*9.8:side*2.1;
    }
  }
  attackTarget(p,kind){
    const opponent=1-p.team,side=this.side(opponent),receiver=this.players[this.receivers[opponent]],blocker=this.players[this.blockers[opponent]];
    if(p.human)return {x:Math.max(-6,Math.min(6,p.aim*6.0)),z:side*10.6};
    if(this.practice)return {x:1,z:side*9.8};
    if(kind==='serve')return {x:receiver.x*.55,z:side*10.3};
    const choices=[-5.7,-3,0,3,5.7];let best=0,bestScore=-Infinity;
    for(const x of choices){const travel=Math.abs(x-receiver.x),netX=p.x+(x-p.x)*.15,blocked=Math.abs(netX-blocker.x)<1.2?3.2:0;
      const rating=travel-blocked+Math.sin(this.time*.47+x)*.12;
      if(rating>bestScore){bestScore=rating;best=x;}}
    if(this.difficulty==='easy')best*=.45;
    return {x:best,z:side*(this.difficulty==='hard'?11.9:10.6)};
  }
  point(winner,reason){
    if(this.status!=='play')return;
    this.status='point';this.reason=reason;this.pointTime=this.practice?1.4:2.25;this.flight=null;this.lastWinner=winner;
    if(!this.practice){this.score[winner]++;this.server=winner;this.serverSlot[winner]=this.receivers[winner];}
    for(const p of this.players){p.pose=p.team===winner?'cheer':'dizzy';p.poseTime=2.4;}
    this.emit('point',{winner,reason,faultTeam:reason==='出界'?this.lastTouch:1-winner,score:[...this.score],practice:this.practice});
  }
  won(){return Math.max(...this.score)>=5&&(Math.abs(this.score[0]-this.score[1])>=2||Math.max(...this.score)>=7);}
  incomingOut(team){
    if(!this.flight||this.flight.kind!=='receive'||this.lastTouch===team)return false;
    const b=this.ball,g=this.flight.g,t=(b.vy+Math.sqrt(b.vy*b.vy+2*g*Math.max(0,b.y-.15-VOLLEY_COURT.ballRadius)))/g;
    return Math.abs(b.x+b.vx*t)>VOLLEY_COURT.halfWidth+VOLLEY_COURT.ballRadius+.2||Math.abs(b.z+b.vz*t)>VOLLEY_COURT.halfLength+VOLLEY_COURT.ballRadius+.2;
  }
  updateAI(dt){
    const f=this.flight;
    for(const p of this.players){
      if(p.human)continue;
      const task=this.task(p.id),side=this.side(p.team);
      if(task==='toss'){if(this.stageTime>.8)this.toss();continue;}
      if(task==='approach'&&this.difficulty==='hard'&&!this.practice&&f&&f.contactTime-f.t<.20&&p.y===0&&p.jumpLock<=0){
        const blocker=this.players[this.blockers[1-p.team]];
        p.quick=true;p.slideVX=Math.abs(blocker.x-p.x)<1.8?(p.x>=0?-4:4):0;
        p.vy=10.5;p.jumpLock=.8;p.jumpKind='spike';p.pose='spikeWind';p.poseTime=1;
      }
      if(f&&f.recipient===p.id){
        if(task==='receive'&&this.incomingOut(p.team)){p.pose='stance';continue;}
        if(f.t>this.config.reaction){p.tx=f.end.x;p.tz=f.end.z+side*.35;}
        if(task==='spike'&&f.contactTime-f.t<.59&&p.y===0&&p.jumpLock<=0){p.vy=10.5;p.jumpLock=.8;p.jumpKind='spike';p.pose='spikeWind';p.poseTime=1;}
        if(task==='serve'&&f.t>=f.contactTime-.02){this.tryContact(p,true);continue;}
        if(task==='receive'&&f.contactTime-f.t<.22)this.tryDive(p);
        if(f.t>=f.contactTime-.012)this.tryContact(p,true);
      }else if(task==='block'&&f&&(f.kind==='set'||f.kind==='spike')){
        const attacker=this.players[f.kind==='set'?this.teammate(f.recipient):f.recipient];
        // Vary reads per attack; delayed, bounded tracking lets quick changes beat the block.
        const read=((f.id*37+p.id*17)%11)/10;
        const reaction=this.config.reaction+.08+read*.16;
        const target=Math.max(-5.5,Math.min(5.5,attacker.x+(p.team===0?-.85:.85)));
        if(f.t>reaction&&p.y<.8)p.tx+=Math.max(-1,Math.min(1,target-p.tx))*dt*(this.difficulty==='hard'?7:this.difficulty==='easy'?4.2:5.5);
        p.tz=side*1.3;
        if(f.kind==='spike'&&f.contactTime-f.t<.38+read*.18&&p.y===0&&p.jumpLock<=0){p.vy=10.5;p.jumpLock=.9;p.jumpKind='block';p.pose='block';p.poseTime=1;}
      }
    }
  }
  updatePlayers(dt){
    for(const p of this.players){
      p.diveTime=Math.max(0,p.diveTime-dt);p.swing=Math.max(0,p.swing-dt);p.jumpLock=Math.max(0,p.jumpLock-dt);p.poseTime=Math.max(0,p.poseTime-dt);
      if(p.vy!==0||p.y>0){p.jumpAge=(p.jumpAge||0)+dt;p.y+=p.vy*dt;p.vy-=19.5*dt;if(p.y<=0){p.y=0;p.vy=0;p.jumpKind=null;p.slideVX=0;}}
      const task=this.task(p.id),side=this.side(p.team);
      const attack=p.human&&task==='spike'&&this.flight?.recipient===p.id;
      if(attack&&!p.attackLocked&&((p.jumpAge||0)>=.27&&p.y>0||this.flight.contactTime-this.flight.t<=.20)){p.attackLocked=true;if(p.attackSteer)p.tx=p.x;}
      const steer=attack&&!p.attackLocked;
      if(p.human){
        if(steer&&Math.abs(p.move)>.02){p.attackSteer=true;p.tx=Math.max(-5.7,Math.min(5.7,p.x+p.move*side*dt*5));}
        if(!steer&&['spike','serve'].includes(task))p.aim=Math.max(-1,Math.min(1,p.aim+p.move*side*dt*1.75));
        else if(p.move){p.offset=Math.max(-5,Math.min(5,p.offset+p.move*side*dt*(['receive','block'].includes(task)?4.2:7)));}
        if(this.flight&&this.flight.recipient===p.id&&!(attack&&p.attackSteer)){p.tx=Math.max(-6.7,Math.min(6.7,this.flight.end.x+(task==='receive'?p.offset*.32:0)));p.tz=this.flight.end.z+side*.35;}
        else if(task==='receive'){p.tx=Math.max(-6.7,Math.min(6.7,p.tx+p.move*side*dt*4.2));}
        else if(task==='block'){p.tx=Math.max(-6.6,Math.min(6.6,p.offset));p.tz=side*1.3;}
        else if(task==='approach'){p.tx=Math.max(-5.7,Math.min(5.7,p.tx+p.move*side*dt*5));p.tz=side*2.1;}
      }
      if(p.human&&task==='receive'&&this.flight?.recipient===p.id&&this.flight.contactTime-this.flight.t<.65&&Math.abs(p.x-this.flight.end.x)<1.3&&Math.abs(p.move)<.35){const assist=1-Math.exp(-dt*5);p.offset*=1-assist;p.tx+=(this.flight.end.x-p.tx)*assist;}
      const dx=p.tx-p.x,dz=p.tz-p.z,distance=Math.hypot(dx,dz),speed=(p.human?10.5:this.config.speed)*(p.diveTime>0?1.65:1);
      const step=Math.min(distance,speed*dt);p.moving=distance>.12;
      if(distance>.001){p.x+=p.slideVX&&p.y>0?Math.sign(p.slideVX)*Math.min(Math.abs(dx),Math.abs(p.slideVX)*dt):dx/distance*step;p.z+=dz/distance*step;}
      if(attack&&p.attackSteer){
        const f=this.flight;if(!p.attackLocked||!f.attackTargetLocked){f.end.x=p.x;f.attackTargetLocked=p.attackLocked;this.ball.vx=(f.end.x-this.ball.x)/Math.max(.05,f.contactTime-f.t);}
      }
      p.x=Math.max(-VOLLEY_COURT.halfWidth-.2,Math.min(VOLLEY_COURT.halfWidth+.2,p.x));p.z=side*Math.max(.7,Math.min(VOLLEY_COURT.halfLength,Math.abs(p.z)));
    }
  }
  update(dt){
    if(this.paused)return;dt=Math.min(dt,.035);this.time+=dt;this.stageTime+=dt;
    if(this.status==='result'){this.updatePlayers(dt);return;}
    if(this.status==='point'){this.pointTime-=dt;this.updatePlayers(dt);if(this.pointTime<=0){if(!this.practice&&this.won()){this.status='result';this.emit('result',{winner:this.lastWinner,score:[...this.score]});}else this.serveReady();}return;}
    this.updateAI(dt);this.updatePlayers(dt);
    if(this.stage==='ready'){
      const p=this.players[this.active];this.ball.x=p.x;this.ball.y=3.4;this.ball.z=p.z-this.side(p.team)*.3;return;
    }
    const f=this.flight;if(!f)return;
    const beforeZ=this.ball.z;f.t+=dt;this.ball.x+=this.ball.vx*dt;this.ball.y+=this.ball.vy*dt-.5*f.g*dt*dt;this.ball.z+=this.ball.vz*dt;this.ball.vy-=f.g*dt;
    for(const p of this.players)if(p.human&&p.swing>0&&this.tryContact(p))return;
    if(f!==this.flight)return;
    if(f.start.z*f.end.z<0&&beforeZ*this.ball.z<=0&&!f.handledNet){
      f.handledNet=true;const receivingTeam=f.team,blocker=this.players[this.blockers[receivingTeam]];
      const reaches=blocker.jumpKind==='block'&&Math.abs(this.ball.x-blocker.x)<1.45&&blocker.y>1.0&&Math.abs(this.ball.y-(4.25+blocker.y))<1.7;
      if(reaches){
        const edge=Math.abs(this.ball.x-blocker.x)/1.45,blockOut=f.power>=3&&edge>.92&&Math.abs(this.ball.vx)>3;
        this.stats.blocks++;blocker.pose='block';blocker.poseTime=.45;this.emit('block',{player:blocker.id,power:f.power,blockOut});
        const strong=f.power>=3,nextTeam=strong?receivingTeam:1-receivingTeam,side=this.side(nextTeam),receiver=this.receivers[nextTeam];
        const start={x:this.ball.x,y:this.ball.y,z:this.side(receivingTeam)*.05};this.lastTouch=receivingTeam;this.strike={grade:'block',color:'#ffffff',combo:this.combo};
        this.sendFlight('receive',nextTeam,receiver,start,blockOut?{x:Math.sign(this.ball.x-blocker.x||blocker.x||1)*9.6,y:.51,z:side*5.8}:{x:Math.max(-VOLLEY_COURT.halfWidth+1,Math.min(VOLLEY_COURT.halfWidth-1,this.ball.x*.55)),y:2.25,z:side*8.4},blockOut?.85:strong?1.5:1.05,12);this.flight.power=0;this.flight.deflection=blockOut?'blockOut':'save';return;
      }
      if(this.ball.y<VOLLEY_COURT.netHeight+VOLLEY_COURT.ballRadius){this.point(receivingTeam,'球沒過網');return;}
    }
    if(this.ball.y<=.15+VOLLEY_COURT.ballRadius){
      const out=Math.abs(this.ball.x)>VOLLEY_COURT.halfWidth+VOLLEY_COURT.ballRadius||Math.abs(this.ball.z)>VOLLEY_COURT.halfLength+VOLLEY_COURT.ballRadius;
      const landedTeam=this.ball.z>=0?0:1;this.ball.y=.15+VOLLEY_COURT.ballRadius;
      this.point(out?1-this.lastTouch:1-landedTeam,out?'出界':'落地得分');return;
    }
    // A serve must be struck on the toss. The ball is allowed to fall visibly.
    if(f.kind==='serve'&&f.t>2.0){this.point(1-f.team,'發球失誤');}
  }
  snapshot(){return {status:this.status,paused:this.paused,stage:this.stage,score:[...this.score],server:this.server,humans:[...this.humans],combo:this.combo,strike:{...this.strike},perfects:this.perfects,touches:this.touches,stats:{...this.stats},ball:{...this.ball},players:this.players.map(p=>({...p,task:this.task(p.id)})),flight:this.flight?{...this.flight}:null};}
}
if(typeof module!=='undefined')module.exports={VolleyMatch,VOLLEY_COURT};
