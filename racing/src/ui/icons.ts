import { type ItemKind } from '../game/config'

/** Original item icons (inline SVG, 64×64). Thick ink outlines match the UI style. */
const INK = '#2b1633'

export const ITEM_ICONS: Record<ItemKind, string> = {
  shield: `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="gb" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#e9fdff"/><stop offset=".55" stop-color="#8fe8ff"/><stop offset="1" stop-color="#d59cff"/></radialGradient></defs><circle cx="32" cy="33" r="25" fill="url(#gb)" stroke="${INK}" stroke-width="4"/><path d="M18 27a15 15 0 0 1 12-11" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="45" cy="45" r="3.5" fill="#fff" opacity=".9"/><circle cx="24" cy="44" r="2" fill="#fff" opacity=".7"/></svg>`,
  pepper: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 40c4-3 8-3 10-1M8 48c5-1 9 0 11 2M14 31c3 0 6 2 7 4" fill="none" stroke="#ffb13b" stroke-width="4" stroke-linecap="round"/><path d="M22 44c4 10 22 12 30 1 6-8 5-22-1-28-5 7-10 11-17 13-7 2-14 5-12 14z" fill="#ff4b3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M30 33c5-1 10-4 14-9" fill="none" stroke="#ff9a8a" stroke-width="4" stroke-linecap="round"/><path d="M50 17c1-5 4-8 8-9" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M50 17c1-5 4-8 8-9" fill="none" stroke="#58d36b" stroke-width="3.5" stroke-linecap="round"/><path d="M44 19c3-3 8-4 12 0" fill="#58d36b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  taffy: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 14c0-5 3-8 8-8" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><ellipse cx="44" cy="10" rx="9" ry="4.5" fill="#5fbf4a" stroke="${INK}" stroke-width="3.5" transform="rotate(-18 44 10)"/><circle cx="32" cy="37" r="22" fill="#9ac553" stroke="${INK}" stroke-width="4"/><ellipse cx="24" cy="28" rx="6" ry="3.5" fill="#fff" opacity=".6" transform="rotate(-30 24 28)"/><circle cx="38" cy="34" r="2" fill="#d8e48a"/><circle cx="26" cy="43" r="2" fill="#d8e48a"/><circle cx="43" cy="46" r="2" fill="#d8e48a"/><circle cx="32" cy="54" r="2.6" fill="#6a7a3a"/></svg>`,
  bee: `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="11" cy="34" rx="7" ry="17" fill="#ff9fbd" stroke="${INK}" stroke-width="3.5" transform="rotate(14 11 34)"/><ellipse cx="53" cy="34" rx="7" ry="17" fill="#ff9fbd" stroke="${INK}" stroke-width="3.5" transform="rotate(-14 53 34)"/><circle cx="32" cy="36" r="19" fill="#39c4b0" stroke="${INK}" stroke-width="4"/><ellipse cx="32" cy="43" rx="12" ry="9" fill="#e9fff6"/><circle cx="25" cy="31" r="5" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="39" cy="31" r="5" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="26" cy="32" r="2.4" fill="${INK}"/><circle cx="38" cy="32" r="2.4" fill="${INK}"/><path d="M28 38l4 5 4-5z" fill="#ffb23d" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M27 17l-2-8M32 16V7M37 17l2-8" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></svg>`,
} as Record<ItemKind,string>

const shapes:Partial<Record<ItemKind,string>>={
 shell:'<circle cx="32" cy="32" r="21" fill="#60d6a0"/><path d="M15 34l12-16 15 3 9 15-12 14-16-3zM27 18l-4 29M42 21l-3 29M15 34l36 2" fill="none"/>',
 star:'<path d="M32 5l8 17 19 3-14 13 3 20-16-9-17 9 4-20L5 25l19-3z" fill="#ffdf63"/>',
 rocket:'<path d="M23 42l-7 14 16-6 16 6-7-14" fill="#ff8649"/><path d="M20 43C15 22 24 9 32 5c8 4 17 17 12 38z" fill="#91d8fb"/><circle cx="32" cy="26" r="8" fill="#294f72"/><path d="M27 49l5 12 5-12" fill="#ffdc63"/>',
 lightning:'<path d="M35 3L12 35h17l-5 26 28-36H35l9-22z" fill="#ffe16b"/>',
 leader:'<path d="M8 31l11-20 13 12 13-12 11 20-7 19H15z" fill="#afabff"/><circle cx="32" cy="35" r="11" fill="#fff0ba"/><path d="M30 30l4-3v17M28 44h11" fill="none"/>',
 bomb:'<circle cx="29" cy="38" r="21" fill="#65526e"/><path d="M35 18l5-8 9 3 5-7" fill="none"/><path d="M51 2l6 6M49 9h12" stroke="#ffbf51"/><circle cx="23" cy="32" r="5" fill="#eadcf0" stroke="none"/>',
 horn:'<path d="M12 27l35-15v39L12 38z" fill="#ffb864"/><path d="M18 39v14h10V41M53 16l7-5M54 31h8M54 45l7 5" fill="none"/>',
 ink:'<path d="M32 7C24 18 12 29 12 40a20 20 0 0040 0C52 29 40 18 32 7z" fill="#8174b8"/><circle cx="25" cy="40" r="3" fill="white"/><circle cx="39" cy="40" r="3" fill="white"/>',
 ghost:'<path d="M12 55V28a20 20 0 0140 0v27l-10-6-10 6-10-6z" fill="#eef3ff"/><ellipse cx="25" cy="29" rx="3" ry="6" fill="#3a3156"/><ellipse cx="39" cy="29" rx="3" ry="6" fill="#3a3156"/><path d="M25 42q7 7 14 0" fill="none"/>',
 boomerang:'<path d="M6 43l23-29q4-5 9 0l20 31-9 7-17-22L15 52z" fill="#e6af71"/><path d="M21 28l8 7M39 28l-8 7" fill="none"/>',
 coin:'<ellipse cx="32" cy="32" rx="22" ry="26" fill="#ffd368"/><ellipse cx="32" cy="32" rx="15" ry="20" fill="none" stroke="#c78b36"/><path d="M33 19v26M26 24l7-5" fill="none"/>',
 chomp:'<path d="M32 59V32M32 49l-18-8M32 53l17-9" fill="none" stroke="#6dba72" stroke-width="7"/><circle cx="32" cy="23" r="20" fill="#f49ca5"/><path d="M13 20l38 7-15 12z" fill="#fff3d9"/>',
 fire:'<path d="M24 58C1 45 24 29 29 6c2 17 14 13 13 29 5-1 8-6 8-10 12 23 1 39-26 33z" fill="#ff8046"/><path d="M28 55q-9-10 5-23 13 18 2 25z" fill="#ffdf76" stroke="none"/>',
 goldenPepper:'<path d="M12 37q14 21 35 3 13-13 6-28Q38 27 20 27q-11 0-8 10z" fill="#ffd36a"/><path d="M52 14l6-8M20 20l2-9M9 24l-5-6" fill="none"/>',
 partyBox:'<rect x="9" y="18" width="46" height="37" rx="4" fill="#a9a1ef"/><path d="M7 18h50v10H7z" fill="#86d9cb"/><path d="M29 18V9q-19-8-17 5 1 6 17 4zM35 18V9q19-8 17 5-1 6-17 4z" fill="#ffb4bd"/><path d="M29 19h7v36h-7z" fill="#ffdc85"/>',
}
const wrap=(body:string)=>`<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`
for(const [kind,body] of Object.entries(shapes))ITEM_ICONS[kind as ItemKind]=wrap(body)
for(const [kind,base] of [['tripleShell','shell'],['tripleBee','bee'],['tripleTaffy','taffy'],['triplePepper','pepper']] as const)ITEM_ICONS[kind]=ITEM_ICONS[base].replace('</svg>',`<circle cx="51" cy="13" r="11" fill="#fff3cb" stroke="${INK}" stroke-width="2"/><path d="M47 8q9-3 8 3 0 3-6 3 7-1 7 4 0 5-10 2" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/></svg>`)

// WVS skill silhouettes match the race models, rather than the earlier candy placeholders.
const skillArt:Partial<Record<ItemKind,string>>={
 shell:'<rect x="16" y="5" width="32" height="54" rx="6" fill="#273344"/><rect x="20" y="12" width="24" height="35" rx="2" fill="#9fd9f0"/><path d="M25 23h14M25 31h14M28 53h8" fill="none" stroke="#ffcf65"/>',
 fire:'<circle cx="32" cy="32" r="25" fill="#dfaa58"/><path d="M17 14v36M27 8v48M37 8v48M47 14v36M10 19h44M7 30h50M10 41h44M18 51h29" fill="none" stroke="#91582e"/>',
 boomerang:'<path d="M6 25h23q0 29-23 0zM35 39h23q0-29-23 0z" fill="#dc5948"/><path d="M10 26q10 13 16 0M39 37q10-13 16 0" fill="none" stroke="#ffab88"/>',
 bee:'<circle cx="32" cy="18" r="12" fill="#e4bc9a"/><path d="M19 13q12-18 25 0" fill="#362c28"/><path d="M21 32h22l5 20H16z" fill="#e6bb65"/><path d="M23 52v9M41 52v9M17 35L8 45M47 35l9 9" fill="none"/>',
 bomb:'<rect x="12" y="20" width="40" height="35" rx="6" fill="#433c50"/><path d="M13 31h38M32 20l5-10 11 3" fill="none" stroke="#ffcf65"/><rect x="26" y="37" width="12" height="12" fill="#eb7962"/>',
 pepper:'<path d="M19 18h26l-3 40H22z" fill="#a0cee0"/><path d="M18 12h28v8H18zM25 4h13v8H25z" fill="#334853"/><path d="M26 29h12v16H26z" fill="#f4d67b"/>',
 star:'<rect x="12" y="7" width="40" height="50" rx="7" fill="#fcf4dd"/><path d="M21 20h22M21 32h22M32 17v30M23 46l9-14 9 14" fill="none" stroke="#2c956e"/>',
 rocket:'<path d="M12 49l3-23 13-9 20 8 6 24z" fill="#f4d373"/><path d="M20 21l-5-12M40 21l5-12" fill="none"/><circle cx="25" cy="32" r="3" fill="#283d38"/><circle cx="40" cy="32" r="3" fill="#283d38"/><path d="M27 43q6 4 12-1" fill="none"/>',
 lightning:'<path d="M20 5l26 4-4 48-27-3z" fill="#f2d17b"/><path d="M29 15l9 7-13 8 13 8-13 8" fill="none" stroke="#b9473d"/>',
 horn:'<path d="M27 31l-5 27h10l5-27z" fill="#6b7b91"/><circle cx="33" cy="19" r="14" fill="#bed1db"/><path d="M22 15h21M21 22h22M50 11l8-5M51 27l9 4" fill="none"/>',
 ink:'<rect x="6" y="19" width="52" height="34" rx="5" fill="#607584"/><path d="M17 19l4-9h16l4 9" fill="#607584"/><circle cx="33" cy="36" r="12" fill="#a9d6e6"/><path d="M49 7v10M44 12h10" stroke="#ffe6a3"/>',
 chomp:'<path d="M8 35q23-40 48 0-24 36-48 0z" fill="#b7abd4"/><path d="M8 35h48M19 32l13-13 13 13M19 38l13 13 13-13" fill="none"/><circle cx="32" cy="36" r="6" fill="#f8edcf"/>',
 coin:'<path d="M9 10h46v46H9z" fill="#f9e4b0"/><path d="M9 16l23 19 23-19M10 55l17-21M54 55L38 34" fill="none"/><path d="M26 13h12v8H26z" fill="#d5aa48"/>',
 partyBox:'<path d="M8 27h48l-6 28H14z" fill="#bb8e5d"/><path d="M17 26q15-30 30 0M13 35h40M16 44h34M23 28v24M33 28v24M43 28v24" fill="none"/>',
}
for(const [kind,body] of Object.entries(skillArt))ITEM_ICONS[kind as ItemKind]=wrap(body)
ITEM_ICONS.leader=ITEM_ICONS.bee;ITEM_ICONS.ghost=ITEM_ICONS.bee;ITEM_ICONS.goldenPepper=ITEM_ICONS.pepper.replaceAll('#a0cee0','#f6cd62')
for(const [kind,base] of [['tripleShell','shell'],['tripleBee','bee'],['tripleTaffy','taffy'],['triplePepper','pepper']] as const)ITEM_ICONS[kind]=ITEM_ICONS[base].replace('</svg>',`<circle cx="51" cy="13" r="11" fill="#fff3cb" stroke="${INK}" stroke-width="2"/><text x="51" y="18" text-anchor="middle" font-size="15" font-weight="900" fill="${INK}">3</text></svg>`)

/** Small glyph for a key or button prompt. */
export function keyCap(label: string, wide = false): string {
  return `<kbd class="cap${wide ? ' wide' : ''}">${label}</kbd>`
}

export const PAD_GLYPH: Record<string, string> = {
  A: '<kbd class="cap pad pad-a">A</kbd>',
  B: '<kbd class="cap pad pad-b">B</kbd>',
  X: '<kbd class="cap pad pad-x">X</kbd>',
  Y: '<kbd class="cap pad pad-y">Y</kbd>',
  RT: '<kbd class="cap pad wide">RT</kbd>',
  LT: '<kbd class="cap pad wide">LT</kbd>',
  RB: '<kbd class="cap pad wide">RB</kbd>',
  LS: '<kbd class="cap pad wide">L-stick</kbd>',
  START: '<kbd class="cap pad wide">☰</kbd>',
}

export const ICON = {
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v3a5 5 0 0 1-10 0z" /><path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10.5" y="11" width="3" height="5"/><rect x="7" y="16" width="10" height="3" rx="1"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="2" height="18" rx="1"/><path d="M6 4h13l-3 4 3 4H6z"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.4 4.6-1.8.4a7 7 0 0 1-.7 1.7l1 1.6-1.9 1.9-1.6-1a7 7 0 0 1-1.7.7l-.4 1.8h-2.6l-.4-1.8a7 7 0 0 1-1.7-.7l-1.6 1-1.9-1.9 1-1.6a7 7 0 0 1-.7-1.7l-1.8-.4v-2.6l1.8-.4a7 7 0 0 1 .7-1.7l-1-1.6 1.9-1.9 1.6 1a7 7 0 0 1 1.7-.7l.4-1.8h2.6l.4 1.8a7 7 0 0 1 1.7.7l1.6-1 1.9 1.9-1 1.6a7 7 0 0 1 .7 1.7l1.8.4z"/></svg>`,
}
