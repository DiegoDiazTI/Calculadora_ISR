// app/(tabs)/advanced.tsx
// MEJORADO: Con tablas informativas para RESICO, EMPRESARIAL y MORAL

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/hooks/useTheme';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  RESICO_TAX_TABLE_ANUAL_2025,
  RESICO_TAX_TABLE_2025,
  ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025,
  PERSONA_MORAL_RATE
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
    handleResicoChange,
    handleEmpresarialChange,
    handleMoralChange,
    handleMonthChange,
    handleResicoPeriodChange,
    calculateISR,
    getTotals,
  } = useAdvancedCalculator(selectedRegime, localResicoPeriod);
  
  useEffect(() => {
    if (resicoPeriod !== localResicoPeriod) {
      setLocalResicoPeriod(resicoPeriod);
    }
  }, [resicoPeriod]);

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

  // Tabla RESICO según periodo
  const resicoTableData = resicoPeriod === 'mensual' 
    ? RESICO_TAX_TABLE_2025 
    : RESICO_TAX_TABLE_ANUAL_2025;

  // Tabla EMPRESARIAL (primeros 5 tramos anuales)
  const empresarialTableData = ACTIVIDAD_EMPRESARIAL_TABLE_MENSUAL_2025.slice(0, 5).map(bracket => ({
    min: bracket.min * 12,
    max: bracket.max === 999999999.99 ? bracket.max : bracket.max * 12,
    fixedFee: bracket.fixedFee * 12,
    rate: bracket.rate
  }));

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
              onSelectRegime={setSelectedRegime}
              theme={theme}
            />

            {/* TABLAS ISR */}
            {selectedRegime === 'TABLES' && (
              <AllTaxTables theme={theme} />
            )}

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

            {/* ========== RESICO ========== */}
            {selectedRegime === 'RESICO' && (
              <>
                <PeriodSelector
                  selectedPeriod={resicoPeriod}
                  onSelectPeriod={handleResicoPeriodChange}
                  theme={theme}
                />

                {/* TABLA DE TASAS RESICO */}
                <View style={[styles.tableCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <TouchableOpacity 
                    style={styles.tableHeader}
                    onPress={() => setShowResicoTable(!showResicoTable)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tableHeaderLeft}>
                      <MaterialCommunityIcons 
                        name="table" 
                        size={20} 
                        color={theme.accentLight} 
                      />
                      <Text style={[styles.tableTitle, { color: theme.text }]}>
                        Tabla de Tasas RESICO {resicoPeriod === 'mensual' ? 'Mensual' : 'Anual'}
                      </Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={showResicoTable ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>

                  {showResicoTable && (
                    <View style={styles.tableContent}>
                      <View style={[styles.tableRowHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.tableHeaderText, { color: theme.textTertiary, flex: 1 }]}>
                          Desde
                        </Text>
                        <Text style={[styles.tableHeaderText, { color: theme.textTertiary, flex: 1 }]}>
                          Hasta
                        </Text>
                        <Text style={[styles.tableHeaderText, { color: theme.textTertiary, flex: 0.8 }]}>
                          Tasa
                        </Text>
                      </View>

                      {resicoTableData.map((bracket: any, index: number) => (
                        <View 
                          key={index} 
                          style={[
                            styles.tableRowData, 
                            { borderBottomColor: theme.border },
                            index === resicoTableData.length - 1 && { borderBottomWidth: 0 }
                          ]}
                        >
                          <Text style={[styles.tableDataText, { color: theme.textSecondary, flex: 1 }]}>
                            ${bracket.min.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Text>
                          <Text style={[styles.tableDataText, { color: theme.textSecondary, flex: 1 }]}>
                            {bracket.max >= 3500000 
                              ? '$3,500,000.00' 
                              : `$${bracket.max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                          </Text>
                          <Text style={[styles.tableDataRate, { color: theme.accentLight, flex: 0.8 }]}>
                            {(bracket.rate * 100).toFixed(2)}%
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <Input
                  label={resicoPeriod === 'mensual' ? "Ingresos Mensuales" : "Ingresos Totales Anuales"}
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

            {/* ========== ACTIVIDAD EMPRESARIAL ========== */}
            {selectedRegime === 'EMPRESARIAL' && (
              <>
                <MonthSelector
                  selectedMonth={selectedMonth}
                  onSelectMonth={handleMonthChange}
                  theme={theme}
                />

                {/* TABLA ACTIVIDAD EMPRESARIAL */}
                <View style={[styles.tableCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <TouchableOpacity 
                    style={styles.tableHeader}
                    onPress={() => setShowEmpresarialTable(!showEmpresarialTable)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tableHeaderLeft}>
                      <MaterialCommunityIcons 
                        name="table" 
                        size={20} 
                        color={theme.accentLight} 
                      />
                      <Text style={[styles.tableTitle, { color: theme.text }]}>
                        Tabla Anual - Primeros 5 Tramos
                      </Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={showEmpresarialTable ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>

                  {showEmpresarialTable && (
                    <View style={styles.tableContent}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View>
                          <View style={[styles.tableRowHeader, { borderBottomColor: theme.border }]}>
                            <Text style={[styles.tableHeaderTextSmall, { color: theme.textTertiary, width: 100 }]}>
                              Límite Inf.
                            </Text>
                            <Text style={[styles.tableHeaderTextSmall, { color: theme.textTertiary, width: 100 }]}>
                              Límite Sup.
                            </Text>
                            <Text style={[styles.tableHeaderTextSmall, { color: theme.textTertiary, width: 100 }]}>
                              Cuota Fija
                            </Text>
                            <Text style={[styles.tableHeaderTextSmall, { color: theme.textTertiary, width: 60 }]}>
                              Tasa
                            </Text>
                          </View>

                          {empresarialTableData.map((bracket: any, index: number) => (
                            <View 
                              key={index} 
                              style={[
                                styles.tableRowData, 
                                { borderBottomColor: theme.border },
                                index === empresarialTableData.length - 1 && { borderBottomWidth: 0 }
                              ]}
                            >
                              <Text style={[styles.tableDataTextSmall, { color: theme.textSecondary, width: 100 }]} numberOfLines={1}>
                                ${bracket.min.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                              </Text>
                              <Text style={[styles.tableDataTextSmall, { color: theme.textSecondary, width: 100 }]} numberOfLines={1}>
                                {bracket.max === 999999999.99 
                                  ? 'En adelante' 
                                  : `$${bracket.max.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                                }
                              </Text>
                              <Text style={[styles.tableDataTextSmall, { color: theme.text, width: 100 }]} numberOfLines={1}>
                                ${bracket.fixedFee.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                              </Text>
                              <Text style={[styles.tableDataRate, { color: theme.accentLight, width: 60 }]}>
                                {(bracket.rate * 100).toFixed(2)}%
                              </Text>
                            </View>
                          ))}
                        </View>
                      </ScrollView>
                      <Text style={[styles.tableNote, { color: theme.textTertiary }]}>
                        Ver tabla completa en pestaña "Simple"
                      </Text>
                    </View>
                  )}
                </View>

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

            {/* ========== PERSONA MORAL ========== */}
            {selectedRegime === 'MORAL' && (
              <>
                {/* TABLA PERSONA MORAL */}
                <View style={[styles.tableCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <TouchableOpacity 
                    style={styles.tableHeader}
                    onPress={() => setShowMoralTable(!showMoralTable)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tableHeaderLeft}>
                      <MaterialCommunityIcons 
                        name="table" 
                        size={20} 
                        color={theme.accentLight} 
                      />
                      <Text style={[styles.tableTitle, { color: theme.text }]}>
                        Tasa General - Persona Moral
                      </Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={showMoralTable ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>

                  {showMoralTable && (
                    <View style={styles.tableContent}>
                      <View style={[styles.moralRateCard, { backgroundColor: theme.accent }]}>
                        <Text style={styles.moralRateLabel}>TASA ÚNICA</Text>
                        <Text style={styles.moralRateValue}>{(PERSONA_MORAL_RATE * 100)}%</Text>
                        <Text style={styles.moralRateDescription}>
                          Sobre utilidad fiscal después de deducciones
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

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
  
  // ESTILOS PARA TABLAS
  tableCard: {
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  tableContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tableRowHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeaderTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tableRowData: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableDataText: {
    fontSize: 13,
  },
  tableDataTextSmall: {
    fontSize: 11,
    textAlign: 'center',
  },
  tableDataRate: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableNote: {
    fontSize: 11,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  
  // Tabla Moral
  moralRateCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  moralRateLabel: {
    fontSize: 12,
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
    fontSize: 11,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  
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