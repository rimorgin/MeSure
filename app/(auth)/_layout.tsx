import { Redirect, router, Stack } from 'expo-router';

import { useSession } from '@/provider/AuthContext';
import { ThemedText } from '@/components/ThemedText';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
      <Stack>
        <Stack.Screen name="landing" options={{ presentation: 'modal', headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
      </Stack>
    )
}