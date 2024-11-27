import { useFont } from '@/provider/FontContext'
import { Ionicons } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export default function PurchasesLayout() {
  const { fontStyles } = useFont()
  return (
    <Stack 
      screenOptions={{
        headerShown: true,
        animation: 'fade_from_bottom'
      }}
    >
      <Stack.Screen 
        name='(orders)'
        options={{
          headerTitle: 'Orders',
          headerShown: true,
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
      <Stack.Screen 
        name='reviews'
        options={{
          headerTitle: 'Reviews',
          headerShown: true,
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