export function healthHandler(): Response {
  const body = JSON.stringify({ ok: true, ts: Date.now() })
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  })
}
