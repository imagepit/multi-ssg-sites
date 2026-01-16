import type { AuditRecord } from '../../domain/audit/audit-record.js'

export interface AuditLogger {
  record(entry: AuditRecord): Promise<void>
}
