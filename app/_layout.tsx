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
import { useNetInfo } from "@react-native-community/netinfo";



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isConnected } = useNetInfo();
 /*
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
 */

    useEffect(() => {
      // Trigger a toast notification when the connection status changes
      if (isConnected === false) {
        Toast.show({
          type: 'error',
          text1: 'Connection Lost',
          text2: 'You are currently offline.',
        });
      } else if (isConnected === true) {
        Toast.show({
          type: 'success',
          text1: 'Connected',
          text2: 'You are back online.',
        });
      }
  }, [isConnected]);


  
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
