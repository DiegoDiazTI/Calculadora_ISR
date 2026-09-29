// constants/taxTables/__tests__/validate.test.ts
// Prueba el validador estructural en sí: que detecte huecos, traslapes,
// tasas no crecientes y cuotas fijas no continuas; y que las tablas reales
// registradas en la app sigan siendo válidas.

import { validateFiscalYearTable } from '../validate';
import { FiscalYearTaxTables } from '../types';
import { TAX_TABLES_2025 } from '../2025';
import { AVAILABLE_TAX_YEARS, getTaxTables } from '../index';

const baseValidTable = (): FiscalYearTaxTables => ({
  year: 2099,
  resicoMensual: [
    { min: 0.01, max: 100, rate: 0.01 },
    { min: 100.01, max: 200, rate: 0.02 },
  ],
  resicoAnual: [
    { min: 0.01, max: 1000, rate: 0.01 },
    { min: 1000.01, max: 2000, rate: 0.02 },
  ],
  resicoMaxIncome: 2000,
  actividadEmpresarialMensual: [
    { min: 0.01, max: 100, fixedFee: 0, rate: 0.1 },
    // continuidad: 0 + (100 - 0.01) * 0.1 = 9.999 ≈ 10.00
    { min: 100.01, max: 200, fixedFee: 10.0, rate: 0.2 },
  ],
  personaMoralRate: 0.3,
  characteristics: {
    resico: ['a'],
    actividadEmpresarial: ['b'],
    personaMoral: ['c'],
  },
});

describe('validateFiscalYearTable', () => {
  it('no reporta errores para una tabla bien formada', () => {
    expect(validateFiscalYearTable(baseValidTable())).toEqual([]);
  });

  it('detecta un hueco entre tramos', () => {
    const table = baseValidTable();
    table.resicoMensual = [
      { min: 0.01, max: 100, rate: 0.01 },
      { min: 150, max: 200, rate: 0.02 }, // hueco de 100 a 150
    ];
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('hueco'))).toBe(true);
  });

  it('detecta un traslape entre tramos', () => {
    const table = baseValidTable();
    table.resicoMensual = [
      { min: 0.01, max: 100, rate: 0.01 },
      { min: 50, max: 200, rate: 0.02 }, // se traslapa con el anterior
    ];
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('traslapa'))).toBe(true);
  });

  it('detecta una tasa que no es progresiva', () => {
    const table = baseValidTable();
    table.resicoMensual = [
      { min: 0.01, max: 100, rate: 0.05 },
      { min: 100.01, max: 200, rate: 0.02 }, // baja en vez de subir
    ];
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('menor que la del tramo anterior'))).toBe(true);
  });

  it('detecta una cuota fija no continua (típico error de captura)', () => {
    const table = baseValidTable();
    table.actividadEmpresarialMensual = [
      { min: 0.01, max: 100, fixedFee: 0, rate: 0.1 },
      { min: 100.01, max: 200, fixedFee: 500, rate: 0.2 }, // debería ser ≈10, no 500
    ];
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('no es continua'))).toBe(true);
  });

  it('detecta que resicoMaxIncome no coincide con el tope de resicoAnual', () => {
    const table = baseValidTable();
    table.resicoMaxIncome = 999;
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('resicoMaxIncome'))).toBe(true);
  });

  it('detecta un personaMoralRate fuera de rango', () => {
    const table = baseValidTable();
    table.personaMoralRate = 1.5;
    const errors = validateFiscalYearTable(table);
    expect(errors.some((e) => e.includes('personaMoralRate'))).toBe(true);
  });

  it('la tabla real de 2025 registrada en la app es válida', () => {
    expect(validateFiscalYearTable(TAX_TABLES_2025)).toEqual([]);
  });

  it('todos los años registrados en el índice son válidos', () => {
    AVAILABLE_TAX_YEARS.forEach((year) => {
      expect(validateFiscalYearTable(getTaxTables(year))).toEqual([]);
    });
  });
});
