// components/calculator/MonthSelector.tsx
// Selector de mes para Actividad Empresarial en calculadora avanzada

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';

interface MonthSelectorProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
  theme: ThemeColors;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  onSelectMonth,
  theme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-month" size={20} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>
          Selecciona el mes acumulado
        </Text>
      </View>

      {/* Info */}
      <View style={[styles.infoBox, { backgroundColor: theme.detailCard }]}>
        <MaterialCommunityIcons name="information" size={16} color={theme.textSecondary} />
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Elige el mes hasta el cual tienes acumulados tus ingresos y deducciones
        </Text>
      </View>

      {/* Selector de meses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MESES.map((mes, index) => {
          const isSelected = selectedMonth === index;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.monthButton,
                { 
                  backgroundColor: isSelected ? theme.accent : theme.detailCard,
                  borderColor: isSelected ? theme.accent : theme.border,
                }
              ]}
              onPress={() => onSelectMonth(index)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.monthText,
                { color: isSelected ? '#FFFFFF' : theme.textSecondary }
              ]}>
                {mes}
              </Text>
              <Text style={[
                styles.monthNumber,
                { color: isSelected ? '#FFFFFF' : theme.textTertiary }
              ]}>
                Mes {index + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Banner del mes seleccionado */}
      <View style={[styles.selectedBanner, { backgroundColor: theme.accent }]}>
        <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
        <Text style={styles.selectedBannerText}>
          Calculando para: {MESES[selectedMonth]} (Mes {selectedMonth + 1})
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  scrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  monthNumber: {
    fontSize: 11,
  },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  selectedBannerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});