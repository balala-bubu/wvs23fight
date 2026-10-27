import {MAPS,signatureFor} from './maps/catalog'
import {setActiveMap,ACTIVE_MAP} from './maps/active'
import { MAP_SIGNATURE } from './maps/active'
import { RaceRoom } from './network/room'
import { RaceLobby } from './network/lobby'
import { ROSTER } from './game/characters'
import { setRaceLaps } from './game/config'
import type { RaceResult } from './game/game'
import './styles/main.css'
import './styles/wvs.css'
import { SHARED_IDS, sharedPortrait, rebuildSharedCharacters } from './custom/sharedCharacters'
import { Audio } from './engine/audio'
import { I18n, resolveLocale } from './engine/i18n'
import { Input } from './engine/input'
import { GameLoop } from './engine/loop'
import { SAVE_KEY, SaveStore, type SaveData } from './engine/save'
import type { Game } from './game/game'
import { TouchControls } from './ui/touch'
import { Ui } from './ui/ui'

async function boot(): Promise<void> {

  const canvas = document.querySelector<HTMLCanvasElement>('#game')!
  const firstRun = safeGet(SAVE_KEY) === null
  const save = new SaveStore()
  const i18n = new I18n(resolveLocale(save.data.locale || 'zh-TW', navigator.languages))
  const input = new Input()
  const audio = new Audio()
  let game: Game | undefined
  let room:RaceRoom|undefined
  let touch:TouchControls|undefined
  let lobby:RaceLobby|undefined
  let lastCharacter = save.data.character

  const applySettings = (d: SaveData) => {
    audio.setVolumes(d.musicVolume, d.sfxVolume, d.muted)
    input.autoThrottle = d.autoGas
    document.body.dataset.touchLayout=d.touchLayout
    document.body.style.setProperty('--touch-scale',String(d.touchSize));document.body.style.setProperty('--touch-opacity',String(d.touchOpacity))
    if (game) {
      game.reducedMotion = d.reducedMotion
      game.sensitivity = d.sensitivity
    }
  }

  const beginRace = (id: string, kartId = game?.selectedKart ?? '0', skin=game?.selectedSkin??0) => {
    if(ui.screen==='track'&&room?.role==='host'&&room.canStart){room.start();return}
    if(game)game.selectedSkin=skin
    if(room?.active){if(room.stage==='lobby'){room.select(id,kartId,skin);ui.show('network')}return}
    if (game) game.selectedKart = kartId
    if (!game) return
    audio.unlock()
    lastCharacter = id
    save.update({ character: id })
    const tutorial = !save.data.tutorialDone
    ui.resetHud()
    ui.showTutorial(tutorial)
    game.startRace(id, tutorial)
    if (tutorial) save.update({ tutorialDone: true })
    ui.show('hud')
    input.clearPresses()
    loop.resetAccumulator()
  }

  const pause = () => {
    if (game?.mode !== 'playing') return
    if(room?.inRace){game.networkLocalPaused=true;ui.show('pause');ui.setNetworkLabels(true);return}
    game.pause()
    ui.show('pause')
    ui.setNetworkLabels(false)
  }
  const resume = () => {
    if(room?.inRace){if(game)game.networkLocalPaused=false;ui.show(game?.mode==='ended'?'results':'hud');return}
    if (game?.mode !== 'paused') return
    game.resume()
    ui.show((game.mode as string) === 'ended' ? 'results' : 'hud')
    input.clearPresses()
    loop.resetAccumulator()
  }
  const toTitle = () => {
    if(room?.active){if(room.inRace)room.backToLobby();ui.show('network');return}
    game?.stopNetworkRace();setRaceLaps(3)
    game?.toTitle()
    ui.show('title')
  }

  const ui = new Ui(document.getElementById('ui')!, i18n, save, audio, input, {
    chooseTrack:()=>!room?.active,
    trackChanged:id=>{switchWorld(id);if(room?.active)room.setMap(MAP_SIGNATURE)},
    online:()=>{audio.unlock();game?.showSelect(save.data.character);ui.show('network');lobby?.render()},
    race: () => {
      room?.leave();game?.stopNetworkRace();setRaceLaps(3)
      audio.unlock()
      game?.showSelect(save.data.character)
      ui.beginSelection()
    },
    selectChanged: (id, kartId,skin) => game?.showSelect(id, kartId,skin),
    startRace: (id, kartId,skin) => beginRace(id, kartId,skin),
    backToTitle: toTitle,
    resume,
    restart: () => room?.active?toTitle():beginRace(lastCharacter),
    quit: toTitle,
    again: () => room?.active?toTitle():beginRace(lastCharacter),
    change: () => {
      if(room?.active){toTitle();return}
      game?.toTitle()
      game?.showSelect(lastCharacter)
      ui.beginSelection()
    },
    skipIntro: () => game?.skipIntro(),
    settings: patch => {
      const qualityChanged = patch.quality !== undefined && patch.quality !== save.data.quality
      save.update(patch)
      applySettings(save.data)
      if (patch.locale) i18n.set(patch.locale)
      if (qualityChanged) game?.setQuality(save.data.quality)
    },
  })
  ui.show('boot')
  applySettings(save.data)

  let loaded = 0
  const track = <T>(p: Promise<T>): Promise<T> => p.then(v => (ui.setBootProgress(0.1 + (++loaded / 4) * 0.8), v))
  ui.setBootProgress(0.1)
  const [{ Game }, { Renderer, suggestQuality }, physics] = await Promise.all([
    track(import('./game/game')),
    track(import('./engine/renderer')),
    track(import('./engine/physics')),
    track(import('./game/kartModel')),
    document.fonts.ready,
  ])
  await physics.initPhysics()
  await Promise.all([document.fonts.load('400 16px "WVS UI"'),document.fonts.load('900 16px "WVS UI"')])
  rebuildSharedCharacters()
  if (firstRun) {
    save.update({ quality: suggestQuality() })
    ui.refreshSettings()
  }
  const renderer = new Renderer(canvas, save.data.quality)
  // Custom characters / items (src/custom/assets.config.ts). Must finish before any kart or item is built.
  const [{ CUSTOM_ASSETS }, { loadCustomAssets }, { Assets }] = await Promise.all([import('./custom/assets.config'), import('./game/customAssets'), import('./engine/assets')])
  await loadCustomAssets(CUSTOM_ASSETS, new Assets())
  const portraits = new Map(SHARED_IDS.map(id => [id, sharedPortrait(id)]))
  ui.setPortraits(portraits)
  ui.setBootProgress(0.95)

  const gameHooks = {
      banner: (kind: Parameters<Ui['banner']>[0], vars?:Record<string,string|number>) => ui.banner(kind, vars),
      countdown: (n:number) => ui.countdown(n),hurt: (kind: 'bee'|'taffy'|'blocked') => ui.hurt(kind),hint: (h: Parameters<Ui['hint']>[0]) => ui.hint(h),placeChange: (up:boolean) => ui.placeChange(up),itemReady: (kind:Parameters<Ui['itemReady']>[0]) => ui.itemReady(kind),toast: (key:string,vars?:Record<string,string|number>) => ui.toast(key,vars),finished:(result:RaceResult)=>{ui.showResults(result);ui.setNetworkLabels(!!room?.active)}
  }
  game = new Game(
    renderer,
    input,
    audio,
    gameHooks,
    save.data.quality,
  )
  applySettings(save.data)
  ui.setTrackOutline(game.track.outline(4))
  let g = game
  function switchWorld(id:string):void{if(id===ACTIVE_MAP.id)return;const skin=g.selectedSkin,kart=g.selectedKart;g.dispose();setActiveMap(id);g=game=new Game(renderer,input,audio,gameHooks,save.data.quality);g.selectedSkin=skin;g.selectedKart=kart;applySettings(save.data);ui.setTrackOutline(g.track.outline(4));g.showSelect(save.data.character,kart,skin);const url=new URL(location.href);url.searchParams.set('track',ACTIVE_MAP.id);history.replaceState(null,'',url);loop.resetAccumulator();const debug=(window as unknown as {__game?:{game:Game}}).__game;if(debug)debug.game=g}
  const netStats=document.createElement('div');netStats.className='net-live-stats';netStats.hidden=true;document.getElementById('ui')!.append(netStats)
  room = new RaceRoom({
    changed:()=>{lobby?.render();if(room){netStats.hidden=!room.inRace;netStats.textContent=`${room.role==='host'?'房主':'P'+(room.slot+1)}・↓ ${(room.rxRate/1024).toFixed(1)} KB/s・↑ ${(room.txRate/1024).toFixed(1)} KB/s${room.role==='guest'?'・'+Math.round(room.rtt)+' ms':''}・${renderer.fps} FPS`}},
    mapSupported:signature=>MAPS.some(m=>signatureFor(m)===signature),
    mapChanged:signature=>{const map=MAPS.find(m=>signatureFor(m)===signature);if(!map)return false;switchWorld(map.id);return true},
    prepare:(setup,local,host)=>{setRaceLaps(setup.laps);audio.unlock();ui.resetHud();ui.showTutorial(false);g.startNetworkRace(setup.seats,local,host);ui.show('hud');input.clearPresses();loop.resetAccumulator()},
    go:()=>{g.networkWaiting=false;loop.resetAccumulator()},
    frame:f=>g.networkReceive(f),input:(slot,c)=>g.networkControl(slot,c),drop:slot=>g.networkDrop(slot),
    stop:()=>{g.stopNetworkRace();setRaceLaps(3);g.toTitle();ui.show('network');input.clearPresses()},
    result:value=>{const r=value as RaceResult;if(!r||!Array.isArray(r.rows)||r.rows.length!==6||!Number.isFinite(r.time)||!Number.isFinite(r.bestLap)||!Number.isInteger(r.place)||r.place<1||r.place>6||!ROSTER.some(c=>c.id===r.character)||!r.rows.every(row=>ROSTER.some(c=>c.id===row.character)&&Number.isFinite(row.time)&&Number.isFinite(row.bestLap)&&Number.isInteger(row.place)&&row.place>=1&&row.place<=6))return;g.networkShowResult(r)},
  },new Set(ROSTER.map(c=>c.id)),undefined,MAP_SIGNATURE)
  lobby=new RaceLobby(document.querySelector<HTMLElement>('[data-network]')!,room,i18n,portraits,()=>{g.showSelect(save.data.character);ui.beginSelection()},()=>{g.stopNetworkRace();setRaceLaps(3);g.toTitle();ui.show('title')},()=>ui.show('track'))

  let stepped = false
  const loop = new GameLoop({
    step: dt => {
      g.step(dt)
      stepped = true
    },
    render: (alpha, frameSeconds) => {
      input.update()
      if (input.consume('pause')) {
        if (g.mode === 'playing' && ui.screen === 'hud') pause()
        else if ((g.mode === 'paused'||room?.inRace) && ui.screen === 'pause') resume()
      }
      ui.frame(frameSeconds)
      if(room?.stage==='racing'){
        const now=performance.now()
        if(room.role==='host'){
          if(room.snapshotDue(now))room.broadcast(g.networkSnapshot(),now)
          for(const seat of room.seats)if(seat.slot>0&&seat.connected){const result=g.networkResult(seat.slot);if(result)room.result(seat.slot,result)}
        }else{g.networkRtt=room.rtt;room.sendControls(ui.screen==='hud'?{...input.axes,drift:input.held('drift')}:{throttle:0,brake:0,steer:0,drift:false},ui.screen==='hud'&&input.consume('item'),now)}
      }
      loop.paused = g.mode === 'paused'
      g.render(alpha, frameSeconds)
      if (ui.screen === 'hud' && g.player){const hud=g.hud();ui.updateHud(hud,frameSeconds);touch?.updateHud(hud)}
      // Presses are consumed inside fixed steps; drop leftovers once a step had the chance.
      if (stepped) {
        input.clearPresses()
        stepped = false
      }
    },
  })
  loop.start()

  document.addEventListener('visibilitychange', () => {
    if (document.hidden&&!room?.inRace) pause()
  })
  window.addEventListener('game:pause', pause)
  const unlockMusic = () => {
    if (audio.running) return
    audio.unlock()
    if (g.mode === 'title' || g.mode === 'select') g.playTitleMusic()
  }
  window.addEventListener('pointerdown', unlockMusic)
  window.addEventListener('keydown', unlockMusic)
  touch=new TouchControls(document.getElementById('ui')!, input, i18n, () => ui.screen === 'hud' && g.mode === 'playing')
  ui.setBootProgress(1)
  window.setTimeout(() => {const code=new URL(location.href).searchParams.get('room');if(code&&/^\d{6}$/.test(code)){lobby?.prefill(code);lobby?.render();ui.show('network');if(new URL(location.href).searchParams.get('autojoin')==='1')void room?.join(code)}else ui.show('title')}, 200)
  // Debug/test hook (read-only use): smoke tests inspect state through it.
  ;(window as unknown as { __game: unknown }).__game = { game: g, ui, input, save, room }
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

boot().catch(err => {
  console.error(err)
  const el = document.getElementById('ui')
  if (el) el.innerHTML = `<div class="fatal">Failed to start: ${String((err as Error)?.message ?? err).replace(/[<>&]/g, '')}</div>`
})
