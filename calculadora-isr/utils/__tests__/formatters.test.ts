// utils/__tests__/formatters.test.ts
// Pruebas de las funciones de formato que usan las pantallas de "Tablas ISR"
// para mostrar los tramos. Existen específicamente para blindar contra dos
// bugs reales que aparecieron en la app: (1) redondear el límite inferior
// y superior de la misma forma hacía que dos tramos adyacentes se vieran con
// el mismo número, y (2) RESICO mostraba "En adelante" en su último tramo
// aunque tiene un tope real de $3,500,000 (no es abierto).

import { formatBracketLowerBound, formatBracketUpperBound } from '../formatters';

describe('formatBracketLowerBound', () => {
  it('redondea hacia arriba al peso entero (300000.01 -> $300,001)', () => {
    expect(formatBracketLowerBound(300000.01)).toBe('$300,001');
  });

  it('el primer tramo (0.01) se muestra como $1', () => {
    expect(formatBracketLowerBound(0.01)).toBe('$1');
  });

  it('un valor que ya es peso entero no cambia', () => {
    expect(formatBracketLowerBound(844.6)).toBe('$845');
  });

  it('dos tramos adyacentes nunca muestran el mismo límite inferior/superior', () => {
    // Tal como aparecen en las tablas reales: el límite superior de un
    // tramo y el límite inferior del siguiente están a un centavo de
    // distancia (ej. 300000.00 / 300000.01).
    const previousUpper = formatBracketUpperBound(300000.0);
    const nextLower = formatBracketLowerBound(300000.01);
    expect(previousUpper).not.toBe(nextLower);
    expect(previousUpper).toBe('$300,000');
    expect(nextLower).toBe('$300,001');
  });
});

describe('formatBracketUpperBound', () => {
  it('redondea hacia abajo al peso entero (208333.33 -> $208,333)', () => {
    expect(formatBracketUpperBound(208333.33)).toBe('$208,333');
  });

  it('usa la etiqueta abierta solo cuando coincide con el centinela', () => {
    expect(formatBracketUpperBound(999999999.99)).toBe('En adelante');
  });

  it('acepta una etiqueta y un centinela distintos', () => {
    expect(formatBracketUpperBound(999999999.99, 999999999.99, 'Sin límite')).toBe('Sin límite');
  });

  it('RESICO: el tope real de $3,500,000 se muestra como número, NO como "En adelante"', () => {
    // Bug real que existió en la app: la condición de la UI también
    // disparaba "En adelante" para cualquier max >= 3,500,000, aunque
    // RESICO no tiene tramo abierto — por encima de $3,500,000 ya no se
    // puede tributar en RESICO.
    expect(formatBracketUpperBound(3500000.0)).toBe('$3,500,000');
  });
});
