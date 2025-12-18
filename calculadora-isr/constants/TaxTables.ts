// constants/TaxTables.ts
// Tablas de ISR oficiales 2025

import { TaxBracket } from '@/types';

/**
 * Tabla MENSUAL de tasas RESICO 2025
 * Esta es la tabla que usa tu consultoría para pagos mensuales
 * Régimen Simplificado de Confianza para Personas Físicas
 * Tasas directas sobre ingresos (sin deducciones)
 * 
 * IMPORTANTE: Esta es la tabla MENSUAL, no la anual del SAT.
 * Los límites están prorrateados para cálculos mensuales.
 */
export const RESICO_TAX_TABLE_2025: TaxBracket[] = [
  { min: 0, max: 25000, rate: 0.01 },              // 1.0%
  { min: 25000.01, max: 50000, rate: 0.0110 },     // 1.10%
  { min: 50000.01, max: 83333.33, rate: 0.0150 },  // 1.50%
  { min: 83333.34, max: 208333.33, rate: 0.0200 }, // 2.0%
  { min: 208333.34, max: 3500000, rate: 0.0250 },  // 2.5%
];

/**
 * Tabla ANUAL de tasas RESICO 2025
 * Tasas oficiales sobre ingresos acumulados del ejercicio
 */
export const RESICO_TAX_TABLE_ANUAL_2025: TaxBracket[] = [
  { min: 0, max: 300000, rate: 0.01 },            // 1.0%
  { min: 300000.01, max: 600000, rate: 0.0110 },  // 1.10%
  { min: 600000.01, max: 1000000, rate: 0.0150 }, // 1.50%
  { min: 1000000.01, max: 2000000, rate: 0.0200 }, // 2.0%
  { min: 2000000.01, max: 3500000, rate: 0.0250 }, // 2.5%
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
 * Tabla MENSUAL de ISR para Personas Físicas - Actividad Empresarial 2025
 * Esta es la tabla que usa tu consultoría para pagos provisionales mensuales
 * Sistema progresivo: Cuota Fija + (Excedente × Tasa)
 * 
 * IMPORTANTE: Esta tabla es MENSUAL, no es la tabla anual del SAT dividida entre 12.
 * Los límites y cuotas fijas son específicos para cálculos mensuales.
 */
export const ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025: TaxBracketWithQuota[] = [
  { min: 0.01, max: 746.04, fixedFee: 0.00, rate: 0.0192 }, // 1.92%
  { min: 746.05, max: 6332.05, fixedFee: 14.32, rate: 0.0640 }, // 6.40%
  { min: 6332.06, max: 11128.01, fixedFee: 371.83, rate: 0.1088 }, // 10.88%
  { min: 11128.02, max: 12935.82, fixedFee: 893.63, rate: 0.1600 }, // 16.00%
  { min: 12935.83, max: 15487.71, fixedFee: 1182.88, rate: 0.1792 }, // 17.92%
  { min: 15487.72, max: 31236.49, fixedFee: 1640.18, rate: 0.2136 }, // 21.36%
  { min: 31236.50, max: 49233.00, fixedFee: 5004.12, rate: 0.2352 }, // 23.52%
  { min: 49233.01, max: 93993.90, fixedFee: 9236.89, rate: 0.3000 }, // 30.00%
  { min: 93993.91, max: 125325.20, fixedFee: 22665.17, rate: 0.3200 }, // 32.00%
  { min: 125325.21, max: 375975.61, fixedFee: 32691.18, rate: 0.3400 }, // 34.00%
  { min: 375975.62, max: 999999999.99, fixedFee: 117912.32, rate: 0.3500 }, // 35.00%
];

/**
 * Alias para mantener compatibilidad
 * Ahora usa la tabla MENSUAL de tu consultoría
 */
export const ACTIVIDAD_EMPRESARIAL_TABLE_2025 = ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025;

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
  'Tabla mensual para pagos provisionales',
];
