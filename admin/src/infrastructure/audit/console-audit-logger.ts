import type { AuditLogger } from '../../application/audit/audit-logger.js'
import type { AuditRecord } from '../../domain/audit/audit-record.js'

export class ConsoleAuditLogger implements AuditLogger {
  async record(entry: AuditRecord): Promise<void> {
    console.log('[audit]', JSON.stringify(entry))
  }
}
