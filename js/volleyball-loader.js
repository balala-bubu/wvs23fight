'use strict';
(async()=>{
  const version='?v=20261023-volley16';
  const script=path=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=path+version;s.onload=resolve;s.onerror=()=>reject(new Error('無法載入 '+path));document.body.appendChild(s);});
  try{
    await script('js/volleyball-interaction.js');
    const room=new URLSearchParams(location.search).get('pad');
    if(room&&/^\d{6}$/.test(room)){
      // Phones never load Three.js, the court or any character assets.
      await script('js/volleyball-motion.js');await script('js/volleyball-network.js');await VolleyNetwork.phone(room);return;
    }
    await script('js/vendor/three-r128.min.js');await script('js/volleyball-rules.js');await script('js/volleyball-replay.js');await script('js/volleyball-effects.js');await script('js/volleyball-audio.js');await script('js/volleyball.js');await script('js/volleyball-models.js');await script('js/volleyball-court.js');await script('js/volleyball-motion.js');await script('js/volleyball-network.js');
    for(const name of ['waffle','tommy','karl','seafood','bear','serene','kiafes','newton','kattisbbb','jackson','janice','masterogway','kelsey','wxinyy','jennie','pudding','xuan','ichung'])await script('characters/'+name+'.js');Volleyball.boot();
  }catch(error){const panel=document.getElementById('loading');panel.innerHTML='<b>球館尚未準備好</b><span></span><button onclick="location.reload()">重新載入</button><a href="index.html">返回模式首頁</a>';panel.querySelector('span').textContent=error.message;console.error(error);}
})();
