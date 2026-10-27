/**
 * Blocky-character toolkit. Mirrors the helper API your original characters were written against
 * (`tex`, `speckle`, `shadeFace`, `L`, `rbox`, `at`, `cyl`, `spriteOf`, `buildChar`) so files such as
 * jackson.js / kiafes.js drop in with almost no edits. Everything is plain three.js: canvas pixel
 * textures on rounded boxes, Lambert shading, +Z is the character's front.
 */
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Ctx = CanvasRenderingContext2D

let seed = 20240601
/** Deterministic pseudo-random so every device paints identical pixel textures. */
export function rnd(): number {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

/** Pixel-art canvas texture (nearest filtering, sRGB). */
export function tex(w: number, h: number, draw: (g: Ctx) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  draw(g)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.magFilter = THREE.NearestFilter
  t.minFilter = THREE.NearestFilter
  t.generateMipmaps = false
  return t
}

/** Fill with a base colour and sprinkle 1px noise from `colors`. */
export function speckle(g: Ctx, w: number, h: number, base: string, colors: string[], density = 0.4): void {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  const n = Math.floor(w * h * density * 0.5)
  for (let i = 0; i < n; i += 1) {
    g.fillStyle = colors[Math.floor(rnd() * colors.length)]
    g.fillRect(Math.floor(rnd() * w), Math.floor(rnd() * h), 1, 1)
  }
}

/** Soft cheek/jaw shading for 64×64 face textures. */
export function shadeFace(g: Ctx): void {
  g.fillStyle = 'rgba(80,40,25,.10)'
  g.fillRect(0, 56, 64, 8)
  g.fillRect(0, 0, 3, 64)
  g.fillRect(61, 0, 3, 64)
}

export const L = (opts: THREE.MeshLambertMaterialParameters): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial(opts)

/** Rounded box. `r` is roundness 0..1 of the smallest half-extent. */
export function rbox(w: number, h: number, d: number, r: number, mat: THREE.Material | THREE.Material[]): THREE.Mesh {
  const radius = Math.max(0.005, Math.min(0.5, r) * Math.min(w, h, d) * 0.5 + 0.005)
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, radius), mat)
}

export function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
  o.position.set(x, y, z)
  return o
}

export function cyl(rt: number, rb: number, h: number, mat: THREE.Material, seg = 8): THREE.Mesh {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
}

export function spriteOf(map: THREE.Texture, size: number, color = 0xffffff): THREE.Sprite {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true }))
  s.scale.set(size, size, 1)
  return s
}

export const shoeM = L({ color: 0xf4f4f0 })
export const greySole = L({ color: 0x9a9aa2 })

export type Limb = { sh: THREE.Group; el: THREE.Group; hd: THREE.Group }
export type BlockyChar = {
  root: THREE.Group
  chest: THREE.Group
  head: THREE.Group
  R: Limb
  Lf: Limb
  joints: { rHp: THREE.Group; lHp: THREE.Group; rKn: THREE.Group; lKn: THREE.Group }
  props: Record<string, THREE.Object3D>
  setFace: (name: string) => void
  [key: string]: any
}

/**
 * Standing humanoid, origin at the hips, +Z front, ~5.7 units tall. Same option bag as the original
 * helper: `skinM, faceM, headW, headH, torsoMat, sleeveMat(), sleeve:[w,len], pantsM, shoeM, soleM,
 * collar(chest), hair(head), face(head)`. The right arm is on −X (the character's own right).
 */
export function buildChar(o: any, parent: THREE.Object3D): BlockyChar {
  const root = new THREE.Group()
  parent.add(root)
  const chest = new THREE.Group()
  root.add(chest)
  // torso must stay chest.children[0]
  chest.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 0.95), o.torsoMat), 0, 1.1, 0))
  o.collar?.(chest)

  const headW = o.headW ?? 1
  const headH = o.headH ?? 1.1
  const head = new THREE.Group()
  head.position.set(0, 2.2 + 0.14 + headH / 2, 0)
  head.name = 'head'
  head.add(new THREE.Mesh(new THREE.BoxGeometry(headW, headH, 1), [o.skinM, o.skinM, o.skinM, o.skinM, o.faceM, o.skinM]))
  chest.add(head)
  o.hair?.(head)
  o.face?.(head)

  const [sw, sl] = o.sleeve ?? [0.66, 0.8]
  const arm = (side: number): Limb => {
    const sh = new THREE.Group()
    sh.position.set(side * (0.75 + sw / 2), 2.0, 0)
    sh.add(at(new THREE.Mesh(new THREE.BoxGeometry(sw, sl + 0.12, sw), o.sleeveMat()), 0, -sl / 2 + 0.06, 0))
    const el = new THREE.Group()
    el.position.y = -sl
    el.add(at(new THREE.Mesh(new THREE.BoxGeometry(sw * 0.86, 0.8, sw * 0.86), o.skinM), 0, -0.4, 0))
    const hd = new THREE.Group()
    hd.position.y = -0.8
    hd.add(at(new THREE.Mesh(new THREE.BoxGeometry(sw * 0.8, 0.42, sw * 0.8), o.skinM), 0, -0.08, 0))
    el.add(hd)
    sh.add(el)
    chest.add(sh)
    return { sh, el, hd }
  }
  const R = arm(-1)
  const Lf = arm(1)

  const leg = (side: number) => {
    const hp = new THREE.Group()
    hp.position.set(side * 0.4, 0, 0)
    hp.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.0, 0.78), o.pantsM), 0, -0.5, 0))
    const kn = new THREE.Group()
    kn.position.y = -1.0
    kn.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.92, 0.7), o.pantsM), 0, -0.46, 0))
    kn.add(at(rbox(0.7, 0.36, 1.0, 0.4, o.shoeM ?? shoeM), 0, -1.0, 0.16))
    kn.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 1.04), o.soleM ?? greySole), 0, -1.2, 0.16))
    hp.add(kn)
    root.add(hp)
    return { hp, kn }
  }
  const r = leg(-1)
  const l = leg(1)

  const c: BlockyChar = {
    root,
    chest,
    head,
    R,
    Lf,
    joints: { rHp: r.hp, lHp: l.hp, rKn: r.kn, lKn: l.kn },
    props: {},
    setFace: () => {},
  }
  return c
}

/**
 * Sit the character on the kart seat and hold the wheel. Returns the group to add to the driver.
 * Tune `SEAT` if your own characters have different proportions.
 */
export const SEAT = { scale: 0.36, position: [0, 0.7, -0.3] as [number, number, number] }

export function seated(c: BlockyChar): THREE.Group {
  const g = new THREE.Group()
  g.name = 'driver-model'
  g.add(c.root)
  c.root.scale.setScalar(SEAT.scale)
  c.root.position.set(...SEAT.position)
  c.joints.rHp.rotation.x = c.joints.lHp.rotation.x = -1.4
  c.joints.rKn.rotation.x = c.joints.lKn.rotation.x = 1.15
  c.chest.rotation.x = -0.06
  for (const [limb, side] of [[c.R, -1], [c.Lf, 1]] as const) {
    limb.sh.rotation.set(-1.15, 0, side * 0.18)
    limb.el.rotation.x = -0.55
  }
  for (const p of Object.values(c.props)) p.visible = false
  return g
}

/** Shared black-hair texture (used by several of the original characters). */
export const blackHairTex = tex(32, 32, g => {
  speckle(g, 32, 32, '#17120f', ['#241c18', '#0d0a08', '#2e2420'], 0.5)
})
