import React from 'react';
import { Document, Page, View, Text, Svg, Path, Rect } from '@react-pdf/renderer';
import { styles, colors, formatDate, formatList, formatString } from './theme.js';

// Section header component for consistent styling
const SectionHeader = ({ children }) => (
  <Text style={styles.sectionHeader}>{children}</Text>
);

// --- 1. SVG LOGO COMPONENT ---
// Prost Health logomark (apple/prostate icon) in white on amber rounded square
const BrandLogo = () => (
  <Svg width="44" height="44" viewBox="0 0 44 44" style={{ marginBottom: 10 }}>
    {/* Rounded square background - using ry for vertical radius as well */}
    <Rect x="0" y="0" width="44" height="44" rx="8" ry="8" fill={colors.brandAccent} />
    {/* Elegant flowing leaf - scaled down and centered */}
    <Path
      d="M24 12 C25.5 10.5, 28.5 12, 27 15"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Rounder apple/prostate shape - scaled down for better fit */}
    <Path
      d="M22 15 C17 15, 13 18, 13 23 C13 28, 16 33, 22 35 C28 33, 31 28, 31 23 C31 18, 27 15, 22 15 Z"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Subtle highlight curve - scaled down */}
    <Path
      d="M16 21 C16 19.5, 17.5 18, 19 18"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </Svg>
);

// --- 2. HELPER FUNCTIONS ---

// Calculate age from date of birth
const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Calculate risk level based on form data
const calculateRiskLevel = (data) => {
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
  if (data.familyHistory && data.familyHistory.length > 0) {
    riskScore += 2;
    if (data.familyHistory.length > 1) riskScore += 1;
  }

  // Symptoms
  const hasSymptoms = data.symptoms && data.symptoms.length > 0 && !data.symptoms.includes('none');
  if (hasSymptoms) {
    if (data.symptoms.includes('blood') || data.symptoms.includes('pain')) {
      riskScore += 2;
    } else {
      riskScore += 1;
    }
  }

  // PSA
  if (data.previousPSA === 'yes' && data.lastPSAResult) {
    const psa = parseFloat(data.lastPSAResult);
    if (psa >= 4) riskScore += 2;
    if (psa >= 10) riskScore += 2;
  }

  if (riskScore >= 6) return 'HIGH';
  if (riskScore >= 3) return 'MEDIUM';
  return 'LOW';
};

// Generate reference ID
const generateReferenceId = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PH-${dateStr}-${random}`;
};

// --- 3. HELPER COMPONENTS ---

// Sidebar Data Block - with size variants
const SidebarItem = ({ label, value, subValue, size = 'large' }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={size === 'large' ? styles.dataLarge : styles.dataMedium}>{value}</Text>
    {subValue && <Text style={{ fontSize: 8, color: colors.textMuted, marginTop: 2 }}>{subValue}</Text>}
  </View>
);

// High-Vis Risk Card - refined spacing
const RiskCard = ({ level }) => {
  const isLow = level === 'LOW';
  const isMedium = level === 'MEDIUM';
  const color = isLow ? colors.riskLow : isMedium ? colors.riskMedium : colors.riskHigh;
  const bg = isLow ? colors.bgRiskLow : isMedium ? colors.bgRiskMedium : colors.bgRiskHigh;

  return (
    <View style={{ backgroundColor: bg, borderRadius: 6, borderWidth: 1, borderColor: color, padding: 14, marginBottom: 16 }}>
      <Text style={{ fontSize: 6, color: color, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>Risk Profile</Text>
      <Text style={{ fontSize: 20, fontWeight: 800, color: color, marginBottom: 4 }}>{level}</Text>
      <Text style={{ fontSize: 7, color: color, opacity: 0.85 }}>
        NICE NG131 Protocol
      </Text>
    </View>
  );
};

// Checklist Item with Circle Logic - refined for subtle visual hierarchy
const CheckItem = ({ label, value }) => {
  const isYes = value === 'yes';
  // Logic: Highlighting specific risks (Pacemaker/Claustrophobia) in Red if 'Yes'
  const isAlert = isYes && (label.includes('Pacemaker') || label.includes('Claustrophobia'));

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#E2E8F0',
    }}>
      <Text style={{ fontSize: 8, color: colors.textMain, fontWeight: 400 }}>{label}</Text>
      <View style={[
        {
          width: 12,
          height: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#CBD5E1',
          alignItems: 'center',
          justifyContent: 'center',
        },
        isYes && !isAlert && { backgroundColor: colors.brandDark, borderColor: colors.brandDark },
        isAlert && { backgroundColor: colors.riskHigh, borderColor: colors.riskHigh }
      ]}>
        {isYes && <Text style={{ color: 'white', fontSize: 7, fontWeight: 'bold' }}>{isAlert ? '!' : '✓'}</Text>}
      </View>
    </View>
  );
};

// --- 4. MAIN DOCUMENT COMPONENT ---
export const ScreeningRequestPDF = ({ formData = {} }) => {
  const data = formData;

  // Calculate values
  const age = calculateAge(data.dateOfBirth);
  const riskLevel = calculateRiskLevel(data);
  const refId = generateReferenceId();
  const generatedDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Check for safety concerns
  const hasSafetyConcerns =
    data.safetyPacemaker === 'yes' ||
    data.safetyClips === 'yes' ||
    data.safetyImplants === 'yes' ||
    data.safetyMetal === 'yes' ||
    data.safetyKidney === 'yes' ||
    data.safetyClaustrophobia === 'yes';

  // Format symptoms display
  const symptomsDisplay = data.symptoms && data.symptoms.length > 0 && !data.symptoms.includes('none')
    ? formatList(data.symptoms)
    : 'None';

  // Format family history display
  const familyHistoryDisplay = data.familyHistory && data.familyHistory.length > 0
    ? formatList(data.familyHistory)
    : 'No family history reported';

  return (
    <Document title="Prost Health - Imaging Referral" author="Prost Health">
      <Page size="A4" style={styles.page}>

        {/* === HEADER (Dark Navy Background with Gold Border) === */}
        <View style={{ backgroundColor: colors.brandDark }}>
          <View style={{ padding: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Left: Logo and Brand */}
            <View style={{ flexDirection: 'column' }}>
              <BrandLogo />
              <Text style={styles.logoText}>Prost Health</Text>
              <Text style={{ color: colors.brandAccent, fontSize: 7, fontWeight: 700, letterSpacing: 3, marginTop: 8, textTransform: 'uppercase' }}>
                MRI-First Prostate Screening
              </Text>
            </View>
            {/* Right: Reference Info with vertical divider */}
            <View style={{ borderLeftWidth: 1, borderLeftColor: '#334155', paddingLeft: 20, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 6, color: colors.textLight, letterSpacing: 1.5, marginBottom: 2 }}>REFERRAL REFERENCE</Text>
              <Text style={{ fontSize: 11, color: '#FFFFFF', fontFamily: 'Courier', marginBottom: 10 }}>{refId}</Text>
              <Text style={{ fontSize: 6, color: colors.textLight, letterSpacing: 1.5, marginBottom: 2 }}>DATE ISSUED</Text>
              <Text style={{ fontSize: 11, color: '#FFFFFF', fontFamily: 'Courier' }}>{generatedDate.toUpperCase()}</Text>
            </View>
          </View>
          {/* Gold accent border at bottom */}
          <View style={{ height: 3, backgroundColor: colors.brandAccent }} />
        </View>

        {/* === BODY (Asymmetric Flex Layout) === */}
        <View style={styles.bodyContainer}>

          {/* LEFT SIDEBAR (32% Width - Patient Demographics) */}
          <View style={styles.sidebar}>
            {/* Patient Name - largest text in sidebar */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>PATIENT NAME</Text>
              <Text style={styles.dataLarge}>{`${data.firstName || 'Patient'} ${data.lastName || 'Name'}`}</Text>
            </View>

            {/* DOB - consistent formatting with other fields */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <Text style={styles.dataMedium}>
                {age ? `${formatDate(data.dateOfBirth)} (${age}y)` : 'Not provided'}
              </Text>
            </View>

            {/* Contact - smaller, won't overflow */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>EMAIL</Text>
              <Text style={styles.dataSmall}>{data.email || 'Not provided'}</Text>
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>PHONE</Text>
              <Text style={styles.dataMedium}>{data.phone || 'Not provided'}</Text>
            </View>

            {/* Address Section */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>ADDRESS</Text>
              <Text style={styles.dataSmall}>
                {data.addressLine1 || 'Not provided'}
              </Text>
              {data.addressLine2 && (
                <Text style={styles.dataSmall}>
                  {data.addressLine2}
                </Text>
              )}
              {(data.city || data.postcode) && (
                <Text style={styles.dataSmall}>
                  {[data.city, data.postcode].filter(Boolean).join(', ')}
                </Text>
              )}
            </View>

            <RiskCard level={riskLevel} />

            {/* Requesting Entity Info - matching Risk Card style */}
            <View style={{ backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: 14 }}>
              <Text style={{ fontSize: 6, color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500, marginBottom: 6 }}>Requesting Entity</Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: colors.textMain, marginBottom: 4 }}>Prost Health Ltd</Text>
              <Text style={{ fontSize: 7, color: colors.textMuted, marginBottom: 1 }}>hello@prost.health</Text>
              <Text style={{ fontSize: 7, color: colors.textMuted }}>www.prost.health</Text>
            </View>
          </View>

          {/* MAIN CONTENT (68% Width - Clinical Data) */}
          <View style={styles.mainContent}>

            {/* Clinical History Section */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 6, marginBottom: 10 }}>
                <Text style={styles.sectionHeader}>Clinical History</Text>
              </View>

              {/* Stats Row - smaller, cleaner */}
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View style={{ width: '33%' }}>
                  <Text style={styles.label}>PSA LEVEL</Text>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: colors.brandDark }}>
                    {data.previousPSA === 'yes' && data.lastPSAResult
                      ? `${data.lastPSAResult} ng/mL`
                      : 'N/A'}
                  </Text>
                  {data.previousPSA === 'yes' && data.lastPSADate && (
                    <Text style={{ fontSize: 7, color: colors.textMuted, marginTop: 1 }}>
                      Taken: {formatDate(data.lastPSADate)}
                    </Text>
                  )}
                </View>
                <View style={{ width: '33%' }}>
                  <Text style={styles.label}>PREV. BIOPSY</Text>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: colors.brandDark }}>
                    {data.previousBiopsy === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={{ width: '33%' }}>
                  <Text style={styles.label}>PREV. MRI</Text>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: colors.brandDark }}>
                    {data.previousMRI === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>

              {/* Two column layout for Ethnicity and Symptoms */}
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View style={{ width: '50%' }}>
                  <Text style={styles.label}>ETHNICITY</Text>
                  <Text style={styles.dataMedium}>
                    {formatString(data.ethnicity)}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={styles.label}>CURRENT SYMPTOMS</Text>
                  <Text style={styles.dataMedium}>
                    {symptomsDisplay}
                  </Text>
                </View>
              </View>

              {/* Family History Card */}
              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: 12 }}>
                <Text style={{ fontSize: 6, color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>Family History</Text>
                <Text style={{ fontSize: 8, color: colors.textMain, lineHeight: 1.4 }}>
                  {familyHistoryDisplay}
                </Text>
              </View>
            </View>

            {/* Safety Checklist */}
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 6, marginBottom: 10 }}>
                <Text style={{ fontSize: 9, color: colors.brandDark, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>MRI Safety Checklist</Text>
                {hasSafetyConcerns && (
                  <Text style={{ fontSize: 7, fontWeight: 700, backgroundColor: colors.bgRiskHigh, color: colors.riskHigh, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 }}>REVIEW REQUIRED</Text>
                )}
                {!hasSafetyConcerns && (
                  <Text style={{ fontSize: 7, fontWeight: 700, backgroundColor: colors.bgRiskLow, color: colors.riskLow, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 }}>CLEARED</Text>
                )}
              </View>

              {/* 2 Column Check Grid using FlexWrap */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <View style={{ width: '48%', marginRight: '4%' }}>
                  <CheckItem label="Cardiac Pacemaker/ICD" value={data.safetyPacemaker} />
                  <CheckItem label="Aneurysm Clips" value={data.safetyClips} />
                  <CheckItem label="Cochlear Implants" value={data.safetyImplants} />
                </View>
                <View style={{ width: '48%' }}>
                  <CheckItem label="Metal Fragments (Eye)" value={data.safetyMetal} />
                  <CheckItem label="Kidney/Renal Issues" value={data.safetyKidney} />
                  <CheckItem label="Claustrophobia" value={data.safetyClaustrophobia} />
                </View>
              </View>
            </View>

            {/* Notes Box - consistent with Family History style */}
            <View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 6, marginBottom: 10 }}>
                <Text style={{ fontSize: 9, color: colors.brandDark, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Clinical Notes</Text>
              </View>
              <View style={{ backgroundColor: '#F8FAFC', borderRadius: 6, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: 12, minHeight: 40 }}>
                <Text style={{ fontSize: 8, color: colors.textMuted, fontStyle: 'italic' }}>
                  {hasSafetyConcerns && data.safetyClaustrophobia === 'yes'
                    ? 'Patient may require Open Bore MRI due to claustrophobia.'
                    : 'Additional clinical notes...'}
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* === FOOTER === */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>PROST HEALTH LTD • Generated securely on user's computer</Text>
          <Text style={styles.footerText}>Page 1 of 1</Text>
        </View>

      </Page>
    </Document>
  );
};

export default ScreeningRequestPDF;
