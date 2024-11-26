//link to the repo guide here: https://github.com/calintamas/react-native-toast-message/blob/6fb0ff8a48e42afa091879b1e53bfcd22e4c5e03/docs/custom-layouts.md

//Default available values: success, error, info

//text1 is the title
//text2 is the desc

import { BaseToast, ErrorToast, ToastConfigParams } from 'react-native-toast-message';
import { ThemedView } from './ThemedView';
import { Text } from 'react-native';
import { HelloWave } from './Header';
import { darkBrown } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { Feather } from '@expo/vector-icons';

// Define the structure of your custom toast props
interface CustomToastProps {
  text1: string;  // Title
  text2: any;     // Allow any type for props, but this should ideally be more specific
}

// Create the toast config
export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: darkBrown }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '400',
        color: darkBrown
      }}
      text2Style={{
        fontSize: 13,
        color: 'gray',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
        fontWeight: '400',
        color: darkBrown
      }}
      text2Style={{
        fontSize: 13,
        color: 'gray',
      }}
    />
  ),
  customToast: ({ type, text1, text2 }: ToastConfigParams<CustomToastProps>) => (
    <ThemedView style={{ 
      height: 80, 
      width: '92%', 
      //borderTopLeftRadius: 0,
      //borderBottomLeftRadius: 0,
      borderRadius:15, 
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.8,
      shadowRadius: 25,
      elevation: 15, // Adds shadow for Android
      padding: 15,
    }}>
      <Feather name="message-circle" size={60} color="black" />
      {/*<ThemedView style={{height:'160%', width: 5, backgroundColor:darkBrown, position:'absolute'}}/>*/}
  
        <ThemedText
          font='cocoGothicBold'
          style={{
            fontSize: 17,
            color: darkBrown
          }}
        >{text1}
        </ThemedText>
        <ThemedText
          font='montserratMedium'
          style={{
            fontSize: 13,
            color: darkBrown
          }}
        >{text2}
        </ThemedText>

    </ThemedView>
  ),

};

/*
  2. Pass the config as prop to the Toast component instance on _layout.tsx app root directory
*/

  