// Cloudflare Worker for PDF generation using pdf-lib
// Based on the technical reference for PDF generation on Cloudflare

export default {
  async fetch(request, env, ctx) {
    // Only handle POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the form data
      const formData = await request.json();
      
      // Generate the PDF
      const pdfBytes = await generateScreeningPDF(formData);
      
      // Return the PDF as a blob
      return new Response(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="prost-health-screening-request-${new Date().toISOString().split('T')[0]}.pdf"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      return new Response('Failed to generate PDF', { status: 500 });
    }
  },
};

async function generateScreeningPDF(data) {
  // Dynamic import of pdf-lib (only works in Node.js environment)
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  
  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Define colors
  const navyColor = rgb(0.12, 0.23, 0.37); // #1e3a5f
  const grayColor = rgb(0.31, 0.31, 0.31); // #4f4f4f
  const lightGrayColor = rgb(0.85, 0.85, 0.85); // #d9d9d9
  
  // Layout dimensions
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;
  let currentY = pageHeight - margin;
  
  // Helper function to add text
  function addText(text, fontSize = 12, fontType = font, color = grayColor) {
    page.drawText(text, {
      x: margin,
      y: currentY,
      size: fontSize,
      font: fontType,
      color: color,
      maxWidth: contentWidth,
    });
    currentY -= fontSize + 5;
  }
  
  // Header
  const title = "Prostate Cancer Screening Request";
  const titleFontSize = 24;
  addText(title, titleFontSize, boldFont, navyColor);
  currentY -= 10;
  
  // Date
  addText(`Date: ${new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })}`, 12, font, grayColor);
  currentY -= 20;
  
  // Personal Details Section
  addSectionHeader("Personal Details", boldFont, navyColor);
  addDetailRow("Name:", `${data.firstName || ''} ${data.lastName || ''}`);
  addDetailRow("Date of Birth:", formatDate(data.dateOfBirth));
  addDetailRow("Contact Email:", data.email || 'Not provided');
  addDetailRow("Phone:", data.phone || 'Not provided');
  addDetailRow("NHS Number:", data.nhsNumber || 'Not provided');
  currentY -= 10;
  
  // Medical History Section
  addSectionHeader("Medical History", boldFont, navyColor);
  addDetailRow("Previous PSA Test:", data.previousPSA === 'yes' ? 'Yes' : 'No');
  
  if (data.previousPSA === 'yes') {
    addDetailRow("Last PSA Test Date:", formatDate(data.lastPSADate));
    addDetailRow("Last PSA Result (ng/mL):", data.lastPSAResult || 'Unknown');
  }
  
  addDetailRow("Previous Prostate Biopsy:", data.previousBiopsy === 'yes' ? 'Yes' : 'No');
  addDetailRow("Previous Prostate MRI:", data.previousMRI === 'yes' ? 'Yes' : 'No');
  currentY -= 10;
  
  // Risk Factors Section
  addSectionHeader("Risk Assessment", boldFont, navyColor);
  
  // Calculate age
  const age = calculateAge(data.dateOfBirth);
  addDetailRow("Age:", `${age} years`);
  
  // Family history
  const familyHistory = data.familyHistory && data.familyHistory.length > 0 
    ? data.familyHistory.map(item => 
        item === 'father' ? 'Father' : 
        item === 'brother' ? 'Brother' : 
        item === 'grandfather' ? 'Grandfather' : item
      ).join(', ')
    : 'None reported';
  addDetailRow("Family History:", familyHistory);
  
  // Symptoms
  const symptoms = data.symptoms && data.symptoms.length > 0 && !data.symptoms.includes('none')
    ? data.symptoms.map(item => 
        item === 'urinary' ? 'Urinary changes' : 
        item === 'blood' ? 'Blood in urine/semen' : 
        item === 'pain' ? 'Pain in hips/back/pelvis' : item
      ).join(', ')
    : 'None reported';
  addDetailRow("Symptoms:", symptoms);
  
  // Ethnicity
  const ethnicityText = data.ethnicity 
    ? data.ethnicity === 'white' ? 'White' :
      data.ethnicity === 'black-african' ? 'Black African' :
      data.ethnicity === 'black-caribbean' ? 'Black Caribbean' :
      data.ethnicity === 'asian' ? 'Asian' : 'Other'
    : 'Not provided';
  addDetailRow("Ethnicity:", ethnicityText);
  currentY -= 10;
  
  // Risk Assessment Result
  addSectionHeader("Risk Assessment Result", boldFont, navyColor);
  addDetailRow("Risk Level:", data.riskLevel || 'Not calculated');
  
  // Add NICE Guideline reference
  addText("This assessment is based on NICE Guideline NG131 for prostate cancer diagnosis and management.", 
          10, font, grayColor);
  addText("For more information, visit: https://www.nice.org.uk/guidance/ng131", 10, font, grayColor);
  currentY -= 20;
  
  // Next Steps Section
  addSectionHeader("Recommended Next Steps", boldFont, navyColor);
  
  const riskLevel = data.riskLevel?.toLowerCase().includes('high') ? 'high' :
                   data.riskLevel?.toLowerCase().includes('medium') ? 'medium' : 'low';
  
  let nextStepsText = '';
  if (riskLevel === 'high') {
    nextStepsText = "• Schedule an appointment with your GP to discuss prostate screening options\n• Consider MRI-first assessment to avoid unnecessary biopsies\n• Bring this form to your appointment";
  } else if (riskLevel === 'medium') {
    nextStepsText = "• Discuss prostate health screening with your GP\n• Consider PSA testing as initial screening\n• Bring this form to your appointment";
  } else {
    nextStepsText = "• Maintain regular health check-ups\n• Be aware of any changes in urinary habits\n• Reassess risk if family history changes";
  }
  
  addText(nextStepsText, 11, font, grayColor);
  currentY -= 20;
  
  // Footer
  addSectionHeader("About Prost Health", boldFont, navyColor);
  addText("Prost Health provides MRI-first prostate cancer screening", 11, font, grayColor);
  addText("recommended by NICE Guidelines NG131.", 11, font, grayColor);
  addText("Visit us at: https://prost-health.pages.dev", 10, font, grayColor);
  
  // Helper functions
  function addSectionHeader(text, font, color) {
    // Add a horizontal line before each section (except the first)
    if (currentY < pageHeight - margin - 100) {
      page.drawLine({
        start: { x: margin, y: currentY + 15 },
        end: { x: pageWidth - margin, y: currentY + 15 },
        thickness: 1,
        color: lightGrayColor,
      });
    }
    
    addText(text, 14, font, color);
    currentY -= 10;
  }
  
  function addDetailRow(label, value) {
    addText(label, 11, boldFont, grayColor);
    addText(value || 'N/A', 11, font, grayColor);
    currentY -= 5;
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'Not provided';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  }
  
  function calculateAge(dateString) {
    if (!dateString) return 0;
    
    try {
      const today = new Date();
      const dob = new Date(dateString);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age;
    } catch (e) {
      return 0;
    }
  }
  
  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
