/**
 * 自動返信メールテンプレート
 *
 * 問い合わせ者に送信する「お問い合わせを受け付けました」という確認メール
 * このファイルを編集することで、自動返信メールの内容をカスタマイズできます
 */

export interface AutoReplyTemplateParams {
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
 * 自動返信メールの件名を生成
 */
export function formatAutoReplySubject(params: AutoReplyTemplateParams): string {
  const siteName = params.siteName || 'お問い合わせ';
  return `【${siteName}】お問い合わせを受け付けました`;
}

/**
 * 自動返信メールの本文を生成（プレーンテキスト）
 */
export function formatAutoReplyPlainTextBody(params: AutoReplyTemplateParams): string {
  const { fromName, subject, body, siteName } = params;

  const siteNameText = siteName || '当サイト';

  return `${fromName} 様

この度は${siteNameText}にお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
件名: ${subject}

${body}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

内容を確認の上、担当者より折り返しご連絡いたします。
通常、1〜2営業日以内にご返信いたしますので、今しばらくお待ちください。

※このメールは自動送信されています。
※このメールに直接ご返信いただいても対応できない場合がございます。

──────────────────────────────
${siteNameText}
──────────────────────────────
`;
}

/**
 * 自動返信メールの本文を生成（HTML）
 * 将来的にHTMLメールが必要になった場合に使用
 */
export function formatAutoReplyHtmlBody(params: AutoReplyTemplateParams): string {
  const { fromName, subject, body, siteName } = params;

  const siteNameText = siteName || '当サイト';

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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', sans-serif; line-height: 1.8; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #007bff; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { font-size: 18px; margin: 0; color: #007bff; }
    .greeting { margin-bottom: 20px; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #555; margin-bottom: 8px; border-left: 3px solid #007bff; padding-left: 10px; }
    .content { background: #f8f9fa; padding: 15px; border-radius: 4px; }
    .note { font-size: 12px; color: #888; margin-top: 20px; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>お問い合わせを受け付けました</h1>
    </div>

    <div class="greeting">
      <p>${fromName} 様</p>
      <p>この度は${siteNameText}にお問い合わせいただき、誠にありがとうございます。<br>
      以下の内容でお問い合わせを受け付けました。</p>
    </div>

    <div class="section">
      <div class="section-title">お問い合わせ内容</div>
      <div class="content">
        <p><strong>件名:</strong> ${subject}</p>
        <p>${htmlBody}</p>
      </div>
    </div>

    <p>内容を確認の上、担当者より折り返しご連絡いたします。<br>
    通常、2〜3営業日以内にご返信いたしますので、今しばらくお待ちください。</p>

    <div class="note">
      <p>※このメールは自動送信されています。<br>
      ※このメールに直接ご返信いただいても対応できない場合がございます。</p>
    </div>

    <div class="footer">
      ${siteNameText}
    </div>
  </div>
</body>
</html>`;
}
