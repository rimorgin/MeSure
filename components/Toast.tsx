//link to the repo guide here: https://github.com/calintamas/react-native-toast-message/blob/6fb0ff8a48e42afa091879b1e53bfcd22e4c5e03/docs/custom-layouts.md

//Default available values: success, error, info

//text1 is the title
//text2 is the desc

import { BaseToast, ErrorToast,  ToastConfigParams } from 'react-native-toast-message';
import { ThemedView } from './ThemedView';
import { Text } from 'react-native';
import { HelloWave } from './Header';

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
      style={{ borderLeftColor: 'black' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  customToast: ({ text1, text2 }: ToastConfigParams<CustomToastProps>) => (
    <ThemedView style={{ height: 80, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <HelloWave/>
    </ThemedView>
  ),
};

/*
  2. Pass the config as prop to the Toast component instance on _layout.tsx app root directory
*/

  