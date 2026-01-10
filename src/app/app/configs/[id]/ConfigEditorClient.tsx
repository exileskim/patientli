'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import type { LookConfigDocumentV1 } from '@/modules/looks/domain/config.schema';
import type { LookTokenOverridesV1, LookTokensV1 } from '@/modules/looks/domain/tokens.schema';
import { cssVarsFromLookTokensV1, mergeLookTokensV1 } from '@/modules/looks/ui/tokens';

type RevisionListItem = { id: string; revision: number; createdAt: string };

const accentPresets = [
  { label: 'Lime', value: '#E8F59E' },
  { label: 'Peach', value: '#F5D5C8' },
  { label: 'Sage', value: '#D4E5D7' },
];

const fontPairs = [
  {
    label: 'Classic',
    headingFamily: '"ivypresto-display", Georgia, "Times New Roman", serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
  {
    label: 'Serif',
    headingFamily: 'Georgia, "Times New Roman", serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
  {
    label: 'Modern',
    headingFamily: '"Outfit", system-ui, -apple-system, sans-serif',
    bodyFamily: '"Outfit", system-ui, -apple-system, sans-serif',
  },
];

export function ConfigEditorClient(props: {
  configId: string;
  lookSlug: string;
  lookTitle: string;
  lookVersion: number;
  baseTokens: LookTokensV1;
  initialConfig: LookConfigDocumentV1;
  revisions: RevisionListItem[];
}) {
  const { configId, lookSlug, lookTitle, lookVersion, baseTokens, initialConfig } = props;

  const [practiceName, setPracticeName] = useState(initialConfig.practice.name);
  const [practicePhone, setPracticePhone] = useState(initialConfig.practice.phone ?? '');
  const [tokenOverrides, setTokenOverrides] = useState<LookTokenOverridesV1>(
    initialConfig.tokenOverrides ?? {}
  );
  const [revisions, setRevisions] = useState<RevisionListItem[]>(props.revisions);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mergedTokens = useMemo(
    () => mergeLookTokensV1(baseTokens, tokenOverrides),
    [baseTokens, tokenOverrides]
  );

  const previewStyle = useMemo(() => cssVarsFromLookTokensV1(mergedTokens), [mergedTokens]);

  const configDocument = useMemo<LookConfigDocumentV1>(
    () => ({
      schemaVersion: 1,
      lookSlug,
      lookVersion,
      industry: 'dental',
      practice: {
        ...initialConfig.practice,
        name: practiceName.trim(),
        phone: practicePhone.trim() || undefined,
      },
      tokenOverrides,
    }),
    [initialConfig.practice, lookSlug, lookVersion, practiceName, practicePhone, tokenOverrides]
  );

  async function handleCopyPreviewLink() {
    setStatusMessage(null);
    const url = `${window.location.origin}/looks/${lookSlug}?id=${configId}`;
    await navigator.clipboard.writeText(url);
    setStatusMessage('Preview link copied.');
  }

  async function handleSave() {
    setStatusMessage(null);
    setIsSaving(true);
    try {
      const response = await fetch(`/api/app/configs/${configId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configDocument }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.revision) {
        setStatusMessage(json?.error || 'Could not save changes.');
        return;
      }

      const item: RevisionListItem = {
        id: json.revision.id,
        revision: json.revision.revision,
        createdAt: json.revision.createdAt,
      };
      setRevisions((prev) => [item, ...prev]);
      setStatusMessage('Saved.');
    } catch {
      setStatusMessage('Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRollback(targetRevision: number) {
    setStatusMessage(null);
    setIsSaving(true);
    try {
      const response = await fetch(`/api/app/configs/${configId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: targetRevision }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.revision) {
        setStatusMessage(json?.error || 'Could not restore that version.');
        return;
      }

      if (json.config?.practice?.name) {
        setPracticeName(json.config.practice.name);
      }
      setPracticePhone(json.config?.practice?.phone ?? '');
      setTokenOverrides(json.config?.tokenOverrides ?? {});

      const item: RevisionListItem = {
        id: json.revision.id,
        revision: json.revision.revision,
        createdAt: json.revision.createdAt,
      };
      setRevisions((prev) => [item, ...prev]);
      setStatusMessage(`Restored revision ${targetRevision}.`);
    } catch {
      setStatusMessage('Could not restore that version.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm text-[var(--color-text-muted)]">
            <Link href="/app/configs" className="hover:underline">
              Configs
            </Link>{' '}
            <span className="mx-2">/</span>
            <span className="text-[var(--color-text-secondary)]">{lookTitle}</span>
          </div>
          <h1 className="mt-2 font-heading text-3xl">Edit config</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Update your practice details and style tokens. Every save creates a new version you can roll back to.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyPreviewLink}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
          >
            Copy preview link
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !practiceName.trim()}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-cream)] px-4 py-3 text-sm">
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-heading text-xl">Practice</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="practiceName" className="block text-sm font-medium mb-1">
                  Practice name
                </label>
                <input
                  id="practiceName"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Your practice name"
                />
              </div>
              <div>
                <label htmlFor="practicePhone" className="block text-sm font-medium mb-1">
                  Phone (optional)
                </label>
                <input
                  id="practicePhone"
                  value={practicePhone}
                  onChange={(e) => setPracticePhone(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-heading text-xl">Style</h2>
            <div className="mt-4 space-y-5">
              <div>
                <p className="text-sm font-medium mb-2">Accent color</p>
                <div className="flex flex-wrap gap-2">
                  {accentPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setTokenOverrides((prev) => ({
                          ...prev,
                          color: { ...prev.color, accent: preset.value },
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.value }} />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Font pair</p>
                <div className="grid gap-2">
                  {fontPairs.map((pair) => (
                    <button
                      key={pair.label}
                      type="button"
                      onClick={() =>
                        setTokenOverrides((prev) => ({
                          ...prev,
                          typography: {
                            ...prev.typography,
                            headingFamily: pair.headingFamily,
                            bodyFamily: pair.bodyFamily,
                          },
                        }))
                      }
                      className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-left text-sm hover:bg-[var(--color-bg-cream)] transition-colors"
                    >
                      <span className="font-medium">{pair.label}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">Aa</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-heading text-xl">Version history</h2>
            {revisions.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">No versions yet.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {revisions.map((rev, idx) => (
                  <li key={rev.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">
                        Revision {rev.revision}
                        {idx === 0 ? <span className="ml-2 text-xs text-[var(--color-text-muted)]">(latest)</span> : null}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {new Date(rev.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRollback(rev.revision)}
                      disabled={isSaving}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs hover:bg-[var(--color-bg-cream)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section className="rounded-3xl bg-[var(--color-bg-cream)] p-6">
          <div data-look-preview style={previewStyle} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="bg-[var(--color-bg-dark)] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/60">Preview</div>
                  <div className="mt-1 font-heading text-xl text-white">{practiceName.trim() || 'Your practice'}</div>
                </div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
                  {lookTitle}
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-heading text-2xl text-[var(--color-primary)]">Beautiful smiles start here.</h3>
              <p className="mt-3 max-w-prose text-sm text-[var(--color-text-secondary)]">
                This is a deterministic preview using your saved tokens. In Phase 2, this preview will render the full template and content packs.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-bg-dark)]">
                  Book now
                </span>
                <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)]">
                  Call {practicePhone.trim() || '(555) 555-5555'}
                </span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="aspect-square rounded-2xl bg-[var(--color-bg-mint)]" />
                <div className="aspect-square rounded-2xl bg-[var(--color-bg-cream)] border border-[var(--color-border)]" />
                <div className="aspect-square rounded-2xl bg-[var(--color-bg-white)] border border-[var(--color-border)]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
