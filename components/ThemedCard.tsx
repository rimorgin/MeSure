import { Image, StyleSheet, Dimensions, TouchableHighlight, View, TouchableOpacity, FlatList } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedTouchableFilled } from './ThemedButton';
import { darkBrown } from '@/constants/Colors';
import { router } from 'expo-router';
import ThemedDivider from './ThemedDivider';
import { Collapsible } from './Collapsible';

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
      onPress={()=> router.navigate(`/product/${item.id}`)}
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
    router.navigate(item.link);
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



const windowWidth = Dimensions.get('window').width;

export function OrderCard({ item, onPress }: { item: any; index?: number; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
    >
      <ThemedView style={orderStyles.itemContainer}>
      <ThemedView transparent style={{ flexDirection: 'row', width: '100%',justifyContent: 'space-between' }}>
        <ThemedText lightColor='#AAA' font="montserratSemiBold">{`#${item.orderId}`}</ThemedText>
        <ThemedText font="montserratSemiBold" style={{ color: getStatusColor(item.status) }}>
          {item.status}
        </ThemedText>
      </ThemedView>
      <ThemedDivider width={0.4} opacity={0.2} marginY={5}/>
        {item.items.length >= 2 ? (
          <FlatList
            data={item.items}
            keyExtractor={(item) => `${item.id}-${item.size}`}
            scrollEnabled={false}
            renderItem={({ item }) => {
              return (
              <ThemedView transparent style={orderStyles.orderItem}>
                <Image source={item.img} style={orderStyles.image}/>  
                <ThemedView transparent>
                  <ThemedText font='montserratBold'>{item.name}</ThemedText>
                  <ThemedText font='montserratSemiBold' lightColor='#AAA'>Size {item.size}</ThemedText>
        
                <ThemedView transparent style={{flexDirection:'row', justifyContent:'space-between', marginTop: 10, width: '79%'}}>
                  <ThemedText font='spaceMonoRegular'>Php {item.price}</ThemedText>
                  <ThemedText font='montserratMedium' lightColor='#AAA'>QTY: {item.quantity}</ThemedText>
                </ThemedView>
                </ThemedView>
              </ThemedView>
              )
            }}
          />
        ) : (
          <ThemedView transparent style={orderStyles.orderItem}>
            <Image source={item.items[0].img} style={orderStyles.image}/>
            <ThemedView transparent>
              <ThemedText font='montserratBold'>{item.items[0].name}</ThemedText>
              <ThemedText font='montserratSemiBold' lightColor='#AAA'>Size {item.items[0].size}</ThemedText>
    
            <ThemedView transparent style={{flexDirection:'row', justifyContent:'space-between', marginTop: 10, width: '79%'}}>
              <ThemedText font='spaceMonoRegular'>Php {item.items[0].price}</ThemedText>
              <ThemedText font='montserratMedium' lightColor='#AAA'>QTY: {item.items[0].quantity}</ThemedText>
            </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'orange';
    case 'shipped':
      return 'green';
    case 'completed':
      return 'blue';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const orderStyles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 5, 
    backgroundColor: '#FFFDFA', 
    marginVertical: 5,
    shadowColor: '#AAA',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 10,
    padding: 10,
    height: 'auto',
  },
  dropdownContent: {
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    flexGrow: 1
  },
  orderItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: -5,
    paddingTop: 5
  },
  image: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
});