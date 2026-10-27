import en from '../i18n/en.json'
import zh from '../i18n/zh-CN.json'
import zhTW from '../i18n/zh-TW.json'
import { LOCALES, type Locale } from './save'

export type Dictionary = Record<string, string>
const DICTIONARIES: Record<Locale, Dictionary> = { en, 'zh-CN': zh, 'zh-TW': zhTW }

/**
 * Map a browser locale list to a supported locale: Traditional Chinese tags (zh-TW, zh-HK, zh-MO,
 * zh-Hant*) → 繁體中文, any other zh* → Simplified Chinese, else English.
 */
export function detectLocale(languages: readonly string[] | undefined): Locale {
  const first = ((languages ?? []).find(Boolean) ?? '').toLowerCase()
  if (!first.startsWith('zh')) return 'en'
  return /^zh([-_]hant|[-_]tw|[-_]hk|[-_]mo)/.test(first) ? 'zh-TW' : 'zh-CN'
}

/** A saved player choice always wins over browser detection. */
export function resolveLocale(saved: Locale | '', languages: readonly string[] | undefined): Locale {
  return (LOCALES as readonly string[]).includes(saved) ? (saved as Locale) : detectLocale(languages)
}

export class I18n {
  locale: Locale
  private listeners = new Set<(locale: Locale) => void>()

  constructor(locale: Locale) {
    this.locale = locale
    document.documentElement.lang = locale
  }

  /** Look up `key`, replacing `{name}` placeholders. Missing keys render the key so gaps are visible. */
  t(key: string, vars: Record<string, string | number> = {}): string {
    const text = DICTIONARIES[this.locale][key] ?? DICTIONARIES.en[key] ?? key
    return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
  }

  set(locale: Locale): void {
    if (locale === this.locale) return
    this.locale = locale
    document.documentElement.lang = locale
    for (const fn of this.listeners) fn(locale)
  }

  onChange(fn: (locale: Locale) => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
}

export const DICTIONARY_KEYS = { en: Object.keys(en), zh: Object.keys(zh), zhTW: Object.keys(zhTW) }
