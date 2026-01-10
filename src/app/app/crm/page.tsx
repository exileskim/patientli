import { demoLeads, demoPatients, demoPractice } from '@/modules/crm-demo/demo-data';
import { matchPatientsToLeads } from '@/modules/crm-demo/domain/attribution';
import { buildDemoAttributionReport } from '@/modules/crm-demo/domain/report';

const channelLabel: Record<string, string> = {
  google_ads: 'Google Ads',
  website_form: 'Website Form',
  click_to_call: 'Click to Call',
  google_business: 'Google Business',
};

export default function CrmDemoPage() {
  const matches = matchPatientsToLeads({ patients: demoPatients, leads: demoLeads });
  const report = buildDemoAttributionReport({ leads: demoLeads, patients: demoPatients, matches });

  const leadById = new Map(demoLeads.map((lead) => [lead.id, lead]));
  const matchByPatientId = new Map(matches.map((match) => [match.patientId, match]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl">CRM Demo</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Proof-of-concept attribution dashboard using synthetic (non-PHI) demo data for {demoPractice.name}.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-cream)] p-6 text-sm text-[var(--color-text-secondary)]">
        This is a non-PHI demo module. No Open Dental ingestion, no real patient data, and no HIPAA infrastructure yet.
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Leads</div>
          <div className="mt-2 font-heading text-2xl">{report.totals.leads}</div>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Patients</div>
          <div className="mt-2 font-heading text-2xl">{report.totals.patients}</div>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Attributed</div>
          <div className="mt-2 font-heading text-2xl">{report.totals.attributedPatients}</div>
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">Revenue</div>
          <div className="mt-2 font-heading text-2xl">
            ${report.totals.attributedRevenueUsd.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-heading text-xl">Channel breakdown</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <tr>
                <th className="py-2 pr-4">Channel</th>
                <th className="py-2 pr-4">Leads</th>
                <th className="py-2 pr-4">Attributed patients</th>
                <th className="py-2 pr-4">Attributed revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {report.channelSummaries.map((row) => (
                <tr key={row.channel}>
                  <td className="py-3 pr-4 font-medium">{channelLabel[row.channel] ?? row.channel}</td>
                  <td className="py-3 pr-4">{row.leads}</td>
                  <td className="py-3 pr-4">{row.attributedPatients}</td>
                  <td className="py-3 pr-4">${row.attributedRevenueUsd.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-heading text-xl">Patient attribution</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Matching strategy: phone → email → name + date proximity (demo scoring).
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              <tr>
                <th className="py-2 pr-4">Patient</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Matched channel</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {demoPatients.map((patient) => {
                const match = matchByPatientId.get(patient.id);
                const lead = match ? leadById.get(match.leadId) : undefined;
                return (
                  <tr key={patient.id}>
                    <td className="py-3 pr-4 font-medium">{patient.name}</td>
                    <td className="py-3 pr-4">{new Date(patient.occurredAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">${patient.productionValueUsd.toLocaleString()}</td>
                    <td className="py-3 pr-4">{lead ? (channelLabel[lead.channel] ?? lead.channel) : 'Unattributed'}</td>
                    <td className="py-3 pr-4">{match?.method ?? '—'}</td>
                    <td className="py-3 pr-4">{match ? match.score.toFixed(2) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

