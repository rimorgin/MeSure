import { FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors, darkBrown, mustard } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore, useOrderStore, usePaymentMethodsStore, useShippingDetailsStore, useUserStore } from '@/store/appStore';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import ThemedBottomSheet, { ThemedBottomSheetRef } from '@/components/ThemedBottomSheet';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import ThemedDivider from '@/components/ThemedDivider';
import { makeid } from '@/utils/makeId';
import { shippingAddress } from '@/types/useShippingDetailsStoreTypes';
import { PaymentMethods } from '@/types/usePaymentMethodsStoreTypes';
import { cardTypeImages } from '@/utils/identifyCardType';
import Loader from '@/components/Loader';

export default function Checkout() {
  const { shippingAddressId } = useLocalSearchParams<{shippingAddressId: string}>()
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { shippingDetails } = useShippingDetailsStore();
  const { removeFromCart, checkOutCartItems, checkOutTotalPrice, checkOutTotalItems } = useCartStore();
  const { addOrder } = useOrderStore();
  const { paymentMethods } = usePaymentMethodsStore();
  const bottomSheetRef = useRef<ThemedBottomSheetRef>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>('Cash on Delivery');
  const [shippingAddress, setShippingAddress] = useState<shippingAddress>();
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentMethods | undefined>(undefined);
  const snapPoints = ['20%', '40%']
  const [sheetIndex, newSheetIndex] = useState(0);
  const shippingFee = 40;
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {

    //from the change address picker
    if (shippingAddressId) {
      setShippingAddress(shippingDetails.find((address) => address.id === shippingAddressId))
      //else, load the default
    } else if (shippingDetails) {
      const defaultShippingAddress = shippingDetails.find((address) => address.defaultAddress === true);
      //console.log(defaultShippingAddress);
      if (defaultShippingAddress) {
        setShippingAddress(defaultShippingAddress);
      }
    }
  }, [shippingDetails]);

  useEffect(() => {
    const defaultPayment = paymentMethods.find((card) => card.defaultPaymentMethod === true)
    if (!defaultPayment) return
    //console.log('checkout', defaultPayment)
    setDefaultPaymentMethod(defaultPayment)
  },[paymentMethods])
  

  const ETA = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()

  const jatot = checkOutTotalPrice() + shippingFee
  const totalItems = checkOutTotalItems();

  function getCardSuffix(cardNumber: string) {
    return cardNumber.slice(-4); // Get the last 4 digits
  }


  const handleConfirmOrder = async () => {
    setLoading(true);
    const orderId = makeid(10);
    //console.log(orderId);

    if (!shippingAddress) {
      alert('Please select a shipping address');
      return;
    }

    if (selectedOption !== null) {
      await addOrder(userId, orderId, checkOutCartItems, jatot, totalItems, ETA, shippingAddress);
      checkOutCartItems.map(async (item) => {
        //console.log(item);
        await removeFromCart(userId, item.id, item.size, item.quantity, item.price, true);
      });
      setLoading(false);
      //make this dynamic route
      router.push(`/ordersummary?orderId=${orderId}&paymentMethod=${selectedOption}&totalPrice=${jatot}&ETA=${ETA}&totalItems=${totalItems}`);
    } else {
      alert('Please select a payment option');
      setLoading(false);
    }
  };


  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    //console.log('offset y', offsetY)
    if (offsetY > 20 && sheetIndex !== 1) {
      newSheetIndex(1);
    }
  };

  return (
    <>
    {loading && <Loader/>}
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
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.shippingDetailsContainer}>
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText font="cocoGothicBold" style={{color:'#BBB'}}>
              SHIPPING DETAILS
            </ThemedText>
            <ThemedView>
            {shippingAddress && (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                onPress={() => router.replace(`/(account)/(addresses)/pickaddress`)}
              >
                <ThemedText font="cocoGothicBold" lightColor={darkBrown}>
                  CHANGE
                </ThemedText>
                <FontAwesome name="exchange" size={18} color={darkBrown} />
              </TouchableOpacity>
            )}
            </ThemedView>
          </ThemedView>
          {!shippingAddress ? (
            <TouchableOpacity
              onPress={() => {
                if (!shippingDetails.length) {
                  router.navigate('/(account)/(addresses)/addnewaddress');
                }
              }}
            >
              <ThemedView style={styles.shippingDetailsEmpty}>
                <ThemedView>
                  <ThemedText font="montserratLight">No shipping details yet</ThemedText>
                  <ThemedText style={{ alignSelf: 'center', fontSize: 16, color: '#AAA' }} font="montserratLight">
                    Click to add new
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ) : (
          <TouchableOpacity
            onPress={() => router.navigate(`/(account)/(addresses)/editaddress?shippingAddressId=${shippingAddress?.id}`)}
          >
            <ThemedView style={styles.shippingDetails}>
              <ThemedView style={{flexDirection: 'row', gap: 10}}>
                <ThemedText font="montserratSemiBold">{shippingAddress?.fullName}</ThemedText>
                <ThemedText font="montserratMedium" customColor='#CCC'>|</ThemedText>
                <ThemedText customColor='#AAA' font="montserratSemiBold">
                  {shippingAddress?.contactNo}
                </ThemedText>
              </ThemedView>
              <ThemedText 
                font="montserratLight" 
                customColor='#AAA'
                style={{fontSize: 14}}
              >
                {shippingAddress?.streetBldgHouseNo}
              </ThemedText>
              <ThemedText 
                font="montserratLight" 
                customColor='#AAA'
                style={{fontSize: 14}}
              >
                {shippingAddress?.rpcb}
              </ThemedText>
              <ThemedView style={{flexDirection: 'row', gap: 10}}>
                {shippingAddress?.defaultAddress && 
                <ThemedView style={styles.boxes}>
                  <ThemedText>default</ThemedText>
                </ThemedView>
                }
                <ThemedView style={styles.boxes}>
                  <ThemedText>{shippingAddress?.addressType}</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedText 
                font="montserratLight"
                customColor='#AAA'
                style={{position:'absolute', bottom: 15, right: 10}}
              >{'(click to edit)'}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
          )}
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
          <TouchableOpacity onPress={() => setSelectedOption('Cash on Delivery')}>
            <ThemedView style={styles.paymentOption}>
              <ThemedView style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <MaterialCommunityIcons name='cash' size={28} color={darkBrown} />
                <ThemedView>
                  <ThemedText>Cash on Delivery</ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.radioCircle}>
                {selectedOption === 'Cash on Delivery' && <ThemedView style={styles.selectedCircle} />}
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
          {defaultPaymentMethod ? (
            <TouchableOpacity onPress={() => setSelectedOption('Credit/Debit Card')}>
              <ThemedView style={styles.paymentOption}>
                <ThemedView style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <Image source={cardTypeImages[defaultPaymentMethod.cardType]} style={{width: 28, height: 28}} resizeMode='contain'/>
                  <ThemedView>
                    <ThemedText>Credit/Debit Card</ThemedText>
                    <ThemedText>{`**** **** **** ${getCardSuffix(defaultPaymentMethod.cardNumber)}`}</ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView style={styles.radioCircle}>
                  {selectedOption === 'Credit/Debit Card' && <ThemedView style={styles.selectedCircle} />}
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.navigate('/(auth)/(account)/(paymentmethods)/addpaymentmethod')}>
              <ThemedView style={styles.paymentOption}>
                <ThemedView style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <MaterialCommunityIcons name='credit-card-chip-outline' size={26} color={darkBrown} />
                  <ThemedView>
                    <ThemedText>No Credit/Debit Card yet</ThemedText>
                  </ThemedView>
                </ThemedView>
                <Ionicons
                  name='add-circle'
                  size={26}
                  color={'#5A5A5A'}
                  style={{marginRight: 11}}
                />
              </ThemedView>
            </TouchableOpacity>
          )}
        </ThemedView>
        <ThemedView style={styles.orderSummary}>
          <ThemedText 
            font='cocoGothicBold'
            style={{color: '#CCC'}}
          >ORDER SUMMARY
          </ThemedText>
          <FlatList
            scrollEnabled={false}
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
    </>
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
    height: 'auto',
    padding: 30, // Padding for content inside ScrollView
    paddingBottom: 300
  },
  list: {
    flex: 1,
  },
  shippingDetailsContainer: {
    height: 'auto',
    marginVertical: 5
  },
  shippingDetails: {
    borderWidth: 1,
    borderRadius: 15,
    height: 130,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    padding: 10
  },
  shippingDetailsEmpty: {
    borderWidth: 1,
    borderRadius: 15,
    height: 130,
    width: '100%',
    borderColor: '#CCC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxes: {
    borderWidth: 1,
    marginTop: 10,
    borderColor: mustard,
    borderRadius: 5,
    padding: 5,
    alignSelf: 'flex-start',
  },
  eta: {
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