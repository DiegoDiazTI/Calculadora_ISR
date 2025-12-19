// hooks/useCalculator.ts
// CORRECTO FINAL: Persona Moral usa coeficiente para ISR anual, SIN tabla de pagos provisionales

import { useState, useEffect } from 'react';
import { RegimeType, CalculationResult } from '@/types';
import { 
  calculateResicoISR, 
  calculateMoralISR,
  calculateActividadEmpresarialISR 
} from '@/utils/calculations';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

export const useCalculator = (
  initialRegime: RegimeType = 'RESICO',
  initialPeriod: 'mensual' | 'anual' = 'anual'
) => {
  const [selectedRegime] = useState<RegimeType>(initialRegime);
  const [annualIncome, setAnnualIncome] = useState('1,250,000');
  const [deductions, setDeductions] = useState('0');
  
  // Estado para Persona Moral - Coeficiente de Utilidad
  const [utilityCoefficient, setUtilityCoefficient] = useState('0.2360');
  
  // Estado para RESICO - Periodo de cálculo (mensual/anual)
  const [resicoPeriod, setResicoPeriod] = useState<'mensual' | 'anual'>(initialPeriod);
  
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  /**
   * Limpia resultados cuando cambia el régimen desde el contexto
   */
  useEffect(() => {
    setShowResults(false);
    setResult(null);
    
    // Resetear deducciones si no es empresarial
    if (initialRegime !== 'EMPRESARIAL') {
      setDeductions('0');
    }
  }, [initialRegime]);

  /**
   * Maneja el cambio de ingreso con formato
   */
  const handleIncomeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned) {
      setAnnualIncome(formatCurrencyInput(cleaned));
    } else {
      setAnnualIncome('');
    }
    setShowResults(false);
  };

  /**
   * Maneja el cambio de deducciones
   */
  const handleDeductionsChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned) {
      setDeductions(formatCurrencyInput(cleaned));
    } else {
      setDeductions('');
    }
    setShowResults(false);
  };

  /**
   * Maneja el cambio de coeficiente de utilidad
   */
  const handleCoefficientChange = (text: string) => {
    // Permitir números y punto decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    
    // Validar formato de decimal (máximo 4 decimales)
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 4) return;
    
    setUtilityCoefficient(cleaned);
    setShowResults(false);
  };

  /**
   * Maneja el cambio de periodo para RESICO
   */
  const handleResicoPeriodChange = (period: 'mensual' | 'anual') => {
    setResicoPeriod(period);
    setShowResults(false);
  };

  /**
   * Calcula la base gravable para Actividad Empresarial
   */
  const getTaxableBase = (): number => {
    if (selectedRegime !== 'EMPRESARIAL') {
      return parseCurrency(annualIncome);
    }
    
    const income = parseCurrency(annualIncome);
    const deduct = parseCurrency(deductions);
    const taxableBase = income - deduct;
    
    return taxableBase > 0 ? taxableBase : 0;
  };

  /**
   * Calcula el ISR según el régimen seleccionado
   */
  const calculateISR = () => {
    const income = parseCurrency(annualIncome);
    const deduct = parseCurrency(deductions);

    let calculationResult: CalculationResult;

    if (selectedRegime === 'RESICO') {
      calculationResult = calculateResicoISR(income, resicoPeriod);
    } else if (selectedRegime === 'MORAL') {
      // Para Persona Moral: Ingresos × Coeficiente = Utilidad Fiscal
      const coefficient = parseFloat(utilityCoefficient || '0');
      const utilidadFiscal = income * coefficient;
      
      // Luego calcular ISR sobre la utilidad fiscal
      calculationResult = calculateMoralISR(utilidadFiscal);
    } else if (selectedRegime === 'EMPRESARIAL') {
      const taxableBase = income - deduct;
      
      if (taxableBase <= 0) {
        calculationResult = {
          tax: 0,
          rate: 0,
          bracket: 'Base gravable negativa o cero',
          netIncome: 0,
        };
      } else {
        calculationResult = calculateActividadEmpresarialISR(taxableBase);
      }
    } else {
      calculationResult = {
        tax: 0,
        rate: 0,
        bracket: 'N/A',
        netIncome: 0,
      };
    }

    setResult(calculationResult);
    setShowResults(true);
  };

  /**
   * Resetea la calculadora
   */
  const reset = () => {
    setAnnualIncome('');
    setDeductions('0');
    setUtilityCoefficient('0.2360');
    setShowResults(false);
    setResult(null);
  };

  return {
    selectedRegime,
    annualIncome,
    deductions,
    utilityCoefficient,
    resicoPeriod,
    showResults,
    result,
    handleIncomeChange,
    handleDeductionsChange,
    handleCoefficientChange,
    handleResicoPeriodChange,
    calculateISR,
    reset,
    getTaxableBase,
  };
};