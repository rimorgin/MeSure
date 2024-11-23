


import React, { useState } from 'react';
import { TouchableOpacity, TextInput, StyleSheet, View, SafeAreaView, Image, Dimensions, StatusBar } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import { ThemedTouchableFilled, ThemedTouchablePlain } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/provider/AuthContext';
import { Colors, white } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import Loader from '@/components/Loader';

const width = Dimensions.get('screen').width

// Yup schema validation
const schema = yup.object().shape({
  userFullName: yup
    .string()
    .min(3, 'Username must be at least 5 characters')
    .required('Full name is required'),

  Email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  Username: yup
    .string()
    .required('Username is required')
    .min(5, 'Username must be at least 5 characters'),
  
  password: yup
    .string()
    .min(8, 'Password must contain 8 or more characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

const defaultValues = {
  userFullName: "",
  Email: "",
  Username: "",
  password: "",
  confirmPassword: "",
};

///////////////////////////////

export default function Register() {
  const { signUp } = useSession()
  const theme = useColorSchemeTheme();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: { Email: string; password: string; Username: string; confirmPassword: string, userFullName: string }) => {
    //console.log('Form Data: ', data);
    setLoading(true);
    const { Email, password, Username, userFullName } = data;
    
    // signup function
    await signUp(Email, password, Username, userFullName);
    setLoading(false);
  };


  return (
    <>
    {loading && <Loader/> }
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle={theme==='light' ? 'dark-content' : 'light-content'} 
        backgroundColor={theme === 'light' ? Colors.light.background : Colors.dark.background} 
      />
      <ThemedView style={{flex:1}}>
        <ThemedView style={styles.formcontainer}>
          <Image 
            source={require('@/assets/images/app-icon.png')} 
            style={styles.image}
          />
          {/* Title */}
          <ThemedText type="semititle" font="cocoGothicRegular">
            Al-Khalaf Gold & Jewelry
          </ThemedText>

          <ThemedText 
            font='spaceMonoRegular'
            style={{fontSize:14, marginBottom:20}}
          >
            Powered by MeSure
          </ThemedText>

          {/* userFullName Input */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Full name"
              />
            )}
            name="userFullName"
            rules={{ required: true }}
            defaultValue={defaultValues.userFullName}
          />
          {errors?.userFullName?.message && (
            <ThemedText type="defaultSemiBold" style={styles.error}>
              {errors.userFullName.message}
            </ThemedText>
          )}

          {/* Username Input */}
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
            name="Username"
            rules={{ required: true }}
            defaultValue={defaultValues.Username}
          />
          {errors?.Username?.message && (
            <ThemedText type="defaultSemiBold" style={styles.error}>
              {errors.Username.message}
            </ThemedText>
          )}

          {/* Email Input */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Email"
              />
            )}
            name="Email"
            rules={{ required: true }}
            defaultValue={defaultValues.Email}
          />
          {errors?.Email?.message && (
            <ThemedText type="defaultSemiBold" style={styles.error}>
              {errors.Email.message}
            </ThemedText>
          )}

          {/* Password Input */}
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
          {errors?.password?.message && (
            <ThemedText type="defaultSemiBold" style={styles.error}>
              {errors.password.message}
            </ThemedText>
          )}

          {/* Confirm Password Input */}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                placeholder="Confirm Password"
              />
            )}
            name="confirmPassword"
            rules={{ required: true }}
            defaultValue=""
          />
          {errors?.confirmPassword?.message && (
            <ThemedText type="defaultSemiBold" style={styles.error}>
              {errors.confirmPassword.message}
            </ThemedText>
          )}

          {/* Register Button */}
          <ThemedTouchableFilled style ={styles.button} onPress={handleSubmit(onSubmit)}>
            <ThemedText 
              customColor={white}
              type='default'
            > Register
            </ThemedText>
          </ThemedTouchableFilled>


          <View style={styles.socialLoginContainer}>
        <ThemedText type='default' style={styles.socialButtonText}>Or Sign up using</ThemedText>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="facebook" size={20} color="#4267B2" />
                <ThemedText type="default" style={styles.socialButtonText}>Sign up with Facebook</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={20} color="#DB4437" />
                <ThemedText type="default" style={styles.socialButtonText}>Sign up with Google</ThemedText>
              </TouchableOpacity>

    
            </View>
            
          <ThemedTouchablePlain
            variant='opacity'
            onPress={() => router.push('/login')}
          >
            <ThemedText type='link'> 
              Already have an account? 
            </ThemedText>
          </ThemedTouchablePlain>


          {/* The orange thingy at the bottom BUTTON ALREADY HAVE AN ACCOUNT CAN"T BE PRESSED IF THERE IS
          <Svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="100%" height="150">
            <Path
              fill="#D4AF37"
              fillOpacity="1"
              d="M0,64L30,85.3C60,107,120,149,180,149.3C240,149,300,107,360,96C420,85,480,107,540,133.3C600,160,660,192,720,181.3C780,171,840,117,900,106.7C960,96,1020,128,1080,138.7C1140,149,1200,139,1260,112C1320,85,1380,43,1410,21.3L1440,0L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            />
          </Svg>
          */}
        </ThemedView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: width * 0.2,
    width: width * 0.2,
    marginBottom: 15
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
  socialLoginContainer: {
    marginTop: "2%",
    width: '70%',
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  socialButtonText: {
    marginLeft: 10,
    color: '#333',
  },
  error: {
    color: '#ff0000',
    fontSize: 9,
    marginBottom: 8,
    marginLeft: 6,
  },
});
