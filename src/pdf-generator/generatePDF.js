import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ScreeningRequestPDF } from './ScreeningRequestPDF.jsx';

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

/**
 * Generate PDF and return as base64 (useful for preview or email)
 *
 * @param {Object} formData - The screening form data
 * @returns {Promise<string>} Base64 encoded PDF
 */
export async function generateScreeningPDFBase64(formData) {
  try {
    const doc = React.createElement(ScreeningRequestPDF, { formData });
    const blob = await pdf(doc).toBlob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

export default generateScreeningPDF;
