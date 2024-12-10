import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { router } from 'expo-router';
import { Colors, darkBrown, mustard, white } from '@/constants/Colors';
import { AntDesign, FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ThemedDivider from '@/components/ThemedDivider';
import { useUserStore } from '@/store/appStore';
import { useSession } from '@/provider/AuthContext';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import ThemedModal from '@/components/ThemedModal';

export default function Accounts() {
  const theme = useColorSchemeTheme();
  const { requestToDelete, requestAccountDeletion, cancelAccountDeletion } = useUserStore();
  const { signOut } = useSession()
  const [showAccountDeletionModal, setShowAccountDeletionModal] = useState(false);

  const handleAccountDelete = () => {
    requestAccountDeletion()
    setShowAccountDeletionModal(false)
  }

  return (
    <>
     <ThemedModal
      showModal={showAccountDeletionModal}
      onClose={() => setShowAccountDeletionModal(false)}
    >
      <ThemedView style={{padding: 15, alignItems: 'center', gap: 10}}>
        <AntDesign name="deleteuser" size={80} color={'red'} />
        <ThemedText style={{textAlign: 'center'}} font='montserratBold' type='subtitle'>Are you sure you want to delete your account?</ThemedText>
        <ThemedText style={{textAlign: 'center', fontSize: 12, marginTop: 5}} font='montserratSemiBold' >This action cannot be undone. Your account will be deleted in 5 days. You can withdraw cancellation.</ThemedText>
        <ThemedView style={styles.row}>
          <Image source={require('@/assets/images/hand.png')} style={{height: 50, width: 50}}/>
          <ThemedText style={{fontSize: 12}} font='montserratSemiBold'>All your saved finger and wrist measurements will be removed</ThemedText>
        </ThemedView>
        <ThemedView style={styles.row}>
          <FontAwesome name="user-o" size={34} color={darkBrown} style={{right: -10}}/>
          <ThemedText style={{fontSize: 12, marginLeft: 18}} font='montserratSemiBold'>Your profile will be deleted and inaccessible anymore</ThemedText>
        </ThemedView>
        <ThemedView style={{marginTop: 20, marginLeft: -50, flexDirection: 'row', width: '100%', gap: 20, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity 
            onPress={() => setShowAccountDeletionModal(false)}
            style={{height: 50, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#371211'}}
          >
            <ThemedText lightColor='white'>CANCEL</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleAccountDelete}
            style={{height: 50, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: mustard}}
          >
            <ThemedText>DELETE</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedModal>
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
        {requestToDelete && <ThemedText customColor='red' style={{textAlign: 'center', marginTop: 25}}>You requested to delete your account.</ThemedText>}
        <TouchableOpacity
          style={[styles.button, {width: '90%', height: 50, marginVertical: 25, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#371211'}]}
          onPress={requestToDelete ? cancelAccountDeletion : () => setShowAccountDeletionModal(true)}
        >
          <ThemedView transparent style={{flexDirection:'row', gap: 10, alignItems: 'center'}}>
            <ThemedText type="default" lightColor={white}>{requestToDelete ? 'Cancel Account Deletion' : 'Request Account Deletion'}</ThemedText>
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
    </>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    alignItems: 'center',

  }
})