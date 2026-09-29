// utils/calculations.ts - VERSIÓN CORREGIDA
// Funciones para cálculos de ISR con mejor manejo de errores

import { CalculationResult, TaxBracket } from '@/types';
import {
  RESICO_TAX_TABLE_MENSUAL,
  RESICO_MAX_INCOME,
  TaxBracketWithQuota,
  getTaxTables,
} from '@/constants/taxTables';

/**
 * Valida y limpia un número de entrada
 */
const validateNumber = (value: number): number => {
  // Convertir a número si es string
  const num = typeof value === 'string' ? parseFloat((value as string).replace(/[^0-9.-]/g, '')) : value;
  
  // Validar que sea un número válido
  if (typeof num !== 'number' || !isFinite(num) || num < 0) {
    return 0;
  }
  
  return num;
};

/**
 * Obtiene la tabla anual de Actividad Empresarial usando el mes indicado
 * @param month - Mes acumulado (1-12)
 * @param year - Año fiscal a usar; por defecto el año vigente (CURRENT_TAX_YEAR)
 */
const getActividadEmpresarialTableForMonth = (month: number, year?: number): TaxBracketWithQuota[] => {
  const baseTable = getTaxTables(year).actividadEmpresarialMensual;
  return baseTable.map((bracket: TaxBracketWithQuota) => ({
    ...bracket,
    min: bracket.min * month,
    max: bracket.max === 999999999.99 ? 999999999.99 : bracket.max * month,
    fixedFee: bracket.fixedFee * month,
  }));
};

/**
 * Calcula el ISR para régimen RESICO
 * @param income - Ingreso (mensual o anual según periodo)
 * @param period - 'mensual' o 'anual'
 * @param year - Año fiscal a usar; por defecto el año vigente (CURRENT_TAX_YEAR)
 * @returns Resultado del cálculo
 */
export const calculateResicoISR = (
  income: number,
  period: 'mensual' | 'anual' = 'anual',
  year?: number
): CalculationResult => {
  // Validación robusta de entrada
  const validIncome = validateNumber(income);

  if (validIncome <= 0) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'N/A',
      netIncome: 0,
    };
  }

  // Seleccionar tabla según periodo (y año fiscal, si se especifica)
  const yearTables = getTaxTables(year);
  const table = period === 'mensual'
    ? yearTables.resicoMensual
    : yearTables.resicoAnual;

  // Si excede el limite del ultimo tramo, usar la tasa maxima
  const maxBracket = table[table.length - 1];
  if (validIncome > maxBracket.max) {
    const tax = validIncome * maxBracket.rate;
    return {
      tax,
      rate: maxBracket.rate * 100,
      bracket: `Mas de $${Math.floor(maxBracket.max).toLocaleString('en-US')}`,
      netIncome: validIncome - tax,
    };
  }

  // Buscar el tramo correspondiente
  for (let bracket of table) {
    if (validIncome >= bracket.min && validIncome <= bracket.max) {
      const tax = validIncome * bracket.rate;
      return {
        tax: tax,
        rate: bracket.rate * 100,
        bracket: `$${Math.floor(bracket.min).toLocaleString('en-US')} - $${Math.floor(bracket.max).toLocaleString('en-US')}`,
        netIncome: validIncome - tax,
      };
    }
  }

  // Caso por defecto (no debería llegar aquí)
  return {
    tax: 0,
    rate: 0,
    bracket: 'Error en cálculo',
    netIncome: validIncome,
  };
};

/**
 * Calcula el ISR para Persona Moral
 * @param utilityFiscal - Utilidad fiscal anual
 * @param year - Año fiscal a usar; por defecto el año vigente (CURRENT_TAX_YEAR)
 * @returns Resultado del cálculo
 */
export const calculateMoralISR = (utilityFiscal: number, year?: number): CalculationResult => {
  // Validación robusta de entrada
  const validUtility = validateNumber(utilityFiscal);

  if (validUtility <= 0) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'N/A',
      netIncome: 0,
    };
  }

  const rate = getTaxTables(year).personaMoralRate;
  const tax = validUtility * rate;
  return {
    tax: tax,
    rate: rate * 100,
    bracket: 'Tasa General',
    netIncome: validUtility - tax,
  };
};

/**
 * Obtiene el tramo de ISR para un ingreso dado
 * @param income - Ingreso a evaluar
 * @param table - Tabla de tasas
 * @returns Tramo encontrado o null
 */
export const getTaxBracket = (
  income: number, 
  table: TaxBracket[]
): TaxBracket | null => {
  const validIncome = validateNumber(income);
  
  for (let bracket of table) {
    if (validIncome >= bracket.min && validIncome <= bracket.max) {
      return bracket;
    }
  }
  return null;
};

/**
 * Calcula el ISR mensual (para pagos provisionales)
 * @param monthlyIncome - Ingreso del mes
 * @param accumulatedIncome - Ingreso acumulado del año
 * @returns ISR del mes
 */
export const calculateMonthlyResicoISR = (
  monthlyIncome: number,
  accumulatedIncome: number
): number => {
  const validMonthly = validateNumber(monthlyIncome);
  const validAccumulated = validateNumber(accumulatedIncome);
  
  const totalIncome = validAccumulated + validMonthly;
  const bracket = getTaxBracket(totalIncome, RESICO_TAX_TABLE_MENSUAL);
  
  if (!bracket) return 0;
  
  const totalTax = totalIncome * bracket.rate;
  const previousTax = validAccumulated * bracket.rate;
  
  return totalTax - previousTax;
};

/**
 * Valida si un ingreso es elegible para RESICO
 * @param income - Ingreso a validar
 * @returns true si es elegible
 */
export const isEligibleForResico = (income: number): boolean => {
  const validIncome = validateNumber(income);
  return validIncome > 0 && validIncome <= RESICO_MAX_INCOME;
};

/**
 * Calcula el porcentaje de impuesto sobre ingreso
 * @param tax - Impuesto calculado
 * @param income - Ingreso total
 * @returns Porcentaje
 */
export const calculateTaxPercentage = (tax: number, income: number): number => {
  const validTax = validateNumber(tax);
  const validIncome = validateNumber(income);
  
  if (validIncome === 0) return 0;
  return (validTax / validIncome) * 100;
};

/**
 * Proyección anual de ISR basado en ingresos mensuales
 * @param monthlyIncome - Ingreso mensual promedio
 * @returns Proyección anual
 */
export const projectAnnualISR = (monthlyIncome: number): CalculationResult => {
  const validMonthly = validateNumber(monthlyIncome);
  const annualIncome = validMonthly * 12;
  return calculateResicoISR(annualIncome);
};

/**
 * Calcula el ISR para Actividad Empresarial (tabla por mes acumulado)
 * @param taxableBase - Base gravable (ingresos - deducciones)
 * @param month - Mes acumulado (1-12)
 * @param year - Año fiscal a usar; por defecto el año vigente (CURRENT_TAX_YEAR)
 * @returns Resultado del cálculo
 */
export const calculateActividadEmpresarialISR = (
  taxableBase: number,
  month: number = 12,
  year?: number
): CalculationResult => {
  // Validación robusta de entrada
  const validBase = validateNumber(taxableBase);

  if (validBase <= 0) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'N/A',
      netIncome: 0,
    };
  }

  // Tabla por mes seleccionado (acumulado) para calculadora simple
  const annualTable = getActividadEmpresarialTableForMonth(month, year);
  let tax = 0;
  let rate = 0;
  let bracketString = 'N/A';

  for (let bracket of annualTable) {
    if (validBase >= bracket.min && validBase <= bracket.max) {
      const excess = validBase - bracket.min;
      tax = bracket.fixedFee + (excess * bracket.rate);
      rate = bracket.rate * 100;
      bracketString = `$${bracket.min.toLocaleString('en-US', { minimumFractionDigits: 2 })} - $${bracket.max === 999999999.99 ? 'En adelante' : bracket.max.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      break;
    }
  }

  return {
    tax,
    rate,
    bracket: bracketString,
    netIncome: validBase - tax,
  };
};
