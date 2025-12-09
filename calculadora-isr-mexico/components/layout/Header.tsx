// components/layout/Header.tsx
// Header de la aplicación con título y toggle de tema

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  theme: ThemeColors;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, isDarkMode, onToggleTheme }) => {
  return (
    <View style={styles.header}>
      <View style={[styles.iconContainer, { backgroundColor: theme.accent }]}>
        <MaterialCommunityIcons name="calculator" size={32} color="#FFFFFF" />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Calculadora ISR</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Calcula tu impuesto según tu régimen fiscal
      </Text>

      <ThemeToggle
        isDarkMode={isDarkMode}
        onToggle={onToggleTheme}
        accentColor={theme.accent}
        iconColorActive={theme.accentLight}
        iconColorInactive={theme.textTertiary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
});