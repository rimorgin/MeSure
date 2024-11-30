import { StyleSheet } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { useFont } from '@/provider/FontContext'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function EditLayout() {
  const { fontStyles } = useFont();

  return (
   <Stack>
      <Stack.Screen name='fullname'
        options={{
          headerShown: true,
          headerTitle: 'full name',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='username'
        options={{
          headerShown: true,
          headerTitle: 'username',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='email'
        options={{
          headerShown: true,
          headerTitle: 'email',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='phonenumber'
        options={{
          headerShown: true,
          headerTitle: 'contact number',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='securitycheck'
        options={{
          headerShown: true,
          headerTitle: 'Security Check',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
      <Stack.Screen name='password'
        options={{
          headerShown: true,
          headerTitle: 'Change Password',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: fontStyles.montserratBold
          },
          headerLeft: () => {
            return (
              <TouchableOpacity 
                style={{left:20}}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="chevron-back"
                  size={32}
                />
              </TouchableOpacity>
            )
          },
        }}
      />
   </Stack>
  )
}

const styles = StyleSheet.create({})