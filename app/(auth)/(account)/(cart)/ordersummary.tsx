import { Dimensions, Image, Platform, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { router, useLocalSearchParams } from 'expo-router'
import { darkBrown } from '@/constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useOrderStore } from '@/store/appStore'
import { useState } from 'react'
import AnimatedPopup from '@/components/MiniPopup'

const { width, height } = Dimensions.get('screen')

export default function OrderSummaryDetails() {
  const theme = useColorSchemeTheme();
  const { orders } = useOrderStore();
  const params = useLocalSearchParams<{ orderId?: string, paymentMethod?: string, totalPrice?: string, totalItems?: string, ETA?: string }>();
  
  const order = orders.find(order => order.orderId === params.orderId);
  //console.log(order);

  const [expandDetails, setExpandDetails] = useState(false)

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme === 'light' ? '#200A0A' : darkBrown,}]}>
      <FocusAwareStatusBar barStyle="light-content" animated />
      <ThemedView transparent style={styles.mainContent}>
        <ThemedView transparent style={styles.firstContainer}>
          <ThemedView style={styles.heart}>
            <AntDesign name="heart" size={28} color="white" />
          </ThemedView>
          <ThemedText 
            type='title'
            font='emilysCandyRegular'
            lightColor='white'
            darkColor='white'
            style={{textAlign:'center'}}
          >thank you for shopping with us
          </ThemedText>
          <ThemedText
            font='montserratMedium'
            lightColor='#CCC'
            darkColor='white'
            style={{textAlign:'center', marginTop: 15, width: '95%', letterSpacing: 1.8, lineHeight: 23}}
            >WE GOT YOUR ORDER AND HAPPILY PREPARING IT. ESTIMATED DELIVERY DATE: <ThemedText 
                    font='glacialIndifferenceBold'
                    lightColor='white'
                    darkColor='white'
                    style={{textTransform: 'capitalize'}}
                  >{params.ETA}
            </ThemedText>
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.secondContainer}>
          <ThemedView 
            style={{
              backgroundColor:'#E1AAA2', 
              width: '100%', 
              height: '45%',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              padding: 15,
            }}
          >
            <ThemedView transparent style={{justifyContent: 'space-between', height: '100%'}}>
              <ThemedText
              font='montserratBold'
              customColor='white'
              >ORDER ID # {params.orderId}
              </ThemedText>
              <ThemedView transparent>
                <ThemedText
                font='spaceMonoRegular'
                customColor='white'
                >No. of items {params.totalItems}
                </ThemedText>
                <ThemedText
                font='spaceMonoRegular'
                customColor='white'
                >Order price {params.totalPrice}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            <Image source={require('@/assets/images/orderSummary/jewelryshop.png')} style={styles.jewelryShopPng}/>
          </ThemedView>
          <ThemedView 
            style={{
              backgroundColor:'#C17A70', 
              width: '100%', 
              height: '55%',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              padding: 15,
            }}
          >
            <Image 
              source={require('@/assets/images/orderSummary/pin-pointer.png')} 
              style={{
                height: 200, width: 160,
                position: 'absolute',
                left: 20,
                bottom: -12
              }}

            />
            <ThemedView transparent style={{justifyContent: 'space-between', height: '100%'}}>
            <ThemedText
              font='montserratBold'
              customColor='white'
              style={{marginBottom: 25, alignSelf: 'flex-end'}}
            >SHIPPING DETAILS
            </ThemedText>
            
            <ThemedView transparent style={{ alignItems: 'flex-end', marginTop: -8}}>
              <ThemedView transparent>
                <ThemedText  style={{textAlign: 'right'}} font="cocoGothicBold" customColor='white'>{order?.shippingAddress.fullName}</ThemedText>
                
                <ThemedText style={{textAlign: 'right'}} customColor='white' font="spaceMonoRegular">
                  {order?.shippingAddress.contactNo}
                </ThemedText>
              </ThemedView>
              </ThemedView>
              {/* 
              <ThemedText 
                font="montserratLight" 
                customColor='white'
                style={{fontSize: 15, textAlign: 'right', width: 250}}
              >{order?.shippingAddress.streetBldgHouseNo},
              </ThemedText>
              <ThemedText 
                font="montserratLight" 
                customColor='white'
                style={{fontSize: 15, textAlign: 'right', width: 200}}
              >
                {order?.shippingAddress.rpcb}
              </ThemedText>
              */}
              <AnimatedPopup
                isVisible={expandDetails}
                toggleVisibility={() => setExpandDetails(!expandDetails)}
                height={150}
                duration={400}
              >
                <ThemedView transparent>
                  <ThemedText font="montserratBold" customColor='white'>Full address</ThemedText>
                  <ThemedText 
                    font="montserratLight" 
                    customColor='white'

                    style={{textAlign: 'center', marginTop: 25}}
                  >{order?.shippingAddress.streetBldgHouseNo},
                  </ThemedText>
                  <ThemedText 
                    font="montserratLight" 
                    customColor='white'
                    style={{textAlign: 'center'}}
                  >
                    {order?.shippingAddress.rpcb}
                  </ThemedText>
                </ThemedView>
              </AnimatedPopup>
              <TouchableOpacity
                onPress={() => setExpandDetails(!expandDetails)}
              >
                <ThemedText
                  font="montserratLight" 
                  customColor='white'
                  style={{textAlign: 'right'}}
                >{expandDetails ? '(close)' : '(expand details)'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
            {/* 
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >{order?.shippingAddress.fullName}
              </ThemedText>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >{order?.shippingAddress.streetBldgHouseNo}
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >{order?.shippingAddress.contactNo}
              </ThemedText>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >Brgy. Dolores
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >{}
              </ThemedText>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >{order?.shippingAddress.rpcb}
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >
              </ThemedText>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >(1920)
              </ThemedText>
            </ThemedView>
            */}
          </ThemedView>
          
          
        </ThemedView>
        <ThemedView transparent style={styles.thirdContainer}>
          <TouchableOpacity
            style={{
              width: '100%', 
              height: '40%',
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 15,
            }}
            onPress={() => router.replace('/(auth)/(tabs)/')}
          >
            <ThemedView transparent style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <ThemedText 
                font='cocoGothicBold'
                style={{fontSize: 22}}
              >Continue shopping
              </ThemedText>
              <Ionicons
                name='cart'
                size={30}
                color={darkBrown}
              />
            </ThemedView>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '100%', 
              height: '40%',
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 15,
            }}
            onPress={() => router.replace('/(auth)/(account)/(orders)/')}
          >
            <ThemedText 
              font='cocoGothicBold'
              customColor='white'
              style={{fontSize: 20, textDecorationLine: 'underline'}}
            >View order history
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
    padding: 25,
    paddingBottom: 0
  },
  firstContainer: {
    flex: 0.45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heart: {
    marginTop: -60,
    marginBottom: 20,
    width: 80,
    height: 80,
    backgroundColor: '#401D1D',
    alignItems:'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },
  secondContainer: {
    flex: 0.45,
    borderRadius: 15,
  },
  jewelryShopPng: {
    width: 150, 
    height: 150,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  thirdContainer: {
    marginTop: 15,
    flex: 0.2
  }
})