export type ChannelKey =
  | 'google_ads'
  | 'website_form'
  | 'click_to_call'
  | 'google_business';

export type LeadEvent = {
  id: string;
  occurredAt: string; // ISO
  channel: ChannelKey;
  campaign?: string;
  landingPage?: string;
  phone?: string;
  email?: string;
  name?: string;
};

export type PatientEvent = {
  id: string;
  occurredAt: string; // ISO
  name: string;
  phone?: string;
  email?: string;
  productionValueUsd: number;
};

export type AttributionMatchMethod = 'phone' | 'email' | 'name_date';

export type AttributionMatch = {
  patientId: string;
  leadId: string;
  method: AttributionMatchMethod;
  score: number;
};

