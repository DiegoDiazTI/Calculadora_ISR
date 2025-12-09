// components/ui/ThemeToggle.tsx
// Botón circular para cambiar entre modo claro y oscuro

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
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
  const backgroundColor = isDarkMode ? accentColor : 'transparent';
  const borderColor = accentColor;
  const iconName = isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny';
  const iconColor = isDarkMode ? iconColorActive : iconColorInactive;

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed
            ? isDarkMode
              ? accentColor
              : '#0b1720'
            : backgroundColor,
          borderColor,
        },
      ]}
    >
      <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
