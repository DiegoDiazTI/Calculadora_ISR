// app/_layout.tsx
// Layout principal de la aplicación con Splash Screen y AppContext

import { Stack } from 'expo-router';
import { useState } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  // Mostrar Splash Screen al iniciar
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Después del splash, mostrar la app normal envuelta en AppProvider
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}