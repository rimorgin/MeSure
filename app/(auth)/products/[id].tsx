  import { router, useLocalSearchParams } from 'expo-router';
  import { View, Text, StyleSheet, Button, Image, Dimensions, TouchableHighlight } from 'react-native';
  import { appData } from '@/assets/data/appData';
  import ParallaxScrollView from '@/components/ParallaxScrollView';
  import { ThemedView } from '@/components/ThemedView';
  import { FlashList } from '@shopify/flash-list';

  const { width, height } = Dimensions.get('screen');

  export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    // Safely access the categories and rings
    const rings = appData.categories.find((category) => category.rings)?.rings || [];
    const product = rings.find((item) => item.id.toString() === id);

    if (!product) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>Product not found!</Text>
          <Button title="Go back" onPress={() => router.back()} />
        </View>
      );
    }


    return (
      <>
      <ThemedView
          style={{
            position: 'absolute',
            borderRadius: 45,
            top: height * 0.45,
            width: width * 0.7,
            height: width * 0.3,
            backgroundColor: '#000',
            alignSelf: 'center',
            zIndex: 5,
            transform: [{
              translateY: -66,
            }]
          }}
        >
        <View style={{height: '100%',alignItems: 'center', justifyContent:'center'}}>
        <FlashList
          data={product.img}
          estimatedItemSize={5}
          horizontal
          renderItem={({ item }) => (
            <TouchableHighlight
              onPress={() => console.log('pressed')}
            >
              <Image source={item} style={styles.ProductImageItem} />
            </TouchableHighlight>
          )}
        />
        </View>
      </ThemedView>
      <ParallaxScrollView
        roundedHeader
        headerHeight={height * 0.45}
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            style={styles.headerImg}
            source={require('@/assets/images/dark-bgcloth.png')}
          />
        }
        headerOverlayedContent={
          <ThemedView
            transparent
            style={styles.headerContent}
          >
            <Image 
              source={product.img[0]}
              style={styles.headerProductImageHeader}
            />
          </ThemedView>
        }
      >
        <ThemedView style={styles.container}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Button title="Go back" onPress={() => router.back()} />
        </ThemedView>
      
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
    ProductImageItem: {
      width: width * 0.2,
      height: width * 0.2,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    price: {
      fontSize: 18,
      color: 'green',
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: '#555',
    },
    error: {
      fontSize: 18,
      color: 'red',
    },
  });
