import React, { useState } from 'react'
import { Button, StyleSheet, TextInput, View, Dimensions, KeyboardAvoidingView } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSession } from "./ctx";
import Svg, { Path } from 'react-native-svg';

//form use cases
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getWindowDimensions } from '@/hooks/getWindowDimensions';


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

  const onSubmit = (data: { usernameOrEmail: string; password: string }) => {
    const { usernameOrEmail, password } = data; // Destructure the data object
    signIn(usernameOrEmail, password)
    console.log(process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY)
  };

  return (
    <SafeAreaView style={styles.container}>
    
      {<Svg style={styles.svg} width={'100%'} height={500}>
        <Path fill="#0099ff" fillOpacity="1" d="M0,32L40,58.7C80,85,160,139,240,138.7C320,139,400,85,480,74.7C560,64,640,96,720,133.3C800,171,880,213,960,197.3C1040,181,1120,107,1200,96C1280,85,1360,139,1400,165.3L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
      </Svg>}
        <ThemedView style={styles.container}>
      
      <ThemedText style={styles.title}>Welcome! {height/2}</ThemedText>
      <ThemedText style={styles.paragraph}>
        This is a simple repo that emulates a login authentication workflow
        using Expo Router, focused on the navigation aspect.
      </ThemedText>
      <ThemedView
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
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
      {errors?.usernameOrEmail?.message &&
        <ThemedText type='defaultSemiBold' style={styles.error}>{errors.usernameOrEmail.message}</ThemedText>
      }
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
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
      {errors?.password?.message &&
        <ThemedText type='defaultSemiBold' style={styles.error}>{errors.password.message}</ThemedText>
      }
      <Button
          onPress={() => reset(defaultValues)}
          title="Clear"
        />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </ThemedView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex:-1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
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


