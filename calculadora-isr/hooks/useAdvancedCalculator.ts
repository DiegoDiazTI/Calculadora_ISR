// hooks/useAdvancedCalculator.ts - VERSIÓN FINAL
// ✅ FIX: Resetea todos los inputs al cambiar de régimen

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
  const [selectedRegime, setSelectedRegime] = useState<RegimeType>(initialRegime);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<AdvancedCalculationResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [resicoPeriod, setResicoPeriod] = useState<'mensual' | 'anual'>(initialPeriod);
  const [empresarialPeriod, setEmpresarialPeriod] = useState<'mensual' | 'anual'>('mensual');

  const [resicoData, setResicoData] = useState({
    totalIncome: '',
    withheldISR: '',
    provisionalPayments: '',
    withheldIVA: '',
  });

  const [empresarialData, setEmpresarialData] = useState({
    totalIncome: '',
    totalDeductions: '',
    provisionalPayments: '',
    withheldISR: '',
  });

  const [moralData, setMoralData] = useState({
    totalIncome: '',
    totalDeductions: '',
    previousLosses: '',
    provisionalPayments: '',
    withheldISR: '',
  });

  /**
   * ✅ SOLUCIÓN: Sincroniza régimen y RESETEA todos los inputs al cambiar
   */
  useEffect(() => {
    setSelectedRegime(initialRegime);
    
    // Limpiar resultados
    setShowResults(false);
    setResult(null);
    
    // ✅ NUEVO: Resetear TODOS los inputs al cambiar de régimen
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
    
    console.log('🔄 Régimen cambiado a:', initialRegime, '- Todos los inputs reseteados');
  }, [initialRegime]);

  /**
   * Maneja cambios en campos de RESICO
   */
  const handleResicoChange = (field: keyof typeof resicoData, text: string) => {
    const formatted = formatCurrencyInput(text);
    
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
    const formatted = formatCurrencyInput(text);
    
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
    const formatted = formatCurrencyInput(text);
    
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
    console.log('=== CALCULANDO ISR ===');
    console.log('Régimen seleccionado:', selectedRegime);
    console.log('Mes seleccionado:', selectedMonth);

    // Limpiar resultado anterior antes de calcular
    setShowResults(false);
    setResult(null);

    let calculationResult: AdvancedCalculationResult;

    if (selectedRegime === 'RESICO') {
      console.log('Datos RESICO (raw):', resicoData);
      
      const data: ResicoAdvancedData = {
        totalIncome: parseCurrency(resicoData.totalIncome),
        withheldISR: parseCurrency(resicoData.withheldISR),
        provisionalPayments: parseCurrency(resicoData.provisionalPayments),
        withheldIVA: parseCurrency(resicoData.withheldIVA),
      };
      
      console.log('Datos RESICO (parseados):', data);
      calculationResult = calculateAdvancedResico(data, resicoPeriod);
      console.log('Resultado RESICO:', calculationResult);
      
    } else if (selectedRegime === 'EMPRESARIAL') {
      console.log('Datos EMPRESARIAL (raw):', empresarialData);
      
      const data: EmpresarialAdvancedData = {
        totalIncome: parseCurrency(empresarialData.totalIncome),
        totalDeductions: parseCurrency(empresarialData.totalDeductions),
        provisionalPayments: parseCurrency(empresarialData.provisionalPayments),
        withheldISR: parseCurrency(empresarialData.withheldISR),
      };
      
      console.log('Datos EMPRESARIAL (parseados):', data);
      
      // Pasar el mes seleccionado al cálculo
      const monthForCalc = empresarialPeriod === 'anual' ? 12 : selectedMonth + 1;
      console.log('Mes para cálculo:', monthForCalc);
      
      calculationResult = calculateAdvancedEmpresarial(data, monthForCalc);
      console.log('Resultado EMPRESARIAL:', calculationResult);
      
    } else if (selectedRegime === 'MORAL') {
      console.log('Datos MORAL (raw):', moralData);
      
      const data: MoralAdvancedData = {
        totalIncome: parseCurrency(moralData.totalIncome),
        totalDeductions: parseCurrency(moralData.totalDeductions),
        previousLosses: parseCurrency(moralData.previousLosses),
        provisionalPayments: parseCurrency(moralData.provisionalPayments),
        withheldISR: parseCurrency(moralData.withheldISR),
      };
      
      console.log('Datos MORAL (parseados):', data);
      calculationResult = calculateAdvancedMoral(data);
      console.log('Resultado MORAL:', calculationResult);
      
    } else {
      // Para TABLES no hay cálculo
      console.log('Régimen TABLES - sin cálculo');
      return;
    }

    console.log('=== RESULTADO FINAL ===');
    console.log(calculationResult);

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
    setSelectedMonth(11);
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
    empresarialPeriod,
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleMonthChange,
    handleResicoPeriodChange,
    handleEmpresarialPeriodChange,
    calculateISR,
    reset,
    getTotals,
  };
};