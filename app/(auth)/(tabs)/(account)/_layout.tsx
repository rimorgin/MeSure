import React from 'react'
import { Stack } from 'expo-router'

export default function AccountLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown:false, 
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen name='editprofile' />
      <Stack.Screen name='addresses' />
    </Stack>
  )
}