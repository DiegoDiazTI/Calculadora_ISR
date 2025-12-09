// hooks/useTheme.ts
// Custom hook para manejo del tema

import { useState, useEffect } from 'react';
import { ThemeColors } from '@/types';
import { DARK_THEME, LIGHT_THEME } from '@/constants/Theme';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<ThemeColors>(DARK_THEME);

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