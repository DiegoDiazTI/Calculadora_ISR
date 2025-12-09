// components/layout/Header.tsx
// Header full width en cualquier plataforma, con fondo oscuro fijo

import React from 'react';
import { View, StyleSheet, Platform, Image, SafeAreaView } from 'react-native';
import { ThemeColors } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DARK_THEME } from '@/constants/Theme';
import LogoDiego from '../../assets/Logo/logo_diego.svg';

interface HeaderProps {
  theme: ThemeColors;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const HEADER_BG = DARK_THEME.background;

export const Header: React.FC<HeaderProps> = ({
  theme,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: HEADER_BG }]}>
      <View style={styles.headerContainer}>
        {/* Logo */}
        {Platform.OS === 'web' ? (
          <Image
            source={require('../../assets/Logo/logo_diego.svg')}
            style={styles.logoWeb}
            resizeMode="contain"
          />
        ) : (
          <LogoDiego width={110} height={30} />
        )}

        {/* Botón de tema */}
        <ThemeToggle
          isDarkMode={isDarkMode}
          onToggle={onToggleTheme}
          accentColor={theme.accent}
          iconColorActive={theme.accentLight}
          iconColorInactive={theme.textTertiary}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Asegura que el header use TODA el área segura + ancho total
  safeArea: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: HEADER_BG,
  },

  // Contenedor interno del header, sin dejar huecos laterales
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // 🔥 Hace que el header ignore padding del contenedor padre
    alignSelf: 'stretch',
  },

  logoWeb: {
    width: 110,
    height: 30,
  },
});
