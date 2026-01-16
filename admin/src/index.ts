import { handleHttpRequest } from './presentation/http/router.js'
import { JwtTokenVerifier } from './infrastructure/auth/jwt-verifier.js'
import { ConsoleAuditLogger } from './infrastructure/audit/console-audit-logger.js'
import { handleQueue } from './presentation/worker/queue-handler.js'
import { handleScheduled } from './presentation/worker/scheduled-handler.js'
import type { Env } from './env.js'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const tokenVerifier = env.ADMIN_JWT_SECRET ? new JwtTokenVerifier(env.ADMIN_JWT_SECRET) : null
    const auditLogger = new ConsoleAuditLogger()
    return handleHttpRequest(request, env, ctx, { tokenVerifier, auditLogger })
  },
  async queue(batch: MessageBatch<unknown>, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleQueue(batch, env, ctx)
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleScheduled(event, env, ctx)
  }
}
