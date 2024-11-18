import { StyleSheet, Platform, SafeAreaView, StatusBar, View, FlatList, Image, Animated, TouchableOpacity } from 'react-native';
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
import { Swipeable } from 'react-native-gesture-handler';

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

  const handleDelete = (itemId: number) => {
    // Handle deletion of the item from favorites here
    removeFavorite(itemId);  // Assuming removeFavorite is a function from Zustand store
  };


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
      <View style={styles.swipedRow}>
        <View style={styles.swipedConfirmationContainer}>
          <ThemedText style={styles.deleteConfirmationText}>Are you sure?</ThemedText>
        </View>
        <TouchableOpacity 
          style={{width:'20%'}}
          onPress={() => removeFavorite(id)}>
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
  return (
    <Swipeable
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
      friction={2} // Make the swipe a bit easier to start
      overshootLeft={false} // Prevent overshooting on the left
      overshootRight={false} // Prevent overshooting on the right
      rightThreshold={40} // Make it easier to swipe
    >
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
    </Swipeable>
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
});