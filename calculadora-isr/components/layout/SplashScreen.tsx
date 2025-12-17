// components/layout/SplashScreen.tsx
// Splash Screen exacto del mockup HTML - Fondo claro con decoraciones

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

// Frases fiscales (del HTML)
const FRASES_FISCALES = [
  {
    texto: "Verifica que tu <strong>RFC</strong> esté actualizado en el SAT antes de realizar cualquier trámite fiscal.",
    categoria: "Verificación"
  },
  {
    texto: "Asegúrate de conocer en qué <strong>régimen fiscal</strong> estás tributando, esto define tus obligaciones.",
    categoria: "Verificación"
  },
  {
    texto: "Revisa todos tus <strong>ingresos del período</strong>, no solo tu sueldo base.",
    categoria: "Ingresos"
  },
  {
    texto: "No olvides considerar tu <strong>aguinaldo, prima vacacional</strong> y cualquier bono que hayas recibido.",
    categoria: "Ingresos"
  },
  {
    texto: "Guarda tus <strong>facturas médicas</strong>, pueden ayudarte a reducir significativamente tu ISR.",
    categoria: "Deducciones"
  },
  {
    texto: "Considera deducir tus gastos de <strong>colegiaturas</strong> de tus hijos, es un beneficio fiscal importante.",
    categoria: "Deducciones"
  },
  {
    texto: "Revisa si puedes deducir los <strong>intereses reales</strong> de tu crédito hipotecario.",
    categoria: "Deducciones"
  },
  {
    texto: "Las <strong>aportaciones voluntarias</strong> a tu Afore son deducibles y mejoran tu retiro.",
    categoria: "Deducciones"
  },
  {
    texto: "Las primas de tu <strong>seguro de gastos médicos mayores</strong> también cuentan como deducción.",
    categoria: "Deducciones"
  },
  {
    texto: "Asegúrate de que tus <strong>donativos</strong> sean a instituciones autorizadas por el SAT.",
    categoria: "Deducciones"
  },
  {
    texto: "Revisa cuánto <strong>ISR te retuvo tu patrón</strong> durante el año en tus recibos de nómina.",
    categoria: "Cálculo"
  },
  {
    texto: "Consulta la <strong>tabla del ISR vigente</strong> según tu nivel de ingresos para calcular correctamente.",
    categoria: "Cálculo"
  },
  {
    texto: "Tus deducciones no pueden superar <strong>5 UMAs anuales</strong> o el <strong>15%</strong> de tu ingreso.",
    categoria: "Cálculo"
  },
  {
    texto: "Parte de tu <strong>aguinaldo y prima vacacional</strong> están exentos de ISR, aprovéchalo.",
    categoria: "Cálculo"
  },
  {
    texto: "No esperes hasta el último momento, tu <strong>declaración anual vence en abril</strong>.",
    categoria: "Consejo"
  },
  {
    texto: "Si tienes dudas, busca <strong>asesoría profesional</strong> para evitar errores costosos.",
    categoria: "Consejo"
  }
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animación de float para el logo
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
  }, []);

  // Rotación de tips cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTipIndex((prev) => (prev + 1) % FRASES_FISCALES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  };

  // Convertir HTML a texto plano (quitar <strong> tags)
  const cleanText = (htmlText: string) => {
    return htmlText.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
  };

  const currentFrase = FRASES_FISCALES[currentTipIndex];

  return (
    <LinearGradient
      colors={['#f8f7f4', '#ffffff']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {/* Decoraciones de fondo con blur */}
      <View style={[styles.blurCircle, styles.blurCircleTeal1]} />
      <View style={[styles.blurCircle, styles.blurCircleRed]} />
      <View style={[styles.blurCircle, styles.blurCircleTeal2]} />

      {/* Contenido */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View 
          style={[
            styles.logoSection,
            { transform: [{ translateY: floatAnim }] }
          ]}
        >
          <View style={styles.logoWrapper}>
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
          </View>
          
          <Text style={styles.appTitle}>Calculadora ISR</Text>
          <Text style={styles.appSubtitle}>Tu herramienta fiscal inteligente</Text>
        </Animated.View>

        {/* Fact Section */}
        <Animated.View style={[styles.factSection, { opacity: fadeAnim }]}>
          <View style={styles.factCard}>
            <View style={styles.factBorder} />
            <View style={styles.factLabel}>
              <MaterialCommunityIcons name="lightbulb-on" size={14} color="#004a4a" />
              <Text style={styles.factLabelText}>{currentFrase.categoria}</Text>
            </View>
            <Text style={styles.factText}>
              {cleanText(currentFrase.texto)}
            </Text>
          </View>
        </Animated.View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handlePress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#004a4a', '#0a2127']}
                style={styles.ctaButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.ctaButtonText}>Comenzar</Text>
                <MaterialCommunityIcons name="arrow-right" size={22} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <Text style={styles.versionText}>Versión 1.0 • Díaz Lara</Text>
          
          {/* Bottom indicator (iPhone home indicator) */}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Decoraciones de fondo
  blurCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blurCircleTeal1: {
    width: 400,
    height: 400,
    backgroundColor: '#004a4a',
    top: -200,
    right: -150,
    opacity: 0.12,
  },
  blurCircleRed: {
    width: 300,
    height: 300,
    backgroundColor: '#780109',
    bottom: -100,
    left: -100,
    opacity: 0.08,
  },
  blurCircleTeal2: {
    width: 200,
    height: 200,
    backgroundColor: '#004a4a',
    bottom: 200,
    right: -50,
    opacity: 0.06,
  },
  
  // Content
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  
  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoWrapper: {
    marginBottom: 28,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 10,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#231f20',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 15,
    color: '#4c4545',
    textAlign: 'center',
    fontWeight: '400',
  },
  
  // Fact Section
  factSection: {
    paddingHorizontal: 10,
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 74, 74, 0.1)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
    position: 'relative',
  },
  factBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#004a4a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  factLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  factLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#004a4a',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  factText: {
    fontSize: 16,
    lineHeight: 25,
    color: '#2c2627',
    fontWeight: '400',
  },
  
  // CTA Section
  ctaSection: {
    gap: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#004a4a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#4c4545',
    opacity: 0.7,
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#2c2627',
    borderRadius: 100,
    marginTop: 16,
    alignSelf: 'center',
    opacity: 0.2,
  },
});