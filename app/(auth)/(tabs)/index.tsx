import { Image, StyleSheet, Platform, Dimensions, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchInput from '@/components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Colors, tintColorLight, white } from '@/constants/Colors';
import { FlashList } from "@shopify/flash-list";
import { appData } from '@/assets/data/appData';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { Drawer } from 'react-native-drawer-layout';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { useState } from 'react';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import ItemCard from '@/components/Card';

const { width, height } = Dimensions.get('screen');
const rings = appData.categories[0].rings;

export default function HomeScreen() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);

  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
  };

  return (
    <>
    <ParallaxScrollView
      noContentPadding //disable padding on parent
      headerHeight={width * 0.32}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/dark-bgcloth.png')}
          style={styles.headerImg}
        />
      }
      headerOverlayedContent={
        <ThemedView transparent style={styles.headerContent}>
          <SearchInput onSearch={handleSearch}/>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons
              style={styles.cartButton}
              name="cart-sharp" 
              size={24} 
              color={tintColorLight} 
            />
            <View style={styles.cartCount}>
              <ThemedText customColor={white}>3</ThemedText>
            </View>
          </TouchableOpacity>
        </ThemedView>
      }>
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
      <ThemedView style={styles.contentContainer}>
      <ThemedText 
        type='semititle'
        font='glacialIndifferenceBold' 
      >Discover Elegance
      </ThemedText>
      <Ionicons.Button 
          style={styles.filterButton}
          name='filter' 
          size={30}
          backgroundColor='transparent'
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          onPress={() => setOpenFilter(prev => !prev)}
        />
      <FlashList
        data={appData.categories}
        horizontal
        renderItem={({ item }) => (
          <ThemedTouchableFilled 
            style={{marginRight:10, borderRadius: 30}}
            onPress={()=> console.log('pressed')}
            >
            <ThemedText customColor={white}>{item.name}</ThemedText>
          </ThemedTouchableFilled>
        )}
        estimatedItemSize={2}
      />
      <ThemedView style={styles.listItems}>
        <FlashList
          data={rings}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => <ItemCard item={item} />}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
      </ThemedView>
      </Drawer>
    </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
    overflow:'hidden'
  },
  headerContent: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    marginTop: 15
  },
  headerImg: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.888
  },
  cartButton: {
    backgroundColor: white, 
    padding: 8, 
    borderRadius: 8
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
    borderRadius:15,
    transform: [
      {translateX: 10},
      {translateY: -10}
    ]
  },
  filterButton: {
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    height: height,
    padding: 20,
    overflow: 'hidden'
  },
  listItems:{
    flex: 1,
    height: height,
    overflow: 'hidden'
  }
});
