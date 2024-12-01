import { FlatList, Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { CreditCard, LiteCreditCard } from '@/components/CreditCard'
import { darkBrown, mustard, white } from '@/constants/Colors'
import { usePaymentMethodsStore, useUserStore } from '@/store/appStore'
import { ThemedText } from '@/components/ThemedText'
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { cardTypeImages } from '@/utils/identifyCardType'
import Loader from '@/components/Loader'
import ThemedModal from '@/components/ThemedModal'

export default function PaymentMethods() {
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { paymentMethods, removePaymentMethod } = usePaymentMethodsStore();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState('');

  function getCardSuffix(cardNumber: number | string): string {
    const cardStr = cardNumber.toString();
    return cardStr.slice(-4); // Get the last 4 digits
  }
  const renderAsterisks = () => {
    return Array.from({ length: 12 }).map((_, index) => (
      <React.Fragment key={index}>
        <FontAwesome name="asterisk" size={9} color="white"/>
        {/* Add a space every 4th element */}
        {(index + 1) % 4 === 0 && <View style={{ width: 5, marginBottom: 5 }} />} {/* Adjust width to set space */}
      </React.Fragment>
    ));
  };

  const handleDeletePaymentMethod = () => {
    try {
      setLoading(true)
      const paymentMethodToDelete = paymentMethods.find((card) => card.cardNumber === toDelete)
      if (!paymentMethodToDelete) return
      removePaymentMethod(userId, paymentMethodToDelete)
      
    } catch(error) {
      console.error(error)
      setLoading(false)
      setShowDeleteModal(false)
    } finally {
      setShowDeleteModal(false)
      setLoading(false)
    }
  }

  return (
    <>
    {loading && <Loader/>}
    <ThemedModal
      showModal={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      height={200}
    >
      <ThemedView style={{padding: 10}}>
        <ThemedText style={{textAlign: 'center'}} font='montserratBold' type='subtitle'>Are you sure you want to delete?</ThemedText>
        <ThemedView style={{marginTop: 20, marginLeft: -8, flexDirection: 'row', width: '100%', gap: 20, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity 
            onPress={() => setShowDeleteModal(false)}
            style={{height: 50, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#371211'}}
          >
            <ThemedText lightColor='white'>CANCEL</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDeletePaymentMethod}
            style={{height: 50, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: mustard}}
          >
            <ThemedText>DELETE</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedModal>
    <ThemedView style={styles.container}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} animated />
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.cardNumber.toString()}
            renderItem={({ item }) => {
              return (
                    <LiteCreditCard style={{marginBottom: 25, padding: 20, height: 80, flexDirection: 'row', alignItems: 'center', gap: 15}}>
                      <Image 
                        source={cardTypeImages[item.cardType.toLowerCase()]} 
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: 'contain',
                        }}
                      />
                      <ThemedView transparent>
                        <ThemedText customColor='white'>{renderAsterisks()}{getCardSuffix(item.cardNumber)}</ThemedText>
                        <ThemedView transparent style={{flexDirection: 'row', gap: 15}}>
                          <ThemedText customColor='#AAA'>expires {item.expirationDate}</ThemedText>
                          {item.defaultPaymentMethod && <ThemedText customColor='#AAA'>{'(DEFAULT)'}</ThemedText>}
                        </ThemedView>
                      </ThemedView>
                      <TouchableOpacity 
                        onPress={() => router.navigate(`/editpaymentmethod?editCardNumber=${item.cardNumber}`)}
                        style={{position: 'absolute', top:10, right: 10}}
                      >
                        <FontAwesome name="pencil-square-o" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => {
                          setShowDeleteModal(true)
                          setToDelete(item.cardNumber);
                        }}
                        style={{position: 'absolute', bottom:10, right: 10}}
                      >
                        <MaterialCommunityIcons name="credit-card-remove" size={24} color="white" />
                      </TouchableOpacity>
                    </LiteCreditCard>
                
                
              )
            }}
            ListEmptyComponent={
              <ThemedView style={styles.noCardContainer}>
                <ThemedView style={{width: '100%', alignItems: 'center' , justifyContent: 'center'}}>
                  <MaterialIcons 
                    name="credit-card-off" 
                    size={120} 
                    color={darkBrown} 
                  />
                  <ThemedText
                    font='cocoGothicBold'
                    type='subtitle'
                    lightColor={darkBrown}
                    darkColor='white'
                  >NO CARD DETAILS YET
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            }
          />
          <TouchableOpacity
            onPress={() => router.navigate('/addpaymentmethod')}
            style={{width:'100%', position: 'absolute', bottom: 30, alignSelf: 'center'}}
          >
            <ThemedText 
              font='cocoGothicBold'
              type='subtitle'
              lightColor={white} 
              style={{position: 'absolute', zIndex: 10, alignSelf: 'center', top: 25}}
            >Add Card
            </ThemedText>
            <LiteCreditCard />
          </TouchableOpacity>
      
    </ThemedView>
     </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  cardContainers: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})