import type { Env } from '../../env.js'

export async function handleQueue(
  batch: MessageBatch<unknown>,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  void env
  void ctx
  batch.ackAll()
}
