import { Image, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Link, router } from 'expo-router';
import { string } from 'yup';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ThemedTouchableFilled } from './ThemedButton';
import { black, darkBrown, white } from '@/constants/Colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('screen')

interface ItemCardProps {
  item: {
    id: number; 
    img: any[]; 
    name: string; 
    description: string;
    price: string;
    rating: number;
    AR: boolean;
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const theme = useColorSchemeTheme();

  return (
    <TouchableHighlight 
      onPress={()=> router.push(`/products/${item.id}`)}
      style={styles.button}
    > 

        <ThemedView style={styles.cardContainer}>
          {item.AR && 
            <MaterialCommunityIcons
              size={28}
              color={darkBrown}
              name='augmented-reality'
              style={{position:'absolute', right: 10, top: 10}}
            />
          }
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


interface CategoryCardProps {
  item: {
    id: number;
    name: string;
    iconProvider: string; 
    iconName: string;
  };
  handleCategorySelect: (name: string) => void; // Updated to accept the category name
  isOdd: boolean;
}

const getIconProvider = (providerName: string) => {
  switch (providerName) {
    case 'Ionicons':
      return Ionicons;
    case 'MaterialCommunityIcons':
      return MaterialCommunityIcons;
    case 'FontAwesome5':
      return FontAwesome5;
    // Add more cases for other icon providers as needed
    default:
      return null; // Return null or a default icon if not found
  }
};

export function CategoryCard({ item, handleCategorySelect, isOdd }: CategoryCardProps) {
  const IconProvider = getIconProvider(item.iconProvider); // Get the icon component based on the provider
  if (!IconProvider) {
    console.error(`Icon provider ${item.iconProvider} not found`);
    return null; // Handle the case where the icon provider is not found
  }

  return (
    <ThemedTouchableFilled 
      style={{ 
        marginRight: 10, 
        borderRadius: 30,
      }}
      onPress={() => handleCategorySelect(item.name)}
    > 
    <View style={{flexDirection:'row'}}>
      <IconProvider
        name={item.iconName}
        size={23}
        color={darkBrown}
        style={{marginRight: 10}}
      />
      <ThemedText type='default' customColor="white">{item.name}</ThemedText>
    </View>
    </ThemedTouchableFilled>
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
