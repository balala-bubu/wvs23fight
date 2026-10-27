/** Original names/art; familiar kart-racing mechanics, not Nintendo assets. */
export const ITEM_DETAILS={
 shield:['心瑩泡泡護盾','參考心瑩泡泡技能，賽車版改為抵擋一次攻擊。','Bubble Shield'],pepper:['成自然高蛋白','參考喝高蛋白，賽車版給短暫加速。','Pepper Boost'],taffy:['芭樂果實','參考芭樂投擲，放在車後讓對手打滑減速。','Guava Trap'],bee:['憶中學生出列','召喚學生追蹤前方車手。','Homing Bird'],
 shell:['宇的Reels','投出立體手機卡片，碰路緣會反彈。','Bouncing Candy'],tripleShell:['三連Reels','分三次投出宇的手機卡片。','Triple Candy'],tripleBee:['三位學生出列','分三次召喚追蹤學生。','Triple Birds'],tripleTaffy:['三顆芭樂','分三次放置芭樂陷阱。','Triple Guava'],triplePepper:['三杯高蛋白','分三次短暫加速。','Triple Pepper'],goldenPepper:['高蛋白補給','持續加速八秒，為賽車版補給變化。','Golden Pepper'],star:['女王天胡護體','天胡演出轉為短暫無敵與速度提升。','Star Candy'],rocket:['白狗奶龍衝鋒','沿用白狗奶龍技能模型，無敵自動駕駛六秒。','Rocket Candy'],lightning:['璿的封印符','參考封印符，讓未受保護對手縮小減速並失去道具。','Thunder Candy'],leader:['芭樂點名追擊','參考點名技能，派學生追擊領先對手。','Leader Bird'],bomb:['樂的搞巨炸','放下立體炸彈，倒數兩秒範圍爆炸。','Popcorn Bomb'],horn:['珍妮飆高音','高音聲波震開附近對手並清除攻擊道具。','Party Horn'],ink:['提姆熊相機閃幕','參考相機閃光，短暫遮擋前方對手的局部視線。','Ink Candy'],ghost:['心瑩弟弟幫忙','弟弟幫你偷取道具，短暫穿透攻擊與車輛。','Ghost Candy'],fire:['秉寶鬆餅連發','沿用原鬆餅模型，分三次發射。','Fire Candy'],boomerang:['璿的迴旋筊杯','沿用原筊杯模型，分三次擲出並返回。','Boomerang Cookie'],coin:['女王Offer獎金','參考女王Offer，獲得兩點補給，最多十點略微提速。','Coin Candy'],chomp:['雲嵐貝殼夾擊','沿用原貝殼模型，咬擊前方近距離對手並加速。','Chomper Candy'],partyBox:['Ten野餐補給','參考野餐技能，分八次使用不同同學的道具。','Party Eight'],
} as const
export type ItemKind=keyof typeof ITEM_DETAILS
export const ITEM_KINDS=Object.keys(ITEM_DETAILS) as ItemKind[]
export function itemCharges(kind:ItemKind):number{return kind==='partyBox'?8:['tripleShell','tripleBee','tripleTaffy','triplePepper','fire','boomerang'].includes(kind)?3:1}
export function itemWeights(place:number,count:number):Record<ItemKind,number>{
 const t=Math.max(0,Math.min(1,count<=1?0:place/(count-1))),behind=place>=Math.ceil(count/2),leader=place===0
 return {shield:.35-.2*t,taffy:.3-.2*t,pepper:.12+.2*t,bee:leader?0:.12+.15*t,shell:.25-.1*t,tripleShell:.04+.09*t,tripleBee:leader?0:.04+.12*t,tripleTaffy:.08-.05*t,triplePepper:.05+.2*t,goldenPepper:behind?.1:.01,star:behind?.12:.015,rocket:behind?.12:0,lightning:behind?.06:0,leader:leader?0:.04+.05*t,bomb:.08,horn:.1-.04*t,ink:leader?0:.06,ghost:.055,fire:.06,boomerang:.065,coin:leader?.18:.04,chomp:.065,partyBox:behind?.05:0}
}

export const ITEM_SKILL_SOURCES={
  "shield": {
    "character": "wxinyy",
    "move": "nB / xyTrapShot"
  },
  "pepper": {
    "character": "newton",
    "move": "dB / nwProtein"
  },
  "taffy": {
    "character": "kiafes",
    "move": "nB / kiaGuava"
  },
  "bee": {
    "character": "ichung",
    "move": "nB / icStudent"
  },
  "shell": {
    "character": "jackson",
    "move": "nB / hqReel"
  },
  "tripleShell": {
    "character": "jackson",
    "move": "nB / hqReel"
  },
  "tripleBee": {
    "character": "ichung",
    "move": "nB / icStudent"
  },
  "tripleTaffy": {
    "character": "kiafes",
    "move": "nB / kiaGuava"
  },
  "triplePepper": {
    "character": "newton",
    "move": "dB / nwProtein"
  },
  "goldenPepper": {
    "character": "newton",
    "move": "dB / nwProtein"
  },
  "star": {
    "character": "janice",
    "move": "ultimate / 天胡・國企女王"
  },
  "rocket": {
    "character": "karl",
    "move": "sB / whiteDog 奶龍造型"
  },
  "lightning": {
    "character": "xuan",
    "move": "dB / xuSealFire"
  },
  "leader": {
    "character": "kiafes",
    "move": "dB / kiaRoll"
  },
  "bomb": {
    "character": "masterogway",
    "move": "sB / mogBomb 與 dB / mogOrb"
  },
  "horn": {
    "character": "jennie",
    "move": "sB / jenWave"
  },
  "ink": {
    "character": "bear",
    "move": "dB / camFlash"
  },
  "ghost": {
    "character": "wxinyy",
    "move": "dB / xyKid"
  },
  "fire": {
    "character": "waffle",
    "move": "nB / waffleLob"
  },
  "boomerang": {
    "character": "xuan",
    "move": "nB / xuBwaFire"
  },
  "coin": {
    "character": "janice",
    "move": "nB / jnSnark"
  },
  "chomp": {
    "character": "seafood",
    "move": "dB / clam0 / clam1"
  },
  "partyBox": {
    "character": "kelsey",
    "move": "nB / kelPicnic"
  }
} as const
