import { describe, expect, it } from 'vitest'
import { hasAtLeastRole, normalizeRoles } from '../../src/domain/auth/roles.js'

describe('normalizeRoles', () => {
  it('filters unknown roles', () => {
    const roles = normalizeRoles(['admin', 'ghost', 'viewer'])
    expect(roles).toEqual(['admin', 'viewer'])
  })

  it('returns empty array when undefined', () => {
    expect(normalizeRoles()).toEqual([])
  })
})

describe('hasAtLeastRole', () => {
  it('accepts exact role', () => {
    expect(hasAtLeastRole(['viewer'], 'viewer')).toBe(true)
  })

  it('rejects lower privilege', () => {
    expect(hasAtLeastRole(['viewer'], 'editor')).toBe(false)
  })

  it('accepts higher privilege', () => {
    expect(hasAtLeastRole(['admin'], 'editor')).toBe(true)
  })

  it('rejects when no roles provided', () => {
    expect(hasAtLeastRole(undefined, 'viewer')).toBe(false)
  })
})
