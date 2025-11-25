import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, formatYesNo } from '../theme.js';

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

export const SafetyCheck = ({ data }) => {
  // Check if there are any safety concerns
  const hasSafetyConcerns =
    data.pacemaker === 'yes' ||
    data.metalImplants === 'yes' ||
    data.claustrophobia === 'yes' ||
    data.kidneyProblems === 'yes';

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>MRI Safety Screening</Text>

      <Text style={styles.helperText}>
        The following safety questions are required for MRI eligibility assessment.
      </Text>

      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Cardiac Pacemaker or ICD</Text>
          <View style={styles.rowValue}>
            <YesNoField value={data.pacemaker} />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Metal Implants or Fragments</Text>
          <View style={styles.rowValue}>
            <YesNoField value={data.metalImplants} />
          </View>
        </View>

        {data.metalImplants === 'yes' && data.metalImplantsDetails && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Implant Details</Text>
            <Text style={styles.rowValue}>{data.metalImplantsDetails}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Claustrophobia</Text>
          <View style={styles.rowValue}>
            <YesNoField value={data.claustrophobia} />
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Kidney Problems</Text>
          <View style={styles.rowValue}>
            <YesNoField value={data.kidneyProblems} />
          </View>
        </View>
      </View>

      {/* Safety Warning Box */}
      {hasSafetyConcerns && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠ MRI Safety Review Required</Text>
          <Text style={styles.warningText}>
            One or more safety concerns have been identified. This patient will require
            additional screening and approval from the MRI safety officer before proceeding
            with the examination.
          </Text>
        </View>
      )}
    </View>
  );
};
