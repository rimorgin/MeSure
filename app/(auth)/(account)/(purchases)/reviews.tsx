import FocusAwareStatusBar from "@/components/navigation/FocusAwareStatusBarTabConf";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useColorSchemeTheme from "@/hooks/useColorScheme";
import { useOrderStore } from "@/store/appStore";
import { OrderItem } from "@/types/useOrderStoreTypes";
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

export default function Reviews() {
  const theme = useColorSchemeTheme();
  const { orders } = useOrderStore();
  const [deliveredOrdersToReview, setDeliveredOrdersToReview] = useState<OrderItem[]>([]);

  useEffect(() => {
    const findDeliveredOrders = orders.filter((orders) => orders.status === 'delivered')
    if (!findDeliveredOrders) {
      return
    }
    setDeliveredOrdersToReview(findDeliveredOrders)
  },[orders])

  return (
    <ThemedView style={styles.mainContainer}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content': 'light-content'} animated />
      
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require('@/assets/images/noreviews.png')}
      />
      <ThemedText 
        font="cocoGothicBold"
        type="subtitle"
        style={{marginTop: -50}}
      >no orders to review yet...
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
      width: 300,
      height: 300,
      marginTop: -120
    }
})