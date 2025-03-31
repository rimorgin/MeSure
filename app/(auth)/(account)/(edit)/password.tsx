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
import { router } from 'expo-router';

export default function ChangePassword() {
  const theme = useColorSchemeTheme();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true)
    await auth().currentUser
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
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder={'New Phone Number'}
              placeholderTextColor={'#AAA'}
              editable
              hitSlop={{ bottom: 20, top: 20 }}
            />
            {password && (
              <TouchableOpacity onPress={() => setPassword('')}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={22}
                  color={mustard}
                />
              </TouchableOpacity>
            )}
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
            backgroundColor: password.length === 11 ? mustard : '#AAA'
          }}
          disabled={!(password.length === 11)}
        >
          <ThemedText lightColor='white'>SUBMIT</ThemedText>
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
