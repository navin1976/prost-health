import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme.js';

export const Footer = ({ generatedDate, referenceId }) => (
  <View style={styles.footer} fixed>
    <View>
      <Text style={styles.footerText}>
        Generated: {generatedDate}
      </Text>
      <Text style={styles.footerText}>
        Reference: {referenceId}
      </Text>
    </View>
    <View style={styles.footerRight}>
      <Text style={styles.footerText}>
        Prost Health Ltd
      </Text>
      <Text style={styles.footerText}>
        This document is confidential
      </Text>
    </View>
  </View>
);
