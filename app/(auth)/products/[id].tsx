import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Button, Image, Dimensions, TouchableHighlight, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { appData } from '@/assets/data/appData';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { black, tintColorLight, white } from '@/constants/Colors';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import BottomSheet, { BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet';
import CustomBackdrop from '@/components/BottomSheet/BackDrop';
import CustomBackground from '@/components/BottomSheet/Background';
import ThemedDivider from '@/components/ThemedDivider';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useFavoritesStore } from '@/state/appStore';

  const { width, height } = Dimensions.get('screen');

  export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const theme = useColorSchemeTheme(); 
    // Safely access the categories and rings
    const rings = appData.categories.find((category) => category.rings)?.rings || [];
    const product = rings.find((item) => item.id.toString() === id);

    if (!product) {
      return (
        <View style={styles.container}>
          <Text>Product not found!</Text>
          <Button title="Go back" onPress={() => router.back()} />
        </View>
      );
    }
    const [image, setImage] = useState(product.img[0])
    const [favorite, setFavorite] = useState(false)
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [quantity, setQuantity] = useState(0);
    const [buyOrCart, setBuyOrCart] = useState('')
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

    const selectedImage = (item: Image) => {
        setImage(item);
    };

    const openBottomSheet = () => bottomSheetRef.current?.snapToIndex(0);
    const closeBottomSheet = () => bottomSheetRef.current?.close();

    const increment = () => setQuantity(prev => prev + 1);
    const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : prev));

    const ratingStars = (rating: number) => {
      return '★'.repeat(Math.max(0, Math.min(5, rating)));
    };

    useEffect(() => {
      setFavorite(isFavorite(product.id))
      console.log(favorite)
    },[])

    const handleFavoriteToggle = () => {
      if (favorite) {
        removeFavorite(product.id); // Remove from favorites
      } else {
        addFavorite(product.id); // Add to favorites
      }
      setFavorite(!favorite); // Toggle favorite state
    }; 

    return (
      <>
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
                const isSelected = item === selectedImage; // Check if the current item is selected

                return (
                <TouchableHighlight
                    onPress={() => setImage(item)}
                    activeOpacity={0.7}
                    underlayColor="#CCC"
                    style={styles.touchableContainer}
                >
                    <ImageBackground 
                      source={item} 
                      style={styles.ProductImageItem} 
                      imageStyle={isSelected && { opacity: 0.8, backgroundColor: '#CCC'}}
                    />
                </TouchableHighlight>
                );
            }}
            />
      </ThemedView>
      <ParallaxScrollView
        //roundedHeader
        headerHeight={height * 0.45}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            style={styles.headerImg}
            source={require('@/assets/images/dark-bgcloth.png')}
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
          <TouchableOpacity onPress={handleFavoriteToggle}>
            <Ionicons 
              name={favorite ? 'heart' : "heart-outline"}
              size={40}
              color={favorite ? '#FF0000' : white}
            />
          </TouchableOpacity>
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
            font='glacialIndifferenceRegular' 
            type='default'
            lightColor='#301713'
            style={[styles.description, {letterSpacing:2, marginTop:20}]}
            >{product.description}
          </ThemedText>
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
              onPress={()=> console.log('pressed')}
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
                paddingLeft: 30
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

          <View style={{marginTop:30}}/>
          <ThemedView style={{flexDirection:'row', alignItems: 'center',gap:5}}>
            <ThemedText 
              font='spaceMonoRegular' 
              type='semititle'
              lightColor='#301713'
              style={{}}
              >Php {product.price}
            </ThemedText>
            <Foundation name="pricetag-multiple" size={35} color={tintColorLight} />
          </ThemedView>

          <ThemedView
            style={{
              width: '100%',
              justifyContent:'space-between',
              paddingHorizontal: 10,
              marginTop: 50,
              flexDirection: 'row'
            }}
          >
            <ThemedTouchableFilled
              style={{width:'45%'}}
              variant='opacity'
              onPress={() => {
                openBottomSheet();
                setBuyOrCart('Add to cart');
              }}
            >
              <ThemedText>Add to cart</ThemedText>
            </ThemedTouchableFilled>
            <ThemedTouchableFilled
              style={{width:'45%'}}
              variant='opacity'
              onPress={() => {
                openBottomSheet();
                setBuyOrCart('Buy');
              }}
            >
              <ThemedText>Buy now</ThemedText>
            </ThemedTouchableFilled>
          </ThemedView>
        </ThemedView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}  
          snapPoints={['80%']} 
          enablePanDownToClose={true}
          style={styles.bottomSheet}
          backdropComponent={CustomBackdrop}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ThemedView style={{
              flexDirection: 'row', 
              justifyContent:'space-between',
              width: '100%',
              paddingHorizontal: 20
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
            <ThemedText>variants</ThemedText>
            <ThemedDivider width={0.5} marginY={10}/>
            </ThemedView>
            <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ThemedText>quantity</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decrement} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity onPress={increment} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            </ThemedView>
            <ThemedTouchableFilled
              onPress={() => ''} 
              style={{position:'absolute', bottom:0, width: '100%', alignSelf: 'center' }}
            >
              <ThemedText>{buyOrCart}</ThemedText>
            </ThemedTouchableFilled>
          </BottomSheetView>
        </BottomSheet>
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
      top: 60, 
      paddingHorizontal: 20, 
      justifyContent: 'space-between', 
      flexDirection: 'row', 
      zIndex: 1
    },
    ProductImageItem: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: 10,
    },
    listView: {
      position: 'absolute',
      borderRadius: 45,
      top: height * 0.45,
      width: width * 0.7,
      height: width * 0.3,
      elevation: 2,
      shadowColor: '#000',
      alignSelf: 'center',
      zIndex: 5,
      transform: [{
        translateY: -66,
     }]
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
      paddingTop: 50,
      height: height * 0.45
    },
    description: {
      fontSize: 16,
      color: '#555',
      height: width * 0.18,
    },
    bottomSheet: {
      zIndex: 100,
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
      padding: 20,
      backgroundColor: white,
    },
    BottomSheetImage: {
      width: width * 0.3,
      height:  width * 0.3,
    },
    quantityContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderColor: '#CCC',
      borderWidth: 0.8,
      borderRadius: 5,
    },
    button: {
      backgroundColor: "#ddd",
      paddingHorizontal: 8,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    quantity: {
      fontSize: 18,
      marginHorizontal: 10,
      fontWeight: "bold",
    },
    });
