import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useIsAppFirstLaunchStore } from '@/state/appStore'

function Landing() {
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const setFirstLaunch = useIsAppFirstLaunchStore((state) => state.setFirstLaunch);
  
  const handlePress = () => {
    setFirstLaunch();
    router.push('/(auth)/(tabs)/')
  }

  return (
    <SafeAreaView>
        <ThemedView>
            <ThemedText>Hello</ThemedText>
            <TouchableOpacity onPress={handlePress}><ThemedText>Get Started</ThemedText></TouchableOpacity>
            <ThemedText>firstLaunch {firstLaunch.toString()}</ThemedText>
        </ThemedView>
    </SafeAreaView>
  )
}

export default Landing