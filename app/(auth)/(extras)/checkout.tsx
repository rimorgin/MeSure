import { Platform, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors, darkBrown } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useCartStore, useUserStore } from '@/store/appStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';

export default function Checkout() {
  const theme = useColorSchemeTheme();
  const { shippingDetails } = useUserStore();
  const { checkOutCartItems } = useCartStore();

  console.log(checkOutCartItems)

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
      <ThemedView style={styles.mainContent}>
        <ThemedView style={styles.shippingDetailsContainer}>
          <ThemedView 
            style={{flexDirection: 'row', justifyContent:'space-between'}}
            >
            <ThemedText 
              font='montserratRegular'
              lightColor={darkBrown}
            >SHIPPING DETAILS
            </ThemedText>
            <TouchableOpacity 
              style={{flexDirection:'row', alignItems:'center'}}
              onPress={() => router.push('/(account)/addresses')}
            >
              <ThemedText 
                font='cocoGothicBold'
                lightColor={darkBrown}
              >EDIT</ThemedText>
              <Ionicons
                name='pencil'
                size={18}
              />
            </TouchableOpacity>
          </ThemedView>
          <TouchableOpacity>
            <ThemedView style={styles.shippingDetails}>
              {shippingDetails.length ? (
                <ThemedText></ThemedText>
              ) : (
                <ThemedView>
                    <ThemedText font='montserratLight'>No shipping details yet</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
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
  shippingDetailsContainer: {
    
  },
  shippingDetails: {
    borderWidth: 1,
    height: '50%',
    width: '100%',
    borderColor: '#CCC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center'
  }
})