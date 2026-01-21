import type { MailSender, MailSendRequest } from '../../application/auth/mail-sender.js'

/**
 * Console-based mail sender for development/testing
 * Logs email content to console instead of sending actual emails
 */
export class ConsoleMailSender implements MailSender {
  async send(request: MailSendRequest): Promise<void> {
    console.log('=== Email Sent ===')
    console.log(`To: ${request.to}`)
    console.log(`Subject: ${request.subject}`)
    console.log('--- Text Content ---')
    console.log(request.text)
    if (request.html) {
      console.log('--- HTML Content ---')
      console.log(request.html)
    }
    console.log('==================')
  }
}
