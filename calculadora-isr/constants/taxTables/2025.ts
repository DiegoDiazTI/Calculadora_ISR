// constants/taxTables/2025.ts
// Tabla fiscal del ejercicio 2025. Valores tomados de las tarifas publicadas
// por el SAT/DOF para RESICO, Actividad Empresarial y Persona Moral.
//
// RESICO: tabla mensual = Art. 113-E LISR, tabla anual = Art. 113-F LISR.
// El tramo anual de 2.00% termina en $2,500,000.00 (verificado contra el
// texto vigente de la ley en https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf
// — corregido después de que un valor de $2,000,000.00, propagado desde
// varios resúmenes de terceros, se coló aquí originalmente).
//
// Para agregar el año 2026 (o el que siga): copia este archivo a 2026.ts,
// actualiza `year` y los valores, y regístralo en ./index.ts. Ver README.md
// de esta carpeta para el procedimiento completo.

import { FiscalYearTaxTables } from './types';

export const TAX_TABLES_2025: FiscalYearTaxTables = {
  year: 2025,

  // Tabla de tasas RESICO 2025 - MENSUAL
  resicoMensual: [
    { min: 0.01, max: 25000.00, rate: 0.01 },         // 1.00%
    { min: 25000.01, max: 50000.00, rate: 0.011 },    // 1.10%
    { min: 50000.01, max: 83333.33, rate: 0.015 },    // 1.50%
    { min: 83333.34, max: 208333.33, rate: 0.02 },    // 2.00%
    { min: 208333.34, max: 3500000.00, rate: 0.025 }, // 2.50%
  ],

  // Tabla de tasas RESICO 2025 - ANUAL
  resicoAnual: [
    { min: 0.01, max: 300000.00, rate: 0.01 },        // 1.00%
    { min: 300000.01, max: 600000.00, rate: 0.011 },  // 1.10%
    { min: 600000.01, max: 1000000.00, rate: 0.015 }, // 1.50%
    { min: 1000000.01, max: 2500000.00, rate: 0.02 }, // 2.00%
    { min: 2500000.01, max: 3500000.00, rate: 0.025 },// 2.50%
  ],

  resicoMaxIncome: 3500000,

  // Tabla mensual base para Actividad Empresarial (Mes 1).
  // Se multiplica por el número de mes para obtener la tabla acumulada.
  actividadEmpresarialMensual: [
    { min: 0.01, max: 746.04, fixedFee: 0.00, rate: 0.0192 },
    { min: 746.05, max: 6332.05, fixedFee: 14.32, rate: 0.064 },
    { min: 6332.06, max: 11128.01, fixedFee: 371.83, rate: 0.1088 },
    { min: 11128.02, max: 12935.82, fixedFee: 893.63, rate: 0.16 },
    { min: 12935.83, max: 15487.71, fixedFee: 1182.88, rate: 0.1792 },
    { min: 15487.72, max: 31236.49, fixedFee: 1640.18, rate: 0.2136 },
    { min: 31236.50, max: 49233.00, fixedFee: 5004.12, rate: 0.2352 },
    { min: 49233.01, max: 93993.90, fixedFee: 9236.89, rate: 0.30 },
    { min: 93993.91, max: 125325.20, fixedFee: 22665.17, rate: 0.32 },
    { min: 125325.21, max: 375975.61, fixedFee: 32691.18, rate: 0.34 },
    { min: 375975.62, max: 999999999.99, fixedFee: 117912.32, rate: 0.35 },
  ],

  // Régimen General - Tasa fija sobre utilidad fiscal
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
