import { StyleSheet } from 'react-native'
import React from 'react'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';

export default function Accounts() {
  const theme = useColorSchemeTheme();
  return (
    <ThemedView style={styles.container}>
    <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content': 'light-content'} animated />
     <ThemedView style={{flex: 1}}>
      <ThemedText>Accounts Settings</ThemedText>
     </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})