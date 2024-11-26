import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { FlatList, Image, ListRenderItemInfo, StyleSheet, useWindowDimensions } from 'react-native'
import { router } from 'expo-router'
import { useIsAppFirstLaunchStore } from '@/store/appStore'
import { darkBrown } from '@/constants/Colors'
import {  ThemedTouchablePlain } from '@/components/ThemedButton'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { appData } from '@/assets/data/appData'

//const { width, height } = Dimensions.get('screen');

interface ItemType {
  img: any;
  title: string;
  price: string;
}

interface ItemProps {
  item: ItemType
}

const ListItems: React.FC<ItemProps> = ({item}) => {

return (

    <ThemedView style={styles.content}>
      <Image defaultSource={require('@/assets/images/adaptive-icon.png')} style={styles.image} source={item.img}/>
      <ThemedText style={styles.title}>{item.title}</ThemedText>
      <ThemedText style={styles.price}>{item.price}</ThemedText>
    </ThemedView>
  );
};

function Landing() {
  const { height } = useWindowDimensions(); 
  const { setFirstLaunch } = useIsAppFirstLaunchStore();
  
  const handlePress = () => {
    setFirstLaunch();
    router.navigate('/(auth)/(tabs)/')
  }

  

  return (
    <ParallaxScrollView
      headerHeight={height * 0.6}
      headerBackgroundColor={{ light: darkBrown, dark: '#1D3D47' }}
      headerImage={
        <Image
          style={styles.headerImg}
          source={require('@/assets/images/header-image-s.gif')}
        />
      }
      overlayedContent
    >
      <ThemedView style={styles.container}>
        <ThemedView style={{flexDirection:'row', justifyContent: 'space-between', gap:5, alignItems: 'center'}}> 
          <ThemedText
            font='glacialIndifferenceBold'
            customColor='#301915'
            style={{letterSpacing:2,fontSize:20}}
          >
            Popular Items
          </ThemedText>
          <ThemedTouchablePlain
            onPress={handlePress}
            variant='opacity'
          >
            <ThemedText
            font='montserratMedium'
            type='default'
            customColor='#301915'
            style={{textDecorationLine:'underline', fontSize:14}}
          >
            BROWSE CATALOG
          </ThemedText>
          </ThemedTouchablePlain>
        </ThemedView>
        <ThemedView style={styles.listContainer}>
          <FlatList
            contentContainerStyle={styles.list}
            data={appData.landingItems}
            renderItem={({ item }: ListRenderItemInfo<ItemType>) => <ListItems item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImg: {
    width:'100%',
    height: '100%',
  },
  container: {
    width: '100%',
    overflow: 'hidden'
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
    width: '100%',
    height: '100%'
  },
  list: {
    gap: 100,
  },
  image: {
    height: 150,
    width: '100%',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 12,
    marginVertical: 12,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export default Landing