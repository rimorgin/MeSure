import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import useColorSchemeTheme from '@/hooks/useColorScheme'

const { width, height } = Dimensions.get('screen')

export default function AddNewAddress() {
  const theme = useColorSchemeTheme();

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,}]}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})