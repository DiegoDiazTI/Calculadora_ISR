// constants/taxTables/2026.ts
// Tabla fiscal del ejercicio 2026.
//
// Fuente primaria: Anexo 8 de la Resolución Miscelánea Fiscal 2026, publicado
// en el Diario Oficial de la Federación el 28 de diciembre de 2025.
// https://www.sat.gob.mx/minisitio/NormatividadRMFyRGCE/documentos2026/rmf/anexos/Anexo-8-RMF-2026_DOF-28122025.pdf
//
// - Actividad Empresarial: tabla "VI. Tarifa del mes de enero de 2026...
//   artículo 106 de la Ley del ISR" (Título IV, Cap. II, Sección I) — subió
//   por el factor de actualización 1.1321 respecto a 2025.
// - RESICO: sin cambios respecto a 2025. Los tramos del Art. 113-E de la
//   LISR no se indexan por inflación como la tarifa progresiva — no aparecen
//   en el Anexo 8, y varias fuentes (El Contribuyente, ContadorMx) confirman
//   "sin cambios en las tasas de RESICO para 2026".
// - Persona Moral: 30% fijo (Art. 9 LISR), sin cambios.

import { FiscalYearTaxTables } from './types';

export const TAX_TABLES_2026: FiscalYearTaxTables = {
  year: 2026,

  // RESICO 2026 - MENSUAL (idéntica a 2025, ver nota de fuente arriba)
  resicoMensual: [
    { min: 0.01, max: 25000.00, rate: 0.01 },         // 1.00%
    { min: 25000.01, max: 50000.00, rate: 0.011 },    // 1.10%
    { min: 50000.01, max: 83333.33, rate: 0.015 },    // 1.50%
    { min: 83333.34, max: 208333.33, rate: 0.02 },    // 2.00%
    { min: 208333.34, max: 3500000.00, rate: 0.025 }, // 2.50%
  ],

  // RESICO 2026 - ANUAL (idéntica a 2025)
  resicoAnual: [
    { min: 0.01, max: 300000.00, rate: 0.01 },        // 1.00%
    { min: 300000.01, max: 600000.00, rate: 0.011 },  // 1.10%
    { min: 600000.01, max: 1000000.00, rate: 0.015 }, // 1.50%
    { min: 1000000.01, max: 2000000.00, rate: 0.02 }, // 2.00%
    { min: 2000000.01, max: 3500000.00, rate: 0.025 },// 2.50%
  ],

  resicoMaxIncome: 3500000,

  // Tabla mensual base para Actividad Empresarial (Mes 1), Anexo 8 RMF 2026.
  // Se multiplica por el número de mes para obtener la tabla acumulada.
  actividadEmpresarialMensual: [
    { min: 0.01, max: 844.59, fixedFee: 0.00, rate: 0.0192 },
    { min: 844.60, max: 7168.51, fixedFee: 16.22, rate: 0.064 },
    { min: 7168.52, max: 12598.02, fixedFee: 420.95, rate: 0.1088 },
    { min: 12598.03, max: 14644.64, fixedFee: 1011.68, rate: 0.16 },
    { min: 14644.65, max: 17533.64, fixedFee: 1339.14, rate: 0.1792 },
    { min: 17533.65, max: 35362.83, fixedFee: 1856.84, rate: 0.2136 },
    { min: 35362.84, max: 55736.68, fixedFee: 5665.16, rate: 0.2352 },
    { min: 55736.69, max: 106410.50, fixedFee: 10457.09, rate: 0.30 },
    { min: 106410.51, max: 141880.66, fixedFee: 25659.23, rate: 0.32 },
    { min: 141880.67, max: 425641.99, fixedFee: 37009.69, rate: 0.34 },
    { min: 425642.00, max: 999999999.99, fixedFee: 133488.54, rate: 0.35 },
  ],

  // Régimen General - Tasa fija sobre utilidad fiscal (sin cambios)
  personaMoralRate: 0.30,

  characteristics: {
    resico: [
      'Ingresos máximos: $3,500,000 anuales',
      'Tasas reducidas del 1% al 2.5%',
      'Cálculo directo sobre ingresos',
      'No hay deducciones personales',
    ],
    actividadEmpresarial: [
      'Para personas físicas con actividad empresarial',
      'Permite deducciones autorizadas',
      'Tasas progresivas del 1.92% al 35%',
      'Cálculo sobre base gravable',
    ],
    personaMoral: [
      'Tasa general del 30% sobre utilidad fiscal',
      'Aplica para empresas y sociedades',
      'Permite deducciones autorizadas',
      'Régimen general del SAT',
    ],
  },
};
