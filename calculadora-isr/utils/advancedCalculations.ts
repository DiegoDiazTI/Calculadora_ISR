// utils/advancedCalculations.ts
// ACTUALIZADO: Soporte para cálculo por mes en Actividad Empresarial

import { CalculationResult, TaxBracket } from '@/types';
import { 
  RESICO_TAX_TABLE_ANUAL_2025,
  RESICO_TAX_TABLE_2025, 
  RESICO_MAX_INCOME, 
  PERSONA_MORAL_RATE,
  ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025,
  TaxBracketWithQuota
} from '@/constants/TaxTables';

export interface ResicoAdvancedData {
  totalIncome: number;
  withheldISR: number;
  provisionalPayments: number;
  withheldIVA?: number;
}

export interface EmpresarialAdvancedData {
  totalIncome: number;
  totalDeductions: number;
  provisionalPayments: number;
  withheldISR: number;
}

export interface MoralAdvancedData {
  totalIncome: number;
  totalDeductions: number;
  previousLosses: number;
  provisionalPayments: number;
  withheldISR: number;
}

export interface AdvancedCalculationResult extends CalculationResult {
  grossIncome: number;
  totalDeductions: number;
  taxableBase: number;
  grossISR: number;
  withheldISR: number;
  provisionalPayments: number;
  finalISR: number;
  isFavorBalance: boolean;
}

/**
 * Calcula ISR avanzado para RESICO
 */
export const calculateAdvancedResico = (
  data: ResicoAdvancedData,
  period: 'mensual' | 'anual' = 'anual'
): AdvancedCalculationResult => {
  const { totalIncome, withheldISR, provisionalPayments, withheldIVA = 0 } = data;

  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  const taxableBase = totalIncome;

  // Seleccionar tabla según periodo
  const table = period === 'mensual' 
    ? RESICO_TAX_TABLE_2025 
    : RESICO_TAX_TABLE_ANUAL_2025;

  let bracket: TaxBracket | null = null;
  for (let b of table) {
    if (totalIncome >= b.min && totalIncome <= b.max) {
      bracket = b;
      break;
    }
  }

  if (!bracket) {
    return createEmptyAdvancedResult();
  }

  const grossISR = totalIncome * bracket.rate;
  const finalISR = grossISR - withheldISR - provisionalPayments;
  const isFavorBalance = finalISR < 0;

  return {
    tax: Math.abs(finalISR),
    rate: bracket.rate * 100,
    bracket: `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
    netIncome: totalIncome - grossISR,
    grossIncome: totalIncome,
    totalDeductions: 0,
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
 * @param data Datos de ingresos y deducciones
 * @param month Mes para usar la tabla correspondiente (1-12)
 */
export const calculateAdvancedEmpresarial = (
  data: EmpresarialAdvancedData,
  month: number = 12
): AdvancedCalculationResult => {
  const {
    totalIncome,
    totalDeductions,
    provisionalPayments,
    withheldISR,
  } = data;

  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  // Base gravable = Ingresos - Deducciones
  let taxableBase = totalIncome - totalDeductions;
  
  if (taxableBase < 0) {
    taxableBase = 0;
  }

  // Obtener tabla del mes correspondiente
  const monthlyTable = getTablaParaMes(month);

  // Buscar tramo de ISR
  let grossISR = 0;
  let rate = 0;
  let bracketString = 'N/A';

  for (let bracket of monthlyTable) {
    if (taxableBase >= bracket.min && taxableBase <= bracket.max) {
      // Cálculo: Cuota Fija + (Excedente × Tasa)
      const excess = taxableBase - bracket.min;
      grossISR = bracket.fixedFee + (excess * bracket.rate);
      rate = bracket.rate * 100;
      bracketString = `$${bracket.min.toLocaleString('en-US', { minimumFractionDigits: 2 })} - $${bracket.max === 999999999.99 ? 'En adelante' : bracket.max.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
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
 * Obtiene la tabla de ISR para un mes específico
 * Multiplica los límites y cuota fija por el número de mes
 */
const getTablaParaMes = (mesNumero: number): TaxBracketWithQuota[] => {
  return ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025.map((bracket: TaxBracketWithQuota) => ({
    ...bracket,
    min: bracket.min * mesNumero,
    max: bracket.max === 999999999.99 ? 999999999.99 : bracket.max * mesNumero,
    fixedFee: bracket.fixedFee * mesNumero,
  }));
};

/**
 * Calcula ISR avanzado para Persona Moral
 */
export const calculateAdvancedMoral = (
  data: MoralAdvancedData
): AdvancedCalculationResult => {
  const {
    totalIncome,
    totalDeductions,
    previousLosses,
    provisionalPayments,
    withheldISR,
  } = data;

  if (isNaN(totalIncome) || totalIncome <= 0) {
    return createEmptyAdvancedResult();
  }

  let taxableBase = totalIncome - totalDeductions - previousLosses;
  
  if (taxableBase < 0) {
    taxableBase = 0;
  }

  const grossISR = taxableBase * PERSONA_MORAL_RATE;
  const finalISR = grossISR - provisionalPayments - withheldISR;
  const isFavorBalance = finalISR < 0;
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

export const calculateEffectiveRate = (isr: number, income: number): number => {
  if (income === 0) return 0;
  return (isr / income) * 100;
};

export const validateDeductions = (income: number, deductions: number): boolean => {
  return deductions <= income * 0.95;
};

export const getMaxDeductible = (income: number): number => {
  return income * 0.80;
};

export const estimateMonthlyPayment = (annualIncome: number, month: number): number => {
  const monthlyIncome = annualIncome / 12;
  const accumulatedIncome = monthlyIncome * month;
  
  for (let bracket of RESICO_TAX_TABLE_2025) {
    if (accumulatedIncome >= bracket.min && accumulatedIncome <= bracket.max) {
      return accumulatedIncome * bracket.rate;
    }
  }
  
  return 0;
};
