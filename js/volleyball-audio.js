/* Music is deliberately lazy: no audio request until a real user gesture. */
'use strict';
const VolleyAudio=(()=>{
  const TRACK='audio/volleyball-theme.mp3',CHEER='audio/volleyball-victory.mp3',KEY='wvs_music_muted';
  const music=new Audio(),cheer=new Audio();music.preload=cheer.preload='none';music.loop=true;music.volume=.22;cheer.volume=.55;let muted=false,sfxMuted=false,unlocked=false,playing=false,button=null,duckTimer=null,stopTimer=null,state='setup',fallback=false;
  try{muted=localStorage.getItem(KEY)==='1';}catch(_){}
  function paint(){if(!button)return;button.textContent=muted?'音樂 關':playing?'音樂 開':'音樂 ▷';button.setAttribute('aria-pressed',String(!muted));button.setAttribute('aria-label',muted?'開啟背景音樂':'關閉背景音樂');}
  function start(){if(muted||document.hidden||!unlocked)return;if(!music.src)music.src=TRACK;music.volume=state==='result'?.14:state==='pause'?.08:.22;music.play().then(()=>{playing=true;paint();}).catch(()=>{playing=false;paint();});}
  function unlock(){unlocked=true;start();}
  function toggle(){unlocked=true;if(!playing&&!muted){start();return;}muted=!muted;try{localStorage.setItem(KEY,muted?'1':'0');}catch(_){}if(muted){music.pause();playing=false;}else start();paint();}
  function stopCheer(){clearTimeout(duckTimer);clearTimeout(stopTimer);cheer.pause();try{cheer.currentTime=0;}catch(_){}music.volume=.22;}
  function victory(){stopCheer();if(sfxMuted||!unlocked)return;music.volume=.075;cheer.src=CHEER;cheer.currentTime=0;cheer.play().catch(()=>{});stopTimer=setTimeout(()=>cheer.pause(),4500);duckTimer=setTimeout(()=>{music.volume=state==='result'?.14:.22;},4600);}
  music.addEventListener('error',()=>{if(fallback)return;fallback=true;music.src='audio/lobby.mp3';start();});
  function mount(){if(button)return;button=document.createElement('button');button.id='volleyMusic';button.type='button';button.onclick=toggle;document.querySelector('#nav>div').append(button);paint();document.addEventListener('pointerdown',e=>{if(e.target!==button)unlock();},{capture:true});document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();cheer.pause();playing=false;paint();}else start();});addEventListener('pagehide',()=>{music.pause();stopCheer();});}
  return {mount,unlock,toggle,setState(next){state=next;if(next!=='result')stopCheer();if(!music.paused)music.volume=next==='pause'?.08:next==='result'?.14:.22;},victory,setSfxMuted(value){sfxMuted=value;cheer.muted=value;},get state(){return{muted,playing,fallback,screen:state};}};
})();
