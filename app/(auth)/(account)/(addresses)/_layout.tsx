import React from 'react'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFont } from '@/provider/FontContext'

export default function AccountLayout() {
  const { fontStyles } = useFont()
  return (
    <Stack 
      screenOptions={{
        headerShown:true, 
        animation: 'simple_push'
      }}
    >
      <Stack.Screen name='index' 
        options={{
          headerTitle: 'My Addresses',
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
      <Stack.Screen name='editaddress'
        options={{
          headerTitle: 'Edit address',
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
      <Stack.Screen name='addnewaddress' 
        options={{
          headerTitle: 'Add new address',
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
      <Stack.Screen name='pickaddress' 
        options={{
          presentation: 'modal',
          headerTitle: 'Change Address',
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
      <Stack.Screen name='selectregion' 
        options={{
          presentation: 'modal',
          headerTitle: 'Select Region',
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
    </Stack>
  )
}