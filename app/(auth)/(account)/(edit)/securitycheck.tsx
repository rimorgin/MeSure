import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { darkBrown, mustard } from '@/constants/Colors';
import auth from '@react-native-firebase/auth';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { useUserStore } from '@/store/appStore';
import Loader from '@/components/Loader';
import { router, useLocalSearchParams } from 'expo-router';

export default function SecurityCheck() {
  const theme = useColorSchemeTheme();
  const { userEmail } = useUserStore();
  const { oobCode } = useLocalSearchParams(); 
  const [otp, setOTP] = useState('');
  const [passwordResetLinkSent, setPasswordResetLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const actionCodeSettings = {
    url: `https://cgt-mesure.firebaseapp.com/resetpassword`, // Continue URL (your deep link handler)
    iOS: {
        bundleId: 'com.mesure', // iOS app's bundle ID
    },
    android: {
        packageName: 'com.mesure',
        installApp: true,       
        minimumVersion: '12',  
    },
    handleCodeInApp: true,     
    dynamicLinkDomain: 'mesure.page.link/63fF',
  };

  const handlePasswordResetEmail = async () => {
    setLoading(true)
    if (!userEmail) {
        return
    }
    await auth().sendPasswordResetEmail(userEmail, actionCodeSettings)
    setLoading(false)
  }
  const handleSubmit = async () => {
    setLoading(true)
    await auth()
    setLoading(false)
    router.back()
  }

  return (
    <>
    {loading && <Loader/>}
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ThemedView style={styles.content}>
        <FocusAwareStatusBar
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
          animated
        />
        {!passwordResetLinkSent ? (
        <>
            <ThemedView style={{flex: 1, alignItems:'center', justifyContent:'center', gap: 15}}>

            
            <FontAwesome5 
                name="fingerprint" 
                size={50} 
                color={mustard}
            />
            <ThemedText font='cocoGothicBold' type='semititle'>Reset Password</ThemedText>
            <ThemedText font='cocoGothicRegular' lightColor='#AAA' style={{textAlign: 'center'}}>We'll send a a verification link to your email to verify if it's you. </ThemedText>
            <ThemedTouchableFilled
                onPress={handlePasswordResetEmail}
                style={{marginTop: 30}}
            >
                <ThemedView transparent style={{flexDirection: 'row', gap: 5, justifyContent:'center', alignItems: 'center'}}>
                    <ThemedText font='cocoGothicRegular' >Send Link</ThemedText>
                    <MaterialCommunityIcons name="email-fast" size={24} color={darkBrown} />
                </ThemedView>
            </ThemedTouchableFilled>
            </ThemedView>
        </>
        ) : (
        <>
            <ThemedView style={styles.inputContainer}>
            <ThemedView
                style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                }}
            >
                <MaterialIcons
                name="password"
                size={25}
                color={mustard}
                style={{
                    position: 'absolute',
                    alignSelf: 'center',
                }}
                />
                <TextInput
                style={styles.input}
                readOnly
                placeholder={'send password reset link'}
                placeholderTextColor={'#AAA'}
                />
            </ThemedView>
            </ThemedView>
            <ThemedText
            font='glacialIndifferenceBold'
            lightColor='#CCC'
            darkColor='#333'
            style={{textAlign:'center', fontSize: 15, marginTop: 5}}
            >phone number must be valid</ThemedText>
            <ThemedTouchableFilled
            onPress={handleSubmit}
            style={{
                marginTop: 50,
                backgroundColor: otp.length === 11 ? mustard : '#AAA'
            }}
            disabled={!(otp.length === 11)}
            >
            <ThemedText lightColor='white'>SUBMIT</ThemedText>
            </ThemedTouchableFilled>
        </>
        )}
      </ThemedView>
    </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
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
});
