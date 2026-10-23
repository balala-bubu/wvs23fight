/* Music is deliberately lazy: no audio request until a real user gesture. */
'use strict';
const VolleyAudio=(()=>{
  const HOME='audio/volleyball-theme.mp3',MATCH='audio/volleyball-beach.mp3',CHEER='audio/volleyball-victory.mp3',KEY='wvs_music_muted';
  /* Menus keep the original theme; the match (and its pause menu) uses the beach track. */
  const trackFor=s=>s==='play'||s==='pause'?MATCH:HOME;
  /* Match level is kept low so hit/spike sounds stay on top. */
  const level=s=>s==='result'?.14:s==='pause'?.06:s==='play'?.12:.22;
  const music=new Audio(),cheer=new Audio();music.preload=cheer.preload='none';music.loop=true;music.volume=.10;cheer.volume=.55;let muted=false,sfxMuted=false,unlocked=false,playing=false,button=null,duckTimer=null,stopTimer=null,state='setup',fallback=false,cur='';
  function useTrack(){cur=trackFor(state);music.src=cur;}
  try{muted=localStorage.getItem(KEY)==='1';}catch(_){}
  function paint(){if(!button)return;button.textContent=muted?'音樂 關':playing?'音樂 開':'音樂 ▷';button.setAttribute('aria-pressed',String(!muted));button.setAttribute('aria-label',muted?'開啟背景音樂':'關閉背景音樂');}
  function start(){if(muted||document.hidden||!unlocked)return;if(!cur)useTrack();music.volume=level(state);music.play().then(()=>{playing=true;paint();}).catch(()=>{playing=false;paint();});}
  function unlock(){unlocked=true;start();}
  function toggle(){unlocked=true;if(!playing&&!muted){start();return;}muted=!muted;try{localStorage.setItem(KEY,muted?'1':'0');}catch(_){}if(muted){music.pause();playing=false;}else start();paint();}
  function stopCheer(){clearTimeout(duckTimer);clearTimeout(stopTimer);cheer.pause();try{cheer.currentTime=0;}catch(_){}music.volume=level(state);}
  function victory(){stopCheer();if(sfxMuted||!unlocked)return;music.volume=.05;cheer.src=CHEER;cheer.currentTime=0;cheer.play().catch(()=>{});stopTimer=setTimeout(()=>cheer.pause(),4500);duckTimer=setTimeout(()=>{music.volume=level(state);},4600);}
  music.addEventListener('error',()=>{if(fallback)return;fallback=true;music.src='audio/lobby.mp3';start();});
  function mount(){if(button)return;button=document.createElement('button');button.id='volleyMusic';button.type='button';button.onclick=toggle;document.querySelector('#nav>div').append(button);paint();document.addEventListener('pointerdown',e=>{if(e.target!==button)unlock();},{capture:true});document.addEventListener('keydown',unlock);document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();cheer.pause();playing=false;paint();}else start();});addEventListener('pagehide',()=>{music.pause();stopCheer();});}
  return {mount,unlock,toggle,setState(next){state=next;if(!fallback&&cur&&trackFor(next)!==cur){useTrack();if(playing&&!muted)start();}if(next!=='result')stopCheer();if(!music.paused)music.volume=level(next);},victory,setSfxMuted(value){sfxMuted=value;cheer.muted=value;},get state(){return{muted,playing,fallback,screen:state};}};
})();
