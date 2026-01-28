// app/(tabs)/advanced.tsx
// ✅ Swipe estable iOS usando SwipeTabsWrapper (PanResponder) -> NO cierra la app
// ✅ Banner "Modo Avanzado" SIN botón
// ✅ Swipe en TODA la pantalla: derecha => Simple (lo hace SwipeTabsWrapper)
// ✅ Mantiene tu UI intacta

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
  View,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAdvancedCalculator } from '@/hooks/useAdvancedCalculator';
import { useAppContext } from '@/contexts/AppContext';

import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import { MonthSelector } from '@/components/calculator/MonthSelector';
import { PeriodSelector } from '@/components/calculator/PeriodSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import AdvancedResultsCard from '@/components/calculator/AdvancedResultsCard';
import { AllTaxTables } from '@/components/calculator/AllTaxTables';

import { REGIMES } from '@/constants/Regimes';
import SwipeTabsWrapper from '@/components/navigation/SwipeTabsWrapper';

import {
  RESICO_TAX_TABLE_ANUAL_2025,
  RESICO_TAX_TABLE_2025,
  ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025,
  PERSONA_MORAL_RATE,
} from '@/constants/TaxTables';

const HEADER_BG = '#000000';

export default function Advanced() {
  const navigation = useNavigation();

  const { selectedRegime, setSelectedRegime, isDarkMode, theme, toggleTheme } = useAppContext();

  const [localResicoPeriod, setLocalResicoPeriod] = useState<'mensual' | 'anual'>('anual');

  const [showResicoTable, setShowResicoTable] = useState(false);
  const [showEmpresarialTable, setShowEmpresarialTable] = useState(false);
  const [showMoralTable, setShowMoralTable] = useState(false);

  const {
    showResults,
    result,
    resicoData,
    empresarialData,
    moralData,
    selectedMonth,
    resicoPeriod,
    empresarialPeriod,
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleMonthChange,
    handleResicoPeriodChange,
    handleEmpresarialPeriodChange,
    calculateISR,
    getTotals,
  } = useAdvancedCalculator(selectedRegime, localResicoPeriod);

  useEffect(() => {
    if (resicoPeriod !== localResicoPeriod) setLocalResicoPeriod(resicoPeriod);
  }, [resicoPeriod, localResicoPeriod]);

  const [fadeAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        backgroundColor: theme.cardBackground,
        borderTopColor: theme.border,
        borderTopWidth: 1,
        paddingBottom: Platform.OS === 'ios' ? 20 : 5,
        paddingTop: 5,
        height: Platform.OS === 'ios' ? 85 : 60,
      },
      tabBarActiveTintColor: isDarkMode ? '#FFFFFF' : theme.accent,
      tabBarInactiveTintColor: isDarkMode ? '#E2E8F0' : theme.textSecondary,
    });
  }, [navigation, theme, isDarkMode]);

  const currentRegime = REGIMES.find((r) => r.id === selectedRegime);
  const totals = getTotals();

  const resicoTableData =
    resicoPeriod === 'mensual' ? RESICO_TAX_TABLE_2025 : RESICO_TAX_TABLE_ANUAL_2025;

  const empresarialTableData = ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025.slice(0, 5).map((b) => ({
    min: b.min * 12,
    max: b.max === 999999999.99 ? b.max : b.max * 12,
    fixedFee: b.fixedFee * 12,
    rate: b.rate,
  }));

  return (
    <SwipeTabsWrapper>
      <SafeAreaView style={[styles.container, { backgroundColor: HEADER_BG }]}>
        <StatusBar barStyle={theme.statusBar as any} backgroundColor={HEADER_BG} />

        <View style={[styles.page, { backgroundColor: theme.background }]}>
          <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

          {/* ✅ ALERTA clara (SIN botón) */}
          <View
            style={[
              styles.advancedBanner,
              { backgroundColor: theme.accentBg + '20', borderColor: theme.accentLight },
            ]}
          >
            <View style={styles.bannerTopRow}>
              <View style={styles.bannerLeft}>
                <MaterialCommunityIcons name="shield-star" size={22} color={theme.accentLight} />
                <Text style={[styles.bannerTitle, { color: theme.accentLight }]}>Modo Avanzado</Text>
              </View>


            </View>

            <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
              Incluye deducciones, retenciones y pagos provisionales.
              {'\n'}
            </Text>
          </View>

          <KeyboardAwareScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
            enableAutomaticScroll
            extraHeight={150}
            extraScrollHeight={150}
            keyboardOpeningTime={0}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              <RegimeSelector selectedRegime={selectedRegime} onSelectRegime={setSelectedRegime} theme={theme} />

              {selectedRegime === 'TABLES' && <AllTaxTables theme={theme} />}

              {currentRegime && selectedRegime !== 'TABLES' && (
                <CharacteristicsCard
                  title={`Características de ${currentRegime.title}`}
                  characteristics={currentRegime.characteristics}
                  theme={theme}
                />
              )}

              {/* ========== RESICO ========== */}
              {selectedRegime === 'RESICO' && (
                <>
                  <PeriodSelector selectedPeriod={resicoPeriod} onSelectPeriod={handleResicoPeriodChange} theme={theme} />

                  <Input
                    label={resicoPeriod === 'mensual' ? 'Ingresos Mensuales' : 'Ingresos Totales Anuales'}
                    prefix="$"
                    value={resicoData.totalIncome || ''}
                    onChangeText={(t) => handleResicoChange('totalIncome', t)}
                    keyboardType="numeric"
                    placeholder="Ingrese los ingresos"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Retenciones y Pagos</Text>

                    <Input
                      label="ISR Retenido (1.25%)"
                      prefix="$"
                      value={resicoData.withheldISR || ''}
                      onChangeText={(t) => handleResicoChange('withheldISR', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese el ISR retenido"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />

                    <Input
                      label="Pagos Provisionales"
                      prefix="$"
                      value={resicoData.provisionalPayments || ''}
                      onChangeText={(t) => handleResicoChange('provisionalPayments', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese provisionales"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />
                  </View>
                </>
              )}

              {/* ========== ACTIVIDAD EMPRESARIAL ========== */}
              {selectedRegime === 'EMPRESARIAL' && (
                <>
                  <PeriodSelector
                    selectedPeriod={empresarialPeriod}
                    onSelectPeriod={handleEmpresarialPeriodChange}
                    theme={theme}
                  />

                  {empresarialPeriod === 'mensual' && (
                    <MonthSelector selectedMonth={selectedMonth} onSelectMonth={handleMonthChange} theme={theme} />
                  )}

                  <Input
                    label="Ingresos Acumulados"
                    prefix="$"
                    value={empresarialData.totalIncome || ''}
                    onChangeText={(t) => handleEmpresarialChange('totalIncome', t)}
                    keyboardType="numeric"
                    placeholder="Ingrese los ingresos acumulados"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <Input
                    label="Deducciones Autorizadas Totales"
                    prefix="$"
                    value={empresarialData.totalDeductions || ''}
                    onChangeText={(t) => handleEmpresarialChange('totalDeductions', t)}
                    keyboardType="numeric"
                    placeholder="Ingrese las deducciones"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Pagos y Retenciones</Text>

                    <Input
                      label="Pagos Provisionales"
                      prefix="$"
                      value={empresarialData.provisionalPayments || ''}
                      onChangeText={(t) => handleEmpresarialChange('provisionalPayments', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese provisionales"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />

                    <Input
                      label="ISR Retenido"
                      prefix="$"
                      value={empresarialData.withheldISR || ''}
                      onChangeText={(t) => handleEmpresarialChange('withheldISR', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese el ISR retenido"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />
                  </View>
                </>
              )}

              {/* ========== PERSONA MORAL ========== */}
              {selectedRegime === 'MORAL' && (
                <>
                  <Input
                    label="Ingresos Acumulables"
                    prefix="$"
                    value={moralData.totalIncome || ''}
                    onChangeText={(t) => handleMoralChange('totalIncome', t)}
                    keyboardType="numeric"
                    placeholder="Ingrese los ingresos"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <Input
                    label="Deducciones Autorizadas Totales"
                    prefix="$"
                    value={moralData.totalDeductions || ''}
                    onChangeText={(t) => handleMoralChange('totalDeductions', t)}
                    keyboardType="numeric"
                    placeholder="Ingrese deducciones autorizadas"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.text}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />

                  <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Otros Conceptos</Text>

                    <Input
                      label="Pérdidas Fiscales Años Anteriores"
                      prefix="$"
                      value={moralData.previousLosses || ''}
                      onChangeText={(t) => handleMoralChange('previousLosses', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese las pérdidas fiscales"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />

                    <Input
                      label="Pagos Provisionales"
                      prefix="$"
                      value={moralData.provisionalPayments || ''}
                      onChangeText={(t) => handleMoralChange('provisionalPayments', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese provisionales"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />

                    <Input
                      label="ISR Retenido"
                      prefix="$"
                      value={moralData.withheldISR || ''}
                      onChangeText={(t) => handleMoralChange('withheldISR', t)}
                      keyboardType="numeric"
                      placeholder="Ingrese el ISR retenido"
                      backgroundColor={theme.inputBg}
                      borderColor={theme.inputBorder}
                      textColor={theme.text}
                      labelColor={theme.textSecondary}
                      prefixColor={theme.textSecondary}
                      selectionColor={theme.accentLight}
                    />
                  </View>
                </>
              )}

              {selectedRegime !== 'TABLES' && (
                <Button
                  title="CALCULAR ISR DETALLADO"
                  icon="calculator-variant"
                  onPress={calculateISR}
                  backgroundColor={theme.accent}
                  style={styles.calculateButton}
                />
              )}

              {showResults && result && selectedRegime !== 'TABLES' && (
                <AdvancedResultsCard result={result} regime={selectedRegime} theme={theme} />
              )}
            </Animated.View>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </SwipeTabsWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1 },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  advancedBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerHint: {
    fontSize: 12,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  bannerSubtitle: {
    marginTop: 10,
    fontSize: 12.5,
    lineHeight: 18,
  },

  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },

  calculateButton: { marginBottom: 24, marginTop: 10 },
});
