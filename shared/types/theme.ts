export type ThemeStatus = 'active' | 'disabled'

export interface Theme {
  id: string
  name: string
  version?: string
  status: ThemeStatus
  config?: Record<string, unknown>
}
