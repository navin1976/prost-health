import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, colors, getRiskColors, formatYesNo, formatList, formatString } from '../theme.js';

const Checkbox = ({ checked, label }) => (
  <View style={styles.yesNoContainer}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkMark}>✓</Text>}
    </View>
    <Text style={styles.yesNoText}>{label}</Text>
  </View>
);

const YesNoField = ({ value }) => (
  <View style={styles.yesNoContainer}>
    <Checkbox checked={value === 'yes'} label="Yes" />
    <Checkbox checked={value === 'no'} label="No" />
  </View>
);

export const RiskAssessment = ({ data, riskLevel }) => {
  const riskColors = getRiskColors(riskLevel);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(data.dateOfBirth);

  return (
    <View>
      {/* Risk Level Summary Box */}
      <View style={[styles.riskBox, { backgroundColor: riskColors.bg }]}>
        <View style={styles.riskHeader}>
          <View>
            <Text style={styles.riskLabel}>Clinical Risk Assessment</Text>
            <Text style={styles.riskDescription}>
              Based on NICE NG131 Guidelines for prostate cancer screening eligibility
            </Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: riskColors.bg }]}>
            <Text style={[styles.riskBadgeText, { color: riskColors.text }]}>
              {riskLevel || 'STANDARD'}
            </Text>
          </View>
        </View>
      </View>

      {/* Risk Factors Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Factor Assessment</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Age at Assessment</Text>
            <Text style={styles.rowValue}>{age} years</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Ethnicity</Text>
            <Text style={styles.rowValue}>{formatString(data.ethnicity)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Family History of Prostate Cancer</Text>
            <View style={styles.rowValue}>
              <YesNoField value={data.familyHistory} />
            </View>
          </View>

          {data.familyHistory === 'yes' && data.familyRelations && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Affected Relatives</Text>
              <Text style={styles.rowValue}>{formatList(data.familyRelations)}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>BRCA1/BRCA2 Mutation</Text>
            <View style={styles.rowValue}>
              <YesNoField value={data.brcaMutation} />
            </View>
          </View>
        </View>
      </View>

      {/* Symptoms Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Symptoms</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Urinary Symptoms</Text>
            <Text style={styles.rowValue}>
              {data.urinarySymptoms && data.urinarySymptoms.length > 0 && !data.urinarySymptoms.includes('none')
                ? formatList(data.urinarySymptoms)
                : 'None reported'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Other Symptoms</Text>
            <Text style={styles.rowValue}>
              {data.otherSymptoms && data.otherSymptoms.length > 0 && !data.otherSymptoms.includes('none')
                ? formatList(data.otherSymptoms)
                : 'None reported'}
            </Text>
          </View>
        </View>
      </View>

      {/* Medical History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relevant Medical History</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Previous PSA Test</Text>
            <View style={styles.rowValue}>
              <YesNoField value={data.previousPsa} />
            </View>
          </View>

          {data.previousPsa === 'yes' && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Last PSA Result</Text>
              <Text style={styles.rowValue}>
                {data.psaValue ? `${data.psaValue} ng/mL` : 'Not provided'}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Previous Prostate Biopsy</Text>
            <View style={styles.rowValue}>
              <YesNoField value={data.previousBiopsy} />
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Current Medications</Text>
            <Text style={styles.rowValue}>
              {data.medications || 'None reported'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
