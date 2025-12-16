// components/calculator/CharacteristicsCard.tsx
// Tarjeta con características del régimen seleccionado

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeColors } from '@/types';

interface CharacteristicsCardProps {
  title: string;
  characteristics: string[];
  theme: ThemeColors;
}

export const CharacteristicsCard: React.FC<CharacteristicsCardProps> = ({
  title,
  characteristics,
  theme,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: theme.characteristicsCard }]}>
      <Text style={styles.title}>{title}</Text>
      {characteristics.map((characteristic, index) => (
        <View key={index} style={styles.row}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={theme.characteristicsText}
          />
          <Text style={[styles.text, { color: theme.characteristicsText }]}>
            {characteristic}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    marginLeft: 8,
    lineHeight: 20,
  },
});