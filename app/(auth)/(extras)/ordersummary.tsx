import { Dimensions, Image, Platform, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { router, useLocalSearchParams } from 'expo-router'
import { darkBrown, white } from '@/constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { ThemedTouchableFilled } from '@/components/ThemedButton'

const { width, height } = Dimensions.get('screen')

export default function OrderSummaryDetails() {
  const theme = useColorSchemeTheme();
  const params = useLocalSearchParams<{ orderId?: string, paymentMethod?: string, totalPrice?: string, totalItems?: string, ETA?: string }>();
  
  console.log(params);


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
              padding: 15
            }}
          >
            <ThemedText
              font='montserratBold'
              customColor='white'
              style={{marginBottom: 15}}
            >SHIPPING DETAILS
            </ThemedText>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >Adam Smith
              </ThemedText>
              <ThemedText 
                font='itcNewBaskerville' 
                customColor='white'
              >B2 L16 Matsui St.
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >+63 976 039 2028
              </ThemedText>
              <ThemedText 
                font='itcNewBaskerville' 
                customColor='white'
              >Brgy. Dolores
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >calvscalderonx@gmail.com
              </ThemedText>
              <ThemedText 
                font='itcNewBaskerville' 
                customColor='white'
              >Taytay, Rizal
              </ThemedText>
            </ThemedView>
            <ThemedView transparent style={{justifyContent: 'space-between', width: '100%', flexDirection: 'row', marginVertical: 2}}>
              <ThemedText 
                font='glacialIndifferenceRegular' 
                customColor='white'
              >
              </ThemedText>
              <ThemedText 
                font='itcNewBaskerville' 
                customColor='white'
              >(1920)
              </ThemedText>
            </ThemedView>
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
            onPress={() => router.push('/(auth)/(tabs)/')}
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
            onPress={() => router.push('/(auth)/(account)/')}
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