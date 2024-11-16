import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tintColorLight } from '@/constants/Colors';

const { width } = Dimensions.get('screen');

interface SearchInputType {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceTime?: number; // Optional debounce duration in milliseconds
}

export default function SearchInput({ 
  placeholder = "Search...", 
  onSearch, 
  debounceTime = 500 
}: SearchInputType) {
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');

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

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color={tintColorLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="gray"
      />
      {searchText && (
        <Ionicons 
          name="close-circle" 
          size={24} 
          color={tintColorLight} 
          style={styles.icon} 
          onPress={() => setSearchText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 40,
    width: width / 1.5,
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
