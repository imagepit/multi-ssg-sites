'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactForm, type ContactFormProps } from './ContactForm';

export interface ContactFormModalProps extends Omit<ContactFormProps, 'className'> {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** モーダルのタイトル */
  title?: string;
  /** モーダルの説明文 */
  description?: string;
}

export function ContactFormModal({
  isOpen,
  onClose,
  title = 'お問い合わせ',
  description,
  onSuccess,
  ...formProps
}: ContactFormModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // モーダルが開いている間はbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleSuccess = () => {
    onSuccess?.();
    // 送信成功後、少し待ってからモーダルを閉じる
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isClosing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* オーバーレイ */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* モーダルコンテンツ */}
      <div
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-fd-border bg-fd-background shadow-2xl ${
          isClosing ? 'animate-scale-out' : 'animate-scale-in'
        }`}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-fd-border bg-fd-background px-8 pt-6 pb-5">
          <div className="flex-1 pr-4">
            <h2 id="contact-modal-title" className="text-xl font-semibold text-fd-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-sm text-fd-muted-foreground leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-lg p-2 text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground transition"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* フォーム */}
        <div className="px-8 py-6">
          <ContactForm {...formProps} onSuccess={handleSuccess} />
        </div>
      </div>

      {/* アニメーション用スタイル */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scale-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.2s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }

        .animate-scale-out {
          animation: scale-out 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
