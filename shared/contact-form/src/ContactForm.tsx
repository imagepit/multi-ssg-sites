'use client';

import { useState, type FormEvent } from 'react';

export interface ContactResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ContactFormProps {
  /** メール送信APIのエンドポイントURL */
  apiEndpoint: string;
  /** サイト名（メール本文に含まれる） */
  siteName?: string;
  /** 送信完了時のコールバック */
  onSuccess?: () => void;
  /** 送信エラー時のコールバック */
  onError?: (error: string) => void;
  /** カスタムクラス名 */
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  body: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  body?: string[];
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({
  apiEndpoint,
  siteName,
  onSuccess,
  onError,
  className = '',
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    body: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    setMessage('');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          siteName,
        }),
      });

      const data: ContactResponse = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setFormData({ name: '', email: '', subject: '', body: '' });
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(data.message);
        if (data.errors) {
          setErrors(data.errors as FormErrors);
        }
        onError?.(data.message);
      }
    } catch {
      const errorMessage = '通信エラーが発生しました。しばらく経ってから再度お試しください。';
      setStatus('error');
      setMessage(errorMessage);
      onError?.(errorMessage);
    }
  };

  const inputClassName = (hasError: boolean) =>
    `w-full rounded-lg border px-4 py-3 text-fd-foreground bg-fd-background placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-red-500 focus:ring-red-500/50'
        : 'border-fd-border focus:ring-fd-primary/50 focus:border-fd-primary'
    }`;

  if (status === 'success') {
    return (
      <div className={`rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center ${className}`}>
        <div className="mb-2 text-2xl">✓</div>
        <p className="text-fd-foreground font-semibold">送信完了</p>
        <p className="mt-2 text-fd-muted-foreground">{message}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 rounded-full bg-fd-primary px-6 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
        >
          新しいお問い合わせ
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {status === 'error' && message && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-sm font-medium text-fd-foreground">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contact-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClassName(!!errors.name)}
          placeholder="山田 太郎"
          disabled={status === 'submitting'}
        />
        {errors.name?.map((error, i) => (
          <p key={i} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-sm font-medium text-fd-foreground">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClassName(!!errors.email)}
          placeholder="example@email.com"
          disabled={status === 'submitting'}
        />
        {errors.email?.map((error, i) => (
          <p key={i} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-subject" className="block text-sm font-medium text-fd-foreground">
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contact-subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={inputClassName(!!errors.subject)}
          placeholder="お問い合わせの件名"
          disabled={status === 'submitting'}
        />
        {errors.subject?.map((error, i) => (
          <p key={i} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-body" className="block text-sm font-medium text-fd-foreground">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          className={`${inputClassName(!!errors.body)} min-h-[200px] resize-y`}
          placeholder="お問い合わせ内容をご記入ください"
          disabled={status === 'submitting'}
        />
        {errors.body?.map((error, i) => (
          <p key={i} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-full bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? '送信中...' : '送信する'}
      </button>
    </form>
  );
}
