import type { LeadEvent, PatientEvent } from './domain/types';

export const demoPractice = {
  id: 'demo-practice',
  name: 'Forestville Family Dentistry (Demo)',
  timezone: 'America/Los_Angeles',
};

export const demoLeads: LeadEvent[] = [
  {
    id: 'lead_001',
    occurredAt: '2026-01-02T17:22:00.000Z',
    channel: 'google_ads',
    campaign: 'Invisalign - Forestville',
    landingPage: '/invisalign',
    phone: '+1 (555) 010-1001',
    name: 'Taylor Reed',
  },
  {
    id: 'lead_002',
    occurredAt: '2026-01-03T19:05:00.000Z',
    channel: 'website_form',
    landingPage: '/new-patient',
    email: 'alex.demo@example.com',
    name: 'Alex Morgan',
  },
  {
    id: 'lead_003',
    occurredAt: '2026-01-04T15:40:00.000Z',
    channel: 'click_to_call',
    landingPage: '/services/cleanings',
    phone: '+1 (555) 010-2002',
    name: 'Jordan Lee',
  },
  {
    id: 'lead_004',
    occurredAt: '2026-01-05T02:18:00.000Z',
    channel: 'google_business',
    phone: '+1 (555) 010-3003',
    name: 'Sam Rivera',
  },
  {
    id: 'lead_005',
    occurredAt: '2026-01-06T21:12:00.000Z',
    channel: 'google_ads',
    campaign: 'Emergency Dentist',
    landingPage: '/emergency',
    phone: '+1 (555) 010-4004',
    name: 'Casey Park',
  },
  {
    id: 'lead_006',
    occurredAt: '2026-01-07T18:01:00.000Z',
    channel: 'website_form',
    landingPage: '/contact',
    email: 'jamie.demo@example.com',
    name: 'Jamie Chen',
  },
  {
    id: 'lead_007',
    occurredAt: '2026-01-08T20:44:00.000Z',
    channel: 'click_to_call',
    landingPage: '/services/whitening',
    phone: '+1 (555) 010-5005',
    name: 'Morgan Diaz',
  },
  {
    id: 'lead_008',
    occurredAt: '2026-01-09T16:09:00.000Z',
    channel: 'google_ads',
    campaign: 'Dental Implants',
    landingPage: '/implants',
    email: 'pat.demo@example.com',
    name: 'Pat Quinn',
  },
];

export const demoPatients: PatientEvent[] = [
  {
    id: 'patient_001',
    occurredAt: '2026-01-04T21:00:00.000Z',
    name: 'Alex Morgan',
    email: 'alex.demo@example.com',
    productionValueUsd: 1250,
  },
  {
    id: 'patient_002',
    occurredAt: '2026-01-06T19:30:00.000Z',
    name: 'Jordan Lee',
    phone: '+1 (555) 010-2002',
    productionValueUsd: 320,
  },
  {
    id: 'patient_003',
    occurredAt: '2026-01-09T02:05:00.000Z',
    name: 'Casey Park',
    phone: '+1 (555) 010-4004',
    productionValueUsd: 880,
  },
  {
    id: 'patient_004',
    occurredAt: '2026-01-10T17:15:00.000Z',
    name: 'Jamie Chen',
    email: 'jamie.demo@example.com',
    productionValueUsd: 560,
  },
  {
    id: 'patient_005',
    occurredAt: '2026-01-11T23:20:00.000Z',
    name: 'Sam Rivera',
    phone: '+1 (555) 010-3003',
    productionValueUsd: 2100,
  },
];

