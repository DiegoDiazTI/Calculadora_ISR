// components/ui/ThemeToggle.tsx
// Componente para cambiar entre modo claro y oscuro

import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  accentColor?: string;
  iconColorActive?: string;
  iconColorInactive?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  onToggle,
  accentColor = '#0F766E',
  iconColorActive = '#14B8A6',
  iconColorInactive = '#64748B',
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="white-balance-sunny"
        size={20}
        color={isDarkMode ? iconColorInactive : iconColorActive}
      />
      <Switch
        value={isDarkMode}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: accentColor }}
        thumbColor={isDarkMode ? iconColorActive : '#F1F5F9'}
        ios_backgroundColor="#CBD5E1"
        style={styles.switch}
      />
      <MaterialCommunityIcons
        name="moon-waning-crescent"
        size={20}
        color={isDarkMode ? iconColorActive : iconColorInactive}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  switch: {
    marginHorizontal: 4,
  },
});