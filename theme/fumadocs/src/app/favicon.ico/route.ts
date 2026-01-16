import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Prefer static files copied to public/* via scripts/prepare-site-assets.mjs.
export const dynamic = 'force-static'
export const runtime = 'nodejs'

const faviconCandidates = [
  { name: 'favicon.ico', type: 'image/x-icon' },
  { name: 'favicon.png', type: 'image/png' },
  { name: 'favicon.svg', type: 'image/svg+xml' },
]

export async function GET() {
  const publicDir = path.join(process.cwd(), 'public')

  for (const candidate of faviconCandidates) {
    try {
      const data = await readFile(path.join(publicDir, candidate.name))
      return new Response(data, {
        headers: {
          'Content-Type': candidate.type,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (error) {
      const err = error as { code?: string }
      if (err?.code !== 'ENOENT') {
        throw error
      }
    }
  }

  return new Response(null, { status: 404 })
}
