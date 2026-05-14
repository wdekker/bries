import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Head>
        <title>Bries - Weather Forecast</title>
        <meta name="description" content="A beautiful, high-performance, cross-platform weather application built with Expo and React Native." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://api.open-meteo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.bigdatacloud.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api-bdc.io" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0f172a" />
        <meta property="og:title" content="Bries - Weather Forecast" />
        <meta property="og:description" content="A beautiful, cross-platform weather application." />
        <meta property="og:url" content="https://bries.dekker.dev" />
        <meta property="og:type" content="website" />
        <script 
          data-goatcounter="https://dekker-dev.goatcounter.com/count" 
          data-goatcounter-settings={JSON.stringify({ path: "/bries" })}
          async 
          src="//gc.zgo.at/count.js" 
        />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </Head>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
