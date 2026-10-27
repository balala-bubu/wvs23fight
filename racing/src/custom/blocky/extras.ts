/**
 * Four extra drivers and three items written in the same blocky style as jackson.ts / kiafes.ts.
 * Copy one of these functions as the starting point for your own character or prop.
 */
import * as THREE from 'three'
import { L, at, buildChar, cyl, rbox, shadeFace, speckle, spriteOf, tex, type BlockyChar, type Ctx } from './core'
import { kiaGuava } from './kiafes'

/* ───────────────────────── drivers ───────────────────────── */

type Look = {
  skin: string
  hair: string
  shirt: string
  shirt2: string
  pants: string
  /** 'buns' | 'tiger' | 'chef' | 'astro' */
  style: 'buns' | 'tiger' | 'chef' | 'astro'
  blush?: string
}

function faceTexture(look: Look): THREE.CanvasTexture {
  return tex(64, 64, (g: Ctx) => {
    speckle(g, 64, 64, look.skin, [look.skin], 0.0)
    shadeFace(g)
    g.fillStyle = '#1d1310'
    g.fillRect(15, 33, 8, 9)
    g.fillRect(41, 33, 8, 9)
    g.fillStyle = '#fff'
    g.fillRect(17, 34, 3, 3)
    g.fillRect(43, 34, 3, 3)
    g.fillStyle = look.blush ?? 'rgba(235,110,110,.4)'
    g.fillRect(8, 43, 9, 5)
    g.fillRect(47, 43, 9, 5)
    g.strokeStyle = '#7a3a2c'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(25, 49)
    g.quadraticCurveTo(32, 55, 39, 49)
    g.stroke()
  })
}

function shirtTextures(look: Look) {
  const side = tex(32, 32, g => speckle(g, 32, 32, look.shirt, [look.shirt2], 0.12))
  const front = tex(32, 46, g => {
    speckle(g, 32, 46, look.shirt, [look.shirt2], 0.12)
    g.fillStyle = look.shirt2
    if (look.style === 'buns') for (let y = 0; y < 46; y += 8) g.fillRect(0, y, 32, 3) // candy stripes
    if (look.style === 'tiger') for (const y of [8, 18, 28, 38]) { g.fillRect(2, y, 8, 3); g.fillRect(22, y + 3, 8, 3) } // stripes
    if (look.style === 'chef') for (const y of [10, 20, 30]) { g.fillRect(8, y, 3, 3); g.fillRect(21, y, 3, 3) } // buttons
    if (look.style === 'astro') { g.fillRect(13, 12, 6, 6); g.fillRect(11, 14, 10, 2) } // star badge
  })
  return { side, front }
}

function makeBlocky(look: Look): BlockyChar {
  const root = new THREE.Group()
  const skinM = L({ map: tex(16, 16, g => speckle(g, 16, 16, look.skin, [look.skin], 0.0)) })
  const faceM = L({ map: faceTexture(look) })
  const hairM = L({ color: look.hair })
  const T = shirtTextures(look)
  const sideM = L({ map: T.side })
  const frontM = L({ map: T.front })
  const c = buildChar(
    {
      skinM,
      faceM,
      headW: 1.05,
      headH: 1.1,
      torsoMat: [sideM, sideM, sideM, sideM, frontM, sideM],
      sleeveMat: () => sideM,
      sleeve: [0.66, 0.8],
      pantsM: L({ color: look.pants }),
      collar(chest: THREE.Group) {
        chest.add(at(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 4, 12), L({ color: look.shirt2 })), 0, 2.22, 0.02).rotateX(Math.PI / 2))
      },
      hair(head: THREE.Group) {
        head.add(at(rbox(1.16, 0.5, 1.16, 0.6, hairM), 0, 0.46, -0.02))
        head.add(at(rbox(1.12, 0.95, 0.5, 0.6, hairM), 0, 0.06, -0.32))
        head.add(at(rbox(1.0, 0.18, 0.2, 0.5, hairM), 0, 0.4, 0.5)) // fringe
        if (look.style === 'buns') {
          for (const s of [-1, 1]) {
            head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), hairM), s * 0.5, 0.78, -0.05))
            head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), L({ color: '#ff5fa2' })), s * 0.5, 0.58, 0.2))
          }
        } else if (look.style === 'tiger') {
          const earM = L({ color: '#ff9a2e' })
          for (const s of [-1, 1]) {
            head.add(at(rbox(0.34, 0.34, 0.16, 0.6, earM), s * 0.42, 0.78, -0.05))
            head.add(at(rbox(0.18, 0.18, 0.1, 0.6, L({ color: '#ffd9b0' })), s * 0.42, 0.78, 0.04))
          }
          for (const x of [-0.25, 0, 0.25]) head.add(at(rbox(0.1, 0.22, 0.04, 0.3, L({ color: '#2b1a12' })), x, 0.62, 0.58))
        } else if (look.style === 'chef') {
          const hat = L({ color: '#ffffff' })
          head.add(at(cyl(0.5, 0.46, 0.5, hat, 12), 0, 0.95, 0))
          head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.58, 12, 8), hat), 0, 1.3, 0).translateY(0))
        } else {
          const helm = new THREE.Mesh(new THREE.SphereGeometry(0.86, 14, 10), new THREE.MeshLambertMaterial({ color: '#cfe8ff', transparent: true, opacity: 0.28 }))
          head.add(at(helm, 0, 0.05, 0))
          head.add(at(cyl(0.03, 0.03, 0.4, L({ color: '#bfc7d5' }), 6), 0, 1.0, 0))
          head.add(at(new THREE.Mesh(new THREE.OctahedronGeometry(0.14), L({ color: '#ffd84d' })), 0, 1.25, 0))
        }
      },
    },
    root,
  )
  return c
}

export const buildTangtang = (): BlockyChar => makeBlocky({ skin: '#f2c7a5', hair: '#ff8fc0', shirt: '#ffffff', shirt2: '#ff5fa2', pants: '#7a5ac8', style: 'buns' })
export const buildAhu = (): BlockyChar => makeBlocky({ skin: '#e3ad82', hair: '#2b1a12', shirt: '#ff9a2e', shirt2: '#2b1a12', pants: '#3b3b52', style: 'tiger' })
export const buildPudding = (): BlockyChar => makeBlocky({ skin: '#f0c19a', hair: '#7a4a2a', shirt: '#fffaf0', shirt2: '#c9a36a', pants: '#3a5a8a', style: 'chef' })
export const buildXiaoxing = (): BlockyChar => makeBlocky({ skin: '#e9b98f', hair: '#27346b', shirt: '#2f4a9a', shirt2: '#ffd84d', pants: '#27346b', style: 'astro' })

/* ───────────────────────── items ───────────────────────── */

/** Gift box pickup (≈1.5 units). Swap the canvas drawing for your own art. */
export function makeGiftBox(): THREE.Object3D {
  const g = new THREE.Group()
  const paper = tex(32, 32, c => {
    speckle(c, 32, 32, '#ff7ab6', ['#ff8fc4', '#f26aa8'], 0.3)
    c.fillStyle = '#fff3a8'
    c.fillRect(14, 0, 4, 32)
    c.fillRect(0, 14, 32, 4)
    c.fillStyle = 'rgba(255,255,255,.7)'
    for (const [x, y] of [[4, 5], [24, 6], [6, 24], [24, 25]]) c.fillRect(x, y, 3, 3)
  })
  const paperM = L({ map: paper, emissive: new THREE.Color('#5a1840'), emissiveIntensity: 0.35 })
  const box = rbox(1.5, 1.5, 1.5, 0.35, paperM)
  box.position.y = 0.75
  g.add(box)
  const ribbon = L({ color: '#ffe066', emissive: new THREE.Color('#6a5010'), emissiveIntensity: 0.4 })
  for (const s of [-1, 1]) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 5, 8), ribbon)
    loop.position.set(s * 0.28, 1.72, 0)
    loop.rotation.set(0, Math.PI / 2, s * 0.5)
    g.add(loop)
  }
  g.add(at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 0), ribbon), 0, 1.62, 0))
  return g
}

/** Sticky-trap replacement: a guava (from kiafes.ts). */
export function makeGuavaTrap(): THREE.Object3D {
  const g = new THREE.Group()
  const guava = kiaGuava(1.9)
  guava.position.y = 0.55
  g.add(guava)
  // little splat ring so karts can read the hazard from far away
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.5, 14), new THREE.MeshBasicMaterial({ color: '#d8e48a', transparent: true, opacity: 0.55, side: THREE.DoubleSide }))
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.04
  g.add(ring)
  return g
}

/** Homing-item replacement: the round big-eared bird (from jackson.ts). Ears are named wing_l / wing_r. */
export function makeBigEarBird(): THREE.Object3D {
  const bird = new THREE.Group()
  const bBody = L({ color: 0x39c4b0 }), bBelly = L({ color: 0xe9fff6 }), bBeak = L({ color: 0xffb23d })
  const bEar = L({ color: 0xff9fbd }), bEarIn = L({ color: 0xd9507f }), bDark = L({ color: 0x1f9a8a })
  const bEyeW = new THREE.MeshBasicMaterial({ color: 0xffffff }), bPupil = new THREE.MeshBasicMaterial({ color: 0x14110f })
  const sph = (r: number, m: THREE.Material, sx: number, sy: number, sz: number, x: number, y: number, z: number) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), m)
    o.scale.set(sx, sy, sz)
    o.position.set(x, y, z)
    bird.add(o)
    return o
  }
  sph(0.55, bBody, 1, 0.95, 0.95, 0, 0, 0)
  sph(0.42, bBelly, 1, 1, 0.5, 0, -0.12, 0.36)
  for (const sd of [-1, 1]) {
    sph(0.17, bEyeW, 1, 1.1, 0.8, sd * 0.21, 0.14, 0.44)
    sph(0.085, bPupil, 1, 1, 0.8, sd * 0.21, 0.12, 0.56)
    sph(0.15, bDark, 0.5, 1, 0.8, sd * 0.52, -0.12, 0.05)
  }
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.3, 6), bBeak)
  beak.rotation.x = Math.PI / 2
  beak.position.set(0, -0.03, 0.62)
  bird.add(beak)
  ;[[-0.14, 0.08], [0, 0], [0.14, -0.08]].forEach(([x, r], i) => {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.32 + (i === 1 ? 0.1 : 0), 5), bDark)
    f.position.set(x, 0.62, 0)
    f.rotation.z = r * 2
    bird.add(f)
  })
  ;[-1, 1].forEach(sd => {
    const g = new THREE.Group()
    g.name = sd < 0 ? 'wing_l' : 'wing_r'
    g.position.set(sd * 0.66, 0.18, -0.02)
    bird.add(g)
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 10), bEar)
    o.scale.set(0.26, 1.0, 0.82)
    g.add(o)
    const i2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), bEarIn)
    i2.scale.set(0.2, 1.0, 0.82)
    i2.position.set(sd * 0.07, -0.02, 0.04)
    g.add(i2)
  })
  const note = tex(16, 16, g => {
    g.fillStyle = '#fff7d6'
    g.fillRect(9, 2, 2, 9)
    g.fillRect(11, 2, 3, 2)
    g.fillRect(13, 4, 1, 2)
    g.fillRect(5, 10, 5, 3)
  })
  for (const [x, y, z] of [[-1.0, 0.95, 0.3], [1.05, 0.65, 0.35]]) bird.add(at(spriteOf(note, 0.75, 0xffe08a), x, y, z))
  return bird
}
