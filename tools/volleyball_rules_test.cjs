'use strict';
const assert=require('node:assert/strict');const {VolleyMatch,VOLLEY_COURT}=require('../js/volleyball-rules.js');const {VolleyMotionClassifier}=require('../js/volleyball-motion.js');
const step=(m,seconds)=>{for(let t=0;t<seconds;t+=1/120)m.update(1/120);};
// AI should sustain routine rallies; misses cannot come from random coin tosses.
let events=[];let m=new VolleyMatch({onEvent:e=>events.push(e)});m.players.forEach(p=>p.human=false);step(m,45);
assert(m.stats.aiContacts>=30);assert(!events.some(e=>e.type==='point'&&e.reason==='發球失誤'));assert.equal(m.stats.aiRoutineMisses,0);
// Local players are fixed avatars, including same-team and opposite-team views.
for(const [mode,ids]of Object.entries({solo:[0],coop:[0,1],versus:[0,2],four:[0,1,2,3]}))assert.deepEqual(new VolleyMatch({mode}).humans,ids);
// A real player who does nothing loses only after the tossed ball falls.
m=new VolleyMatch();m.input(0,'hit');assert.equal(m.stage,'serve');assert.deepEqual(m.score,[0,0]);step(m,3);assert.deepEqual(m.score,[0,1]);
// Jump is a separate ballistic action with an apex and landing.
m=new VolleyMatch();m.input(0,'jump');step(m,.5);assert(m.players[0].y>2.4);step(m,.8);assert.equal(m.players[0].y,0);
// Pause stops positions, scores and ball; motion input cannot advance it.
m=new VolleyMatch();m.input(0,'hit');step(m,.3);m.paused=true;const before=m.snapshot();m.input(0,'jump');step(m,3);assert.deepEqual(m.snapshot(),before);
// A receive has a physical hand contact, an AI set, then a separate jump/spike.
events=[];m=new VolleyMatch({practice:true,onEvent:e=>events.push(e)});
for(let i=0;i<120*22;i++){
 const f=m.flight,p=m.players[0],task=m.task(0);
 if(f?.recipient===0&&f.kind==='spike'&&f.contactTime-f.t<.57&&p.y===0)m.input(0,'jump');
 if(f?.recipient===0&&Math.abs(f.contactTime-f.t)<.012)m.input(0,'hit');
 m.update(1/120);
}
assert(events.some(e=>e.type==='contact'&&e.player===0&&e.kind==='receive'));
assert(events.some(e=>e.type==='contact'&&e.player===1&&e.kind==='set'));
assert(events.some(e=>e.type==='contact'&&e.player===0&&e.kind==='spike'));
assert.deepEqual(m.score,[0,0]);
// Floor in, floor out and net are spatial outcomes, not a phase timeout.
m=new VolleyMatch();m.stage='receive';m.lastTouch=0;m.sendFlight('receive',1,2,{x:3,y:.4,z:-9},{x:3,y:.1,z:-9},.1,10);step(m,.2);assert.deepEqual(m.score,[1,0]);
m=new VolleyMatch();m.stage='receive';m.lastTouch=0;m.sendFlight('receive',1,2,{x:8.5,y:.4,z:-9},{x:8.5,y:.1,z:-9},.1,10);step(m,.2);assert.deepEqual(m.score,[0,1]);
// A deeper 1:2 court must use matching physical end lines, including ball radius.
assert.equal(VOLLEY_COURT.halfLength/VOLLEY_COURT.halfWidth,2);
for(const [z,winner]of [[VOLLEY_COURT.halfLength-.1,0],[VOLLEY_COURT.halfLength+.5,1]]){
 m=new VolleyMatch();m.stage='receive';m.lastTouch=0;m.sendFlight('receive',1,2,{x:0,y:.55,z:-z},{x:0,y:.1,z:-z},.1,10);step(m,.2);assert.equal(m.score[winner],1);assert.equal(m.ball.y,.15+VOLLEY_COURT.ballRadius);
}
m=new VolleyMatch();m.sendFlight('receive',1,2,{x:5,y:2,z:.2},{x:5,y:2,z:-3},.3,4);step(m,.04);assert.deepEqual(m.score,[0,1]);assert.equal(m.reason,'球沒過網');
// Block contact checks the blocker's actual x and airborne hand height.
m=new VolleyMatch();m.blockers[1]=3;Object.assign(m.players[3],{x:0,tx:0,z:-1.1,tz:-1.1,y:2.4,vy:0,jumpKind:'block'});m.sendFlight('receive',1,2,{x:0,y:6.4,z:.1},{x:0,y:2.25,z:-8},1,4);m.flight.power=1;step(m,.03);assert.equal(m.stats.blocks,1);assert.equal(m.flight.team,0);
m=new VolleyMatch();m.blockers[1]=3;Object.assign(m.players[3],{x:0,tx:0,z:-1.1,tz:-1.1,y:2.4,vy:0,jumpKind:'block'});m.sendFlight('receive',1,2,{x:0,y:6.4,z:.1},{x:0,y:2.25,z:-8},1,4);m.flight.power=3;step(m,.03);assert.equal(m.stats.blocks,1);assert.equal(m.flight.team,1);
// 5:4 continues, 6:4 finishes, 7:6 is the cap.
m=new VolleyMatch();m.score=[5,4];assert(!m.won());m.score=[6,4];assert(m.won());m.score=[6,6];assert(!m.won());m.score=[7,6];assert(m.won());
// Motion: calibration, orientation-independent up/down, cooldown and no idle triggers.
const sensor=(a,rotation=0,axis='y')=>({accelerationIncludingGravity:{x:axis==='x'?9.81+a:0,y:axis==='y'?9.81+a:0,z:0},acceleration:{x:axis==='x'?a:0,y:axis==='y'?a:0,z:0},rotationRate:{alpha:rotation,beta:0,gamma:0}});
let c=new VolleyMotionClassifier();c.calibrate();for(let i=0;i<25;i++)c.sample(sensor(0),i*20);assert(!c.calibrating);for(let i=0;i<50;i++)assert.equal(c.sample(sensor(.1),600+i*20).gesture,null);
c.sample(sensor(6),2000);assert.equal(c.sample(sensor(6),2020).gesture,'up');assert.equal(c.sample(sensor(-10,180),2100).gesture,null);c.sample(sensor(-10,180),2500);assert.equal(c.sample(sensor(-10,180),2520).gesture,'down');
c=new VolleyMotionClassifier();c.calibrate();for(let i=0;i<25;i++)c.sample(sensor(0,0,'x'),i*20);c.sample(sensor(6,0,'x'),1000);assert.equal(c.sample(sensor(6,0,'x'),1020).gesture,'up');
console.log('PASS: AI rallies, fixed player roles, physical jumps/contacts/floor/net/blocks, scoring, pause and calibrated motion traces.');
// Reference iteration: a lateral pre-set jump travels physically to a quick slide attack.
for(const [team,id,setter]of [[0,0,1],[1,2,3]]){
 m=new VolleyMatch({mode:'four'});const side=m.side(team);
 Object.assign(m.players[id],{x:0,tx:0,z:side*2.1,tz:side*2.1});
 Object.assign(m.players[setter],{x:-1,tx:-1,z:side*5.6,tz:side*5.6});
 m.sendFlight('set',team,setter,{x:-1,y:4.25,z:side*5.25},{x:-1,y:4.25,z:side*5.25},.18,12);
 m.input(id,'move',1);m.input(id,'jump');assert(m.players[id].quick);assert.equal(Math.sign(m.players[id].slideVX),side);
 step(m,.18);m.input(setter,'hit');assert.equal(m.flight.attack,'slide');assert.equal(m.flight.contactTime,.62);
 m.input(id,'move',0);step(m,.61);m.input(id,'hit');assert.equal(m.flight.kind,'receive');assert.equal(m.lastTouch,team);assert(Math.abs(m.players[id].x)>1.8);
}
// A diving receive must cover real distance before it can make contact.
m=new VolleyMatch({mode:'four'});Object.assign(m.players[0],{x:-2.4,tx:-2.4,z:9.8,tz:9.8});
m.sendFlight('receive',0,0,{x:0,y:2.7,z:9.45},{x:0,y:2.25,z:9.45},.12,12);m.input(0,'hit');assert(m.players[0].diveTime>0);step(m,.13);assert.equal(m.flight.kind,'set');assert(m.players[0].x>-2);
// A strong hit on the edge of a block can deflect out; the blocker is last touch.
m=new VolleyMatch({mode:'four'});Object.assign(m.players[3],{x:0,tx:0,z:-1.3,tz:-1.3,y:2.4,vy:0,jumpKind:'block'});
m.sendFlight('receive',1,2,{x:1.1,y:6.4,z:.1},{x:1.1,y:2.25,z:-10},1,4);m.flight.power=3;step(m,.03);assert.equal(m.flight.deflection,'save');assert.equal(m.lastTouch,1);assert(m.flight.end.x<VOLLEY_COURT.halfWidth);assert(m.stats.blocks===1);
// Badly timed edge aiming produces an actual out trajectory, not a forced score.
m=new VolleyMatch({mode:'four',difficulty:'easy'});Object.assign(m.players[0],{x:0,tx:0,z:2.1,tz:2.1,y:2.5,aim:1});
m.sendFlight('spike',0,0,{x:0,y:6.7,z:1.75},{x:0,y:6.7,z:1.75},.1,12);m.contact(m.players[0],'weak',.31);assert(m.flight.end.x<VOLLEY_COURT.halfWidth);assert(m.flight.contactTime>=1.8);assert.equal(m.flight.grade,'weak');assert.deepEqual(m.score,[0,0]);
const {VolleyReplay}=require('../js/volleyball-replay.js');
const replay=new VolleyReplay();const state=(time,x)=>({time,combo:0,ball:{x,y:2,z:0},players:[{x,y:0,z:1}],flight:null});
for(let i=0;i<150;i++)replay.record(state(i/30,i/30));assert(replay.frames.length<=120);
assert(replay.begin(state(5,5)));const live=state(5,5),copy=JSON.stringify(live);replay.tick(.31);assert(replay.playing);replay.tick(.25);const frame=replay.sample();assert(frame.ball.x>3&&frame.ball.x<5);assert.equal(JSON.stringify(live),copy);replay.stop();assert(!replay.active);
console.log('PASS: mirrored slide/quick attacks, physical diving saves, block-out ownership, out trajectories and bounded read-only replay.');
// Receivers can pre-position before a serve or while opponents build an attack.
for(const team of [0,1]){
 m=new VolleyMatch({mode:'four'});m.server=1-team;m.serveReady();const id=m.receivers[team],p=m.players[id],side=m.side(team),x=p.x,z=p.z;
 assert.equal(m.task(id),'receive');m.input(id,'move',1);step(m,.4);assert((p.x-x)*side>1.3&&(p.x-x)*side<2);assert.equal(p.z,z);
 m.input(id,'move',0);step(m,.1);const stopped=p.x;step(m,.3);assert.equal(p.x,stopped);
 m.input(id,'move',-1);step(m,.6);assert((p.x-stopped)*side< -2);
 step(m,4);assert(p.x>=-6.7&&p.x<=6.7);
 const held=p.x;m.paused=true;step(m,.4);assert.equal(p.x,held);
 m.paused=false;m.input(id,'move',0);m.sendFlight('set',1-team,m.teammate(m.receivers[1-team]),{x:0,y:4.25,z:-side*5.25},{x:0,y:4.25,z:-side*5.25},1.2,12);
 assert.equal(m.task(id),'receive');const during=p.x;m.input(id,'move',1);step(m,.3);assert((p.x-during)*side>.8);
}
console.log('PASS: pre-receive movement before serves and opponent sets, mirrored controls, stop, bounds and pause.');
// One phone action is resolved from authoritative match state (not a stale phone label).
m=new VolleyMatch();m.input(0,'action');assert.equal(m.flight.kind,'serve');step(m,.59);m.input(0,'action');assert.equal(m.flight.kind,'receive');
m=new VolleyMatch({mode:'four'});assert.equal(m.task(3),'block');m.input(3,'action');assert.equal(m.players[3].jumpKind,'block');
m=new VolleyMatch({practice:true});let contextContacts=0;const notify=m.onEvent;m.onEvent=e=>{if(e.type==='contact'&&e.player===0)contextContacts++;notify(e);};
for(let t=0;t<18;t+=1/120){const f=m.flight,p=m.players[0];if(f?.recipient===0){if(f.kind==='spike'&&f.contactTime-f.t<.57&&p.y===0)m.input(0,'action');if(Math.abs(f.contactTime-f.t)<.012)m.input(0,'action');}m.update(1/120);}
assert(contextContacts>=3);console.log('PASS: contextual action serves, receives, jumps, spikes and blocks from live state.');

// Mirrored direct-out attacks: the receiving AI lets an untouched out ball land.
for(const attacker of [0,1]){
 const ev=[];const game=new VolleyMatch({mode:'solo',onEvent:e=>ev.push(e)});game.players.forEach(p=>p.human=false);game.lastTouch=attacker;
 const defending=1-attacker,side=game.side(defending);
 game.sendFlight('receive',defending,game.receivers[defending],{x:6,y:3,z:side*8},{x:8.8,y:2.25,z:side*10},.4,12);
 step(game,1);assert.equal(game.reason,'出界');assert.equal(game.score[defending],1);assert.equal(game.lastTouch,attacker);assert.equal(ev.find(e=>e.type==='point').faultTeam,attacker);
 // The next server owns an untouched toss, independent of the previous contact.
 game.lastTouch=1-defending;game.server=defending;game.serveReady();assert.equal(game.lastTouch,defending);
}
console.log('PASS: both teams direct-out scoring, AI leaves out balls, and next-serve ownership reset');

// The expanded strip is now in on either side; beyond the new boundary remains out.
for(const team of [0,1])for(const [x,z,out]of [[7.5,9,false],[0,15,false],[8.2,9,true],[0,16,true]]){const m=new VolleyMatch({mode:'four'});m.lastTouch=team;m.sendFlight('receive',1-team,(1-team)*2,{x,y:.4,z:m.side(1-team)*z},{x,y:.1,z:m.side(1-team)*z},.1,10);step(m,.2);assert.equal(m.reason,out?'出界':'落地得分');assert.equal(m.score[out?1-team:team],1);}
console.log('PASS expanded court: newly in-bounds strips and true out balls, both teams');

// Forgiving human spikes: broad timing/position/height, with timing affecting speed.
function spikeAt(delta){const game=new VolleyMatch({mode:'four'}),p=game.players[0];Object.assign(p,{x:0,z:2.1,y:1.4,tx:0,tz:2.1});game.sendFlight('spike',0,0,{x:2.9,y:7.3,z:1.75},{x:2.9,y:7.3,z:1.75},.6,12);game.flight.t=.6+delta;assert(game.tryContact(p));return game;}
const sharp=spikeAt(0),late=spikeAt(.4);assert(sharp.flight.contactTime<late.flight.contactTime);assert.equal(late.flight.grade,'weak');assert(late.ball.vy>sharp.ball.vy);
// A good receive starts NICE; a decent set continues to GOOD; the spike reaches SUPER.
let grades=[];m=new VolleyMatch({mode:'four',onEvent:e=>{if(e.type==='contact')grades.push(e.grade);}});
m.sendFlight('receive',0,0,{x:0,y:2.25,z:9},{x:0,y:2.25,z:9},.1,12);m.contact(m.players[0],'nice',0);m.contact(m.players[1],'good',.2);m.contact(m.players[0],'nice',0);assert.deepEqual(grades,['nice','good','super']);assert.equal(m.flight.power,3);assert.equal(m.flight.color,'#d74dff');
// A block does not advance the quality chain, and the usual off-center block stays in.
m=new VolleyMatch({mode:'four'});m.combo=2;Object.assign(m.players[3],{x:0,tx:0,z:-1.3,tz:-1.3,y:2.4,vy:0,jumpKind:'block'});m.sendFlight('receive',1,2,{x:1.1,y:6.4,z:.1},{x:1.1,y:2.25,z:-10},1,4);m.flight.power=3;step(m,.03);assert.equal(m.combo,2);assert.equal(m.flight.grade,'block');assert.equal(m.flight.deflection,'save');
console.log('PASS forgiving spikes, timing-based speed, weak lobs, NICE/GOOD/SUPER chain, and safer non-scoring blocks');

// Phone grip can change from upright to flat, including screen-down overhead sets.
for(const gravity of [{x:0,y:0,z:9.81},{x:0,y:0,z:-9.81}]){const c=new VolleyMotionClassifier();const axis=gravity.z>0?1:-1;const pulse=(vertical,x=0)=>({accelerationIncludingGravity:{x,y:0,z:gravity.z+vertical*axis},acceleration:{x,y:0,z:vertical*axis},rotationRate:{alpha:160}});for(let i=0;i<8;i++)c.sample(pulse(0),i*20);c.sample(pulse(7),1000);assert.equal(c.sample(pulse(7),1020).gesture,'up');c.sample(pulse(-10,7),1400);const hit=c.sample(pulse(-10,7),1420);assert.equal(hit.gesture,'down');assert(hit.aim>.5);}
for(const team of [0,1]){const m=new VolleyMatch({mode:'four'}),p=m.players[team*2];m.sendFlight('spike',team,p.id,{x:0,y:6,z:2*m.side(team)},{x:0,y:6,z:2*m.side(team)},1,12);for(const direction of [-1,0,1]){m.input(p.id,'aim',direction);assert.equal(p.aim,direction*m.side(team));}}
console.log('PASS flat/screen-down up/down gestures, directional swing aim and mirrored targeting');

// Imperfect follow-up contacts lower a built chain by at most one level.
for(const [initial,expected,grade]of [[1,0,'normal'],[2,1,'nice'],[3,2,'good']]){const g=new VolleyMatch({mode:'four'});g.combo=initial;g.sendFlight('spike',0,0,{x:0,y:6,z:1.75},{x:0,y:6,z:1.75},.1,12);g.contact(g.players[0],'weak',.4);assert.equal(g.combo,expected);assert.equal(g.flight.grade,grade);}
console.log('PASS poor follow-up timing drops at most one grade');

// Set follows manual approach and early jump; late ascent fixes the contact point.
for(const team of [0,1]){const g=new VolleyMatch({mode:'four'}),p=g.players[team*2],side=g.side(team);Object.assign(p,{x:0,tx:0,z:side*2.1,tz:side*2.1});g.sendFlight('spike',team,p.id,{x:0,y:5,z:side*1.75},{x:0,y:6.7,z:side*1.75},1.28,12);g.input(p.id,'move',1);const bx=g.ball.x;g.updatePlayers(.05);assert.equal(g.ball.x,bx);assert(p.x*side>0);assert.equal(g.flight.end.x,p.x);g.input(p.id,'jump');for(let i=0;i<20;i++)g.updatePlayers(.01);const early=p.x;assert(early*side>.5);for(let i=0;i<10;i++)g.updatePlayers(.01);const locked=p.x,target=g.flight.end.x;for(let i=0;i<15;i++)g.updatePlayers(.01);assert.equal(p.x,locked);assert.equal(g.flight.end.x,target);assert(p.attackLocked);}
console.log('PASS mirrored set tracking, early jump movement, continuous ball position and late ascent lock');
