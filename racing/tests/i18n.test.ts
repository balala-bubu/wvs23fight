import { describe, expect, it } from 'vitest'
import en from '../src/i18n/en.json'
import zh from '../src/i18n/zh-CN.json'
import zhTW from '../src/i18n/zh-TW.json'
import { detectLocale, resolveLocale } from '../src/engine/i18n'

describe('i18n', () => {
  it('detects Chinese browsers and defaults to English', () => {
    expect(detectLocale(['zh-CN', 'en'])).toBe('zh-CN')
    expect(detectLocale(['zh-TW'])).toBe('zh-TW')
    expect(detectLocale(['zh-HK', 'en'])).toBe('zh-TW')
    expect(detectLocale(['zh-Hant-TW'])).toBe('zh-TW')
    expect(detectLocale(['zh-Hans-CN'])).toBe('zh-CN')
    expect(detectLocale(['ZH'])).toBe('zh-CN')
    expect(detectLocale(['en-US', 'zh-CN'])).toBe('en')
    expect(detectLocale([])).toBe('en')
    expect(detectLocale(undefined)).toBe('en')
  })

  it('lets a saved choice win over detection', () => {
    expect(resolveLocale('en', ['zh-CN'])).toBe('en')
    expect(resolveLocale('zh-CN', ['en-US'])).toBe('zh-CN')
    expect(resolveLocale('', ['zh-CN'])).toBe('zh-CN')
    expect(resolveLocale('zh-TW', ['en-US'])).toBe('zh-TW')
    expect(resolveLocale('', ['zh-TW'])).toBe('zh-TW')
  })

  it('has the same keys and placeholders in every language', () => {
    expect(Object.keys(zh).sort()).toEqual(Object.keys(en).sort())
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort()
    expect(Object.keys(zhTW).sort()).toEqual(Object.keys(en).sort())
    for (const [key, value] of Object.entries(en)) {
      expect(vars((zh as Record<string, string>)[key]), key).toEqual(vars(value))
      expect(vars((zhTW as Record<string, string>)[key]), key).toEqual(vars(value))
    }
  })
})
