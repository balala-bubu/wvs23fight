/* Browser motion adapter. Classifier is pure and can be replayed with sensor traces.
 * No raw sensor samples, camera images or microphone data leave the phone. */
'use strict';
class VolleyMotionClassifier{
  constructor(){this.gravity={x:0,y:9.81,z:0};this.lastGesture=-Infinity;this.lastMove=0;this.baselineRoll=0;this.calibrating=false;this.sampleCount=0;this.tilt=0;this.upCount=0;this.downCount=0;this.lastSample=0;this.sensitivity=1;this.swingAim=0;this.screenAngle=0;}
  calibrate(){this.calibrating=true;this.sampleCount=0;this.gravity={x:0,y:0,z:0};this.baselineRoll=0;}
  orientation(gamma){if(typeof gamma!=='number')return;if(this.calibrating){this.baselineRoll+=(gamma-this.baselineRoll)/Math.max(1,this.sampleCount);return;}this.tilt=Math.max(-1,Math.min(1,(gamma-this.baselineRoll)/40));}
  sample(event,time){
    const raw=event.accelerationIncludingGravity||{},a=event.acceleration||{};
    if(![raw.x,raw.y,raw.z].every(Number.isFinite))return {available:false};
    if(this.calibrating){this.sampleCount++;for(const k of ['x','y','z'])this.gravity[k]+=(raw[k]-this.gravity[k])/this.sampleCount;
      if(this.sampleCount>=25)this.calibrating=false;return {available:true,calibrating:this.calibrating,count:this.sampleCount};}
    let acceleration;
    if([a.x,a.y,a.z].every(Number.isFinite)){acceleration=a;for(const k of ['x','y','z'])this.gravity[k]+=(raw[k]-a[k]-this.gravity[k])*.65;}
    else{for(const k of ['x','y','z'])this.gravity[k]+=(raw[k]-this.gravity[k])*.06;acceleration={x:raw.x-this.gravity.x,y:raw.y-this.gravity.y,z:raw.z-this.gravity.z};}
    const gl=Math.hypot(this.gravity.x,this.gravity.y,this.gravity.z)||9.81,vertical=(acceleration.x*this.gravity.x+acceleration.y*this.gravity.y+acceleration.z*this.gravity.z)/gl;
    const angle=this.screenAngle*Math.PI/180,horizontal=acceleration.x*Math.cos(angle)-acceleration.y*Math.sin(angle);
    if(Math.abs(vertical)>2)this.swingAim=this.swingAim*.45+Math.max(-1,Math.min(1,horizontal/7))*.55;
    const aim=Math.abs(this.swingAim)<.22?0:Math.sign(this.swingAim)*(Math.abs(this.swingAim)-.22)/.78;
    const rotation=event.rotationRate||{},spin=Math.hypot(rotation.alpha||0,rotation.beta||0,rotation.gamma||0),strength=Math.hypot(acceleration.x,acceleration.y,acceleration.z);
    if(time-this.lastSample>150){this.upCount=0;this.downCount=0;}this.lastSample=time;
    const threshold=3.6/this.sensitivity;this.upCount=vertical>threshold?this.upCount+1:0;this.downCount=vertical<-threshold?this.downCount+1:0;
    let gesture=null;if(time-this.lastGesture<=310){this.upCount=0;this.downCount=0;}
    if(time-this.lastGesture>310){if(this.upCount>=2){gesture='up';this.lastGesture=time;this.upCount=0;}else if(this.downCount>=2&&(spin>90||strength>8)){gesture='down';this.lastGesture=time;this.downCount=0;}}
    if(gesture)this.swingAim=0;
    return {available:true,gesture,aim,strength,vertical,move:time-this.lastGesture>250?(Math.abs(this.tilt)>.24?this.tilt:0):0};
  }
}
class VolleyMotionController{
  constructor({onGesture=()=>{},onMove=()=>{},onStatus=()=>{}}={}){this.classifier=new VolleyMotionClassifier();this.onGesture=onGesture;this.onMove=onMove;this.onStatus=onStatus;this.enabled=false;this.samples=0;this.lastMoveTime=0;this.motion=e=>this.handle(e);this.orientation=e=>{this.classifier.screenAngle=window.screen?.orientation?.angle||window.orientation||0;this.classifier.orientation(e.gamma);};}
  async enable(){
    if(!window.isSecureContext)throw new Error('動作手把需要 HTTPS，請使用試玩站網址開啟。');
    if(!window.DeviceMotionEvent)throw new Error('這支手機沒有提供動作感測器，仍可使用觸控手把。');
    // Permission requests stay inside the explicit button gesture, as required on iOS.
    const requests=[];if(typeof DeviceMotionEvent.requestPermission==='function')requests.push(DeviceMotionEvent.requestPermission());if(typeof window.DeviceOrientationEvent?.requestPermission==='function')requests.push(DeviceOrientationEvent.requestPermission());
    const results=await Promise.all(requests);if(results.some(r=>r!=='granted'))throw new Error('尚未允許動作感測器。可在瀏覽器設定允許，或改用觸控手把。');
    this.disable();this.enabled=true;this.samples=0;addEventListener('devicemotion',this.motion);addEventListener('deviceorientation',this.orientation);
    clearTimeout(this.timeout);this.timeout=setTimeout(()=>{if(!this.samples)this.onStatus('沒有收到感測器資料，請使用 Safari／Chrome 開啟，或改用觸控。');},4000);
  }
  calibrate(){this.classifier.calibrate();this.onStatus('校正中，請握穩手機…');}
  handle(event){if(!this.enabled)return;this.samples++;const now=performance.now(),result=this.classifier.sample(event,now);if(!result.available)return;
    if(result.calibrating){this.onStatus('校正中 '+Math.min(100,Math.round(result.count/25*100))+'%');return;}
    if(this.classifier.sampleCount>=25){this.onStatus('校正完成，試著向上托起手機');this.classifier.sampleCount=0;}
    if(result.gesture)this.onGesture(result.gesture,result);if(now-this.lastMoveTime>70){this.onMove(result.move||0);this.lastMoveTime=now;}
  }
  disable(){this.enabled=false;removeEventListener('devicemotion',this.motion);removeEventListener('deviceorientation',this.orientation);clearTimeout(this.timeout);this.onMove(0);}
}
if(typeof module!=='undefined')module.exports={VolleyMotionClassifier};
