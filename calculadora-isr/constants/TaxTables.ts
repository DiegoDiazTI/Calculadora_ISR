// constants/TaxTables.ts
// ACTUALIZADO: Solo valores de RESICO corregidos según imagen oficial

import { TaxBracket } from '@/types';

/**
 * Tabla de tasas RESICO 2025 - MENSUAL
 * ⚠️ VALORES ACTUALIZADOS según tabla oficial
 */
export const RESICO_TAX_TABLE_2025: TaxBracket[] = [
  { min: 0.01, max: 25000.00, rate: 0.01 },        // 1.00%
  { min: 25000.01, max: 50000.00, rate: 0.011 },   // 1.10%
  { min: 50000.01, max: 83333.33, rate: 0.015 },   // 1.50%
  { min: 83333.34, max: 208333.33, rate: 0.02 },   // 2.00%
  { min: 208333.34, max: 3500000.00, rate: 0.025 },// 2.50%
];

/**
 * Tabla de tasas RESICO 2025 - ANUAL
 * ⚠️ VALORES ACTUALIZADOS según tabla oficial
 */
export const RESICO_TAX_TABLE_ANUAL_2025: TaxBracket[] = [
  { min: 0.01, max: 300000.00, rate: 0.01 },       // 1.00%
  { min: 300000.01, max: 600000.00, rate: 0.011 }, // 1.10%
  { min: 600000.01, max: 1000000.00, rate: 0.015 },// 1.50%
  { min: 1000000.01, max: 2000000.00, rate: 0.02 },// 2.00%
  { min: 2000000.01, max: 3500000.00, rate: 0.025 },// 2.50%
];

/**
 * Límite máximo de ingresos anuales para RESICO
 */
export const RESICO_MAX_INCOME = 3500000;

/**
 * Tipo extendido para tablas con cuota fija
 */
export interface TaxBracketWithQuota {
  min: number;
  max: number;
  fixedFee: number;
  rate: number;
}

/**
 * Tabla mensual base para Actividad Empresarial (Mes 1)
 * Se multiplica por el número de mes para obtener la tabla acumulada
 */
export const ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025: TaxBracketWithQuota[] = [
  { min: 0.01, max: 746.04, fixedFee: 0.00, rate: 0.0192 },
  { min: 746.05, max: 6332.05, fixedFee: 14.32, rate: 0.064 },
  { min: 6332.06, max: 11128.01, fixedFee: 371.83, rate: 0.1088 },
  { min: 11128.02, max: 12935.82, fixedFee: 893.63, rate: 0.16 },
  { min: 12935.83, max: 15487.71, fixedFee: 1182.88, rate: 0.1792 },
  { min: 15487.72, max: 31236.49, fixedFee: 1640.18, rate: 0.2136 },
  { min: 31236.50, max: 49233.00, fixedFee: 5004.12, rate: 0.2352 },
  { min: 49233.01, max: 93993.90, fixedFee: 9236.89, rate: 0.30 },
  { min: 93993.91, max: 125325.20, fixedFee: 22665.17, rate: 0.32 },
  { min: 125325.21, max: 375975.61, fixedFee: 32691.18, rate: 0.34 },
  { min: 375975.62, max: 999999999.99, fixedFee: 117912.32, rate: 0.35 },
];

/**
 * Tasa de ISR para Personas Morales
 * Régimen General - Tasa fija sobre utilidad fiscal
 */
export const PERSONA_MORAL_RATE = 0.30; // 30%

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
 * Características de Actividad Empresarial
 */
export const ACTIVIDAD_EMPRESARIAL_CHARACTERISTICS = [
  'Para personas físicas con actividad empresarial',
  'Permite deducciones autorizadas',
  'Tasas progresivas del 1.92% al 35%',
  'Cálculo sobre base gravable',
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