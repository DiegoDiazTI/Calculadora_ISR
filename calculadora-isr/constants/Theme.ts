// constants/Theme.ts
// Configuración de temas (claro y oscuro)

import { ThemeColors } from '@/types';

/**
 * Tema Oscuro - Colores corporativos Díaz Lara
 */
export const DARK_THEME: ThemeColors = {
  background: '#000000',                     // Negro corporativo
  cardBackground: '#2c2627',                 // Gray Dark corporativo
  text: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
  border: 'rgba(0, 74, 74, 0.15)',          // Teal translúcido
  accent: '#004a4a',                         // Teal Primary corporativo
  accentLight: '#005a5a',
  accentBg: '#004a4a',
  cardBorder: 'transparent',
  inputBg: 'rgba(255, 255, 255, 0.05)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  disabledIcon: '#64748B',
  disabledText: '#64748B',
  characteristicsCard: 'rgba(0, 74, 74, 0.15)', // Teal translúcido
  characteristicsText: '#E5E7EB',
  resultCard: '#004a4a',                     // Teal Primary
  resultCardText: '#FFFFFF',
  detailCard: 'rgba(0, 74, 74, 0.15)',
  statusBar: 'light-content',
};

/**
 * Tema Claro - Colores corporativos Díaz Lara
 */
export const LIGHT_THEME: ThemeColors = {
  background: '#f8f7f4',                     // Cream corporativo
  cardBackground: '#FFFFFF',
  text: '#2c2627',                           // Gray Dark corporativo
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: 'rgba(0, 74, 74, 0.08)',          // Teal translúcido claro
  accent: '#004a4a',                         // Teal Primary corporativo
  accentLight: '#005a5a',
  accentBg: '#004a4a',
  cardBorder: 'rgba(0, 74, 74, 0.08)',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0, 74, 74, 0.08)',
  disabledIcon: '#CBD5E1',
  disabledText: '#94A3B8',
  characteristicsCard: 'rgba(0, 74, 74, 0.1)', // Teal translúcido
  characteristicsText: '#2c2627',
  resultCard: '#004a4a',                     // Teal Primary
  resultCardText: '#FFFFFF',
  detailCard: 'rgba(0, 74, 74, 0.05)',
  statusBar: 'dark-content',
};

/**
 * Colores corporativos Díaz Lara
 */
export const SHARED_COLORS = {
  teal: {
    primary: '#004a4a',      // Teal Primary
    dark: '#0a2127',         // Teal Dark
    light: '#005a5a',
    translucent: 'rgba(0, 74, 74, 0.1)',
  },
  red: {
    accent: '#780109',       // Accent Red (hover effects)
    hover: '#8b0109',
  },
  gray: {
    dark: '#2c2627',         // Gray Dark
    light: '#6b7280',
  },
  cream: '#f8f7f4',          // Cream (fondo modo claro)
  white: '#FFFFFF',
  black: '#000000',
};

/**
 * Tamaños de fuente - Tipografía corporativa Díaz Lara
 */
export const FONT_SIZES = {
  xs: 11,       // Captions
  sm: 13,       // Labels
  base: 14,     // Texto del cuerpo
  lg: 16,       // Subtítulos
  xl: 18,       // Números pequeños
  '2xl': 24,    // Números (Roboto Mono)
  '3xl': 28,    // Títulos principales
  '4xl': 32,    // Números grandes
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
 * Border radius - Especificaciones corporativas Díaz Lara
 */
export const BORDER_RADIUS = {
  sm: 6,        // Badge
  md: 8,
  lg: 12,       // Botones, inputs
  xl: 16,       // Cards
  xxl: 20,
  frame: 40,    // Frame principal
  full: 9999,
};