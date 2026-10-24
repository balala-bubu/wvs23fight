/* Separate, optional phone-controller room. Reuses PeerJS's signaling service,
 * not the brawl protocol or engine. Lobby selections and input use a data channel;
 * remote rooms optionally stream the host canvas. */
'use strict';
class VolleyNetwork{
  static loaded=new Map();
  static script(path){if(!this.loaded.has(path))this.loaded.set(path,new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=path+'?v=20261023-volley2';s.onload=resolve;s.onerror=()=>reject(new Error('無法載入手機連線元件，請稍後重試。'));document.body.appendChild(s);}));return this.loaded.get(path);}
  static async peerLibrary(){if(!window.Peer)await this.script('js/vendor/peerjs-1.5.4.min.js');}
  constructor({getState,getRoster=()=>[],onSelection=()=>{},onResult=()=>{},input,onDisconnect}){
    this.getState=getState;this.getRoster=getRoster;this.onSelection=onSelection;this.onResult=onResult;this.input=input;this.onDisconnect=onDisconnect;this.peer=null;this.room='';this.clients=new Map();this.lastBroadcast=0;this.seats=[0];this.names=[];this.remote=false;this.calls=new Map();
    const $=id=>document.getElementById(id);$('roomClose').onclick=()=>{$('roomModal').hidden=true;};$('createRoom').onclick=()=>this.openHost();$('closeRoom').onclick=()=>this.close();$('copyRoom').onclick=async()=>{try{await navigator.clipboard.writeText(this.joinURL());$('roomStatus').textContent='已複製加入連結';}catch(_){$('roomStatus').textContent=this.joinURL();}};
    $('roomConnectionMode').onclick=e=>{const b=e.target.closest('[data-remote]');if(b)this.setRemote(b.dataset.remote==='true');};
    $('joinCode').onkeydown=e=>{if(e.key==='Enter')$('connectRoom').click();};$('connectRoom').onclick=()=>{const code=$('joinCode').value.trim();if(!/^\d{6}$/.test(code)){$('joinCode').setCustomValidity('請輸入 6 位數字房號');$('joinCode').reportValidity();return;}location.href=this.joinURL(code);};$('joinCode').oninput=()=>{$('joinCode').setCustomValidity('');};addEventListener('pagehide',()=>this.close());
  }
  setRemote(remote){
    if(this.peer&&this.remote!==remote)this.close();this.remote=remote;
    document.querySelectorAll('#roomConnectionMode button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.remote==='true')===remote)));
    document.getElementById('roomModeDescription').textContent=remote?'你當 P1。朋友掃碼加入，各自在手機看自己的畫面、用觸控操作自己的角色。':'這台當大螢幕，朋友拿手機當手把。';this.renderSeats();
  }
  /* Each remote phone gets its own video: the host renders only that player's camera into a
   * private canvas (see renderRemoteViews in volleyball.js) instead of sharing the whole split screen. */
  static streamSize(aspect){const long=880;const w=aspect>=1?long:Math.round(long*aspect),h=aspect>=1?Math.round(long/aspect):long;return [w&~1,h&~1];}
  static clampAspect(value){const a=Number(value);return Number.isFinite(a)?Math.max(.45,Math.min(2.4,a)):16/9;}
  resizeStream(client){
    if(!client.stream)return;const [w,h]=VolleyNetwork.streamSize(client.aspect);
    if(client.stream.canvas.width!==w||client.stream.canvas.height!==h){client.stream.canvas.width=w;client.stream.canvas.height=h;}
  }
  streamTo(client){
    if(!this.remote||this.calls.has(client.connection.peer))return;
    try{
      if(!client.stream){const canvas=document.createElement('canvas');client.stream={canvas,ctx:canvas.getContext('2d',{alpha:false}),media:null};this.resizeStream(client);client.stream.ctx.fillStyle='#111';client.stream.ctx.fillRect(0,0,canvas.width,canvas.height);client.stream.media=canvas.captureStream(30);}
      const call=this.peer.call(client.connection.peer,client.stream.media);if(call){this.calls.set(client.connection.peer,call);call.on('close',()=>this.calls.delete(client.connection.peer));}
    }catch(_){document.getElementById('roomStatus').textContent='此瀏覽器無法傳送畫面，請改用 Chrome，或選在同一個地方。';}
  }
  /* The private canvas for a connected remote player, or null when that seat is a plain controller. */
  remoteTarget(id){if(!this.remote)return null;for(const c of this.clients.values())if(c.id===id&&c.connection.open&&c.stream)return c.stream;return null;}
  hasVideo(id){if(!this.remote)return false;for(const c of this.clients.values())if(c.id===id&&c.connection.open)return true;return false;}
  get connectedCount(){return this.clients.size;}
  isRemote(id){return [...this.clients.values()].some(c=>c.id===id&&c.connection.open);}
  joinURL(code=this.room){const url=new URL('volleyball.html',location.href);url.search='pad='+code;return url.href;}
  async openHost(){
    const $=id=>document.getElementById(id);if(this.peer){$('roomInfo').hidden=false;return;}$('createRoom').disabled=true;$('lobbyRoomCode').textContent='連線中…';$('lobbyRoomStatus').textContent='正在建立房間';$('lobbyRoomRetry').hidden=true;$('createRoom').textContent='正在建立房間…';
    try{
      await VolleyNetwork.peerLibrary();await VolleyNetwork.script('js/qrcode.js');this.room=String(100000+Math.floor(Math.random()*900000));
      const peer=new Peer('wvs-volley-v2-'+this.room,{debug:0});this.peer=peer;
      const timer=setTimeout(()=>{if(!peer.open){$('roomStatus').textContent='配對服務連線逾時，請關閉房間後重試。';$('roomInfo').hidden=false;$('lobbyRoomCode').textContent='尚未連線';$('lobbyRoomStatus').textContent=$('roomStatus').textContent;$('lobbyRoomRetry').hidden=false;}},12000);
      peer.on('open',()=>{clearTimeout(timer);$('roomInfo').hidden=false;$('createRoom').hidden=true;$('roomCode').textContent=this.room;$('lobbyRoomCode').textContent=this.room;$('lobbyRoomStatus').textContent='手機掃碼或輸入房號加入，選角後選造型';$('roomStatus').textContent='手機掃碼後，選擇動作或觸控手把';const qr=qrcode(0,'M');qr.addData(this.joinURL());qr.make();$('roomQR').innerHTML=qr.createImgTag(5,10);$('lobbyRoomQR').innerHTML=qr.createImgTag(3,4);this.renderSeats();});
      peer.on('connection',conn=>this.accept(conn));peer.on('error',error=>{$('roomInfo').hidden=false;$('roomStatus').textContent=error.type==='unavailable-id'?'房號被使用，請關閉後重新開房。':'連線失敗：'+error.type+'。可嘗試切換 Wi-Fi／手機熱點。';$('createRoom').disabled=false;$('lobbyRoomCode').textContent='連線失敗';$('lobbyRoomStatus').textContent=$('roomStatus').textContent;$('lobbyRoomRetry').hidden=false;});
    }catch(error){$('createRoom').disabled=false;$('createRoom').textContent=error.message;$('lobbyRoomCode').textContent='連線失敗';$('lobbyRoomStatus').textContent=error.message;$('lobbyRoomRetry').hidden=false;}
  }
  updateSeats(ids,names){this.seats=[...ids];this.names=[...names];const available=this.remote?ids.slice(1):ids;let i=0;for(const client of this.clients.values()){const id=available[i++];if(id===undefined){client.connection.send({type:'full',message:'模式已變更，請選擇可容納更多人的模式後重新加入。'});client.connection.close();continue;}client.id=id;this.assign(client);}this.renderSeats();}
  assign(client){client.connection.send({type:'assign',id:client.id,number:this.seats.indexOf(client.id)+1,name:this.names[client.id]||'球員',room:this.room,remote:this.remote});if(!client.catalogSent){client.connection.send({type:'roster',characters:this.getRoster()});client.catalogSent=true;}}
  renderSeats(){const box=document.getElementById('roomSeats');if(!box)return;box.replaceChildren();for(const [i,id]of this.seats.entries()){const client=[...this.clients.values()].find(c=>c.id===id);const s=document.createElement('span');s.className='seat'+(client?' connected':'');s.textContent='P'+(i+1)+' '+(this.remote&&i===0?'主機':client?(client.ready?'已準備':'已連線'):'等待手機');box.appendChild(s);}document.getElementById('lobbyRoomSeats').replaceChildren(...[...box.children].map(el=>el.cloneNode(true)));}
  accept(conn){
    let client=null;
    conn.on('open',()=>{const used=new Set([...this.clients.values()].map(c=>c.id)),id=this.seats.find((id,i)=>!(this.remote&&i===0)&&!used.has(id));if(id===undefined){conn.send({type:'full',message:'目前模式的真人席位已滿。請在大螢幕改成雙人或四人模式。'});setTimeout(()=>conn.close(),1000);return;}
      client={connection:conn,id,aspect:16/9,stream:null,ready:false,lastSeq:-1,lastInput:0,inputs:0,lastSeen:performance.now()};this.clients.set(conn.peer,client);this.assign(client);this.streamTo(client);this.renderSeats();});
    conn.on('data',data=>{if(!client||!data||typeof data!=='object')return;client.lastSeen=performance.now();
      if(data.type==='selection'){const now=performance.now();if(now-(client.lastSelection||0)<80)return;client.lastSelection=now;this.onSelection(client.id,data);return;}
      if(data.type==='readyForVideo'||data.type==='view'){client.aspect=VolleyNetwork.clampAspect(data.aspect);this.resizeStream(client);if(data.type==='readyForVideo')this.streamTo(client);return;}
      if(data.type==='result'&&this.remote&&['again','change'].includes(data.action)){this.onResult(data.action);return;}
      if(data.type==='ping'){conn.send({type:'pong',at:data.at});return;}
      if(data.type==='ready'){client.ready=!!data.value;this.renderSeats();return;}
      if(data.type!=='input'||!Number.isSafeInteger(data.seq)||data.seq<=client.lastSeq)return;
      const now=performance.now();if(now-client.lastInput>1000){client.inputs=0;client.lastInput=now;}if(++client.inputs>45)return;client.lastSeq=data.seq;
      if(!['hit','jump','move','aim','aimDepth','action'].includes(data.action))return;const value=['move','aim','aimDepth'].includes(data.action)?Math.max(-1,Math.min(1,Number(data.value)||0)):0;this.input(client.id,data.action,value);
    });
    const lost=()=>{if(!client||!this.clients.has(conn.peer))return;this.input(client.id,'move',0);this.clients.delete(conn.peer);this.calls.get(conn.peer)?.close();this.calls.delete(conn.peer);client.stream?.media?.getTracks().forEach(t=>t.stop());this.renderSeats();document.getElementById('roomStatus').textContent='P'+(this.seats.indexOf(client.id)+1)+' 已離線，遊戲已暫停。';this.onDisconnect(client.id);};conn.on('close',lost);conn.on('error',lost);
  }
  broadcast(){const now=performance.now();if(!this.clients.size||now-this.lastBroadcast<80)return;this.lastBroadcast=now;const s=this.getState();
    for(const c of this.clients.values())if(c.connection.open){if(now-c.lastSeen>12000){c.connection.close();continue;}const p=s.players?.[c.id],task=p?.task||'wait';c.connection.send({type:'state',task,screen:s.screen,status:s.status||'setup',paused:!!s.paused,score:s.score||[0,0],remaining:s.flight?.recipient===c.id?s.flight.contactTime-s.flight.t:null,airborne:(p?.y||0)>.5,stage:s.stage,combo:s.combo||0,pointer:s.pointers?.[c.id]||null,lobby:s.screen==='setup'?s.lobby:null});}
  }
  feedback(id,text,vibration,color){const c=[...this.clients.values()].find(c=>c.id===id);if(c?.connection.open)c.connection.send({type:'feedback',text,vibration,color});}
  close(){for(const c of this.clients.values()){c.stream?.media?.getTracks().forEach(t=>t.stop());c.stream=null;c.connection.close();}this.clients.clear();for(const call of this.calls.values())call.close();this.calls.clear();this.peer?.destroy();this.peer=null;this.room='';const $=id=>document.getElementById(id);$('lobbyRoomCode').textContent='尚未開房';$('lobbyRoomStatus').textContent='房間已關閉，可重新建立';$('lobbyRoomQR').replaceChildren();$('lobbyRoomRetry').hidden=false;if($('roomInfo')){$('roomInfo').hidden=true;$('createRoom').hidden=false;$('createRoom').disabled=false;$('createRoom').textContent='建立手機手把房間';this.renderSeats();}}
  static async phone(room){
    const $=id=>document.getElementById(id);document.body.classList.add('phoneMode');$('nav').hidden=true;$('court').hidden=true;$('phone').hidden=false;$('loading').hidden=true;
    let peer,connection,seat=null,seq=0,padMode='touch',state={task:'wait'},move=0,lastMove=0,ready=false,wake=null,drill=null;
    function send(action,value=0){if(!connection?.open)return;connection.send({type:'input',action,value,seq:++seq});if(action!=='move'){try{navigator.vibrate?.(15);}catch(_){}}}
    let manualPointer=null,manualControl=null,moveTimer=null,lastDepthAt=0,tiltArmed=true;
    const stick=$('padStick');
    // Safari may zoom on repeated taps or multi-touch unless native gestures are cancelled.
    const deck=document.querySelector('.phoneControlDeck'),deckHome=deck.parentNode,deckAnchor=deck.nextSibling;let lobbyMoveAt=0;
    for(const type of ['gesturestart','gesturechange','gestureend'])deck.addEventListener(type,e=>e.preventDefault(),{passive:false});
    deck.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});deck.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});deck.addEventListener('dblclick',e=>e.preventDefault());

    function outputMove(value,force=false){
      move=Math.round(Math.max(-1,Math.min(1,value))*100)/100;clearTimeout(moveTimer);moveTimer=null;
      const now=performance.now();
      if(state.screen==='setup'&&state.lobby?.step==='lineup'){
        if(Math.abs(move)>.4&&now-lobbyMoveAt>240){lobbyMoveAt=now;const slot=state.lobby.slots?.[seat?.id],char=catalog.find(c=>c.kind===slot?.kind);if(slot&&!slot.ready&&char){if(slot.stage)pick('skin',{skin:(slot.skin+(move>0?1:-1)+char.skins.length)%char.skins.length});else{const i=catalog.indexOf(char);pick('character',{kind:catalog[(i+(move>0?1:-1)+catalog.length)%catalog.length].kind});}}}return;
      }
      if(force||move===0||now-lastMove>=50){send('move',move);lastMove=now;}
      else moveTimer=setTimeout(()=>{send('move',move);lastMove=performance.now();moveTimer=null;},50-(now-lastMove));
    }
    function stopMove(e){
      if(e&&e.pointerId!==manualPointer)return;
      manualPointer=null;manualControl=null;tiltArmed=false;
      stick.classList.remove('active');stick.style.setProperty('--stick-x','0px');stick.style.setProperty('--stick-y','0px');
      stick.setAttribute('aria-valuenow','0');stick.setAttribute('aria-valuetext','停止');outputMove(0,true);send('aimDepth',0);
    }
    function beginMove(e,control){
      if(manualPointer!==null||e.button!==0)return false;
      e.preventDefault();manualPointer=e.pointerId;manualControl=control;tiltArmed=false;control.setPointerCapture(e.pointerId);return true;
    }
    function dragStick(e,force=false){
      if(e.pointerId!==manualPointer||manualControl!==stick)return;e.preventDefault();
      const r=stick.getBoundingClientRect(),radius=(r.width-$('padStickKnob').getBoundingClientRect().width)/2-4;
      let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const distance=Math.hypot(x,y);
      if(distance>radius){x*=radius/distance;y*=radius/distance;}
      const axis=x/radius,value=Math.abs(axis)<.12?0:Math.sign(axis)*(Math.abs(axis)-.12)/.88;
      stick.style.setProperty('--stick-x',x+'px');stick.style.setProperty('--stick-y',y+'px');stick.setAttribute('aria-valuenow',String(Math.round(value*100)));
      stick.setAttribute('aria-valuetext',value===0?'停止':(value<0?'向左 ':'向右 ')+Math.round(Math.abs(value)*100)+'%');outputMove(value,force);if(force||performance.now()-lastDepthAt>=60){send('aimDepth',Math.abs(y/radius)<.12?0:y/radius);lastDepthAt=performance.now();}
    }
    stick.onpointerdown=e=>{if(beginMove(e,stick)){stick.classList.add('active');dragStick(e,true);}};
    stick.onpointermove=e=>dragStick(e);stick.onpointerup=stopMove;stick.onpointercancel=stopMove;stick.onlostpointercapture=stopMove;
    stick.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','Escape'].includes(e.key))return;e.preventDefault();if(['Home','Escape'].includes(e.key)){stopMove();return;}if(manualPointer!==null&&manualPointer!=='keyboard')return;manualPointer='keyboard';manualControl=stick;tiltArmed=false;stick.classList.add('active');const axis=e.key==='ArrowLeft'?-1:1;stick.style.setProperty('--stick-x',axis*33+'px');stick.setAttribute('aria-valuenow',String(axis*100));stick.setAttribute('aria-valuetext',axis<0?'向左 100%':'向右 100%');outputMove(axis,true);};
    stick.onkeyup=e=>{if(manualPointer==='keyboard'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();stopMove();}};
    stick.onblur=()=>{if(manualControl===stick)stopMove();};
    const actionIcons={receive:'◉',set:'↥',toss:'↑',serve:'↘',approach:'↟',spike:'↘',block:'⊓',wait:'·',cover:'·'};
    function updateAction(){
      const task=state.task,airborne=state.airborne,busy=state.paused||state.screen==='setup'||state.status!=='play'||drill!==null;
      const selecting=state.screen==='setup'&&state.lobby?.step==='lineup';
      const jumping=task==='approach'||(['spike','serve'].includes(task)&&!airborne);
      const text=drill!==null?(drill==='done'?'先按準備':'手勢練習'):busy?(state.paused?'已暫停':'等待開賽'):task==='block'?(airborne?'攔網中':'起跳攔網'):jumping?(airborne?'等待扣球':'起跳'):({receive:'接球',set:'托球',toss:'拋球',serve:'發球',spike:'扣球',cover:'等待隊友',wait:'準備就位'}[task]||'準備');
      $('padActionLabel').textContent=text;$('padActionIcon').textContent=jumping?'↟':actionIcons[task]||'·';
      $('padAction').disabled=!!busy||['cover','wait'].includes(task)||((task==='approach'||task==='block')&&airborne);
      $('padAction').dataset.kind=jumping?'jump':task;
      $('padActionHint').textContent=busy?'看大螢幕，等候開始':task==='spike'&&airborne?'球到手邊，再按一次':jumping?'按下起跳，空中再按扣球':task==='block'?'對手扣球時按下':task==='receive'?'球到手臂時按下':task==='set'?'球到頭頂時按下':task==='toss'?'按下把球拋起':task==='serve'?'球到高點時按下':'讓隊友完成動作';
      if(selecting){$('padActionLabel').textContent='決定';$('padAction').disabled=!!state.lobby.slots?.[seat?.id]?.ready;$('padActionHint').textContent='搖桿左右選擇，按下決定';}
      $('padAction').setAttribute('aria-label',selecting?'決定':text);$('phoneReady').hidden=state.screen==='play'&&drill===null;
    }
    /* Remote room: while a match runs the phone shows only this player's own camera, full screen,
     * with the same thumb stick + one action button as solo touch play. */
    function showOwnView(data){
      const live=data.screen==='play'||data.screen==='result';document.body.classList.toggle('remoteFull',live);document.body.classList.toggle('remoteResult',data.screen==='result');$('remoteResultBtns').hidden=data.screen!=='result';
      const ptr=$('remotePointer');if(live&&data.pointer&&data.screen==='play'){ptr.hidden=false;ptr.style.left=(data.pointer.x*100)+'%';ptr.style.top=(data.pointer.y*100)+'%';}else ptr.hidden=true;
    }
    let catalog=[],lobbyKey='';
    function pick(action,extra={}){if(connection?.open)connection.send({type:'selection',action,...extra});}
    function renderPhoneLobby(lobby){
      const slot=lobby?.slots?.[seat?.id],visible=state.screen==='setup'&&lobby?.step==='lineup'&&!!slot;
      $('phoneLobby').hidden=!visible;if(visible){$('phoneLobby').append(deck);}else if(deck.parentNode!==deckHome){deckHome.insertBefore(deck,deckAnchor);}if(!visible){if(state.screen==='play')$('phoneSetup').hidden=!$('phonePlay').hidden;return;}
      const char=catalog.find(c=>c.kind===slot.kind);if(!char)return;
      const key=JSON.stringify(slot)+catalog.length;if(key===lobbyKey)return;lobbyKey=key;
      $('phoneLobbyStatus').textContent=slot.ready?'已決定：'+char.name+' · '+char.skins[slot.skin]+'，等待開賽':slot.stage?'選擇造型：'+char.skins[slot.skin]:'選擇你的角色';
      $('phoneCharacters').hidden=slot.ready||!!slot.stage;$('phoneSkins').hidden=slot.ready||!slot.stage;$('phoneSelectBack').hidden=slot.ready||!slot.stage;$('phoneSelectConfirm').textContent=slot.ready?'已決定':slot.stage?'決定造型':'決定角色';$('phoneSelectConfirm').disabled=slot.ready;
      const box=slot.stage?$('phoneSkins'):$('phoneCharacters');box.replaceChildren();
      const options=slot.stage?char.skins.map((name,i)=>({name,face:char.skinFaces?.[i]||char.face,skin:i})):catalog;
      if(!slot.stage){const random=document.createElement('button');random.id='phoneRandomCharacter';random.textContent='？ 隨機';random.onclick=()=>pick('random');box.append(random);}
      for(const option of options){const b=document.createElement('button');b.setAttribute('aria-pressed',String(slot.stage?option.skin===slot.skin:option.kind===slot.kind));const img=document.createElement('img');img.src=option.face;img.alt='';const label=document.createElement('span');label.textContent=option.name;b.append(img,label);b.onclick=()=>pick(slot.stage?'skin':'character',slot.stage?{skin:option.skin}:{kind:option.kind});box.append(b);}
    }
    for(const [id,action] of [['remoteAgain','again'],['remoteChange','change']])$(id).onclick=()=>{if(connection?.open)connection.send({type:'result',action});};
    $('phoneSelectBack').onclick=()=>pick('back');$('phoneSelectConfirm').onclick=()=>pick('confirm');
    const viewAspect=()=>Math.round(innerWidth/Math.max(1,innerHeight)*100)/100;let viewTimer=null;
    const reportView=()=>{clearTimeout(viewTimer);viewTimer=setTimeout(()=>{if(connection?.open&&seat?.remote)connection.send({type:'view',aspect:viewAspect()});},250);};
    addEventListener('resize',reportView);addEventListener('orientationchange',reportView);
    function openPad(mode){padMode=mode;$('phoneSetup').hidden=true;$('phonePlay').hidden=false;$('sensorFeedback').textContent=mode==='motion'?'動作感測已啟用':seat?.remote?'':'觸控模式';updateAction();}
    function startDrill(){drill=0;$('phoneReady').hidden=false;updateAction();$('phoneTaskLabel').textContent='練習：接球';$('phoneGesture').textContent='手機放平，由下往上揮';$('sensorFeedback').textContent='練習不會控制大螢幕';}
    function gesture(direction,details={}){
      if(drill==='done')return;if(drill!==null){const steps=[['up','接球'],['up','托球'],['up','起跳／攔網'],['down','扣球']];if(direction===steps[drill][0]){$('sensorFeedback').textContent=steps[drill][1]+' 辨識成功！';drill++;if(drill===4){drill='done';$('phoneTaskLabel').textContent='練習完成！';$('phoneGesture').textContent='按準備，等待大螢幕開賽';}else{$('phoneTaskLabel').textContent='練習：'+steps[drill][1];$('phoneGesture').textContent=['手機放平，向上揮接球','手機放平，向上揮舉球','手機放平，向上揮起跳','向左／中／右下揮扣球'][drill];}}return;}
      if(!seat)return;const task=state.task;
      if(direction==='up'){
        if(['spike','serve','approach','block'].includes(task)){send('jump');$('sensorFeedback').textContent='↑ 起跳／攔網';}
        else if(['receive','set','toss'].includes(task)){send('hit');$('sensorFeedback').textContent=task==='set'?'↑ 托球':task==='toss'?'↑ 拋球':'↑ 接球';}
      }else if(['spike','serve'].includes(task)){send('aim',details.aim||0);send('hit');$('sensorFeedback').textContent=(details.aim||0)<-.25?'↙ 向左扣球':(details.aim||0)>.25?'↘ 向右扣球':'↓ 向中間扣球';}
    }
    const motion=new VolleyMotionController({onGesture:gesture,onMove:value=>{if(padMode==='motion'&&manualPointer===null){if(!tiltArmed){if(Math.abs(value)<.12)tiltArmed=true;return;}const controlled=['receive','block'].includes(state.task)?value*.6:0;outputMove(controlled);}},onStatus:text=>{$('sensorStatus').textContent=text;$('sensorFeedback').textContent=text;if(text.startsWith('校正完成')){openPad('motion');startDrill();}}});
    $('chooseMotion').onclick=async()=>{try{await motion.enable();$('calibration').hidden=false;$('sensorStatus').textContent='已允許感測器。請先校正握姿。';}catch(error){$('sensorStatus').textContent=error.message;}};
    $('calibrate').onclick=()=>motion.calibrate();$('motionSensitivity').onchange=()=>{motion.classifier.sensitivity=Number($('motionSensitivity').value);};$('phoneDrill').onclick=()=>{if(padMode==='motion')startDrill();else $('sensorFeedback').textContent='請在設定中啟用動作手把後練習。';};$('chooseTouch').onclick=()=>{motion.disable();openPad('touch');};$('phoneSettings').onclick=()=>{motion.disable();stopMove();$('phoneSetup').hidden=false;$('phonePlay').hidden=true;};
    const pressAction=()=>{if(state.screen==='setup'&&state.lobby?.step==='lineup'){pick('confirm');return;}if(!$('padAction').disabled&&drill===null)send('action');};$('padAction').onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();pressAction();};$('padAction').onclick=e=>{if(e.detail===0)pressAction();};
    document.querySelectorAll('[data-padmove]').forEach(b=>{b.onpointerdown=e=>{if(beginMove(e,b))outputMove(Number(b.dataset.padmove),true);};b.onpointerup=stopMove;b.onpointercancel=stopMove;b.onlostpointercapture=stopMove;});
    $('phoneReady').onclick=async()=>{if(!connection?.open)return;drill=null;updateAction();ready=!ready;connection.send({type:'ready',value:ready});$('phoneReady').textContent=ready?'已準備，等待大螢幕開賽':'我準備好了';try{wake=await navigator.wakeLock?.request('screen');}catch(_){}};
    function lost(){document.body.classList.remove('remoteFull','remoteResult');$('remoteResultBtns').hidden=true;$('remoteCourt').srcObject=null;motion.disable();stopMove();$('phoneLink').textContent='已斷線';$('sensorFeedback').textContent='與大螢幕失去連線，請重新加入。';$('phoneWho').textContent='連線已中斷。請重新整理，或回到加入房間。';$('phoneSetup').hidden=false;$('phonePlay').hidden=true;}
    try{
      await VolleyNetwork.peerLibrary();peer=new Peer({debug:0});peer.on('call',call=>{call.answer();call.on('stream',stream=>{$('remoteCourt').srcObject=stream;$('phoneRemoteView').hidden=false;document.body.classList.add('remotePhone');$('remoteCourt').play().catch(()=>$('remoteResume').hidden=false);});});$('remoteResume').onclick=()=>{$('remoteCourt').play().then(()=>$('remoteResume').hidden=true).catch(()=>{});};peer.on('open',()=>{connection=peer.connect('wvs-volley-v2-'+room,{reliable:true});connection.on('open',()=>{$('phoneLink').textContent='已連線';});
        const connectTimeout=setTimeout(()=>{if(!connection.open){$('phoneWho').textContent='找到房間但尚未建立手把連線。請使用 Safari／Chrome，必要時切換 Wi-Fi 或手機熱點後重試。';$('phoneLink').textContent='連線逾時';}},15000);connection.on('open',()=>clearTimeout(connectTimeout));connection.on('close',()=>clearTimeout(connectTimeout));
        connection.on('data',data=>{if(data.type==='assign'){seat=data;if(data.remote){$('phoneRemoteView').hidden=false;document.body.classList.add('remotePhone');connection.send({type:'readyForVideo',aspect:viewAspect()});if($('phonePlay').hidden)openPad('touch');}$('phoneWho').textContent='房間 '+room+' · P'+data.number+' '+data.name;$('phonePlayerId').textContent='P'+data.number;$('phoneName').textContent=data.name;}
          else if(data.type==='roster'){catalog=data.characters||[];lobbyKey='';}
          else if(data.type==='full'){$('phoneWho').textContent=data.message;}
          else if(data.type==='state'){state=data;if(seat?.remote)showOwnView(data);const task=data.task,labels={toss:'拋球',serve:'發球',receive:'接球',set:'托球',approach:'準備起跳',spike:'扣球',block:'攔網',cover:'掩護隊友',wait:'等待開賽'};
            renderPhoneLobby(data.lobby);updateAction();$('remoteScore').textContent=data.screen==='setup'?'主機正在選角':('藍隊 '+data.score[0]+' : '+data.score[1]+' 紅隊');if(drill!==null)return;$('phoneTaskLabel').textContent=data.paused?'暫停中':data.screen==='setup'?'等待開賽':labels[task]||'準備';
            const gestures={toss:'手機放平，上揮拋球起跳，再下揮發球',serve:data.airborne?'向左／中／右下揮發球':'手機放平，上揮起跳，再下揮發球',receive:'手機放平，向上揮接球',set:'手機放平，向上揮舉球',approach:'先看隊友托球，托高後上舉起跳',spike:data.airborne?'向左／中／右下揮，控制扣球方向！':'手機放平，上揮起跳，再下揮扣球',block:'調整站位，向上舉起攔網',cover:'看大螢幕，準備下一球',wait:'在手機選好手把，按準備'};$('phoneGesture').textContent=padMode==='motion'?(gestures[task]||'看大螢幕'):'左手搖桿移動，右手按鈕跟著提示操作';
          }else if(data.type==='feedback'){$('sensorFeedback').textContent=data.text;$('sensorFeedback').style.color=data.color||'';try{if(data.vibration)navigator.vibrate?.(data.vibration);}catch(_){}}
          else if(data.type==='pong'){$('phoneLink').textContent='已連線 '+Math.round((performance.now()-data.at)/2)+'ms';}
        });connection.on('close',lost);connection.on('error',lost);
      });peer.on('error',e=>{$('phoneWho').textContent='無法加入：'+e.type+'。請確認大螢幕房號及網路連線。';$('phoneLink').textContent='連線失敗';});
      const ping=setInterval(()=>{if(connection?.open)connection.send({type:'ping',at:performance.now()});},3000);
      const timeout=setTimeout(()=>{if(!seat)$('phoneWho').textContent='仍在連線中。請確認房號，必要時改用手機熱點。';},12000);
      addEventListener('pagehide',()=>{clearInterval(ping);clearTimeout(timeout);stopMove();motion.disable();connection?.close();peer?.destroy();wake?.release();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopMove();motion.disable();$('sensorFeedback').textContent='已暫停感測，返回設定可重新啟用。';}});
    }catch(error){$('phoneWho').textContent=error.message;}
    addEventListener('blur',()=>stopMove());
    // A small diagnostic surface for controller regression tests, no raw sensor export.
    window.VolleyPhone={get state(){return {connected:!!connection?.open,seat:seat?.id,mode:padMode,task:state.task};}};
  }
}
