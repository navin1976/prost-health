// Browser-compatible screening form module

// Multi-step form handling and risk assessment
(function () {
  const init = () => {
    const form = document.getElementById('multiStepForm');
    if (!form) return; // Guard against running on pages without the form

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 1;
    const totalSteps = 3; // Changed from 5 to 3
    let formData = {};

    // Initialize form
    initializeForm();

    function initializeForm() {
      // Initialize form visibility
      const steps = document.querySelectorAll('.form-step');
      steps.forEach((step, index) => {
        if (index === 0) {
          step.classList.add('active');
          step.style.display = 'block';
        } else {
          step.classList.remove('active');
          step.style.display = 'none';
        }
      });

      // Add event listeners to radio buttons for conditional sections
      const previousPSARadios = document.querySelectorAll('input[name="previousPSA"]');
      previousPSARadios.forEach((radio) => {
        radio.addEventListener('change', function () {
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
      inputs.forEach((input) => {
        input.addEventListener('blur', function () {
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

      symptomCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
          if (this.value === 'none' && this.checked) {
            symptomCheckboxes.forEach((cb) => {
              if (cb.value !== 'none') {
                cb.checked = false;
                cb.disabled = true;
              }
            });
          } else if (this.checked && noneCheckbox.checked) {
            noneCheckbox.checked = false;
          } else if (this.value !== 'none' && !this.checked) {
            symptomCheckboxes.forEach((cb) => {
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

      // Skip validation if field is disabled
      if (field.disabled) return true;

      if (field.hasAttribute('required') && !field.value.trim()) {
        // Special check for checkbox groups (like consent)
        if (field.type === 'checkbox' && !field.checked) {
          showError(field.parentElement, 'This field is required');
          isValid = false;
        } else if (field.type !== 'checkbox') {
          showError(field, 'This field is required');
          isValid = false;
        }
      } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          showError(field, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearError(field);
        }
      } else if (field.type === 'tel' && field.value) {
        // Basic phone validation
        if (field.value.length < 10) {
          showError(field, 'Please enter a valid phone number');
          isValid = false;
        } else {
          clearError(field);
        }
      } else if (field.type === 'date' && field.value) {
        if (field.id === 'dateOfBirth') {
          const dob = new Date(field.value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          if (age < 18 || age > 120) {
            showError(field, 'You must be over 18 to use this service');
            isValid = false;
          } else {
            clearError(field);
          }
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

      requiredFields.forEach((field) => {
        // Check if it's the consent checkbox
        if (field.id === 'dataConsent') {
          if (!field.checked) {
            alert('You must consent to data processing to proceed.');
            isValid = false;
          }
        } else {
          if (!validateField(field)) {
            isValid = false;
          }
        }
      });

      // Step 1 Validation (Assessment)
      if (step === 1) {
        const previousPSA = document.querySelector('input[name="previousPSA"]:checked');
        const previousBiopsy = document.querySelector('input[name="previousBiopsy"]:checked');
        const previousMRI = document.querySelector('input[name="previousMRI"]:checked');

        if (!previousPSA) {
          isValid = false;
          showError(document.querySelector('input[name="previousPSA"]'), 'Please select an option');
        }
        if (!previousBiopsy) {
          isValid = false;
          showError(
            document.querySelector('input[name="previousBiopsy"]'),
            'Please select an option'
          );
        }
        if (!previousMRI) {
          isValid = false;
          showError(document.querySelector('input[name="previousMRI"]'), 'Please select an option');
        }
      }

      // Step 2 Validation (Safety) - was step 4
      if (step === 2) {
        const safetyFields = [
          'safetyPacemaker',
          'safetyClips',
          'safetyImplants',
          'safetyMetal',
          'safetyKidney',
          'safetyClaustrophobia',
        ];

        safetyFields.forEach((name) => {
          if (!document.querySelector(`input[name="${name}"]:checked`)) {
            // Find the first radio button of the group to attach error to
            const firstRadio = document.querySelector(`input[name="${name}"]`);
            // Find closest form-group to show error
            const group = firstRadio.closest('.form-group');
            // Create or find error message
            let errorMsg = group.querySelector('.form-error');
            if (!errorMsg) {
              errorMsg = document.createElement('span');
              errorMsg.className = 'form-error';
              group.appendChild(errorMsg);
            }
            errorMsg.textContent = 'Please answer this question';
            errorMsg.style.display = 'block';
            errorMsg.style.color = '#d32f2f';
            errorMsg.style.fontSize = '0.875rem';
            errorMsg.style.marginTop = '0.5rem';

            isValid = false;
          } else {
            // Clear error
            const firstRadio = document.querySelector(`input[name="${name}"]`);
            const group = firstRadio.closest('.form-group');
            const errorMsg = group.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'none';
          }
        });
      }

      return isValid;
    }

    function showError(field, message) {
      if (field.classList) field.classList.add('error');

      // Try to find existing error element
      let errorElement = field.nextElementSibling;
      while (errorElement && !errorElement.classList.contains('form-error')) {
        errorElement = errorElement.nextElementSibling;
      }

      // If not found, look for it in parent
      if (!errorElement) {
        const parent = field.closest('.form-group');
        errorElement = parent ? parent.querySelector('.form-error') : null;
      }

      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#d32f2f';
      }
    }

    function clearError(field) {
      if (field.classList) field.classList.remove('error');
      let errorElement = field.nextElementSibling;
      while (errorElement && !errorElement.classList.contains('form-error')) {
        errorElement = errorElement.nextElementSibling;
      }

      if (!errorElement) {
        const parent = field.closest('.form-group');
        errorElement = parent ? parent.querySelector('.form-error') : null;
      }

      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    function updateProgressBar() {
      const progressFill = document.querySelector('.progress-bar-fill');
      const currentStepNum = document.getElementById('currentStepNum');

      if (progressFill) {
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
      }

      if (currentStepNum) {
        currentStepNum.textContent = currentStep;
      }
    }

    function showStep(step) {
      // Hide all steps
      document.querySelectorAll('.form-step').forEach((el) => {
        el.classList.remove('active');
        el.style.display = 'none';
      });

      // Show new step
      const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
      nextStepEl.classList.add('active');
      nextStepEl.style.display = 'block';

      // Scroll to top of form with offset for fixed header
      const formContainer = document.querySelector('.screening-form-container');
      if (formContainer) {
        const headerOffset = 140; // Height of header + breathing room
        const elementPosition = formContainer.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }

      // Update navigation buttons

      prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
      nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
      submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';

      updateProgressBar();

      // If this is the review step (Step 3), populate the summary
      if (step === 3) {
        populateSummary();
        calculateRisk();
      }
    }

    function nextStep() {
      if (!validateStep(currentStep)) {
        // Find first invalid field and focus it
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const firstInvalid =
          currentStepElement.querySelector('.error') ||
          currentStepElement.querySelector('.form-error');
        if (firstInvalid) {
          // Try to scroll to it
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      inputs.forEach((input) => {
        if (input.type === 'radio') {
          if (input.checked) {
            formData[input.name] = input.value;
          }
        } else if (input.type === 'checkbox') {
          if (!formData[input.name]) {
            formData[input.name] = [];
          }
          if (input.checked) {
            if (input.name === 'consent') {
              // Handle single checkbox value
              formData[input.name] = true;
            } else if (!formData[input.name].includes(input.value)) {
              formData[input.name].push(input.value);
            }
          } else if (input.name === 'consent') {
            formData[input.name] = false;
          }

          if (input.name !== 'consent') {
            // Fix for checkbox array: get all checked checkboxes for this name
            const checkedBoxes = document.querySelectorAll(`input[name="${input.name}"]:checked`);
            formData[input.name] = Array.from(checkedBoxes).map((cb) => cb.value);
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
        riskFactors.push(`Age ${age}+`);
      } else if (age >= 45) {
        riskScore += 1;
        riskFactors.push(`Age ${age}+`);
      }

      // Family history risk factor
      if (formData.familyHistory && formData.familyHistory.length > 0) {
        riskScore += formData.familyHistory.includes('father') ? 3 : 2;
        riskFactors.push('Family History');
      }

      // Ethnicity risk factor
      if (
        formData.ethnicity &&
        (formData.ethnicity === 'black-african' || formData.ethnicity === 'black-caribbean')
      ) {
        riskScore += 2;
        riskFactors.push('Ethnicity Risk');
      }

      // PSA history
      if (formData.previousPSA === 'yes' && formData.lastPSAResult) {
        const psa = parseFloat(formData.lastPSAResult);
        if (psa > 3.0) {
          riskScore += 2;
          riskFactors.push(`Elevated PSA (${psa})`);
        }
      }

      // Symptoms
      if (
        formData.symptoms &&
        !formData.symptoms.includes('none') &&
        formData.symptoms.length > 0
      ) {
        riskScore += 1;
        riskFactors.push('Symptoms Present');
      }

      // Determine risk level
      let riskLevel, riskExplanation;

      if (riskScore >= 5) {
        riskLevel = 'high';
        riskExplanation = `Your profile suggests higher risk factors. Advanced MRI screening is strongly recommended to rule out significant disease.`;
      } else if (riskScore >= 3) {
        riskLevel = 'medium';
        riskExplanation = `You have some risk factors. MRI screening can provide definitive clarity and peace of mind.`;
      } else {
        riskLevel = 'low';
        riskExplanation = `Your risk appears low, but a baseline MRI can confirm a healthy prostate and serve as a valuable reference for the future.`;
      }

      // Update risk assessment display
      const riskLevelElement = document.getElementById('riskLevel');
      const riskExplanationElement = document.getElementById('riskExplanation');

      if (riskLevelElement) {
        riskLevelElement.className = `risk-value ${riskLevel}`; // e.g. high (red), low (green) defined in CSS? Or handle colors inline?
        // CSS handles .risk-value.high etc.
        riskLevelElement.textContent =
          riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1) + ' Risk';
      }

      if (riskExplanationElement) {
        riskExplanationElement.textContent = riskExplanation;
      }
    }

    function populateSummary() {
      const summaryElement = document.getElementById('summary');

      // Helper to format lists
      const formatList = (arr) => (arr && arr.length > 0 ? arr.join(', ') : 'None');
      const formatYesNo = (val) => (val === 'yes' ? 'Yes' : 'No');

      // Personal details
      const personalDetails = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.75rem; color: #666;">Personal Details</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div><strong>Name:</strong> ${formData.firstName || ''} ${formData.lastName || ''}</div>
            <div><strong>DOB:</strong> ${formData.dateOfBirth || 'Not provided'}</div>
            <div><strong>Email:</strong> ${formData.email || ''}</div>
        </div>
      </div>
    `;

      // Medical history
      const medicalHistory = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.75rem; color: #666;">Medical History</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div><strong>PSA Test:</strong> ${formatYesNo(formData.previousPSA)}</div>
            <div><strong>Biopsy:</strong> ${formatYesNo(formData.previousBiopsy)}</div>
            <div><strong>MRI:</strong> ${formatYesNo(formData.previousMRI)}</div>
        </div>
      </div>
    `;

      // Risk factors
      const riskFactors = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.75rem; color: #666;">Risk Factors</h5>
        <div><strong>Family History:</strong> ${formatList(formData.familyHistory)}</div>
        <div><strong>Symptoms:</strong> ${formatList(formData.symptoms)}</div>
        <div><strong>Ethnicity:</strong> ${formData.ethnicity || 'Not provided'}</div>
      </div>
    `;

      // Safety
      const safetyInfo = `
      <div style="margin-bottom: 1.5rem;">
        <h5 style="margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.75rem; color: #666;">MRI Safety</h5>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
            <div><strong>Pacemaker:</strong> ${formatYesNo(formData.safetyPacemaker)}</div>
            <div><strong>Clips:</strong> ${formatYesNo(formData.safetyClips)}</div>
            <div><strong>Implants:</strong> ${formatYesNo(formData.safetyImplants)}</div>
            <div><strong>Metal in Eyes:</strong> ${formatYesNo(formData.safetyMetal)}</div>
            <div><strong>Kidney:</strong> ${formatYesNo(formData.safetyKidney)}</div>
            <div><strong>Claustrophobia:</strong> ${formatYesNo(formData.safetyClaustrophobia)}</div>
        </div>
      </div>
    `;

      summaryElement.innerHTML = `
      ${personalDetails}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 1rem 0;">
      ${medicalHistory}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 1rem 0;">
      ${riskFactors}
      <hr style="border: 0; border-top: 1px solid #eee; margin: 1rem 0;">
      ${safetyInfo}
    `;
    }

    async function handleSubmit(event) {
      event.preventDefault();

      // Double check consent just in case (though Step 1 validation should cover it if we go back/forth)
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

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(
          'There was an error generating your PDF. Please try again or contact us for assistance.'
        );
        submitBtn.disabled = false;
        submitBtn.textContent = 'Generate PDF Report';
      }
    }

    async function generateClientPDF(data) {
      try {
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const fileName = `prost-health-screening-request-${new Date().toISOString().split('T')[0]}.pdf`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error generating PDF:', error);
        throw error; // Re-throw to be caught by the caller
      }
    }
  };

  // Run init if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
