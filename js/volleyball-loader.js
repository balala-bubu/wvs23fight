'use strict';
(async()=>{
  const version='?v=20261025-restore-pre-avalon';
  const $=id=>document.getElementById(id),bar=$('loadBar'),status=$('loadStatus');let done=0;
  const slow=setTimeout(()=>{if($('loadHint'))$('loadHint').textContent='載入比平常久，仍在等待資源；也可以重新載入。';if($('loadRecovery'))$('loadRecovery').hidden=false;},15000);
  const tick=()=>{if(bar)bar.value=++done;if(status)status.textContent=done<11?'正在準備球館…':'正在準備選手…';};
  const script=path=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=path+version;s.onload=()=>{tick();resolve();};s.onerror=()=>reject(new Error('無法載入 '+path));document.body.appendChild(s);});
  try{
    await script('js/volleyball-interaction.js');
    const room=new URLSearchParams(location.search).get('pad');
    if(room&&/^\d{6}$/.test(room)){
      // Phones never load Three.js, the court or any character assets.
      await script('js/volleyball-motion.js');await script('js/volleyball-network.js');await VolleyNetwork.phone(room);return;
    }
    await script('js/vendor/three-r128.min.js');await script('js/volleyball-rules.js');await script('js/volleyball-replay.js');await script('js/volleyball-effects.js');await script('js/volleyball-audio.js');await script('js/volleyball.js');await script('js/volleyball-models.js');await script('js/volleyball-court.js');await script('js/volleyball-motion.js');await script('js/volleyball-network.js');
    for(const name of ['waffle','tommy','karl','seafood','bear','serene','kiafes','newton','kattisbbb','jackson','janice','masterogway','kelsey','wxinyy','jennie','pudding','xuan','ichung'])await script('characters/'+name+'.js');Volleyball.boot();
  }catch(error){clearTimeout(slow);if(status)status.textContent='球館尚未準備好：'+error.message;if($('loadRecovery'))$('loadRecovery').hidden=false;console.error(error);}
})();
