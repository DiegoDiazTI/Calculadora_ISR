// constants/taxTables/validate.ts
// Validación estructural de una tabla fiscal anual. Se corre automáticamente
// al registrar cada año en ./index.ts (falla el import si una tabla está mal
// capturada) y también se puede correr manualmente en tests.
//
// No valida que los NÚMEROS sean los correctos según el DOF/SAT (eso lo
// verificas tú al capturarlos, con ayuda de los tests de tramos límite en
// __tests__/). Lo que sí valida es que la tabla sea estructuralmente sana:
// sin huecos, sin traslapes, tasas crecientes, continuidad entre tramos, etc.
// La enorme mayoría de errores de captura (un dedazo, una coma de más, un
// tramo pegado mal) rompen alguna de estas invariantes.

import { TaxBracket } from '@/types';
import { FiscalYearTaxTables, TaxBracketWithQuota } from './types';

const CENT_TOLERANCE = 0.02; // tolerancia por redondeo a centavos

const validateSimpleBrackets = (brackets: TaxBracket[], label: string): string[] => {
  const errors: string[] = [];

  if (!brackets || brackets.length === 0) {
    return [`${label}: la tabla no tiene tramos`];
  }

  brackets.forEach((bracket, i) => {
    if (bracket.min < 0 || bracket.max < 0) {
      errors.push(`${label} tramo ${i}: min/max no puede ser negativo`);
    }
    if (bracket.max <= bracket.min) {
      errors.push(`${label} tramo ${i}: max (${bracket.max}) debe ser mayor que min (${bracket.min})`);
    }
    if (bracket.rate < 0 || bracket.rate > 1) {
      errors.push(`${label} tramo ${i}: rate (${bracket.rate}) debe estar entre 0 y 1`);
    }
    if (i > 0) {
      const prev = brackets[i - 1];
      if (bracket.min <= prev.max) {
        errors.push(`${label} tramo ${i}: se traslapa con el tramo anterior (min ${bracket.min} <= max previo ${prev.max})`);
      } else if (bracket.min - prev.max > CENT_TOLERANCE) {
        errors.push(`${label} tramo ${i}: hay un hueco entre el tramo anterior (max ${prev.max}) y este (min ${bracket.min})`);
      }
      if (bracket.rate < prev.rate) {
        errors.push(`${label} tramo ${i}: la tasa (${bracket.rate}) es menor que la del tramo anterior (${prev.rate}); las tarifas de ISR son progresivas`);
      }
    }
  });

  return errors;
};

const validateQuotaBrackets = (brackets: TaxBracketWithQuota[], label: string): string[] => {
  const errors = validateSimpleBrackets(brackets, label);

  brackets.forEach((bracket, i) => {
    if (bracket.fixedFee < 0) {
      errors.push(`${label} tramo ${i}: fixedFee no puede ser negativo`);
    }
    if (i > 0) {
      const prev = brackets[i - 1];
      if (bracket.fixedFee < prev.fixedFee) {
        errors.push(`${label} tramo ${i}: la cuota fija (${bracket.fixedFee}) es menor que la del tramo anterior (${prev.fixedFee})`);
      }

      // Continuidad: la cuota fija del tramo N debe ser aprox. el ISR que
      // resultaría de aplicar el tramo N-1 hasta su límite superior. En las
      // tablas oficiales del SAT esto siempre cuadra a centavos; si no
      // cuadra, casi siempre es un número mal transcrito.
      const expectedFixedFee = prev.fixedFee + (prev.max - prev.min) * prev.rate;
      if (Math.abs(expectedFixedFee - bracket.fixedFee) > CENT_TOLERANCE * 5) {
        errors.push(
          `${label} tramo ${i}: la cuota fija (${bracket.fixedFee}) no es continua con el tramo anterior ` +
          `(se esperaba ≈${expectedFixedFee.toFixed(2)}); revisa si algún número de este o el tramo previo está mal capturado`
        );
      }
    }
  });

  return errors;
};

export const validateFiscalYearTable = (table: FiscalYearTaxTables): string[] => {
  const errors: string[] = [];

  if (!Number.isInteger(table.year) || table.year < 2000 || table.year > 2100) {
    errors.push(`year (${table.year}) no parece un año fiscal válido`);
  }

  errors.push(...validateSimpleBrackets(table.resicoMensual, 'resicoMensual'));
  errors.push(...validateSimpleBrackets(table.resicoAnual, 'resicoAnual'));
  errors.push(...validateQuotaBrackets(table.actividadEmpresarialMensual, 'actividadEmpresarialMensual'));

  if (table.resicoMaxIncome <= 0) {
    errors.push(`resicoMaxIncome (${table.resicoMaxIncome}) debe ser mayor que 0`);
  }
  if (table.resicoAnual.length > 0) {
    const lastAnual = table.resicoAnual[table.resicoAnual.length - 1];
    if (Math.abs(lastAnual.max - table.resicoMaxIncome) > CENT_TOLERANCE) {
      errors.push(
        `resicoMaxIncome (${table.resicoMaxIncome}) no coincide con el máximo del último tramo de resicoAnual (${lastAnual.max})`
      );
    }
  }

  if (table.personaMoralRate <= 0 || table.personaMoralRate > 1) {
    errors.push(`personaMoralRate (${table.personaMoralRate}) debe estar entre 0 y 1`);
  }

  (['resico', 'actividadEmpresarial', 'personaMoral'] as const).forEach((key) => {
    if (!table.characteristics?.[key] || table.characteristics[key].length === 0) {
      errors.push(`characteristics.${key}: no puede estar vacío`);
    }
  });

  return errors;
};

/** Lanza si la tabla no es válida. Úsalo al registrar un año en ./index.ts. */
export const assertValidFiscalYearTable = (table: FiscalYearTaxTables): void => {
  const errors = validateFiscalYearTable(table);
  if (errors.length > 0) {
    throw new Error(
      `La tabla fiscal ${table.year} tiene ${errors.length} problema(s):\n- ${errors.join('\n- ')}`
    );
  }
};
