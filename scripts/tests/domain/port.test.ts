import { describe, expect, it } from 'vitest'
import { Port } from '../../src/domain/value-objects/port.js'

describe('Port', () => {
  it('accepts numeric strings', () => {
    const port = Port.create('4000')
    expect(port.toNumber()).toBe(4000)
  })

  it('rejects out of range values', () => {
    expect(() => Port.create(0)).toThrow('port must be between 1 and 65535')
  })

  it('rejects non-numeric values', () => {
    expect(() => Port.create('abc')).toThrow('port must be a number')
  })
})
