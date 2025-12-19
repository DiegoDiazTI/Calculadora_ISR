// components/calculator/PeriodSelector.tsx
// Selector de periodo (Mensual/Anual) para RESICO

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';

interface PeriodSelectorProps {
  selectedPeriod: 'mensual' | 'anual';
  onSelectPeriod: (period: 'mensual' | 'anual') => void;
  theme: ThemeColors;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
  theme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-clock" size={18} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>
          Periodo de Cálculo
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedPeriod === 'mensual' ? theme.accent : theme.detailCard,
              borderColor: selectedPeriod === 'mensual' ? theme.accent : theme.border,
            }
          ]}
          onPress={() => onSelectPeriod('mensual')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="calendar-month" 
            size={20} 
            color={selectedPeriod === 'mensual' ? '#FFFFFF' : theme.textSecondary} 
          />
          <Text style={[
            styles.buttonText,
            { color: selectedPeriod === 'mensual' ? '#FFFFFF' : theme.text }
          ]}>
            Mensual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedPeriod === 'anual' ? theme.accent : theme.detailCard,
              borderColor: selectedPeriod === 'anual' ? theme.accent : theme.border,
            }
          ]}
          onPress={() => onSelectPeriod('anual')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="calendar" 
            size={20} 
            color={selectedPeriod === 'anual' ? '#FFFFFF' : theme.textSecondary} 
          />
          <Text style={[
            styles.buttonText,
            { color: selectedPeriod === 'anual' ? '#FFFFFF' : theme.text }
          ]}>
            Anual
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});