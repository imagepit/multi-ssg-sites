/**
 * お問い合わせメールテンプレート
 *
 * このファイルでメール本文のテンプレートを一元管理します。
 * プロバイダーに依存しない形式で定義し、各プロバイダーから呼び出されます。
 */

export interface ContactTemplateParams {
  /** 送信者名 */
  fromName: string;
  /** 送信者メールアドレス */
  fromEmail: string;
  /** 件名 */
  subject: string;
  /** 本文 */
  body: string;
  /** サイト名（オプション） */
  siteName?: string;
}

/**
 * お問い合わせメールの件名を生成
 */
export function formatSubject(params: ContactTemplateParams): string {
  const prefix = params.siteName ? `[${params.siteName}]` : '[お問い合わせ]';
  return `${prefix} ${params.subject}`;
}

/**
 * お問い合わせメールの本文を生成（プレーンテキスト）
 */
export function formatPlainTextBody(params: ContactTemplateParams): string {
  const { fromName, fromEmail, body, siteName } = params;

  const header = siteName
    ? `${siteName}にお問い合わせがありました。`
    : 'お問い合わせを受信しました。';

  return `${header}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
送信者情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
名前: ${fromName}
メールアドレス: ${fromEmail}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${body}
`;
}

/**
 * お問い合わせメールの本文を生成（HTML）
 * 将来的にHTMLメールが必要になった場合に使用
 */
export function formatHtmlBody(params: ContactTemplateParams): string {
  const { fromName, fromEmail, body, siteName } = params;

  const header = siteName
    ? `${siteName}にお問い合わせがありました。`
    : 'お問い合わせを受信しました。';

  // 本文の改行をHTMLに変換
  const htmlBody = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #555; margin-bottom: 8px; }
    .content { background: #f8f9fa; padding: 15px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>${header}</p>
    </div>

    <div class="section">
      <div class="section-title">送信者情報</div>
      <div class="content">
        <p><strong>名前:</strong> ${fromName}</p>
        <p><strong>メールアドレス:</strong> ${fromEmail}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">お問い合わせ内容</div>
      <div class="content">
        <p>${htmlBody}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
