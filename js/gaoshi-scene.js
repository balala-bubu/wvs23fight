/* 世志土木 — renderer, scene and camera. Loaded before gaoshi-models.js, whose makeModel() adds to `scene`. */
'use strict';
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 400);
scene.add(new THREE.HemisphereLight(0xffe4c8, 0x4a3828, 0.85));
const sunLight = new THREE.DirectionalLight(0xffd2a8, 0.95); sunLight.position.set(-8, 14, 12); scene.add(sunLight);
const rimLight = new THREE.DirectionalLight(0x9ab8ff, 0.3); rimLight.position.set(6, 5, -10); scene.add(rimLight);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Frame the fixed 32×18 world (PLAN §3): the screen size only moves the camera, never the level.
function fitCamera(){
  const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h;
  const needH = Math.max(19.5, 33.5 / camera.aspect), dist = (needH / 2) / Math.tan(camera.fov * Math.PI / 360);
  camera.position.set(0, 9.4, dist); camera.lookAt(0, 9, 0); camera.updateProjectionMatrix();
}
addEventListener('resize', fitCamera); fitCamera();
