// contexts/AppContext.tsx
// Contexto global para compartir estado entre pestañas

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegimeType, ThemeColors } from '@/types';
import DiazLaraTheme from '@/constants/DiazLaraTheme';

const lightTheme = DiazLaraTheme.light;
const darkTheme = DiazLaraTheme.dark;

interface AppContextType {
  selectedRegime: RegimeType;
  setSelectedRegime: (regime: RegimeType) => void;
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [selectedRegime, setSelectedRegimeState] = useState<RegimeType>('RESICO');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Cargar preferencias guardadas al iniciar
  useEffect(() => {
    loadPreferences();
  }, []);

  // Guardar régimen cuando cambia
  useEffect(() => {
    saveRegime(selectedRegime);
  }, [selectedRegime]);

  // Guardar tema cuando cambia
  useEffect(() => {
    saveTheme(isDarkMode);
  }, [isDarkMode]);

  const loadPreferences = async () => {
    try {
      const savedRegime = await AsyncStorage.getItem('selectedRegime');
      const savedTheme = await AsyncStorage.getItem('isDarkMode');

      if (savedRegime) {
        setSelectedRegimeState(savedRegime as RegimeType);
      }

      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveRegime = async (regime: RegimeType) => {
    try {
      await AsyncStorage.setItem('selectedRegime', regime);
    } catch (error) {
      console.error('Error saving regime:', error);
    }
  };

  const saveTheme = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('isDarkMode', isDark.toString());
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setSelectedRegime = (regime: RegimeType) => {
    setSelectedRegimeState(regime);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <AppContext.Provider
      value={{
        selectedRegime,
        setSelectedRegime,
        isDarkMode,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};