import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import SearchInput from '@/components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Colors, tintColorLight, white } from '@/constants/Colors';
import { FlashList } from '@shopify/flash-list';
import { appData } from '@/assets/data/appData';
import { Drawer } from 'react-native-drawer-layout';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { useState } from 'react';
import { CategoryCard, ItemCard } from '@/components/ThemedCard';
import { useCartStore } from '@/store/appStore';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { HelloWave } from '@/components/Header';
import FilterDrawer from '@/components/productfilter'; // Import the reusable FilterDrawer component

const { height } = Dimensions.get('screen'); // Get screen height

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

  const ringsCategory = appData.categories.find((category) => category.name === 'rings');
  const banglesCategory = appData.categories.find((category) => category.name === 'bangles');
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
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
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

  const filteredProducts = sortedProducts.filter(
    (product) =>
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
            style={{
              height: filteredProducts.length <= 6 ? height + 50 : 'auto', 
              paddingBottom: filteredProducts.length <= 6 ? 0 : 100
            }}
            open={openFilter}
            onOpen={() => setOpenFilter(true)}
            onClose={() => setOpenFilter(false)}
            renderDrawerContent={() => (
              <FilterDrawer
                openFilter={openFilter}
                onClose={() => setOpenFilter(false)}
                sortOption={sortOption}
                setSortOption={setSortOption}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                showARProducts={showARProducts}
                setShowARProducts={setShowARProducts}
              />
            )}
          >
            <ThemedView style={styles.contentContainer}>
              <ThemedView style={styles.headerContent}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <HelloWave />
                  <TouchableOpacity
                    style={{ marginRight: -4, marginTop: 4 }}
                    onPress={() => router.navigate('/(account)/(cart)/')}
                  >
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
                  <TouchableOpacity onPress={() => setOpenFilter((prev) => !prev)}>
                    <Ionicons
                      style={styles.filterButton}
                      name="filter"
                      size={30}
                      color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                    />
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView>
                  <ThemedText style={{ marginBottom: 5 }} type="semititle" font="glacialIndifferenceBold">
                    Discover Elegance
                  </ThemedText>
                  <FlashList
                    data={appData.categories}
                    horizontal
                    renderItem={({ item, index }) => (
                      <CategoryCard
                        item={item}
                        isOdd={index % 2 === 0}
                        handleCategorySelect={() =>
                          handleCategorySelect(item.name as 'All' | 'rings' | 'bangles')
                        }
                      />
                    )}
                    estimatedItemSize={3}
                  />
                </ThemedView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 10,
  },
  headerContent: {
    paddingHorizontal: 10,
    width: '100%',
    gap: 25,
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
    transform: [{ translateX: 5 }, { translateY: -5 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    marginLeft: 10,
  },
  listItems: {
    flex: 1,
    marginHorizontal: 16,
    marginLeft: 8
  },
});