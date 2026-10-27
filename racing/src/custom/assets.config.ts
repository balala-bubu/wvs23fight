import type { CustomAssetConfig } from '../game/customAssets'
import { SHARED_IDS, sharedDriver,sharedStudent } from './sharedCharacters'
import { makeGiftBox, makeGuavaTrap } from './blocky/extras'

// Shared original character sources are read-only; all adaptation lives in racing.
export const CUSTOM_ASSETS: CustomAssetConfig = {
  characters: Object.fromEntries(SHARED_IDS.map(id => [id, {driver:{type:'factory' as const,create:()=>sharedDriver(id)}}])),
  items: {
    crate: {type:'factory',create:makeGiftBox},
    taffy: {type:'factory',create:makeGuavaTrap},
    bee: {type:'factory',create:sharedStudent,scale:.8},
  },
}
