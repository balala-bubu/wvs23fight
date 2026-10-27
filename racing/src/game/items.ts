import {itemCharges, type ItemKind} from './itemCatalog'
import {makeShot} from './itemProjectiles'
import {Tracker} from './track'
import * as THREE from 'three'
import { COLLISION, groups } from '../engine/kart'
import { RAPIER, type Physics } from '../engine/physics'
import { Trail } from '../engine/trail'
import { CONFIG } from './config'
import type { Fx } from './fx'
import { customInstance, findNode, hasCustom, itemSlot } from './customAssets'
import { Parts } from './kartModel'
import type { Racer } from './racer'
import { rollItem } from './rules'
import type { Track } from './track'

/**
 * Items: Candy Crates on the track (break into Rapier-simulated shards), and the four original
 * items — Bubble Shield, Pepper Blast, Taffy Trap (dropped behind), Homing Bee (chases the racer
 * directly ahead). Effects are reported through `ItemHooks` so audio/UI stay decoupled.
 */
export type ItemHooks = {
  sfx(name: string, at: THREE.Vector3, gain?: number): void
  hit(victim: Racer, by: Racer | null, kind: 'bee' | 'taffy'): void
  blocked(victim: Racer): void
  got(racer: Racer): void
}

type Shot={kind:number;mesh:THREE.Group;pos:THREE.Vector3;vel:THREE.Vector3;owner:Racer;life:number;age:number;tracker:Tracker;hits:Set<number>}

type Crate = { mesh: THREE.Group; pos: THREE.Vector3; respawn: number; spin: number }
type Shard = { mesh: THREE.Mesh; body: RAPIER.RigidBody; life: number }
type Trap = { mesh: THREE.Group; body: RAPIER.RigidBody; owner: Racer; life: number; armed: number; wobble: number }
type Bee = { mesh: THREE.Group; owner: Racer; target: Racer | null; s: number; lateral: number; pos: THREE.Vector3; life: number; trail: Trail; wing: THREE.Object3D[]; path: 'main' }

const crateGeo = (() => {
  const p = new Parts()
  p.add(new THREE.BoxGeometry(1.5, 1.5, 1.5), '#ffffff')
  // Ribbon bands (tinted by instance colour through the material below).
  p.add(new THREE.BoxGeometry(1.56, 1.56, 0.34), '#fff3a8')
  p.add(new THREE.BoxGeometry(0.34, 1.56, 1.56), '#fff3a8')
  const g = p.mesh().geometry
  return g
})()

function bowGeometry(): THREE.BufferGeometry {
  const p = new Parts()
  p.add(new THREE.TorusGeometry(0.28, 0.1, 5, 8), '#ffe066', [0.26, 0.95, 0], [0, Math.PI / 2, 0.5])
  p.add(new THREE.TorusGeometry(0.28, 0.1, 5, 8), '#ffe066', [-0.26, 0.95, 0], [0, Math.PI / 2, -0.5])
  p.add(new THREE.IcosahedronGeometry(0.14, 0), '#ffd23f', [0, 0.86, 0])
  // Paw print on each side face (no text or symbols).
  for (const [rx, ry] of [[0, 0], [0, Math.PI / 2], [0, Math.PI], [0, -Math.PI / 2]]) {
    const q = new THREE.Euler(rx, ry, 0)
    const place = (x: number, y: number, r: number) => {
      const v = new THREE.Vector3(x, y, 0.79).applyEuler(q)
      p.add(new THREE.CylinderGeometry(r, r, 0.04, 8), '#ffffff', [v.x, v.y, v.z], [Math.PI / 2, ry, 0])
    }
    place(0.38, -0.36, 0.17)
    place(0.2, -0.1, 0.07)
    place(0.38, -0.02, 0.07)
    place(0.56, -0.1, 0.07)
  }
  return p.mesh().geometry
}

export class Items {
  readonly shots:Shot[]=[]
  readonly crates: Crate[] = []
  readonly traps: Trap[] = []
  readonly bees: Bee[] = []
  private readonly shards: Shard[] = []
  private readonly group = new THREE.Group()
  private readonly crateMats: THREE.MeshStandardMaterial[] = []
  private readonly shardGeo = new THREE.BoxGeometry(0.55, 0.55, 0.12)
  private readonly shardMats = ['#ff7ab6', '#7fe0ff', '#ffe066', '#b58cff'].map(c => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.4, emissive: c, emissiveIntensity: 0.25 }))
  private readonly bowGeo = bowGeometry()
  private time = 0
  private remoteMeshes: THREE.Object3D[] = []

  constructor(scene: THREE.Scene, private readonly physics: Physics, private readonly track: Track, private readonly fx: Fx, private readonly hooks: ItemHooks) {
    scene.add(this.group)
    const colors = ['#ff7ab6', '#7fd9ff', '#b58cff', '#ffb347']
    track.itemSpots.forEach((spot, i) => {
      const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], vertexColors: true, flatShading: true, roughness: 0.25, metalness: 0.05, emissive: colors[i % colors.length], emissiveIntensity: 0.28, transparent: true, opacity: 0.94 })
      this.crateMats.push(mat)
      const g = new THREE.Group()
      const custom = customInstance(itemSlot('crate'))
      if (custom) g.add(custom)
      else {
        const body = new THREE.Mesh(crateGeo, mat)
        body.castShadow = true
        const bow = new THREE.Mesh(this.bowGeo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.3 }))
        g.add(body, bow)
      }
      g.position.copy(spot.pos)
      this.group.add(g)
      this.crates.push({ mesh: g, pos: spot.pos.clone(), respawn: 0, spin: i * 0.7 })
    })
  }

  reset(): void {
    for(const shot of this.shots)this.group.remove(shot.mesh)
    this.shots.length=0
    for(const mesh of this.remoteMeshes)this.group.remove(mesh)
    this.remoteMeshes=[]
    for (const c of this.crates) {
      c.respawn = 0
      c.mesh.visible = true
      c.mesh.scale.setScalar(1)
    }
    for (const t of this.traps) this.removeTrap(t)
    this.traps.length = 0
    for (const b of this.bees) this.group.remove(b.mesh, b.trail.mesh)
    this.bees.length = 0
    for (const s of this.shards) this.removeShard(s)
    this.shards.length = 0
  }

  /** Fixed-step simulation of crates, traps, bees and shards. */
  step(dt: number, racers: Racer[], ordered: Racer[]): void {
    this.time += dt
    // Crates.
    for (const c of this.crates) {
      if (c.respawn > 0) {
        c.respawn -= dt
        if (c.respawn <= 0) {
          c.mesh.visible = true
          c.mesh.scale.setScalar(0.01)
        }
        continue
      }
      for (const r of racers) {
        if (r.respawnTime > 0) continue
        const d = r.position.distanceToSquared(c.pos)
        if (d < 2.3 * 2.3) {
          this.breakCrate(c, r)
          if (!r.item && r.roulette <= 0) {
            r.roulette = CONFIG.items.roulette
            r.rouletteItem = rollItem(r.place - 1, racers.length, Math.random)
            this.hooks.got(r)
          }
          break
        }
      }
    }
    this.stepExtras(dt,racers)
    // Roulettes.
    for (const r of racers) {
      if (r.roulette > 0) {
        r.roulette -= dt
        if (r.roulette <= 0) {
          r.item = r.rouletteItem
          r.itemUses=0
          r.rouletteItem = null
          r.aiItemDelay = 0.6 + Math.random() * 2.2
        }
      }
      r.shieldTime = Math.max(0, r.shieldTime - dt)
      r.goo = Math.max(0, r.goo - dt)
      r.incomingBee = 0
    }
    // Traps.
    for (let i = this.traps.length - 1; i >= 0; i -= 1) {
      const t = this.traps[i]
      t.life -= dt
      t.armed -= dt
      t.wobble = Math.max(0, t.wobble - dt)
      const tp = t.body.translation()
      if (t.life <= 0 || tp.y < -30) {
        this.removeTrap(t)
        this.traps.splice(i, 1)
        continue
      }
      for (const r of racers) {
        if (r.respawnTime > 0 || (r === t.owner && t.armed > 0)) continue
        const dx = r.position.x - tp.x
        const dy = r.position.y - tp.y
        const dz = r.position.z - tp.z
        if (dx * dx + dz * dz < 1.75 * 1.75 && Math.abs(dy) < 2) {
          const at = new THREE.Vector3(tp.x, tp.y, tp.z)
          this.fx.goo(at)
          this.hooks.sfx('taffyHit', at)
          if (this.protected(r)) {
            this.fx.bubblePop(r.position)
          } else {
            r.kart.stick(CONFIG.items.trapStick)
            r.kart.spinOut(0.55, 0.6)
            r.goo = CONFIG.items.trapStick
            r.kart.impulse(new THREE.Vector3(0, 5.5, 0))
            r.bounce(1.2)
            this.hooks.hit(r, t.owner === r ? null : t.owner, 'taffy')
          }
          this.removeTrap(t)
          this.traps.splice(i, 1)
          break
        }
      }
    }
    // Bees.
    for (let i = this.bees.length - 1; i >= 0; i -= 1) {
      const b = this.bees[i]
      b.life -= dt
      if (b.target && b.target.finished) b.target = null
      let hit = false
      if (b.life <= 0) {
        this.fx.ring(b.pos, '#ffe066', 10, 4)
        this.removeBee(b)
        this.bees.splice(i, 1)
        continue
      }
      const target = b.target
      const speed = CONFIG.items.beeSpeed
      if (target) target.incomingBee = Math.max(target.incomingBee, 1)
      const dist = target ? b.pos.distanceTo(target.position) : Infinity
      if (target && dist < CONFIG.items.beeHoming) {
        // Final dive straight at the target.
        const dir = target.position.clone().add(new THREE.Vector3(0, 0.6, 0)).sub(b.pos)
        const len = dir.length()
        b.pos.addScaledVector(dir.normalize(), Math.min(len, speed * 1.1 * dt))
        b.s = target.tracker.loc.path === 'main' ? target.tracker.loc.s : b.s
        if (len < 1.8) hit = true
      } else {
        // Follow the racing line toward the target's lateral position.
        b.s = this.track.main.wrap(b.s + speed * dt)
        const lat = target ? (target.tracker.loc.path === 'main' ? target.tracker.loc.lateral : 0) : 0
        b.lateral += (lat - b.lateral) * (1 - Math.exp(-2 * dt))
        const p = this.track.main.pointAt(b.s, b.lateral)
        p.y += 1.6 + Math.sin(this.time * 9 + i) * 0.3
        b.pos.lerp(p, 1 - Math.exp(-12 * dt))
      }
      if (hit && target) {
        this.fx.pollen(target.position)
        this.hooks.sfx('beeHit', target.position)
        if (this.protected(target)) {
          this.fx.bubblePop(target.position)
        } else {
          target.kart.spinOut(CONFIG.items.beeSpin, 0.3)
          const side = new THREE.Vector3((Math.random() - 0.5) * 6, 7.5, (Math.random() - 0.5) * 6)
          target.kart.impulse(side)
          target.bounce(1.6)
          this.hooks.hit(target, b.owner, 'bee')
        }
        this.removeBee(b)
        this.bees.splice(i, 1)
      }
    }
    // Shards.
    for (let i = this.shards.length - 1; i >= 0; i -= 1) {
      const s = this.shards[i]
      s.life -= dt
      if (s.life <= 0) {
        this.removeShard(s)
        this.shards.splice(i, 1)
      }
    }
    void ordered
  }

  networkVisuals(crates:number[],traps:number[][],bees:number[][],shots:number[][]=[]):void {
    this.crates.forEach((c,i)=>{c.mesh.visible=crates[i]===1})
    const list=[...shots.map(v=>({slot:'shot:'+v[0],v:[v[1],v[2],v[3],v[4]]})),...traps.map(v=>({slot:'taffy' as const,v})),...bees.map(v=>({slot:'bee' as const,v}))]
    while(this.remoteMeshes.length>list.length)this.group.remove(this.remoteMeshes.pop()!)
    list.forEach(({slot,v},i)=>{
      let mesh=this.remoteMeshes[i]
      if(!mesh||mesh.userData.remoteSlot!==slot){if(mesh)this.group.remove(mesh);mesh=slot.startsWith('shot:')?makeShot(+slot.slice(5)):customInstance(itemSlot(slot as 'bee'|'taffy'))??new THREE.Group();mesh.userData.remoteSlot=slot;this.remoteMeshes[i]=mesh;this.group.add(mesh)}
      mesh.position.set(v[0],v[1],v[2])
      if(slot==='taffy')mesh.quaternion.set(v[3],v[4],v[5],v[6]);else {mesh.rotation.y=v[3];for(const name of ['wing_l','wing_r']){const wing=findNode(mesh,name);if(wing)wing.rotation.z=Math.sin(this.time*32)*.5}}
    })
  }

  /** Render-rate animation (spinning crates, wings, shard sync). */
  animate(dt: number, time: number): void {
    this.time=time
    for(const s of this.shots){s.mesh.position.copy(s.pos);s.mesh.rotation.y=s.kind===2||s.kind===3?time*12:Math.atan2(s.vel.x,s.vel.z)}
    for (const c of this.crates) {
      if (!c.mesh.visible) continue
      c.mesh.rotation.y = time * 1.4 + c.spin
      c.mesh.rotation.x = Math.sin(time * 1.3 + c.spin) * 0.18
      c.mesh.position.y = c.pos.y + Math.sin(time * 2.2 + c.spin) * 0.22
      const s = c.mesh.scale.x
      if (s < 1) c.mesh.scale.setScalar(Math.min(1, s + dt * 4 * (1.2 - s)))
    }
    this.crateMats.forEach((m, i) => (m.emissiveIntensity = 0.22 + Math.sin(time * 4 + i) * 0.1))
    for (const s of this.shards) {
      const t = s.body.translation()
      const r = s.body.rotation()
      s.mesh.position.set(t.x, t.y, t.z)
      s.mesh.quaternion.set(r.x, r.y, r.z, r.w)
      if (s.life < 0.5) s.mesh.scale.setScalar(Math.max(0.01, s.life / 0.5))
    }
    for (const t of this.traps) {
      const p = t.body.translation()
      const r = t.body.rotation()
      t.mesh.position.set(p.x, p.y - 0.25, p.z)
      t.mesh.quaternion.set(r.x, r.y, r.z, r.w)
      const w = 1 + Math.sin(time * 5 + p.x) * 0.05
      t.mesh.scale.set(w, 1 / w, w)
    }
    for (const b of this.bees) {
      b.mesh.position.copy(b.pos)
      const ahead = b.target ? b.target.position : this.track.main.pointAt(b.s + 5)
      b.mesh.lookAt(ahead.x, b.pos.y, ahead.z)
      for (const [k, w] of b.wing.entries()) w.rotation.z = (k ? -1 : 1) * (0.5 + Math.sin(time * 70) * 0.5)
      b.trail.update(b.pos, new THREE.Vector3(0, 1, 0), true)
      if (Math.random() < 0.5) this.fx.glow.spawn({ pos: b.pos, vel: new THREE.Vector3((Math.random() - 0.5) * 2, 0.5, (Math.random() - 0.5) * 2), life: 0.35, size: 0.18, endSize: 0, color: new THREE.Color('#ffe066'), drag: 2 })
    }
  }

  // ─── item use ────────────────────────────────────────────────────

  use(r: Racer, ordered: Racer[]): ItemKind | null {
    const held=r.item
    if(!held)return null
    const remaining=(r.itemUses||itemCharges(held))-1
    r.itemUses=remaining;r.item=remaining>0?held:null;r.aiItemDelay=.55
    const party=['shield','pepper','shell','bee','taffy','bomb','star','coin'] as const
    const resolved:ItemKind=held==='partyBox'?party[7-remaining]:held
    const aliases:Partial<Record<ItemKind,ItemKind>>={triplePepper:'pepper',tripleTaffy:'taffy',tripleBee:'bee',tripleShell:'shell'}
    const kind=aliases[resolved]??resolved
    const k = r.kart
    const fwd = k.forward.clone()
    switch (kind) {
      case 'shell':this.launchShot(r,0);break
      case 'fire':this.launchShot(r,3);break
      case 'boomerang':this.launchShot(r,2);break
      case 'bomb':this.launchShot(r,1);break
      case 'goldenPepper':r.goldenTime=8;k.boost(8,1.2);break
      case 'star':r.invincibleTime=8;k.boost(2,1.12);this.fx.ring(r.position,'#ffe066',20,8,1);break
      case 'rocket':r.rocketTime=6;r.invincibleTime=Math.max(r.invincibleTime,6);k.boost(6,1.28);break
      case 'coin':r.coins=Math.min(10,r.coins+2);this.fx.ring(r.position,'#ffe066',12,6,.6);break
      case 'ghost':{
        r.ghostTime=4
        const victim=ordered.find(o=>o!==r&&o.item&&!o.finished)
        if(victim){r.item=victim.item;r.itemUses=victim.itemUses;victim.item=null;victim.itemUses=0}
        this.fx.ring(r.position,'#b7a0ff',16,7,.6);break
      }
      case 'chomp':r.chompTime=7;r.chompCooldown=0;break
      case 'ink':for(const o of ordered)if(o!==r&&!o.finished&&o.place<r.place&&!this.protected(o))o.inkTime=4;break
      case 'lightning':
        for(const o of ordered)if(o!==r&&!o.finished&&!this.protected(o)){o.smallTime=5;o.item=null;o.itemUses=0;o.coins=Math.max(0,o.coins-3);o.kart.spinOut(.6,.6);this.fx.ring(o.position,'#ffe066',10,5,.6)}
        break
      case 'horn':this.blast(r.position,8,r,ordered);this.clearNearby(r.position,12);break
      case 'leader':{const target=ordered.find(o=>o!==r&&!o.finished);if(target)this.launchBee(r,target);break}
      case 'shield':
        r.shieldTime = CONFIG.items.shieldSeconds
        this.fx.ring(r.position, '#9ff4ff', 18, 6, 1)
        this.hooks.sfx('shieldUp', r.position)
        break
      case 'pepper':
        k.boost(CONFIG.items.pepperSeconds, CONFIG.items.pepperPower)
        k.cancelDrift()
        this.fx.ring(r.position.clone().addScaledVector(fwd, -1.5), '#ff5a36', 16, 7, 0.5)
        this.hooks.sfx('pepper', r.position)
        break
      case 'taffy':
        this.dropTrap(r)
        this.hooks.sfx('taffyDrop', r.position)
        break
      case 'bee': {
        const idx = ordered.indexOf(r)
        const target = idx > 0 ? ordered[idx - 1] : null
        this.launchBee(r, target)
        this.hooks.sfx('beeLaunch', r.position)
        break
      }
    }
    return kind
  }

  private protected(r:Racer):boolean {
    if(r.invincibleTime>0||r.rocketTime>0||r.ghostTime>0)return true
    if(r.shieldTime>0){r.shieldTime=0;this.hooks.blocked(r);return true}
    return false
  }
  private damage(r:Racer,owner:Racer):void {
    if(r.finished||this.protected(r))return
    r.kart.spinOut(1,.5);r.coins=Math.max(0,r.coins-2);r.bounce(1);this.hooks.hit(r,owner===r?null:owner,'bee')
  }
  private blast(pos:THREE.Vector3,radius:number,owner:Racer,racers:Racer[]):void {
    this.fx.ring(pos,'#ffba55',24,10,.8)
    this.hooks.sfx('beeHit',pos)
    for(const r of racers)if(r!==owner&&r.position.distanceToSquared(pos)<radius*radius)this.damage(r,owner)
  }
  private clearNearby(pos:THREE.Vector3,radius:number):void {
    for(let i=this.bees.length-1;i>=0;i--)if(this.bees[i].pos.distanceTo(pos)<radius){this.removeBee(this.bees[i]);this.bees.splice(i,1)}
    for(let i=this.shots.length-1;i>=0;i--)if(this.shots[i].pos.distanceTo(pos)<radius){this.group.remove(this.shots[i].mesh);this.shots.splice(i,1)}
    for(let i=this.traps.length-1;i>=0;i--){const p=this.traps[i].body.translation();if(Math.hypot(p.x-pos.x,p.z-pos.z)<radius){this.removeTrap(this.traps[i]);this.traps.splice(i,1)}}
  }
  private launchShot(owner:Racer,kind:number):void {
    const dir=owner.kart.forward.clone(),pos=owner.position.clone().addScaledVector(dir,kind===1?-2.5:2.4),mesh=makeShot(kind)
    const speed=kind===1?-5:kind===3?34:30
    this.group.add(mesh);this.shots.push({kind,mesh,pos,vel:dir.multiplyScalar(speed),owner,life:kind===1?2:kind===2?3:5,age:0,tracker:new Tracker(),hits:new Set()})
    if(this.shots.length>24){const old=this.shots.shift()!;this.group.remove(old.mesh)}
    this.hooks.sfx('beeLaunch',owner.position)
  }
  private stepExtras(dt:number,racers:Racer[]):void {
    for(const r of racers){
      for(const field of ['invincibleTime','smallTime','rocketTime','goldenTime','inkTime','ghostTime','chompTime','chompCooldown'] as const)r[field]=Math.max(0,r[field]-dt)
      if(r.goldenTime>0)r.kart.boostTime=Math.max(r.kart.boostTime,.2)
      if(r.invincibleTime>0||r.rocketTime>0){r.kart.spinTime=0;r.kart.stickTime=0;r.kart.stunTime=0}
      if(r.chompTime>0&&r.chompCooldown<=0){r.chompCooldown=.8;const forward=r.kart.forward;const target=racers.find(o=>o!==r&&!o.finished&&o.position.distanceToSquared(r.position)<64&&o.position.clone().sub(r.position).dot(forward)>0);if(target){this.damage(target,r);r.kart.boost(.3,1.1);this.fx.ring(target.position,'#8fdd70',10,5,.3)}}
      r.kart.collider.setCollisionGroups(groups(COLLISION.KART,COLLISION.WALL|(r.ghostTime>0?0:COLLISION.KART)))
    }
    for(let i=this.shots.length-1;i>=0;i--){
      const s=this.shots[i];s.life-=dt;s.age+=dt
      if(s.kind===1&&s.life<=0){this.blast(s.pos,9,s.owner,racers);this.group.remove(s.mesh);this.shots.splice(i,1);continue}
      if(s.life<=0){this.group.remove(s.mesh);this.shots.splice(i,1);continue}
      if(s.kind===2&&s.age>1.3){s.vel.copy(s.owner.position).sub(s.pos).normalize().multiplyScalar(32);if(s.pos.distanceTo(s.owner.position)<1.6){this.group.remove(s.mesh);this.shots.splice(i,1);continue}}
      s.pos.addScaledVector(s.vel,dt)
      const loc=this.track.locate(s.pos,s.tracker);s.pos.y=loc.height+.65
      if(Math.abs(loc.lateral)>loc.half+1){const path=loc.path==='main'?this.track.main:this.track.short,right=path.at(loc.s).right;s.vel.addScaledVector(right,-2*s.vel.dot(right));s.pos.copy(path.pointAt(loc.s,Math.sign(loc.lateral)*(loc.half-.4))).setY(loc.height+.65)}
      if(s.kind===1){s.vel.multiplyScalar(Math.exp(-3*dt));continue}
      let remove=false
      for(const r of racers)if(r!==s.owner&&!r.finished&&!s.hits.has(r.id)&&r.position.distanceToSquared(s.pos)<3){this.damage(r,s.owner);s.hits.add(r.id);if(s.kind!==2)remove=true}
      if(remove){this.group.remove(s.mesh);this.shots.splice(i,1)}
    }
  }

  /** Bee that is chasing `r`, if any (for UI warnings / AI shield timing). */
  beeFor(r: Racer): Bee | undefined {
    return this.bees.find(b => b.target === r)
  }

  obstacles(): { position: THREE.Vector3; radius: number; hazard: boolean }[] {
    return this.traps.map(t => {
      const p = t.body.translation()
      return { position: new THREE.Vector3(p.x, p.y, p.z), radius: 1.3, hazard: true }
    })
  }

  private breakCrate(c: Crate, r: Racer): void {
    c.mesh.visible = false
    c.respawn = CONFIG.items.boxRespawn
    this.fx.confetti(c.pos, 22, 0.9)
    this.fx.ring(c.pos, '#ffffff', 12, 7, 0.5)
    this.hooks.sfx('crate', c.pos)
    const vel = r.kart.velocity
    for (let i = 0; i < 7; i += 1) {
      const mesh = new THREE.Mesh(this.shardGeo, this.shardMats[i % this.shardMats.length])
      mesh.position.copy(c.pos).add(new THREE.Vector3((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2))
      mesh.castShadow = true
      this.group.add(mesh)
      const body = this.physics.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
          .setLinvel(vel.x * 0.7 + (Math.random() - 0.5) * 9, 4 + Math.random() * 6, vel.z * 0.7 + (Math.random() - 0.5) * 9)
          .setAngvel({ x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20, z: (Math.random() - 0.5) * 20 })
          .setLinearDamping(0.3),
      )
      this.physics.world.createCollider(
        RAPIER.ColliderDesc.cuboid(0.27, 0.27, 0.06).setRestitution(0.45).setFriction(0.6).setDensity(0.6).setCollisionGroups(groups(COLLISION.DEBRIS, COLLISION.GROUND | COLLISION.WALL)),
        body,
      )
      this.shards.push({ mesh, body, life: 1.8 + Math.random() * 0.6 })
    }
  }

  private dropTrap(r: Racer): void {
    const k = r.kart
    const fwd = k.forward
    const at = k.position.clone().addScaledVector(fwd, -2.6)
    at.y += 0.5
    const g = new THREE.Group()
    const custom = customInstance(itemSlot('taffy'))
    if (custom) g.add(custom)
    else {
      const p = new Parts()
      p.add(new THREE.IcosahedronGeometry(1, 1), '#7ef0c0', [0, 0.35, 0], [0, 0, 0], [1.25, 0.5, 1.25])
      p.add(new THREE.IcosahedronGeometry(0.6, 1), '#ff9ec4', [0.25, 0.62, 0.1], [0, 0, 0], [1, 0.6, 1])
      p.add(new THREE.IcosahedronGeometry(0.35, 0), '#fff6fb', [-0.3, 0.75, -0.2])
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2
        p.add(new THREE.IcosahedronGeometry(0.28, 0), i % 2 ? '#7ef0c0' : '#ff9ec4', [Math.cos(a) * 1.2, 0.12, Math.sin(a) * 1.2], [0, 0, 0], [1.2, 0.4, 1.2])
      }
      const mesh = p.mesh(new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.18, metalness: 0.05, emissive: '#3a1030', emissiveIntensity: 0.15 }))
      g.add(mesh)
    }
    this.group.add(g)
    const body = this.physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(at.x, at.y, at.z)
        .setLinvel(k.velocity.x * 0.25 - fwd.x * 2, 2.5, k.velocity.z * 0.25 - fwd.z * 2)
        .setLinearDamping(1.8)
        .setAngularDamping(4)
        .enabledRotations(false, true, false),
    )
    this.physics.world.createCollider(RAPIER.ColliderDesc.ball(0.5).setRestitution(0.2).setFriction(1).setCollisionGroups(groups(COLLISION.DEBRIS, COLLISION.GROUND | COLLISION.WALL)), body)
    this.traps.push({ mesh: g, body, owner: r, life: CONFIG.items.trapLife, armed: 0.8, wobble: 0 })
    if (this.traps.length > CONFIG.items.maxTraps) {
      const old = this.traps.shift()!
      this.removeTrap(old)
    }
  }

  private launchBee(r: Racer, target: Racer | null): void {
    const g = new THREE.Group()
    let wing: THREE.Object3D[] = []
    const custom = customInstance(itemSlot('bee'))
    if (custom) {
      // Name two nodes wing_l / wing_r to have them flap; otherwise the model just flies.
      g.add(custom)
      wing = [findNode(custom, 'wing_l'), findNode(custom, 'wing_r')].filter((o): o is THREE.Object3D => !!o)
    } else {
      const p = new Parts()
      p.add(new THREE.IcosahedronGeometry(0.42, 1), '#ffd23f', [0, 0, 0], [0, 0, 0], [0.9, 0.9, 1.25])
      p.add(new THREE.CylinderGeometry(0.4, 0.4, 0.14, 10), '#2b1a2e', [0, 0, -0.08], [Math.PI / 2, 0, 0])
      p.add(new THREE.CylinderGeometry(0.33, 0.33, 0.12, 10), '#2b1a2e', [0, 0, -0.34], [Math.PI / 2, 0, 0])
      p.add(new THREE.IcosahedronGeometry(0.3, 1), '#2b1a2e', [0, 0.05, 0.5])
      p.add(new THREE.IcosahedronGeometry(0.08, 0), '#ffffff', [0.12, 0.12, 0.74])
      p.add(new THREE.IcosahedronGeometry(0.08, 0), '#ffffff', [-0.12, 0.12, 0.74])
      p.add(new THREE.ConeGeometry(0.08, 0.25, 5), '#2b1a2e', [0, 0, -0.62], [-Math.PI / 2, 0, 0])
      g.add(p.mesh())
      const wingMat = new THREE.MeshBasicMaterial({ color: '#e8fbff', transparent: true, opacity: 0.75, side: THREE.DoubleSide })
      for (const s of [1, -1]) {
        const pivot = new THREE.Group()
        pivot.position.set(s * 0.15, 0.32, 0)
        const w = new THREE.Mesh(new THREE.CircleGeometry(0.34, 8), wingMat)
        w.position.set(s * 0.3, 0.05, 0)
        w.rotation.x = -Math.PI / 2
        w.scale.set(1, 0.6, 1)
        pivot.add(w)
        g.add(pivot)
        wing.push(pivot)
      }
      g.scale.setScalar(1.35)
    }
    const pos = r.position.clone().add(new THREE.Vector3(0, 1.6, 0))
    g.position.copy(pos)
    const trail = new Trail(18, 0.3, '#ffe066', 0.7)
    this.group.add(g, trail.mesh)
    const loc = r.tracker.loc
    if(this.bees.length>=12){const old=this.bees.shift()!;this.removeBee(old)}
    this.bees.push({ mesh: g, owner: r, target, s: loc.mainS, lateral: loc.path === 'main' ? loc.lateral : 0, pos, life: CONFIG.items.beeLife, trail, wing, path: 'main' })
  }

  private removeTrap(t: Trap): void {
    this.group.remove(t.mesh)
    // Custom models share geometry with their template; only free the built-in goo.
    if (!hasCustom(itemSlot('taffy'))) (t.mesh.children[0] as THREE.Mesh).geometry.dispose()
    if (this.physics.world.getRigidBody(t.body.handle)) this.physics.world.removeRigidBody(t.body)
  }

  private removeBee(b: Bee): void {
    this.group.remove(b.mesh, b.trail.mesh)
  }

  private removeShard(s: Shard): void {
    this.group.remove(s.mesh)
    if (this.physics.world.getRigidBody(s.body.handle)) this.physics.world.removeRigidBody(s.body)
  }
}
