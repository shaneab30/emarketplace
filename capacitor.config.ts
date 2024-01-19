import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shane.markethub',
  appName: 'markethub',
  webDir: '.next/server/app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
