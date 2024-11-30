import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/provider/AuthContext';
import { useCartStore, useFavoritesStore, useIsAppFirstLaunchStore, useOrderStore, useShippingDetailsStore, useUserMeasurementStorage, useUserStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const userId = useUserStore((state) => state.userId);
  const firstTimeUser = useUserStore((state) => state.firstTimeUser);
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { getUserDetails } = useUserStore();
  const { fetchMeasurements } = useUserMeasurementStorage();
  const { fetchFavorites } = useFavoritesStore();
  const { fetchCart } = useCartStore();
  const { fetchOrders } = useOrderStore();
  const { fetchShippingDetails } = useShippingDetailsStore();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      //await fetchMeasurements(userId);
      //await fetchFavorites(userId);
      //await fetchCart(userId);
      //await fetchOrders(userId);
      //await fetchShippingDetails(userId);
      //fetchShippingDeets if needed
    }

    if (userId && !firstTimeUser) {
      setFetching(true);
      fetchAsync();
    }

    if (userId) {
      // Load the defaults
      getUserDetails(userId);
      setFetching(true);
    }

    // Set a timeout to set fetching to false after 3 seconds
    const timer = setTimeout(() => {
      setFetching(false);
    }, 3000); // 3000 milliseconds (3 seconds)

    // Cleanup timeout when effect reruns or when the component unmounts
    return () => clearTimeout(timer);

  }, [userId, firstTimeUser]);

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
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="landing"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="(account)" />
      <Stack.Screen name="(camera)" />
      <Stack.Screen name="product/[id]" />
    </Stack>
  );
}