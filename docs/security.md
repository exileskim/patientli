# Security & Compliance Boundaries

## Non-PHI policy (current)

This repo’s **Looks** platform is intentionally **non-PHI**:
- Allowed: practice marketing info (practice name, phone, address, logo URL), token overrides, design preferences.
- Not allowed: patient names, DOBs, medical record numbers, appointment details, treatment info, call recordings, etc.

## Support requests

The `/app/support` form is intended for non-PHI requests only.
- Do not paste patient-identifying information in messages.
- Support requests are stored as metadata in `AuditLog` for proof-of-work; this will be revisited for HIPAA readiness (redaction/segregation).

## CRM proof-of-concept

`/app/crm` is a **synthetic demo**:
- No Open Dental ingestion.
- No real patient tables.
- No HIPAA infrastructure yet.

## Next steps for HIPAA readiness (future)

Before ingesting PHI:
- Separate CRM deployment/security zone + BAA-backed hosting.
- Formal audit logging for PHI access.
- Encryption and key management policies.
- Minimum necessary access + RBAC + incident response runbooks.

