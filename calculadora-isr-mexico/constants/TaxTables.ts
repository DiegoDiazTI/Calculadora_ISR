// constants/TaxTables.ts
// Tablas de ISR oficiales 2025

import { TaxBracket } from '@/types';

/**
 * Tabla de tasas RESICO 2025
 * Régimen Simplificado de Confianza para Personas Físicas
 * Tasas directas sobre ingresos (sin deducciones)
 */
export const RESICO_TAX_TABLE_2025: TaxBracket[] = [
  { min: 0, max: 300000, rate: 0.01 },           // 1.0%
  { min: 300001, max: 600000, rate: 0.0110 },    // 1.10%
  { min: 600001, max: 1000000, rate: 0.0120 },   // 1.20%
  { min: 1000001, max: 1500000, rate: 0.0150 },  // 1.50%
  { min: 1500001, max: 2000000, rate: 0.0200 },  // 2.0%
  { min: 2000001, max: 3500000, rate: 0.0250 },  // 2.5%
];

/**
 * Límite máximo de ingresos anuales para RESICO
 */
export const RESICO_MAX_INCOME = 3500000;

/**
 * Tasa de ISR para Personas Morales
 * Régimen General - Tasa fija sobre utilidad fiscal
 */
export const PERSONA_MORAL_RATE = 0.30; // 30%

/**
 * Interface para tramos de ISR con cuota fija (Actividad Empresarial)
 */
export interface TaxBracketWithQuota {
  min: number;
  max: number;
  fixedFee: number;      // Cuota fija
  rate: number;          // Tasa sobre excedente
}

/**
 * Tabla de ISR 2025 para Personas Físicas - Actividad Empresarial
 * Sistema progresivo: Cuota Fija + (Excedente × Tasa)
 */
export const ACTIVIDAD_EMPRESARIAL_TABLE_2025: TaxBracketWithQuota[] = [
  { min: 0.01, max: 7735.00, fixedFee: 0.00, rate: 0.0192 },                    // 1.92%
  { min: 7735.01, max: 65651.07, fixedFee: 148.51, rate: 0.0640 },              // 6.40%
  { min: 65651.08, max: 115375.90, fixedFee: 3855.14, rate: 0.1088 },           // 10.88%
  { min: 115375.91, max: 134119.41, fixedFee: 9265.20, rate: 0.1600 },          // 16.00%
  { min: 134119.42, max: 160577.65, fixedFee: 12264.16, rate: 0.1792 },         // 17.92%
  { min: 160577.66, max: 323862.00, fixedFee: 17005.47, rate: 0.2136 },         // 21.36%
  { min: 323862.01, max: 510451.00, fixedFee: 51883.01, rate: 0.2352 },         // 23.52%
  { min: 510451.01, max: 974535.03, fixedFee: 95768.74, rate: 0.3000 },         // 30.00%
  { min: 974535.04, max: 1299380.04, fixedFee: 234993.95, rate: 0.3200 },       // 32.00%
  { min: 1299380.05, max: 3898140.12, fixedFee: 338944.34, rate: 0.3400 },      // 34.00%
  { min: 3898140.13, max: 999999999.99, fixedFee: 1222522.76, rate: 0.3500 },   // 35.00%
];

/**
 * Características del régimen RESICO
 */
export const RESICO_CHARACTERISTICS = [
  'Ingresos máximos: $3,500,000 anuales',
  'Tasas reducidas del 1% al 2.5%',
  'Cálculo directo sobre ingresos',
  'No hay deducciones personales',
];

/**
 * Características de Persona Moral
 */
export const PERSONA_MORAL_CHARACTERISTICS = [
  'Tasa general del 30% sobre utilidad fiscal',
  'Aplica para empresas y sociedades',
  'Permite deducciones autorizadas',
  'Régimen general del SAT',
];

/**
 * Características de Actividad Empresarial
 */
export const ACTIVIDAD_EMPRESARIAL_CHARACTERISTICS = [
  'Para personas físicas con actividad empresarial',
  'Permite deducciones autorizadas completas',
  'Tasas progresivas del 1.92% al 35%',
  'Cálculo: Cuota fija + (Excedente × Tasa)',
  'Sin límite de ingresos',
];