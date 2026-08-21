/**
 * Virtual Mandi — Premium B2B Agricultural Design System
 * 
 * Aesthetic Direction:
 * - Deep earthy forest greens (#1B4332, #2D6A4F, #081C15)
 * - Warm neutral & off-white backgrounds (#F8F9F5, #FAF8F5, #FFFFFF)
 * - Rich charcoal typography (#1A2420, #2C3330)
 * - Muted organic accents (#52B788, #74C69D)
 * - Harvest Amber / Terracotta accents for trust badges and quotes (#D4A373, #E76F51)
 */

export const Colors = {
  // Brand Forest Greens
  primaryDark: '#081C15',
  primary: '#1B4332',
  primaryMedium: '#2D6A4F',
  primaryLight: '#40916C',
  primaryAccent: '#52B788',
  primarySubtle: '#D8F3DC',
  primaryWash: '#EBF8F0',

  // Harvest & Amber Accents
  amber: '#D4A373',
  amberLight: '#FAEDCD',
  amberDark: '#B07D46',
  terracotta: '#E76F51',
  terracottaLight: '#FDECE8',

  // Neutrals & Surfaces
  background: '#F8F9F5',
  surface: '#FFFFFF',
  surfaceSubtle: '#F2F4EE',
  surfaceElevated: '#FFFFFF',
  border: '#E3E8E0',
  borderLight: '#EDF1EB',
  borderFocus: '#2D6A4F',

  // Typography
  textPrimary: '#15201B',
  textSecondary: '#52625A',
  textMuted: '#84968D',
  textLight: '#FFFFFF',
  textInverseMuted: '#A3B8AF',

  // Statuses & Badges
  success: '#2D6A4F',
  successBg: '#EAF5EE',
  warning: '#C77700',
  warningBg: '#FEF5E7',
  danger: '#BA2D2D',
  dangerBg: '#FDF0F0',
  info: '#1E6091',
  infoBg: '#EBF4FB',

  // B2B Badges
  verifiedBadge: '#1B4332',
  verifiedBadgeBg: '#D8F3DC',
  ondcBadge: '#1E6091',
  ondcBadgeBg: '#EBF4FB',
  gradePremium: '#7B2CBF',
  gradePremiumBg: '#F3E8FF',
  gradeA: '#1B4332',
  gradeABg: '#E8F5E9',
  gradeB: '#B07D46',
  gradeBBg: '#FEF5E7',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 9999,
};

export const Typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
};

export const Shadows = {
  subtle: {
    shadowColor: '#15201B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#15201B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#15201B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  popover: {
    shadowColor: '#081C15',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
};
