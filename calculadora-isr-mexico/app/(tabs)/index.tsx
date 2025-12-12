// app/(tabs)/index.tsx
// Pantalla principal de la calculadora ISR

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCalculator } from '@/hooks/useCalculator';
import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ResultsCard } from '@/components/calculator/ResultsCard';
import  TaxTable  from '@/components/calculator/TaxTable';
import { REGIMES } from '@/constants/Regimes';
import { parseCurrency } from '@/utils/formatters';

export default function Index() {
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const {
    selectedRegime,
    annualIncome,
    showResults,
    result,
    handleIncomeChange,
    handleRegimeChange,
    calculateISR,
  } = useCalculator();

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Obtener características del régimen seleccionado
  const currentRegime = REGIMES.find((r) => r.id === selectedRegime);
  const showCharacteristics = currentRegime && currentRegime.id !== 'TABLES';
  const showTaxTable = selectedRegime === 'RESICO';

  // Determinar el label del input según el régimen
  const getInputLabel = () => {
    switch (selectedRegime) {
      case 'RESICO':
        return 'Ingresos Anuales';
      case 'EMPRESARIAL':
        return 'Base Gravable (Ingresos - Deducciones)';
      case 'MORAL':
        return 'Utilidad Fiscal Anual';
      default:
        return 'Ingresos Anuales';
    }
  };

  const income = parseCurrency(annualIncome);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBar as any} backgroundColor={theme.background} />
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
            {/* Header con toggle de tema */}
            <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

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

            {/* Input de ingresos - solo mostrar si no es TABLES */}
            {selectedRegime !== 'TABLES' && (
              <>
                <Input
                  label={getInputLabel()}
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

                {/* Botón de calcular */}
                <Button
                  title="CALCULAR ISR"
                  icon="calculator"
                  onPress={calculateISR}
                  backgroundColor={theme.accent}
                  style={styles.calculateButton}
                />

                {/* Resultados */}
                {showResults && result && (
                  <ResultsCard result={result} income={income} regime={selectedRegime} theme={theme} />
                )}
              </>
            )}

            {/* Tabla de tasas - solo para RESICO */}
            {showTaxTable && <TaxTable theme={theme} />}
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
  calculateButton: {
    marginBottom: 24,
  },
});