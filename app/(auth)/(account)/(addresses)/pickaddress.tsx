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

export default function PickAddress() {
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { shippingDetails, removeShippingDetails } = useShippingDetailsStore();
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log('from index ', shippingDetails)

  const handleSelectShippingDetail = async (shippingAddressId: string) => {
    router.replace(`/(account)/(cart)/checkout?shippingAddressId=${shippingAddressId}`)
  }

  return (
    <>
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
              </ThemedView>
              <TouchableOpacity
                onPress={() => handleSelectShippingDetail(item.id)}
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