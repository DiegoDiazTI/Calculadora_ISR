// constants/DiazLaraTheme.ts
// Paleta de colores corporativa de Díaz Lara

export const DiazLaraColors = {
  // Colores corporativos principales
  tealPrimary: '#004a4a',      // Elementos activos, botones, acentos
  tealDark: '#0a2127',         // Gradientes, fondos oscuros
  accentRed: '#780109',        // Hover effects, elementos secundarios
  grayDark: '#2c2627',         // Texto primario (modo oscuro), fondos de tarjetas
  cream: '#f8f7f4',            // Fondo principal (modo claro)
  
  // Variaciones y utilidades
  tealLight: '#005a5a',
  tealTranslucent: 'rgba(0, 74, 74, 0.1)',
  redHover: '#8b0109',
  white: '#FFFFFF',
  black: '#000000',
  
  // Grises para textos
  textDark: '#2c2627',
  textGray: '#6b7280',
  textLight: '#9ca3af',
  
  // Borders y dividers
  border: 'rgba(0, 74, 74, 0.15)',
  borderLight: 'rgba(0, 74, 74, 0.08)',
};

export const DiazLaraTheme = {
  dark: {
    // Backgrounds
    background: '#000000',
    cardBackground: DiazLaraColors.grayDark,
    inputBg: 'rgba(255, 255, 255, 0.05)',
    detailCard: 'rgba(0, 74, 74, 0.15)',
    
    // Text colors
    text: '#FFFFFF',
    textSecondary: '#E5E7EB',
    textTertiary: '#9CA3AF',
    
    // Accent colors
    accent: DiazLaraColors.tealPrimary,
    accentLight: DiazLaraColors.tealLight,
    accentHover: DiazLaraColors.accentRed,
    
    // Borders
    border: DiazLaraColors.border,
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    
    // Status bar
    statusBar: 'light-content' as const,
  },
  
  light: {
    // Backgrounds
    background: DiazLaraColors.cream,
    cardBackground: '#FFFFFF',
    inputBg: '#FFFFFF',
    detailCard: DiazLaraColors.tealTranslucent,
    
    // Text colors
    text: DiazLaraColors.textDark,
    textSecondary: DiazLaraColors.textGray,
    textTertiary: DiazLaraColors.textLight,
    
    // Accent colors
    accent: DiazLaraColors.tealPrimary,
    accentLight: DiazLaraColors.tealLight,
    accentHover: DiazLaraColors.accentRed,
    
    // Borders
    border: DiazLaraColors.borderLight,
    inputBorder: DiazLaraColors.borderLight,
    
    // Status bar
    statusBar: 'dark-content' as const,
  },
};

// Sombras corporativas
export const DiazLaraShadows = {
  card: {
    shadowColor: DiazLaraColors.tealPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHover: {
    shadowColor: DiazLaraColors.tealPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  focus: {
    shadowColor: DiazLaraColors.tealPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};

// Tipografía corporativa
export const DiazLaraTypography = {
  // Font families
  fontFamily: {
    regular: 'Roboto',
    mono: 'RobotoMono',
  },
  
  // Títulos principales
  h1: {
    fontSize: 28,
    fontWeight: '900' as const,
    fontFamily: 'Roboto',
    letterSpacing: -0.5,
  },
  
  // Subtítulos
  h2: {
    fontSize: 16,
    fontWeight: '700' as const,
    fontFamily: 'Roboto',
    letterSpacing: 0,
  },
  
  h3: {
    fontSize: 14,
    fontWeight: '700' as const,
    fontFamily: 'Roboto',
    letterSpacing: 0,
  },
  
  // Texto del cuerpo
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Roboto',
    lineHeight: 20,
  },
  
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'Roboto',
    lineHeight: 20,
  },
  
  // Labels y etiquetas
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  
  labelBold: {
    fontSize: 13,
    fontWeight: '700' as const,
    fontFamily: 'Roboto',
    letterSpacing: 0.3,
  },
  
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: 'Roboto',
    letterSpacing: 0.2,
  },
  
  // Números (inputs, tablas)
  number: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: 'RobotoMono',
    letterSpacing: -0.5,
  },
  
  numberLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'RobotoMono',
    letterSpacing: -0.5,
  },
  
  numberSmall: {
    fontSize: 18,
    fontWeight: '700' as const,
    fontFamily: 'RobotoMono',
    letterSpacing: -0.3,
  },
};

// Espaciados corporativos
export const DiazLaraSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Padding de frame
  framePadding: 20,
  
  // Padding de tarjetas
  cardPadding: 18,
  cardPaddingLarge: 24,
};

// Border radius corporativo
export const DiazLaraBorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 40, // Frame principal
  
  // Específicos
  card: 16,
  button: 12,
  input: 12,
  badge: 6,
};

// Animaciones corporativas
export const DiazLaraAnimations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    // cubic-bezier(0.4, 0, 0.2, 1)
    default: [0.4, 0, 0.2, 1],
  },
};

// Frases rotativas para splash (16 consejos fiscales)
export const DiazLaraTips = [
  "💡 Consejo: Guarda tus facturas digitales por 5 años",
  "📊 Dato: El RESICO tiene tasas desde 1% hasta 2.5%",
  "💼 Tip: Las deducciones reducen tu base gravable",
  "📱 Sabías que: Puedes deducir hasta el 15% de tus ingresos",
  "🎯 Importante: Presenta tu declaración antes del 30 de abril",
  "💰 Consejo: Revisa tu constancia de situación fiscal mensualmente",
  "📈 Dato: Actividad Empresarial permite deducciones completas",
  "🏢 Tip: Persona Moral tiene tasa fija del 30%",
  "📋 Importante: Conserva comprobantes de nómina y pagos",
  "💡 Sabías que: Puedes deducir gastos médicos mayores",
  "🎓 Consejo: Las colegiaturas son deducibles hasta cierto monto",
  "🏠 Dato: Los intereses hipotecarios son deducibles",
  "💼 Tip: Verifica que tus facturas cumplan requisitos fiscales",
  "📊 Importante: Calcula tu ISR mensual para evitar sorpresas",
  "🎯 Consejo: Consulta a un contador para optimizar tu carga fiscal",
  "💰 Dato: Los pagos provisionales se acreditan en tu declaración anual",
];

export default DiazLaraTheme;