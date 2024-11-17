import { Image, StyleSheet, Platform, Dimensions, TouchableOpacity, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave'; // Custom component (not used here)
import ParallaxScrollView from '@/components/ParallaxScrollView'; // A scroll view with parallax effect
import { ThemedText } from '@/components/ThemedText'; // Text component with theming support
import { ThemedView } from '@/components/ThemedView'; // View component with theming support
import SearchInput from '@/components/SearchBar'; // Custom search input component
import Ionicons from '@expo/vector-icons/Ionicons'; // Icons from Expo Ionicons package
import { router } from 'expo-router'; // Router for navigation
import { Colors, tintColorLight, white } from '@/constants/Colors'; // Color constants
import { FlashList } from "@shopify/flash-list"; // High-performance list component
import { appData } from '@/assets/data/appData'; // Data source for categories and items
import { ThemedTouchableFilled } from '@/components/ThemedButton'; // Themed button component
import { Drawer } from 'react-native-drawer-layout'; // Drawer layout for side menus
import useColorSchemeTheme from '@/hooks/useColorScheme'; // Hook for getting theme
import { useState } from 'react'; // React hook for managing state
import ItemCard from '@/components/Card'; // Component for rendering individual items

// Get screen dimensions
const { width, height } = Dimensions.get('screen');

// Access the "rings" and "bangles" data from the appData categories
const rings = appData.categories[0].rings;
const bangles = appData.categories[1].bangles;

export default function HomeScreen() {
  const theme = useColorSchemeTheme(); // Get the current theme (light/dark)
  const [openFilter, setOpenFilter] = useState(false); // State to manage whether the filter drawer is open
  const [selectedCategory, setSelectedCategory] = useState<'rings' | 'bangles' | 'both'>( 'both'); // Default to 'both'

  // Handler for category selection (rings or bangles)
  const handleCategorySelect = (category: 'rings' | 'bangles') => {
    setSelectedCategory(category); // Set the selected category
  };

  // Reset to show both rings and bangles
  const resetCategorySelection = () => {
    setSelectedCategory('both');
  };

  // Get data for the selected category (either rings, bangles, or both)
  const selectedProducts = selectedCategory === 'both'
    ? [...rings, ...bangles] // Combine both rings and bangles
    : selectedCategory === 'rings'
    ? rings // Only rings
    : bangles; // Only bangles

  // Function to handle search input
  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
  };

  return (
    <>
      {/* ParallaxScrollView for a scrollable page with a parallax effect */}
      <ParallaxScrollView
        noContentPadding // Disable default content padding
        headerHeight={width * 0.32} // Header height based on screen width
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} // Background color for the header
        headerImage={
          // Image to display in the parallax header
          <Image
            source={require('@/assets/images/dark-bgcloth.png')} // Background image
            style={styles.headerImg} // Style for the header image
          />
        }
        headerOverlayedContent={
          // Content overlaid on the parallax header
          <ThemedView transparent style={styles.headerContent}>
            {/* Search bar */}
            <SearchInput onSearch={handleSearch} />
            
            {/* Cart button */}
            <TouchableOpacity onPress={() => router.push('/cart')}>
              <Ionicons
                style={styles.cartButton} // Button styling
                name="cart-sharp" // Icon name
                size={24} 
                color={tintColorLight} 
              />
              {/* Badge for cart item count */}
              <View style={styles.cartCount}>
                <ThemedText customColor={white}>3</ThemedText>
              </View>
            </TouchableOpacity>
          </ThemedView>
        }
      >
        {/* Drawer for the filter menu */}
        <Drawer
          drawerPosition="right" // Position the drawer on the right
          open={openFilter} // Controlled by state
          onOpen={() => setOpenFilter(true)} // Open handler
          onClose={() => setOpenFilter(false)} // Close handler
          renderDrawerContent={() => (
            // Content inside the drawer
            <View style={styles.drawerContent}>
              <ThemedText>Filter Options</ThemedText>
            </View>
          )}
        >
          {/* Main content container */}
          <ThemedView style={styles.contentContainer}>
            {/* Title */}
            <ThemedText 
              type="semititle"
              font="glacialIndifferenceBold"
            >
              Discover Elegance
            </ThemedText>

            {/* Filter button */}
            <Ionicons.Button 
              style={styles.filterButton}
              name="filter" 
              size={30}
              backgroundColor="transparent"
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              onPress={() => setOpenFilter(prev => !prev)} // Toggle filter drawer
            />
            
            {/* Horizontal list of categories */}
            <FlashList
              data={appData.categories} // Data for the list
              horizontal // Display items horizontally
              renderItem={({ item }) => (
                <ThemedTouchableFilled 
                  style={{ marginRight: 10, borderRadius: 30 }} // Styling for category buttons
                  onPress={() => handleCategorySelect(item.name as 'rings' | 'bangles')} // Set the selected category
                >
                  <ThemedText customColor={white}>{item.name}</ThemedText>
                </ThemedTouchableFilled>
              )}
              estimatedItemSize={2} // Estimate of item size for performance
            />

            {/* Reset button to show both rings and bangles */}
            <TouchableOpacity onPress={resetCategorySelection} style={styles.resetButton}>
              <ThemedText customColor={white}>Show All</ThemedText>
            </TouchableOpacity>

            {/* Vertical list of selected category items */}
            <ThemedView style={styles.listItems}>
              <FlashList
                data={selectedProducts} // Data for the selected category (rings, bangles, or both)
                keyExtractor={(item) => item.id.toString()} // Unique key for each item
                numColumns={2} // Display items in 2 columns
                renderItem={({ item }) => <ItemCard item={item} />} // Render individual items
                estimatedItemSize={100} // Estimate of item size for performance
                showsVerticalScrollIndicator={false} // Hide scroll indicator
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
    height: height,
    padding: 20,
    overflow: 'hidden',
  },
  listItems: {
    flex: 1,
    height: height,
    overflow: 'hidden',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: Colors.light.tint,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
