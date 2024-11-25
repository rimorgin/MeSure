import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function Receive() {
  return (
    <ThemedView style={styles.mainContainer}>
        <ThemedText>Receive</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    }
})