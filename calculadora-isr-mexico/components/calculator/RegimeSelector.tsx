// components/calculator/RegimeSelector.tsx
// Selector de régimen fiscal

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RegimeType, ThemeColors } from '@/types';
import { REGIMES } from '@/constants/Regimes';

interface RegimeSelectorProps {
  selectedRegime: RegimeType;
  onSelectRegime: (regime: RegimeType) => void;
  theme: ThemeColors;
}

export const RegimeSelector: React.FC<RegimeSelectorProps> = ({
  selectedRegime,
  onSelectRegime,
  theme,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
        SELECCIONA TU RÉGIMEN
      </Text>

      {REGIMES.map((regime) => {
        const isSelected = selectedRegime === regime.id;
        const iconColor = regime.id === 'TABLES' ? '#FFFFFF' : '#FFFFFF';
        const iconBg = regime.id === 'TABLES' ? '#991B1B' : theme.accent;

        return (
          <TouchableOpacity
            key={regime.id}
            style={[
              styles.regimeCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: isSelected ? theme.accent : theme.cardBorder,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
            onPress={() => onSelectRegime(regime.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
              <MaterialCommunityIcons name={regime.icon as any} size={24} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.text }]}>{regime.title}</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {regime.subtitle}
              </Text>
            </View>
            {isSelected && (
              <MaterialCommunityIcons name="check-circle" size={24} color={theme.accentLight} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  regimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
  },
});