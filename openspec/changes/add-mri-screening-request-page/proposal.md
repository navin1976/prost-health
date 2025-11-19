## Why
To provide potential patients with a streamlined way to request a screening MRI scan by completing a comprehensive online form that captures personal details and risk factors, then generates a downloadable PDF request form that can be taken to their healthcare provider.

## What Changes
- Create a new "Request Screening" page with a multi-step form
- Implement form validation for personal details and risk assessment questions
- Add PDF generation functionality using a Cloudflare Worker function
- Include form submission tracking and analytics
- **BREAKING**: Requires new Cloudflare Worker deployed alongside existing site

## Impact
- New capability: Patient screening request functionality
- Affected specs: New `patient-screening-request` capability
- Affected code: New page route, form components, PDF generation service
- Integration: PDF generation via Cloudflare Workers (as documented in the technical reference)
