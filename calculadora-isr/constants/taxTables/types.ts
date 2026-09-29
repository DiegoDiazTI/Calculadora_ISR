// constants/taxTables/types.ts
// Forma que debe tener la tabla fiscal de un año. Cualquier archivo de año
// (2025.ts, 2026.ts, ...) debe exportar un objeto que cumpla FiscalYearTaxTables.

import { TaxBracket } from '@/types';

/** Tramo con cuota fija (usado por Actividad Empresarial: cuota fija + % sobre excedente) */
export interface TaxBracketWithQuota extends TaxBracket {
  fixedFee: number;
}

export interface FiscalYearCharacteristics {
  resico: string[];
  actividadEmpresarial: string[];
  personaMoral: string[];
}

/**
 * Todas las tarifas/tablas de ISR vigentes para un año fiscal.
 * Se valida con `validateFiscalYearTable` al registrarse (ver ./index.ts).
 */
export interface FiscalYearTaxTables {
  /** Año fiscal al que aplica esta tabla, ej. 2025 */
  year: number;

  /** Tabla RESICO usada cuando el periodo de cálculo es "mensual" */
  resicoMensual: TaxBracket[];
  /** Tabla RESICO usada cuando el periodo de cálculo es "anual" */
  resicoAnual: TaxBracket[];
  /** Ingreso anual máximo para poder tributar en RESICO */
  resicoMaxIncome: number;

  /** Tabla base (mes 1) de Actividad Empresarial; se multiplica por el mes en tiempo de cálculo */
  actividadEmpresarialMensual: TaxBracketWithQuota[];

  /** Tasa fija de ISR para Personas Morales (0-1, ej. 0.30 = 30%) */
  personaMoralRate: number;

  characteristics: FiscalYearCharacteristics;
}
