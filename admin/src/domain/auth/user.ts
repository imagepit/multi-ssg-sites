export type UserStatus = 'active' | 'suspended'

export interface User {
  id: string
  email: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  id: string
  email: string
  status?: UserStatus
}

export function createUser(input: CreateUserInput): User {
  if (!input.id) {
    throw new Error('id is required')
  }
  if (!input.email) {
    throw new Error('email is required')
  }

  const normalizedEmail = input.email.toLowerCase().trim()

  if (!isValidEmail(normalizedEmail)) {
    throw new Error('invalid email format')
  }

  const now = new Date().toISOString()
  return {
    id: input.id,
    email: normalizedEmail,
    status: input.status ?? 'active',
    createdAt: now,
    updatedAt: now
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
