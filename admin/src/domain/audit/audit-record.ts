export interface AuditRecord {
  actorId: string
  action: string
  resource: string
  siteId?: string
  occurredAt: string
  metadata?: Record<string, unknown>
}

interface AuditRecordInput {
  actorId: string
  action: string
  resource: string
  siteId?: string
  occurredAt?: Date
  metadata?: Record<string, unknown>
}

export function createAuditRecord(input: AuditRecordInput): AuditRecord {
  if (!input.actorId) {
    throw new Error('actorId is required')
  }
  if (!input.action) {
    throw new Error('action is required')
  }
  if (!input.resource) {
    throw new Error('resource is required')
  }
  return {
    actorId: input.actorId,
    action: input.action,
    resource: input.resource,
    siteId: input.siteId,
    occurredAt: (input.occurredAt ?? new Date()).toISOString(),
    metadata: input.metadata
  }
}
