export class SitePhase {
  private constructor(private readonly value: string) {}

  static create(value: string): SitePhase {
    const normalized = value.trim()
    return new SitePhase(normalized || 'unknown')
  }

  isPublishable(): boolean {
    return this.value === 'publish'
  }

  toString(): string {
    return this.value
  }
}
