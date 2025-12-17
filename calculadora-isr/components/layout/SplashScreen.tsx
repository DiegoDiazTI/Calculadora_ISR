// components/layout/SplashScreen.tsx
// Splash Screen estilo "HTML mock": claro, corporativo, elegante.

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const TIPS_FISCALES = [
  "Verifica que tu RFC esté actualizado en el SAT antes de realizar cualquier trámite fiscal.",
  "Asegúrate de conocer en qué régimen fiscal estás tributando, esto define tus obligaciones.",
  "Revisa todos tus ingresos del período, no solo tu sueldo base.",
  "No olvides considerar tu aguinaldo, prima vacacional y cualquier bono que hayas recibido.",
  "Guarda tus facturas médicas, pueden ayudarte a reducir significativamente tu ISR.",
  "Considera deducir gastos de colegiaturas (si aplica), es un beneficio fiscal importante.",
  "Revisa si puedes deducir intereses reales de tu crédito hipotecario.",
  "Las aportaciones voluntarias a tu Afore son deducibles y mejoran tu retiro.",
  "Asegúrate de que tus donativos sean a instituciones autorizadas por el SAT.",
  "No esperes al último momento: la declaración anual vence en abril.",
];

const CATEGORIES = [
  "Verificación",
  "Verificación",
  "Ingresos",
  "Ingresos",
  "Deducciones",
  "Deducciones",
  "Deducciones",
  "Deducciones",
  "Deducciones",
  "Consejo",
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Float del logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // Rotación tips
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTipIndex((prev) => (prev + 1) % TIPS_FISCALES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  };

  return (
    <View style={styles.container}>
      {/* Status bar para fondo claro */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={styles.container.backgroundColor as string}
      />

      {/* Background decorations (simula blur) */}
      <View style={[styles.bgCircle, styles.bgCircleOne]} />
      <View style={[styles.bgCircle, styles.bgCircleTwo]} />
      <View style={[styles.bgCircle, styles.bgCircleThree]} />

      {/* Logo */}
      <Animated.View style={[styles.logoSection, { transform: [{ translateY: floatAnim }] }]}>
        <LinearGradient
          colors={['#004a4a', '#0a2127']}
          style={styles.logoContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </LinearGradient>
        <View pointerEvents="none" style={styles.logoGlowBorder} />
      </Animated.View>

      {/* Títulos */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Calculadora ISR</Text>
        <Text style={styles.subtitle}>Tu herramienta fiscal inteligente</Text>
      </View>

      {/* Tip Card */}
      <Animated.View style={[styles.tipCard, { opacity: fadeAnim }]}>
        {/* Barra superior degradada */}
        <LinearGradient
          colors={['#004a4a', '#780109']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tipTopBar}
        />

        <View style={styles.tipLabelRow}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color="#004a4a" />
          <Text style={styles.tipLabel}>
            {CATEGORIES[currentTipIndex] ?? 'Tip Fiscal'}
          </Text>
        </View>

        <Text style={styles.tipText}>
          {TIPS_FISCALES[currentTipIndex]}
        </Text>

        <Text style={styles.tipSource}>Consejo informativo • Revisa tus obligaciones</Text>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.buttonWrap, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.buttonTouchable}>
          <LinearGradient
            colors={['#004a4a', '#0a2127']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>COMENZAR</Text>
            <MaterialCommunityIcons name="arrow-right" size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <Text style={styles.footer}>Versión 1.1.0 • Díaz Lara</Text>

      {/* Indicador inferior (iPhone style) */}
      <View style={styles.bottomIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Similar a "cream -> white"
    backgroundColor: '#F8F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },

  // Background circles (blur sim)
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
    ...(Platform.OS === 'web'
      ? ({ filter: 'blur(60px)' } as any)
      : null),
  },
  bgCircleOne: {
    width: 420,
    height: 420,
    backgroundColor: '#004a4a',
    top: -220,
    right: -170,
    opacity: 0.12,
  },
  bgCircleTwo: {
    width: 320,
    height: 320,
    backgroundColor: '#780109',
    bottom: -120,
    left: -120,
    opacity: 0.08,
  },
  bgCircleThree: {
    width: 220,
    height: 220,
    backgroundColor: '#004a4a',
    bottom: 220,
    right: -80,
    opacity: 0.06,
  },

  // Logo
  logoSection: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  logoGlowBorder: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(0, 74, 74, 0.12)',
  },
  logoImage: {
    width: 66,
    height: 66,
  },

  // Titles
  titleSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#231F20',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4C4545',
    textAlign: 'center',
  },

  // Tip card (white card with border + top gradient bar)
  tipCard: {
    width: Math.min(width - 40, 360),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 74, 0.10)',
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  tipTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  tipLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#004a4a',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C2627',
    textAlign: 'center',
    marginBottom: 12,
  },
  tipSource: {
    fontSize: 12,
    color: '#4C4545',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.85,
  },

  // CTA
  buttonWrap: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 14,
  },
  buttonTouchable: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    fontSize: 12,
    color: '#4C4545',
    textAlign: 'center',
    opacity: 0.7,
  },

  bottomIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#2C2627',
    opacity: 0.18,
    marginTop: 14,
  },
});
