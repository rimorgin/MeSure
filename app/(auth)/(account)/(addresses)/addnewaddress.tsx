import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { darkBrown, mustard } from '@/constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import ThemedDivider from '@/components/ThemedDivider'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ThemedTouchableFilled } from '@/components/ThemedButton'
import { useAddressFormStore, useShippingDetailsStore, useUserStore } from '@/store/appStore'
import { makeid } from '@/utils/makeId'
import Loader from '@/components/Loader'

const { width, height } = Dimensions.get('screen')

export default function AddNewAddress() {
  const { newRpcb } = useLocalSearchParams<{newRpcb: string}>()
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { addShippingDetails } = useShippingDetailsStore();
  /*
  const [fullName, setFullName] = useState('');
  const [contactNo, setContactNo] = useState('');
  //region, province, city, barangay (RPCB)
  const [rpcb, setRpcb] = useState(newRpcb);
  const [postalCode, setPostalCode] = useState('');
  const [streetBldgHouseNo, setStreetBldgHouseNo] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'work' | undefined>();
  const [defaultAddress, setDefaultAddress] = useState(false);
  */
  const [loading, setLoading] = useState(false);
  const { fullName, contactNo, rpcb, postalCode, streetBldgHouseNo, addressType, defaultAddress, setField, resetShippingAddressForm } = useAddressFormStore();

  useEffect(() => {
    if (newRpcb) {
      setField('rpcb', newRpcb)
    } else {
      resetShippingAddressForm();
    }
  },[newRpcb, setField])

  const toggleSwitch = () => setField('defaultAddress', !defaultAddress);

  const handleAddressTypeChange = (type: 'home' | 'work') => {
    setField('addressType', type);
  };

  const submit = async () => {
    if (!fullName || !contactNo || !rpcb || !postalCode || !streetBldgHouseNo) {
      console.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const id = await makeid(5);
    const data = {
      id,
      fullName,
      contactNo,
      rpcb,
      postalCode,
      streetBldgHouseNo,
      addressType: addressType ? addressType : 'home',
      defaultAddress,
    };
    //console.log(data);
    await addShippingDetails(userId, data);
    setLoading(false);
    resetShippingAddressForm();
    router.back();

  };

  return (
    <>
    {loading && <Loader/>}
    <ThemedView style={styles.container}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} animated />
      <KeyboardAvoidingView style={{flex:1}}>
      <TouchableWithoutFeedback  
        onPress={() => Keyboard.dismiss()} 
        style={{flex:1}}
      >
      <ThemedView style={{flex:1, padding:25}}>
      <ThemedText 
        font='cocoGothicBold'
        type='subtitle'
        style={{color: darkBrown}}
      >Contact
      </ThemedText>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setField('fullName', text)}
          value={fullName}
          placeholder="Full name"
          placeholderTextColor={darkBrown}
        />
        <ThemedDivider width={0.2} opacity={0.2} marginY={2}/>
        <TextInput
          keyboardType='number-pad'
          style={styles.input}
          onChangeText={(text) => setField('contactNo', text)}
          value={contactNo}
          placeholder="Phone number"
          placeholderTextColor={darkBrown}
        />  
      </ThemedView>
      <ThemedDivider width={0} marginY={10}/>
      <ThemedText 
        font='cocoGothicBold'
        type='subtitle'
        style={{color: darkBrown}}
      >Address
      </ThemedText>
      
      <ThemedView style={styles.inputContainer}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPress={() => {
            router.replace('/(account)/(addresses)/selectregion?routeBack=addnewaddress')
          }}
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            onChangeText={(text) => setField('rpcb', text)}
            value={rpcb}
            placeholder="Region, Province, City, Barangay"
            placeholderTextColor={darkBrown}
            readOnly={!rpcb ? true : false}
            
          />
          <Ionicons
            name='chevron-forward'
            size={20}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
        </TouchableOpacity>
        <ThemedDivider width={0.2} opacity={0.2} marginY={2}/>
        <TextInput
          keyboardType='number-pad'
          style={styles.input}
          onChangeText={(text) => setField('postalCode', text)}
          value={postalCode}
          placeholder="Postal code"
          placeholderTextColor={darkBrown}
        />
        <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setField('streetBldgHouseNo', text)}
          value={streetBldgHouseNo}
          placeholder="Street Name, Building, House No., Village"
          placeholderTextColor={darkBrown}
        />    
      </ThemedView>
      <ThemedDivider width={0} marginY={10}/>
      <ThemedText 
        font='cocoGothicBold'
        type='subtitle'
        style={{color: darkBrown}}
      >Settings
      </ThemedText>
      <ThemedView style={styles.inputContainer}>
        <ThemedView style={{flexDirection:'row', width:'100%', alignItems: 'center', justifyContent: 'space-between'}}>
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Address type"
            placeholderTextColor={darkBrown}
            readOnly
          />
          <ThemedView style={{flexDirection: 'row', gap: 5}}>
            <TouchableOpacity 
              style={{
                backgroundColor: addressType === 'home' ? darkBrown : Colors.light.background,
                padding: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: darkBrown
              }}
              onPress={() => handleAddressTypeChange('home')}>
                <ThemedText 
                  customColor={addressType === 'home' ? mustard : darkBrown}
                  font='cocoGothicRegular'
                >home
                </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                backgroundColor: addressType === 'work' ? darkBrown : Colors.light.background,
                padding: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: darkBrown
              }}
              onPress={() => handleAddressTypeChange('work')}>
                <ThemedText 
                  customColor={addressType === 'work' ? mustard : darkBrown}
                  font='cocoGothicRegular'
                >work
                </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedDivider width={0.5} opacity={0.2} marginY={5}/>
        <ThemedView style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Default address"
            placeholderTextColor={darkBrown}
            readOnly
          />  
          <Switch
            trackColor={{ false: '#767577', true: '#563126' }}
            thumbColor={defaultAddress ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            value={defaultAddress}
            onChange={toggleSwitch}
          />
        </ThemedView>
      </ThemedView>

      <ThemedTouchableFilled
        style={{
          marginTop: 50,
          backgroundColor: !fullName || 
          !contactNo || 
          !rpcb ||
          !postalCode ||
          !streetBldgHouseNo ? '#AAA' : mustard
        }}
        disabled={
          !fullName || 
          !contactNo || 
          !rpcb ||
          !postalCode ||
          !streetBldgHouseNo
        }
        onPress={submit}
      >
        <ThemedText>Submit</ThemedText>
      </ThemedTouchableFilled>
      </ThemedView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
  },
  inputContainer: {
    borderRadius: 15,
    height: 'auto',
    width: '100%',
    padding: 10,
    borderColor: '#CCC',
    shadowColor: '#ABB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    width: '100%',
    paddingLeft: 10
  },
  contactNo: {
    height: 40,
    width: '100%',
    paddingLeft: 10
  }
})