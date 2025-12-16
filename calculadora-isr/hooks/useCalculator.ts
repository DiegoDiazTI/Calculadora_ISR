// hooks/useCalculator.ts
// Custom hook para la lógica de la calculadora

import { useState } from 'react';
import { RegimeType, CalculationResult } from '@/types';
import { 
  calculateResicoISR, 
  calculateMoralISR,
  calculateActividadEmpresarialISR 
} from '@/utils/calculations';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

export const useCalculator = () => {
  const [selectedRegime, setSelectedRegime] = useState<RegimeType>('RESICO');
  const [annualIncome, setAnnualIncome] = useState('1,250,000');
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

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
    // Ocultar resultados cuando cambia el input
    setShowResults(false);
  };

  /**
   * Maneja el cambio de régimen
   */
  const handleRegimeChange = (regime: RegimeType) => {
    setSelectedRegime(regime);
    setShowResults(false);
    setResult(null);
  };

  /**
   * Calcula el ISR según el régimen seleccionado
   */
  const calculateISR = () => {
    const income = parseCurrency(annualIncome);

    let calculationResult: CalculationResult;

    if (selectedRegime === 'RESICO') {
      calculationResult = calculateResicoISR(income);
    } else if (selectedRegime === 'MORAL') {
      calculationResult = calculateMoralISR(income);
    } else if (selectedRegime === 'EMPRESARIAL') {
      // Para Actividad Empresarial en modo simple, asumimos 0 deducciones
      // (base gravable = ingresos totales)
      calculationResult = calculateActividadEmpresarialISR(income);
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
    setShowResults(false);
    setResult(null);
  };

  return {
    selectedRegime,
    annualIncome,
    showResults,
    result,
    handleIncomeChange,
    handleRegimeChange,
    calculateISR,
    reset,
  };
};