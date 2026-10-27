import * as THREE from 'three'
import { clone as cloneWithSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

/**
 * Replaceable model slots. The race systems (physics, AI, drift, items, HUD) never care what a
 * kart, driver or item looks like, so you can swap any visual here without touching gameplay.
 *
 *   Slots              Key used in the store
 *   ─────────────────  ───────────────────────────────────────────────
 *   Driver (character) `driver:<id>`   e.g. driver:yu
 *   Kart body + wheels `kart:<id>`     e.g. kart:yu
 *   Gift box pickup    `item:crate`
 *   Taffy trap         `item:taffy`
 *   Homing bee         `item:bee`
 *
 * Fill in `src/custom/assets.config.ts`. A slot that is missing or fails to load silently keeps the
 * built-in procedural model, so a half-finished swap never breaks the game.
 */

export type Vec3 = [number, number, number]

/** Applied once to the loaded model so you can fix scale/pivot without editing the source file. */
export type ModelTransform = {
  /** Uniform number or per-axis. Default 1. */
  scale?: number | Vec3
  /** Offset in the slot's local space (metres). Default [0, 0, 0]. */
  position?: Vec3
  /** Extra yaw in radians, for models authored facing -Z or +X. Default 0. */
  rotationY?: number
}

export type ModelSource = ModelTransform &
  (
    | { type: 'glb'; /** .glb / .gltf URL (use `import x from './file.glb?url'`). */ url: string }
    | { type: 'json'; /** Output of `Object3D.toJSON()` or the three.js editor's "Export Scene/Object". */ url: string }
    | { type: 'factory'; /** Build the model in code with three.js. Called once; the result is cloned per use. */ create: () => THREE.Object3D | Promise<THREE.Object3D> }
  )

export type CharacterOverride = {
  /** The animal driver only; the procedural kart stays. */
  driver?: ModelSource
  /** The kart body and wheels only; the procedural driver stays. */
  kart?: ModelSource
}

export type ItemSlot = 'crate' | 'taffy' | 'bee'

export type CustomAssetConfig = {
  /** Keyed by character id: yu, guava, tangtang, ahu, pudding, xiaoxing. */
  characters?: Partial<Record<string, CharacterOverride>>
  items?: Partial<Record<ItemSlot, ModelSource>>
}

/** Minimal loader surface so tests can run without a browser. `Assets` satisfies it. */
export type ModelLoader = { gltf(url: string): Promise<{ scene: THREE.Object3D }> }

const templates = new Map<string, THREE.Object3D>()

export function driverSlot(id: string): string {
  return `driver:${id}`
}
export function kartSlot(id: string): string {
  return `kart:${id}`
}
export function itemSlot(slot: ItemSlot): string {
  return `item:${slot}`
}

/** Flatten a config into `slot key → source` pairs. */
export function listSlots(config: CustomAssetConfig): Array<[string, ModelSource]> {
  const out: Array<[string, ModelSource]> = []
  for (const [id, o] of Object.entries(config.characters ?? {})) {
    if (o?.driver) out.push([driverSlot(id), o.driver])
    if (o?.kart) out.push([kartSlot(id), o.kart])
  }
  for (const [slot, src] of Object.entries(config.items ?? {})) if (src) out.push([itemSlot(slot as ItemSlot), src])
  return out
}

async function build(src: ModelSource, loader: ModelLoader): Promise<THREE.Object3D> {
  let model: THREE.Object3D
  if (src.type === 'glb') model = (await loader.gltf(src.url)).scene
  else if (src.type === 'json') model = await new THREE.ObjectLoader().loadAsync(src.url)
  else model = await src.create()
  const wrapper = new THREE.Group()
  wrapper.add(model)
  const s = src.scale ?? 1
  if (typeof s === 'number') wrapper.scale.setScalar(s)
  else wrapper.scale.set(...s)
  if (src.position) wrapper.position.set(...src.position)
  if (src.rotationY) wrapper.rotation.y = src.rotationY
  return wrapper
}

/**
 * Load every configured slot in parallel. Returns the slot keys that failed (they fall back to the
 * built-in model). Call once at boot, before the first kart or item is built.
 */
export async function loadCustomAssets(config: CustomAssetConfig, loader: ModelLoader): Promise<string[]> {
  templates.clear()
  const failed: string[] = []
  await Promise.all(
    listSlots(config).map(async ([key, src]) => {
      try {
        templates.set(key, await build(src, loader))
      } catch (err) {
        failed.push(key)
        console.warn(`[custom assets] "${key}" failed to load, using the built-in model.`, err)
      }
    }),
  )
  return failed
}

/** Register an already-built object (used by tests and in-page tools). */
export function setCustomTemplate(key: string, object: THREE.Object3D): void {
  templates.set(key, object)
}

export function clearCustomAssets(): void {
  templates.clear()
}

export function hasCustom(key: string): boolean {
  return templates.has(key)
}

/** A fresh clone of the slot's model (skeleton-safe), or null to use the built-in one. */
export function customInstance(key: string): THREE.Object3D | null {
  const t = templates.get(key)
  if (!t) return null
  const copy = cloneWithSkeleton(t)
  copy.traverse(o => {
    const m = o as THREE.Mesh
    if (m.isMesh) {
      m.castShadow = true
      m.receiveShadow = true
      m.frustumCulled = true
    }
  })
  return copy
}

/** First descendant (or the root itself) whose name matches one of `names`, case-insensitive. */
export function findNode(root: THREE.Object3D, ...names: string[]): THREE.Object3D | undefined {
  const wanted = names.map(n => n.toLowerCase())
  let hit: THREE.Object3D | undefined
  root.traverse(o => {
    if (!hit && wanted.includes(o.name.toLowerCase())) hit = o
  })
  return hit
}
