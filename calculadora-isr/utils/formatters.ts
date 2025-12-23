// utils/formatters.ts - VERSIÓN CORREGIDA
// Funciones para formatear datos con mejor manejo de errores

/**
 * Valida y limpia un valor antes de formatear
 */
const validateValue = (value: any): number => {
  // Si es string, intentar convertir
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return isFinite(num) ? num : 0;
  }
  
  // Si es número, validar que sea finito
  if (typeof value === 'number') {
    return isFinite(value) ? value : 0;
  }
  
  return 0;
};

/**
 * Formatea un número como moneda mexicana
 * @param value - Número a formatear
 * @param includeSymbol - Si debe incluir el símbolo $
 * @returns String formateado como moneda
 */
export const formatCurrency = (value: number, includeSymbol: boolean = false): string => {
  const validValue = validateValue(value);
  
  try {
    // Usar formato manual más confiable
    const parts = Math.abs(validValue).toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = `${integerPart}.${parts[1]}`;
    
    return includeSymbol ? `$${formatted}` : formatted;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return includeSymbol ? '$0.00' : '0.00';
  }
};

/**
 * Formatea un string de input a formato de moneda
 * @param value - String con el valor
 * @returns String formateado con comas
 */
export const formatCurrencyInput = (value: string): string => {
  try {
    // Limpiar el string
    const cleaned = value.replace(/[^0-9]/g, '');
    
    if (!cleaned || cleaned === '0') {
      return '0';
    }
    
    // Convertir a número
    const number = parseInt(cleaned, 10);
    
    if (!isFinite(number)) {
      return '0';
    }
    
    // Formatear con comas manualmente
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Error formatting input:', error);
    return '0';
  }
};

/**
 * Limpia un string de formato de moneda y retorna el número
 * @param value - String formateado
 * @returns Número limpio
 */
export const parseCurrency = (value: string | number): number => {
  try {
    // Si ya es número, validar y retornar
    if (typeof value === 'number') {
      return isFinite(value) ? value : 0;
    }
    
    // Si es string, limpiar y convertir
    const cleaned = value.replace(/[$,\s]/g, '');
    const number = parseFloat(cleaned);
    
    return isFinite(number) ? number : 0;
  } catch (error) {
    console.error('Error parsing currency:', error);
    return 0;
  }
};

/**
 * Formatea un porcentaje
 * @param value - Valor decimal (0.15 = 15%)
 * @param decimals - Cantidad de decimales
 * @returns String con porcentaje formateado
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  try {
    const validValue = validateValue(value);
    const percentage = (validValue * 100).toFixed(decimals);
    return `${percentage}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0%';
  }
};

/**
 * Formatea una fecha
 * @param date - Fecha a formatear
 * @returns String con fecha formateada
 */
export const formatDate = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
};

/**
 * Formatea una fecha corta
 * @param date - Fecha a formatear
 * @returns String con fecha corta formateada
 */
export const formatDateShort = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toString();
  }
};

/**
 * Abrevia números grandes
 * @param value - Número a abreviar
 * @returns String abreviado (ej: 1.5M, 250K)
 */
export const abbreviateNumber = (value: number): string => {
  try {
    const validValue = validateValue(value);
    
    if (validValue >= 1000000) {
      return `${(validValue / 1000000).toFixed(1)}M`;
    }
    if (validValue >= 1000) {
      return `${(validValue / 1000).toFixed(1)}K`;
    }
    return validValue.toString();
  } catch (error) {
    console.error('Error abbreviating number:', error);
    return '0';
  }
};

/**
 * Formatea número para display seguro
 * @param value - Valor a formatear
 * @returns String seguro para display
 */
export const safeNumberFormat = (value: any): string => {
  try {
    const validValue = validateValue(value);
    
    // Formato manual sin locale
    return validValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Error in safe number format:', error);
    return '0.00';
  }
};