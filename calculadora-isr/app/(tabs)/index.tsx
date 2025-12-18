// app/(tabs)/index.tsx
// Calculadora Simple con Splash Screen y espacio correcto debajo del Header

import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform, View, StatusBar, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { RegimeSelector } from '@/components/calculator/RegimeSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ResultsCard } from '@/components/calculator/ResultsCard';
import { CharacteristicsCard } from '@/components/calculator/CharacteristicsCard';
import TaxTable from '@/components/calculator/TaxTable';
import { AllTaxTables } from '@/components/calculator/AllTaxTables';
import { useTheme } from '@/hooks/useTheme';
import { useCalculator } from '@/hooks/useCalculator';
import { REGIMES } from '@/constants/Regimes';

const HEADER_BG = '#000000';
const KEYBOARD_VERTICAL_OFFSET = Platform.OS === 'ios' ? 60 : 0;

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const {
    selectedRegime,
    annualIncome,
    showResults,
    result,
    handleIncomeChange,
    handleRegimeChange,
    calculateISR,
    reset,
  } = useCalculator();

  // Ocultar Tab Bar durante Splash
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: showSplash ? 'none' : 'flex' }
    });
  }, [showSplash, navigation]);

  // Actualizar colores de Tab Bar segÓn el tema actual
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
      tabBarStyle: showSplash ? { display: 'none' } : baseTabBarStyle,
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
    });
  }, [navigation, showSplash, theme, isDarkMode]);

  // Mostrar Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const currentRegime = REGIMES.find((r) => r.id === selectedRegime);
  const isTableView = selectedRegime === 'TABLES';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: HEADER_BG }]}>
      <StatusBar barStyle={theme.statusBar as any} backgroundColor={HEADER_BG} />
      <View style={[styles.page, { backgroundColor: theme.background }]}>
        {/* Header */}
        <Header theme={theme} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
        
        {/* Contenido con espacio debajo del header */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
        {/* Selector de régimen - SIEMPRE VISIBLE */}
        <RegimeSelector
          selectedRegime={selectedRegime}
          onSelectRegime={handleRegimeChange}
          theme={theme}
        />

        {/* Vista de Tablas - Se muestra cuando selectedRegime === 'TABLES' */}
        {isTableView ? (
          <AllTaxTables theme={theme} />
        ) : (
          <>
            {/* Características del régimen */}
            {currentRegime && (
              <CharacteristicsCard
                title={`Características de ${currentRegime.title}`}
                characteristics={currentRegime.characteristics}
                theme={theme}
              />
            )}

            {/* Input de ingresos */}
            <Input
              label="Ingreso Anual"
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
            />

            {/* Botón calcular */}
            <Button
              title="Calcular ISR"
              icon="calculator"
              onPress={calculateISR}
              backgroundColor={theme.accent}
            />

            {/* Resultados */}
            {showResults && result && (
              <>
                <ResultsCard
                  result={result}
                  income={parseFloat(annualIncome.replace(/,/g, '')) || 0}
                  regime={selectedRegime}
                  theme={theme}
                />
                <Button
                  title="Nuevo Cálculo"
                  icon="refresh"
                  onPress={reset}
                  backgroundColor={theme.accent}
                />
              </>
            )}
            
           
          </>
        )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,        // ← ESPACIO DEBAJO DEL HEADER
    paddingHorizontal: 16, // Márgenes laterales
    paddingBottom: 24,     // Espacio al final
  },
});
