// utils/__tests__/calculations.boundaries.test.ts
// Pruebas ancla: verifican que el ISR calculado en los límites exactos de
// cada tramo (donde un dedazo al capturar la tabla se nota más) coincide con
// el resultado oficial. Cada caso fija explícitamente el año fiscal (tercer
// argumento) para que no se rompa cuando CURRENT_TAX_YEAR avance a un año
// nuevo — al agregar un año, agrega aquí 2-4 casos equivalentes para ese año
// (ver README.md de constants/taxTables).

import {
  calculateResicoISR,
  calculateMoralISR,
  calculateActividadEmpresarialISR,
} from '../calculations';
import { CURRENT_TAX_YEAR } from '@/constants/taxTables';

describe('RESICO 2025/2026 - mensual (sin cambios entre años)', () => {
  it.each([2025, 2026])('%i: $25,000.00 cae en el tramo de 1% (límite superior del tramo 1)', (year) => {
    const result = calculateResicoISR(25000.00, 'mensual', year);
    expect(result.rate).toBeCloseTo(1, 5);
    expect(result.tax).toBeCloseTo(250.0, 2);
  });

  it.each([2025, 2026])('%i: $25,000.01 ya cae en el tramo de 1.1% (un centavo más)', (year) => {
    const result = calculateResicoISR(25000.01, 'mensual', year);
    expect(result.rate).toBeCloseTo(1.1, 5);
    expect(result.tax).toBeCloseTo(275.0, 2);
  });

  it.each([2025, 2026])('%i: ingresos que exceden el techo de la tabla (>$3,500,000) usan la tasa máxima sobre el total', (year) => {
    const result = calculateResicoISR(4000000, 'mensual', year);
    expect(result.rate).toBeCloseTo(2.5, 5);
    expect(result.tax).toBeCloseTo(100000, 2);
  });
});

describe('RESICO 2025/2026 - anual (sin cambios entre años)', () => {
  it.each([2025, 2026])('%i: $300,000.00 cae en el tramo de 1%', (year) => {
    const result = calculateResicoISR(300000.00, 'anual', year);
    expect(result.rate).toBeCloseTo(1, 5);
    expect(result.tax).toBeCloseTo(3000.0, 2);
  });

  it.each([2025, 2026])('%i: $300,000.01 ya cae en el tramo de 1.1%', (year) => {
    const result = calculateResicoISR(300000.01, 'anual', year);
    expect(result.rate).toBeCloseTo(1.1, 5);
    expect(result.tax).toBeCloseTo(3300.0, 2);
  });

  // Límite exacto $2,500,000.00 / $2,500,000.01 (Art. 113-F LISR). Un valor
  // de $2,000,000.00 se coló aquí originalmente (propagado desde resúmenes
  // de terceros) — verificado y corregido contra el texto oficial de la ley
  // en https://www.diputados.gob.mx/LeyesBiblio/pdf/LISR.pdf. Estos casos
  // existen para que ese error no se vuelva a colar.
  it.each([2025, 2026])('%i: $2,500,000.00 (tope del tramo de 2.00%) da ISR de $50,000', (year) => {
    const result = calculateResicoISR(2500000.00, 'anual', year);
    expect(result.rate).toBeCloseTo(2, 5);
    expect(result.tax).toBeCloseTo(50000.0, 2);
  });

  it.each([2025, 2026])('%i: $2,500,000.01 ya cae en el tramo de 2.50%', (year) => {
    const result = calculateResicoISR(2500000.01, 'anual', year);
    expect(result.rate).toBeCloseTo(2.5, 5);
    expect(result.tax).toBeCloseTo(62500.0, 2);
  });
});

describe('Actividad Empresarial 2025 (tabla base, mes 1)', () => {
  it('$746.04 (tope del tramo 1) da ISR ≈ $14.32', () => {
    const result = calculateActividadEmpresarialISR(746.04, 1, 2025);
    expect(result.tax).toBeCloseTo(14.32, 2);
  });

  it('$746.05 (piso del tramo 2) usa la cuota fija de $14.32 sin excedente', () => {
    const result = calculateActividadEmpresarialISR(746.05, 1, 2025);
    expect(result.tax).toBeCloseTo(14.32, 2);
  });

  it('$6,332.05 (tope del tramo 2) da ISR ≈ $371.82', () => {
    const result = calculateActividadEmpresarialISR(6332.05, 1, 2025);
    expect(result.tax).toBeCloseTo(371.82, 1);
  });

  it('$6,332.06 (piso del tramo 3) usa la cuota fija de $371.83', () => {
    const result = calculateActividadEmpresarialISR(6332.06, 1, 2025);
    expect(result.tax).toBeCloseTo(371.83, 2);
  });
});

describe('Actividad Empresarial 2026 (tabla base, mes 1) — Anexo 8 RMF 2026, DOF 28-dic-2025', () => {
  it('$844.59 (tope del tramo 1) da ISR ≈ $16.22', () => {
    const result = calculateActividadEmpresarialISR(844.59, 1, 2026);
    expect(result.tax).toBeCloseTo(16.22, 2);
  });

  it('$844.60 (piso del tramo 2) usa la cuota fija de $16.22 sin excedente', () => {
    const result = calculateActividadEmpresarialISR(844.60, 1, 2026);
    expect(result.tax).toBeCloseTo(16.22, 2);
  });

  // Límite exacto 17,533.64 / 17,533.65 — una fuente secundaria (no oficial)
  // que se consultó al capturar esta tabla lo tenía mal por un centavo
  // (17,533.63 / 17,533.64); estos dos casos fijan el valor correcto tal
  // como aparece en el PDF del DOF.
  it('$17,533.64 (tope del tramo 5) da ISR ≈ $1,856.85', () => {
    const result = calculateActividadEmpresarialISR(17533.64, 1, 2026);
    expect(result.tax).toBeCloseTo(1856.85, 1);
  });

  it('$17,533.65 (piso del tramo 6) usa la cuota fija de $1,856.84', () => {
    const result = calculateActividadEmpresarialISR(17533.65, 1, 2026);
    expect(result.tax).toBeCloseTo(1856.84, 2);
  });

  it('$425,642.00 (piso del último tramo) usa la cuota fija de $133,488.54', () => {
    const result = calculateActividadEmpresarialISR(425642.00, 1, 2026);
    expect(result.tax).toBeCloseTo(133488.54, 2);
    expect(result.rate).toBeCloseTo(35, 5);
  });
});

describe('Persona Moral 2025/2026', () => {
  it.each([2025, 2026])('%i: tasa fija del 30% sobre la utilidad fiscal', (year) => {
    const result = calculateMoralISR(100000, year);
    expect(result.rate).toBeCloseTo(30, 5);
    expect(result.tax).toBeCloseTo(30000, 2);
    expect(result.netIncome).toBeCloseTo(70000, 2);
  });
});

describe('Año fiscal vigente', () => {
  it('sin especificar año, las funciones usan CURRENT_TAX_YEAR', () => {
    const withDefault = calculateActividadEmpresarialISR(844.59, 1);
    const withExplicitCurrent = calculateActividadEmpresarialISR(844.59, 1, CURRENT_TAX_YEAR);
    expect(withDefault.tax).toBeCloseTo(withExplicitCurrent.tax, 6);
  });
});
