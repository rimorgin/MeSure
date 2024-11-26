import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, Dimensions, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native';
import { appData } from '@/assets/data/appData';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons';
import { black, darkBrown, tintColorLight, white } from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import ThemedBottomSheet, { ThemedBottomSheetRef } from '@/components/ThemedBottomSheet';
import ThemedDivider from '@/components/ThemedDivider';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useCartStore, useFavoritesStore, useUserStore } from '@/store/appStore';
import { ratingStars } from '@/utils/ratings';
import ThemedModal from '@/components/ThemedModal';

const { width, height } = Dimensions.get('screen');

  export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const { userId } = useUserStore();
    const theme = useColorSchemeTheme();
    const [favorite, setFavorite] = useState(false)
    const bottomSheetRef = useRef<ThemedBottomSheetRef>(null);
    const [quantity, setQuantity] = useState(0);
    const [sizes, setSize] = useState(0);
    const { cart, addToCart } = useCartStore();
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const [textHeight, setTextHeight] = useState(0);
    const maxHeight = 28;
    const [arAlertModal, setArAlertModal] = useState(false);
    // Safely access the categories and rings
    const product = appData.categories
    .flatMap(category => category.rings || category.bangles || [])
    .find((item): item is { id: number; img: any[]; name: string; sizes: number[]; description: string; rating: number; sold: number; price: string; stock: number; AR: boolean } => item?.id?.toString() === id) || {
      id: 0,
      img: [],
      name: '',
      sizes: [],
      description: '',
      rating: 0,
      sold: 0,
      price: '',
      stock: 0,
      AR: false,
    };  
    const [image, setImage] = useState(product?.img[0])
  
    useEffect(() => {
      setFavorite(isFavorite(product.id))
    },[isFavorite, product.id])

    const handleTextLayout = (event: any) => {
      const { height } = event.nativeEvent.layout;
      setTextHeight(height);
    };
    
    const openBottomSheet = () => bottomSheetRef.current?.open();
    const closeBottomSheet = () => bottomSheetRef.current?.close();

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : prev));

    const handleSelectedSize = (size:number) => {
      if (size === sizes) {
        setSize(0);
        return;
      }
      setSize(size)
    }

    const handleFavoriteToggle = async () => {
      if (favorite) {
        removeFavorite(userId, product.id); // Remove from favorites
      } else {
        addFavorite(userId, product.id); // Add to favorites
      }
      setFavorite(!favorite); // Toggle favorite state
    
    }; 
    
    const handleAddToCart = () => {
      if (quantity > 0 && sizes !== 0) {
        const cartItem = { 
          id: product.id,
          quantity: quantity,
          size: sizes,
          price: product.price,
        }
        addToCart(userId, cartItem)
        closeBottomSheet();
        setQuantity(0);
        setSize(0);
      }
    }

    const handleArClick = () => {
      if (product.AR) {
        //router.push('/(auth)/(tabs)/arcamera')
      } else {
        setArAlertModal(true);
      }
    }

    return (
      <>
      <ThemedModal
        showModal={arAlertModal}
        onClose={() => setArAlertModal(false)}
        height={250}
      >
        <ThemedView style={{flex:1, gap: 20,alignItems:'center', justifyContent:'center'}}>
          <ThemedText font='montserratSemiBold' style={{textAlign:'center'}}>This {product.name} is not available for AR Try-On yet.</ThemedText>
          <ThemedTouchableFilled onPress={() => setArAlertModal(false)}>
            <ThemedText>Confirm</ThemedText>
          </ThemedTouchableFilled>
        </ThemedView>
      </ThemedModal>
      <ThemedView
          style={[
            styles.listView,
          ]}
        >
        <FlatList
            data={product.img}
            horizontal
            contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                flexGrow: 1,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
                const isSelected = item.id === image.id; 
                return (
                <TouchableHighlight
                    onPress={() => setImage(item)}
                    activeOpacity={0.7}
                    underlayColor="#CCC"
                    style={[styles.touchableContainer,
                      isSelected ? { borderRadius: 50 } : {}  // Apply borderRadius only for selected image
                    ]}
                >
                  <Image 
                    source={item}  // Assuming item has a 'source' property for the image source
                    style={[
                      styles.ProductImageItem, 
                      isSelected ? { borderRadius: 50 } : {} // Base styles for all images
                      
                    ]}
                  />
                </TouchableHighlight>
                );
            }}
            />
      </ThemedView>
      <ParallaxScrollView
        //roundedHeader
        scrollable={false}
        headerHeight={height * 0.45}
        headerBackgroundColor={{ light: darkBrown, dark: '#1D3D47' }}
        headerImage={
          <Image
            style={styles.headerImg}
            blurRadius={2}
            source={require('@/assets/images/product-page-bg.png')}
          />
        }
        headerOverlayedContent={
          <>
          <ThemedView
            transparent
            style={styles.headerButtonRow}
          > 
          <TouchableOpacity onPress={()=>router.back()}>
            <Ionicons 
              name="chevron-back-outline"
              size={40}
              color={white}
            />
          </TouchableOpacity>
          <ThemedView transparent style={{flexDirection:'row', gap: 20}}>
            <TouchableOpacity onPress={handleFavoriteToggle}>
            <Ionicons 
              name={favorite ? 'heart' : "heart-outline"}
              size={40}
              color={favorite ? '#FF0000' : white}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/(extras)/cart')}>
            <Ionicons
              name="cart-outline"
              size={40}
              color={white}
            />
            <ThemedView style={styles.cartCount}>
              <ThemedText customColor={white}>{cart.length}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
          </ThemedView>
          </ThemedView>
          <ThemedView
            transparent
            style={styles.headerContent}
          >
            <Image 
              source={image}
              style={styles.headerProductImageHeader}
            />
          </ThemedView>
          </>
        }
      >
        <ThemedView style={styles.container}>
          <ThemedView
            style={{paddingBottom: 50}}>
            <ThemedView style={{
              flexDirection:'row', 
              justifyContent:'space-between',
              alignItems:'center'
            }}>
            <ThemedText 
              font='glacialIndifferenceBold' 
              type='title'
              lightColor='#301713'
              >{product.name}
            </ThemedText>
            <ThemedText 
              font='glacialIndifferenceRegular' 
              type='default'
              lightColor='#301713'
              >{product.sold} sold
            </ThemedText>
            </ThemedView>
            <ThemedText 
                font='montserratRegular' 
                type='default'
                lightColor='#301713'
                style={{letterSpacing:1, marginTop:20, marginBottom: 8}}
              >SIZES
            </ThemedText>
            <ThemedView>
              <FlatList
                data={product.sizes}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = item === sizes; 
                  return (
                  <TouchableOpacity 
                    style={[
                      styles.sizesButton,
                      isSelected && {backgroundColor:'#D4AF37', borderColor:'#301713'}
                    ]}
                    onPress={() => handleSelectedSize(item)}
                  >
                    <ThemedText>{item}</ThemedText>
                  </TouchableOpacity>
                )}}
              />
            </ThemedView>
            <ThemedText 
                font='montserratRegular' 
                type='default'
                lightColor='#301713'
                style={{letterSpacing:1, marginTop:20}}
              >DESCRIPTION
            </ThemedText>
            <ThemedView
              style={[
                styles.expandableDescription,
                isExpanded && {height:'auto'}
              ]}
            >
              <ThemedText 
                font='glacialIndifferenceRegular' 
                type='default'
                lightColor='#301713'
                onLayout={handleTextLayout}
                style={[styles.description, { letterSpacing: 2, marginTop: 5 }]}
                >{product.description} 
                
              </ThemedText>
              {/* Conditionally render the "See more/less" text */}
              {textHeight > maxHeight && (
                <TouchableOpacity onPress={() => setIsExpanded(prev => !prev)}>
                  <ThemedText font='glacialIndifferenceBold'>
                    See {isExpanded ? 'less' : 'more'}...
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
            <View style={{marginTop:30}}/>
            <ThemedView style={{flexDirection: 'row', justifyContent:'space-between'}}>
              <ThemedView>
                <ThemedText 
                  font='montserratRegular' 
                  type='default'
                  lightColor='#301713'
                  style={{letterSpacing:1, marginTop:5}}
                  >PRODUCT RATING
                </ThemedText>
                <ThemedText 
                  type='semititle'
                  lightColor='#5B3A14'
                  >{ratingStars(product.rating)}
                </ThemedText>
              </ThemedView>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleArClick}
              >
                <ThemedView style={{
                  flexDirection:'row', 
                  justifyContent: 'center', 
                  alignItems:'center', 
                  zIndex:5, 
                  backgroundColor:theme === 'light' ? '#301713' : tintColorLight,
                  right: -25,
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius:  25,
                  paddingVertical: 10,
                  paddingLeft: 30,
                }}>
                  <ThemedView  transparent style={{flexDirection:'column'}}>
                    <ThemedText 
                      font='montserratSemiBold' 
                      type='default'
                      lightColor={white}
                      style={{letterSpacing:1, right:7}}
                      >TRY IT OUT
                    </ThemedText>
                    <ThemedText 
                      font='montserratRegular' 
                      lightColor={white}
                      style={{letterSpacing:1, fontSize:12, right:17}}
                      >Discover the best
                    </ThemedText>
                  </ThemedView>
                <FontAwesome6 
                  name="hand-sparkles" 
                  size={50} 
                  color={white}
                  style={{right:18}}
                />
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>





          <View style={{marginTop:30}}/>
          <ThemedView
              style={{
                width: '100%',
                justifyContent:'space-between',
                flexDirection: 'row',
                position: 'absolute',
                bottom: -25
              }}
            >
              <ThemedView style={{flexDirection:'row', alignItems: 'center',gap:5}}>
                <ThemedText 
                  font='spaceMonoRegular' 
                  type='subtitle'
                  lightColor='#301713'
                  style={{}}
                  >Php {product.price}
                </ThemedText>
              <Foundation name="pricetag-multiple" size={35} color={tintColorLight} />
              </ThemedView>
              <ThemedTouchableFilled
                style={{width:'50%',borderRadius:20}}
                variant='opacity'
                onPress={() => {
                  openBottomSheet();
                }}
              > 
                <ThemedText>Add to cart</ThemedText>
              </ThemedTouchableFilled>
          </ThemedView>
        </ThemedView>
        <ThemedBottomSheet ref={bottomSheetRef}>
          <ThemedView style={{
            flexDirection: 'row', 
            justifyContent:'space-between',
            width: '100%',
            paddingHorizontal: 20,
            backgroundColor: theme === 'light' ? '#F8F4EC' : '#1c1c1d'
          }}>
            <ThemedView style={{flexDirection:'row', justifyContent:'center', alignItems:'flex-end'}}>
            <Image source={image} style={styles.BottomSheetImage}/>
            <ThemedView style={{marginLeft: 5}}>
              <ThemedText>Php {product.price}</ThemedText>
              <ThemedText>Stock: {product.stock}</ThemedText>
            </ThemedView>
            </ThemedView>
            <TouchableOpacity onPress={closeBottomSheet}>
              <Ionicons name='close' size={30}/>
            </TouchableOpacity>
          
          </ThemedView>
          <ThemedDivider width={0.5} marginY={10}/>
          <ThemedView>
            <ThemedText style={{marginBottom:5}}>sizes</ThemedText>
            <FlatList
              data={product.sizes}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item === sizes; 
                return (
                <TouchableOpacity 
                  style={[
                    styles.sizesButton,
                    isSelected && {backgroundColor:'#D4AF37', borderColor:'#301713'}
                  ]}
                  onPress={() => handleSelectedSize(item)}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              )}}
            />
          </ThemedView>
          <ThemedDivider width={0.5} marginY={10}/>
          <ThemedView>
            <ThemedText>variants</ThemedText>
          <ThemedDivider width={0.2} marginY={10}/>
          </ThemedView>
          <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ThemedText>quantity</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decrement}>
                <AntDesign 
                  name="minuscircleo" 
                  size={24} 
                  color={theme==='light' ? Colors.light.icon : Colors.dark.icon}
                />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity onPress={increment}>
                <AntDesign 
                  name="pluscircle" 
                  size={24} 
                  color={theme==='light' ? Colors.light.icon : Colors.dark.icon}
                />
              </TouchableOpacity>
            </View>
          </ThemedView>
          <ThemedTouchableFilled
            onPress={handleAddToCart} 
            style={{position:'absolute', bottom:0, width: '100%', alignSelf: 'center' }}
          >
            <ThemedText>Add to cart</ThemedText>
          </ThemedTouchableFilled>
        </ThemedBottomSheet>
      </ParallaxScrollView>

      </>
    );
  }

  const styles = StyleSheet.create({
    headerImg: {
      width:'100%',
      height: '100%',
    },
    headerContent: {
      justifyContent: 'space-evenly',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      height: '100%'
    },
    headerProductImageHeader: {
      width: width * 0.5,
      height: width * 0.5
    },
    headerButtonRow: {
      position:'absolute', 
      width:width, 
      top: 50, 
      paddingHorizontal: 20, 
      justifyContent: 'space-between', 
      flexDirection: 'row', 
      zIndex: 1
    },
    ProductImageItem: {
      width: width * 0.18,
      height: width * 0.18,
      borderRadius: 10,
    },
    listView: {
      position: 'absolute',
      borderRadius: 45,
      top: height * 0.45,
      width: width * 0.65,
      height: width * 0.225,
      elevation: 2,
      shadowColor: '#000',
      alignSelf: 'center',
      zIndex: 2,
      transform: [{
        translateY: -50,
     }]
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
    touchableContainer: {
      borderRadius: 10,
      margin: 5,
    },
    selectedTouchableContainer: {
      backgroundColor: '#000',
    },
    container: {
      flex: 1,
      paddingTop: width/19,
      height: height * 0.45
    },
    sizesButton: {
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#CCC',
      padding: 10,
      paddingHorizontal: 12,
      marginRight: 8
    },
    expandableDescription: { 
      height: width * 0.15,
    },
    description: {
      color: '#555',
    },
    bottomSheet: {
      shadowColor: black, 
      shadowOffset: { width: 0, height: 10 },  
      shadowOpacity: 0.44,
      shadowRadius: 10.32, 
      elevation: 10, 
      backgroundColor: white,
      borderRadius: 20,
    },
    contentContainer: {
      flex: 1,
      padding: 10,
      paddingHorizontal: 30,
      backgroundColor: white,
    },
    BottomSheetImage: {
      width: width * 0.25,
      height:  width * 0.25,
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
    button: {
      paddingHorizontal: 10,
      borderRadius: 20,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: '#CCC'
    },
    button2: {
      paddingHorizontal: 8,
      borderRadius: 20,
      textAlign: 'center'
    },
    buttonText: {
      fontSize: 20,
      color: Colors.light.text,
      textAlignVertical: 'center'
    },
  });
