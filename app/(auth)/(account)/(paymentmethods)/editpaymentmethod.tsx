import { Dimensions, Image, Keyboard, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf'
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { CreditCard, LiteCreditCard } from '@/components/CreditCard'
import { darkBrown, mustard, white } from '@/constants/Colors'
import { usePaymentMethodsStore, useUserStore } from '@/store/appStore'
import { ThemedText } from '@/components/ThemedText'
import { FontAwesome5, FontAwesome6, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import ThemedDivider from '@/components/ThemedDivider'
import { identifyCardType } from '@/utils/identifyCardType'
import { ThemedTouchableFilled } from '@/components/ThemedButton'
import { router, useLocalSearchParams } from 'expo-router'
import Loader from '@/components/Loader'

export default function EditPaymentMethod() {
  const { editCardNumber } = useLocalSearchParams<{editCardNumber: string}>()
  const theme = useColorSchemeTheme();
  const { userId } = useUserStore();
  const { paymentMethods, updatePaymentMethod } = usePaymentMethodsStore();
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardExpiration, setCardExpiration] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardType, setCardType] = useState<string>('');
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editingPaymentMethods = paymentMethods.find((card) => card.cardNumber === editCardNumber)
    if (!editingPaymentMethods) {
      return
    }
    console.log(editingPaymentMethods);
    setCardNumber(editingPaymentMethods.cardNumber)
    setCardHolder(editingPaymentMethods.holderName)
    setCardExpiration(editingPaymentMethods.expirationDate)
    setCardCvv(editingPaymentMethods.cvv)
    setCardType(editingPaymentMethods.cardType)
    setDefaultPaymentMethod(editingPaymentMethods.defaultPaymentMethod)
  },[editCardNumber])
  

  const toggleSwitch = () => setDefaultPaymentMethod(!defaultPaymentMethod)

  
  const handleCardNumberChange = (text: string) => {
    // Remove all non-numeric characters
    const numericText = text.replace(/[^0-9]/g, "");

    // Format with spaces after every 4 digits
    const formattedText = numericText.replace(/(.{4})/g, "$1 ").trim();

    setCardNumber(formattedText);

    // Detect card type
    const detectedType = identifyCardType(numericText);
    setCardType(detectedType);
    console.log(detectedType); // Logs the card type
  };

  const handleSubmit = () => {
    try{
      setLoading(true);
      const data = {
        cardNumber: cardNumber,
        holderName: cardHolder,
        expirationDate: cardExpiration,
        cvv: cardCvv,
        cardType: cardType,
        defaultPaymentMethod: defaultPaymentMethod
     }
      updatePaymentMethod(userId, data)

    } catch(error) {
      console.warn(error)
      setLoading(false);
    } finally {
      setLoading(false)
      router.back();
    }
    
  }

  return (
    <>
    {loading && <Loader/>}
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemedView  style={styles.container}>
        <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} animated />
        <CreditCard number={cardNumber} type={cardType} name={cardHolder} date={cardExpiration} cvv={cardCvv} />
        <ThemedView style={[styles.inputContainer, {marginVertical: 15}]}>
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FontAwesome6
              name="credit-card-alt"
              size={21}
              color={mustard}
              style={{
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder='Card Number'
              placeholderTextColor={'#AAA'}
              readOnly
              keyboardType="numeric" // Ensures the numeric keyboard on mobile
              maxLength={19} 
            />
            
          </ThemedView>
          <ThemedDivider width={0.2} opacity={0.2} marginY={5}/>
          <ThemedView style={{flexDirection: 'row'}}>
            <ThemedView
                style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '60%',
                }}
            >
                <Fontisto
                name="date"
                size={22}
                color={mustard}
                style={{
                    position: 'absolute',
                    alignSelf: 'center',
                }}
                />
                <TextInput
                style={styles.input}
                value={cardExpiration}
                onChangeText={(text) => setCardExpiration(text)}
                placeholder='Expiry Date (MM/YY)'
                placeholderTextColor={'#AAA'}
                readOnly
                hitSlop={{ bottom: 20, top: 20 }}
                />
                
            </ThemedView>
           
            <ThemedView
                style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '50%',
                }}
            >
                <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={25}
                    color={mustard}
                    style={{
                        position: 'absolute',
                        alignSelf: 'center',
                    }}
                />
                <TextInput
                style={styles.input}
                value={cardCvv}
                keyboardType='number-pad'
                onChangeText={(text) => setCardCvv(text)}
                placeholder='CVV Code'
                placeholderTextColor={'#AAA'}
                readOnly
                hitSlop={{ bottom: 20, top: 20 }}
                />
                
            </ThemedView>
          </ThemedView>
          <ThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ThemedView style={{width:'50%'}}>
            <ThemedDivider width={0.2} opacity={0.2} marginY={5}/>
            </ThemedView>
            <ThemedView style={{width:'40%'}}>
            <ThemedDivider width={0.2} opacity={0.2} marginY={5}/>
            </ThemedView>
          </ThemedView>
          
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FontAwesome5
              name="id-card-alt"
              size={20}
              color={mustard}
              style={{
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
            <TextInput
              style={styles.input}
              value={cardHolder}
              onChangeText={(text) => setCardHolder(text)}
              placeholder='Card Holder Name'
              placeholderTextColor={'#AAA'}
              editable
              hitSlop={{ bottom: 20, top: 20 }}
            />
            {cardHolder && (
              <TouchableOpacity onPress={() => setCardHolder('')}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={22}
                  color={mustard}
                />
              </TouchableOpacity>
            )}
          </ThemedView>
          <ThemedDivider width={0.2} opacity={0.2} marginY={5}/>
          <ThemedView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <MaterialIcons
              name="payments"
              size={20}
              color={mustard}
              style={{
                position: 'absolute',
                alignSelf: 'center',
              }}
            />
            <TextInput
              style={styles.input}
              placeholder='Set as your default payment method?'
              readOnly
              hitSlop={{ bottom: 20, top: 20 }}
            />
             <Switch
                trackColor={{ false: '#767577', true: '#563126' }}
                thumbColor={defaultPaymentMethod ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                value={defaultPaymentMethod}
                onChange={toggleSwitch}
            />
          </ThemedView>
        </ThemedView>
        <ThemedTouchableFilled
            onPress={handleSubmit}
            style={{width: '100%', marginTop: 20}}
        >
            <ThemedText>Save</ThemedText>
        </ThemedTouchableFilled>
      </ThemedView>
    </TouchableWithoutFeedback>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    minHeight: Math.round(Dimensions.get('window').height)
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
    width: '80%',
    paddingLeft: 35,
  },
})