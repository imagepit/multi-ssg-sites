import { describe, expect, it } from 'vitest'
import { ThemeId } from '../../src/domain/value-objects/theme-id.js'

describe('ThemeId', () => {
  it('accepts kebab-case ids', () => {
    const themeId = ThemeId.create('example-theme')
    expect(themeId.toString()).toBe('example-theme')
  })

  it('rejects empty value', () => {
    expect(() => ThemeId.create('')).toThrow('themeId is required')
  })

  it('rejects invalid characters', () => {
    expect(() => ThemeId.create('Fumadocs')).toThrow('themeId must match')
  })
})
