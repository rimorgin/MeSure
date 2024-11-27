import FocusAwareStatusBar from "@/components/navigation/FocusAwareStatusBarTabConf";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useColorSchemeTheme from "@/hooks/useColorScheme";
import { StyleSheet } from "react-native";

export default function Returns() {
  const theme = useColorSchemeTheme();
  return (
    <ThemedView style={styles.mainContainer}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content': 'light-content'} animated />
      <ThemedText>Returns</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
})