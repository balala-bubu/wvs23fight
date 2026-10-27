import type { Stats } from './config'
import { SHARED_IDS, sharedDefinition } from '../custom/sharedCharacters'

/** Racer ids. Add a row to ROSTER, three i18n keys per language, and a driver in assets.config.ts. */
export type CharacterId = string

export type Character = {
  id: CharacterId
  skin?:number
  /** i18n keys: `char.<id>.name`, `char.<id>.species` (role tag), `char.<id>.blurb`. */
  stats: Stats
  /** Colours of the built-in fallback driver (used only if the custom model fails to load). */
  fur: string
  furDark: string
  belly: string
  /** Kart body + trim colours (the kart stays procedural unless you register `kart:<id>`). */
  kart: string
  kartAccent: string
  /** Minimap / UI accent. */
  ui: string
}

/** Original roster plus shared WVS characters. Six compete per race. Stats sum to 13 so nobody is strictly better. */
export const ROSTER: Character[] = [
  { id: 'yu', stats: { speed: 3, accel: 4, handling: 3, weight: 3 }, fur: '#d9ab85', furDark: '#17120f', belly: '#8e8f93', kart: '#ff5f8f', kartAccent: '#ffe066', ui: '#ff7aa2' },
  { id: 'guava', stats: { speed: 3, accel: 3, handling: 5, weight: 2 }, fur: '#d6a27c', furDark: '#141010', belly: '#e2dbcd', kart: '#3fc4a8', kartAccent: '#fff4c8', ui: '#43d1b1' },
  { id: 'pudding', stats: { speed: 2, accel: 5, handling: 4, weight: 2 }, fur: '#f0c19a', furDark: '#7a4a2a', belly: '#fffaf0', kart: '#6ec8ff', kartAccent: '#ff8fc7', ui: '#6ec8ff' },
]

for (const id of SHARED_IDS) {
  if (ROSTER.some(c=>c.id===id)) continue
  const def=sharedDefinition(id), color=def.portraitBg || '#ff7a3d'
  ROSTER.push({id,stats:{speed:3,accel:4,handling:3,weight:3},fur:'#ddb08b',furDark:'#231a19',belly:'#fff0db',kart:color,kartAccent:'#f2c14e',ui:color})
}

export function characterById(id: string): Character {
  return ROSTER.find(c => c.id === id) ?? ROSTER[0]
}
