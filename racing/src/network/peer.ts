import source from '../../shared/vendor/peerjs-1.5.4.min.js?raw'
export type Channel = {peer:string;label:string;open:boolean;metadata?:unknown;dataChannel?:RTCDataChannel;send(data:unknown):void;close():void;on(name:string,fn:(data:any)=>void):void}
export type PeerClient = {id:string;open:boolean;destroyed:boolean;connect(id:string,options:unknown):Channel;destroy():void;on(name:string,fn:(data:any)=>void):void}
export type PeerFactory = new (id?:string,options?:unknown)=>PeerClient
export function peerFactory():PeerFactory {
 const w=window as unknown as {Peer?:PeerFactory}
 if(!w.Peer){const script=document.createElement('script');script.textContent=source;document.head.append(script);script.remove()}
 if(!w.Peer)throw Error('PeerJS 載入失敗')
 return w.Peer
}
