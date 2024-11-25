import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function Orders() {
  return (
    <ThemedView style={styles.mainContainer}>
        <ThemedText>Orders</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    }
})