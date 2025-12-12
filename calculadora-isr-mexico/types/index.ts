// types/index.ts
// Definiciones de tipos para toda la aplicación

export type RegimeType = 'RESICO' | 'MORAL' | 'EMPRESARIAL' | 'TABLES';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface CalculationResult {
  tax: number;
  rate: number;
  bracket: string;
  netIncome: number;
}

export interface ThemeColors {
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  accent: string;
  accentLight: string;
  accentBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  disabledIcon: string;
  disabledText: string;
  characteristicsCard: string;
  characteristicsText: string;
  resultCard: string;
  resultCardText: string;
  detailCard: string;
  statusBar: 'light-content' | 'dark-content';
}

export interface RegimeConfig {
  id: RegimeType;
  title: string;
  subtitle: string;
  icon: string;
  enabled: boolean;
  characteristics: string[];
}

export interface AppSettings {
  isDarkMode: boolean;
  selectedRegime: RegimeType;
  lastCalculation?: CalculationResult;
  calculationHistory: CalculationHistoryItem[];
}

export interface CalculationHistoryItem {
  id: string;
  date: Date;
  regime: RegimeType;
  income: number;
  result: CalculationResult;
}