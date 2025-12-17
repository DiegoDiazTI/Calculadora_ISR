// app/(tabs)/advanced.tsx
// Pantalla de Calculadora Avanzada

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
import { useAdvancedCalculator } from '@/hooks/useAdvancedCalculator';
import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DeductionsInput } from '@/components/calculator/DeductionsInput';
import AdvancedResultsCard from '@/components/calculator/AdvancedResultsCard';
import { REGIMES } from '@/constants/Regimes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleRegimeChange,
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

  // Sincronizar colores de la Tab Bar con el modo actual
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
  }, [navigation, theme]);

  const currentRegime = REGIMES.find((r) => r.id === selectedRegime);
  const showCharacteristics = currentRegime && currentRegime.id !== 'TABLES';
  const totals = getTotals();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar as any} backgroundColor={theme.background} />
      
      {/* Header fijo */}
      <View style={styles.headerContainer}>
        <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </View>

      {/* Contenido con scroll */}
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
            {/* Info Badge */}
            <View style={[styles.infoBadge, { backgroundColor: theme.accentBg + '20', borderColor: theme.accentLight }]}>
              <MaterialCommunityIcons name="information" size={20} color={theme.accentLight} />
              <Text style={[styles.infoBadgeText, { color: theme.accentLight }]}>
                Calculadora Avanzada - Incluye deducciones, retenciones y pagos provisionales
              </Text>
            </View>

            {/* Selector de régimen */}
            <RegimeSelector
              selectedRegime={selectedRegime}
              onSelectRegime={handleRegimeChange}
              theme={theme}
            />

            {/* Características del régimen */}
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

            {/* Inputs para RESICO */}
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

                  <Input
                    label="IVA Retenido (6%) - Opcional"
                    prefix="$"
                    value={resicoData.withheldIVA}
                    onChangeText={(text) => handleResicoChange('withheldIVA', text)}
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

            {/* Inputs para Actividad Empresarial */}
            {selectedRegime === 'EMPRESARIAL' && (
              <>
                <Input
                  label="Ingresos Acumulables"
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

                <DeductionsInput
                  theme={theme}
                  fields={[
                    {
                      label: 'Compras y Costos de Ventas',
                      value: empresarialData.purchases,
                      onChangeText: (text) => handleEmpresarialChange('purchases', text),
                      icon: 'shopping',
                    },
                    {
                      label: 'Gastos de Operación',
                      value: empresarialData.operatingExpenses,
                      onChangeText: (text) => handleEmpresarialChange('operatingExpenses', text),
                      icon: 'cash-multiple',
                    },
                    {
                      label: 'Sueldos y Salarios',
                      value: empresarialData.salaries,
                      onChangeText: (text) => handleEmpresarialChange('salaries', text),
                      icon: 'account-group',
                    },
                    {
                      label: 'Rentas',
                      value: empresarialData.rent,
                      onChangeText: (text) => handleEmpresarialChange('rent', text),
                      icon: 'home',
                    },
                    {
                      label: 'Depreciaciones',
                      value: empresarialData.depreciation,
                      onChangeText: (text) => handleEmpresarialChange('depreciation', text),
                      icon: 'trending-down',
                    },
                    {
                      label: 'Intereses',
                      value: empresarialData.interest,
                      onChangeText: (text) => handleEmpresarialChange('interest', text),
                      icon: 'percent',
                    },
                    {
                      label: 'Otras Deducciones',
                      value: empresarialData.otherDeductions,
                      onChangeText: (text) => handleEmpresarialChange('otherDeductions', text),
                      icon: 'format-list-bulleted',
                    },
                  ]}
                />

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

                {/* Preview de totales para Actividad Empresarial */}
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

            {/* Inputs para Persona Moral */}
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

                <DeductionsInput
                  theme={theme}
                  fields={[
                    {
                      label: 'Compras y Costos de Ventas',
                      value: moralData.purchases,
                      onChangeText: (text) => handleMoralChange('purchases', text),
                      icon: 'shopping',
                    },
                    {
                      label: 'Gastos de Operación',
                      value: moralData.operatingExpenses,
                      onChangeText: (text) => handleMoralChange('operatingExpenses', text),
                      icon: 'cash-multiple',
                    },
                    {
                      label: 'Sueldos y Salarios',
                      value: moralData.salaries,
                      onChangeText: (text) => handleMoralChange('salaries', text),
                      icon: 'account-group',
                    },
                    {
                      label: 'Rentas',
                      value: moralData.rent,
                      onChangeText: (text) => handleMoralChange('rent', text),
                      icon: 'home',
                    },
                    {
                      label: 'Depreciaciones',
                      value: moralData.depreciation,
                      onChangeText: (text) => handleMoralChange('depreciation', text),
                      icon: 'trending-down',
                    },
                    {
                      label: 'Intereses',
                      value: moralData.interest,
                      onChangeText: (text) => handleMoralChange('interest', text),
                      icon: 'percent',
                    },
                    {
                      label: 'Otras Deducciones',
                      value: moralData.otherDeductions,
                      onChangeText: (text) => handleMoralChange('otherDeductions', text),
                      icon: 'format-list-bulleted',
                    },
                    {
                      label: 'PTU Pagada',
                      value: moralData.ptu,
                      onChangeText: (text) => handleMoralChange('ptu', text),
                      icon: 'hand-coin',
                    },
                  ]}
                />

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

                {/* Preview de totales para Persona Moral */}
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

            {/* Botón de calcular */}
            {selectedRegime !== 'TABLES' && (
              <Button
                title="CALCULAR ISR DETALLADO"
                icon="calculator-variant"
                onPress={calculateISR}
                backgroundColor={theme.accent}
                style={styles.calculateButton}
              />
            )}

            {/* Resultados */}
            {showResults && result && selectedRegime !== 'TABLES' && (
              <AdvancedResultsCard result={result} regime={selectedRegime} theme={theme} />
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    // Header fijo en la parte superior
    zIndex: 10,
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
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoBadgeText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calculateButton: {
    marginBottom: 24,
  },
  previewCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewLabel: {
    fontSize: 14,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
