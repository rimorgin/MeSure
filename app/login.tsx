
import React, { useState } from 'react'
import { TouchableOpacity, Button, StyleSheet, TextInput, View, Dimensions, KeyboardAvoidingView } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';
import { useSession } from "@/provider/AuthContext";
import Svg, { Path } from 'react-native-svg';
//form use cases
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getWindowDimensions } from '@/hooks/getWindowDimensions';
import { Link, router } from 'expo-router';
import { ThemedTouchableFilled, ThemedTouchablePlain } from '@/components/ThemedButton';
import { useFont } from '@/provider/FontContext';
import register from './register';

const schema = yup.object().shape({
  usernameOrEmail: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const defaultValues = {
  usernameOrEmail: "",
  password: "",
};

export default function Login() {
  const {height} = getWindowDimensions()
  const { signIn } = useSession();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);

  const { fontsLoaded, fontStyles } = useFont();
  if (!fontsLoaded) {
    return null; // or a loading spinner
  }


  const onSubmit = (data: { usernameOrEmail: string; password: string }) => {
    const { usernameOrEmail, password } = data; // Destructure the data object
    signIn(usernameOrEmail, password)
    console.log(process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY)
  };
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.formcontainer}>
        
        {/* The title */}
        <ThemedText 
          type='semititle' 
          font='cocoGothicRegular'
        >
          Al-Khalaf Gold & Jewelry
        </ThemedText>

        <ThemedText 
          font='spaceMonoRegular'
          style={{fontSize:14, marginBottom:20}}
        >
          Powered by MeSure
        </ThemedText>
      
        {/* Text Input for Username */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Username"
            />
          )}
          name="usernameOrEmail"
          rules={{ required: true }}
          defaultValue={defaultValues.usernameOrEmail}
          
        />
            {/* Username Validator*/}
            {errors?.usernameOrEmail?.message &&
          <ThemedText type='defaultSemiBold' style={styles.error}>{errors.usernameOrEmail.message}</ThemedText>
        }
        {/* Text Input for Password*/}
        <Controller 
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              placeholder="Password"
            />
          )}
          
          name="password"
          rules={{ required: true }}
          defaultValue=""
        />
      
        {/* Password Validator*/}
        {errors?.password?.message &&
          <ThemedText type='defaultSemiBold' style={styles.error}>{errors.password.message}</ThemedText>
        }
        {/* Log in Button*/}
        <ThemedTouchableFilled onPress={handleSubmit(onSubmit)}>
          <ThemedText type='default'>LOGIN</ThemedText>
        </ThemedTouchableFilled>
        
        {/*Forgot Password (currently not functioning)*/}
        <ThemedTouchablePlain onPress={() => console.log('pressed')}>
            <ThemedText type='link'>Forgot Password?</ThemedText>
        </ThemedTouchablePlain>
          
        {/*Used for breaking lines between text (If may alternative na mas maayos pede niyo baguhin)*/}
        <ThemedText> </ThemedText>
        <ThemedText> </ThemedText>
        {/*Routing to Register*/}

       <ThemedView style={styles.register}>
          <ThemedText type="default">
            Don’t have an account yet?
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <ThemedText type="link">
              Register here!
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

      
        {/* The orange thingy at the bottom */}
        <Svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="100%" height="200">
          <Path
            fill="#D4AF37"
            fillOpacity="1"
            d="M0,64L30,85.3C60,107,120,149,180,149.3C240,149,300,107,360,96C420,85,480,107,540,133.3C600,160,660,192,720,181.3C780,171,840,117,900,106.7C960,96,1020,128,1080,138.7C1140,149,1200,139,1260,112C1320,85,1380,43,1410,21.3L1440,0L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
        </Svg>
          
      </ThemedView>
    </SafeAreaView>
  
    
    
  )
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  formcontainer: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },rator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
     width: "70%", 
    borderWidth: 1,
    borderColor: '#666666',
    padding: 10,
    borderRadius: 10,
    marginVertical: 3,
  },
  svg: {
    position: 'absolute',
    top: 0, 
    left: 0
  },
  error: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 6,
  },
  register:{
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row', 
    gap: 4
  }
});