/** One function per driver: build the standing character, then sit it in the kart. */
import type * as THREE from 'three'
import { seated } from './core'

export async function seatedYu(): Promise<THREE.Object3D> {
  const { buildJackson } = await import('./jackson')
  return seated(buildJackson(new (await import('three')).Group()))
}
export async function seatedGuava(): Promise<THREE.Object3D> {
  const { buildKiafes } = await import('./kiafes')
  return seated(buildKiafes(new (await import('three')).Group()))
}
const extra = async (name: 'buildTangtang' | 'buildAhu' | 'buildPudding' | 'buildXiaoxing') => seated((await import('./extras'))[name]())
export const seatedTangtang = () => extra('buildTangtang')
export const seatedAhu = () => extra('buildAhu')
export const seatedPudding = () => extra('buildPudding')
export const seatedXiaoxing = () => extra('buildXiaoxing')
