import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Head } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

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
        <script type="text/javascript">{`window.goatcounter = { path: function(p) { return '/nimbus' + (p || '/') } };`}</script>
        <script data-goatcounter="https://dekker-dev.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
      </Head>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
