// components/ui/DiazLaraInput.tsx
// Input monetario con estilos corporativos de Díaz Lara

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {
  DiazLaraColors,
  DiazLaraTypography,
  DiazLaraBorderRadius,
  DiazLaraSpacing,
  DiazLaraShadows,
} from '@/constants/DiazLaraTheme';

interface DiazLaraInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  prefix?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  style?: ViewStyle;
  isDarkMode?: boolean;
}

export const DiazLaraInput: React.FC<DiazLaraInputProps> = ({
  label,
  value,
  onChangeText,
  prefix = '$',
  placeholder = '0',
  keyboardType = 'numeric',
  style,
  isDarkMode = true,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const inputBg = isDarkMode 
    ? 'rgba(255, 255, 255, 0.05)' 
    : '#FFFFFF';
  
  const borderColor = isFocused 
    ? DiazLaraColors.tealPrimary 
    : isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)'
      : DiazLaraColors.borderLight;
  
  const textColor = isDarkMode ? '#FFFFFF' : DiazLaraColors.textDark;
  const labelColor = isDarkMode ? '#E5E7EB' : DiazLaraColors.textGray;

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: labelColor }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          { 
            backgroundColor: inputBg,
            borderColor,
            borderWidth: 2,
          },
          isFocused && DiazLaraShadows.focus,
        ]}
      >
        {prefix && (
          <Text style={[styles.prefix, { color: textColor }]}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : DiazLaraColors.textLight}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={DiazLaraColors.tealPrimary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: DiazLaraSpacing.lg,
  },
  label: {
    ...DiazLaraTypography.label,
    marginBottom: DiazLaraSpacing.sm,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DiazLaraSpacing.lg,
    paddingVertical: DiazLaraSpacing.md,
    borderRadius: DiazLaraBorderRadius.input,
    minHeight: 56,
  },
  prefix: {
    ...DiazLaraTypography.number,
    marginRight: DiazLaraSpacing.sm,
  },
  input: {
    flex: 1,
    ...DiazLaraTypography.number,
    padding: 0,
    margin: 0,
  },
});