// components/ui/DiazLaraCard.tsx
// Tarjeta corporativa con estilos de Díaz Lara

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  DiazLaraColors,
  DiazLaraBorderRadius,
  DiazLaraSpacing,
  DiazLaraShadows,
} from '@/constants/DiazLaraTheme';

interface DiazLaraCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'teal' | 'elevated';
  style?: ViewStyle;
  isDarkMode?: boolean;
}

export const DiazLaraCard: React.FC<DiazLaraCardProps> = ({
  children,
  onPress,
  variant = 'default',
  style,
  isDarkMode = true,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const getBackgroundColor = () => {
    if (variant === 'teal') {
      return isDarkMode 
        ? 'rgba(0, 74, 74, 0.15)' 
        : DiazLaraColors.tealTranslucent;
    }
    return isDarkMode ? DiazLaraColors.grayDark : '#FFFFFF';
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    variant === 'elevated' && DiazLaraShadows.card,
    style,
  ];

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={cardStyle}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: DiazLaraBorderRadius.card,
    padding: DiazLaraSpacing.cardPadding,
  },
});