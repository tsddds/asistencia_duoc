import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Asis_Duoc',
  webDir: 'www',
  server: {
    androidScheme: 'http',  // Permitir HTTP en lugar de HTTPS
    cleartext: true          // Permitir tráfico sin cifrar en Android (HTTP)
  }
};

export default config;
