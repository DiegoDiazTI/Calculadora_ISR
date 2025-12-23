// components/calculator/ResultsCard.tsx - VERSIÓN FINAL DE PRODUCCIÓN
// Sin banners de debug, pero con todas las correcciones

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CalculationResult, ThemeColors, RegimeType } from '@/types';

interface ResultsCardProps {
  result: CalculationResult;
  income: number;
  regime: RegimeType;
  theme: ThemeColors;
}

// Función helper para formatear números de forma segura
const superSafeFormat = (value: any): string => {
  try {
    if (value === null || value === undefined) return '0.00';
    
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    
    if (!isFinite(num) || isNaN(num)) return '0.00';
    
    const fixed = Math.abs(num).toFixed(2);
    const [integer, decimal] = fixed.split('.');
    const withCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return `${withCommas}.${decimal}`;
  } catch (error) {
    console.error('Error formatting:', error);
    return '0.00';
  }
};

export const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
  income,
  regime,
  theme,
}) => {
  if (!result) {
    return (
      <View style={styles.errorCard}>
        <Text style={styles.errorText}>Error: No hay resultado para mostrar</Text>
      </View>
    );
  }
  
  const validTax = isFinite(result.tax) && !isNaN(result.tax) ? result.tax : 0;
  const validNetIncome = isFinite(result.netIncome) && !isNaN(result.netIncome) ? result.netIncome : 0;
  const validRate = isFinite(result.rate) && !isNaN(result.rate) ? result.rate : 0;
  const validIncome = isFinite(income) && !isNaN(income) ? income : 0;
  
  const calculatePercent = (part: number, total: number): number => {
    if (total === 0) return 0;
    const result = (part / total) * 100;
    return isFinite(result) ? result : 0;
  };
  
  const taxPercentage = calculatePercent(validTax, validIncome);
  const netPercentage = calculatePercent(validNetIncome, validIncome);

  return (
    <View
      style={[
        styles.card,
        { 
          backgroundColor: theme.cardBackground,
          borderLeftColor: theme.accentLight,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons 
          name="chart-line" 
          size={24} 
          color={theme.accentLight} 
        />
        <Text style={[styles.title, { color: theme.text }]}>
          Resultado del Cálculo
        </Text>
      </View>

      {/* ISR Principal */}
      <View style={[styles.mainCard, { backgroundColor: theme.accent }]}>
        <Text style={styles.mainLabel}>
          ISR a Pagar
        </Text>
        <Text style={styles.mainValue}>
          ${superSafeFormat(validTax)}
        </Text>
      </View>

      {/* Detalles */}
      <View style={styles.detailsContainer}>
        <View style={[styles.detailCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="percent" size={20} color={theme.textSecondary} />
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Tasa
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {validRate.toFixed(2)}%
          </Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="wallet" size={20} color={theme.textSecondary} />
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            {regime === 'RESICO' ? 'Ingreso Neto' : 'Utilidad Neta'}
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            ${superSafeFormat(validNetIncome)}
          </Text>
        </View>
      </View>

      {/* Tramo */}
      <View style={[styles.row, { borderTopColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {regime === 'RESICO' ? 'Tramo aplicado:' : 'Régimen:'}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {result.bracket || 'N/A'}
        </Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.breakdown}>
        <View style={[styles.bar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.barFilled,
              {
                width: `${Math.min(100, Math.max(0, taxPercentage))}%`,
                backgroundColor: theme.accentLight,
              },
            ]}
          />
        </View>
        <View style={styles.labels}>
          <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
            ISR: {taxPercentage.toFixed(1)}%
          </Text>
          <Text style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
            Neto: {netPercentage.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    marginTop: 16,
    borderLeftWidth: 4,
    minHeight: 380,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorCard: {
    padding: 20,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    margin: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mainCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  mainLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mainValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    minHeight: 80,
  },
  detailLabel: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  breakdown: {
    marginTop: 8,
  },
  bar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  barFilled: {
    height: '100%',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 12,
  },
});