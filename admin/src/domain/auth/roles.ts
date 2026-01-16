export type Role = 'admin' | 'editor' | 'viewer'

const roleRank: Record<Role, number> = {
  viewer: 1,
  editor: 2,
  admin: 3
}

function isRole(value: string): value is Role {
  return value === 'admin' || value === 'editor' || value === 'viewer'
}

export function normalizeRoles(roles?: string[]): Role[] {
  if (!roles) {
    return []
  }
  return roles.filter(isRole)
}

export function hasAtLeastRole(roles: string[] | undefined, required: Role): boolean {
  const normalized = normalizeRoles(roles)
  if (normalized.length === 0) {
    return false
  }

  const highest = normalized.reduce((current, role) =>
    roleRank[role] > roleRank[current] ? role : current
  )
  return roleRank[highest] >= roleRank[required]
}
