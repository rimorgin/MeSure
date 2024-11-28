import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFont } from '@/provider/FontContext'

export default function AccountLayout() {
  const { fontStyles } = useFont();
  return (
    <Stack 
      screenOptions={{
        headerShown:false, 
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen name='index' 
        options={{
          headerShown: true,
          headerTitle: 'Account settings',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.replace('/(auth)/(tabs)/profile')}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='editprofile'
        options={{
          headerShown: true,
          headerTitle: 'Edit profile',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='(cart)'/>
      <Stack.Screen name='(purchases)' />
      <Stack.Screen name='(addresses)' />
    </Stack>
  )
}