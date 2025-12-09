import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Index() {
  const [selectedRegime, setSelectedRegime] = useState('RESICO');
  const [annualIncome, setAnnualIncome] = useState('1,250,000');
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // ISR Tax Brackets for RESICO (2025) - Tasas directas sobre ingresos
  const resicoTaxTable = [
    { min: 0, max: 300000, rate: 0.01 },
    { min: 300001, max: 600000, rate: 0.0110 },
    { min: 600001, max: 1000000, rate: 0.0120 },
    { min: 1000001, max: 1500000, rate: 0.0150 },
    { min: 1500001, max: 2000000, rate: 0.0200 },
    { min: 2000001, max: 3500000, rate: 0.0250 },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/,/g, ''));
    return isNaN(number) ? '0' : number.toLocaleString('en-US');
  };

  const handleIncomeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned) {
      setAnnualIncome(formatCurrency(cleaned));
    } else {
      setAnnualIncome('');
    }
  };

  const calculateISR = () => {
    const income = parseFloat(annualIncome.replace(/,/g, ''));
    
    if (isNaN(income) || income <= 0) {
      return {
        tax: 0,
        rate: 0,
        bracket: 'N/A',
        netIncome: 0,
      };
    }

    // En RESICO 2025, el ISR se calcula aplicando directamente la tasa sobre el ingreso total
    for (let bracket of resicoTaxTable) {
      if (income >= bracket.min && income <= bracket.max) {
        const tax = income * bracket.rate;
        return {
          tax: tax,
          rate: bracket.rate * 100,
          bracket: `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
          netIncome: income - tax,
        };
      }
    }
    
    // Si excede el límite máximo del RESICO ($3,500,000)
    return {
      tax: 0,
      rate: 0,
      bracket: 'Excede límite RESICO',
      netIncome: income,
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const results = showResults ? calculateISR() : null;
  const income = parseFloat(annualIncome.replace(/,/g, '')) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="calculator" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Calculadora ISR</Text>
              <Text style={styles.subtitle}>Calcula tu impuesto según tu régimen fiscal</Text>
            </View>

            {/* Regime Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SELECCIONA TU RÉGIMEN</Text>
              
              <TouchableOpacity
                style={[
                  styles.regimeCard,
                  selectedRegime === 'RESICO' && styles.regimeCardSelected,
                ]}
                onPress={() => setSelectedRegime('RESICO')}
                activeOpacity={0.7}
              >
                <View style={styles.regimeIconContainer}>
                  <MaterialCommunityIcons name="account" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.regimeTextContainer}>
                  <Text style={styles.regimeTitle}>RESICO</Text>
                  <Text style={styles.regimeSubtitle}>Persona Física</Text>
                </View>
                {selectedRegime === 'RESICO' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#14B8A6" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.regimeCard}
                activeOpacity={0.5}
              >
                <View style={[styles.regimeIconContainer, styles.disabledIcon]}>
                  <MaterialCommunityIcons name="office-building" size={24} color="#6B7280" />
                </View>
                <View style={styles.regimeTextContainer}>
                  <Text style={[styles.regimeTitle, styles.regimeDisabled]}>Persona Moral</Text>
                  <Text style={[styles.regimeSubtitle, styles.regimeDisabled]}>Régimen General</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.regimeCard}
                activeOpacity={0.7}
              >
                <View style={[styles.regimeIconContainer, styles.redIcon]}>
                  <MaterialCommunityIcons name="table" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.regimeTextContainer}>
                  <Text style={styles.regimeTitle}>Tablas ISR</Text>
                  <Text style={styles.regimeSubtitle}>Consulta las tablas</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* RESICO Characteristics */}
            <View style={styles.characteristicsCard}>
              <Text style={styles.characteristicsTitle}>Características del RESICO</Text>
              <View style={styles.characteristicRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#D1FAE5" />
                <Text style={styles.characteristicsText}>Ingresos máximos: $3,500,000 anuales</Text>
              </View>
              <View style={styles.characteristicRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#D1FAE5" />
                <Text style={styles.characteristicsText}>Tasas reducidas del 1% al 2.5%</Text>
              </View>
              <View style={styles.characteristicRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#D1FAE5" />
                <Text style={styles.characteristicsText}>Cálculo directo sobre ingresos</Text>
              </View>
              <View style={styles.characteristicRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#D1FAE5" />
                <Text style={styles.characteristicsText}>No hay deducciones personales</Text>
              </View>
            </View>

            {/* Income Input */}
            <View style={styles.section}>
              <Text style={styles.inputLabel}>Ingresos Anuales</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.input}
                  value={annualIncome}
                  onChangeText={handleIncomeChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#6B7280"
                  selectionColor="#14B8A6"
                />
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity 
              style={styles.calculateButton} 
              onPress={handleCalculate}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="calculator" size={24} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.calculateButtonText}>CALCULAR ISR</Text>
            </TouchableOpacity>

            {/* Results */}
            {showResults && results && (
              <View style={styles.resultsCard}>
                <View style={styles.resultsHeader}>
                  <MaterialCommunityIcons name="chart-line" size={24} color="#14B8A6" />
                  <Text style={styles.resultsTitle}>Resultado del Cálculo</Text>
                </View>
                
                <View style={styles.resultMainCard}>
                  <Text style={styles.resultMainLabel}>ISR a Pagar</Text>
                  <Text style={styles.resultMainValue}>
                    ${results.tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                </View>

                <View style={styles.resultDetailsContainer}>
                  <View style={styles.resultDetailCard}>
                    <MaterialCommunityIcons name="percent" size={20} color="#94A3B8" />
                    <Text style={styles.resultDetailLabel}>Tasa</Text>
                    <Text style={styles.resultDetailValue}>{results.rate}%</Text>
                  </View>

                  <View style={styles.resultDetailCard}>
                    <MaterialCommunityIcons name="wallet" size={20} color="#94A3B8" />
                    <Text style={styles.resultDetailLabel}>Ingreso Neto</Text>
                    <Text style={styles.resultDetailValue}>
                      ${results.netIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                  </View>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Tramo aplicado:</Text>
                  <Text style={styles.resultValue}>{results.bracket}</Text>
                </View>

                {/* Visual Breakdown */}
                <View style={styles.breakdownContainer}>
                  <View style={styles.breakdownBar}>
                    <View 
                      style={[
                        styles.breakdownFilled,
                        { width: `${(results.tax / income) * 100}%` }
                      ]}
                    />
                  </View>
                  <View style={styles.breakdownLabels}>
                    <Text style={styles.breakdownLabel}>
                      ISR: {((results.tax / income) * 100).toFixed(1)}%
                    </Text>
                    <Text style={styles.breakdownLabel}>
                      Neto: {((results.netIncome / income) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tax Table */}
            <View style={styles.taxTableCard}>
              <View style={styles.taxTableHeader}>
                <Text style={styles.taxTableTitle}>Tabla de Tasas RESICO</Text>
                <TouchableOpacity>
                  <Text style={styles.viewMoreButton}>Ver más</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.taxTableRow}>
                <Text style={styles.taxTableHeaderText}>INGRESOS ANUALES</Text>
                <Text style={styles.taxTableHeaderText}>TASA ISR</Text>
              </View>

              {resicoTaxTable.map((bracket, index) => (
                <View key={index} style={styles.taxTableDataRow}>
                  <Text style={styles.taxTableData}>
                    {bracket.min === 0 ? 'Hasta ' : `$${bracket.min.toLocaleString()} - `}
                    ${bracket.max.toLocaleString()}
                  </Text>
                  <Text style={styles.taxTableDataRate}>{(bracket.rate * 100).toFixed(1)}%</Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomSpacer} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  regimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regimeCardSelected: {
    borderColor: '#0F766E',
    backgroundColor: '#1E293B',
  },
  regimeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disabledIcon: {
    backgroundColor: '#334155',
  },
  redIcon: {
    backgroundColor: '#991B1B',
  },
  regimeTextContainer: {
    flex: 1,
  },
  regimeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  regimeSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  regimeDisabled: {
    color: '#64748B',
  },
  characteristicsCard: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  characteristicsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  characteristicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  characteristicsText: {
    fontSize: 13,
    color: '#D1FAE5',
    marginLeft: 8,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#334155',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 12,
  },
  calculateButton: {
    flexDirection: 'row',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  resultsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  resultMainCard: {
    backgroundColor: '#0F766E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  resultMainLabel: {
    fontSize: 13,
    color: '#D1FAE5',
    marginBottom: 8,
    fontWeight: '600',
  },
  resultMainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultDetailCard: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  resultDetailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 4,
  },
  resultDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  resultLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  breakdownContainer: {
    marginTop: 8,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  breakdownFilled: {
    height: '100%',
    backgroundColor: '#14B8A6',
  },
  breakdownLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  taxTableCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  taxTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taxTableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewMoreButton: {
    fontSize: 13,
    color: '#14B8A6',
    fontWeight: '600',
  },
  taxTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  taxTableHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  taxTableDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  taxTableData: {
    fontSize: 13,
    color: '#CBD5E1',
    flex: 1,
  },
  taxTableDataRate: {
    fontSize: 13,
    color: '#14B8A6',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});