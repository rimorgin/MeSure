import { FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors, darkBrown } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore, useOrderStore, useUserStore } from '@/store/appStore';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import ThemedBottomSheet, { ThemedBottomSheetRef } from '@/components/ThemedBottomSheet';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import ThemedDivider from '@/components/ThemedDivider';
import { makeid } from '@/utils/makeId';

export default function Checkout() {
  const theme = useColorSchemeTheme();
  const { userId, shippingDetails } = useUserStore();
  const { removeFromCart, checkOutCartItems, checkOutTotalPrice, checkOutTotalItems } = useCartStore();
  const { addOrder } = useOrderStore();
  const bottomSheetRef = useRef<ThemedBottomSheetRef>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>('Cash on Delivery');
  const snapPoints = ['20%', '40%']
  const [sheetIndex, newSheetIndex] = useState(0);
  const shippingFee = 40;

  const ETA = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()

  const jatot = checkOutTotalPrice() + shippingFee
  const totalItems = checkOutTotalItems();

  const options = [
    {
      name: 'Cash on Delivery',
      icon: 'cash'
    }, 
    {
      name: 'Credit / Debit Card',
      accountNumber: 'XXXX XXXX XXXX 5678 (DEMO ONLY)',
      icon: 'credit-card'
    }
  ];

  const handleConfirmOrder = async () => {
    const orderId = makeid(10);
    console.log(orderId)
    if (selectedOption!==null) {
      await addOrder(userId, orderId, checkOutCartItems, jatot)
      checkOutCartItems.map(async (item) => {
        console.log(item)
        await removeFromCart(userId, item.id, item.size, item.quantity, item.price)
      })
      router.push(`/(auth)/(extras)/ordersummary?orderId=${orderId}&paymentMethod=${selectedOption}&totalPrice=${jatot}&ETA=${ETA}&totalItems=${totalItems}`)
    } else {
      alert('Please select a payment option'); 
    }
  }

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    //console.log('offset y', offsetY)
    if (offsetY > 20 && sheetIndex !== 1) {
      newSheetIndex(1);
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,}]}>
     <FocusAwareStatusBar barStyle={theme==='light' ? 'dark-content' : 'light-content'} />
     <ThemedView style={{flex: 1}}>
       <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Ionicons 
            style={{paddingHorizontal: 10}}
            name='chevron-back' 
            size={30}
            backgroundColor='transparent'
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </TouchableOpacity>
        <ThemedText 
          font='montserratSemiBold' 
          type='title' 
          lightColor={darkBrown}
        >Checkout
        </ThemedText>
        <TouchableOpacity style={{paddingHorizontal: 20}}/>
      </ThemedView>
     <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background },
        ]}
      >
        <ThemedView style={styles.shippingDetailsContainer}>
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText font="cocoGothicBold" style={{color:'#BBB'}}>
              SHIPPING DETAILS
            </ThemedText>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => router.navigate('/(account)/(addresses)/editaddress')}
            >
              <ThemedText font="cocoGothicBold" lightColor={darkBrown}>
                EDIT
              </ThemedText>
              <Ionicons name="pencil" size={18} />
            </TouchableOpacity>
          </ThemedView>
          <TouchableOpacity
            onPress={() => {
              if (!shippingDetails.length) {
                router.navigate('/(account)/(addresses)/addnewaddress');
              }
            }}
          >
            <ThemedView style={styles.shippingDetails}>
              {shippingDetails.length ? (
                <ThemedText>Shipping details here</ThemedText>
              ) : (
                <ThemedView>
                  <ThemedText font="montserratLight">No shipping details yet</ThemedText>
                  <ThemedText style={{ alignSelf: 'center', fontSize: 16, color: '#AAA' }} font="montserratLight">
                    Click to add new
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.eta}>
          <ThemedText 
            font='cocoGothicBold'
            style={{color: '#CCC'}}
          >ESTIMATED DELIVERY DATE
          </ThemedText>
          <ThemedText 
            font='montserratSemiBold'
            style={{ color: '#AAA' }}
          >
            {ETA}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.paymentMethod}>
          <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
            <ThemedText 
              font='cocoGothicBold'
              style={{color: '#CCC'}}
            >PAYMENT METHOD
            </ThemedText>
          </ThemedView>
          <FlatList
            data={options}
            keyExtractor={(item) => item.name} // Ensure each item has a unique key
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedOption(item.name)}>
                <ThemedView style={styles.paymentOption}>
                  <ThemedView style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                    <MaterialCommunityIcons name={item.icon} size={28} color={darkBrown} />
                    <ThemedView>
                      <ThemedText>{item.name}</ThemedText>
                      {item.accountNumber && (
                        <ThemedText 
                          style={{ 
                            color: '#777',
                            fontSize: 12,
                          }}
                        >{item.accountNumber}
                        </ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.radioCircle}>
                    {selectedOption === item.name && <ThemedView style={styles.selectedCircle} />}
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </ThemedView>
        <ThemedView style={styles.orderSummary}>
          <ThemedText 
            font='cocoGothicBold'
            style={{color: '#CCC'}}
          >ORDER SUMMARY
          </ThemedText>
          <FlatList
            data={checkOutCartItems}
            keyExtractor={(item) => `${item.id.toString()}-${item.size}`}// Ensure each item has a unique key
            renderItem={({item,index}) => {
              const imageSource =
                typeof item.img === "string"
                  ? { uri: item.img } // For remote images
                  : item.img; // For local assets (numbers)
              return (
                 <ThemedView style={styles.orderItem}>
                  <Image source={imageSource} style={styles.orderImg}/>
                  <ThemedView>
                    <ThemedText font='montserratBold'>{item.name}</ThemedText>
                    <ThemedText font='montserratSemiBold' lightColor='#AAA'>Size {item.size}</ThemedText>
         
                  <ThemedView style={{flexDirection:'row', justifyContent:'space-between', marginTop: 10, width: '79%'}}>
                    <ThemedText font='spaceMonoRegular'>Php {item.price}</ThemedText>
                    <ThemedText font='montserratMedium' lightColor='#AAA'>QTY: {item.quantity}</ThemedText>
                  </ThemedView>
                  </ThemedView>
                </ThemedView>
              )
            }}
          />
        </ThemedView>
      </ScrollView>
       <ThemedBottomSheet
          preventHiding
          index={sheetIndex}
          snapPoints={snapPoints}
          noBackDrop={true} 
          ref={bottomSheetRef}
        >
          <ThemedView style={styles.bottomSheetContainer}>
            <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
              <ThemedText font='montserratMedium' lightColor='#AAA'>
                SUBTOTAL
              </ThemedText>
              <ThemedText font='spaceMonoRegular'>
                {checkOutTotalPrice()}
              </ThemedText>
            </ThemedView>
            <ThemedDivider width={0} marginY={2}/>
            <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
              <ThemedText font='montserratMedium' lightColor='#AAA'>
                SHIPPING
              </ThemedText>
              <ThemedText font='spaceMonoRegular'>
                +  {shippingFee}
              </ThemedText>
            </ThemedView>
            <ThemedDivider width={0.2} opacity={0.2} marginY={8}/>
            <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
              <ThemedText font='montserratBold'>
                TOTAL
              </ThemedText>
              <ThemedText font='spaceMonoRegular'>
                {jatot}
              </ThemedText>
            </ThemedView>
          
          <ThemedTouchableFilled
            onPress={handleConfirmOrder}
            style={{width: '80%', alignSelf:'center', position: 'absolute', bottom: 20}}
          >
            <ThemedText font='montserratSemiBold' type='subtitle'>
              Confirm Order
            </ThemedText>
          </ThemedTouchableFilled>
        </ThemedView>
      </ThemedBottomSheet>
     </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    padding: 30
  },
  scrollContent: {
    padding: 30, // Padding for content inside ScrollView
    flexGrow: 1, // Ensures it adapts to the content
    paddingBottom: 300 
  },
  shippingDetailsContainer: {
    marginBottom: 20, // Add spacing below this container
    height: '20%'
  },
  shippingDetails: {
    borderWidth: 1,
    borderRadius: 15,
    height: '100%',
    width: '100%',
    borderColor: '#CCC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  eta: {
    marginTop: 35,
    borderRadius: 15,
    height: '10%',
    width: '100%',
    padding: 15,
    borderColor: '#CCC',
    alignItems: 'flex-start',
    shadowColor: '#ABB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentMethod: {
    marginTop: 35,
    borderRadius: 15,
    height: 'auto',
    width: '100%',
    padding: 15,
    borderColor: '#CCC',
    alignItems: 'flex-start',
    justifyContent:'space-between',
    shadowColor: '#ABB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentOption: {
    flexDirection:'row', 
    width: '100%',
    alignSelf: 'center',
    justifyContent:'space-between',
    marginVertical: 10, 
    gap: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#444',
    marginRight: 12,
  },
  selectedCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#444',
  },
  orderSummary: {
    marginTop: 35,
    borderRadius: 15,
    height: 'auto',
    width: '100%',
    padding: 15,
    borderColor: '#CCC',
    alignItems: 'flex-start',
    shadowColor: '#ABB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  orderItem: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: -5,
    paddingTop: 5
  },
  orderImg: {
    top: -5,
    width: 100,
    height: 100,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 10,
  },
})