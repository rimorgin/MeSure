import { Image, StyleSheet, Dimensions, TouchableHighlight, View, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedTouchableFilled } from './ThemedButton';
import { darkBrown } from '@/constants/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('screen')

interface ItemCardProps {
  item: {
    id: number; 
    img: any[]; 
    name: string; 
    description: string;
    price: string;
    rating: number;
    sold: number
    AR: boolean;
  };
}

export function ItemCard({ item }: ItemCardProps) {

  return (
    <TouchableHighlight 
      onPress={()=> router.push(`/product/${item.id}`)}
      style={styles.button}
      underlayColor={'#EBE0C6'}
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
          <ThemedView transparent style={{flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', width:'100%'}}>
            <ThemedText 
                font='spaceMonoRegular' 
                style={styles.price}
            ><ThemedText>₱ </ThemedText>{item.price}
            </ThemedText>
            <ThemedText 
                font='spaceMonoRegular' 
                style={styles.sold}
            >{item.sold} sold
            </ThemedText>
          </ThemedView>
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
    link?: string;
  };
  handleCategorySelect?: (name: string) => void; // Updated to accept the category name
  handleNavigate?: (name: string) => void;
  isOdd: boolean;
}

const getIconProvider = (providerName: string) => {
  switch (providerName) {
    case 'Ionicons':
      return Ionicons;
    case 'MaterialCommunityIcons':
      return MaterialCommunityIcons;
    case 'MaterialIcons':
      return MaterialIcons
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

  const handleSelect = () => {
    if (handleCategorySelect) {
      handleCategorySelect(item.name); // Call only if defined
    }
  };

  return (
    <ThemedTouchableFilled 
      style={{ 
        marginRight: 10, 
        borderRadius: 30,
      }}
      onPress={handleSelect}
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
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { 
        width: 0, 
        height: 2 
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#F1F0F0',
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
    alignSelf:'center'
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
  sold: {
    fontSize: 10,
    color: '#666',
  },
});

export function PurchasesCard({ item, handleNavigate }: CategoryCardProps) {
  const IconProvider = getIconProvider(item.iconProvider); // Get the icon component based on the provider
  if (!IconProvider) {
    console.error(`Icon provider ${item.iconProvider} not found`);
    return null; // Handle the case where the icon provider is not found
  }

  const handleNav = () => {
    handleNavigate?.(item.link || ''); // Optional chaining, shorthand for checking
    router.push(item.link);
  };

  return (
    <TouchableOpacity 
      style={{ 
        marginRight: 10, 
        borderRadius: 30,
        paddingHorizontal: 10,
      }}
      onPress={handleNav}
    > 
    <View style={{alignItems:'center'}}>
      <IconProvider
        name={item.iconName}
        size={23}
        color={darkBrown}
        style={{marginRight: 10}}
      />
      <ThemedText type='default'>{item.name}</ThemedText>
    </View>
    </TouchableOpacity>
  );
}
