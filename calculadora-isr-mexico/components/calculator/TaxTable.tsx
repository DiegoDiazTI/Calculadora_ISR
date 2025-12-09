// components/calculator/TaxTable.tsx
// Tabla de tasas de ISR para RESICO

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeColors } from '@/types';
import { RESICO_TAX_TABLE_2025 } from '@/constants/TaxTables';

interface TaxTableProps {
  theme: ThemeColors;
}

const TaxTable: React.FC<TaxTableProps> = ({ theme }) => {
  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Tabla de Tasas RESICO</Text>
        <TouchableOpacity>
          <Text style={[styles.viewMore, { color: theme.accentLight }]}>Ver más</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerText, { color: theme.textTertiary }]}>
          INGRESOS ANUALES
        </Text>
        <Text style={[styles.headerText, { color: theme.textTertiary }]}>TASA ISR</Text>
      </View>

      {RESICO_TAX_TABLE_2025.map((bracket, index) => (
        <View key={index} style={styles.dataRow}>
          <Text style={[styles.dataText, { color: theme.textSecondary }]}>
            {bracket.min === 0 ? 'Hasta ' : `$${bracket.min.toLocaleString()} - `}
            ${bracket.max.toLocaleString()}
          </Text>
          <Text style={[styles.dataRate, { color: theme.accentLight }]}>
            {(bracket.rate * 100).toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewMore: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dataText: {
    fontSize: 13,
    flex: 1,
  },
  dataRate: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TaxTable;