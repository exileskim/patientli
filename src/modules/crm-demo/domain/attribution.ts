import type { AttributionMatch, LeadEvent, PatientEvent } from './types';

function normalizePhone(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D+/g, '');
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

function normalizeEmail(email?: string) {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
  return trimmed.length ? trimmed : null;
}

function normalizeName(name?: string) {
  if (!name) return null;
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ');
  return normalized.length ? normalized : null;
}

function daysBetween(aIso: string, bIso: string) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  return Math.abs(a - b) / (1000 * 60 * 60 * 24);
}

function scoreCandidate(patient: PatientEvent, lead: LeadEvent) {
  const patientPhone = normalizePhone(patient.phone);
  const leadPhone = normalizePhone(lead.phone);
  if (patientPhone && leadPhone && patientPhone === leadPhone) {
    return { method: 'phone' as const, score: 1.0 };
  }

  const patientEmail = normalizeEmail(patient.email);
  const leadEmail = normalizeEmail(lead.email);
  if (patientEmail && leadEmail && patientEmail === leadEmail) {
    return { method: 'email' as const, score: 0.9 };
  }

  const patientName = normalizeName(patient.name);
  const leadName = normalizeName(lead.name);
  if (patientName && leadName && patientName === leadName) {
    const deltaDays = daysBetween(patient.occurredAt, lead.occurredAt);
    if (deltaDays <= 7) {
      return { method: 'name_date' as const, score: 0.6 };
    }
  }

  return null;
}

export function matchPatientsToLeads(input: {
  patients: PatientEvent[];
  leads: LeadEvent[];
}): AttributionMatch[] {
  const { patients, leads } = input;

  const sortedLeads = [...leads].sort(
    (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );

  const matches: AttributionMatch[] = [];

  for (const patient of patients) {
    const patientTs = new Date(patient.occurredAt).getTime();
    const candidates = sortedLeads
      .filter((lead) => new Date(lead.occurredAt).getTime() <= patientTs)
      .map((lead) => {
        const scored = scoreCandidate(patient, lead);
        return scored ? { lead, scored } : null;
      })
      .filter((value): value is NonNullable<typeof value> => Boolean(value));

    if (candidates.length === 0) continue;

    candidates.sort((a, b) => {
      if (b.scored.score !== a.scored.score) return b.scored.score - a.scored.score;
      // tie-break: last-click style
      return new Date(b.lead.occurredAt).getTime() - new Date(a.lead.occurredAt).getTime();
    });

    const best = candidates[0];
    matches.push({
      patientId: patient.id,
      leadId: best.lead.id,
      method: best.scored.method,
      score: best.scored.score,
    });
  }

  return matches;
}

