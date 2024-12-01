import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/provider/AuthContext';
import { useCartStore, useFavoritesStore, useIsAppFirstLaunchStore, useOrderStore, usePaymentMethodsStore, useShippingDetailsStore, useUserMeasurementStorage, useUserStore } from '@/store/appStore';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'react-native';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const userId = useUserStore((state) => state.userId);
  const firstTimeUser = useUserStore((state) => state.firstTimeUser);
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { fetchUserData, getUserDetails } = useUserStore();
  const { fetchMeasurements } = useUserMeasurementStorage();
  const { fetchFavorites } = useFavoritesStore();
  const { fetchCart } = useCartStore();
  const { fetchOrders } = useOrderStore();
  const { fetchShippingDetails } = useShippingDetailsStore();
  const { fetchPaymentMethods } = usePaymentMethodsStore()
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        // Fetch all data in one go
        const userData = await fetchUserData();

        // Conditionally fetch additional data
        if (userData?.measurements) await fetchMeasurements(userData.measurements);
        if (userData?.favorites) await fetchFavorites(userData.favorites);
        if (userData?.cart) await fetchCart(userData.cart);
        if (userData?.orders) await fetchOrders(userData.orders);
        if (userData?.shippingDetails) await fetchShippingDetails(userData.shippingDetails);
        if (userData?.paymentMethods) await fetchPaymentMethods(userData?.paymentMethods);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetching(false); // Ensure loading state is cleared
      }
    };

    if (userId && !firstTimeUser) {
      setFetching(true); // Set loading state
      fetchAsync(); // Call async function
    }

    if (userId) {
      getUserDetails(userId); // Load defaults
    }
  }, [userId, firstTimeUser])


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