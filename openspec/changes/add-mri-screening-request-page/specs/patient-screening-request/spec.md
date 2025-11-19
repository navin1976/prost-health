## ADDED Requirements

### Requirement: Screening Request Form
The system SHALL provide a multi-step form that collects user information for prostate cancer screening requests.

#### Scenario: Form progression
- **WHEN** user completes Personal Details section
- **THEN** enable Medical History section
- **AND** display progress indicator at 25%

#### Scenario: Conditional questions
- **WHEN** user is over 50 years old
- **THEN** show additional family history questions
- **AND** require PSA test history if available

#### Scenario: Form validation
- **WHEN** user submits form with required fields missing
- **THEN** display error messages for incomplete fields
- **AND** prevent submission until validation passes

### Requirement: Risk Assessment Integration
The form SHALL calculate and display prostate cancer risk based on NICE NG131 guidelines.

#### Scenario: Risk level calculation
- **WHEN** user completes all risk factor questions
- **THEN** calculate risk level (low/medium/high)
- **AND** display explanation of risk factors

#### Scenario: Risk-based recommendations
- **WHEN** calculated risk is high
- **THEN** recommend consultation with healthcare provider
- **AND** include NICE guideline reference

### Requirement: PDF Generation
The system SHALL generate a downloadable PDF containing all submitted form data and risk assessment.

#### Scenario: PDF creation
- **WHEN** user submits validated form
- **THEN** generate PDF with professional formatting
- **AND** include comprehensive form data
- **AND** add risk assessment results

#### Scenario: PDF content
- **WHEN** PDF is generated
- **THEN** include personal details summary
- **AND** include medical history and risk factors
- **AND** include risk assessment with recommendations
- **AND** include Prost Health contact information

#### Scenario: PDF delivery
- **WHEN** PDF generation is complete
- **THEN** initiate download to user's device
- **AND** display option to email PDF to user (optional)

### Requirement: Privacy and Compliance
The screening request form SHALL comply with GDPR and healthcare data regulations.

#### Scenario: Data minimization
- **WHEN** collecting user data
- **THEN** only request information necessary for screening assessment
- **AND** clearly explain why each data point is needed

#### Scenario: No persistent storage
- **WHEN** form is submitted
- **THEN** do not store personal health information in database
- **AND** only retain anonymized analytics for form completion

### Requirement: Form Accessibility
The screening request form SHALL be fully accessible to users with disabilities.

#### Scenario: Screen reader support
- **WHEN** form is navigated via screen reader
- **THEN** all form fields have appropriate labels
- **AND** error messages are announced
- **AND** form sequence is logical

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** all interactive elements are reachable
- **AND** focus is visible throughout the form
- **AND** form can be completed without mouse
