import { StyleSheet, Platform, SafeAreaView, StatusBar, View, FlatList, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { Drawer } from 'react-native-drawer-layout';
import { appData } from '@/assets/data/appData';
import { useFavoritesStore } from '@/state/appStore';

export default function Favorites() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);

  // Fetch favorites and actions from the Zustand store
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoritesStore((state) => state);

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


  
  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.img[0]} style={styles.image} />
        <View style={styles.details}>
          <ThemedText style={styles.title}>{item.name}</ThemedText>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <ThemedText style={styles.price}>Price: {item.price}</ThemedText>
          {item.stock ? (
            <ThemedText style={styles.stock}>Stock: {item.stock}</ThemedText>
          ) : null}
          <ThemedText style={styles.rating}>Rating: {item.rating}</ThemedText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
      <ThemedView style={styles.header}>
        <ThemedText font='montserratBold' type='title'>Favorites</ThemedText>
        <Ionicons.Button
          style={styles.filterButton}
          name="filter"
          size={30}
          backgroundColor="transparent"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          onPress={() => setOpenFilter((prev) => !prev)}
        />
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
          renderItem={renderItem}
          ListEmptyComponent={<ThemedText>No favorites found!</ThemedText>}
          contentContainerStyle={styles.list}
        />
      </Drawer>
      {/* FlatList for displaying all favorite items */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
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
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
});