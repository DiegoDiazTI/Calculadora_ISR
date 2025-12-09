// utils/formatters.ts
// Funciones para formatear datos

/**
 * Formatea un número como moneda mexicana
 * @param value - Número a formatear
 * @param includeSymbol - Si debe incluir el símbolo $
 * @returns String formateado como moneda
 */
export const formatCurrency = (value: number, includeSymbol: boolean = false): string => {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return includeSymbol ? `$${formatted}` : formatted;
};

/**
 * Formatea un string de input a formato de moneda
 * @param value - String con el valor
 * @returns String formateado con comas
 */
export const formatCurrencyInput = (value: string): string => {
  const number = parseFloat(value.replace(/,/g, ''));
  return isNaN(number) ? '0' : number.toLocaleString('en-US');
};

/**
 * Limpia un string de formato de moneda y retorna el número
 * @param value - String formateado
 * @returns Número limpio
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[$,]/g, '');
  const number = parseFloat(cleaned);
  return isNaN(number) ? 0 : number;
};

/**
 * Formatea un porcentaje
 * @param value - Valor decimal (0.15 = 15%)
 * @param decimals - Cantidad de decimales
 * @returns String con porcentaje formateado
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formatea una fecha
 * @param date - Fecha a formatear
 * @returns String con fecha formateada
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Formatea una fecha corta
 * @param date - Fecha a formatear
 * @returns String con fecha corta formateada
 */
export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * Abrevia números grandes
 * @param value - Número a abreviar
 * @returns String abreviado (ej: 1.5M, 250K)
 */
export const abbreviateNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};