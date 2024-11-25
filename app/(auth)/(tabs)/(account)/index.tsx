import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Accounts() {
  const theme = useColorSchemeTheme();
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,}]}>
     <ThemedView style={{flex: 1}}>
      <ThemedText>Accounts Settings</ThemedText>
     </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})