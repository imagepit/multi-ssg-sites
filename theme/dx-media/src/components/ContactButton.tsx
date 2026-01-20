'use client';

import { useState } from 'react';
import { ContactFormModal } from '@techdoc/contact-form';

interface ContactButtonProps {
  /** ボタンのラベル */
  label?: string;
  /** サイト名 */
  siteName?: string;
  /** メール送信APIのエンドポイントURL */
  apiEndpoint?: string;
  /** ボタンのクラス名 */
  className?: string;
}

export function ContactButton({
  label = 'お問い合わせ',
  siteName,
  apiEndpoint = 'https://techdoc-mail-api.pages.dev/contact',
  className = 'inline-flex items-center justify-center rounded-full bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition',
}: ContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>

      <ContactFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        apiEndpoint={apiEndpoint}
        siteName={siteName}
        title="お問い合わせ"
        description="ご質問やアドバイスがございましたらお気軽にご連絡ください。"
      />
    </>
  );
}
