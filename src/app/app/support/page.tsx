'use client';

import { useState } from 'react';

export default function AppSupportPage() {
  const [configId, setConfigId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/app/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          ...(configId.trim() ? { configId: configId.trim() } : {}),
        }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus('error');
        setErrorMessage(json?.error || 'Could not submit support request.');
        return;
      }

      setStatus('success');
      setMessage('');
      setConfigId('');
    } catch {
      setStatus('error');
      setErrorMessage('Could not submit support request.');
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl">Support</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Send a request to the Patientli team. Please do not include any patient information (PHI).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-[var(--color-border)] bg-white p-6 space-y-4">
        {status === 'success' ? (
          <div className="rounded-2xl bg-[var(--color-bg-mint)] px-4 py-3 text-sm text-[var(--color-primary)]">
            Support request submitted. We’ll follow up by email.
          </div>
        ) : null}

        {status === 'error' && errorMessage ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <div>
          <label htmlFor="configId" className="block text-sm font-medium mb-1">
            Config ID (optional)
          </label>
          <input
            id="configId"
            value={configId}
            onChange={(e) => setConfigId(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="cuid…"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="Describe what you’d like changed…"
          />
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Avoid patient names, dates of birth, medical record numbers, or anything that could identify a patient.
          </p>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting' || message.trim().length === 0}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  );
}

