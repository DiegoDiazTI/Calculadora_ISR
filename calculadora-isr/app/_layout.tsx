// app/_layout.tsx
// Layout principal de la aplicación con Splash Screen, GestureHandlerRootView y AppContext

import { Stack } from 'expo-router';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <AppProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AppProvider>
      )}
    </GestureHandlerRootView>
  );
}
