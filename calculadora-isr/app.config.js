// app.config.js
// Config dinámica: idéntica a la producción publicada por defecto, pero
// cuando EAS arma el perfil "development" (ver eas.json → env.APP_VARIANT)
// separa nombre, bundle ID / package e icono para que el development build
// quede como un ícono aparte en el teléfono y nunca se confunda con la app
// real de la tienda.
//
// Producción (com.calculadoradeisr / com.calculadorafiscal) NO cambia.

const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = {
  expo: {
    name: IS_DEV ? 'Calculadora Fiscal (Dev)' : 'Calculadora Fiscal',
    slug: 'calculadora-isr-mexico',
    version: '1.1.2',
    runtimeVersion: '1.1.2',
    updates: { url: 'https://u.expo.dev/2b569166-2a26-4963-8059-66ae626a1252' },
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: IS_DEV ? 'calculadoraisrmexicodev' : 'calculadoraisrmexico',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0F172A',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? 'com.calculadoradeisr.dev' : 'com.calculadoradeisr',
      buildNumber: '11',
      infoPlist: { ITSAppUsesNonExemptEncryption: false },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#0F172A',
      },
      package: IS_DEV ? 'com.calculadorafiscal.dev' : 'com.calculadorafiscal',
      versionCode: 5,
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#0F172A',
          dark: {
            backgroundColor: '#0F172A',
          },
        },
      ],
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: '2b569166-2a26-4963-8059-66ae626a1252',
      },
    },
  },
};
