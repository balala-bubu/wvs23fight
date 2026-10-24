'use strict';
const scene=new THREE.Scene();
const Volleyball=(()=>{
  const $=id=>document.getElementById(id),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const labels={toss:'準備發球',serve:'發球',receive:'接球',set:'托球',approach:'準備起跳',spike:'空中扣球',block:'準備攔網',cover:'掩護隊友',wait:'準備就位'};
  const instructions={toss:'按擊球拋球',serve:'球到高點時擊球',receive:'先左右站位，球到手臂時接起',set:'在頭上方托高球',approach:'看隊友托球，準備起跳',spike:'搖桿左右瞄準；上推打深、下拉吊短',block:'移動封住球路，再起跳',cover:'注意隊友和球的位置',wait:'看大螢幕，準備下一球'};
  let slowFrames=0,frameWindow=0,pixelRatio=1.5;
  let renderer,setupCamera,replayCamera,resultCamera,effects,resultTime=0,impact,impactLife=0,arena,ball,ballShadow,target,reticle,trail,trailRibbon,strikeLabel,strikeCanvas,strikeTexture,labelLife=0,trailPoints=[],players=[],models=new Map(),rings=[],shadows=[],views=[],match=null,playMode='solo',screen='setup',last=0,clock=0,muted=false,audio=null,feedbackTime=0,practice=false,network=null;
  const replay=new VolleyReplay();let replayEnabled=true;
  let soloEntry=false,localPointer=null,localMove=0,localDepth=0;
  const held=new Set(),padButtons=new Map();const colors=['#ff7a3d','#4fa3ff','#5fd36a','#d070e0'];const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function sound(kind='hit',grade='normal',phase=''){
    if(muted)return;try{audio ||=new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const t=audio.currentTime,level=({weak:0,normal:1,nice:2,good:3,super:4})[grade]??1;
      const tone=(frequency,end,duration,gain,type='sine',delay=0)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(frequency,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+delay+duration);g.gain.setValueAtTime(gain,t+delay);g.gain.exponentialRampToValueAtTime(.001,t+delay+duration);o.connect(g);g.connect(audio.destination);o.start(t+delay);o.stop(t+delay+duration+.02);};
      if(['hit','nice','block'].includes(kind)){const duration=grade==='weak'?.11:.075,buffer=audio.createBuffer(1,Math.floor(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*7);const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),g=audio.createGain();src.buffer=buffer;filter.type='lowpass';filter.frequency.value=kind==='block'?550:500+level*430;g.gain.value=grade==='weak'?.065:.085+level*.013;src.connect(filter);filter.connect(g);g.connect(audio.destination);src.start(t);tone(kind==='block'?105:90+level*18,45,.1,.04+level*.008);if(level>=2&&kind!=='block')tone([0,0,660,830,1040][level],level>=3?880:740,.13,.025+level*.003,'sine');}
      if(phase==='spike'){const duration=.18,buffer=audio.createBuffer(1,Math.floor(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.sin(i/data.length*Math.PI);const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),g=audio.createGain();src.buffer=buffer;filter.type='bandpass';filter.Q.value=.7;filter.frequency.setValueAtTime(1800+level*130,t);filter.frequency.exponentialRampToValueAtTime(420,t+.18);g.gain.value=.035+level*.009;src.connect(filter);filter.connect(g);g.connect(audio.destination);src.start(t);}
      if(kind==='point'){[0,4,7].forEach((n,i)=>tone(440*Math.pow(2,n/12),440*Math.pow(2,n/12),.18,.03,'sine',i*.1));}else if(kind==='serve')tone(440,520,.15,.025);
    }catch(_){}
  }
  function ring(r,color){const o=new THREE.Mesh(new THREE.RingGeometry(r-.06,r,40),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false}));o.rotation.x=-Math.PI/2;scene.add(o);return o;}
  function initScene(){
    renderer=new THREE.WebGLRenderer({canvas:$('court'),antialias:true,powerPreference:'high-performance'});pixelRatio=Math.min(devicePixelRatio,1.5);renderer.setPixelRatio(pixelRatio);renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
    arena=createVolleyArena(scene,renderer);setupCamera=new THREE.PerspectiveCamera(45,1,.3,170);setupCamera.position.set(24,9,26);setupCamera.lookAt(6.5,2.5,1);replayCamera=new THREE.PerspectiveCamera(48,1,.3,170);resultCamera=new THREE.PerspectiveCamera(48,1,.3,170);effects=new VolleyEffects(scene,reduce);
    impact=new THREE.Mesh(new THREE.RingGeometry(.35,.49,24),new THREE.MeshBasicMaterial({color:0xffe39b,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));scene.add(impact);
    ball=new THREE.Mesh(new THREE.SphereGeometry(.36,32,24),new THREE.MeshStandardMaterial({map:createVolleyBallTexture(),roughness:.58,metalness:0}));ball.castShadow=true;scene.add(ball);strikeCanvas=document.createElement('canvas');strikeCanvas.width=512;strikeCanvas.height=128;strikeTexture=new THREE.CanvasTexture(strikeCanvas);strikeTexture.encoding=THREE.sRGBEncoding;strikeLabel=new THREE.Sprite(new THREE.SpriteMaterial({map:strikeTexture,transparent:true,depthTest:false,depthWrite:false}));strikeLabel.scale.set(4.8,1.2,1);strikeLabel.renderOrder=10;strikeLabel.visible=false;scene.add(strikeLabel);
    const shadowM=new THREE.MeshBasicMaterial({color:0x123c49,transparent:true,opacity:.20,depthWrite:false});
    ballShadow=new THREE.Mesh(new THREE.CircleGeometry(.45,24),shadowM);ballShadow.rotation.x=-Math.PI/2;scene.add(ballShadow);
    for(let i=0;i<4;i++){rings.push(ring(.85,colors[i]));const s=new THREE.Mesh(new THREE.CircleGeometry(.63,24),shadowM.clone());s.rotation.x=-Math.PI/2;scene.add(s);shadows.push(s);}
    target=ring(.9,'#ffef9c');reticle=ring(1.0,'#fff0a8');
    const positions=new Float32Array(12*3);trail=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(positions,3)),new THREE.LineBasicMaterial({color:0xf7e6a5,transparent:true,opacity:.55}));scene.add(trail);
    const ribbonGeometry=new THREE.BufferGeometry();ribbonGeometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*3),3));ribbonGeometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(24*3),3));const indices=[];for(let i=0;i<11;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}ribbonGeometry.setIndex(indices);trailRibbon=new THREE.Mesh(ribbonGeometry,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));trailRibbon.frustumCulled=false;scene.add(trailRibbon);
  }
  function modelLineup(){
    const lineup=[$('hero').value,$('partner').value,$('rival').value,$('rivalPartner').value];players.forEach(m=>m.holder.visible=false);players=[];
    lineup.forEach((kind,i)=>{const skin=selectedSkins[i],key=kind+':'+skin+':'+i;let m=models.get(key);if(!m){m=makeModel(kind,skin);m.body.scale.setScalar(.60);m.holder.traverse(o=>{if(o.isMesh){o.geometry.computeBoundingBox();const size=new THREE.Vector3();o.geometry.boundingBox.getSize(size);o.castShadow=size.y>.65&&size.x>.35;o.receiveShadow=true;}});models.set(key,m);}const portrait=document.querySelector('.choicePortrait[data-player="'+i+'"]');const face=CHARS[kind].face?.image;if(portrait&&face?.toDataURL)portrait.src=face.toDataURL();m.holder.visible=true;m.setFace?.('normal');m.holder.position.set(i%2?-2.5:2.5,0,(i<2?1:-1)*(i%2?2.7:9.8));m.holder.rotation.y=i<2?Math.PI:0;if(screen==='setup'){const selecting=$('setup').dataset.step==='lineup';m.holder.position.set(selecting?10+(i%2)*5:10+i*2.2,.1,selecting?3+Math.floor(i/2)*5:5+(i%2)*.5);if(selecting&&matchMedia('(pointer:coarse)').matches&&innerWidth<1000)m.holder.position.set(8.3+i*2.8,.1,6);m.holder.rotation.y=Math.atan2(setupCamera.position.x-m.holder.position.x,setupCamera.position.z-m.holder.position.z);}applyPose(m,POSE.stance,1);players.push(m);});
  }
  let selectedSlot=0;const selectedReady=[false,false,false,false],selectedSkins=[0,0,0,0],selectionStages=[0,0,0,0],selectionIDs=['hero','partner','rival','rivalPartner'];
  function lobbyState(){return {step:$('setup').dataset.step,slots:selectionIDs.map((id,i)=>({kind:$(id).value,skin:selectedSkins[i],stage:selectionStages[i],ready:selectedReady[i]}))};}
  const portraitCache=new Map();
  function costumePortrait(kind,skin=0){
    const key=kind+':'+skin;if(portraitCache.has(key))return portraitCache.get(key);
    const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),C=CHARS[kind];g.imageSmoothingEnabled=false;g.fillStyle=C.portraitBg||'#6f9fe8';g.fillRect(0,0,64,64);g.drawImage(C.face.image,6,12,52,52);g.fillStyle='#151110';C.portrait?.(g);
    const look=skin>0?C.skins?.[skin-1]:null;if(look?.portrait)look.portrait(g);else if(look?.name==='生日帽'){g.save();g.translate(34,15);g.rotate(.2);const hc=look.hat||[];g.fillStyle=hc[0]||'#ff5fa2';g.beginPath();g.moveTo(-11,0);g.lineTo(11,0);g.lineTo(0,-15);g.closePath();g.fill();g.fillStyle=hc[1]||'#ffe066';g.fillRect(-7,-5,14,2);g.fillRect(-4,-10,8,2);g.fillRect(-12,-1,24,3);g.fillStyle=hc[2]||'#ffffff';g.fillRect(-2,-18,4,4);g.restore();}
    const url=c.toDataURL();portraitCache.set(key,url);return url;
  }
  let rosterCache=null;
  function roster(){return rosterCache ||=CHAR_ORDER.map(kind=>({kind,name:CHARS[kind].stats.name,face:costumePortrait(kind),skinFaces:Array.from({length:skinCount(kind)},(_,i)=>costumePortrait(kind,i)),skins:Array.from({length:skinCount(kind)},(_,i)=>skinName(kind,i))}));}
  function refreshSelection(){
    document.querySelectorAll('.volleyPlate').forEach((plate,i)=>{plate.style.setProperty('--pc',colors[i]);plate.classList.toggle('active',i===selectedSlot);plate.setAttribute('aria-pressed',String(i===selectedSlot));plate.querySelector('.selectedName').textContent=CHARS[$(selectionIDs[i]).value].stats.name;plate.querySelector('.selectedStatus').textContent=(selectedReady[i]?'OK! · ':selectionStages[i]?'選造型 · ':network?.isRemote(i)?'手機選擇中 · ':'選擇中 · ')+skinName($(selectionIDs[i]).value,selectedSkins[i]);});
    const kind=$(selectionIDs[selectedSlot]).value,skinStep=selectionStages[selectedSlot]===1;
    $('volleyPortraits').hidden=skinStep;$('volleySkins').hidden=!skinStep;$('selectionBack').hidden=!skinStep;$('selectionConfirm').textContent=skinStep?'決定造型':'決定角色';
    document.querySelectorAll('#volleyPortraits button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.kind===kind));b.style.setProperty('--pc',colors[selectedSlot]);});
    const box=$('volleySkins'),key=kind+':'+selectedSlot;
    if(skinStep&&box.dataset.key!==key){box.dataset.key=key;box.replaceChildren();for(let i=0;i<skinCount(kind);i++){const b=document.createElement('button');b.dataset.skin=i;b.setAttribute('aria-label',skinName(kind,i));const img=document.createElement('img');img.src=costumePortrait(kind,i);img.alt='';const label=document.createElement('span');label.textContent=skinName(kind,i);b.append(img,label);b.onclick=()=>{selectedSkins[selectedSlot]=i;selectedReady[selectedSlot]=false;modelLineup();refreshSelection();};box.append(b);}}
    box.querySelectorAll('button').forEach(b=>{b.style.setProperty('--pc',colors[selectedSlot]);b.setAttribute('aria-pressed',String(+b.dataset.skin===selectedSkins[selectedSlot]));});
    $('selectionHint').textContent=$('slotLabel'+selectedSlot).textContent+' · '+(skinStep?'選擇造型，按決定造型':'點頭像選角色，按決定角色');
  }
  function confirmSelection(){
    if(!selectionStages[selectedSlot]&&skinCount($(selectionIDs[selectedSlot]).value)>1){selectionStages[selectedSlot]=1;selectedReady[selectedSlot]=false;refreshSelection();return;}
    selectedReady[selectedSlot]=true;const next=selectedReady.findIndex((v,i)=>!v&&!network?.isRemote(i));if(next>=0)selectedSlot=next;refreshSelection();if(next<0)$('start').focus();
  }
  function selectFromPhone(id,data){
    if(screen!=='setup'||$('setup').dataset.step!=='lineup'||!selectionIDs[id])return;
    if(data.action==='random'){randomSelection(id);return;}
    if(data.action==='character'&&CHAR_ORDER.includes(data.kind)){const select=$(selectionIDs[id]);select.value=data.kind;selectedSkins[id]=0;selectionStages[id]=0;selectedReady[id]=false;modelLineup();network.updateSeats(humanIDs(),names());}
    else if(data.action==='skin'&&Number.isInteger(data.skin)&&data.skin>=0&&data.skin<skinCount($(selectionIDs[id]).value)){selectedSkins[id]=data.skin;selectedReady[id]=false;modelLineup();}
    else if(data.action==='back'){selectionStages[id]=0;selectedReady[id]=false;}
    else if(data.action==='confirm'){if(!selectionStages[id]&&skinCount($(selectionIDs[id]).value)>1)selectionStages[id]=1;else selectedReady[id]=true;}
    refreshSelection();
  }
  function randomSelection(id){const kind=CHAR_ORDER[Math.floor(Math.random()*CHAR_ORDER.length)];$(selectionIDs[id]).value=kind;selectedSkins[id]=Math.floor(Math.random()*skinCount(kind));selectionStages[id]=0;selectedReady[id]=true;modelLineup();network?.updateSeats(humanIDs(),names());if(selectedSlot===id){const next=selectedReady.findIndex((ready,i)=>!ready&&!network?.isRemote(i));if(next>=0)selectedSlot=next;}refreshSelection();}
  function initSelection(){
    for(const kind of CHAR_ORDER){const b=document.createElement('button');b.type='button';b.dataset.kind=kind;b.title=CHARS[kind].stats.name;b.setAttribute('aria-label',b.title);const img=document.createElement('img');img.alt='';const face=CHARS[kind].face?.image;if(face?.toDataURL)img.src=face.toDataURL();const name=document.createElement('span');name.textContent=b.title;b.append(img,name);b.onclick=()=>{const select=$(selectionIDs[selectedSlot]);select.value=kind;selectedSkins[selectedSlot]=0;selectionStages[selectedSlot]=0;selectedReady[selectedSlot]=false;select.onchange();refreshSelection();};$('volleyPortraits').append(b);}
    const random=document.createElement('button');random.id='randomCharacter';random.type='button';random.dataset.kind='random';random.setAttribute('aria-label','隨機選角');random.innerHTML='<b class="randomGlyph">?</b><span>隨機</span>';random.onclick=()=>randomSelection(selectedSlot);$('volleyPortraits').append(random);
    document.querySelectorAll('.volleyPlate').forEach((plate,i)=>{const activate=()=>{selectedSlot=i;refreshSelection();};plate.onclick=activate;plate.onkeydown=e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();activate();}};});$('selectionConfirm').onclick=confirmSelection;$('selectionBack').onclick=()=>{selectionStages[selectedSlot]=0;selectedReady[selectedSlot]=false;refreshSelection();};refreshSelection();
  }
  function names(){return players.map(m=>CHARS[m.kind].stats.name);}
  function setupStep(step){
    $('setup').dataset.step=step;document.body.classList.toggle('soloFlow',soloEntry&&step!=='entry');document.querySelector('#nav .home').hidden=step!=='entry';$('lobbyHome').hidden=step==='entry';
    if(setupCamera){if(step==='lineup'){if(matchMedia('(pointer:coarse)').matches&&innerWidth<1000){setupCamera.position.set(12.5,6.5,6+Math.max(17,6.3/(Math.tan(setupCamera.fov*Math.PI/360)*setupCamera.aspect)));setupCamera.lookAt(12.5,1.2,6);}else{setupCamera.position.set(23,10,30);setupCamera.lookAt(12.5,.5,6);}}else{setupCamera.position.set(24,9,26);setupCamera.lookAt(6.5,2.5,1);}}
    document.querySelectorAll('[data-setup-pane]').forEach(p=>p.hidden=p.dataset.setupPane!==step);
    $('setup').querySelector('.setupBox').scrollTop=0;
    if(players.length){modelLineup();if(step==='lineup')refreshSelection();}
    if(step==='lineup'&&!$('friendsNote').hidden){$('lobbyRoom').hidden=false;network?.openHost();}else $('lobbyRoom').hidden=true;
  }
  function humanIDs(){return ({solo:[0],coop:[0,1],versus:[0,2],four:[0,1,2,3]})[playMode];}
  function updateModeDescription(){const note=$('friendsNote').querySelector('span');note.textContent=({solo:'固定二打二：1 位真人，3 位電腦。',coop:'固定二打二：2 位真人同隊，對戰 2 位電腦。',versus:'固定二打二：兩隊各 1 位真人、1 位電腦。',four:'固定二打二：4 位真人，兩隊各 2 人。'})[playMode];}
  function updateSlots(){for(let i=0;i<4;i++){const n=humanIDs().indexOf(i);$('slotLabel'+i).textContent=n>=0?'P'+(n+1)+' · '+(i<2?'藍隊':'紅隊'):'AI · '+(i<2?'藍隊':'紅隊');}}
  function cameraRig(p,cam){
    const side=match.side(p.team),front=1-clamp((Math.abs(p.z)-2)/8,0,1);
    // Keep court lanes visible even in narrow split-screen/portrait viewports.
    const widthDistance=(VOLLEY_COURT.halfWidth+1.2)/(Math.tan(cam.fov*Math.PI/360)*cam.aspect);
    const distance=Math.min(18,Math.max(12.5+front*1.5,widthDistance));
    const task=match.task(p.id);
    if(!reduce&&match.status==='play'){
      const serveAge=p.serveContactAt==null?null:match.time-p.serveContactAt;
      if(serveAge!==null&&serveAge<1.5){
        const t=clamp(serveAge/1.5,0,1),blend=Math.sin(Math.PI*t)*.55;
        const position=new THREE.Vector3(p.x*.55+side*1.7,7.7+p.y*.12,p.z+side*distance);
        const look=new THREE.Vector3(p.x*.3+ball.position.x*.1+side*.35,3.4,p.z*.3-side*5);
        position.lerp(new THREE.Vector3(ball.position.x*.3+side*1.7,8.5,ball.position.z+side*distance),blend);
        look.lerp(new THREE.Vector3(ball.position.x,ball.position.y,ball.position.z-side*3),blend);
        return {position,look};
      }
      if(task==='set')return {position:new THREE.Vector3(p.x+side*4.5,3.0,p.z+side*Math.max(7,widthDistance*.65)),look:new THREE.Vector3(p.x*.65+ball.position.x*.35,Math.max(5.5,ball.position.y),p.z-side*2)};
      if(task==='spike'&&p.y>.15)return {position:new THREE.Vector3(p.x+side*2.8,6.4+p.y*1.1,p.z+side*Math.max(9,widthDistance*.75)),look:new THREE.Vector3(p.x*.4+ball.position.x*.3,3.5+p.y*.3,-side*6)};
    }
    return {position:new THREE.Vector3(p.x*.55+side*1.7,7.7+front*1.0+p.y*.12,p.z+side*distance),
      look:new THREE.Vector3(p.x*.30+ball.position.x*.10+side*.35,3.4+clamp((ball.position.y-5)*.12,0,.7),p.z*.30-side*5)};
  }
  function createViews(){
    $('views').replaceChildren();views=[];const ids=match.humans,localCount=ids.filter(id=>!network?.hasVideo(id)).length;
    ids.forEach((id,index)=>{const root=document.createElement('div');root.className='view'+(localCount>1?' split':'');root.style.setProperty('--accent',colors[id]);root.innerHTML='<div class="nextAction"><small>NEXT / 下一步</small><strong></strong><span></span></div><div class="viewHint"></div><div class="combo"></div><div class="viewIdentity"><img class="portrait" alt=""><span class="playerNumber"></span><div><b></b><small></small></div></div><div class="actionPrompt"></div><div class="ballPointer" hidden>▼</div>';
      const face=CHARS[players[id].kind].face?.image;if(face?.toDataURL)root.querySelector('.portrait').src=face.toDataURL();root.querySelector('.playerNumber').textContent='P'+(index+1);root.querySelector('.viewIdentity b').textContent=names()[id];root.querySelector('.viewIdentity small').textContent=id<2?'BLUE TEAM':'CORAL TEAM';
      const keys=[['A / D','J','K'],['← / →','Enter','Shift'],['F / H','R','T'],['Num 4 / 6','Num 1','Num 2']][index];root.querySelector('.actionPrompt').innerHTML='<kbd>'+keys[0]+'</kbd> 移動 <kbd>'+keys[1]+'</kbd> 擊球 <kbd>'+keys[2]+'</kbd> 起跳';
      const cam=new THREE.PerspectiveCamera(52,1,.3,160),p=match.players[id];
      const remote=!!network?.hasVideo(id),view={id,index,root,camera:cam,look:new THREE.Vector3(),hintTime:0,remote,rect:{x:0,y:0,w:360,h:640}};views.push(view);if(!remote)$('views').appendChild(root);
    });layoutViews();views.forEach(v=>{const rig=cameraRig(match.players[v.id],v.camera);v.camera.position.copy(rig.position);v.look.copy(rig.look);v.camera.lookAt(v.look);});
  }
  function layoutViews(){const w=innerWidth,h=innerHeight,local=views.filter(v=>!v.remote),n=local.length;local.forEach((v,i)=>{const columns=n>1?2:1,rows=n>2?2:1;v.rect={x:(i%columns)*w/columns,y:Math.floor(i/columns)*h/rows,w:w/columns,h:h/rows};Object.assign(v.root.style,{left:v.rect.x+'px',top:v.rect.y+'px',width:v.rect.w+'px',height:v.rect.h+'px'});v.camera.aspect=v.rect.w/v.rect.h;v.camera.fov=v.camera.aspect<.75?64:v.camera.aspect<1.2?58:52;v.camera.updateProjectionMatrix();});}
  function hint(player,text,duration=1.0,color='#ffffff'){for(const v of views)if(v.id===player){v.root.querySelector('.viewHint').textContent=text;v.root.querySelector('.viewHint').style.color=color;v.root.querySelector('.viewHint').classList.add('visible');v.hintTime=duration;}}
  function onEvent(e){
    if(e.type==='contact'){const text=({weak:'勉強救起…',normal:'OK',nice:'NICE!',good:'GOOD!',super:'SUPER!'})[e.grade];effects.hit(new THREE.Vector3(match.ball.x,match.ball.y,match.ball.z),e.color,e.grade);impactLife=.12;impact.position.set(match.ball.x,match.ball.y,match.ball.z);impact.material.color.set(e.color);sound('hit',e.grade,e.kind);showStrikeLabel(text,e.color);network?.feedback(e.player,text,e.grade==='super'?[20,30,40]:20,e.color);}
    else if(e.type==='jump'&&e.slide){hint(e.player,'背飛起跳！',.6);}
    else if(e.type==='dive'){hint(e.player,'飛撲救球！',.55);}
    else if(e.type==='hint'){hint(e.player,e.text,.8);network?.feedback(e.player,e.text);}
    else if(e.type==='block'){sound('block');hint(e.player,e.blockOut?'碰到邊緣，注意界外！':e.power>=3?'攔網碰球，繼續救！':'BLOCK!',1);network?.feedback(e.player,'攔網成功',[30,40,50]);}
    else if(e.type==='serve'){sound('serve');replay.frames=[];trailPoints=[];$('pointBanner').hidden=true;}
    else if(e.type==='point'){
      $('pointBanner').hidden=false;$('pointReason').textContent=e.reason==='出界'?(e.faultTeam===0?'藍隊':'紅隊')+'最後觸球出界':e.reason;$('pointTitle').textContent=e.practice?'再練一球':(e.winner===0?'藍隊':'紅隊')+'得分！';$('pointScore').textContent=e.practice?'接起來 → 托高 → 起跳扣殺':e.score[0]+' — '+e.score[1];sound('point');if(!e.practice&&replayEnabled&&!reduce)replay.begin({...match.snapshot(),time:match.time});
    }else if(e.type==='result'){
      enterResult(e);
    }
  }
  function enterResult(e){
    screen='result';resultTime=0;replay.reset();labelLife=impactLife=0;resetLocalStick();effects.clear();document.body.classList.add('results');$('result').hidden=false;for(const id of ['pointBanner','scoreboard','views','pause','touchControls','finishPractice','replayLayer'])$(id).hidden=true;
    $('result').style.setProperty('--winner',e.winner===0?'#3ed8cf':'#ff8ab4');$('resultTitle').textContent=(e.winner===0?'藍隊':'紅隊')+'勝出！';$('resultBlueScore').textContent=e.score[0];$('resultRedScore').textContent=e.score[1];$('resultStats').textContent='NICE '+match.perfects+' 次　·　最長回合 '+match.longest+' 次觸球';$('resultPlayers').replaceChildren();
    players.forEach((m,i)=>{const tag=document.createElement('div');tag.className='resultPlayer'+((i>>1)===e.winner?' winner':'');tag.style.setProperty('--player-color',colors[i]);tag.dataset.player=i;const name=document.createElement('b');name.textContent=names()[i];const team=document.createElement('small');team.textContent=((i>>1)===e.winner?'WINNER · ':'')+(i<2?'藍隊':'紅隊');tag.append(team,name);$('resultPlayers').append(tag);});
    target.visible=reticle.visible=trail.visible=trailRibbon.visible=false;ball.visible=ballShadow.visible=false;VolleyAudio.setState('result');VolleyAudio.victory();sound('point');updateResult(0);
  }
  function updateResult(dt){
    resultTime+=dt;const winner=match.lastWinner,portrait=innerWidth<innerHeight,distance=portrait?27:22;resultCamera.position.set(portrait?5:10,7.8,distance+(reduce?0:Math.max(0,1-resultTime)*2));resultCamera.lookAt(0,2.3,2);resultCamera.updateMatrixWorld();
    players.forEach((m,i)=>{const won=(i>>1)===winner,slot=i%2;m.holder.position.set((slot?1:-1)*(won?2.2:3.4),.1,won?7.5:-5.5);m.holder.rotation.y=Math.atan2(resultCamera.position.x-m.holder.position.x,resultCamera.position.z-m.holder.position.z);applyPose(m,won?POSE.cheer:POSE.sob||POSE.dizzy,dt===0?1:Math.min(1,dt*9));if(won&&!reduce)m.holder.position.y+=Math.max(0,Math.sin(resultTime*3+slot))*.1;rings[i].visible=true;rings[i].position.set(m.holder.position.x,.17,m.holder.position.z);shadows[i].position.set(m.holder.position.x,.16,m.holder.position.z);shadows[i].material.opacity=.22;
      const p=m.holder.position.clone();p.y+=.1;p.project(resultCamera);const tag=$('resultPlayers').children[i];tag.style.left=clamp((p.x*.5+.5)*innerWidth,60,innerWidth-60)+'px';tag.style.top=clamp((-p.y*.5+.5)*innerHeight,150,innerHeight-(portrait?155:100))+'px';});
  }
  function showSetup(){document.body.classList.remove('results');VolleyAudio.setState('setup');effects.clear();setupStep('entry');replay.reset();$('replayLayer').hidden=true;screen='setup';ball.visible=ballShadow.visible=true;match=null;resetLocalStick();labelLife=0;strikeLabel.visible=false;held.clear();document.body.classList.remove('playing');['views','scoreboard','pause','help','pauseModal','result','pointBanner','touchControls','finishPractice'].forEach(id=>$(id).hidden=true);$('setup').hidden=false;modelLineup();reticle.visible=target.visible=trail.visible=trailRibbon.visible=false;network?.updateSeats(humanIDs(),names());}
  function start(isPractice=false,help=true){document.body.classList.remove('results');VolleyAudio.setState('play');effects.clear();
    replay.reset();ball.visible=ballShadow.visible=true;$('replayLayer').hidden=true;sound('serve');practice=isPractice;screen='play';resetLocalStick();document.querySelector('#nav .home').hidden=true;$('lobbyHome').hidden=true;modelLineup();held.clear();match=new VolleyMatch({mode:playMode,difficulty:$('difficulty').value,practice:isPractice,onEvent});createViews();$('setup').hidden=true;$('result').hidden=true;$('views').hidden=false;$('scoreboard').hidden=false;$('pause').hidden=false;$('pause').textContent='暫停';$('finishPractice').hidden=!practice;$('practiceNote').hidden=!practice;$('matchLabel').textContent=practice?'PRACTICE / 不計分':'5 POINT MATCH';$('team0').textContent=playMode==='coop'?'你們':'藍隊';$('team1').textContent='紅隊';
    document.body.classList.add('playing');$('touchControls').hidden=!matchMedia('(pointer:coarse)').matches||views.filter(v=>!v.remote).length>1||network?.isRemote(match.humans[0]);network?.updateSeats(match.humans,names());
    if(help){match.paused=true;$('help').hidden=false;}$('helpGo').focus();
  }
  function pause(value){if(!match||!['play','point'].includes(match.status))return;match.paused=value;VolleyAudio.setState(value?'pause':'play');resetLocalStick();held.clear();match.players.forEach(p=>p.move=0);$('pauseModal').hidden=!value;$('pause').textContent=value?'繼續':'暫停';}
  function playerInput(index,action,value){if(match&&screen==='play')match.input(index,action,value);}
  function resetLocalStick(){localMove=0;localDepth=0;localPointer=null;const stick=$('localStick');if(stick){stick.style.setProperty('--local-x','0px');stick.style.setProperty('--local-y','0px');stick.classList.remove('active');stick.setAttribute('aria-valuenow','0');}if(match)match.input(match.humans[0],'move',0);}
  function updateLocalAction(){
    if(!match||$('touchControls').hidden)return;const p=match.players[match.humans[0]],task=match.task(p.id),air=p.y>.45,jumping=task==='approach'||task==='spike'&&!air;
    const title=jumping?'起跳':task==='block'?(air?'攔網中':'起跳攔網'):({toss:'拋球',serve:'發球',receive:'接球',set:'舉球',spike:'扣球',cover:'等候',wait:'準備'}[task]||'準備');
    $('localActionLabel').textContent=title;$('localAction').setAttribute('aria-label',title);$('localActionIcon').textContent=jumping?'↟':task==='spike'?'↘':task==='block'?'⊓':task==='receive'?'◉':'↑';
    $('localAction').disabled=match.paused||match.status!=='play'||replay.active||['cover','wait'].includes(task)||(task==='approach'||task==='block')&&air;
    $('localActionHint').textContent=task==='spike'&&air?'球到手邊，再按扣球':jumping?'按一下起跳':'跟著提示按一下';
  }
  function initLocalTouch(){
    const stick=$('localStick');const drag=e=>{if(e.pointerId!==localPointer)return;e.preventDefault();const r=stick.getBoundingClientRect(),knob=$('localStickKnob').getBoundingClientRect(),radius=(r.width-knob.width)/2-5;let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const distance=Math.hypot(x,y);if(distance>radius){x*=radius/distance;y*=radius/distance;}localDepth=Math.abs(y/radius)<.12?0:y/radius;const axis=x/radius;localMove=Math.abs(axis)<.12?0:Math.sign(axis)*(Math.abs(axis)-.12)/.88;stick.style.setProperty('--local-x',x+'px');stick.style.setProperty('--local-y',y+'px');stick.setAttribute('aria-valuenow',String(Math.round(localMove*100)));};
    stick.onpointerdown=e=>{if(e.button!==0||localPointer!==null)return;e.preventDefault();localPointer=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('active');drag(e);};stick.onpointermove=drag;
    const stop=e=>{if(e.pointerId===localPointer)resetLocalStick();};stick.onpointerup=stop;stick.onpointercancel=stop;stick.onlostpointercapture=stop;
    stick.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','Escape'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(['Home','Escape'].includes(e.key)){resetLocalStick();return;}localPointer='keyboard';localMove=e.key==='ArrowLeft'?-1:1;stick.style.setProperty('--local-x',localMove*32+'px');};stick.onkeyup=e=>{if(localPointer==='keyboard'){e.preventDefault();e.stopPropagation();resetLocalStick();}};stick.onblur=resetLocalStick;
    const press=()=>{if(!$('localAction').disabled)playerInput(match?.humans[0],'action');};$('localAction').onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();press();};$('localAction').onclick=e=>{if(e.detail===0)press();};
    for(const type of ['gesturestart','gesturechange','gestureend','touchmove'])$('touchControls').addEventListener(type,e=>e.preventDefault(),{passive:false});
  }
  function keyboardInputs(){
    if(!match||match.paused)return;const bindings=[['KeyA','KeyD'],['ArrowLeft','ArrowRight'],['KeyF','KeyH'],['Numpad4','Numpad6']];
    match.humans.forEach((id,index)=>{if(network?.isRemote(id))return;const [left,right]=bindings[index];let gp=null;try{gp=navigator.getGamepads?.()[index];}catch(_){}let move=index===0&&localPointer!==null?localMove:held.has(left)?-1:held.has(right)?1:0;if(gp&&Math.abs(gp.axes[0])>.2)move=gp.axes[0];match.input(id,'move',move);match.input(id,'aimDepth',gp&&Math.abs(gp.axes[1])>.2?gp.axes[1]:index===0?localDepth:0);
      if(gp){for(const [b,a]of [[0,'jump'],[1,'hit']]){const key=index+':'+b,down=!!gp.buttons[b]?.pressed;if(down&&!padButtons.get(key))match.input(id,a);padButtons.set(key,down);}}
    });
  }
  function updateScene(dt){
    clock+=dt;if(feedbackTime>0){feedbackTime-=dt;if(feedbackTime<=0)$('feedback').textContent='';}
    if(!match){ball.position.set(0,5.7+Math.sin(clock*1.5)*.25,0);ball.rotation.z+=dt*.5;players.forEach((m,i)=>{applyPose(m,i===0?POSE.peace:POSE.stance,Math.min(1,dt*8));rings[i].position.set(m.holder.position.x,.17,m.holder.position.z);shadows[i].position.set(m.holder.position.x,.16,m.holder.position.z);});}
    else if(screen==='result'){updateResult(dt);}
    else{
      keyboardInputs();const steps=Math.max(1,Math.ceil(dt/(1/120)));if(replay.active){if(!match.paused)replay.tick(dt);}else{for(let i=0;i<steps;i++)match.update(dt/steps);if(match.status==='play'&&!match.paused)replay.record({...match.snapshot(),time:match.time});}
      const visual=replay.playing?replay.sample():match;
      $('replayLayer').hidden=!replay.playing;$('views').hidden=replay.playing;$('pointBanner').hidden=replay.playing||match.status!=='point';
      ball.position.set(visual.ball.x,visual.ball.y,visual.ball.z);ball.rotation.x+=dt*(8+match.combo*3);ball.rotation.z+=dt*3;
      for(let i=0;i<4;i++){const p=visual.players[i],m=players[i],task=match.task(i);let pose=p.diveTime>0?POSE.dive:p.poseTime>0?POSE[p.pose]:p.moving?runPose(p.stepPhase||0):POSE.stance;
        if(p.y>.3){pose=p.pose==='spikeHit'&&p.poseTime>0?POSE.spikeHit:p.jumpKind==='block'?POSE.block:POSE.spikeWind;}
        const serveAge=p.serveContactAt==null?null:visual.time-p.serveContactAt;
        if(task==='toss')pose=volleyServePose(0,null);
        else if(task==='serve')pose=volleyServePose(clamp((visual.flight?.t||0)/Math.max(.01,visual.flight?.contactTime||.6),0,1),null);
        else if(serveAge!==null&&serveAge<.46)pose=volleyServePose(1,serveAge);
        else if(p.moving&&p.y<.2&&p.poseTime<=0&&task==='receive')pose=volleyShufflePose(p.stepPhase||0,Math.sign(p.tx-p.x)*match.side(p.team));
        applyPose(m,pose,Math.min(1,dt*18));m.holder.position.set(p.x,p.y+.1,p.z);let turn=p.team===0?Math.PI:0;
        if(p.moving&&p.y<.2&&task!=='receive'&&task!=='serve'&&task!=='toss')turn=Math.atan2(p.tx-p.x,p.tz-p.z);const delta=Math.atan2(Math.sin(turn-m.holder.rotation.y),Math.cos(turn-m.holder.rotation.y));m.holder.rotation.y+=delta*Math.min(1,dt*12);
        rings[i].position.set(p.x,.17,p.z);rings[i].visible=p.human;shadows[i].position.set(p.x,.16,p.z);shadows[i].material.opacity=.22-p.y*.035;shadows[i].scale.setScalar(1+p.y*.06);
      }
      $('score0').textContent=match.score[0];$('score1').textContent=match.score[1];$('serve0').style.visibility=match.server===0?'visible':'hidden';$('serve1').style.visibility=match.server===1?'visible':'hidden';
      const f=match.flight;target.visible=!replay.active&&match.status==='play'&&!!f&&f.kind!=='serve';if(target.visible){target.position.set(f.end.x,.18,f.end.z);target.scale.setScalar(clamp((f.contactTime-f.t)*.8+.4,.4,1.7));target.material.opacity=clamp(1-(f.contactTime-f.t)*.25,.35,1);}
      const attacker=match.players.find(p=>p.human&&['serve','spike'].includes(match.task(p.id)));reticle.visible=!replay.active&&!!attacker&&match.status==='play';if(reticle.visible){reticle.position.set(attacker.aim*6,.18,-match.side(attacker.team)*(10-attacker.aimDepth*3));}
      trail.visible=(match.status==='play'||replay.playing)&&!!visual.flight&&visual.flight.kind!=='serve';if(!match.paused){trailPoints.unshift({position:ball.position.clone(),time:clock});trailPoints=trailPoints.filter(p=>clock-p.time<=.36);const attr=trail.geometry.attributes.position;for(let i=0;i<12;i++){const time=clock-i*.03;let j=0;while(j<trailPoints.length-1&&trailPoints[j+1].time>time)j++;const a=trailPoints[j],b=trailPoints[Math.min(j+1,trailPoints.length-1)];const p=a&&b?a.position.clone().lerp(b.position,clamp((a.time-time)/Math.max(.001,a.time-b.time),0,1)):ball.position;attr.setXYZ(i,p.x,p.y,p.z);}attr.needsUpdate=true;trail.geometry.computeBoundingSphere();}trail.material.color.set(visual.flight?.color||'#ffffff');updateTail(visual.flight?.grade||'normal');
      if(replay.playing){const side=match.side(1-match.lastWinner);replayCamera.position.set(18,10,side*18);replayCamera.lookAt(ball.position.x*.3,3.2,0);}
      views.forEach(v=>{
        const p=match.players[v.id],task=match.task(v.id),side=match.side(p.team),k=reduce?1:1-Math.exp(-dt*(p.y>.15?8:5));
        const rig=cameraRig(p,v.camera);v.camera.position.lerp(rig.position,k);v.look.lerp(rig.look,k);v.camera.lookAt(v.look);
        v.root.querySelector('.nextAction strong').textContent=labels[task];v.root.querySelector('.nextAction span').textContent=instructions[task];
        const remaining=f?f.contactTime-f.t:99;const jumpNow=task==='spike'&&p.y<.2&&remaining<.68&&remaining>.18;const blockNow=task==='block'&&f?.kind==='spike'&&remaining<.65&&remaining>.12;
        const soon=f&&f.recipient===v.id&&Math.abs(remaining)<.30;v.root.querySelector('.nextAction').classList.toggle('ready',!!soon||jumpNow||blockNow);
        if(jumpNow){v.root.querySelector('.nextAction strong').textContent='起跳！';v.root.querySelector('.nextAction span').textContent='按起跳，再在空中擊球';}else if(blockNow){v.root.querySelector('.nextAction strong').textContent='起跳攔網！';}
        v.gradeTime=Math.max(0,(v.gradeTime||0)-dt);v.root.querySelector('.combo').textContent=v.gradeTime>0?v.gradeText||'':'';
        if(v.hintTime>0){v.hintTime-=dt;if(v.hintTime<=0)v.root.querySelector('.viewHint').classList.remove('visible');}
        const projected=ball.position.clone().project(v.camera),pointer=v.root.querySelector('.ballPointer');pointer.hidden=projected.x>-1&&projected.x<1&&projected.y>-1&&projected.y<1;
        pointer.style.left=clamp((projected.x*.5+.5)*v.rect.w,12,v.rect.w-30)+'px';pointer.style.top=clamp((-projected.y*.5+.5)*v.rect.h,90,v.rect.h-80)+'px';if(v.remote)v.pointer=pointer.hidden?null:{x:clamp(projected.x*.5+.5,.05,.95),y:clamp(-projected.y*.5+.5,.15,.7)};
      });
    }
    effects.update(match?.paused?0:dt,ball.position,screen==='result'?resultCamera:replay.playing?replayCamera:views[0]?.camera||setupCamera,screen==='play'&&match?.status==='play',match?.flight?.color,match?.flight?.grade);updateLocalAction();network?.broadcast();
    if(!match?.paused)labelLife=Math.max(0,labelLife-dt);strikeLabel.visible=labelLife>0&&!!match&&!replay.playing;strikeLabel.position.copy(ball.position).add(new THREE.Vector3(0,1.15,0));strikeLabel.material.opacity=Math.min(1,labelLife*4);ball.material.color.set(match?(replay.playing?replay.sample()?.flight?.color:match.flight?.color||match.strike?.color)||'#ffffff':'#ffffff');
    impactLife=Math.max(0,impactLife-dt);impact.visible=impactLife>0&&!replay.playing;impact.material.opacity=impactLife/.18;impact.scale.setScalar(1+(1-impactLife/.18)*2.2);impact.quaternion.copy((replay.playing?replayCamera:views[0]?.camera||setupCamera).quaternion);
    ballShadow.position.set(ball.position.x,.17,ball.position.z);ballShadow.scale.setScalar(.6+ball.position.y*.06);ballShadow.material.opacity=clamp(.27-ball.position.y*.015,.08,.27);
  }
  function showStrikeLabel(text,color){const g=strikeCanvas.getContext('2d');g.clearRect(0,0,512,128);g.font='italic 900 76px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=12;g.strokeStyle='#151021';g.strokeText(text,256,66);g.fillStyle=color;g.fillText(text,256,66);strikeTexture.needsUpdate=true;labelLife=1.0;strikeLabel.visible=true;}
  function updateTail(grade){
    trailRibbon.visible=trail.visible;if(!trailRibbon.visible)return;
    const points=trail.geometry.attributes.position,pos=trailRibbon.geometry.attributes.position,col=trailRibbon.geometry.attributes.color,camera=replay.playing?replayCamera:views[0]?.camera||setupCamera;
    const tint=trail.material.color,width=grade==='super'?.34:grade==='weak'?.12:.23;
    for(let i=0;i<12;i++){const p=new THREE.Vector3().fromBufferAttribute(points,i),near=new THREE.Vector3().fromBufferAttribute(points,Math.min(i+1,11)),tangent=near.sub(p);if(tangent.lengthSq()<.0001)tangent.set(0,0,1);const side=tangent.cross(camera.position.clone().sub(p)).normalize().multiplyScalar(width*(1-i/12));for(let j=0;j<2;j++){const v=p.clone().addScaledVector(side,j?1:-1),fade=1-i/12;pos.setXYZ(i*2+j,v.x,v.y,v.z);col.setXYZ(i*2+j,tint.r*fade,tint.g*fade,tint.b*fade);}}
    pos.needsUpdate=col.needsUpdate=true;
  }
  let shadowDone=false;
  function drawPlayerView(v){
    const occluders=players.filter((m,id)=>id!==v.id&&match.players[id].team===match.players[v.id].team&&Math.hypot(m.holder.position.x-v.camera.position.x,m.holder.position.z-v.camera.position.z)<8);
    occluders.forEach(m=>m.holder.visible=false);renderer.render(scene,v.camera);occluders.forEach(m=>m.holder.visible=true);
  }
  /* Remote room: every connected phone gets a private picture of its own player's camera (or the shared
   * replay/result camera). Rendered first into the shared WebGL canvas, copied to that phone's stream
   * canvas, then overdrawn by the host's own view(s) in the same frame so the host never shows it. */
  function renderRemoteViews(){
    if(!network?.remote)return;const dom=renderer.domElement,pr=renderer.getPixelRatio(),w=innerWidth,h=innerHeight;let any=false;
    for(const v of views){
      if(!v.remote)continue;const t=network.remoteTarget(v.id);if(!t)continue;
      const aspect=t.canvas.width/t.canvas.height;let rw=w,rh=w/aspect;if(rh>h){rh=h;rw=h*aspect;}rw=Math.max(2,Math.floor(rw));rh=Math.max(2,Math.floor(rh));
      v.rect={x:0,y:0,w:rw,h:rh};
      const shared=screen==='result'?resultCamera:replay.playing?replayCamera:null,cam=shared||v.camera,saved=[cam.aspect,cam.fov];
      cam.aspect=aspect;cam.fov=!shared?(aspect<.75?64:aspect<1.2?58:52):shared===resultCamera?(aspect<1?64:48):(aspect<1?66:48);cam.updateProjectionMatrix();
      renderer.setScissorTest(true);renderer.setViewport(0,0,rw,rh);renderer.setScissor(0,0,rw,rh);renderer.shadowMap.autoUpdate=!shadowDone;shadowDone=true;
      if(shared)renderer.render(scene,shared);else drawPlayerView(v);
      const sh=Math.round(rh*pr);t.ctx.drawImage(dom,0,dom.height-sh,Math.round(rw*pr),sh,0,0,t.canvas.width,t.canvas.height);
      cam.aspect=saved[0];cam.fov=saved[1];cam.updateProjectionMatrix();any=true;
    }
    if(any)renderer.setScissorTest(false);
  }
  function render(){const w=innerWidth,h=innerHeight;shadowDone=false;if(!match){renderer.setScissorTest(false);renderer.setViewport(0,0,w,h);renderer.shadowMap.autoUpdate=true;renderer.render(scene,setupCamera);return;}
    renderRemoteViews();
    if(screen==='result'){renderer.setScissorTest(false);renderer.setViewport(0,0,w,h);renderer.shadowMap.autoUpdate=!shadowDone;shadowDone=true;renderer.render(scene,resultCamera);return;}
    if(replay.playing){renderer.setScissorTest(false);renderer.setViewport(0,0,w,h);renderer.shadowMap.autoUpdate=!shadowDone;shadowDone=true;renderer.render(scene,replayCamera);return;}
    renderer.setScissorTest(true);views.filter(v=>!v.remote).forEach(v=>{const r=v.rect;renderer.setViewport(r.x,h-r.y-r.h,r.w,r.h);renderer.setScissor(r.x,h-r.y-r.h,r.w,r.h);renderer.shadowMap.autoUpdate=!shadowDone;shadowDone=true;drawPlayerView(v);});renderer.setScissorTest(false);
  }
  function resize(){resultCamera.aspect=innerWidth/innerHeight;resultCamera.fov=innerWidth/innerHeight<1?64:48;resultCamera.updateProjectionMatrix();replayCamera.aspect=innerWidth/innerHeight;replayCamera.fov=replayCamera.aspect<1?66:48;replayCamera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);setupCamera.aspect=innerWidth/innerHeight;setupCamera.fov=innerWidth/innerHeight<.9?62:45;setupCamera.updateProjectionMatrix();layoutViews();if(!match&&players.length&&$('setup').dataset.step==='lineup')setupStep('lineup');}
  function loop(t){requestAnimationFrame(loop);const dt=Math.min(last?(t-last)/1000:1/60,.15);last=t;if(document.hidden)return;updateScene(dt);render();slowFrames++;frameWindow+=dt;if(slowFrames>=90){if(frameWindow/slowFrames>.032&&pixelRatio>1){pixelRatio=1;renderer.setPixelRatio(1);resize();}slowFrames=frameWindow=0;}}
  function configureNetwork(){network=new VolleyNetwork({getState:()=>match?{...match.snapshot(),names:names(),screen,pointers:Object.fromEntries(views.filter(v=>v.remote).map(v=>[v.id,v.pointer||null]))}: {humans:humanIDs(),names:names(),screen:'setup',lobby:lobbyState()},getRoster:roster,onSelection:selectFromPhone,onResult:action=>{if(screen==='result'&&!$('result').hidden)$(action==='again'?'again':'change').click();},input:playerInput,onDisconnect:()=>{if(match&&screen==='play')pause(true);}});}
  function boot(){
    initScene();['hero','partner','rival','rivalPartner'].forEach((id,i)=>{for(const kind of CHAR_ORDER){const o=document.createElement('option');o.value=kind;o.textContent=CHARS[kind].stats.name;$(id).appendChild(o);}$(id).value=['waffle','tommy','karl','seafood'][i];$(id).onchange=()=>{if(screen==='setup'){modelLineup();network?.updateSeats(humanIDs(),names());}};});
    initSelection();configureNetwork();VolleyAudio.mount();
    const openRoom=()=>{$('roomHost').hidden=false;$('roomConnectionMode').hidden=false;$('roomModal').querySelector('h2').textContent='跟朋友玩';$('roomModal').hidden=false;};
    const openJoin=()=>{$('roomHost').hidden=true;$('roomConnectionMode').hidden=true;$('roomModal').querySelector('h2').textContent='加入房間';$('roomModal').hidden=false;$('joinCode').focus();};
    $('lobbyHome').onclick=()=>setupStep('entry');
    $('volleySolo').onclick=()=>{soloEntry=true;if(network.peer)network.close();$('playMode').querySelector('[data-value="solo"]').hidden=false;$('playMode').querySelector('[data-value="solo"]').click();$('friendsNote').hidden=true;setupStep('rules');};
    $('volleyFriends').onclick=()=>{soloEntry=false;setupStep('party');};
    $('partyBack').onclick=()=>setupStep('entry');$('partyJoin').onclick=openJoin;
    const friendRules=remote=>{selectedReady.fill(false);selectionStages.fill(0);selectedSlot=0;network.setRemote(remote);$('playMode').querySelector('[data-value="solo"]').hidden=false;$('playMode').querySelector('[data-value="coop"]').click();$('friendsNote').hidden=false;setupStep('rules');updateModeDescription();};$('volleyLocal').onclick=()=>friendRules(false);$('volleyRemote').onclick=()=>friendRules(true);
    $('setupEntryBack').onclick=()=>setupStep($('friendsNote').hidden?'entry':'party');$('setupNext').onclick=()=>setupStep('lineup');$('setupRulesBack').onclick=()=>setupStep('rules');
    $('entryJoin').onclick=openJoin;$('setupRoom').onclick=openRoom;
    $('skipReplay').onclick=()=>{replay.stop();trailPoints=[];};$('replayEnabled').onchange=e=>{replayEnabled=e.target.checked;if(!replayEnabled)replay.stop();};$('playMode').onclick=e=>{const b=e.target.closest('[data-value]');if(!b)return;playMode=b.dataset.value;document.querySelectorAll('#playMode button').forEach(o=>o.setAttribute('aria-pressed',String(o===b)));updateSlots();updateModeDescription();network.updateSeats(humanIDs(),names());};
    $('lobbyRoomManage').onclick=openRoom;$('lobbyRoomRetry').onclick=()=>{network.close();network.openHost();};$('start').onclick=()=>start(false);$('practice').onclick=()=>start(true);$('helpGo').onclick=()=>{sound();$('help').hidden=true;match.paused=false;};$('pause').onclick=()=>pause(!match.paused);$('resume').onclick=()=>pause(false);$('backSetup').onclick=showSetup;$('again').onclick=()=>start(false,false);$('change').onclick=()=>{showSetup();setupStep('lineup');};$('finishPractice').onclick=()=>start(false);$('sound').onclick=()=>{muted=!muted;VolleyAudio.setSfxMuted(muted);$('sound').textContent='音效 '+(muted?'關':'開');};
    ['roomOpen','hostRoom','pauseRoom'].forEach(id=>$(id).onclick=openRoom);$('joinRoom').onclick=openJoin;
    document.addEventListener('keydown',e=>{if(screen==='setup'&&$('setup').dataset.step==='lineup'&&$('roomModal').hidden&&!['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)){if(['ArrowLeft','ArrowRight','KeyA','KeyD'].includes(e.code)){e.preventDefault();const skinStep=selectionStages[selectedSlot]===1,choices=skinStep?Array.from({length:skinCount($(selectionIDs[selectedSlot]).value)},(_,i)=>i):CHAR_ORDER,current=skinStep?selectedSkins[selectedSlot]:CHAR_ORDER.indexOf($(selectionIDs[selectedSlot]).value),direction=['ArrowLeft','KeyA'].includes(e.code)?-1:1;document.querySelectorAll(skinStep?'#volleySkins button':'#volleyPortraits button')[(current+direction+choices.length)%choices.length].click();return;}if(e.code==='Enter'&&e.target===document.body){e.preventDefault();confirmSelection();return;}if(e.code==='Escape'){if(selectionStages[selectedSlot])$('selectionBack').click();else setupStep('rules');return;}}if(['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)&&screen==='setup')return;if(replay.active&&['Space','Enter'].includes(e.code)&&!match?.paused){e.preventDefault();replay.stop();trailPoints=[];return;}if(e.code==='Escape'){if(!$('roomModal').hidden){$('roomModal').hidden=true;return;}pause(!match?.paused);return;}
      if(!match||match.paused||screen!=='play'||!$('roomModal').hidden)return;const handled=['KeyA','KeyD','KeyJ','KeyK','Space','ArrowLeft','ArrowRight','Enter','ShiftLeft','ShiftRight','KeyF','KeyH','KeyR','KeyT','Numpad4','Numpad6','Numpad1','Numpad2'];if(!handled.includes(e.code))return;e.preventDefault();held.add(e.code);if(e.repeat)return;
      const actions=[{KeyJ:'hit',KeyK:'jump',Space:'jump'},{Enter:'hit',ShiftLeft:'jump',ShiftRight:'jump'},{KeyR:'hit',KeyT:'jump'},{Numpad1:'hit',Numpad2:'jump'}];match.humans.forEach((id,i)=>{if(actions[i][e.code])match.input(id,actions[i][e.code]);});
    });document.addEventListener('keyup',e=>held.delete(e.code));
    initLocalTouch();document.querySelectorAll('[data-action]').forEach(b=>b.onpointerdown=e=>{e.preventDefault();playerInput(match?.humans[0],'hit'===b.dataset.action?'hit':'jump');});
    document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);if(match)match.players[match.humans[0]].move=Number(b.dataset.move);held.add(Number(b.dataset.move)<0?'KeyA':'KeyD');};const stop=()=>{held.delete('KeyA');held.delete('KeyD');};b.onpointerup=stop;b.onpointercancel=stop;});
    addEventListener('resize',resize);addEventListener('blur',()=>{resetLocalStick();held.clear();if(!network?.connectedCount)pause(true);});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);last=0;});$('court').addEventListener('webglcontextlost',e=>{e.preventDefault();pause(true);$('feedback').textContent='畫面暫停，請重新載入球館';});
    resize();updateSlots();showSetup();$('loading').hidden=true;requestAnimationFrame(loop);
  }
  return {boot,input:playerInput,get state(){return match?{...match.snapshot(),screen,lineup:players.map(m=>({kind:m.kind,skin:m.skin})),replay:{active:replay.active,playing:replay.playing,cursor:replay.cursor},cameras:views.map(v=>({player:v.id,position:v.camera.position.toArray(),look:v.look.toArray(),fov:v.camera.fov,rect:{...v.rect}}))}:{screen:'setup',humans:humanIDs(),lobby:lobbyState()};}};
})();
