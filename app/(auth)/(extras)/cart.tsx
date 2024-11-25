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
import { CartItem, useCartStore, useUserStore } from '@/store/appStore';
import { appData } from '@/assets/data/appData';
import { FlashList } from '@shopify/flash-list';
import ThemedDivider from '@/components/ThemedDivider';
import { Swipeable } from 'react-native-gesture-handler';
import ThemedBottomSheet, { ThemedBottomSheetRef } from '@/components/ThemedBottomSheet';
import { ThemedCheckBox } from '@/components/ThemedCheckBox';

const { width, height } = Dimensions.get('screen')

export default function Cart() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);
  const bottomSheetRef = useRef<ThemedBottomSheetRef>(null);
  const { userId } = useUserStore();
  const { cart, addCheckOutCartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCartStore();
  const [checked, setChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
          id: item.id,
          img: item.img[0], 
          name: item.name,
          size: cartItem.size, // Cart-specific size
          quantity: cartItem.quantity, // Cart-specific quantity
          price: cartItem.price
        }));
      })
      .flat() ?? [];
  };


  // Get the cart items for rings and bangles based on size and id
  const cartRingItems = ringsCategory?.rings
    ? groupItemsByIdAndSize(ringsCategory.rings, cart ?? [])
    : [];

  const cartBangleItems = banglesCategory?.bangles
    ? groupItemsByIdAndSize(banglesCategory.bangles, cart ?? [])
    : [];


  // Combine both ring and bangle cart items
  const allCartItems = [
    ...(cartRingItems ?? []),
    ...(cartBangleItems ?? []),
  ];

  //console.log(JSON.stringify(allCartItems,null,2))

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    console.log('offset y', offsetY)
    if (offsetY > 150 && sheetIndex !== 0) {
      newSheetIndex(0);
    } else if (offsetY <= 100 && sheetIndex !== 1) {
      newSheetIndex(1);
    }
  };

  // Function to handle "Select All" logic
  const handleSelectAll = () => {
    if (checked) {
      // Uncheck all items
      setSelectedItems([]);
    } else {
      // Select all items
      setSelectedItems(allCartItems.map((item) => `${item.id}-${item.size}-${item.quantity}-${item.price}`));
    }
    setChecked(!checked);
  };

  // Handle individual item selection
  const toggleItemSelection = (itemKey: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey) // Remove item
        : [...prev, itemKey] // Add item
    );
  };

  // Calculate selected total price and items
  const selectedTotalPrice = cart
    .filter((item) => selectedItems.includes(`${item.id}-${item.size}-${item.quantity}-${item.price}`))
    .reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0);

  const selectedTotalItems = cart
    .filter((item) => selectedItems.includes(`${item.id}-${item.size}-${item.quantity}-${item.price}`))
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToCheckOut = () => {
    if (selectedItems.length !== 0) {
      // Process selected items to generate checkout items
      const itemsToCheckout = selectedItems
        .map((key) => {
          const [id, size] = key.split('-').map(Number);
          return allCartItems.find((item) => item.id === id && item.size === size);
        })
        .filter(Boolean) as CartItem[]; // Filter out undefined results

      // Set checkout cart items
      addCheckOutCartItems([...itemsToCheckout]);

      // Use itemsToCheckout directly for further operations
      //addCheckOutCartItems(itemsToCheckout); // Pass items directly to the function
      setSelectedItems([]); // Clear selections after adding to checkout
      router.push('/(extras)/checkout'); // Navigate to checkout
    }
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
      <ThemedView lightColor='#EFE8D8'
        style={[
          styles.swipedRow,
          { backgroundColor: theme === 'light' ? '#EBE0C6' : Colors.dark.background }
        ]}>
        <ThemedView transparent style={styles.swipedConfirmationContainer}>
          <ThemedText font='cocoGothicBold' >Are you sure?</ThemedText>
        </ThemedView>
        <TouchableOpacity 
          style={{
            width:'20%',
            marginRight: -5,
            backgroundColor: theme === 'light' ? darkBrown : Colors.dark.background,
            alignItems:'center'
          }}
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
            <ThemedText lightColor='#EFE8D8' style={styles.deleteButtonText}>Delete</ThemedText> 
        </Animated.View>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const swipeableKey = `${item.id}-${item.size}-${item.quantity}-${item.price}`;
    return (
      <>
        <Swipeable
          ref={(ref) => (swipeableRefs.current[swipeableKey] = ref)}
          key={swipeableKey}
          renderRightActions={(progress, dragX) =>
            renderRightActions(
              progress,
              dragX,
              item.id, // Use parent ID for operations
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
            <ThemedView style={{flexDirection:'row', gap:10}}>
              <ThemedCheckBox
                checked={selectedItems.includes(swipeableKey)}
                setChecked={() => toggleItemSelection(swipeableKey)}
              />
              <Image source={item.img} style={styles.image} />
            </ThemedView>
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
            name='chevron-back' 
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
      <ThemedView style={{flexDirection:'row', gap: 15, width: '100%', alignItems: 'center', paddingHorizontal: 25, marginLeft: 8, padding:10}}>
        <ThemedCheckBox 
          checked={checked} 
          setChecked={handleSelectAll} 
        />
        <ThemedText font='spaceMonoRegular'>Select All</ThemedText>
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
            keyExtractor={(item) => `${item.id.toString()}-${item.size}-${item.quantity}-${item.price}`}
            renderItem={renderItem}
            ListEmptyComponent={() => {
              return (
                <ThemedView style={styles.emptyScreenContainer}>
                  <Image 
                    style={styles.emptyScreenImage}
                    source={require('@/assets/images/noItemsEmoji.png')}
                  />
                  <ThemedText
                    style={{marginVertical: 15}}
                    type='subtitle'
                    font='glacialIndifferenceBold'
                  >
                    Your cart is empty
                  </ThemedText>
                  <ThemedTouchableFilled
                    onPress={() => router.push('/(auth)/(tabs)/')}
                  >
                    <ThemedText>Browse items</ThemedText>
                  </ThemedTouchableFilled>
                </ThemedView>
              )
            }}
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
                  {checked ? totalPrice() : selectedTotalPrice}
                </ThemedText>
              </ThemedView>
              <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                <ThemedText font='cocoGothicLight'>
                  Total Items
                </ThemedText>
                <ThemedText font='spaceMonoRegular'>
                  {checked ? totalItems() : selectedTotalItems}
                </ThemedText>
              </ThemedView>
           
            <ThemedTouchableFilled
              onPress={handleProceedToCheckOut}
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
  emptyScreenContainer: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyScreenImage: {
    height: width * 0.5,
    width: width * 0.5
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
    paddingTop: 0,
    marginTop: -35
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
    margin: 20,
    minHeight: 50,
    borderRadius: 10
  },
  swipedConfirmationContainer: {
    flex: 1,
    alignItems: 'center'
  },
  deleteConfirmationText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
  },
  deleteButton: {
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
