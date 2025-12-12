// utils/advancedCalculations.ts
// Cálculos avanzados de ISR para RESICO, Actividad Empresarial y Persona Moral

import { CalculationResult, TaxBracket } from '@/types';
import { 
  RESICO_TAX_TABLE_2025, 
  RESICO_MAX_INCOME, 
  PERSONA_MORAL_RATE,
  ACTIVIDAD_EMPRESARIAL_TABLE_2025
} from '@/constants/TaxTables';

/**
 * Interface para datos avanzados de RESICO
 */
export interface ResicoAdvancedData {
  totalIncome: number;           // Ingresos totales anuales
  withheldISR: number;           // ISR retenido (1.25%)
  provisionalPayments: number;   // Pagos provisionales realizados
  withheldIVA?: number;          // IVA retenido (6%) - opcional
}

/**
 * Interface para datos avanzados de Actividad Empresarial
 */
export interface EmpresarialAdvancedData {
  totalIncome: number;           // Ingresos acumulables
  purchases: number;             // Compras y costos de ventas
  operatingExpenses: number;     // Gastos de operación
  salaries: number;              // Sueldos y salarios
  rent: number;                  // Rentas
  depreciation: number;          // Depreciaciones
  interest: number;              // Intereses
  otherDeductions: number;       // Otras deducciones autorizadas
  provisionalPayments: number;   // Pagos provisionales
  withheldISR: number;           // Retenciones de ISR
}

/**
 * Interface para datos avanzados de Persona Moral
 */
export interface MoralAdvancedData {
  totalIncome: number;           // Ingresos acumulables
  purchases: number;             // Compras y costos de ventas
  operatingExpenses: number;     // Gastos de operación
  salaries: number;              // Sueldos y salarios
  rent: number;                  // Rentas
  depreciation: number;          // Depreciaciones
  interest: number;              // Intereses
  otherDeductions: number;       // Otras deducciones autorizadas
  previousLosses: number;        // Pérdidas fiscales años anteriores
  ptu: number;                   // PTU pagada
  provisionalPayments: number;   // Pagos provisionales
  withheldISR: number;           // Retenciones de ISR
}

/**
 * Resultado de cálculo avanzado
 */
export interface AdvancedCalculationResult extends CalculationResult {
  grossIncome: number;           // Ingresos brutos
  totalDeductions: number;       // Deducciones totales
  taxableBase: number;           // Base gravable
  grossISR: number;              // ISR causado
  withheldISR: number;           // ISR retenido
  provisionalPayments: number;   // Pagos provisionales
  finalISR: number;              // ISR final a pagar/devolver
  isFavorBalance: boolean;       // Si es saldo a favor
}

/**
 * Calcula ISR avanzado para RESICO
 */
export const calculateAdvancedResico = (
  data: ResicoAdvancedData
): AdvancedCalculationResult => {
  const { totalIncome, withheldISR, provisionalPayments, withheldIVA = 0 } = data;

  // Validaciones
  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  // En RESICO, la base gravable es igual a los ingresos (sin deducciones)
  const taxableBase = totalIncome;

  // Buscar el tramo de ISR
  let bracket: TaxBracket | null = null;
  for (let b of RESICO_TAX_TABLE_2025) {
    if (totalIncome >= b.min && totalIncome <= b.max) {
      bracket = b;
      break;
    }
  }

  if (!bracket) {
    return createEmptyAdvancedResult();
  }

  // Calcular ISR causado (bruto)
  const grossISR = totalIncome * bracket.rate;

  // Calcular ISR final
  const finalISR = grossISR - withheldISR - provisionalPayments;
  const isFavorBalance = finalISR < 0;

  return {
    tax: Math.abs(finalISR),
    rate: bracket.rate * 100,
    bracket: `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
    netIncome: totalIncome - grossISR,
    grossIncome: totalIncome,
    totalDeductions: 0, // RESICO no permite deducciones
    taxableBase,
    grossISR,
    withheldISR,
    provisionalPayments,
    finalISR: Math.abs(finalISR),
    isFavorBalance,
  };
};

/**
 * Calcula ISR avanzado para Actividad Empresarial
 */
export const calculateAdvancedEmpresarial = (
  data: EmpresarialAdvancedData
): AdvancedCalculationResult => {
  const {
    totalIncome,
    purchases,
    operatingExpenses,
    salaries,
    rent,
    depreciation,
    interest,
    otherDeductions,
    provisionalPayments,
    withheldISR,
  } = data;

  // Validaciones
  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  // Calcular deducciones totales
  const totalDeductions =
    purchases +
    operatingExpenses +
    salaries +
    rent +
    depreciation +
    interest +
    otherDeductions;

  // Base gravable = Ingresos - Deducciones
  let taxableBase = totalIncome - totalDeductions;
  
  // La base gravable no puede ser negativa
  if (taxableBase < 0) {
    taxableBase = 0;
  }

  // Buscar tramo de ISR
  let grossISR = 0;
  let rate = 0;
  let bracketString = 'N/A';

  for (let bracket of ACTIVIDAD_EMPRESARIAL_TABLE_2025) {
    if (taxableBase >= bracket.min && taxableBase <= bracket.max) {
      // Cálculo: Cuota Fija + (Excedente × Tasa)
      const excess = taxableBase - bracket.min;
      grossISR = bracket.fixedFee + (excess * bracket.rate);
      rate = bracket.rate * 100;
      bracketString = `$${bracket.min.toLocaleString('en-US', { minimumFractionDigits: 2 })} - $${bracket.max.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      break;
    }
  }

  // ISR final = ISR causado - Pagos provisionales - Retenciones
  const finalISR = grossISR - provisionalPayments - withheldISR;
  const isFavorBalance = finalISR < 0;

  // Ingreso neto = Base gravable - ISR
  const netIncome = taxableBase - grossISR;

  return {
    tax: Math.abs(finalISR),
    rate,
    bracket: bracketString,
    netIncome,
    grossIncome: totalIncome,
    totalDeductions,
    taxableBase,
    grossISR,
    withheldISR,
    provisionalPayments,
    finalISR: Math.abs(finalISR),
    isFavorBalance,
  };
};

/**
 * Calcula ISR avanzado para Persona Moral
 */
export const calculateAdvancedMoral = (
  data: MoralAdvancedData
): AdvancedCalculationResult => {
  const {
    totalIncome,
    purchases,
    operatingExpenses,
    salaries,
    rent,
    depreciation,
    interest,
    otherDeductions,
    previousLosses,
    ptu,
    provisionalPayments,
    withheldISR,
  } = data;

  // Validaciones
  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  // Calcular deducciones totales
  const totalDeductions =
    purchases +
    operatingExpenses +
    salaries +
    rent +
    depreciation +
    interest +
    otherDeductions +
    ptu;

  // Base gravable = Ingresos - Deducciones - Pérdidas fiscales
  let taxableBase = totalIncome - totalDeductions - previousLosses;
  
  // La base gravable no puede ser negativa para efectos de ISR
  if (taxableBase < 0) {
    taxableBase = 0;
  }

  // ISR causado = Base gravable × 30%
  const grossISR = taxableBase * PERSONA_MORAL_RATE;

  // ISR final = ISR causado - Pagos provisionales - Retenciones
  const finalISR = grossISR - provisionalPayments - withheldISR;
  const isFavorBalance = finalISR < 0;

  // Ingreso neto = Utilidad fiscal - ISR
  const netIncome = taxableBase - grossISR;

  return {
    tax: Math.abs(finalISR),
    rate: PERSONA_MORAL_RATE * 100,
    bracket: 'Tasa General',
    netIncome,
    grossIncome: totalIncome,
    totalDeductions,
    taxableBase,
    grossISR,
    withheldISR,
    provisionalPayments,
    finalISR: Math.abs(finalISR),
    isFavorBalance,
  };
};

/**
 * Crea un resultado vacío
 */
const createEmptyAdvancedResult = (): AdvancedCalculationResult => ({
  tax: 0,
  rate: 0,
  bracket: 'N/A',
  netIncome: 0,
  grossIncome: 0,
  totalDeductions: 0,
  taxableBase: 0,
  grossISR: 0,
  withheldISR: 0,
  provisionalPayments: 0,
  finalISR: 0,
  isFavorBalance: false,
});

/**
 * Calcula el porcentaje efectivo de ISR
 */
export const calculateEffectiveRate = (
  isr: number,
  income: number
): number => {
  if (income === 0) return 0;
  return (isr / income) * 100;
};

/**
 * Valida que las deducciones no excedan los ingresos
 */
export const validateDeductions = (
  income: number,
  deductions: number
): boolean => {
  // Las deducciones pueden exceder los ingresos (genera pérdida fiscal)
  // Pero mostramos warning si es más del 95%
  return deductions <= income * 0.95;
};

/**
 * Calcula cuánto puede deducir como máximo
 */
export const getMaxDeductible = (income: number): number => {
  // En teoría no hay límite, pero sugerimos hasta 80% como "normal"
  return income * 0.80;
};

/**
 * Estima pagos provisionales mensuales (RESICO)
 */
export const estimateMonthlyPayment = (
  annualIncome: number,
  month: number
): number => {
  const monthlyIncome = annualIncome / 12;
  const accumulatedIncome = monthlyIncome * month;
  
  // Buscar tramo
  for (let bracket of RESICO_TAX_TABLE_2025) {
    if (accumulatedIncome >= bracket.min && accumulatedIncome <= bracket.max) {
      return accumulatedIncome * bracket.rate;
    }
  }
  
  return 0;
};