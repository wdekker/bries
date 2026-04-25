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
        <title>Nimbus - Weather Forecast</title>
        <meta name="description" content="A beautiful, high-performance, cross-platform weather application built with Expo and React Native." />
        <meta property="og:title" content="Nimbus - Weather Forecast" />
        <meta property="og:description" content="A beautiful, cross-platform weather application." />
        <meta property="og:url" content="https://nimbus.dekker.dev" />
        <meta property="og:type" content="website" />
        <script dangerouslySetInnerHTML={{ __html: `window.goatcounter = { path: function(p) { return '/nimbus' + (p || '/') } };` }} />
        <script data-goatcounter="https://dekker-dev.goatcounter.com/count" async src="//gc.zgo.at/count.js" />
      </Head>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
