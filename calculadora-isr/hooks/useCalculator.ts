// hooks/useCalculator.ts - VERSIÓN CON PLACEHOLDERS
// Los inputs inician vacíos, solo muestran ejemplos como placeholders

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

  const [annualIncome, setAnnualIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [utilityCoefficient, setUtilityCoefficient] = useState('');

  // Estado para RESICO - Periodo de cálculo (mensual/anual)
  const [resicoPeriod, setResicoPeriod] = useState<'mensual' | 'anual'>(initialPeriod);
  // Estado para Actividad Empresarial - Mes seleccionado (0-11)
  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  // Estado para Actividad Empresarial - Periodo de cálculo (mensual/anual)
  const [empresarialPeriod, setEmpresarialPeriod] = useState<'mensual' | 'anual'>('mensual');

  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  /**
   * ✅ CRÍTICO: Reinicia inputs + resultados cuando cambia el régimen
   */
  useEffect(() => {
    // Limpiar resultados
    setShowResults(false);
    setResult(null);

    // Reiniciar inputs SIEMPRE al cambiar de régimen
    setAnnualIncome('');
    setDeductions('');
    setUtilityCoefficient('');

    // Reiniciar controles/selecciones por régimen
    setResicoPeriod(initialPeriod);     // vuelve al periodo default del hook
    setSelectedMonth(11);               // diciembre
    setEmpresarialPeriod('mensual');    // default empresarial

  }, [initialRegime, initialPeriod]);

  /**
   * Maneja el cambio de ingreso con formato
   */
  const handleIncomeChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    setAnnualIncome(formatted);
    setShowResults(false);
  };

  /**
   * Maneja el cambio de deducciones
   */
  const handleDeductionsChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    setDeductions(formatted);
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
   * Maneja el cambio de mes para Actividad Empresarial
   */
  const handleEmpresarialMonthChange = (month: number) => {
    setSelectedMonth(month);
    setShowResults(false);
  };

  /**
   * Maneja el cambio de periodo para Actividad Empresarial
   */
  const handleEmpresarialPeriodChange = (period: 'mensual' | 'anual') => {
    setEmpresarialPeriod(period);
    if (period === 'anual') {
      setSelectedMonth(11);
    }
    setShowResults(false);
  };

  /**
   * Calcula la base gravable para Actividad Empresarial
   */
  const getTaxableBase = (): number => {
    if (initialRegime !== 'EMPRESARIAL') {
      return parseCurrency(annualIncome);
    }

    const income = parseCurrency(annualIncome);
    const deduct = parseCurrency(deductions);
    const taxableBase = income - deduct;

    return taxableBase > 0 ? taxableBase : 0;
  };

  /**
   * Calcula el ISR según el régimen ACTUAL (initialRegime)
   */
  const calculateISR = () => {
    const income = parseCurrency(annualIncome);
    const deduct = parseCurrency(deductions);

    let calculationResult: CalculationResult;

    if (initialRegime === 'RESICO') {
      calculationResult = calculateResicoISR(income, resicoPeriod);
    } else if (initialRegime === 'MORAL') {
      const coefficient = parseFloat(utilityCoefficient || '0');
      const utilidadFiscal = income * coefficient;

      calculationResult = calculateMoralISR(utilidadFiscal);
    } else if (initialRegime === 'EMPRESARIAL') {
      const taxableBase = income - deduct;

      if (taxableBase <= 0) {
        calculationResult = {
          tax: 0,
          rate: 0,
          bracket: 'N/A',
          netIncome: 0,
        };
      } else {
        const monthForCalc = empresarialPeriod === 'anual' ? 12 : selectedMonth + 1;
        calculationResult = calculateActividadEmpresarialISR(taxableBase, monthForCalc);
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
    setDeductions('');
    setUtilityCoefficient('');
    setSelectedMonth(11);
    setResicoPeriod(initialPeriod);
    setEmpresarialPeriod('mensual');
    setShowResults(false);
    setResult(null);
  };

  return {
    selectedRegime: initialRegime,
    annualIncome,
    deductions,
    utilityCoefficient,
    resicoPeriod,
    selectedMonth,
    empresarialPeriod,
    showResults,
    result,
    handleIncomeChange,
    handleDeductionsChange,
    handleCoefficientChange,
    handleResicoPeriodChange,
    handleEmpresarialMonthChange,
    handleEmpresarialPeriodChange,
    calculateISR,
    reset,
    getTaxableBase,
  };
};
