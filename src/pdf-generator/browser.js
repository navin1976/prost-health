/**
 * Browser-compatible PDF generator using @react-pdf/renderer
 * This module handles dynamic loading of React and the PDF components
 * for client-side PDF generation in an Astro site.
 */

let pdfGeneratorReady = false;
let pdfGeneratorPromise = null;

/**
 * Initialize the PDF generator - loads React and @react-pdf/renderer
 * @returns {Promise<void>}
 */
export async function initializePDFGenerator() {
  if (pdfGeneratorReady) return;
  if (pdfGeneratorPromise) return pdfGeneratorPromise;

  pdfGeneratorPromise = (async () => {
    console.log('Initializing @react-pdf/renderer PDF generator...');

    // Dynamic imports for React and react-pdf
    const [React, ReactPDF] = await Promise.all([
      import('react'),
      import('@react-pdf/renderer')
    ]);

    // Store globally for component use
    window.__React = React;
    window.__ReactPDF = ReactPDF;

    console.log('@react-pdf/renderer initialized successfully');
    pdfGeneratorReady = true;
  })();

  return pdfGeneratorPromise;
}

/**
 * Map form field names from ScreeningForm to PDF generator expected format
 */
function mapFormData(formData) {
  return {
    // Personal details
    firstName: formData.firstName || '',
    lastName: formData.lastName || '',
    dateOfBirth: formData.dateOfBirth || '',
    email: formData.email || '',
    phone: formData.phone || '',
    nhsNumber: formData.nhsNumber || '',
    gpPractice: formData.gpPractice || '',

    // Ethnicity
    ethnicity: formData.ethnicity || '',

    // Family history
    familyHistory: formData.familyHistory && formData.familyHistory.length > 0 ? 'yes' : 'no',
    familyRelations: formData.familyHistory || [],

    // BRCA mutation (not in current form, but supported)
    brcaMutation: formData.brcaMutation || 'no',

    // Symptoms - map from checkbox names
    urinarySymptoms: formData.symptoms
      ? formData.symptoms.filter(s => ['urinary', 'frequency', 'urgency', 'weak-flow'].includes(s))
      : [],
    otherSymptoms: formData.symptoms
      ? formData.symptoms.filter(s => ['blood', 'pain'].includes(s))
      : [],

    // Medical history
    previousPsa: formData.previousPSA || 'no',
    psaValue: formData.lastPSAResult || '',
    previousBiopsy: formData.previousBiopsy || 'no',
    medications: formData.medications || '',

    // MRI Safety
    pacemaker: formData.safetyPacemaker || 'no',
    metalImplants: formData.safetyImplants === 'yes' || formData.safetyMetal === 'yes' || formData.safetyClips === 'yes' ? 'yes' : 'no',
    metalImplantsDetails: formData.metalImplantsDetails || '',
    claustrophobia: formData.safetyClaustrophobia || 'no',
    kidneyProblems: formData.safetyKidney || 'no',
  };
}

/**
 * Generate and download a screening request PDF
 * @param {Object} formData - Form data from ScreeningForm
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<{success: boolean, filename: string}>}
 */
export async function generateScreeningPDF(formData, onProgress) {
  try {
    if (onProgress) onProgress('Initializing PDF generator...');

    // Ensure PDF generator is initialized
    await initializePDFGenerator();

    if (onProgress) onProgress('Loading PDF components...');

    // Import the PDF document component and pdf function
    const { pdf } = await import('@react-pdf/renderer');
    const { default: React } = await import('react');

    // Import our theme and components
    const { styles, colors, getRiskColors, formatDate, formatYesNo, formatList, formatString } = await import('./theme.js');

    if (onProgress) onProgress('Building PDF document...');

    // Map form data to expected format
    const mappedData = mapFormData(formData);

    // Calculate risk level
    const riskLevel = calculateRiskLevel(mappedData);

    // Generate reference ID and date
    const referenceId = generateReferenceId();
    const generatedDate = formatGeneratedDate();

    // Create PDF document using React.createElement (since we can't use JSX in this file)
    const { Document, Page, View, Text, StyleSheet } = await import('@react-pdf/renderer');

    // Build the document structure
    const doc = React.createElement(Document, {
      title: 'Prost Health - Screening Request Form',
      author: 'Prost Health',
      subject: 'Patient Assessment Summary',
      keywords: 'prostate, screening, MRI, health assessment'
    },
      React.createElement(Page, { size: 'A4', style: styles.page },
        // Header
        createHeader(React, View, Text, styles),
        // Patient Details
        createPatientDetails(React, View, Text, styles, mappedData, formatDate),
        // Risk Assessment
        createRiskAssessment(React, View, Text, styles, mappedData, riskLevel, getRiskColors, formatList, formatString, formatYesNo),
        // Safety Check
        createSafetyCheck(React, View, Text, styles, mappedData, formatYesNo),
        // Footer
        createFooter(React, View, Text, styles, generatedDate, referenceId)
      )
    );

    if (onProgress) onProgress('Generating PDF...');

    // Generate the PDF blob
    const blob = await pdf(doc).toBlob();

    // Create filename
    const patientName = `${mappedData.firstName || 'Patient'}_${mappedData.lastName || 'Unknown'}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Prost_Health_Screening_${patientName}_${dateStr}.pdf`;

    if (onProgress) onProgress('Downloading PDF...');

    // Download the file
    downloadBlob(blob, filename);

    // Also open in new tab
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);

    return { success: true, filename };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

// Helper functions

function createHeader(React, View, Text, styles) {
  return React.createElement(View, null,
    React.createElement(View, { style: styles.header },
      React.createElement(View, null,
        React.createElement(Text, { style: styles.logo }, 'Prost Health'),
        React.createElement(Text, { style: styles.tagline }, 'MRI-First Prostate Screening')
      ),
      React.createElement(View, { style: styles.contactInfo },
        React.createElement(Text, { style: styles.contactText }, 'hello@prost.health'),
        React.createElement(Text, { style: styles.contactText }, 'www.prost.health')
      )
    ),
    React.createElement(View, { style: styles.headerLine }),
    React.createElement(View, { style: styles.documentTitle },
      React.createElement(Text, { style: styles.titleMain }, 'Screening Request Form'),
      React.createElement(Text, { style: styles.titleSub }, 'Patient Assessment Summary - NICE NG131 Guidelines')
    )
  );
}

function createPatientDetails(React, View, Text, styles, data, formatDate) {
  return React.createElement(View, { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, 'Patient Information'),
    React.createElement(View, { style: styles.grid },
      createGridItem(React, View, Text, styles, 'Full Name', `${data.firstName} ${data.lastName}`),
      createGridItem(React, View, Text, styles, 'Date of Birth', formatDate(data.dateOfBirth)),
      createGridItem(React, View, Text, styles, 'Email Address', data.email || 'Not provided'),
      createGridItem(React, View, Text, styles, 'Phone Number', data.phone || 'Not provided')
    )
  );
}

function createGridItem(React, View, Text, styles, label, value) {
  return React.createElement(View, { style: styles.gridItem },
    React.createElement(Text, { style: styles.gridLabel }, label),
    React.createElement(Text, { style: styles.gridValue }, value)
  );
}

function createRiskAssessment(React, View, Text, styles, data, riskLevel, getRiskColors, formatList, formatString, formatYesNo) {
  const riskColors = getRiskColors(riskLevel);
  const age = calculateAge(data.dateOfBirth);

  return React.createElement(View, null,
    // Risk Box
    React.createElement(View, { style: { ...styles.riskBox, backgroundColor: riskColors.bg } },
      React.createElement(View, { style: styles.riskHeader },
        React.createElement(View, null,
          React.createElement(Text, { style: styles.riskLabel }, 'Clinical Risk Assessment'),
          React.createElement(Text, { style: styles.riskDescription }, 'Based on NICE NG131 Guidelines for prostate cancer screening eligibility')
        ),
        React.createElement(View, { style: { ...styles.riskBadge, backgroundColor: riskColors.bg } },
          React.createElement(Text, { style: { ...styles.riskBadgeText, color: riskColors.text } }, riskLevel)
        )
      )
    ),
    // Risk Factors Section
    React.createElement(View, { style: styles.section },
      React.createElement(Text, { style: styles.sectionTitle }, 'Risk Factor Assessment'),
      React.createElement(View, { style: styles.table },
        createTableRow(React, View, Text, styles, 'Age at Assessment', `${age} years`),
        createTableRow(React, View, Text, styles, 'Ethnicity', formatString(data.ethnicity)),
        createTableRow(React, View, Text, styles, 'Family History', data.familyHistory === 'yes' ? formatList(data.familyRelations) : 'No family history reported')
      )
    ),
    // Symptoms Section
    React.createElement(View, { style: styles.section },
      React.createElement(Text, { style: styles.sectionTitle }, 'Current Symptoms'),
      React.createElement(View, { style: styles.table },
        createTableRow(React, View, Text, styles, 'Urinary Symptoms',
          data.urinarySymptoms && data.urinarySymptoms.length > 0 && !data.urinarySymptoms.includes('none')
            ? formatList(data.urinarySymptoms)
            : 'None reported'),
        createTableRow(React, View, Text, styles, 'Other Symptoms',
          data.otherSymptoms && data.otherSymptoms.length > 0 && !data.otherSymptoms.includes('none')
            ? formatList(data.otherSymptoms)
            : 'None reported')
      )
    ),
    // Medical History Section
    React.createElement(View, { style: styles.section },
      React.createElement(Text, { style: styles.sectionTitle }, 'Relevant Medical History'),
      React.createElement(View, { style: styles.table },
        createTableRow(React, View, Text, styles, 'Previous PSA Test', formatYesNo(data.previousPsa)),
        data.previousPsa === 'yes' && createTableRow(React, View, Text, styles, 'Last PSA Result', data.psaValue ? `${data.psaValue} ng/mL` : 'Not provided'),
        createTableRow(React, View, Text, styles, 'Previous Prostate Biopsy', formatYesNo(data.previousBiopsy))
      )
    )
  );
}

function createTableRow(React, View, Text, styles, label, value) {
  if (!value && value !== '') return null;
  return React.createElement(View, { style: styles.row },
    React.createElement(Text, { style: styles.rowLabel }, label),
    React.createElement(Text, { style: styles.rowValue }, value)
  );
}

function createSafetyCheck(React, View, Text, styles, data, formatYesNo) {
  const hasSafetyConcerns = data.pacemaker === 'yes' || data.metalImplants === 'yes' ||
    data.claustrophobia === 'yes' || data.kidneyProblems === 'yes';

  return React.createElement(View, { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, 'MRI Safety Screening'),
    React.createElement(Text, { style: styles.helperText }, 'The following safety questions are required for MRI eligibility assessment.'),
    React.createElement(View, { style: styles.table },
      createTableRow(React, View, Text, styles, 'Cardiac Pacemaker or ICD', formatYesNo(data.pacemaker)),
      createTableRow(React, View, Text, styles, 'Metal Implants or Fragments', formatYesNo(data.metalImplants)),
      createTableRow(React, View, Text, styles, 'Claustrophobia', formatYesNo(data.claustrophobia)),
      createTableRow(React, View, Text, styles, 'Kidney Problems', formatYesNo(data.kidneyProblems))
    ),
    hasSafetyConcerns && React.createElement(View, { style: styles.warningBox },
      React.createElement(Text, { style: styles.warningTitle }, 'MRI Safety Review Required'),
      React.createElement(Text, { style: styles.warningText },
        'One or more safety concerns have been identified. This patient will require additional screening and approval from the MRI safety officer before proceeding with the examination.')
    )
  );
}

function createFooter(React, View, Text, styles, generatedDate, referenceId) {
  return React.createElement(View, { style: styles.footer, fixed: true },
    React.createElement(View, null,
      React.createElement(Text, { style: styles.footerText }, `Generated: ${generatedDate}`),
      React.createElement(Text, { style: styles.footerText }, `Reference: ${referenceId}`)
    ),
    React.createElement(View, { style: styles.footerRight },
      React.createElement(Text, { style: styles.footerText }, 'Prost Health Ltd'),
      React.createElement(Text, { style: styles.footerText }, 'This document is confidential')
    )
  );
}

function calculateAge(dob) {
  if (!dob) return 'Unknown';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateRiskLevel(data) {
  let riskScore = 0;

  // Age factor
  const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
  if (dob) {
    const age = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
    if (age >= 50) riskScore += 1;
    if (age >= 70) riskScore += 1;
  }

  // Ethnicity factor
  if (data.ethnicity === 'black-african' || data.ethnicity === 'black-caribbean') {
    riskScore += 2;
  }

  // Family history
  if (data.familyHistory === 'yes') {
    riskScore += 2;
    if (data.familyRelations && data.familyRelations.length > 1) {
      riskScore += 1;
    }
  }

  // Symptoms
  const hasUrinarySymptoms = data.urinarySymptoms && data.urinarySymptoms.length > 0 && !data.urinarySymptoms.includes('none');
  const hasOtherSymptoms = data.otherSymptoms && data.otherSymptoms.length > 0 && !data.otherSymptoms.includes('none');
  if (hasUrinarySymptoms) riskScore += 1;
  if (hasOtherSymptoms) riskScore += 2;

  // Elevated PSA
  if (data.previousPsa === 'yes' && data.psaValue) {
    const psa = parseFloat(data.psaValue);
    if (psa >= 4) riskScore += 2;
    if (psa >= 10) riskScore += 2;
  }

  if (riskScore >= 6) return 'HIGH';
  if (riskScore >= 3) return 'MEDIUM';
  return 'STANDARD';
}

function generateReferenceId() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PH-${dateStr}-${random}`;
}

function formatGeneratedDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default generateScreeningPDF;
