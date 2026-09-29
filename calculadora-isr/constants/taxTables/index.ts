// constants/taxTables/index.ts
// Registro de tablas fiscales por año. Punto de entrada único para leer
// tarifas de ISR: `getTaxTables()` regresa el año vigente, `getTaxTables(2026)`
// un año específico (útil para declaraciones anuales de ejercicios pasados).
//
// Cómo agregar un año nuevo: ver README.md en esta carpeta.

import { FiscalYearTaxTables } from './types';
import { TAX_TABLES_2025 } from './2025';
import { TAX_TABLES_2026 } from './2026';
import { assertValidFiscalYearTable } from './validate';

const REGISTRY: Record<number, FiscalYearTaxTables> = {
  2025: TAX_TABLES_2025,
  2026: TAX_TABLES_2026,
};

// Valida cada tabla registrada en cuanto se importa este módulo. Si alguien
// capturó mal un número y rompió una invariante estructural, la app (o los
// tests, o el build) truenan aquí con un mensaje claro, en vez de calcular
// silenciosamente un ISR incorrecto en producción.
Object.values(REGISTRY).forEach(assertValidFiscalYearTable);

/** Años fiscales disponibles, ascendente. */
export const AVAILABLE_TAX_YEARS: number[] = Object.keys(REGISTRY)
  .map(Number)
  .sort((a, b) => a - b);

/** Año fiscal más reciente registrado; es el que se usa si no se especifica año. */
export const CURRENT_TAX_YEAR = AVAILABLE_TAX_YEARS[AVAILABLE_TAX_YEARS.length - 1];

/**
 * Regresa la tabla fiscal completa de un año. Sin argumento, regresa la del
 * año fiscal vigente (CURRENT_TAX_YEAR).
 */
export const getTaxTables = (year: number = CURRENT_TAX_YEAR): FiscalYearTaxTables => {
  const table = REGISTRY[year];
  if (!table) {
    throw new Error(
      `No hay tabla fiscal registrada para el año ${year}. Años disponibles: ${AVAILABLE_TAX_YEARS.join(', ')}`
    );
  }
  return table;
};

export * from './types';
export { validateFiscalYearTable, assertValidFiscalYearTable } from './validate';

// --- Accesos directos a la tabla del año fiscal VIGENTE ---
// Conveniencia para los lugares de la app que siempre quieren "la tabla de
// hoy" (la calculadora, las pantallas de consulta). Cuando se registre un año
// nuevo en REGISTRY y sea el más reciente, estos valores apuntan a él
// automáticamente — no hay que tocar ningún componente.
const current = getTaxTables();

export const RESICO_TAX_TABLE_MENSUAL = current.resicoMensual;
export const RESICO_TAX_TABLE_ANUAL = current.resicoAnual;
export const RESICO_MAX_INCOME = current.resicoMaxIncome;
export const ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL = current.actividadEmpresarialMensual;
export const PERSONA_MORAL_RATE = current.personaMoralRate;
export const RESICO_CHARACTERISTICS = current.characteristics.resico;
export const ACTIVIDAD_EMPRESARIAL_CHARACTERISTICS = current.characteristics.actividadEmpresarial;
export const PERSONA_MORAL_CHARACTERISTICS = current.characteristics.personaMoral;
