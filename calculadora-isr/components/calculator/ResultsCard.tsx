// components/calculator/ResultsCard.tsx
// Tarjeta con los resultados del cálculo de ISR

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CalculationResult, ThemeColors, RegimeType } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ResultsCardProps {
  result: CalculationResult;
  income: number;
  regime: RegimeType;
  theme: ThemeColors;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
  income,
  regime,
  theme,
}) => {
  const taxPercentage = income > 0 ? (result.tax / income) * 100 : 0;
  const netPercentage = income > 0 ? (result.netIncome / income) * 100 : 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground, borderLeftColor: theme.accentLight },
      ]}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="chart-line" size={24} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>Resultado del Cálculo</Text>
      </View>

      {/* ISR Principal */}
      <View style={[styles.mainCard, { backgroundColor: theme.resultCard }]}>
        <Text style={[styles.mainLabel, { color: theme.characteristicsText }]}>
          ISR a Pagar
        </Text>
        <Text style={styles.mainValue}>${formatCurrency(result.tax)}</Text>
      </View>

      {/* Detalles */}
      <View style={styles.detailsContainer}>
        <View style={[styles.detailCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="percent" size={20} color={theme.textSecondary} />
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Tasa</Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {result.rate.toFixed(2)}%
          </Text>
        </View>

        <View style={[styles.detailCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="wallet" size={20} color={theme.textSecondary} />
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            {regime === 'RESICO' ? 'Ingreso Neto' : 'Utilidad Neta'}
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            ${formatCurrency(result.netIncome)}
          </Text>
        </View>
      </View>

      {/* Tramo */}
      <View style={[styles.row, { borderTopColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {regime === 'RESICO' ? 'Tramo aplicado:' : 'Régimen:'}
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>{result.bracket}</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.breakdown}>
        <View style={[styles.bar, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.barFilled,
              {
                width: `${taxPercentage}%`,
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
    borderLeftWidth: 4,
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
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  mainLabel: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '600',
  },
  mainValue: {
    fontSize: 32,
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
  },
  detailLabel: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
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
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
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