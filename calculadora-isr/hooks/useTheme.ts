// hooks/useTheme.ts
// Custom hook para manejo del tema - MODO CLARO POR DEFECTO

import { useState, useEffect } from 'react';
import { ThemeColors } from '@/types';
import { DARK_THEME, LIGHT_THEME } from '@/constants/Theme';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // ← CAMBIO: false = modo claro
  const [theme, setTheme] = useState<ThemeColors>(LIGHT_THEME); // ← CAMBIO: LIGHT_THEME

  useEffect(() => {
    setTheme(isDarkMode ? DARK_THEME : LIGHT_THEME);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    theme,
    toggleTheme,
    setIsDarkMode,
  };
};