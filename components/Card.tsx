import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('screen')

interface ItemCardProps {
  item: {
    id: number; 
    img: any[]; 
    name: string; 
    description: string;
    price: string;
    rating: number;
  };
}

const ratingStars = (rating: number): string => {
  if (rating < 1 || rating > 5) {
    return ''; // Handle cases where rating is outside the valid range
  }
  return '⭐'.repeat(rating);
};
export default function ItemCard({ item }: ItemCardProps) {
  const theme = useColorSchemeTheme();


  return (
    <TouchableHighlight
        onPress={() => router.push(`/(auth)/(product)/${item.id}`)}
        style={styles.button}
    >
        <ThemedView style={styles.cardContainer}>
            <Image source={item.img[0]} style={styles.image} />
            <ThemedText 
                type='default' 
                font='glacialIndifferenceBold'
            >{item.name}
            </ThemedText>
            <ThemedText 
                font='spaceMonoRegular' 
                style={styles.price}
            >Php {item.price}
            </ThemedText>
        </ThemedView>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius: 9,
  },
  cardContainer: {
    width: width/2.4,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { 
        width: 0, 
        height: 2 
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
});
