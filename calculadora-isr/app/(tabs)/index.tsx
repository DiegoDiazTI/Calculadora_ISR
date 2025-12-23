// app/(tabs)/index.tsx - CORREGIDO: Padding inferior aumentado

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Platform, View, StatusBar, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ResultsCard } from '@/components/calculator/ResultsCard';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import { PeriodSelector } from '@/components/calculator/PeriodSelector';
import { AllTaxTables } from '@/components/calculator/AllTaxTables';
import { useTheme } from '@/hooks/useTheme';
import { useCalculator } from '@/hooks/useCalculator';
import { useAppContext } from '@/contexts/AppContext';
import { REGIMES } from '@/constants/Regimes';

const HEADER_BG = '#000000';

export default function Index() {
  const navigation = useNavigation();
  
  const { selectedRegime, setSelectedRegime, isDarkMode, theme, toggleTheme } = useAppContext();
  
  const [localResicoPeriod, setLocalResicoPeriod] = useState<'mensual' | 'anual'>('anual');
  
  const {
    annualIncome,
    deductions,
    utilityCoefficient,
    resicoPeriod,
    showResults,
    result,
    handleIncomeChange,
    handleDeductionsChange,
    handleCoefficientChange,
    handleResicoPeriodChange,
    calculateISR,
    reset,
    getTaxableBase,
  } = useCalculator(selectedRegime, localResicoPeriod);
  
  useEffect(() => {
    if (resicoPeriod !== localResicoPeriod) {
      setLocalResicoPeriod(resicoPeriod);
    }
  }, [resicoPeriod]);

  useEffect(() => {
    const baseTabBarStyle = {
      backgroundColor: theme.cardBackground,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      paddingBottom: Platform.OS === 'ios' ? 20 : 5,
      paddingTop: 5,
      height: Platform.OS === 'ios' ? 85 : 60,
    };

    const activeColor = isDarkMode ? '#FFFFFF' : theme.accent;
    const inactiveColor = isDarkMode ? '#E2E8F0' : theme.textSecondary;

    navigation.setOptions({
      tabBarStyle: baseTabBarStyle,
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
    });
  }, [navigation, theme, isDarkMode]);

  const currentRegime = REGIMES.find((r) => r.id === selectedRegime);
  const isTableView = selectedRegime === 'TABLES';
  const isEmpresarial = selectedRegime === 'EMPRESARIAL';
  const isMoral = selectedRegime === 'MORAL';
  const isResico = selectedRegime === 'RESICO';
  const taxableBase = getTaxableBase();

  const utilidadFiscal = isMoral && parseFloat(annualIncome.replace(/,/g, '')) > 0 && parseFloat(utilityCoefficient) > 0
    ? parseFloat(annualIncome.replace(/,/g, '')) * parseFloat(utilityCoefficient)
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: HEADER_BG }]}>
      <StatusBar barStyle={theme.statusBar as any} backgroundColor={HEADER_BG} />
      <View style={[styles.page, { backgroundColor: theme.background }]}>
        <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraHeight={120}
          extraScrollHeight={120}
          keyboardOpeningTime={0}
        >
          <RegimeSelector
            selectedRegime={selectedRegime}
            onSelectRegime={setSelectedRegime}
            theme={theme}
          />

          {isTableView ? (
            <AllTaxTables theme={theme} />
          ) : (
            <>
              {currentRegime && (
                <CharacteristicsCard
                  title={`Características de ${currentRegime.title}`}
                  characteristics={currentRegime.characteristics}
                  theme={theme}
                />
              )}

              {isResico && (
                <PeriodSelector
                  selectedPeriod={resicoPeriod}
                  onSelectPeriod={handleResicoPeriodChange}
                  theme={theme}
                />
              )}

              {isMoral && (
                <>
                  <View style={[styles.infoCard, { backgroundColor: theme.detailCard }]}>
                    <View style={styles.infoHeader}>
                      <MaterialCommunityIcons name="percent" size={18} color={theme.accentLight} />
                      <Text style={[styles.infoTitle, { color: theme.text }]}>
                        Coeficiente de Utilidad
                      </Text>
                    </View>
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                      Es el resultado de dividir la utilidad fiscal entre los ingresos nominales del ejercicio inmediato anterior. 
                      Se usa para calcular la utilidad fiscal estimada del año actual.
                    </Text>
                  </View>

                  <Input
                    label="Coeficiente de Utilidad (del año anterior)"
                    prefix=""
                    value={utilityCoefficient}
                    onChangeText={handleCoefficientChange}
                    keyboardType="decimal-pad"
                    placeholder="0.2360"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  {parseFloat(utilityCoefficient) > 0 && (
                    <View style={[styles.coefficientPreview, { backgroundColor: theme.cardBackground, borderColor: theme.accentLight }]}>
                      <Text style={[styles.coefficientPreviewLabel, { color: theme.textSecondary }]}>
                        Coeficiente:
                      </Text>
                      <Text style={[styles.coefficientPreviewValue, { color: theme.accentLight }]}>
                        {(parseFloat(utilityCoefficient) * 100).toFixed(2)}%
                      </Text>
                    </View>
                  )}
                </>
              )}

              <Input
                label={
                  isEmpresarial 
                    ? "Ingresos Acumulables" 
                    : isMoral
                    ? "Ingresos Nominales Anuales"
                    : isResico
                    ? (resicoPeriod === 'mensual' ? "Ingresos Mensuales" : "Ingresos Anuales")
                    : "Utilidad Fiscal"
                }
                prefix="$"
                value={annualIncome}
                onChangeText={handleIncomeChange}
                keyboardType="numeric"
                placeholder="0"
                backgroundColor={theme.inputBg}
                borderColor={theme.inputBorder}
                textColor={theme.text}
                labelColor={theme.text}
                prefixColor={theme.textSecondary}
                selectionColor={theme.accentLight}
              />

              {isMoral && utilidadFiscal > 0 && (
                <View style={[styles.previewCard, { backgroundColor: theme.cardBackground, borderColor: theme.accentLight }]}>
                  <View style={styles.previewHeader}>
                    <MaterialCommunityIcons name="calculator" size={18} color={theme.accentLight} />
                    <Text style={[styles.previewTitle, { color: theme.text }]}>
                      Cálculo de Utilidad Fiscal
                    </Text>
                  </View>
                  
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Ingresos nominales:</Text>
                    <Text style={[styles.previewValue, { color: theme.text }]}>
                      ${parseFloat(annualIncome.replace(/,/g, '')).toLocaleString('en-US')}
                    </Text>
                  </View>
                  
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>× Coeficiente:</Text>
                    <Text style={[styles.previewValue, { color: theme.text }]}>
                      {(parseFloat(utilityCoefficient) * 100).toFixed(2)}%
                    </Text>
                  </View>
                  
                  <View style={[styles.previewDivider, { borderTopColor: theme.border }]} />
                  
                  <View style={styles.previewRow}>
                    <Text style={[styles.previewLabel, { color: theme.text, fontWeight: 'bold' }]}>
                      = Utilidad fiscal:
                    </Text>
                    <Text style={[styles.previewValue, { color: theme.accentLight, fontWeight: 'bold' }]}>
                      ${utilidadFiscal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                  
                  <Text style={[styles.previewNote, { color: theme.textTertiary }]}>
                    El ISR (30%) se calculará sobre esta utilidad fiscal
                  </Text>
                </View>
              )}

              {isEmpresarial && (
                <>
                  <Input
                    label="Deducciones Autorizadas Totales"
                    prefix="$"
                    value={deductions}
                    onChangeText={handleDeductionsChange}
                    keyboardType="numeric"
                    placeholder="0"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <View style={[styles.infoCard, { backgroundColor: theme.detailCard }]}>
                    <View style={styles.infoHeader}>
                      <MaterialCommunityIcons name="information" size={20} color={theme.accentLight} />
                      <Text style={[styles.infoTitle, { color: theme.text }]}>
                        ¿Qué incluir en deducciones?
                      </Text>
                    </View>
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                      Suma todas tus deducciones autorizadas del año:{'\n'}
                      • Compras y costos de ventas{'\n'}
                      • Gastos de operación{'\n'}
                      • Sueldos y salarios{'\n'}
                      • Rentas del local{'\n'}
                      • Depreciaciones{'\n'}
                      • Intereses pagados{'\n'}
                      • Otros gastos deducibles
                    </Text>
                  </View>

                  {parseFloat(annualIncome.replace(/,/g, '')) > 0 && (
                    <View style={[styles.previewCard, { backgroundColor: theme.cardBackground, borderColor: theme.accentLight }]}>
                      <View style={styles.previewHeader}>
                        <MaterialCommunityIcons name="calculator" size={18} color={theme.accentLight} />
                        <Text style={[styles.previewTitle, { color: theme.text }]}>
                          Cálculo de Base Gravable
                        </Text>
                      </View>
                      
                      <View style={styles.previewRow}>
                        <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Ingresos:</Text>
                        <Text style={[styles.previewValue, { color: theme.text }]}>
                          ${parseFloat(annualIncome.replace(/,/g, '')).toLocaleString('en-US')}
                        </Text>
                      </View>
                      
                      <View style={styles.previewRow}>
                        <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>- Deducciones:</Text>
                        <Text style={[styles.previewValue, { color: '#EF4444' }]}>
                          ${parseFloat(deductions.replace(/,/g, '') || '0').toLocaleString('en-US')}
                        </Text>
                      </View>
                      
                      <View style={[styles.previewDivider, { borderTopColor: theme.border }]} />
                      
                      <View style={styles.previewRow}>
                        <Text style={[styles.previewLabel, { color: theme.text, fontWeight: 'bold' }]}>
                          = Base gravable:
                        </Text>
                        <Text style={[styles.previewValue, { color: theme.accentLight, fontWeight: 'bold' }]}>
                          ${taxableBase.toLocaleString('en-US')}
                        </Text>
                      </View>
                      
                      <Text style={[styles.previewNote, { color: theme.textTertiary }]}>
                        El ISR se calculará sobre esta cantidad
                      </Text>
                    </View>
                  )}
                </>
              )}

              <Button
                title="Calcular ISR"
                icon="calculator"
                onPress={calculateISR}
                backgroundColor={theme.accent}
              />

              {showResults && result && (
                <>
                  <ResultsCard
                    result={result}
                    income={parseFloat(annualIncome.replace(/,/g, '')) || 0}
                    regime={selectedRegime}
                    theme={theme}
                  />
                </>
              )}
            </>
          )}
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 100, // ⚠️ AUMENTADO de 24 a 100 para asegurar scroll completo
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  coefficientPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 2,
  },
  coefficientPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  coefficientPreviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: { fontSize: 14 },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewDivider: {
    borderTopWidth: 1,
    marginVertical: 12,
  },
  previewNote: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});