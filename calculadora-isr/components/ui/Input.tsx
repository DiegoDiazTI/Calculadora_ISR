// components/ui/Input.tsx
// Componente de input reutilizable

import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  prefix?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  labelColor?: string;
  prefixColor?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  prefix,
  backgroundColor = '#1E293B',
  borderColor = '#334155',
  textColor = '#FFFFFF',
  labelColor = '#F1F5F9',
  prefixColor = '#94A3B8',
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor, borderColor },
        ]}
      >
        {prefix && <Text style={[styles.prefix, { color: prefixColor }]}>{prefix}</Text>}
        <TextInput
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={prefixColor}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
  },
  prefix: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    padding: 12,
  },
});