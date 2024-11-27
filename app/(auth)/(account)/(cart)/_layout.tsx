import React from 'react'
import { Stack } from 'expo-router'

export default function ExtrasLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown:false, 
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='checkout' />
      <Stack.Screen name='ordersummary' />
    </Stack>
  )
}