import { Font, StyleSheet } from '@react-pdf/renderer';

// --- 1. FONT REGISTRATION ---
// Get the base URL for font files (works in both browser and Node.js)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const baseUrl = getBaseUrl();

// Register fonts with absolute URLs for browser compatibility
Font.register({
  family: 'Inter',
  fonts: [
    { src: `${baseUrl}/fonts/Inter-Regular.ttf`, fontWeight: 400 },
    { src: `${baseUrl}/fonts/Inter-Italic.ttf`, fontWeight: 400, fontStyle: 'italic' },
    { src: `${baseUrl}/fonts/Inter-Medium.ttf`, fontWeight: 500 },
    { src: `${baseUrl}/fonts/Inter-Bold.ttf`, fontWeight: 700 },
    { src: `${baseUrl}/fonts/Inter-ExtraBold.ttf`, fontWeight: 800 },
  ],
});

// Disable font hyphenation callbacks which can cause issues in the browser
Font.registerHyphenationCallback(word => [word]);

// --- 2. BRAND PALETTE (Navy & Gold) ---
export const colors = {
  brandDark: '#0F172A',     // Deep Navy (Slate 900) - Authority
  brandAccent: '#D97706',   // Rich Gold/Amber - Premium feel
  brandLight: '#F8FAFC',    // Very light grey/blue for sidebars

  textMain: '#1E293B',      // Slate 800
  textMuted: '#64748B',     // Slate 500
  textLight: '#94A3B8',     // Slate 400

  border: '#E2E8F0',        // Light divider lines

  // Risk Status Colors
  riskLow: '#10B981',       // Emerald
  riskMedium: '#F59E0B',    // Amber
  riskHigh: '#EF4444',      // Red

  bgRiskLow: '#ECFDF5',
  bgRiskMedium: '#FFFBEB',
  bgRiskHigh: '#FEF2F2',
};

// --- 3. STYLESHEET ---
export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column', // Top-down layout for Header -> Body -> Footer
  },

  // === HEADER SECTION ===
  header: {
    backgroundColor: colors.brandDark,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logoSection: { flexDirection: 'column' },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 800, // Extra Bold
    letterSpacing: -1,
    lineHeight: 1,
  },
  tagline: {
    color: colors.brandAccent,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  // The "Stamp" looking box on the right of the header
  referralBadge: {
    borderLeftWidth: 1,
    borderLeftColor: '#334155', // Subtle divider on dark bg
    paddingLeft: 15,
  },
  badgeTitle: {
    color: colors.brandAccent,
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  badgeValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Courier', // Monospace for technical codes
    opacity: 0.8,
  },

  // === ASYMMETRIC BODY LAYOUT ===
  bodyContainer: {
    flexDirection: 'row', // Side-by-side layout
    flex: 1,
  },

  // Left Sidebar (32% width)
  sidebar: {
    width: '32%',
    backgroundColor: colors.brandLight,
    padding: 25,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },

  // Main Content (68% width)
  mainContent: {
    width: '68%',
    padding: 30,
  },

  // === TYPOGRAPHY HELPERS ===
  // Section headers (e.g., "CLINICAL HISTORY", "MRI SAFETY CHECKLIST")
  sectionHeader: {
    fontSize: 9,
    color: colors.brandDark,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  // Field labels (e.g., "PSA LEVEL", "ETHNICITY")
  label: {
    fontSize: 6,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  // Large data values (patient name only)
  dataLarge: {
    fontSize: 14,
    color: colors.brandDark,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 2,
  },
  // Medium data values (most content)
  dataMedium: {
    fontSize: 9,
    color: colors.textMain,
    fontWeight: 500,
  },
  // Small data values (secondary info)
  dataSmall: {
    fontSize: 8,
    color: colors.textMain,
    fontWeight: 400,
  },

  // === UI CARDS ===
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
  },

  // === CHECKLIST ITEMS ===
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkLabel: { fontSize: 9, color: colors.textMain, fontWeight: 500 },

  // Custom Circle Checkbox
  circleBox: {
    width: 14,
    height: 14,
    borderRadius: 7, // Make it circular
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleChecked: {
    backgroundColor: colors.brandDark,
    borderColor: colors.brandDark,
  },
  circleAlert: {
    backgroundColor: colors.riskHigh, // Red for danger items
    borderColor: colors.riskHigh,
  },

  // === FOOTER ===
  footer: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: colors.textMuted },
});

// Helper function to get risk colors
export const getRiskColors = (level) => {
  const normalizedLevel = level?.toLowerCase() || 'standard';

  if (normalizedLevel.includes('high')) {
    return {
      bg: colors.bgRiskHigh,
      text: colors.riskHigh,
    };
  } else if (normalizedLevel.includes('medium')) {
    return {
      bg: colors.bgRiskMedium,
      text: colors.riskMedium,
    };
  } else {
    return {
      bg: colors.bgRiskLow,
      text: colors.riskLow,
    };
  }
};

// Helper function to format date
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';

  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

// Helper function to format yes/no
export const formatYesNo = (value) => {
  return value === 'yes' ? 'Yes' : 'No';
};

// Helper function to format list items (title case)
export const formatList = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return 'None';

  return arr
    .filter(item => item && item !== 'none')
    .map(item => {
      return item
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    })
    .join(', ') || 'None';
};

// Helper function to format single string to title case
export const formatString = (str) => {
  if (!str) return '—';

  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};
