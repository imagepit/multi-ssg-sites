import { describe, expect, it } from 'vitest'
import { createAuditRecord } from '../../src/domain/audit/audit-record.js'

describe('createAuditRecord', () => {
  it('creates a record with required fields', () => {
    const record = createAuditRecord({
      actorId: 'user-1',
      action: 'update',
      resource: '/sites'
    })
    expect(record.actorId).toBe('user-1')
    expect(record.action).toBe('update')
    expect(record.resource).toBe('/sites')
    expect(record.occurredAt).toBeTruthy()
  })

  it('throws when actorId is missing', () => {
    expect(() =>
      createAuditRecord({
        actorId: '',
        action: 'update',
        resource: '/sites'
      })
    ).toThrow('actorId is required')
  })
})
