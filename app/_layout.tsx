import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, router, Stack, Slot } from 'expo-router';
import { SessionProvider } from "@/provider/AuthContext";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/hooks/useColorScheme';
import { toastConfig } from '@/components/Toast';
import { FontProvider } from '@/provider/FontContext';
import NetInfo from '@react-native-community/netinfo';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
 /*
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
 */

  const unsubscribe = NetInfo.addEventListener(state => {
    console.log('Is connected to internet?', state.isConnected);
  });

  
  return (
    <SessionProvider>
      <FontProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Slot />
          <Toast config={toastConfig} position='top' topOffset={20}/>
        </ThemeProvider>
      </FontProvider>
    </SessionProvider>
  );
}
