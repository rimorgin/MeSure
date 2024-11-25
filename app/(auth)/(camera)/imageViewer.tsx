import { Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView';

export default function imageViewer() {
  const { img } = useLocalSearchParams();
  return (
    <ThemedView>
      <Image source={img}/>
    </ThemedView>
  )
}