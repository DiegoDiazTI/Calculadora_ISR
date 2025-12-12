// hooks/useAdvancedCalculator.ts
// Custom hook para la calculadora avanzada

import { useState } from 'react';
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

export const useAdvancedCalculator = () => {
  const [selectedRegime, setSelectedRegime] = useState<RegimeType>('RESICO');
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<AdvancedCalculationResult | null>(null);

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
    purchases: '1,200,000',
    operatingExpenses: '400,000',
    salaries: '300,000',
    rent: '80,000',
    depreciation: '100,000',
    interest: '30,000',
    otherDeductions: '50,000',
    provisionalPayments: '0',
    withheldISR: '0',
  });

  // Estados para Persona Moral
  const [moralData, setMoralData] = useState({
    totalIncome: '5,000,000',
    purchases: '2,000,000',
    operatingExpenses: '800,000',
    salaries: '600,000',
    rent: '120,000',
    depreciation: '150,000',
    interest: '50,000',
    otherDeductions: '100,000',
    previousLosses: '0',
    ptu: '0',
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
    let calculationResult: AdvancedCalculationResult;

    if (selectedRegime === 'RESICO') {
      const data: ResicoAdvancedData = {
        totalIncome: parseCurrency(resicoData.totalIncome),
        withheldISR: parseCurrency(resicoData.withheldISR),
        provisionalPayments: parseCurrency(resicoData.provisionalPayments),
        withheldIVA: parseCurrency(resicoData.withheldIVA),
      };
      calculationResult = calculateAdvancedResico(data);
    } else if (selectedRegime === 'EMPRESARIAL') {
      const data: EmpresarialAdvancedData = {
        totalIncome: parseCurrency(empresarialData.totalIncome),
        purchases: parseCurrency(empresarialData.purchases),
        operatingExpenses: parseCurrency(empresarialData.operatingExpenses),
        salaries: parseCurrency(empresarialData.salaries),
        rent: parseCurrency(empresarialData.rent),
        depreciation: parseCurrency(empresarialData.depreciation),
        interest: parseCurrency(empresarialData.interest),
        otherDeductions: parseCurrency(empresarialData.otherDeductions),
        provisionalPayments: parseCurrency(empresarialData.provisionalPayments),
        withheldISR: parseCurrency(empresarialData.withheldISR),
      };
      calculationResult = calculateAdvancedEmpresarial(data);
    } else if (selectedRegime === 'MORAL') {
      const data: MoralAdvancedData = {
        totalIncome: parseCurrency(moralData.totalIncome),
        purchases: parseCurrency(moralData.purchases),
        operatingExpenses: parseCurrency(moralData.operatingExpenses),
        salaries: parseCurrency(moralData.salaries),
        rent: parseCurrency(moralData.rent),
        depreciation: parseCurrency(moralData.depreciation),
        interest: parseCurrency(moralData.interest),
        otherDeductions: parseCurrency(moralData.otherDeductions),
        previousLosses: parseCurrency(moralData.previousLosses),
        ptu: parseCurrency(moralData.ptu),
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
      purchases: '',
      operatingExpenses: '',
      salaries: '',
      rent: '',
      depreciation: '',
      interest: '',
      otherDeductions: '',
      provisionalPayments: '',
      withheldISR: '',
    });
    setMoralData({
      totalIncome: '',
      purchases: '',
      operatingExpenses: '',
      salaries: '',
      rent: '',
      depreciation: '',
      interest: '',
      otherDeductions: '',
      previousLosses: '',
      ptu: '',
      provisionalPayments: '',
      withheldISR: '',
    });
    setShowResults(false);
    setResult(null);
  };

  /**
   * Calcula totales para vista previa
   */
  const getTotals = () => {
    if (selectedRegime === 'EMPRESARIAL') {
      const totalDeductions =
        parseCurrency(empresarialData.purchases) +
        parseCurrency(empresarialData.operatingExpenses) +
        parseCurrency(empresarialData.salaries) +
        parseCurrency(empresarialData.rent) +
        parseCurrency(empresarialData.depreciation) +
        parseCurrency(empresarialData.interest) +
        parseCurrency(empresarialData.otherDeductions);

      return {
        totalIncome: parseCurrency(empresarialData.totalIncome),
        totalDeductions,
        taxableBase: parseCurrency(empresarialData.totalIncome) - totalDeductions,
      };
    } else if (selectedRegime === 'MORAL') {
      const totalDeductions =
        parseCurrency(moralData.purchases) +
        parseCurrency(moralData.operatingExpenses) +
        parseCurrency(moralData.salaries) +
        parseCurrency(moralData.rent) +
        parseCurrency(moralData.depreciation) +
        parseCurrency(moralData.interest) +
        parseCurrency(moralData.otherDeductions) +
        parseCurrency(moralData.ptu);

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
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleRegimeChange,
    calculateISR,
    reset,
    getTotals,
  };
};