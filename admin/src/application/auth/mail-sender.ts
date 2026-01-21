export interface MailSendRequest {
  to: string
  subject: string
  text: string
  html?: string
}

export interface MailSender {
  send(request: MailSendRequest): Promise<void>
}
