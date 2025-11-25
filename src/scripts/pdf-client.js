// Client-side PDF generation module
// This file gets bundled by Astro/Vite for production

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ScreeningRequestPDF } from '../pdf-generator/ScreeningRequestPDF.jsx';

/**
 * Generate and download a PDF from form data
 * Uses @react-pdf/renderer for beautiful client-side PDF generation
 *
 * @param {Object} formData - The screening form data
 * @returns {Promise<void>}
 */
export async function generateScreeningPDF(formData) {
  try {
    // Create the PDF document
    const doc = React.createElement(ScreeningRequestPDF, { formData });

    // Generate the PDF blob
    const blob = await pdf(doc).toBlob();

    // Create filename with patient name and date
    const patientName = `${formData.firstName || 'Patient'}_${formData.lastName || 'Unknown'}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Prost_Health_Screening_${patientName}_${dateStr}.pdf`;

    // Download the file
    downloadBlob(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

/**
 * Helper function to download a blob as a file
 */
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

// Expose to window for use by inline scripts
if (typeof window !== 'undefined') {
  window.generateScreeningPDF = generateScreeningPDF;
}

export default generateScreeningPDF;
