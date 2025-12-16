// components/calculator/AllTaxTables.tsx
// Componente con todas las tablas de ISR (incluyendo 12 meses de Actividad Empresarial)

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';
import { RESICO_TAX_TABLE_2025, ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025, PERSONA_MORAL_RATE } from '@/constants/TaxTables';

interface AllTaxTablesProps {
  theme: ThemeColors;
}

type TableType = 'RESICO' | 'EMPRESARIAL' | 'MORAL';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const AllTaxTables: React.FC<AllTaxTablesProps> = ({ theme }) => {
  const [selectedTable, setSelectedTable] = useState<TableType>('RESICO');
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = enero

  // Generar tabla para un mes específico multiplicando los límites
  const getTablaParaMes = (mesNumero: number) => {
    return ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025.map(bracket => ({
      ...bracket,
      min: bracket.min * mesNumero,
      max: bracket.max === 999999999.99 ? 999999999.99 : bracket.max * mesNumero,
      fixedFee: bracket.fixedFee * mesNumero,
    }));
  };

  return (
    <View style={styles.container}>
      {/* Selector de tabla */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTable === 'RESICO' && { ...styles.tabActive, backgroundColor: theme.accent }
          ]}
          onPress={() => setSelectedTable('RESICO')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTable === 'RESICO' ? '#FFFFFF' : theme.textSecondary }
          ]}>
            RESICO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTable === 'EMPRESARIAL' && { ...styles.tabActive, backgroundColor: theme.accent }
          ]}
          onPress={() => setSelectedTable('EMPRESARIAL')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTable === 'EMPRESARIAL' ? '#FFFFFF' : theme.textSecondary }
          ]}>
            Empresarial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            selectedTable === 'MORAL' && { ...styles.tabActive, backgroundColor: theme.accent }
          ]}
          onPress={() => setSelectedTable('MORAL')}
        >
          <Text style={[
            styles.tabText,
            { color: selectedTable === 'MORAL' ? '#FFFFFF' : theme.textSecondary }
          ]}>
            Moral
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabla RESICO */}
      {selectedTable === 'RESICO' && (
        <View style={[styles.tableCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.tableHeader}>
            <MaterialCommunityIcons name="account" size={24} color={theme.accentLight} />
            <Text style={[styles.tableTitle, { color: theme.text }]}>
              Tabla RESICO 2025
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.detailCard }]}>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Régimen Simplificado de Confianza para Personas Físicas
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Tabla MENSUAL de tu consultoría{'\n'}
              • Límite: $3,500,000 anuales{'\n'}
              • Cálculo: Ingreso × Tasa directa{'\n'}
              • Sin deducciones personales
            </Text>
          </View>

          <View style={[styles.headerRow, { borderBottomColor: theme.border }]}>
            <Text style={[styles.headerText, { color: theme.textTertiary }]}>
              LÍMITE INFERIOR
            </Text>
            <Text style={[styles.headerText, { color: theme.textTertiary }]}>
              LÍMITE SUPERIOR
            </Text>
            <Text style={[styles.headerText, { color: theme.textTertiary }]}>
              TASA
            </Text>
          </View>

          {RESICO_TAX_TABLE_2025.map((bracket, index) => (
            <View key={index} style={styles.dataRow}>
              <Text style={[styles.dataText, { color: theme.textSecondary }]}>
                ${bracket.min.toLocaleString()}
              </Text>
              <Text style={[styles.dataText, { color: theme.textSecondary }]}>
                ${bracket.max.toLocaleString()}
              </Text>
              <Text style={[styles.dataRate, { color: theme.accentLight }]}>
                {(bracket.rate * 100).toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Tabla Actividad Empresarial */}
      {selectedTable === 'EMPRESARIAL' && (
        <ScrollView style={styles.scrollableTable}>
          <View style={[styles.tableCard, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.tableHeader}>
              <MaterialCommunityIcons name="briefcase" size={24} color={theme.accentLight} />
              <Text style={[styles.tableTitle, { color: theme.text }]}>
                Actividad Empresarial 2025
              </Text>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.detailCard }]}>
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Personas Físicas con Actividad Empresarial y Profesional
              </Text>
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                • Tablas acumulativas por mes{'\n'}
                • Cálculo: Cuota Fija + (Excedente × Tasa){'\n'}
                • Permite deducciones autorizadas{'\n'}
                • Sistema progresivo (1.92% - 35%)
              </Text>
            </View>

            {/* Selector de mes */}
            <View style={styles.monthSelectorContainer}>
              <Text style={[styles.monthSelectorLabel, { color: theme.text }]}>
                Selecciona el mes:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthScrollContent}
              >
                {MESES.map((mes, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthButton,
                      { backgroundColor: theme.detailCard },
                      selectedMonth === index && {
                        backgroundColor: theme.accent,
                        borderColor: theme.accent,
                      }
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text style={[
                      styles.monthButtonText,
                      { color: selectedMonth === index ? '#FFFFFF' : theme.textSecondary }
                    ]}>
                      {mes}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Título del mes seleccionado */}
            <View style={[styles.selectedMonthBanner, { backgroundColor: theme.accent }]}>
              <Text style={styles.selectedMonthText}>
                {MESES[selectedMonth]} (Mes {selectedMonth + 1})
              </Text>
            </View>

            {/* Encabezados de la tabla */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.tableCol1}>
                <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                  LÍMITE INF.
                </Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                  LÍMITE SUP.
                </Text>
              </View>
              <View style={styles.tableCol3}>
                <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                  CUOTA FIJA
                </Text>
              </View>
              <View style={styles.tableCol4}>
                <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                  TASA
                </Text>
              </View>
            </View>

            {/* Filas de datos */}
            {getTablaParaMes(selectedMonth + 1).map((bracket, index) => (
              <View key={index} style={[styles.tableDataRow, { borderBottomColor: theme.border }]}>
                <View style={styles.tableCol1}>
                  <Text style={[styles.dataTextSmall, { color: theme.textSecondary }]} numberOfLines={1}>
                    ${bracket.min.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Text>
                </View>
                <View style={styles.tableCol2}>
                  <Text style={[styles.dataTextSmall, { color: theme.textSecondary }]} numberOfLines={1}>
                    {bracket.max === 999999999.99 ? 'Adelante' : `$${bracket.max.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                  </Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text style={[styles.dataTextSmall, { color: theme.text }]} numberOfLines={1}>
                    ${bracket.fixedFee.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text style={[styles.dataRate, { color: theme.accentLight }]}>
                    {(bracket.rate * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tabla Persona Moral */}
      {selectedTable === 'MORAL' && (
        <View style={[styles.tableCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.tableHeader}>
            <MaterialCommunityIcons name="office-building" size={24} color={theme.accentLight} />
            <Text style={[styles.tableTitle, { color: theme.text }]}>
              Tabla Persona Moral 2025
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.detailCard }]}>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Régimen General para Personas Morales (Empresas)
            </Text>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              • Tasa fija del 30%{'\n'}
              • Cálculo: Utilidad Fiscal × 30%{'\n'}
              • Permite deducciones completas{'\n'}
              • Aplica para sociedades y corporaciones
            </Text>
          </View>

          <View style={[styles.moralRateCard, { backgroundColor: theme.accent }]}>
            <Text style={styles.moralRateLabel}>TASA GENERAL</Text>
            <Text style={styles.moralRateValue}>{(PERSONA_MORAL_RATE * 100)}%</Text>
            <Text style={styles.moralRateDescription}>
              Sobre utilidad fiscal después de deducciones
            </Text>
          </View>

          <View style={[styles.exampleCard, { backgroundColor: theme.detailCard }]}>
            <Text style={[styles.exampleTitle, { color: theme.text }]}>Ejemplo de Cálculo:</Text>
            <View style={styles.exampleRow}>
              <Text style={[styles.exampleLabel, { color: theme.textSecondary }]}>
                Ingresos acumulables:
              </Text>
              <Text style={[styles.exampleValue, { color: theme.text }]}>
                $5,000,000
              </Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={[styles.exampleLabel, { color: theme.textSecondary }]}>
                - Deducciones autorizadas:
              </Text>
              <Text style={[styles.exampleValue, { color: '#EF4444' }]}>
                $3,820,000
              </Text>
            </View>
            <View style={[styles.exampleRow, styles.exampleDivider, { borderTopColor: theme.border }]}>
              <Text style={[styles.exampleLabel, { color: theme.text, fontWeight: 'bold' }]}>
                = Utilidad fiscal:
              </Text>
              <Text style={[styles.exampleValue, { color: theme.text, fontWeight: 'bold' }]}>
                $1,180,000
              </Text>
            </View>
            <View style={styles.exampleRow}>
              <Text style={[styles.exampleLabel, { color: theme.textSecondary }]}>
                × Tasa (30%):
              </Text>
              <Text style={[styles.exampleValue, { color: theme.accentLight, fontWeight: 'bold' }]}>
                $354,000
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer informativo */}
      <View style={[styles.footer, { backgroundColor: theme.detailCard }]}>
        <MaterialCommunityIcons name="information-outline" size={16} color={theme.textSecondary} />
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Tablas vigentes para el ejercicio fiscal 2025. Consulta con tu contador para casos específicos.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  tabActive: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tableCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scrollableTable: {
    maxHeight: 600,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
  monthSelectorContainer: {
    marginBottom: 16,
  },
  monthSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  monthScrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  monthButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  selectedMonthBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedMonthText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 2,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  headerTextSmall: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
    marginBottom: 4,
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableCol1: {
    flex: 2.5,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  tableCol2: {
    flex: 2.5,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  tableCol3: {
    flex: 2.5,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  tableCol4: {
    flex: 1.5,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  dataText: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  dataTextSmall: {
    fontSize: 9,
    textAlign: 'center',
  },
  dataRate: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  moralRateCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
  },
  moralRateLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  moralRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  moralRateDescription: {
    fontSize: 12,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  exampleCard: {
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exampleDivider: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 8,
  },
  exampleLabel: {
    fontSize: 13,
  },
  exampleValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});