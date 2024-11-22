import { Tabs, Redirect, router } from 'expo-router';
import React, { useEffect } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { black, Colors, white } from '@/constants/Colors';
import useColorSchemeTheme, { useColorScheme } from '@/hooks/useColorScheme';
import { useCartStore, useIsAppFirstLaunchStore } from '@/store/appStore';
import { Dimensions, Modal, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import Slider from '@/components/Slider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFont } from '@/provider/FontContext';
import Loader from '@/components/Loader';

export default function TabLayout() {
  const colorScheme = useColorSchemeTheme();
  const theme = useColorSchemeTheme();
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const showIntro = useIsAppFirstLaunchStore((state) => state.showIntro);
  const { hideIntro } = useIsAppFirstLaunchStore();
  const cart = useCartStore((state) => state.cart)

  const { fontsLoaded, fontStyles } = useFont();

  // Check for first launch before rendering the component
  useEffect(() => {
    if (firstLaunch) {
      router.replace('/(auth)/landing');
    }
  }, [firstLaunch]);

  if (firstLaunch) {
    return <Loader/>
  }

  const IntroModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showIntro}
        onRequestClose={hideIntro}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText type="semititle">Welcome to MeSure!</ThemedText>
            <Slider />
          </ThemedView>
        </ThemedView>
      </Modal>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: styles.floatingTabBar, // Apply custom floating style
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            ),
            headerShown: false,
            headerTitle: 'MeSure',
            headerShadowVisible: true,
            headerTintColor: '#fff',
            
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'heart' : 'heart-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarStyle: { display: 'none' },
            tabBarButton:() => null,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'cart' : 'cart-outline'}
                color={color}
              />
            ),
            tabBarBadge: cart.length,
            tabBarBadgeStyle: {
              backgroundColor: Colors.light.tint,
              color: theme === 'light' ? white : black
            }
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'person-circle' : 'person-circle-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            tabBarButton:() => null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="permissions"
          options={{
            headerShown: true,
            tabBarButton:() => null,
            headerTitle: 'Permissions',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 25,
              fontFamily: fontStyles.montserratBold
            },
            headerLeft: () => {
              return (
                <TouchableOpacity 
                  style={{left:20}}
                  onPress={() => router.back()}
                >
                  <Ionicons
                    name="return-up-back"
                    size={32}
                  />
                </TouchableOpacity>
              )
            },
            headerBackgroundContainerStyle: {
              
            }
          }}
        />
      </Tabs>
      <IntroModal />
    </>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: 20, // Adjust to control floating height
    left: 60,
    right: 60,
    height: 60, // Adjust height as needed
    borderRadius: 30, // Makes it fully rounded
    paddingBottom: 6,
    backgroundColor: 'white', // Customize the background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Adds shadow for Android
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '85%',
    height: '75%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
