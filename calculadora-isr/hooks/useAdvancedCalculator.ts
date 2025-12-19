// hooks/useAdvancedCalculator.ts
// ACTUALIZADO: Soporte para selección de mes en Actividad Empresarial

import { useState, useEffect } from 'react';
import { RegimeType } from '@/types';
import {
  calculateAdvancedResico,
  calculateAdvancedMoral,
  calculateAdvancedEmpresarial,
  ResicoAdvancedData,
  MoralAdvancedData,
  EmpresarialAdvancedData,
  AdvancedCalculationResult,
} from '@/utils/advancedCalculations';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';

export const useAdvancedCalculator = (
  initialRegime: RegimeType = 'RESICO',
  initialPeriod: 'mensual' | 'anual' = 'anual'
) => {
  const [selectedRegime] = useState<RegimeType>(initialRegime);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<AdvancedCalculationResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // Diciembre por defecto
  const [resicoPeriod, setResicoPeriod] = useState<'mensual' | 'anual'>(initialPeriod); // Periodo RESICO

  /**
   * Limpia resultados cuando cambia el régimen desde el contexto
   */
  useEffect(() => {
    setShowResults(false);
    setResult(null);
  }, [initialRegime]);

  // Estados para RESICO
  const [resicoData, setResicoData] = useState({
    totalIncome: '1,250,000',
    withheldISR: '15,625',
    provisionalPayments: '0',
    withheldIVA: '0',
  });

  // Estados para Actividad Empresarial
  const [empresarialData, setEmpresarialData] = useState({
    totalIncome: '3,000,000',
    totalDeductions: '2,160,000',
    provisionalPayments: '0',
    withheldISR: '0',
  });

  // Estados para Persona Moral
  const [moralData, setMoralData] = useState({
    totalIncome: '5,000,000',
    totalDeductions: '3,820,000',
    previousLosses: '0',
    provisionalPayments: '0',
    withheldISR: '0',
  });

  /**
   * Maneja cambios en campos de RESICO
   */
  const handleResicoChange = (field: keyof typeof resicoData, text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = cleaned ? formatCurrencyInput(cleaned) : '';
    
    setResicoData((prev) => ({
      ...prev,
      [field]: formatted,
    }));
    setShowResults(false);
  };

  /**
   * Maneja cambios en campos de Actividad Empresarial
   */
  const handleEmpresarialChange = (field: keyof typeof empresarialData, text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = cleaned ? formatCurrencyInput(cleaned) : '';
    
    setEmpresarialData((prev) => ({
      ...prev,
      [field]: formatted,
    }));
    setShowResults(false);
  };

  /**
   * Maneja cambios en campos de Persona Moral
   */
  const handleMoralChange = (field: keyof typeof moralData, text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const formatted = cleaned ? formatCurrencyInput(cleaned) : '';
    
    setMoralData((prev) => ({
      ...prev,
      [field]: formatted,
    }));
    setShowResults(false);
  };

  /**
   * Maneja el cambio de mes
   */
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
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
   * Calcula el ISR según el régimen seleccionado
   */
  const calculateISR = () => {
    let calculationResult: AdvancedCalculationResult;

    if (selectedRegime === 'RESICO') {
      const data: ResicoAdvancedData = {
        totalIncome: parseCurrency(resicoData.totalIncome),
        withheldISR: parseCurrency(resicoData.withheldISR),
        provisionalPayments: parseCurrency(resicoData.provisionalPayments),
        withheldIVA: parseCurrency(resicoData.withheldIVA),
      };
      calculationResult = calculateAdvancedResico(data, resicoPeriod);
    } else if (selectedRegime === 'EMPRESARIAL') {
      const data: EmpresarialAdvancedData = {
        totalIncome: parseCurrency(empresarialData.totalIncome),
        totalDeductions: parseCurrency(empresarialData.totalDeductions),
        provisionalPayments: parseCurrency(empresarialData.provisionalPayments),
        withheldISR: parseCurrency(empresarialData.withheldISR),
      };
      // Pasar el mes seleccionado al cálculo
      calculationResult = calculateAdvancedEmpresarial(data, selectedMonth + 1);
    } else if (selectedRegime === 'MORAL') {
      const data: MoralAdvancedData = {
        totalIncome: parseCurrency(moralData.totalIncome),
        totalDeductions: parseCurrency(moralData.totalDeductions),
        previousLosses: parseCurrency(moralData.previousLosses),
        provisionalPayments: parseCurrency(moralData.provisionalPayments),
        withheldISR: parseCurrency(moralData.withheldISR),
      };
      calculationResult = calculateAdvancedMoral(data);
    } else {
      // Para TABLES no hay cálculo
      return;
    }

    setResult(calculationResult);
    setShowResults(true);
  };

  /**
   * Resetea todos los valores
   */
  const reset = () => {
    setResicoData({
      totalIncome: '',
      withheldISR: '',
      provisionalPayments: '',
      withheldIVA: '',
    });
    setEmpresarialData({
      totalIncome: '',
      totalDeductions: '',
      provisionalPayments: '',
      withheldISR: '',
    });
    setMoralData({
      totalIncome: '',
      totalDeductions: '',
      previousLosses: '',
      provisionalPayments: '',
      withheldISR: '',
    });
    setShowResults(false);
    setResult(null);
    setSelectedMonth(11); // Reset a diciembre
  };

  /**
   * Calcula totales para vista previa
   */
  const getTotals = () => {
    if (selectedRegime === 'EMPRESARIAL') {
      const totalDeductions = parseCurrency(empresarialData.totalDeductions);

      return {
        totalIncome: parseCurrency(empresarialData.totalIncome),
        totalDeductions,
        taxableBase: parseCurrency(empresarialData.totalIncome) - totalDeductions,
      };
    } else if (selectedRegime === 'MORAL') {
      const totalDeductions = parseCurrency(moralData.totalDeductions);

      return {
        totalIncome: parseCurrency(moralData.totalIncome),
        totalDeductions,
        taxableBase: parseCurrency(moralData.totalIncome) - totalDeductions - parseCurrency(moralData.previousLosses),
      };
    }
    return null;
  };

  return {
    selectedRegime,
    showResults,
    result,
    resicoData,
    empresarialData,
    moralData,
    selectedMonth,
    resicoPeriod,
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleMonthChange,
    handleResicoPeriodChange,
    calculateISR,
    reset,
    getTotals,
  };
};