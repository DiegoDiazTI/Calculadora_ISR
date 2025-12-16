// components/calculator/DeductionsInput.tsx
// Input de deducciones para Persona Moral

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';

interface DeductionField {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  placeholder?: string;
}

interface DeductionsInputProps {
  fields: DeductionField[];
  theme: ThemeColors;
}

export const DeductionsInput: React.FC<DeductionsInputProps> = ({ fields, theme }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="receipt" size={20} color={theme.accentLight} />
        <Text style={[styles.title, { color: theme.text }]}>Deducciones Autorizadas</Text>
      </View>

      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <MaterialCommunityIcons 
              name={field.icon as any} 
              size={16} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.label, { color: theme.textSecondary }]}>{field.label}</Text>
          </View>
          <View style={[styles.inputContainer, { 
            backgroundColor: theme.inputBg, 
            borderColor: theme.inputBorder 
          }]}>
            <Text style={[styles.prefix, { color: theme.textSecondary }]}>$</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={field.value}
              onChangeText={field.onChangeText}
              keyboardType="numeric"
              placeholder={field.placeholder || "0"}
              placeholderTextColor={theme.textTertiary}
              selectionColor={theme.accentLight}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 10,
  },
});