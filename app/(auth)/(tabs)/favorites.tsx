import { StyleSheet, Platform, SafeAreaView, StatusBar, View, FlatList, Image, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors, darkBrown, tintColorLight, white } from '@/constants/Colors';
import { useEffect, useRef, useState } from 'react';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { Drawer } from 'react-native-drawer-layout';
import { appData } from '@/assets/data/appData';
import { useCartStore, useFavoritesStore, useUserIdStore } from '@/store/appStore';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { router } from 'expo-router';
import { ratingStars } from '@/utils/ratings';
import ThemedDivider from '@/components/ThemedDivider';

const { width, height } = Dimensions.get('screen')

export default function Favorites() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);
  const userId = useUserIdStore((state) => state.userId);
  // Fetch favorites and actions from the Zustand store
  const { favorites, addFavorite, removeFavorite, isFavorite, fetchFavorites } = useFavoritesStore((state) => state);
  const { cart, addToCart } = useCartStore();
  const [sizes, setSize] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const ringsCategory = appData.categories.find((category) => category.name === 'rings');
  const banglesCategory = appData.categories.find((category) => category.name === 'bangles');

  const favoriteRings = ringsCategory ? ringsCategory?.rings?.filter((ring) =>
    favorites.includes(ring.id)
  ) : [];

  const favoriteBangles = banglesCategory ? banglesCategory?.bangles?.filter((bangle) =>
    favorites.includes(bangle.id)
  ) : [];

  const allFavorites = [
    ...(favoriteRings ?? []), 
    ...(favoriteBangles ?? [])
  ];

  const handleDelete = (itemId: number) => {
    // Handle deletion of the item from favorites here
    removeFavorite(userId, itemId);
  };

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : prev));

  const handleSelectedSize = (size:number) => {
    if (size === sizes) {
      setSize(0);
      return;
    }
    setSize(size)
  }
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
          onPress={() => handleDelete(id)}>
        <Animated.View
          style={[
            styles.deleteButton,
            {
              opacity, 
              transform: [{ scale }],
            },
          ]}
        >
            <ThemedText lightColor='#EBE0C6'>Delete</ThemedText> 
        </Animated.View>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: number,
    size: number[], 
    price: string
  ) => {

    const handleAddToCart = () => {
      if (quantity > 0 && sizes !== 0) {
        const cartItem = { 
          id: id,
          quantity: quantity,
          size: sizes,
          price: price,
        }
        addToCart(userId, cartItem)
        setQuantity(0);
        setSize(0);
      }
    }

    const opacity = dragX.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <ThemedView 
        lightColor='#EFE8D8'
        style={[
          styles.swipedRow,
          { backgroundColor: theme === 'light' ? '#EBE0C6' : Colors.dark.background }
        ]}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={{
            width:'20%', 
            marginLeft: -5,
            marginRight: 5,
            backgroundColor: theme === 'light' ? darkBrown : Colors.dark.background
          }}
          >
        <Animated.View
          style={[
            styles.addToCart,
            {
              opacity,
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <FontAwesome6
            name="cart-plus" 
            style={{alignSelf:'center'}}
            size={30} 
            color={theme==='light' ? '#EBE0C6' : Colors.light.icon} 
          />
        </Animated.View>
        </TouchableOpacity>
        <ThemedView  transparent style={{gap: 15}}>
          <ThemedView transparent>
            <ThemedView  transparent style={{flexDirection: 'row', justifyContent: 'space-between', width: '60%'}}>
              <ThemedText style={{marginHorizontal: 15}}>quantity</ThemedText>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={decrement}>
                  <AntDesign 
                    name="minuscircleo" 
                    size={24} 
                    color={theme==='light' ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
                <ThemedText style={styles.quantity}>{quantity}</ThemedText>
                <TouchableOpacity onPress={increment}>
                  <AntDesign 
                    name="pluscircle" 
                    size={24} 
                    color={theme==='light' ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
              </View>
            </ThemedView>
          </ThemedView>
          <ThemedView transparent>
            <ThemedView transparent style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingRight: 100}}>
              <ThemedText style={{marginHorizontal: 15}}>size</ThemedText>
              <FlatList
                data={size}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                renderItem={({ item }) => {
                  const isSelected = item === sizes; 
                  return (
                  <TouchableOpacity 
                    style={[
                      styles.sizesButton,
                      isSelected && {backgroundColor:'#D4AF37'}
                    ]}
                    onPress={() => handleSelectedSize(item)}
                  >
                    <ThemedText>{item}</ThemedText>
                  </TouchableOpacity>
                )}}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };


  const renderItem = (item: { id: number; img: any[]; name: string; sizes: number[]; description: string; rating: number; sold: number; price: string; stock: number; AR: boolean; }, index: number, items: any[]) => {
    const swipeableKey = `${item.id.toString()}`;
    const isLastItem = index === items.length - 1;
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
          )}
          renderLeftActions={(progress, dragX) => 
            renderLeftActions(
              progress,
              dragX,
              item.id,
              item.sizes,
              item.price
            )
          }
          friction={2}
          overshootLeft={false}
          overshootRight={false}
          rightThreshold={40}
          leftThreshold={40}
        >
        <ThemedView style={styles.itemContainer}>
          <Image source={item.img[0]} style={styles.image} />
          <ThemedView style={styles.details}>
             <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText font="montserratSemiBold">{item.name}</ThemedText>
                <TouchableOpacity
                  onPress={() => swipeableRefs.current[swipeableKey]?.openRight()}
                  hitSlop={{ top: 10, bottom: 10, left: 80, right: 80 }}
                >
                  <Ionicons
                    name="trash"
                    size={25}
                    color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
              </ThemedView>
              <ThemedView style={{flexDirection: 'row', gap: 5}}>
                <ThemedText
                  font="montserratRegular"
                  style={{ marginVertical: 5 }}
                >
                  Sizes
                </ThemedText>
                <FlatList
                  data={item.sizes}
                  renderItem={({ item }) => (
                    <ThemedText 
                      font="montserratRegular"
                      style={{ marginRight: 5 }}
                    >{item}
                    </ThemedText>
                  )}
                  keyExtractor={(item, index) => index.toString()} // Add a key extractor for proper list rendering
                  horizontal // This ensures the items are displayed in a row
                  showsHorizontalScrollIndicator={false} // Optional: Hides the horizontal scroll indicator
                  contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                />
              </ThemedView>
              <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <ThemedView style={{flexDirection: 'row', gap:10, justifyContent: 'center', alignItems:'center'}}>
                  <ThemedText
                    font='glacialIndifferenceBold'
                  >{`(${item.sold}) `}
                  </ThemedText>
                  <ThemedText
                  >{ratingStars(item.rating)}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity
                  onPress={() => swipeableRefs.current[swipeableKey]?.openLeft()}
                  hitSlop={{ top: 10, bottom: 10, left: 80, right: 80 }}
                >
                  <Ionicons
                    name="cart"
                    size={25}
                    color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                  />
                </TouchableOpacity>
              </ThemedView>
          </ThemedView>
        </ThemedView>
      </Swipeable>
      {!isLastItem && <ThemedDivider />}
      </>
    );
  };
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,}]}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
      <ThemedView style={styles.header}>
        <ThemedText font='montserratBold' type='title'>Favorites</ThemedText>
        <ThemedView style={{flexDirection:'row', gap: 5, alignItems:'center'}}>
          <TouchableOpacity
           onPress={() => setOpenFilter((prev) => !prev)}>
            <Ionicons
              style={styles.filterButton}
              name="filter"
              size={30}
              backgroundColor="transparent"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/cart')}>
            <Ionicons
              style={styles.cartButton}
              name="cart-sharp"
              size={24}
              color={tintColorLight}
            />
            <ThemedView style={styles.cartCount}>
              <ThemedText customColor={white}>{cart.length}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
        
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
        <FlatList
          data={allFavorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, index}) => renderItem(item, index, allFavorites)}
          ListEmptyComponent={() => {
              return (
                <ThemedView style={styles.emptyScreenContainer}>
                  <Image 
                    style={styles.emptyScreenImage}
                    source={require('@/assets/images/noItemsEmoji3.png')}
                  />
                  <ThemedText
                    style={{marginVertical: 15}}
                    type='subtitle'
                    font='glacialIndifferenceBold'
                  >
                    Your favorites is empty
                  </ThemedText>
                  <ThemedTouchableFilled
                    onPress={() => router.back()}
                  >
                    <ThemedText>Browse items</ThemedText>
                  </ThemedTouchableFilled>
                </ThemedView>
              )
            }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      </Drawer>
      {/* FlatList for displaying all favorite items */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  list: {
    padding: 16,
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
  sizesButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: darkBrown,
    padding: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    zIndex: 20
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: 16,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginVertical: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  stock: {
    fontSize: 14,
    color: Colors.light.text,
  },
  rating: {
    fontSize: 14,
    color: Colors.light.text,
  },
  emptyScreenContainer: {
    flex:1,
    height: height * 0.65,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyScreenImage: {
    height: width * 0.55,
    width: width * 0.55,
    marginLeft: 20,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  swipedRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 5,
    margin: 20,
    minHeight: 50,
    borderRadius: 8
  },
  swipedConfirmationContainer: {
    flex: 1,
    alignItems: 'center'
  },
  deleteConfirmationText: {
    color: '#fcfcfc',
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
  cartButton: {
    padding: 8, 
    borderRadius: 8,
  },
  cartCount: {
    position: 'absolute',
    alignItems: 'center',
    top: 0,
    right: 0,
    backgroundColor: tintColorLight,
    width: 25,
    height: 25, 
    zIndex: 2,
    borderRadius: 15,
    transform: [
      { translateX: 10 },
      { translateY: -10 },
    ],
  },
  addToCart: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  addToCartText: {
    color: '#fcfcfc',
    fontWeight: 'bold',
    padding: 3,
  },
});