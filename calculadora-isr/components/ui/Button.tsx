// components/ui/Button.tsx
// Componente de botón reutilizable

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  icon,
  backgroundColor = '#0F766E',
  textColor = '#FFFFFF',
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#64748B' : backgroundColor },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});