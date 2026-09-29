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
export const formatCurrencyInput = (value: string, decimals: number = 2): string => {
  try {
    // Limpiar el string (permitir punto decimal)
    const cleaned = value.replace(/[^0-9.]/g, '');

    if (!cleaned) {
      return '';
    }

    const dotIndex = cleaned.indexOf('.');
    let integerPart = cleaned;
    let decimalPart = '';

    if (dotIndex !== -1) {
      integerPart = cleaned.slice(0, dotIndex);
      decimalPart = cleaned.slice(dotIndex + 1).replace(/\./g, '');
    }

    const normalizedInt = integerPart.replace(/^0+(?=\d)/, '');
    const formattedInt = (normalizedInt || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (dotIndex !== -1) {
      const trimmedDecimal = decimals >= 0 ? decimalPart.slice(0, decimals) : decimalPart;
      return `${formattedInt}.${trimmedDecimal}`;
    }

    return formattedInt;
  } catch (error) {
    console.error('Error formatting input:', error);
    return '';
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

/**
 * Formatea el límite INFERIOR de un tramo fiscal para mostrarlo en una tabla
 * de consulta: redondea hacia ARRIBA al peso entero (ej. 300000.01 -> "$300,001").
 *
 * El valor real usado para calcular el ISR sigue siendo el centavo exacto
 * (ej. 300000.01) — esto es solo para que la tabla se vea legible sin que el
 * límite inferior de un tramo se vea igual al límite superior del anterior.
 * @param min - Límite inferior real del tramo (normalmente termina en .01)
 */
export const formatBracketLowerBound = (min: number): string => {
  try {
    const validMin = validateValue(min);
    return `$${Math.ceil(validMin).toLocaleString('en-US')}`;
  } catch (error) {
    console.error('Error formatting bracket lower bound:', error);
    return '$0';
  }
};

/**
 * Formatea el límite SUPERIOR de un tramo fiscal, redondeando hacia ABAJO al
 * peso entero. Si `max` coincide con `openEndedValue` (el centinela que usan
 * las tablas para "sin límite", ej. 999999999.99 en Actividad Empresarial),
 * regresa `openEndedLabel` en vez de un número.
 *
 * OJO: RESICO no usa ese centinela — su último tramo tiene un tope real
 * ($3,500,000), así que ahí sí debe mostrarse el número, no "En adelante".
 * @param max - Límite superior real del tramo
 */
export const formatBracketUpperBound = (
  max: number,
  openEndedValue: number = 999999999.99,
  openEndedLabel: string = 'En adelante'
): string => {
  try {
    if (max === openEndedValue) {
      return openEndedLabel;
    }
    const validMax = validateValue(max);
    return `$${Math.floor(validMax).toLocaleString('en-US')}`;
  } catch (error) {
    console.error('Error formatting bracket upper bound:', error);
    return '$0';
  }
};
