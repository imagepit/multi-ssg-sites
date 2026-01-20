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
        className={isClosing ? 'animate-scale-out' : 'animate-scale-in'}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '512px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '16px',
          border: '1px solid var(--color-fd-border, #e5e7eb)',
          backgroundColor: 'var(--color-fd-background, #ffffff)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-fd-border, #e5e7eb)',
            backgroundColor: 'var(--color-fd-background, #ffffff)',
            padding: '24px 32px 20px 32px',
          }}
        >
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <h2
              id="contact-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-fd-foreground, #111827)',
              }}
            >
              {title}
            </h2>
            {description && (
              <p
                style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: 'var(--color-fd-muted-foreground, #6b7280)',
                  lineHeight: 1.625,
                }}
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              flexShrink: 0,
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--color-fd-muted-foreground, #6b7280)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
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
        <div style={{ padding: '24px 32px 32px 32px' }}>
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
