import type { Env } from '../../env.js'

export async function handleScheduled(
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  void event
  void env
  void ctx
}
