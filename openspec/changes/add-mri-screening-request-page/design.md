## Context
The MRI screening request feature allows users to complete a comprehensive health questionnaire that generates a professional PDF document suitable for sharing with healthcare providers. This bridges the gap between online information discovery and actual medical consultation.

## Goals / Non-Goals
- Goals:
  - Provide a professional, clinically-validated screening request form
  - Enable users to prepare for medical visits with complete documentation
  - Capture risk factors based on NICE NG131 guidelines
  - maintain GDPR compliance throughout the process
- Non-Goals:
  - Direct booking of MRI scans (out of scope for Phase 1)
  - Online payment processing
  - Direct medical advice or diagnosis

## Decisions
- Decision: Use Cloudflare Workers with pdf-lib for server-side PDF generation
  - Rationale: Avoids client-side PDF library bloat, ensures consistent output, leverages existing Cloudflare infrastructure
  - Alternatives considered: Client-side PDF generation (too heavy), external PDF service (privacy concerns)
- Decision: Multi-step form with progress indicator
  - Rationale: Reduces cognitive load, improves completion rates, allows conditional logic
  - Alternatives considered: Single long form (poor UX), accordion pattern (less clear progress)
- Decision: No data persistence for submitted forms
  - Rationale: Minimize privacy risk, avoid database complexity in Phase 1
  - Alternatives considered: Store submissions for analytics (privacy implications)

## Risks / Trade-offs
- Risk: PDF generation complexity and maintenance overhead
  - Mitigation: Use well-documented approach from technical reference, keep template simple
- Trade-off: Rich interactivity vs. privacy compliance
  - Decision: Favor privacy - minimize data collection, no persistent storage
- Risk: Form abandonment due to length
  - Mitigation: Progress indicator, clear estimated time, option to save partial progress locally

## Migration Plan
1. Deploy Cloudflare Worker for PDF generation
2. Create new Astro page route
3. Implement form component progressively
4. Add navigation updates
5. Deploy to staging for testing
6. Production rollout with monitoring

## Open Questions
- Should we offer email delivery of the generated PDF in addition to download?
- How detailed should the risk assessment explanation be without providing medical advice?
- Should we include healthcare provider lookup functionality?
