// app/(tabs)/advanced.tsx
// ACTUALIZADO: Selector de mes para Actividad Empresarial

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
import { useTheme } from '@/hooks/useTheme';
import { useAdvancedCalculator } from '@/hooks/useAdvancedCalculator';
import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import { MonthSelector } from '@/components/calculator/MonthSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import AdvancedResultsCard from '@/components/calculator/AdvancedResultsCard';
import { REGIMES } from '@/constants/Regimes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HEADER_BG = '#000000';

export default function Advanced() {
  const navigation = useNavigation();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const {
    selectedRegime,
    showResults,
    result,
    resicoData,
    empresarialData,
    moralData,
    selectedMonth,
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleRegimeChange,
    handleMonthChange,
    calculateISR,
    getTotals,
  } = useAdvancedCalculator();

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
  const showCharacteristics = currentRegime && currentRegime.id !== 'TABLES';
  const totals = getTotals();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: HEADER_BG }]}>
      <StatusBar barStyle={theme.statusBar as any} backgroundColor={HEADER_BG} />
      
      <View style={[styles.page, { backgroundColor: theme.background }]}>
        <View style={styles.headerContainer}>
          <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        </View>

        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraHeight={150}
          extraScrollHeight={150}
          keyboardOpeningTime={0}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={[styles.infoBadge, { backgroundColor: theme.accentBg + '20', borderColor: theme.accentLight }]}>
              <MaterialCommunityIcons name="information" size={20} color={theme.accentLight} />
              <Text style={[styles.infoBadgeText, { color: theme.accentLight }]}>
                Calculadora Avanzada - Incluye deducciones, retenciones y pagos provisionales
              </Text>
            </View>

            <RegimeSelector
              selectedRegime={selectedRegime}
              onSelectRegime={handleRegimeChange}
              theme={theme}
            />

            {showCharacteristics && currentRegime && (
              <CharacteristicsCard
                title={
                  selectedRegime === 'RESICO'
                    ? 'Características del RESICO'
                    : selectedRegime === 'EMPRESARIAL'
                    ? 'Características de Actividad Empresarial'
                    : 'Características de Persona Moral'
                }
                characteristics={currentRegime.characteristics}
                theme={theme}
              />
            )}

            {/* RESICO */}
            {selectedRegime === 'RESICO' && (
              <>
                <Input
                  label="Ingresos Totales Anuales"
                  prefix="$"
                  value={resicoData.totalIncome}
                  onChangeText={(text) => handleResicoChange('totalIncome', text)}
                  keyboardType="numeric"
                  placeholder="0"
                  backgroundColor={theme.inputBg}
                  borderColor={theme.inputBorder}
                  textColor={theme.text}
                  labelColor={theme.text}
                  prefixColor={theme.textSecondary}
                  selectionColor={theme.accentLight}
                />

                <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Retenciones y Pagos
                  </Text>
                  
                  <Input
                    label="ISR Retenido (1.25%)"
                    prefix="$"
                    value={resicoData.withheldISR}
                    onChangeText={(text) => handleResicoChange('withheldISR', text)}
                    keyboardType="numeric"
                    placeholder="0"
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
                    value={resicoData.provisionalPayments}
                    onChangeText={(text) => handleResicoChange('provisionalPayments', text)}
                    keyboardType="numeric"
                    placeholder="0"
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

            {/* ACTIVIDAD EMPRESARIAL */}
            {selectedRegime === 'EMPRESARIAL' && (
              <>
                {/* Selector de Mes - NUEVO */}
                <MonthSelector
                  selectedMonth={selectedMonth}
                  onSelectMonth={handleMonthChange}
                  theme={theme}
                />

                {/* Info sobre ingresos acumulados */}
                <View style={[styles.infoCard, { backgroundColor: theme.detailCard }]}>
                  <View style={styles.infoHeader}>
                    <MaterialCommunityIcons 
                      name="information" 
                      size={18} 
                      color={theme.accentLight} 
                    />
                    <Text style={[styles.infoTitle, { color: theme.text }]}>
                      Ingresos y Deducciones Acumulados
                    </Text>
                  </View>
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Ingresa tus ingresos y deducciones acumulados hasta el mes seleccionado. 
                    La calculadora usará la tabla correspondiente a ese mes.
                  </Text>
                </View>

                <Input
                  label="Ingresos Acumulados"
                  prefix="$"
                  value={empresarialData.totalIncome}
                  onChangeText={(text) => handleEmpresarialChange('totalIncome', text)}
                  keyboardType="numeric"
                  placeholder="0"
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
                  value={empresarialData.totalDeductions}
                  onChangeText={(text) => handleEmpresarialChange('totalDeductions', text)}
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
                    <MaterialCommunityIcons 
                      name="information" 
                      size={18} 
                      color={theme.accentLight} 
                    />
                    <Text style={[styles.infoTitle, { color: theme.text }]}>
                      ¿Qué incluir en deducciones?
                    </Text>
                  </View>
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Suma todas tus deducciones acumuladas:{'\n'}
                    • Compras y costos de ventas{'\n'}
                    • Gastos de operación{'\n'}
                    • Sueldos y salarios{'\n'}
                    • Rentas del local{'\n'}
                    • Depreciaciones{'\n'}
                    • Intereses pagados{'\n'}
                    • Otros gastos deducibles
                  </Text>
                </View>

                <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Pagos y Retenciones
                  </Text>

                  <Input
                    label="Pagos Provisionales"
                    prefix="$"
                    value={empresarialData.provisionalPayments}
                    onChangeText={(text) => handleEmpresarialChange('provisionalPayments', text)}
                    keyboardType="numeric"
                    placeholder="0"
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
                    value={empresarialData.withheldISR}
                    onChangeText={(text) => handleEmpresarialChange('withheldISR', text)}
                    keyboardType="numeric"
                    placeholder="0"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.textSecondary}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />
                </View>

                {totals && totals.totalIncome > 0 && (
                  <View style={[styles.previewCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>Vista Previa</Text>
                    <View style={styles.previewRow}>
                      <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Base gravable:</Text>
                      <Text style={[styles.previewValue, { color: theme.text }]}>
                        ${totals.taxableBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {/* PERSONA MORAL */}
            {selectedRegime === 'MORAL' && (
              <>
                <Input
                  label="Ingresos Acumulables"
                  prefix="$"
                  value={moralData.totalIncome}
                  onChangeText={(text) => handleMoralChange('totalIncome', text)}
                  keyboardType="numeric"
                  placeholder="0"
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
                  value={moralData.totalDeductions}
                  onChangeText={(text) => handleMoralChange('totalDeductions', text)}
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
                    <MaterialCommunityIcons 
                      name="information" 
                      size={18} 
                      color={theme.accentLight} 
                    />
                    <Text style={[styles.infoTitle, { color: theme.text }]}>
                      ¿Qué incluir en deducciones?
                    </Text>
                  </View>
                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Suma todas tus deducciones autorizadas:{'\n'}
                    • Compras y costos de ventas{'\n'}
                    • Gastos de operación{'\n'}
                    • Sueldos y salarios{'\n'}
                    • Rentas{'\n'}
                    • Depreciaciones{'\n'}
                    • Intereses{'\n'}
                    • PTU pagada{'\n'}
                    • Otros gastos deducibles
                  </Text>
                </View>

                <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Otros Conceptos
                  </Text>

                  <Input
                    label="Pérdidas Fiscales Años Anteriores"
                    prefix="$"
                    value={moralData.previousLosses}
                    onChangeText={(text) => handleMoralChange('previousLosses', text)}
                    keyboardType="numeric"
                    placeholder="0"
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
                    value={moralData.provisionalPayments}
                    onChangeText={(text) => handleMoralChange('provisionalPayments', text)}
                    keyboardType="numeric"
                    placeholder="0"
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
                    value={moralData.withheldISR}
                    onChangeText={(text) => handleMoralChange('withheldISR', text)}
                    keyboardType="numeric"
                    placeholder="0"
                    backgroundColor={theme.inputBg}
                    borderColor={theme.inputBorder}
                    textColor={theme.text}
                    labelColor={theme.textSecondary}
                    prefixColor={theme.textSecondary}
                    selectionColor={theme.accentLight}
                  />
                </View>

                {totals && totals.totalIncome > 0 && (
                  <View style={[styles.previewCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                    <Text style={[styles.previewTitle, { color: theme.textSecondary }]}>Vista Previa</Text>
                    <View style={styles.previewRow}>
                      <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>Base gravable:</Text>
                      <Text style={[styles.previewValue, { color: theme.text }]}>
                        ${totals.taxableBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                )}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1 },
  headerContainer: { zIndex: 10 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoBadgeText: { fontSize: 13, marginLeft: 8, flex: 1 },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  calculateButton: { marginBottom: 24 },
  previewCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  previewTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  previewLabel: { fontSize: 14 },
  previewValue: { fontSize: 14, fontWeight: 'bold' },
});