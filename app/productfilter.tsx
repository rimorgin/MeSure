import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Slider from '@react-native-community/slider';
import { Colors, black, darkBrown, tintColorLight, white } from '@/constants/Colors';

interface FilterDrawerProps {
  openFilter: boolean;
  onClose: () => void;
  sortOption: 'name' | 'price';
  setSortOption: (option: 'name' | 'price') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedSize: number;
  setSelectedSize: (size: number) => void;
  showARProducts: boolean;
  setShowARProducts: (show: boolean) => void;
}

export default function productfilter({
  openFilter,
  onClose,
  sortOption,
  setSortOption,
  sortOrder,
  setSortOrder,
  selectedSize,
  setSelectedSize,
  showARProducts,
  setShowARProducts,
}: FilterDrawerProps) {
  return (
    <View style={styles.container}>
      {/* Sort Options */}
      <View style={styles.section}>
        <ThemedText customColor={black} style={styles.sectionTitle}>Sort By</ThemedText>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortOption === 'name' && styles.activeOption,
            ]}
            onPress={() => setSortOption('name')}
          >
            <ThemedText customColor={sortOption === 'name' ? white : white}>Name</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortOption === 'price' && styles.activeOption,
            ]}
            onPress={() => setSortOption('price')}
          >
            <ThemedText customColor={sortOption === 'price' ? white : white}>Price</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortOption,
              showARProducts ? styles.activeOption : styles.inactiveOption,
            ]}
            onPress={() => setShowARProducts(!showARProducts)}
          >
            <ThemedText customColor={showARProducts ? white : white}>
              {showARProducts ? 'AR On' : 'AR Off'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Size Filter */}
      <View style={styles.section}>
        <ThemedText customColor={black} style={styles.sectionTitle}>Size</ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={25}
          step={0.5}
          value={selectedSize}
          thumbTintColor={darkBrown}
          onValueChange={setSelectedSize}
          minimumTrackTintColor={tintColorLight}
          maximumTrackTintColor={Colors.light.text}
        />
        <ThemedText customColor={black}>Max Size: {selectedSize}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sortOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#2c1414',
  },
  activeOption: {
    backgroundColor: tintColorLight,
  },
  inactiveOption: {
    backgroundColor: '#2c1414',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
