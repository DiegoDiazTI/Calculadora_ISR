// app/(tabs)/_layout.tsx
// Layout de pestañas con navegación inferior

import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeBg = isDark ? '#3a3233' : '#e6f4f3';
  const activeShadow = isDark ? '#000000' : '#0f172a';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#2c2627' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,74,74,0.15)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: isDark ? '#FFFFFF' : '#004a4a',
        tabBarInactiveTintColor: isDark ? '#E2E8F0' : '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarButton: (props) => {
          const isFocused = props.accessibilityState?.selected;
          const { delayLongPress, disabled, ...restProps } = props;

          // Remove any props with null values (especially event handlers)
          const filteredProps = Object.fromEntries(
            Object.entries(restProps).filter(([_, v]) => v !== null)
          );

          return (
            <TouchableOpacity
              {...filteredProps}
              disabled={disabled ?? false}
              delayLongPress={delayLongPress ?? undefined}
              style={[
                restProps.style,
                styles.tabButton,
                isFocused && styles.tabButtonActive,
                isFocused && { backgroundColor: activeBg, shadowColor: activeShadow },
              ]}
              activeOpacity={0.85}
            >
              {props.children}
            </TouchableOpacity>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Simple',
          href: '/',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calculator" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="advanced"
        options={{
          title: 'Avanzada',
          href: '/advanced',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calculator-variant" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabButtonActive: {
    transform: [{ translateY: -3 }],
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
