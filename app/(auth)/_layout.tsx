import { Redirect, router, Stack } from 'expo-router';

import { useSession } from '@/provider/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore, useFavoritesStore, useIsAppFirstLaunchStore, useUserIdStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const userId = useUserIdStore((state) => state.userId);
  const firstTimeUser = useUserIdStore((state) => state.firstTimeUser);
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { getUserFullName } = useUserIdStore();
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

  return (
      <Stack initialRouteName={firstLaunch ? 'landing' : '(tabs)'}>
        <Stack.Screen name="landing" options={{ presentation: 'modal', headerShown: false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
      </Stack>
    )
}