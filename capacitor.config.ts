import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ungakadai.medoctor',
  appName: 'Me & Doctor',
  webDir: 'dist',
  server: {
    // Capacitor serves the built app from a local origin (https://localhost
    // on Android by default) and calls the deployed Railway backend over
    // HTTPS via VITE_API_BASE_URL — same as the web build, no dev-server
    // proxying needed here. androidScheme stays 'https' so cookies/storage
    // behave consistently with the web version.
    androidScheme: 'https',
  },
  android: {
    // Keep the WebView's default (system) background instead of a flash
    // of white/black before the app's own cream background paints.
    backgroundColor: '#FAF6EE',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#FAF6EE',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
