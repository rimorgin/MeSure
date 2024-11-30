import FocusAwareStatusBar from "@/components/navigation/FocusAwareStatusBarTabConf";
import { OrderCard } from "@/components/ThemedCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useColorSchemeTheme from "@/hooks/useColorScheme";
import { OrderItem, useOrderStore } from "@/store/appStore";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Shipped() {
  const theme = useColorSchemeTheme();
  const { orders } = useOrderStore();
  const [shippedOrders, setShippedOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (orders) {
      const shipped = orders.filter((order) => order.status === "shipped");
      setShippedOrders(shipped);
    }
  }, [orders]);

  return (
    <ThemedView style={styles.mainContainer}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content': 'light-content'} animated />
      
      <FlashList
        data={shippedOrders}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={200}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => {
          return(
            <OrderCard  item={item} onPress={() => {}}/>
          )
        }}
        ListEmptyComponent={
          <Image
            source={require("@/assets/images/noOrders.png")}
            style={{height: 250,width: 250, alignSelf: 'center'}}
          />
        }
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      width: '100%',
      height: '100%',
      padding: 5,
      backgroundColor: '#F7F3EB',
    },
    orderItem: {
      padding: 16, // Add spacing around the item
      borderBottomWidth: 1, // Optional: Add a divider between items
      borderColor: '#ccc', // Divider color
    },
})