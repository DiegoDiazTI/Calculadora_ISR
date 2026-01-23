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
   * ⚠️ CRÍTICO: Limpia resultados cuando cambia el régimen desde el contexto
   */
  useEffect(() => {
    setShowResults(false);
    setResult(null);
    
    // Resetear deducciones si no es empresarial
    if (initialRegime !== 'EMPRESARIAL') {
      setDeductions('');
    }
    
  }, [initialRegime]);

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
   * ⚠️ CRÍTICO: Calcula el ISR según el régimen ACTUAL (initialRegime)
   */
  const calculateISR = () => {
    console.log('==========================================');
    console.log('🔍 DIAGNÓSTICO DE CÁLCULO ISR');
    console.log('==========================================');
    console.log('📱 Plataforma:', Platform.OS, 'v' + Platform.Version);
    console.log('📊 Régimen seleccionado:', initialRegime);
    console.log('💰 Ingreso RAW:', annualIncome);
    console.log('📉 Deducciones RAW:', deductions);
    console.log('🔢 Coeficiente:', utilityCoefficient);
    console.log('📅 Periodo RESICO:', resicoPeriod);
    
    const income = parseCurrency(annualIncome);
    const deduct = parseCurrency(deductions);
    
    console.log('✅ Ingreso PARSEADO:', income);
    console.log('✅ Deducciones PARSEADAS:', deduct);

    let calculationResult: CalculationResult;

    if (initialRegime === 'RESICO') {
      console.log('🟢 Calculando RESICO...');
      calculationResult = calculateResicoISR(income, resicoPeriod);
      console.log('🟢 Resultado RESICO:', calculationResult);
    } else if (initialRegime === 'MORAL') {
      console.log('🟣 Calculando MORAL...');
      const coefficient = parseFloat(utilityCoefficient || '0');
      const utilidadFiscal = income * coefficient;
      console.log('   Utilidad fiscal:', utilidadFiscal);
      
      calculationResult = calculateMoralISR(utilidadFiscal);
      console.log('🟣 Resultado MORAL:', calculationResult);
    } else if (initialRegime === 'EMPRESARIAL') {
      console.log('🟡 Calculando EMPRESARIAL...');
      const taxableBase = income - deduct;
      console.log('   Base gravable:', taxableBase);
      
      if (taxableBase <= 0) {
        console.log('⚠️ Base gravable negativa o cero');
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
      console.log('🟡 Resultado EMPRESARIAL:', calculationResult);
    } else {
      console.log('⚪ Régimen no reconocido, resultado vacío');
      calculationResult = {
        tax: 0,
        rate: 0,
        bracket: 'N/A',
        netIncome: 0,
      };
    }

    console.log('📋 RESULTADO FINAL:');
    console.log('    ISR:', calculationResult.tax);
    console.log('    Tasa:', calculationResult.rate);
    console.log('    Tramo:', calculationResult.bracket);
    console.log('    Neto:', calculationResult.netIncome);
    
    console.log('🔄 Actualizando estado: showResults = TRUE');
    setResult(calculationResult);
    setShowResults(true);
    console.log('✅ Estado actualizado');
    console.log('==========================================');
  };

  /**
   * Resetea la calculadora
   */
  const reset = () => {
    setAnnualIncome('');
    setDeductions('');
    setUtilityCoefficient('');
    setSelectedMonth(11);
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

// Import Platform para logs
import { Platform } from 'react-native';