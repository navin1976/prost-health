// Browser-compatible screening form module

// Multi-step form handling and risk assessment
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('multiStepForm');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  
  let currentStep = 1;
  const totalSteps = 4;
  let formData = {};

  // Initialize form
  initializeForm();

  function initializeForm() {
    // Add event listeners to radio buttons for conditional sections
    const previousPSARadios = document.querySelectorAll('input[name="previousPSA"]');
    previousPSARadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const psaDetails = document.getElementById('psaDetails');
        if (this.value === 'yes') {
          psaDetails.style.display = 'block';
        } else {
          psaDetails.style.display = 'none';
        }
      });
    });

    // Add event listeners for form validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
    });

    // Add navigation event listeners
    prevBtn.addEventListener('click', previousStep);
    nextBtn.addEventListener('click', nextStep);
    form.addEventListener('submit', handleSubmit);

    // Initialize date of birth max date (must be 18 or older)
    const dobInput = document.getElementById('dateOfBirth');
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    dobInput.max = maxDate.toISOString().split('T')[0];

    // Symptom checkbox logic
    const symptomCheckboxes = document.querySelectorAll('input[name="symptoms"]');
    const noneCheckbox = document.querySelector('input[name="symptoms"][value="none"]');
    
    symptomCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        if (this.value === 'none' && this.checked) {
          symptomCheckboxes.forEach(cb => {
            if (cb.value !== 'none') {
              cb.checked = false;
              cb.disabled = true;
            }
          });
        } else if (this.checked && noneCheckbox.checked) {
          noneCheckbox.checked = false;
        } else if (this.value !== 'none' && !this.checked) {
          // Check if any other symptoms are still checked
          const anyChecked = Array.from(symptomCheckboxes).some(cb => 
            cb.checked && cb.value !== 'none'
          );
          symptomCheckboxes.forEach(cb => {
            if (cb.value !== 'none') {
              cb.disabled = false;
            }
          });
        }
      });
    });
  }

  function validateField(field) {
    let isValid = true;
    const errorElement = field.nextElementSibling;

    if (field.hasAttribute('required') && !field.value.trim()) {
      showError(field, 'This field is required');
      isValid = false;
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        showError(field, 'Please enter a valid email address');
        isValid = false;
      } else {
        clearError(field);
      }
    } else if (field.type === 'tel' && field.value) {
      const phoneRegex = /^[+\d\s\-\(\)]+$/;
      if (!phoneRegex.test(field.value)) {
        showError(field, 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearError(field);
      }
    } else if (field.type === 'date' && field.value) {
      if (field.id === 'dateOfBirth') {
        const dob = new Date(field.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || age > 120) {
          showError(field, 'Please enter a valid date of birth (age 18-120)');
          isValid = false;
        } else {
          clearError(field);
        }
      } else {
        clearError(field);
      }
    } else if (field.id === 'nhsNumber' && field.value) {
      const nhsRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (!nhsRegex.test(field.value)) {
        showError(field, 'Please enter a valid NHS number (XXX-XXX-XXXX)');
        isValid = false;
      } else {
        clearError(field);
      }
    } else if (field.value) {
      clearError(field);
    }

    return isValid;
  }

  function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Special validation for radio groups
    if (step === 2) {
      const previousPSA = document.querySelector('input[name="previousPSA"]:checked');
      const previousBiopsy = document.querySelector('input[name="previousBiopsy"]:checked');
      const previousMRI = document.querySelector('input[name="previousMRI"]:checked');

      if (!previousPSA || !previousBiopsy || !previousMRI) {
        isValid = false;
        if (!previousPSA) showError(document.querySelector('input[name="previousPSA"]'), 'Please select an option');
        if (!previousBiopsy) showError(document.querySelector('input[name="previousBiopsy"]'), 'Please select an option');
        if (!previousMRI) showError(document.querySelector('input[name="previousMRI"]'), 'Please select an option');
      }
    }

    return isValid;
  }

  function showError(field, message) {
    field.classList.add('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
      errorElement.textContent = message;
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('form-error')) {
      errorElement.textContent = '';
    }
  }

  function updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progressPercentage}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach(step => {
      const stepNumber = parseInt(step.dataset.step);
      step.classList.remove('active', 'completed');
      
      if (stepNumber < currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === currentStep) {
        step.classList.add('active');
      }
    });
  }

  function showStep(step) {
    // Hide current step
    document.querySelector('.form-step.active').classList.remove('active');
    
    // Show new step
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    
    // Update navigation buttons
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    nextBtn.style.display = step === totalSteps ? 'none' : 'block';
    submitBtn.style.display = step === totalSteps ? 'block' : 'none';
    
    updateProgressBar();

    // If this is the review step, populate the summary
    if (step === 4) {
      populateSummary();
      calculateRisk();
    }
  }

  function nextStep() {
    if (!validateStep(currentStep)) {
      // Find first invalid field and focus it
      const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
      const firstInvalid = currentStepElement.querySelector('.error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Save current step data
    saveStepData(currentStep);

    // Move to next step
    currentStep++;
    showStep(currentStep);
  }

  function previousStep() {
    currentStep--;
    showStep(currentStep);
  }

  function saveStepData(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepElement.querySelectorAll('input, select');
    
    inputs.forEach(input => {
      if (input.type === 'radio') {
        if (input.checked) {
          formData[input.name] = input.value;
        }
      } else if (input.type === 'checkbox') {
        if (!formData[input.name]) {
          formData[input.name] = [];
        }
        if (input.checked) {
          if (!formData[input.name].includes(input.value)) {
            formData[input.name].push(input.value);
          }
        } else {
          formData[input.name] = formData[input.name].filter(val => val !== input.value);
        }
      } else {
        formData[input.name] = input.value;
      }
    });
  }

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }

  function calculateRisk() {
    // Calculate based on NICE NG131 guidelines
    let riskScore = 0;
    let riskFactors = [];
    const age = calculateAge(formData.dateOfBirth);
    
    // Age risk factor
    if (age >= 50) {
      riskScore += 2;
      riskFactors.push(`Age ${age}+ increases risk`);
    } else if (age >= 45) {
      riskScore += 1;
      riskFactors.push(`Age ${age}+ may increase risk`);
    }
    
    // Family history risk factor
    if (formData.familyHistory && formData.familyHistory.length > 0) {
      riskScore += formData.familyHistory.includes('father') ? 3 : 2;
      riskFactors.push('Family history of prostate cancer');
    }
    
    // Ethnicity risk factor
    if (formData.ethnicity && (formData.ethnicity === 'black-african' || formData.ethnicity === 'black-caribbean')) {
      riskScore += 2;
      riskFactors.push('Higher risk associated with Black ethnicity');
    }
    
    // PSA history
    if (formData.previousPSA === 'yes' && formData.lastPSAResult) {
      const psa = parseFloat(formData.lastPSAResult);
      if (psa > 3.0) {
        riskScore += 2;
        riskFactors.push(`Elevated PSA level: ${psa} ng/mL`);
      }
    } else if (formData.previousPSA === 'no') {
      riskScore += 1;
      riskFactors.push('Unknown PSA status');
    }
    
    // Symptoms
    if (formData.symptoms && !formData.symptoms.includes('none')) {
      riskScore += 1;
      riskFactors.push('Present urinary symptoms');
    }
    
    // Determine risk level
    let riskLevel, riskExplanation, nextSteps;
    
    if (riskScore >= 7) {
      riskLevel = 'high';
      riskExplanation = `Based on your responses, you have several risk factors that warrant medical attention. Your age, family history, and symptoms indicate a higher than average risk. According to NICE NG131 guidelines, you should discuss screening options with your healthcare provider.`;
      nextSteps = 'Schedule an appointment with your GP to discuss prostate screening options, including MRI-first assessment.';
    } else if (riskScore >= 4) {
      riskLevel = 'medium';
      riskExplanation = `Based on your responses, you have some risk factors worth monitoring. While your overall risk is not high, NICE NG131 guidelines suggest discussing screening with your healthcare provider, especially if you're over 50.`;
      nextSteps = 'Consider discussing prostate health with your GP at your next routine appointment, especially if you\'re approaching or over 50.';
    } else {
      riskLevel = 'low';
      riskExplanation = `Based on your responses, your risk factors for prostate cancer appear to be low. However, regular health check-ups are important as risk can change over time. NICE NG131 guidelines recommend awareness of prostate health for all men.`;
      nextSteps = 'Maintain regular health check-ups and be aware of any changes in urinary habits or family health history.';
    }
    
    // Update risk assessment display
    const riskLevelElement = document.getElementById('riskLevel');
    const riskExplanationElement = document.getElementById('riskExplanation');
    
    riskLevelElement.className = `risk-level ${riskLevel}`;
    riskLevelElement.textContent = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) + ' Risk';
    
    riskExplanationElement.innerHTML = `
      <p>${riskExplanation}</p>
      <h4>Next Steps:</h4>
      <p>${nextSteps}</p>
      <p><em>This assessment is based on NICE NG131 guidelines and should be discussed with a healthcare professional.</em></p>
    `;
  }

  function populateSummary() {
    const summaryElement = document.getElementById('summary');
    
    // Personal details
    const personalDetails = `
      <div class="form-summary-item">
        <dt>Name:</dt>
        <dd>${formData.firstName || ''} ${formData.lastName || ''}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Date of Birth:</dt>
        <dd>${formData.dateOfBirth || 'Not provided'}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Contact:</dt>
        <dd>${formData.email || ''} ${formData.phone ? `| ${formData.phone}` : ''}</dd>
      </div>
    `;
    
    // Medical history
    const medicalHistory = `
      <div class="form-summary-item">
        <dt>Previous PSA Test:</dt>
        <dd>${formData.previousPSA === 'yes' ? 'Yes' : 'No'}${formData.lastPSAResult ? ` (${formData.lastPSAResult} ng/mL on ${formData.lastPSADate})` : ''}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Previous Biopsy:</dt>
        <dd>${formData.previousBiopsy === 'yes' ? 'Yes' : 'No'}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Previous MRI:</dt>
        <dd>${formData.previousMRI === 'yes' ? 'Yes' : 'No'}</dd>
      </div>
    `;
    
    // Risk factors
    const riskFactors = `
      <div class="form-summary-item">
        <dt>Family History:</dt>
        <dd>${formData.familyHistory && formData.familyHistory.length > 0 ? formData.familyHistory.join(', ') : 'None reported'}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Symptoms:</dt>
        <dd>${formData.symptoms && formData.symptoms.length > 0 && !formData.symptoms.includes('none') ? formData.symptoms.join(', ') : 'None reported'}</dd>
      </div>
      <div class="form-summary-item">
        <dt>Ethnicity:</dt>
        <dd>${formData.ethnicity || 'Not provided'}</dd>
      </div>
    `;
    
    summaryElement.innerHTML = `
      <h4>Your Information Summary</h4>
      <dl>
        ${personalDetails}
        ${medicalHistory}
        ${riskFactors}
      </dl>
    `;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    // Validate consent
    const consentCheckbox = document.getElementById('dataConsent');
    if (!consentCheckbox.checked) {
      alert('Please consent to the processing of your data to continue.');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating PDF...';
    
    try {
      // Save final step data
      saveStepData(currentStep);
      
      // Add metadata
      formData.submissionDate = new Date().toISOString();
      formData.riskLevel = document.getElementById('riskLevel').textContent;
      
      // Generate PDF on client side
      await generateClientPDF(formData);
      
      // Show success message
      form.style.display = 'none';
      successMessage.style.display = 'block';
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again or contact us for assistance.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Generate PDF';
    }
  }

  async function generateClientPDF(data) {
    // Dynamic import of jsPDF
    const { jsPDF } = await import('jspdf');
    
    // Create a new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Define dimensions and margins
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin;
    
    // Define colors
    const navyColor = [30, 58, 95];
    const grayColor = [80, 80, 80];
    const lightGrayColor = [217, 217, 217];
    
    // Helper function to add text
    function addText(text, fontSize = 12, color = grayColor, fontStyle = 'normal') {
      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);
      if (fontStyle === 'bold') {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      // Text wrapping
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      for (const line of lines) {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        pdf.text(line, margin, currentY);
        currentY += fontSize * 0.35;
      }
    }
    
    // Helper function to add detail rows
    function addDetailRow(label, value) {
      addText(label, 11, grayColor, 'bold');
      addText(value || 'N/A', 11, grayColor);
      currentY += 2;
    }
    
    // Header
    addText("Prostate Cancer Screening Request", 24, navyColor, 'bold');
    currentY += 5;
    addText(`Date: ${new Date().toLocaleDateString('en-GB')}`, 12, grayColor);
    currentY += 15;
    
    // Personal Details Section
    addText("Personal Details", 14, navyColor, 'bold');
    currentY += 5;
    addDetailRow("Name:", `${data.firstName || ''} ${data.lastName || ''}`);
    addDetailRow("Date of Birth:", data.dateOfBirth || 'Not provided');
    addDetailRow("Email:", data.email || 'Not provided');
    addDetailRow("Phone:", data.phone || 'Not provided');
    addDetailRow("NHS Number:", data.nhsNumber || 'Not provided');
    currentY += 10;
    
    // Medical History Section
    addText("Medical History", 14, navyColor, 'bold');
    currentY += 5;
    addDetailRow("Previous PSA Test:", data.previousPSA === 'yes' ? 'Yes' : 'No');
    
    if (data.previousPSA === 'yes') {
      addDetailRow("Last PSA Test Date:", data.lastPSADate || 'Unknown');
      addDetailRow("Last PSA Result (ng/mL):", data.lastPSAResult || 'Unknown');
    }
    
    addDetailRow("Previous Prostate Biopsy:", data.previousBiopsy === 'yes' ? 'Yes' : 'No');
    addDetailRow("Previous Prostate MRI:", data.previousMRI === 'yes' ? 'Yes' : 'No');
    currentY += 10;
    
    // Risk Assessment Result
    addText("Risk Assessment Result", 14, navyColor, 'bold');
    currentY += 5;
    addDetailRow("Risk Level:", data.riskLevel || 'Not calculated');
    
    // Save the PDF
    const fileName = `prost-health-screening-request-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }
});
