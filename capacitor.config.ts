import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.afran.onlinecentre',
  appName: 'AFRAN ONLINE CENTRE',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false
  }
};

export default config;
