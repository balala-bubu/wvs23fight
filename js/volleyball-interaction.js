/* Disable double-tap zoom without disabling normal page scrolling/pinch zoom. */
'use strict';
(()=>{
  document.addEventListener('dblclick',e=>{if(e.target instanceof Element&&e.target.closest('button,a,canvas,[role="button"],[role="slider"],.volleyPortraits'))e.preventDefault();});
  const canvas=document.getElementById('court');let last=null;
  canvas?.addEventListener('touchend',e=>{if(e.changedTouches.length!==1){last=null;return;}const p=e.changedTouches[0],now=performance.now();if(last&&now-last.time<320&&Math.hypot(p.clientX-last.x,p.clientY-last.y)<28)e.preventDefault();last={time:now,x:p.clientX,y:p.clientY};},{passive:false});
})();
