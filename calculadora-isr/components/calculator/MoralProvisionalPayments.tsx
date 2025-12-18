// components/calculator/MoralProvisionalPayments.tsx
// Tabla de pagos provisionales para Persona Moral

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';

interface PaymentData {
  month: number;
  accumulatedIncome: number;
  estimatedUtility: number;
  determinedISR: number;
  previousPayments: number;
  isrToPay: number;
}

interface MoralProvisionalPaymentsProps {
  payments: PaymentData[];
  coefficient: number;
  theme: ThemeColors;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MoralProvisionalPayments: React.FC<MoralProvisionalPaymentsProps> = ({
  payments,
  coefficient,
  theme,
}) => {
  const totalISR = payments[payments.length - 1]?.determinedISR || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-check" size={24} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>
          Pagos Provisionales Mensuales
        </Text>
      </View>

      {/* Info del coeficiente */}
      <View style={[styles.coefficientCard, { backgroundColor: theme.detailCard }]}>
        <View style={styles.coefficientRow}>
          <Text style={[styles.coefficientLabel, { color: theme.textSecondary }]}>
            Coeficiente de Utilidad:
          </Text>
          <Text style={[styles.coefficientValue, { color: theme.accentLight }]}>
            {(coefficient * 100).toFixed(2)}%
          </Text>
        </View>
        <Text style={[styles.coefficientNote, { color: theme.textTertiary }]}>
          Del ejercicio anterior
        </Text>
      </View>

      {/* Tabla de pagos */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header de tabla */}
          <View style={[styles.tableHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.colMonth}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>MES</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                INGRESOS{'\n'}ACUMULADOS
              </Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                UTILIDAD{'\n'}ESTIMADA
              </Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                ISR{'\n'}DETERMINADO
              </Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                PAGOS{'\n'}ANTERIORES
              </Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                ISR A{'\n'}PAGAR
              </Text>
            </View>
          </View>

          {/* Filas de datos */}
          {payments.map((payment, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                { 
                  backgroundColor: index === payments.length - 1 
                    ? theme.accentLight + '15' 
                    : 'transparent',
                  borderBottomColor: theme.border 
                }
              ]}
            >
              <View style={styles.colMonth}>
                <Text style={[styles.monthText, { color: theme.text }]}>
                  {MESES[payment.month - 1]}
                </Text>
                <Text style={[styles.monthNumber, { color: theme.textTertiary }]}>
                  M{payment.month}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.dataText, { color: theme.textSecondary }]}>
                  ${payment.accumulatedIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.dataText, { color: theme.text }]}>
                  ${payment.estimatedUtility.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.dataText, { color: theme.text }]}>
                  ${payment.determinedISR.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.dataText, { color: '#10B981' }]}>
                  ${payment.previousPayments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={[styles.highlightText, { color: theme.accentLight }]}>
                  ${payment.isrToPay.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Total */}
      <View style={[styles.totalCard, { backgroundColor: theme.accent }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>ISR Total Determinado:</Text>
          <Text style={styles.totalValue}>
            ${totalISR.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </Text>
        </View>
        <Text style={styles.totalNote}>
          Suma de todos los pagos provisionales del periodo
        </Text>
      </View>

      {/* Notas explicativas */}
      <View style={[styles.notesCard, { backgroundColor: theme.detailCard }]}>
        <Text style={[styles.notesTitle, { color: theme.text }]}>📋 Fórmula de cálculo:</Text>
        <Text style={[styles.notesText, { color: theme.textSecondary }]}>
          1. Utilidad estimada = Ingresos acumulados × Coeficiente{'\n'}
          2. ISR determinado = Utilidad estimada × 30%{'\n'}
          3. ISR a pagar = ISR determinado - Pagos anteriores
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
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
  coefficientCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coefficientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  coefficientLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  coefficientValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  coefficientNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  table: {
    minWidth: 800,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  colMonth: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  colAmount: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
  },
  monthNumber: {
    fontSize: 11,
    marginTop: 2,
  },
  dataText: {
    fontSize: 12,
    textAlign: 'center',
  },
  highlightText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalNote: {
    fontSize: 12,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  notesCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 12,
    lineHeight: 18,
  },
});