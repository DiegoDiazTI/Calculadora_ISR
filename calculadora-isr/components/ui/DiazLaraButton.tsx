// components/ui/DiazLaraButton.tsx
// Botón corporativo con estilos de Díaz Lara

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  DiazLaraColors, 
  DiazLaraTypography, 
  DiazLaraBorderRadius,
  DiazLaraSpacing,
  DiazLaraShadows,
} from '@/constants/DiazLaraTheme';

interface DiazLaraButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const DiazLaraButton: React.FC<DiazLaraButtonProps> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    if (disabled || loading) {
      return [styles.button, styles.buttonDisabled, style];
    }

    switch (variant) {
      case 'primary':
        return [styles.button, styles.buttonPrimary, DiazLaraShadows.card, style];
      case 'secondary':
        return [styles.button, styles.buttonSecondary, style];
      case 'outline':
        return [styles.button, styles.buttonOutline, style];
      default:
        return [styles.button, styles.buttonPrimary, style];
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return DiazLaraColors.textLight;
    if (variant === 'outline') return DiazLaraColors.tealPrimary;
    return '#FFFFFF';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={20}
                color={getTextColor()}
                style={styles.icon}
              />
            )}
            <Text style={[styles.buttonText, { color: getTextColor() }]}>
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: DiazLaraSpacing.xl,
    borderRadius: DiazLaraBorderRadius.button,
    minHeight: 52,
  },
  buttonPrimary: {
    backgroundColor: DiazLaraColors.tealPrimary,
  },
  buttonSecondary: {
    backgroundColor: DiazLaraColors.accentRed,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: DiazLaraColors.tealPrimary,
  },
  buttonDisabled: {
    backgroundColor: DiazLaraColors.textLight,
    opacity: 0.5,
  },
  buttonText: {
    ...DiazLaraTypography.h3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  icon: {
    marginRight: DiazLaraSpacing.sm,
  },
});