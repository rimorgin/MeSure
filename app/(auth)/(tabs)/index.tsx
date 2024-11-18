import { Image, StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView'; // A scroll view with parallax effect
import { ThemedText } from '@/components/ThemedText'; // Text component with theming support
import { ThemedView } from '@/components/ThemedView'; // View component with theming support
import SearchInput from '@/components/SearchBar'; // Custom search input component
import Ionicons from '@expo/vector-icons/Ionicons'; // Icons from Expo Ionicons package
import { router } from 'expo-router'; // Router for navigation
import { black, Colors, tintColorLight, white } from '@/constants/Colors'; // Color constants
import { FlashList } from "@shopify/flash-list"; // High-performance list component
import { appData } from '@/assets/data/appData'; // Data source for categories and items
import { ThemedTouchableFilled } from '@/components/ThemedButton'; // Themed button component
import { Drawer } from 'react-native-drawer-layout'; // Drawer layout for side menus
import useColorSchemeTheme from '@/hooks/useColorScheme'; // Hook for getting theme
import { useState } from 'react'; // React hook for managing state
import ItemCard from '@/components/Card'; // Component for rendering individual items
import { useCartStore } from '@/state/appStore';

// Get screen dimensions
const { width } = Dimensions.get('screen');

export default function HomeScreen() {
  const theme = useColorSchemeTheme(); // Get the current theme (light/dark)
  const cart = useCartStore((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [openFilter, setOpenFilter] = useState(false); // State to manage whether the filter drawer is open
  const [sortOption, setSortOption] = useState<'name' | 'price'>('name'); // Default sorting by name

  // Access the "rings" and "bangles" data from the appData categories using find
  const ringsCategory = appData.categories.find(category => category.name === 'rings');
  const banglesCategory = appData.categories.find(category => category.name === 'bangles');

  const rings = ringsCategory ? ringsCategory.rings : []; // Fallback to empty array if not found
  const bangles = banglesCategory ? banglesCategory.bangles : []; // Fallback to empty array if not found

  const [selectedCategory, setSelectedCategory] = useState<'rings' | 'bangles' | 'All'>('All'); // Default to 'All'

  // Handler for category selection (rings or bangles)
  const handleCategorySelect = (category: 'All' | 'rings' | 'bangles') => {
    setSelectedCategory(category); // Set the selected category
  };

  // Get data for the selected category (either rings, bangles, or both)
  const selectedProducts = 
    selectedCategory === 'All'
      ? [...(rings || []), ...(bangles || [])] // Combine all products
      : selectedCategory === 'rings'
      ? rings || [] // Only rings
      : bangles || []; // Only bangles

  // Function to handle search input
  const handleSearch = (text: string) => {
    setSearchTerm(text); // Update the search term
  };

  // Function to sort products based on the selected option
  const sortProducts = (products: any[]) => {
    return products.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name); // Sort by name
      } else if (sortOption === 'price') {
        return a.price - b.price; // Sort by price
      }
      return 0; // Default case
    });
  };

  // Sort selected products
  const sortedProducts = sortProducts([...selectedProducts]); // Create a new array for sorting

  // Filter products based on the search term
  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
    <>
      <ParallaxScrollView
        noContentPadding
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
            <SearchInput onSearch={handleSearch} />
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Ionicons
                style={styles.cartButton}
                name="cart-sharp"
                size={24}
                color={tintColorLight}
              />
              <View style={styles.cartCount}>
                <ThemedText customColor={white}>{cart.length}</ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
        }
      >
        <Drawer
          drawerPosition="right"
          open={openFilter}
          onOpen={() => setOpenFilter(true)}
          onClose={() => setOpenFilter(false)}
          renderDrawerContent={() => (
            <View style={styles.drawerContent}>
              {/* Sorting Options */}
            <View style={styles.sortOptions}>
              <TouchableOpacity onPress={() => setSortOption('name')}>
                <ThemedText customColor={black}>Sort by Name</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSortOption('price')}>
                <ThemedText customColor={black}>Sort by Price</ThemedText>
              </TouchableOpacity>
            </View>
            </View>
          )}
        >
          <ThemedView style={styles.contentContainer}>
            <ThemedText 
              type="semititle"
              font="glacialIndifferenceBold"
            >
              Discover Elegance
            </ThemedText>

            <Ionicons.Button 
              style={styles.filterButton}
              name="filter" 
              size={30}
              backgroundColor="transparent"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              onPress={() => setOpenFilter(prev => !prev)}
            />
            
            

            <FlashList
              data={appData.categories}
              horizontal
              renderItem={({ item }) => (
                <ThemedTouchableFilled 
                  style={{ marginRight: 10, borderRadius: 30 }}
                  onPress={() => handleCategorySelect(item.name as 'All' | 'rings' | 'bangles')}
                >
                  <ThemedText type='default' customColor={white}>{item.name}</ThemedText>
                </ThemedTouchableFilled>
              )}
              estimatedItemSize={3}
            />

            <ThemedView style={styles.listItems}>
              <FlashList
                data={filteredProducts} // Use filtered products
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

// Styles for various components
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
    overflow: 'hidden',
  },
  headerContent: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    marginTop: 15,
  },
  headerImg: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.888,
  },
  cartButton: {
    backgroundColor: white, 
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
  filterButton: {
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    overflow: 'hidden',
  },
  listItems: {
    flex: 1,
    overflow: 'hidden',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
