import { Stack } from 'expo-router'

export default function PurchasesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name='orders'
        options={{
          headerTitle: 'Orders',
        }}
      />
      <Stack.Screen 
        name='receive'
        options={{
          headerTitle: 'Receive',
        }}
      />
    </Stack>
  )
}