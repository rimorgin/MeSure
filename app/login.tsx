import React, { useState } from 'react';
import { TouchableOpacity, Button, StyleSheet, TextInput, View, Dimensions, KeyboardAvoidingView } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from "@/provider/AuthContext";
import Svg, { Path } from 'react-native-svg';
import auth from '@react-native-firebase/auth';
// Form use cases
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, router } from 'expo-router';
import { ThemedTouchableFilled, ThemedTouchablePlain } from '@/components/ThemedButton';
import ThemedModal from '@/components/ThemedModal';
import ThemedDivider from '@/components/ThemedDivider';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Define schemas
const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
});

const resetSchema = yup.object().shape({
  email: yup.string().required('Email is required'),
});

const defaultValues = {
  email: "",
  password: "",
};

type FormData = {
  email: string;
  password?: string;
};

export default function Login() {
  const { signIn } = useSession();
  const [modal, resetPasswordModal] = useState(false);
  const [resetPw, setResetPw] = useState(false);
  const schema = modal ? resetSchema : loginSchema;
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues
  });

  const onSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data;
    signIn(email, password);
  };

  const handleResetPassword = async (data: { email: string }) => {
    const { email } = data;
    await auth().sendPasswordResetEmail(email);
    setResetPw(true);
  };

  return (
    <>
      <ThemedModal 
        showModal={modal}
        onRequestClose={() => resetPasswordModal(false)}
      >
        {/* Reset Password Modal content */}
      </ThemedModal>

      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.formcontainer}>
          {/* Title and description */}
          <ThemedText type='semititle' font='cocoGothicRegular'>Al-Khalaf Gold & Jewelry</ThemedText>
          <ThemedText font='spaceMonoRegular' style={{ fontSize: 14, marginBottom: 20 }}>Powered by MeSure</ThemedText>

          {/* Email input */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email Address"
              />
            )}
            name="email"
            rules={{ required: true }}
            defaultValue={defaultValues.email}
          />
          {errors?.email?.message && <ThemedText type='defaultSemiBold' style={styles.error}>{errors.email.message}</ThemedText>}

          {/* Password input */}
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
          {errors?.password?.message && <ThemedText type='defaultSemiBold' style={styles.error}>{errors.password.message}</ThemedText>}

                     {/* Forgot Password link */}
          <ThemedTouchablePlain variant='opacity' onPress={() => resetPasswordModal(true)}>
            <ThemedText type='link'>Forgot Password?</ThemedText>
            
          </ThemedTouchablePlain>
          {/* Login button */}
          <ThemedTouchableFilled style={styles.button} onPress={handleSubmit(onSubmit)}>
            <ThemedText type='default'>Login</ThemedText>
          </ThemedTouchableFilled>

 

          {/* Social login section */}
          <ThemedText type='default' style={styles.orLoginText}>Or Sign in using</ThemedText>
          <View style={styles.socialLoginContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={30} color="#4267B2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={30} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={30} color="#000000" />
            </TouchableOpacity>
          </View>

        
          {/* Register link */}
          <ThemedView style={styles.register}>
            <ThemedText type="default">Don’t have an account yet?</ThemedText>
            <ThemedTouchablePlain onPress={() => router.push('/register')} variant='opacity'>
              <ThemedText type="link">Register here!</ThemedText>
            </ThemedTouchablePlain>
          </ThemedView>

          {/* Decorative SVG */}
          <Svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="100%" height="150">
            <Path
              fill="#D4AF37"
              fillOpacity="1"
              d="M0,64L30,85.3C60,107,120,149,180,149.3C240,149,300,107,360,96C420,85,480,107,540,133.3C600,160,660,192,720,181.3C780,171,840,117,900,106.7C960,96,1020,128,1080,138.7C1140,149,1200,139,1260,112C1320,85,1380,43,1410,21.3L1440,0L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            />
          </Svg>
        </ThemedView>
      </SafeAreaView>
    </>
  );
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
  input: {
    width: "85%",
    borderWidth: 1,
    borderColor: '#666666',
    padding: 10,
    borderRadius: 10,
    marginVertical:"2%",

  },
  button:{
    marginVertical:"2%",
    width: "85%"
  },
  error: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 6,
  },
  register: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: "20%"
    
    
  },
  socialLoginContainer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  socialButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  orLoginText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#333',
  },
});
