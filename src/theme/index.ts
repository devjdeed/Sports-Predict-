import { TextStyle } from 'react-native';

/** Semantic palette from UI mockups/DESIGN.md ("Apex Arena"). */
export const colors = {
  bg: '#0A0D14',
  card: 'rgba(18, 23, 34, 0.85)',
  cardSolid: '#121722',
  elevated: '#1A2232',
  overlay: '#232D42',
  inset: '#0E121B',

  yes: '#00F59B',
  yesDeep: '#00D285',
  no: '#FF3366',
  noDeep: '#E01E50',
  cyan: '#00D2FF',
  gold: '#FFD027',

  text: '#FFFFFF',
  textSecondary: '#8E9CAE',
  textMuted: '#505D70',
  onYes: '#0A0D14',

  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
  borderPress: 'rgba(255, 255, 255, 0.2)',
  glowBull: 'rgba(0, 245, 155, 0.35)',
  glowBear: 'rgba(255, 51, 102, 0.35)',
  yesTint: 'rgba(0, 245, 155, 0.12)',
  noTint: 'rgba(255, 51, 102, 0.14)',
  cyanTint: 'rgba(0, 210, 255, 0.12)',
  goldTint: 'rgba(255, 208, 39, 0.12)',
  ghost: 'rgba(255, 255, 255, 0.06)',
  ghostSubtle: 'rgba(255, 255, 255, 0.04)',
  scrim: 'rgba(10, 13, 20, 0.75)',
} as const;

export const fonts = {
  display800: 'BarlowCondensed_800ExtraBold',
  display700: 'BarlowCondensed_700Bold',
  display600: 'BarlowCondensed_600SemiBold',
  body400: 'SpaceGrotesk_400Regular',
  body500: 'SpaceGrotesk_500Medium',
  body700: 'SpaceGrotesk_700Bold',
  mono500: 'JetBrainsMono_500Medium',
  mono600: 'JetBrainsMono_600SemiBold',
  mono700: 'JetBrainsMono_700Bold',
} as const;

export const typography = {
  'headline-xl': { fontFamily: fonts.display800, fontSize: 40, lineHeight: 44, letterSpacing: 0.8 },
  'headline-lg': { fontFamily: fonts.display700, fontSize: 32, lineHeight: 36, letterSpacing: 0.6 },
  'headline-md': { fontFamily: fonts.display700, fontSize: 24, lineHeight: 28, letterSpacing: 0.24 },
  'headline-sm': { fontFamily: fonts.display600, fontSize: 20, lineHeight: 24, letterSpacing: 0.2 },
  'body-lg': { fontFamily: fonts.body500, fontSize: 16, lineHeight: 24 },
  'body-md': { fontFamily: fonts.body400, fontSize: 14, lineHeight: 20 },
  'body-sm': { fontFamily: fonts.body400, fontSize: 12, lineHeight: 16 },
  'label-lg': { fontFamily: fonts.mono600, fontSize: 14, lineHeight: 18, letterSpacing: 0.28 },
  'label-md': { fontFamily: fonts.mono500, fontSize: 12, lineHeight: 16, letterSpacing: 0.48 },
  'label-sm': { fontFamily: fonts.mono500, fontSize: 10, lineHeight: 14, letterSpacing: 0.6 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const radii = { sm: 4, md: 8, DEFAULT: 8, lg: 16, xl: 24, full: 9999 } as const;

export const layout = {
  phone: { columns: 4, gutter: 12, margin: 16 },
  tablet: { columns: 8, gutter: 16, margin: 24 },
  tabletBreakpoint: 768,
  tabBarHeight: 72,
  maxContentWidth: 1200,
} as const;
