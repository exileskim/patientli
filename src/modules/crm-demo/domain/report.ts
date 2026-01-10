import type { AttributionMatch, LeadEvent, PatientEvent } from './types';

export type ChannelSummary = {
  channel: LeadEvent['channel'];
  leads: number;
  attributedPatients: number;
  attributedRevenueUsd: number;
};

export function buildDemoAttributionReport(input: {
  leads: LeadEvent[];
  patients: PatientEvent[];
  matches: AttributionMatch[];
}) {
  const { leads, patients, matches } = input;

  const leadById = new Map(leads.map((lead) => [lead.id, lead]));
  const patientById = new Map(patients.map((patient) => [patient.id, patient]));

  const channels = new Map<LeadEvent['channel'], ChannelSummary>();

  for (const lead of leads) {
    if (!channels.has(lead.channel)) {
      channels.set(lead.channel, {
        channel: lead.channel,
        leads: 0,
        attributedPatients: 0,
        attributedRevenueUsd: 0,
      });
    }
    channels.get(lead.channel)!.leads += 1;
  }

  let attributedRevenueUsd = 0;

  for (const match of matches) {
    const lead = leadById.get(match.leadId);
    const patient = patientById.get(match.patientId);
    if (!lead || !patient) continue;

    attributedRevenueUsd += patient.productionValueUsd;

    const summary = channels.get(lead.channel);
    if (!summary) continue;
    summary.attributedPatients += 1;
    summary.attributedRevenueUsd += patient.productionValueUsd;
  }

  return {
    totals: {
      leads: leads.length,
      patients: patients.length,
      attributedPatients: matches.length,
      attributedRevenueUsd,
    },
    channelSummaries: [...channels.values()].sort((a, b) => b.attributedRevenueUsd - a.attributedRevenueUsd),
  };
}

