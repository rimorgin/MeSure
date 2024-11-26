import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/provider/AuthContext';
import { useCartStore, useFavoritesStore, useIsAppFirstLaunchStore, useUserStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const userId = useUserStore((state) => state.userId);
  const firstTimeUser = useUserStore((state) => state.firstTimeUser);
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { getUserFullName } = useUserStore();
  const { fetchFavorites } = useFavoritesStore();
  const { fetchCart } = useCartStore();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (userId && !firstTimeUser) {
      fetchFavorites(userId);
      fetchCart(userId);
      setFetching(true)
    } 
    if (userId){
      //load the defaults
      getUserFullName(userId);
      setFetching(true)
    }
    setFetching(false)
  },[userId, firstTimeUser])

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
    <ThemedView style={{width:'100%', height:'100%'}}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        style={{width:'100%', height:'100%'}}
      />
    </ThemedView>
    )
  }

  if (fetching) {
    return (
    <ThemedView style={{width:'100%', height:'100%'}}>
      <Image
        source={require('@/assets/images/splash-icon.png')}
        style={{width:'100%', height:'100%'}}
      />
    </ThemedView>
    )
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  // Determine the initial route
  const initialRoute = firstLaunch ? 'landing' : '(tabs)';

  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{ 
        headerShown: false, 
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen
        name="landing"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(camera)" />
      <Stack.Screen name="(extras)" />
      <Stack.Screen name="product/[id]" />
    </Stack>
  );
}