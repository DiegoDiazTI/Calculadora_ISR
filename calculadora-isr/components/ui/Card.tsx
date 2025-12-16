// components/ui/Card.tsx
// Componente de tarjeta reutilizable

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  backgroundColor = '#1E293B',
  borderColor = 'transparent',
  borderWidth = 1,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
          borderWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
});