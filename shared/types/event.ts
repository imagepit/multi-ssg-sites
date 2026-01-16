export type EventName = 'page_view'

export interface PageViewEvent {
  event: 'page_view'
  siteId: string
  path: string
  referrer?: string
  ts: number
  anonId: string
  sessionId: string
  ua?: string
}

export type AnalyticsEvent = PageViewEvent
