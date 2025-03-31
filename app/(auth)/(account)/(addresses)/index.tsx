import { Dimensions, FlatList, Platform, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { ThemedView } from '@/components/ThemedView'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { darkBrown, mustard } from '@/constants/Colors'
import { useShippingDetailsStore, useUserStore } from '@/store/appStore'
import ThemedDivider from '@/components/ThemedDivider'
import { ThemedTouchableFilled } from '@/components/ThemedButton'
import { string } from 'yup'
import ThemedModal from '@/components/ThemedModal'
import Loader from '@/components/Loader'

const { width, height } = Dimensions.get('screen')

export default function MyAddresses() {
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { shippingDetails, removeShippingDetails } = useShippingDetailsStore();
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log('from index ', shippingDetails)

  const handleDeleteShippingDetail = async (shippingAddressId: string) => {
    setLoading(true);
    setShowDeleteModal(false)
    const shippingAddress = shippingDetails.find((address) => address.id === shippingAddressId);
     //console.log(shippingAddress)
     // If not found, log or return
    if (!shippingAddress) {
      return; // or handle the error appropriately
    }
    await removeShippingDetails(userId, shippingAddress)
    setLoading(false)
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
            onPress={() => handleDeleteShippingDetail(shippingAddressId)}
            style={{height: 50, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: mustard}}
          >
            <ThemedText>DELETE</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedModal>
    <ThemedView style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
      <FlatList 
        data={shippingDetails}
        keyExtractor={(item) => `${item.id}-${item.postalCode}`}
        style={styles.list}
        renderItem={({item, index}) => {
          return (
            <ThemedView style={styles.shippingDetailsContainer}>
              <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText font="glacialIndifferenceBold" style={{color:'#BBB'}}>
                  SHIPPING ADDRESS {index + 1}
                </ThemedText>
                <ThemedView style={{flexDirection: 'row', gap: 5}}>
                  <TouchableOpacity
                    onPress={() => router.navigate(`/(account)/(addresses)/editaddress?shippingAddressId=${item.id}`)}
                  >
                    <Ionicons name="pencil" size={22} color={darkBrown} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDeleteModal(true);
                      setShippingAddressId(item.id)
                    }}
                  >
                    <Ionicons name="trash" size={22} color={darkBrown} />
                  </TouchableOpacity>
                </ThemedView>
                
              </ThemedView>
              <TouchableOpacity
                onPress={() => { 
                  router.navigate(`/(account)/(addresses)/editaddress?shippingAddressId=${item.id}`)  
                }}
              >
                <ThemedView style={styles.shippingDetails}>
                  <ThemedView style={{flexDirection: 'row', gap: 10}}>
                    <ThemedText font="montserratSemiBold">{item.fullName}</ThemedText>
                    <ThemedText font="montserratMedium" customColor='#CCC'>|</ThemedText>
                    <ThemedText customColor='#AAA' font="montserratSemiBold">
                      {item.contactNo}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText 
                    font="montserratLight" 
                    customColor='#AAA'
                    style={{fontSize: 14}}
                  >
                    {item.streetBldgHouseNo}
                  </ThemedText>
                  <ThemedText 
                    font="montserratLight" 
                    customColor='#AAA'
                    style={{fontSize: 14}}
                  >
                    {item.rpcb}
                  </ThemedText>
                  <ThemedView style={{flexDirection: 'row', gap: 10}}>
                    {item.defaultAddress && (
                      <ThemedView style={styles.boxes}>
                        <ThemedText>Default</ThemedText>
                      </ThemedView>
                    )}
                    {item.addressType && (
                      <ThemedView style={styles.boxes}>
                        <ThemedText>{item.addressType}</ThemedText>
                      </ThemedView>
                    )}
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          )
        }}
        ListEmptyComponent={
          <ThemedView style={styles.shippingDetailsContainer}>
              <ThemedText font="glacialIndifferenceBold" style={{color:'#BBB', marginBottom:5}}>
                SHIPPING ADDRESS 1
              </ThemedText>
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
          </ThemedView>
        }
        ListFooterComponent={() => 
          shippingDetails.length > 0 && ( 
          <>
          <ThemedDivider width={0.1} opacity={0.1} marginY={20} />
          <ThemedTouchableFilled
            onPress={() => router.navigate('/(account)/(addresses)/addnewaddress')}
          >
            <ThemedText>Add new address</ThemedText>
          </ThemedTouchableFilled>
          </>
        )
        }
      />
    </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
  }
})