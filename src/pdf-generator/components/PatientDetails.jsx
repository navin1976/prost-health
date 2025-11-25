import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, formatDate } from '../theme.js';

export const PatientDetails = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Patient Information</Text>

    <View style={styles.grid}>
      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>Full Name</Text>
        <Text style={styles.gridValue}>
          {data.firstName} {data.lastName}
        </Text>
      </View>

      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>Date of Birth</Text>
        <Text style={styles.gridValue}>{formatDate(data.dateOfBirth)}</Text>
      </View>

      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>Email Address</Text>
        <Text style={styles.gridValue}>{data.email || 'Not provided'}</Text>
      </View>

      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>Phone Number</Text>
        <Text style={styles.gridValue}>{data.phone || 'Not provided'}</Text>
      </View>

      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>NHS Number</Text>
        <Text style={styles.gridValue}>{data.nhsNumber || 'Not provided'}</Text>
      </View>

      <View style={styles.gridItem}>
        <Text style={styles.gridLabel}>GP Practice</Text>
        <Text style={styles.gridValue}>{data.gpPractice || 'Not provided'}</Text>
      </View>
    </View>
  </View>
);
