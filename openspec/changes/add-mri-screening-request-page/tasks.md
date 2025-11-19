## 1. Form Design and Implementation
- [ ] 1.1 Create multi-step form component with sections: Personal Details, Medical History, Risk Factors, Symptoms
- [ ] 1.2 Implement form validation with appropriate error messaging
- [ ] 1.3 Add progress indicator and form state management
- [ ] 1.4 Design responsive layout for mobile and desktop

## 2. Risk Assessment Logic
- [ ] 2.1 Implement risk calculation algorithm based on NICE guidelines
- [ ] 2.2 Add conditional question flows based on age and family history
- [ ] 2.3 Create risk level display with explanatory text

## 3. PDF Generation Service
- [ ] 3.1 Create Cloudflare Worker for PDF generation using pdf-lib (recommended approach from technical doc)
- [ ] 3.2 Design PDF template with form data, risk assessment, and next steps
- [ ] 3.3 Implement secure data handling in compliance with GDPR
- [ ] 3.4 Add error handling for PDF generation failures

## 4. Frontend Integration
- [ ] 4.1 Create new Astro page at `/request-screening`
- [ ] 4.2 Add navigation link to request page from main navigation
- [ ] 4.3 Implement PDF download functionality with loading states
- [ ] 4.4 Add form submission confirmation and next steps

## 5. Analytics and Tracking
- [ ] 5.1 Implement form completion tracking
- [ ] 5.2 Add funnel analytics for form abandonment
- [ ] 5.3 Configure privacy-compliant analytics respecting healthcare data

## 6. Testing and Validation
- [ ] 6.1 Create unit tests for form validation logic
- [ ] 6.2 Add E2E tests for complete form submission flow
- [ ] 6.3 Test PDF generation across different devices and browsers
- [ ] 6.4 Validate GDPR compliance for data handling
