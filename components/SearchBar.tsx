import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tintColorLight } from '@/constants/Colors';
import { TapGestureHandler } from 'react-native-gesture-handler';

interface SearchInputType {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceTime?: number; // Optional debounce duration in milliseconds
}

export default function SearchInput({
  placeholder = "Find your needs...",
  onSearch,
  debounceTime = 500,
}: SearchInputType) {
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const animatedBorderWidth = useRef(new Animated.Value(0.5)).current; // Initial border width
  const animatedBorderColor = useRef(new Animated.Value(0)).current; // For animating color

  // Interpolate border color between `#CCC` (initial) and `brown`
  const borderColor = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#CCC', 'brown'],
  });

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(searchText); // Set debounced text
    }, debounceTime);

    return () => clearTimeout(handler); // Cleanup timeout
  }, [searchText, debounceTime]);

  // Trigger onSearch whenever debouncedText changes
  useEffect(() => {
    onSearch(debouncedText);
  }, [debouncedText, onSearch]);

  const handleSearchPress = () => {
    setSearching(true);
    Animated.parallel([
      Animated.timing(animatedBorderWidth, {
        toValue: 2, // Increase border width
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorderColor, {
        toValue: 1, // Change color to `brown`
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleClosePress = () => {
    Animated.parallel([
      Animated.timing(animatedBorderWidth, {
        toValue: 0.5, // Restore initial border width
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(animatedBorderColor, {
        toValue: 0, // Change color back to `#CCC`
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => setSearching(false)); // Set searching to false after animation
    setSearchText(''); // Reset search text
  };

  return (
    <Animated.View
      style={[
        styles.searchContainer,
        {
          borderWidth: animatedBorderWidth, // Animate border width
          borderColor: borderColor, // Animate border color
        },
      ]}
      pointerEvents='box-none'
    >
      <TapGestureHandler 
        onBegan={handleSearchPress}
      >
        <View style={{flexDirection: 'row'}}>
        <Ionicons 
          name="search" 
          size={24} 
          color={tintColorLight} 
          style={styles.icon} 
        />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="gray"
          onEndEditing={handleClosePress}
        />

        {searching && (
          <TouchableOpacity
            onPress={handleClosePress} // Use the close handler
            hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
          >
          <Ionicons
            name="close-circle"
            size={24}
            color={tintColorLight}
            style={styles.icon}
            
          />
          </TouchableOpacity>
        )}
        </View>
      </TapGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1
  },
  searchContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 8,
    height: 40,
    width: '80%'
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});
