// utils/calculations.ts
// Funciones para cálculos de ISR

import { CalculationResult, TaxBracket } from '@/types';
import { 
  RESICO_TAX_TABLE_2025, 
  RESICO_MAX_INCOME, 
  PERSONA_MORAL_RATE 
} from '@/constants/TaxTables';

/**
 * Calcula el ISR para régimen RESICO
 * @param income - Ingreso anual
 * @returns Resultado del cálculo
 */
export const calculateResicoISR = (income: number): CalculationResult => {
  // Validación de entrada
  if (isNaN(income) || income <= 0) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'N/A',
      netIncome: 0,
    };
  }

  // Verificar si excede el límite
  if (income > RESICO_MAX_INCOME) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'Excede límite RESICO',
      netIncome: income,
    };
  }

  // Buscar el tramo correspondiente
  for (let bracket of RESICO_TAX_TABLE_2025) {
    if (income >= bracket.min && income <= bracket.max) {
      const tax = income * bracket.rate;
      return {
        tax: tax,
        rate: bracket.rate * 100,
        bracket: `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
        netIncome: income - tax,
      };
    }
  }

  // Caso por defecto (no debería llegar aquí)
  return {
    tax: 0,
    rate: 0,
    bracket: 'Error en cálculo',
    netIncome: income,
  };
};

/**
 * Calcula el ISR para Persona Moral
 * @param utilityFiscal - Utilidad fiscal anual
 * @returns Resultado del cálculo
 */
export const calculateMoralISR = (utilityFiscal: number): CalculationResult => {
  // Validación de entrada
  if (isNaN(utilityFiscal) || utilityFiscal <= 0) {
    return {
      tax: 0,
      rate: 0,
      bracket: 'N/A',
      netIncome: 0,
    };
  }

  const tax = utilityFiscal * PERSONA_MORAL_RATE;
  
  return {
    tax: tax,
    rate: PERSONA_MORAL_RATE * 100,
    bracket: 'Tasa General',
    netIncome: utilityFiscal - tax,
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
  for (let bracket of table) {
    if (income >= bracket.min && income <= bracket.max) {
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
  const totalIncome = accumulatedIncome + monthlyIncome;
  const bracket = getTaxBracket(totalIncome, RESICO_TAX_TABLE_2025);
  
  if (!bracket) return 0;
  
  const totalTax = totalIncome * bracket.rate;
  const previousTax = accumulatedIncome * bracket.rate;
  
  return totalTax - previousTax;
};

/**
 * Valida si un ingreso es elegible para RESICO
 * @param income - Ingreso a validar
 * @returns true si es elegible
 */
export const isEligibleForResico = (income: number): boolean => {
  return income > 0 && income <= RESICO_MAX_INCOME;
};

/**
 * Calcula el porcentaje de impuesto sobre ingreso
 * @param tax - Impuesto calculado
 * @param income - Ingreso total
 * @returns Porcentaje
 */
export const calculateTaxPercentage = (tax: number, income: number): number => {
  if (income === 0) return 0;
  return (tax / income) * 100;
};

/**
 * Proyección anual de ISR basado en ingresos mensuales
 * @param monthlyIncome - Ingreso mensual promedio
 * @returns Proyección anual
 */
export const projectAnnualISR = (monthlyIncome: number): CalculationResult => {
  const annualIncome = monthlyIncome * 12;
  return calculateResicoISR(annualIncome);
};