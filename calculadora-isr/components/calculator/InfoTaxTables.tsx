// components/calculator/InfoTaxTables.tsx
// CORREGIDO: Imports y tipos correctos

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors, RegimeType } from '@/types';
import { 
  RESICO_TAX_TABLE_2025, // MENSUAL
  RESICO_TAX_TABLE_ANUAL_2025, // ANUAL
  ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025,
  PERSONA_MORAL_RATE 
} from '@/constants/TaxTables';

interface InfoTaxTablesProps {
  regime: RegimeType;
  period?: 'mensual' | 'anual';
  theme: ThemeColors;
}

export const InfoTaxTables: React.FC<InfoTaxTablesProps> = ({
  regime,
  period = 'anual',
  theme,
}) => {
  if (regime === 'TABLES') return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="table" size={20} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>
          Tabla de Referencia
        </Text>
      </View>

      {/* RESICO */}
      {regime === 'RESICO' && (
        <>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tabla {period === 'mensual' ? 'Mensual' : 'Anual'} RESICO 2025
          </Text>
          
          <View style={styles.tableHeader}>
            <View style={styles.colHeader}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                LÍMITE INFERIOR
              </Text>
            </View>
            <View style={styles.colHeader}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                LÍMITE SUPERIOR
              </Text>
            </View>
            <View style={styles.colHeaderSmall}>
              <Text style={[styles.headerText, { color: theme.textTertiary }]}>
                TASA
              </Text>
            </View>
          </View>

          {(period === 'mensual' ? RESICO_TAX_TABLE_2025 : RESICO_TAX_TABLE_ANUAL_2025).map((bracket, index) => (
            <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
              <View style={styles.colData}>
                <Text style={[styles.dataText, { color: theme.text }]}>
                  ${bracket.min.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.colData}>
                <Text style={[styles.dataText, { color: theme.text }]}>
                  ${bracket.max === 3500000 ? '3,500,000.00' : bracket.max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.colDataSmall}>
                <Text style={[styles.rateText, { color: theme.accentLight }]}>
                  {(bracket.rate * 100).toFixed(2)}%
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* ACTIVIDAD EMPRESARIAL */}
      {regime === 'EMPRESARIAL' && (
        <>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tabla Anual - Actividad Empresarial 2025
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.tableHeader}>
                <View style={styles.colHeaderEmp}>
                  <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                    LÍMITE INF.
                  </Text>
                </View>
                <View style={styles.colHeaderEmp}>
                  <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                    LÍMITE SUP.
                  </Text>
                </View>
                <View style={styles.colHeaderEmp}>
                  <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                    CUOTA FIJA
                  </Text>
                </View>
                <View style={styles.colHeaderSmall}>
                  <Text style={[styles.headerTextSmall, { color: theme.textTertiary }]}>
                    TASA
                  </Text>
                </View>
              </View>

              {ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025.slice(0, 5).map((bracket, index) => {
                const annualBracket = {
                  min: bracket.min * 12,
                  max: bracket.max === 999999999.99 ? bracket.max : bracket.max * 12,
                  fixedFee: bracket.fixedFee * 12,
                  rate: bracket.rate
                };
                
                return (
                  <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                    <View style={styles.colDataEmp}>
                      <Text style={[styles.dataTextSmall, { color: theme.text }]} numberOfLines={1}>
                        ${annualBracket.min.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </Text>
                    </View>
                    <View style={styles.colDataEmp}>
                      <Text style={[styles.dataTextSmall, { color: theme.text }]} numberOfLines={1}>
                        {annualBracket.max === 999999999.99 
                          ? 'En adelante' 
                          : `$${annualBracket.max.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                        }
                      </Text>
                    </View>
                    <View style={styles.colDataEmp}>
                      <Text style={[styles.dataTextSmall, { color: theme.text }]} numberOfLines={1}>
                        ${annualBracket.fixedFee.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                    <View style={styles.colDataSmall}>
                      <Text style={[styles.rateText, { color: theme.accentLight }]}>
                        {(annualBracket.rate * 100).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          
          <Text style={[styles.note, { color: theme.textTertiary }]}>
            Mostrando primeros 5 tramos. Ver tabla completa en "Tablas ISR"
          </Text>
        </>
      )}

      {/* PERSONA MORAL */}
      {regime === 'MORAL' && (
        <>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tasa General - Persona Moral 2025
          </Text>
          
          <View style={[styles.moralCard, { backgroundColor: theme.accent }]}>
            <Text style={styles.moralLabel}>TASA ÚNICA</Text>
            <Text style={styles.moralRate}>{(PERSONA_MORAL_RATE * 100)}%</Text>
            <Text style={styles.moralNote}>
              Sobre utilidad fiscal después de deducciones
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  colHeader: {
    flex: 1,
    paddingHorizontal: 4,
  },
  colHeaderSmall: {
    width: 70,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  colHeaderEmp: {
    width: 100,
    paddingHorizontal: 4,
  },
  colData: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  colDataSmall: {
    width: 70,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colDataEmp: {
    width: 100,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerTextSmall: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  dataText: {
    fontSize: 12,
    textAlign: 'center',
  },
  dataTextSmall: {
    fontSize: 10,
    textAlign: 'center',
  },
  rateText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  note: {
    fontSize: 11,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  moralCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  moralLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  moralRate: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  moralNote: {
    fontSize: 11,
    color: '#D1FAE5',
    textAlign: 'center',
  },
});