import { StyleSheet, Platform, SafeAreaView, StatusBar, View, Dimensions, TouchableOpacity, Image, ScrollView, FlatList, Animated } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors, darkBrown, tintColorDark, tintColorLight } from '@/constants/Colors';
import { useEffect, useRef, useState } from 'react';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { Drawer } from 'react-native-drawer-layout';
import { router } from 'expo-router';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { useCartStore, useUserIdStore } from '@/store/appStore';
import { appData } from '@/assets/data/appData';
import { FlashList } from '@shopify/flash-list';
import ThemedDivider from '@/components/ThemedDivider';
import { Swipeable } from 'react-native-gesture-handler';
import ThemedBottomSheet, { ThemedBottomSheetRef } from '@/components/ThemedBottomSheet';

const { width, height } = Dimensions.get('screen')

export default function Cart() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);
  const bottomSheetRef = useRef<ThemedBottomSheetRef>(null);
  const { userId } = useUserIdStore();
  const { cart, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCartStore();

  const snapPoints = ['20%', '40%']
  const [sheetIndex, newSheetIndex] = useState(1);

  const ringsCategory = appData.categories.find((category) => category.name === 'rings');
  const banglesCategory = appData.categories.find((category) => category.name === 'bangles');

  // Function to group items by their ID and Size in the cart
  const groupItemsByIdAndSize = (categoryItems: any[] | undefined, cartItems: any[]) => {
    return categoryItems
      ?.map((item) => {
        // Find all cart items matching this product by ID
        const matchingCartItems = cartItems.filter((cartItem) => cartItem.id === item.id);

        // Create a new object for each size/quantity combination
        return matchingCartItems.map((cartItem) => ({
          parentId: item.id, // Common parent ID
          ...item, // Base item details
          size: cartItem.size, // Cart-specific size
          quantity: cartItem.quantity, // Cart-specific quantity
        }));
      })
      .flat() ?? [];
  };


  // Get the cart items for rings and bangles based on size and id
  const cartRingItems = ringsCategory
    ? groupItemsByIdAndSize(ringsCategory.rings, cart)
    : [];

  const cartBangleItems = banglesCategory
    ? groupItemsByIdAndSize(banglesCategory.bangles, cart)
    : [];

  // Combine both ring and bangle cart items
  const allCartItems = [
    ...(cartRingItems ?? []),
    ...(cartBangleItems ?? []),
  ];

  const groupByParentId = (items: any[]) => {
    return items.reduce((acc, item) => {
      if (!acc[item.parentId]) {
        acc[item.parentId] = [];
      }
      acc[item.parentId].push(item);
      return acc;
    }, {});
  };

  // Group the items
  const groupedCartItems = groupByParentId(allCartItems);
  const groupedArray = Object.entries(groupedCartItems).map(([id, items]) => ({
    id,
    items,
  }));

  console.log('GROUPED all cart items with same id but have different size and quantity',JSON.stringify(groupedCartItems, null, 2))



  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    console.log('offset y', offsetY)
    if (offsetY > 150 && sheetIndex !== 0) {
      newSheetIndex(0);
    } else if (offsetY <= 100 && sheetIndex !== 1) {
      newSheetIndex(1);
    }
  };


  const openBottomSheet = () => bottomSheetRef.current?.open();
  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const increaseQuantity = (item: any) => updateQuantity(userId, item.id, item.quantity + 1, item.size, item.price);
  const decreaseQuantity = (item: any) => {
    if (item.quantity > 1) updateQuantity(userId, item.id, item.quantity - 1, item.size, item.price);
  };
  
  const adjustQuantity = (item: any, type: string) => {
    const newQuantity = type === "increment" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity > 0) updateQuantity(userId, item.id, newQuantity, item.size, item.price);
  };

  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  useEffect(() => {
    return () => {
      swipeableRefs.current = {};
    };
  }, []);


  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: number, 
    size: number,
    qty: number,
    price: string
  ) => {
    // Interpolate the dragX to determine the opacity and scale of the delete button
    const opacity = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const scale = dragX.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0.8], // Shrink the button as it gets closer to the end of swipe
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipedRow}>
        <View style={styles.swipedConfirmationContainer}>
          <ThemedText style={styles.deleteConfirmationText}>Are you sure?</ThemedText>
        </View>
        <TouchableOpacity 
          style={{width:'20%'}}
          onPress={() => removeFromCart(userId, id, size, qty, price)}>
        <Animated.View
          style={[
            styles.deleteButton,
            {
              opacity, 
              transform: [{ scale }],
            },
          ]}
        >
            <ThemedText style={styles.deleteButtonText}>Delete</ThemedText> 
        </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const swipeableKey = `${item.parentId}-${item.size}-${item.quantity}`;
    return (
      <>
        <Swipeable
          ref={(ref) => (swipeableRefs.current[swipeableKey] = ref)}
          key={swipeableKey}
          renderRightActions={(progress, dragX) =>
            renderRightActions(
              progress,
              dragX,
              item.parentId, // Use parent ID for operations
              item.size,
              item.quantity,
              item.price
            )
          }
          friction={2}
          overshootLeft={false}
          overshootRight={false}
          rightThreshold={40}
        >
          <ThemedView style={styles.itemContainer}>
            <Image source={item.img[0]} style={styles.image} />
            <ThemedView style={styles.details}>
              <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText font="montserratSemiBold">{item.name}</ThemedText>
                <TouchableOpacity
                  onPress={() => swipeableRefs.current[swipeableKey]?.openRight()}
                  hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                >
                  <Ionicons
                    name="trash"
                    size={20}
                    color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
              </ThemedView>
              <ThemedText
                font="montserratRegular"
                style={{ marginVertical: -10 }}
              >
                Size {item.size}
              </ThemedText>
              <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => adjustQuantity(item, 'decrement')}>
                    <AntDesign
                      name="minuscircleo"
                      size={24}
                      color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                    />
                  </TouchableOpacity>
                  <ThemedText font="itcNewBaskerville" style={styles.quantity}>
                    {item.quantity}
                  </ThemedText>
                  <TouchableOpacity onPress={() => adjustQuantity(item, 'increment')}>
                    <AntDesign
                      name="pluscircle"
                      size={24}
                      color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                    />
                  </TouchableOpacity>
                </View>
                <ThemedText font="spaceMonoRegular">Php {item.price}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Swipeable>
        <ThemedDivider width={0.5} />
      </>
    );
  };



  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,}]}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Ionicons 
            style={styles.filterButton}
            name='return-up-back' 
            size={30}
            backgroundColor='transparent'
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </TouchableOpacity>
        <ThemedView style={{
          flexDirection:'row', 
          alignItems:'center', 
          gap:10,
          justifyContent:'center'
        }}>
        <ThemedText 
          font='montserratSemiBold' 
          type='title' 
          lightColor={darkBrown}
        >My Cart
        </ThemedText>
        <ThemedText 
          font='itcNewBaskerville' 
          type='semititle' 
          lightColor={darkBrown}
          style={{backgroundColor:tintColorLight, paddingHorizontal: 7, borderRadius: 30, marginTop: 3}}
        >{cart.length}
        </ThemedText>
        </ThemedView> 
        <TouchableOpacity onPress={() => setOpenFilter(prev => !prev)}>
          <Ionicons 
            style={styles.filterButton}
            name='filter' 
            size={30}
            backgroundColor='transparent'
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </TouchableOpacity>
      </ThemedView>
      <Drawer
        drawerPosition='right'
        open={openFilter}
        onOpen={() => setOpenFilter(true)}
        onClose={() => setOpenFilter(false)}
        renderDrawerContent={() => (
          <View style={styles.drawerContent}>
            <ThemedText>Filter Options</ThemedText>
          </View>
        )}
      >
        <ThemedView style={styles.mainContent}>
          <FlatList
            data={allCartItems}
            keyExtractor={(item) => `${item.id.toString()}-${item.size}-${item.quantity}`}
            renderItem={renderItem}
            ListEmptyComponent={<ThemedText>No cart items found!</ThemedText>}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll} // Detect scroll here
            scrollEventThrottle={16} // Improves scroll performance
          />
          <View style={{paddingBottom:125}}/>
          <ThemedBottomSheet
            preventHiding
            index={sheetIndex}
            snapPoints={snapPoints}
            noBackDrop={true} 
            ref={bottomSheetRef}
          >
            <ThemedView style={styles.bottomSheetContainer}>
              <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                <ThemedText font='montserratSemiBold' type='subtitle'>
                  Cart Total
                </ThemedText>
                <ThemedText font='spaceMonoRegular' type='subtitle'>
                  {totalPrice()}
                </ThemedText>
              </ThemedView>
              <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                <ThemedText font='cocoGothicLight'>
                  Total Items
                </ThemedText>
                <ThemedText font='spaceMonoRegular'>
                  {totalItems()}
                </ThemedText>
              </ThemedView>
           
            <ThemedTouchableFilled
              onPress={() => console.log('Proceed to Checkout')}
              style={{width: '80%', alignSelf:'center', position: 'absolute', bottom: 20}}
            >
              <ThemedText font='montserratSemiBold' type='subtitle'>
                Proceed to Checkout
              </ThemedText>
            </ThemedTouchableFilled>
          </ThemedView>
          </ThemedBottomSheet>
        </ThemedView>
      </Drawer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 16,
  },
  list: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    gap: 20
  },
  swipedRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 5,
    backgroundColor: '#818181',
    margin: 20,
    minHeight: 50,
  },
  swipedConfirmationContainer: {
    flex: 1,
  },
  deleteConfirmationText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#b60000',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  deleteButtonText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
    padding: 3,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //borderColor: '#CCC',
    //borderWidth: 0.8,
    borderRadius: 5,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
    color: Colors.light.text,
  },
});
