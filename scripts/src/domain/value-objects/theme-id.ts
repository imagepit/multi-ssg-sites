import { DomainError } from '../errors.js'

const THEME_ID_PATTERN = /^[a-z0-9-]+$/

export class ThemeId {
  private constructor(private readonly value: string) {}

  static create(raw: string): ThemeId {
    const trimmed = raw.trim()
    if (!trimmed) {
      throw new DomainError('themeId is required')
    }
    if (!THEME_ID_PATTERN.test(trimmed)) {
      throw new DomainError(`themeId must match ${THEME_ID_PATTERN}`)
    }
    return new ThemeId(trimmed)
  }

  toString(): string {
    return this.value
  }
}
