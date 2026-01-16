import { DomainError } from '../errors.js'

export class Port {
  private constructor(private readonly value: number) {}

  static create(raw: string | number): Port {
    const num = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw
    if (!Number.isFinite(num)) {
      throw new DomainError('port must be a number')
    }
    if (num < 1 || num > 65535) {
      throw new DomainError('port must be between 1 and 65535')
    }
    return new Port(num)
  }

  toNumber(): number {
    return this.value
  }

  toString(): string {
    return String(this.value)
  }
}
