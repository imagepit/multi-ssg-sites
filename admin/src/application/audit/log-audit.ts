import type { AuditLogger } from './audit-logger.js'
import { createAuditRecord } from '../../domain/audit/audit-record.js'

interface LogAuditInput {
  actorId: string
  action: string
  resource: string
  siteId?: string
  metadata?: Record<string, unknown>
}

export async function logAudit(input: LogAuditInput, logger: AuditLogger): Promise<void> {
  const record = createAuditRecord({
    actorId: input.actorId,
    action: input.action,
    resource: input.resource,
    siteId: input.siteId,
    metadata: input.metadata
  })
  await logger.record(record)
}
