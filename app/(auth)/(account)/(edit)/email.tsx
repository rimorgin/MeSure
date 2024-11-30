import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Entypo, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { darkBrown, mustard } from '@/constants/Colors';
import auth from '@react-native-firebase/auth';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { useUserStore } from '@/store/appStore';
import Loader from '@/components/Loader';
import { router } from 'expo-router';
import * as yup from 'yup';
import ThemedModal from '@/components/ThemedModal';

const emailSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export default function EditEmail() {
  const theme = useColorSchemeTheme();
  const { userId, userEmail, setUserEmail, userEmailVerified, setUserEmailVerified } = useUserStore();
  const isEmailVerified = auth().currentUser?.emailVerified || false;
  const currentUserEmail = userEmail || ''
  const [email, setEmail] = useState(currentUserEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  useEffect(() => {
    setUserEmailVerified(isEmailVerified);
  },[userEmailVerified])

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate email with yup
      await emailSchema.validate({ email });
      await setUserEmail(userId, email);
      setVerificationEmailSent(false);
      setLoading(false);
      router.back();
    } catch (validationError: any) {
      setLoading(false);
      setError(validationError.message); // Show validation error
    }
  };

  return (
    <>
      {loading && <Loader />}
      <ThemedModal
        showModal={verificationEmailSent}
        onClose={() => setVerificationEmailSent(false)}
        height={300}
      >
        <ThemedView style={{alignItems: 'center', justifyContent: 'center', height: '100%', paddingVertical: 20}}>
        <MaterialCommunityIcons 
          name="email-fast" 
          size={120} 
          color={mustard}
          style={{marginTop: -20}}
        />
        <ThemedText 
          font='cocoGothicBold'
          type='subtitle'
          style={{ textAlign: 'center', marginBottom: 20 }}>
          A verification email has been sent to your new email address.
        </ThemedText>
        <ThemedTouchableFilled
          onPress={() => setVerificationEmailSent(false)}
        >
          <ThemedText lightColor={darkBrown}>CONFIRM</ThemedText>
        </ThemedTouchableFilled>
        </ThemedView>
      </ThemedModal>
    
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ThemedView style={styles.content}>
          <FocusAwareStatusBar
            barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
            animated
          />
          <ThemedView style={[styles.inputContainer, {width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 20}]}>
            <MaterialCommunityIcons 
              name={userEmailVerified ? "email-check" : "email-alert"} 
              size={120} 
              style={{marginLeft: 15}}
              color={mustard}
            />
            <ThemedText 
              font='cocoGothicBold' 
              type='subtitle'
              lightColor={darkBrown}
              darkColor={'#AAA'}
            >Your email is {userEmailVerified ? 'verified. You are good to go' : 'not verified'}
            </ThemedText>
            {!userEmailVerified && (
            <ThemedTouchableFilled
              style={{marginVertical: 20}}
              onPress={() => {
                auth().currentUser?.sendEmailVerification()
                setVerificationEmailSent(true);
              }}
            >
              <ThemedText>Verify here</ThemedText>
            </ThemedTouchableFilled>
            )}
          </ThemedView>
          
          <ThemedView style={styles.inputContainer}>
            <ThemedView
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Entypo
                name="email"
                size={25}
                color={mustard}
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                }}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(''); // Clear error on input change
                }}
                placeholder={'New Email'}
                placeholderTextColor={'#AAA'}
                editable
                hitSlop={{ bottom: 20, top: 20 }}
              />
              {email && (
                <TouchableOpacity onPress={() => setEmail('')}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={22}
                    color={mustard}
                  />
                </TouchableOpacity>
              )}
            </ThemedView>
          </ThemedView>
          {error ? (
            <ThemedText
              font="glacialIndifferenceBold"
              lightColor="#FF6B6B"
              darkColor="#FF6B6B"
              style={{ textAlign: 'center', fontSize: 15 }}
            >
              {error}
            </ThemedText>
          ) : (
            <ThemedText
              font="glacialIndifferenceBold"
              lightColor="#CCC"
              darkColor="#333"
              style={{ textAlign: 'center', fontSize: 15, marginTop: 5 }}
            >
              Email must be valid and different from the current one
            </ThemedText>
          )}
          <ThemedTouchableFilled
            onPress={handleSubmit}
            style={{
              marginTop: 50,
              backgroundColor:
                email.length >= 5 && email !== currentUserEmail ? mustard : '#AAA',
            }}
            disabled={!(email.length >= 5 && email !== currentUserEmail)}
          >
            <ThemedText lightColor="white">SUBMIT</ThemedText>
          </ThemedTouchableFilled>
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