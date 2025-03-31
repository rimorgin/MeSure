import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import ThemedDivider from '@/components/ThemedDivider';
import { ThemedView } from '@/components/ThemedView';
import { darkBrown, mustard } from '@/constants/Colors';
import useColorSchemeTheme from '@/hooks/useColorScheme'
import { useUserStore } from '@/store/appStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';

export default function EditProfile() {
  const theme = useColorSchemeTheme();
  const { userFullName, userContactNo, userEmail, userEmailVerified, setUserEmailVerified } = useUserStore();
  const userName = auth().currentUser?.displayName || '';
  const isEmailVerified = auth().currentUser?.emailVerified || false;

  console.log(isEmailVerified)

  useEffect(() => {
    setUserEmailVerified(isEmailVerified);
  },[userEmailVerified])

  return (
    <ThemedView style={styles.mainContainer}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} animated />
      <ThemedView style={styles.inputContainer}>
        {/*
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPress={() => {
            router.navigate('/editprofile')
          }}
          hitSlop={{top: 5, bottom: 5}}
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder={userFullName}
            placeholderTextColor={darkBrown}
            readOnly
          />
          <MaterialCommunityIcons name="account-edit-outline" size={28} color={theme==='light' ? darkBrown : mustard } />
        </TouchableOpacity>
         */}
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPressOut={() => 
            router.navigate('/(edit)/fullname')
          }
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Full Name:"
            placeholderTextColor={darkBrown}
            readOnly
            
          />
          <ThemedView style={{flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder={userFullName}
              readOnly
              placeholderTextColor={'#AAA'}
            />
            <Ionicons
              name='chevron-forward'
              size={18}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
       </TouchableOpacity>
        <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
       
       <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPressOut={() => 
            router.navigate('/(edit)/username')
          }
          hitSlop={{top: 5, bottom: 5}}
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Username:"
            placeholderTextColor={darkBrown}
            readOnly
            
          />
          <ThemedView style={{flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder={userName}
              readOnly
              placeholderTextColor={'#AAA'}
            />
            <Ionicons
              name='chevron-forward'
              size={18}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
       </TouchableOpacity>
       <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
       <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPressOut={() => 
            router.navigate('/(edit)/phonenumber')
          }
          hitSlop={{top: 5, bottom: 5}}
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Phone:"
            placeholderTextColor={darkBrown}
            readOnly
            
          />
          <ThemedView style={{flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder={userContactNo}
              readOnly
              placeholderTextColor={'#AAA'}
            />
            <Ionicons
              name='chevron-forward'
              size={18}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
       </TouchableOpacity>
       <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
       <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}
          onPressOut={() => 
            router.navigate('/(edit)/email')
          }
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Email:"
            placeholderTextColor={darkBrown}
            readOnly
          />
          <ThemedView 
            transparent
            style={{flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}
          >
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder={`${userEmail} (${isEmailVerified ? 'verified' : 'not verified'})`}
              readOnly
              placeholderTextColor={'#AAA'}
            />
            <Ionicons
              name='chevron-forward'
              size={18}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
       </TouchableOpacity>
      <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
       <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
          onPressOut={() => 
            router.navigate('/(edit)/securitycheck')
          }
          hitSlop={{top: 10, bottom:10, left: 10, right: 10}}
        >
          <TextInput
            style={[styles.input, {width:'auto'}]}
            placeholder="Change Password"
            placeholderTextColor={darkBrown}
            readOnly
            
          />
          <Ionicons
            name='chevron-forward'
            size={18}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
       </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
})