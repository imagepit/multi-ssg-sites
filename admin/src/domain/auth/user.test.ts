import { describe, it, expect } from 'vitest'
import { createUser } from './user.js'

describe('createUser', () => {
  it('creates a user with valid input', () => {
    const user = createUser({
      id: 'user-123',
      email: 'test@example.com'
    })

    expect(user.id).toBe('user-123')
    expect(user.email).toBe('test@example.com')
    expect(user.status).toBe('active')
    expect(user.createdAt).toBeDefined()
    expect(user.updatedAt).toBeDefined()
  })

  it('normalizes email to lowercase', () => {
    const user = createUser({
      id: 'user-123',
      email: 'Test@EXAMPLE.com'
    })

    expect(user.email).toBe('test@example.com')
  })

  it('trims email whitespace', () => {
    const user = createUser({
      id: 'user-123',
      email: '  test@example.com  '
    })

    expect(user.email).toBe('test@example.com')
  })

  it('allows setting status to suspended', () => {
    const user = createUser({
      id: 'user-123',
      email: 'test@example.com',
      status: 'suspended'
    })

    expect(user.status).toBe('suspended')
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createUser({
        id: '',
        email: 'test@example.com'
      })
    ).toThrow('id is required')
  })

  it('throws error when email is missing', () => {
    expect(() =>
      createUser({
        id: 'user-123',
        email: ''
      })
    ).toThrow('email is required')
  })

  it('throws error for invalid email format', () => {
    expect(() =>
      createUser({
        id: 'user-123',
        email: 'invalid-email'
      })
    ).toThrow('invalid email format')
  })
})
