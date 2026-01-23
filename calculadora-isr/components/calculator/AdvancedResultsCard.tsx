// components/calculator/AdvancedResultsCard.tsx
// Tarjeta de resultados avanzados con desglose completo

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors, RegimeType } from '@/types';
import { AdvancedCalculationResult } from '@/utils/advancedCalculations';
import { formatCurrency } from '@/utils/formatters';

interface AdvancedResultsCardProps {
  result: AdvancedCalculationResult;
  regime: RegimeType;
  theme: ThemeColors;
}

export const AdvancedResultsCard: React.FC<AdvancedResultsCardProps> = ({
  result,
  regime,
  theme,
}) => {
  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.cardBackground, borderLeftColor: theme.accentLight }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="calculator-variant" size={24} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>Cálculo Detallado</Text>
      </View>

      {/* Desglose de Cálculo */}
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DESGLOSE DEL CÁLCULO
        </Text>

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
            Ingresos brutos
          </Text>
          <Text style={[styles.rowValue, { color: theme.text }]}>
            ${formatCurrency(result.grossIncome)}
          </Text>
        </View>

        {result.totalDeductions > 0 && (
          <>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
                - Deducciones autorizadas
              </Text>
              <Text style={[styles.rowValue, { color: '#EF4444' }]}>
                ${formatCurrency(result.totalDeductions)}
              </Text>
            </View>

            <View style={[styles.row, styles.resultRow]}>
              <Text style={[styles.rowLabel, { color: theme.text, fontWeight: 'bold' }]}>
                = Base gravable
              </Text>
              <Text style={[styles.rowValue, { color: theme.text, fontWeight: 'bold' }]}>
                ${formatCurrency(result.taxableBase)}
              </Text>
            </View>
          </>
        )}

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
            Tasa ISR ({result.rate}%)
          </Text>
          <Text style={[styles.rowValue, { color: theme.accentLight }]}>
            ${formatCurrency(result.grossISR)}
          </Text>
        </View>

        {result.withheldISR > 0 && (
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
              - ISR retenido
            </Text>
            <Text style={[styles.rowValue, { color: '#10B981' }]}>
              ${formatCurrency(result.withheldISR)}
            </Text>
          </View>
        )}

        {result.provisionalPayments > 0 && (
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
              - Pagos provisionales
            </Text>
            <Text style={[styles.rowValue, { color: '#10B981' }]}>
              ${formatCurrency(result.provisionalPayments)}
            </Text>
          </View>
        )}
      </View>

      {/* Resultado Final */}
      <View style={[
        styles.finalCard,
        { backgroundColor: result.isFavorBalance ? '#10B981' : theme.resultCard }
      ]}>
        <Text style={styles.finalLabel}>
          {result.isFavorBalance ? 'Saldo a Favor' : 'ISR a Pagar'}
        </Text>
        <Text style={styles.finalValue}>
          ${formatCurrency(result.finalISR)}
        </Text>
      </View>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="percent" size={18} color={theme.textSecondary} />
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Tasa efectiva</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            {result.grossIncome > 0
              ? `${((result.grossISR / result.grossIncome) * 100).toFixed(2)}%`
              : 'N/A'}
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.detailCard }]}>
          <MaterialCommunityIcons name="wallet" size={18} color={theme.textSecondary} />
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
            {regime === 'RESICO' ? 'Ingreso neto' : 'Utilidad neta'}
          </Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>
            ${formatCurrency(result.netIncome)}
          </Text>
        </View>
      </View>

      {/* Badge de saldo a favor */}
      {result.isFavorBalance && (
        <View style={[styles.badge, { backgroundColor: '#DCFCE7' }]}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
          <Text style={styles.badgeText}>
            Tienes saldo a favor. El SAT te debe devolver este monto.
          </Text>
        </View>
      )}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  rowLabel: {
    fontSize: 14,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  finalCard: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  finalLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  finalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    color: '#059669',
    marginLeft: 8,
    flex: 1,
  },
});

export default AdvancedResultsCard;
