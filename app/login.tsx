
import React, { useState } from 'react'
import { TouchableOpacity, Button, StyleSheet, TextInput, View, Dimensions, KeyboardAvoidingView } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';
import { useSession } from "./ctx";
import Svg, { Path } from 'react-native-svg';
//form use cases
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getWindowDimensions } from '@/hooks/getWindowDimensions';
import { Link, router } from 'expo-router';

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
  const windowWidth = Dimensions.get('window').width;
  const onSubmit = (data: { usernameOrEmail: string; password: string }) => {
    const { usernameOrEmail, password } = data; // Destructure the data object
    signIn(usernameOrEmail, password)
    console.log(process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY)
  };
  return (
    <SafeAreaView style={styles.container}>
    <ThemedView style={styles.formcontainer}>
      
    {/* The title */}
      <ThemedText style={styles.title}>Al-Khalaf Gold & Jewelry</ThemedText>
      <ThemedText style={styles.subtitle}>Powered by MeSure</ThemedText>
      <ThemedText> </ThemedText>
     
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <ThemedText style = {styles.buttonsubtitle }>LOGIN</ThemedText>
      </TouchableOpacity>
      
    {/*Forgot Password (currently not functioning)*/}
        <ThemedText style={styles.link}>Forgot Password?</ThemedText>
    {/*Used for breaking lines between text (If may alternative na mas maayos pede niyo baguhin)*/}
        <ThemedText> </ThemedText>
        <ThemedText> </ThemedText>
    {/*Routing to Register*/}

      <ThemedText style={styles.subtitle}>
          Don’t have an account yet?      
          <ThemedText type='link' onPress={() => router.push('/register')}> Register!</ThemedText >
      </ThemedText>
  
     
    
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
  },
  button:{
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
  },
  buttonsubtitle: {
    fontSize: 18,
    fontWeight: "light",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: 'Arial-Regular'
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "thin",
    color: '#333333',
  },
  link: {
    fontSize: 14,
    fontWeight: "thin",
    color: '#D4AF37',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },
  separator: {
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
    fontSize: 9,
    marginBottom: 8,
    marginLeft: 6,
  },
});