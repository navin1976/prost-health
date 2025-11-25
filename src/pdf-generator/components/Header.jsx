import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme.js';

export const Header = () => (
  <View>
    {/* Main header with logo and contact */}
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>Prost Health</Text>
        <Text style={styles.tagline}>MRI-First Prostate Screening</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>hello@prost.health</Text>
        <Text style={styles.contactText}>www.prost.health</Text>
      </View>
    </View>

    {/* Header line separator */}
    <View style={styles.headerLine} />

    {/* Document title */}
    <View style={styles.documentTitle}>
      <Text style={styles.titleMain}>Screening Request Form</Text>
      <Text style={styles.titleSub}>Patient Assessment Summary - NICE NG131 Guidelines</Text>
    </View>
  </View>
);
