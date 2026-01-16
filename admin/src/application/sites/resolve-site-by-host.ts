import type { Site } from '../../domain/sites/site.js'
import type { SiteHostRepository } from './site-host-repository.js'

export async function resolveSiteByHost(hostname: string, repo: SiteHostRepository): Promise<Site | null> {
  const normalized = normalizeHostname(hostname)
  if (!normalized) {
    throw new Error('host is required')
  }
  const site = await repo.findByHost(normalized)
  if (!site || site.status !== 'active') {
    return null
  }
  return site
}

function normalizeHostname(hostname: string): string {
  const trimmed = hostname.trim().toLowerCase()
  if (!trimmed) {
    return ''
  }
  const withoutPort = stripPort(trimmed)
  return withoutPort.replace(/\.$/, '')
}

function stripPort(hostname: string): string {
  if (hostname.startsWith('[')) {
    const endIndex = hostname.indexOf(']')
    if (endIndex !== -1) {
      return hostname.slice(1, endIndex)
    }
  }
  const colonIndex = hostname.indexOf(':')
  if (colonIndex === -1) {
    return hostname
  }
  return hostname.slice(0, colonIndex)
}
