import { StyleSheet, Dimensions, TouchableOpacity, View, SafeAreaView, Platform, StatusBar, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Text component with theming support
import { ThemedView } from '@/components/ThemedView'; // View component with theming support
import SearchInput from '@/components/SearchBar'; // Custom search input component
import Ionicons from '@expo/vector-icons/Ionicons'; // Icons from Expo Ionicons package
import { router } from 'expo-router'; // Router for navigation
import { black, Colors, darkBrown, tintColorLight, white } from '@/constants/Colors'; // Color constants
import { FlashList } from "@shopify/flash-list"; // High-performance list component
import { appData } from '@/assets/data/appData'; // Data source for categories and items
import { Drawer } from 'react-native-drawer-layout'; // Drawer layout for side menus
import useColorSchemeTheme from '@/hooks/useColorScheme'; // Hook for getting theme
import { useState } from 'react'; // React hook for managing state
import { CategoryCard, ItemCard } from '@/components/ThemedCard'; // Component for rendering individual items
import { useCartStore } from '@/store/appStore';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { HelloWave } from '@/components/Header';
import Slider from '@react-native-community/slider';

const { height, width } = Dimensions.get('screen'); // Get screen dimensions

export default function HomeScreen() {
  const theme = useColorSchemeTheme(); // Get the current theme (light/dark)
  const cart = useCartStore((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [openFilter, setOpenFilter] = useState(false); // State to manage whether the filter drawer is open
  const [sortOption, setSortOption] = useState<'name' | 'price'>('name'); // Default sorting by name
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // State for sort order
  const [selectedCategory, setSelectedCategory] = useState<'rings' | 'bangles' | 'All'>('All'); // Default to 'All'
  const [selectedSize, setSelectedSize] = useState(25); // Default maximum size for the slider
  const [showARProducts, setShowARProducts] = useState(false); // State to toggle AR-supported products

  const ringsCategory = appData.categories.find(category => category.name === 'rings');
  const banglesCategory = appData.categories.find(category => category.name === 'bangles');
  const rings = ringsCategory ? ringsCategory.rings : [];
  const bangles = banglesCategory ? banglesCategory.bangles : [];

  const handleCategorySelect = (category: 'All' | 'rings' | 'bangles') => {
    setSelectedCategory(category); // Set the selected category
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text); // Update the search term
  };

  const sortProducts = (products: any[]) => {
    return products.sort((a, b) => {
      if (sortOption === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortOption === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      }
      return 0; // Default case
    });
  };

  const selectedProducts = 
    selectedCategory === 'All'
      ? [...(rings || []), ...(bangles || [])]
      : selectedCategory === 'rings'
      ? rings || []
      : bangles || [];

  const sortedProducts = sortProducts([...selectedProducts]); // Create a new array for sorting

  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) && // Filter by search term
    product.sizes.some((size: number) => size <= selectedSize) && // Filter by selected size
    (!showARProducts || product.AR) // Filter by AR support if toggled
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FocusAwareStatusBar barStyle="dark-content" animated />
        <ScrollView>
          <Drawer
            drawerPosition="right"
            style={{height:height}}
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
                {/* Sort Order Options */}
                <View style={styles.sortOrder}>
                  <TouchableOpacity onPress={() => setSortOrder('asc')}>
                    <ThemedText customColor={black}>Ascending</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSortOrder('desc')}>
                    <ThemedText customColor={black}>Descending</ThemedText>
                  </TouchableOpacity>
                </View>
                {/* Size Filter */}
                <View style={styles.sizeFilter}>
                  <ThemedText customColor={black}>Filter by Size</ThemedText>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={1}
                    maximumValue={25}
                    step={0.5}
                    value={selectedSize}
                    thumbTintColor={darkBrown}
                    onValueChange={(value) => setSelectedSize(value)}
                    minimumTrackTintColor={tintColorLight}
                    maximumTrackTintColor={Colors.light.text}
                  />
                  <ThemedText customColor={black}>Max Size: {selectedSize}</ThemedText>
                </View>
                {/* AR Filter */}
                <View style={styles.arFilter}>
                  <TouchableOpacity 
                    style={[
                      styles.toggleButton, 
                      showARProducts ? styles.activeToggle : styles.inactiveToggle
                    ]}
                    onPress={() => setShowARProducts(!showARProducts)}
                  >
                    <ThemedText customColor={white}>
                      {showARProducts ? 'Show All' : 'Show AR Supported'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          >
            <ThemedView style={styles.contentContainer}>
              <ThemedView style={styles.headerContent}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <HelloWave />
                  <TouchableOpacity 
                    style={{marginRight: -4, marginTop: 4}}
                    onPress={() => router.navigate('/(account)/(cart)/')}>
                    
                    <Ionicons
                      style={styles.cartButton}
                      name="cart-sharp"
                      size={30}
                      color={tintColorLight}
                    />
                    <ThemedView style={styles.cartCount}>
                      <ThemedText customColor={white}>{cart.length}</ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SearchInput onSearch={handleSearch} />
                  <TouchableOpacity onPress={() => setOpenFilter(prev => !prev)}>
                    <Ionicons 
                      style={styles.filterButton}
                      name="filter" 
                      size={30}
                      color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                    />
                  </TouchableOpacity>
                </ThemedView>
                <ThemedText 
                  style={{ marginBottom: 8 }}
                  type="semititle"
                  font="glacialIndifferenceBold"
                >
                  Discover Elegance
                </ThemedText>
                <FlashList
                  data={appData.categories}
                  horizontal
                  renderItem={({ item, index }) => (
                    <CategoryCard
                      item={item}
                      isOdd={index % 2 === 0} 
                      handleCategorySelect={() => handleCategorySelect(item.name as 'All' | 'rings' | 'bangles')}
                    />
                  )}
                  estimatedItemSize={3}
                />
              </ThemedView>
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
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Styles for various components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortOptions: {
    marginVertical: 10,
  },
  sortOrder: {
    marginVertical: 10,
  },
  sizeFilter: {
    marginVertical: 10,
  },
  arFilter: {
    marginVertical: 10,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: tintColorLight,
  },
  inactiveToggle: {
    backgroundColor: '#2c1414',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 10,
  },
  headerContent: {
    paddingHorizontal: 10,
    width: '100%',
    gap: 25
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
    padding: 8, 
    borderRadius: 8,
  },
  cartCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: tintColorLight,
    borderRadius: 15,
    width: 25,
    height: 25, 
    zIndex: 2,
    transform: [
      { translateX: 5 },
      { translateY: -5 },
    ],
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    marginLeft: 10,
  },
  listItems: {
    flex: 1,
    marginHorizontal: 16,
  },
});
