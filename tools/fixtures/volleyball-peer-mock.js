/* Test-only deterministic transport. Never packaged or served in production. */
(()=>{
 class Events{constructor(){this.handlers={};}on(t,fn){(this.handlers[t]??=[]).push(fn);return this;}emit(t,...a){for(const f of this.handlers[t]||[])f(...a);}}
 const connections=new Map();
 class Connection extends Events{constructor(peer,id){super();this.peer=peer;this.id=id;this.open=false;connections.set(id,this);}send(data){window.__peerBridge('data',{id:this.id,data});}close(){window.__peerBridge('close',{id:this.id});}}
 class Peer extends Events{
  constructor(id){super();if(typeof id!=='string')id='test-'+crypto.randomUUID();this.id=id;this.open=false;window.__testPeer=this;window.__peerBridge('register',{id}).then(()=>{this.open=true;this.emit('open',id);});}
  connect(target){const id=crypto.randomUUID(),c=new Connection(target,id);window.__peerBridge('connect',{id,from:this.id,target});return c;}
  destroy(){for(const c of connections.values())if(c.open)c.close();this.open=false;}
 }
 window.__peerNotify=(kind,data)=>{if(kind==='incoming'){const c=new Connection(data.from,data.id);window.__testPeer.emit('connection',c);}else{const c=connections.get(data.id);if(!c)return;if(kind==='open'){c.open=true;c.emit('open');}else if(kind==='data')c.emit('data',data.data);else if(kind==='close'){c.open=false;c.emit('close');}}};window.Peer=Peer;
})();
