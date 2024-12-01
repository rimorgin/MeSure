import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { router } from 'expo-router';
import { Colors, darkBrown, white } from '@/constants/Colors';
import { AntDesign, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedDivider from '@/components/ThemedDivider';
import { useUserStore } from '@/store/appStore';
import { useSession } from '@/provider/AuthContext';
import { ThemedTouchableFilled, ThemedTouchablePlain } from '@/components/ThemedButton';

export default function Accounts() {
  const theme = useColorSchemeTheme();
  const { userFullName } = useUserStore();
  const { signOut } = useSession()


  return (
    <ThemedView style={styles.container}>
    <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content': 'light-content'} animated />
      <ThemedView style={{flex: 1}}>
        <ThemedView style={styles.inputContainer}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
            onPress={() => {
              router.navigate('/editprofile')
            }}
          >
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder={"Profile"}
              placeholderTextColor={darkBrown}
              readOnly
            />
            <FontAwesome6 name="edit" size={20} color={darkBrown} />
          </TouchableOpacity>
          <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
            onPress={() => {
              router.navigate('/(account)/(addresses)/')
            }}
          >
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder='Address Book'
              placeholderTextColor={darkBrown}
              readOnly
            />
            <FontAwesome6 name="address-book" size={20} color={darkBrown} />
          </TouchableOpacity>
          <ThemedDivider width={0.5} opacity={0.2} marginY={2}/>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
            onPress={() => {
              router.navigate('/(account)/(paymentmethods)/')
            }}
          >
            <TextInput
              style={[styles.input, {width:'auto'}]}
              placeholder='Payment methods'
              placeholderTextColor={darkBrown}
              readOnly
            />
            <MaterialCommunityIcons name="credit-card-edit-outline" size={20} color={darkBrown} />
          </TouchableOpacity>
          
        </ThemedView>
        
        <TouchableOpacity
          style={[styles.button, {width: '90%', height: 50, marginVertical: 25, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#371211'}]}
          onPress={signOut}
        >
          <ThemedView transparent style={{flexDirection:'row', gap: 10, alignItems: 'center'}}>
            <ThemedText type="default" lightColor={white}>Request Account Deletion</ThemedText>
            <AntDesign name="deleteuser" size={24} color={white} />
          </ThemedView>
        </TouchableOpacity>

        <ThemedTouchableFilled
          style={styles.button}
          onPress={signOut}
        >
          <ThemedView transparent style={{flexDirection:'row', gap: 10, alignItems: 'center'}}>
            <ThemedText type="default">Logout</ThemedText>
            <Ionicons
              name='log-out'
              size={25}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
            />
          </ThemedView>
        </ThemedTouchableFilled>
  
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
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
  button: {
    paddingHorizontal: 8,
    marginHorizontal: 20
  },
})