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