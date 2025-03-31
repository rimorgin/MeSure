import { Image } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView';

export default function ImageViewer() {
  const { img } = useLocalSearchParams<{img: string}>();
  return (
    <ThemedView>
      <Image source={img}/>
    </ThemedView>
  )
}