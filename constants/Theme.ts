// constants/Theme.ts
// Configuración de temas (claro y oscuro)

import { ThemeColors } from '@/types';

/**
 * Tema Oscuro
 */
export const DARK_THEME: ThemeColors = {
  background: '#0F172A',
  cardBackground: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  border: '#334155',
  accent: '#0F766E',
  accentLight: '#14B8A6',
  accentBg: '#0F766E',
  cardBorder: 'transparent',
  inputBg: '#1E293B',
  inputBorder: '#334155',
  disabledIcon: '#334155',
  disabledText: '#64748B',
  characteristicsCard: '#0F766E',
  characteristicsText: '#D1FAE5',
  resultCard: '#0F766E',
  resultCardText: '#D1FAE5',
  detailCard: '#0F172A',
  statusBar: 'light-content',
};

/**
 * Tema Claro
 */
export const LIGHT_THEME: ThemeColors = {
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  border: '#E2E8F0',
  accent: '#0F766E',
  accentLight: '#14B8A6',
  accentBg: '#14B8A6',
  cardBorder: '#E2E8F0',
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1',
  disabledIcon: '#CBD5E1',
  disabledText: '#94A3B8',
  characteristicsCard: '#14B8A6',
  characteristicsText: '#FFFFFF',
  resultCard: '#14B8A6',
  resultCardText: '#FFFFFF',
  detailCard: '#F1F5F9',
  statusBar: 'dark-content',
};

/**
 * Colores compartidos (no cambian con el tema)
 */
export const SHARED_COLORS = {
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  red: {
    700: '#991B1B',
    800: '#7F1D1D',
  },
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Tamaños de fuente
 */
export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
};

/**
 * Espaciado
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 40,
};

/**
 * Border radius
 */
export const BORDER_RADIUS = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
};