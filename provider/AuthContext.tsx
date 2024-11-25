import React from "react";
import { useStorageState } from "../hooks/useStorageState";
import { Alert } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import auth from '@react-native-firebase/auth'
import { useCartStore, useFavoritesStore, useIsAppFirstLaunchStore, useUserStore, useUserMeasurementStorage } from "@/store/appStore";
import { createUserDoc } from "@/utils/createUserDoc";

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string, username: string, userFullName: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-email':
      return 'Invalid email format. Please provide a valid email.';
    case 'auth/email-already-in-use':
      return 'Email already in use. Please try a different email.';
    case 'auth/weak-password':
      return 'Password is too weak. Please try a stronger password.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with a different sign-in method. Please use the associated provider.';
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed. Please check the app configuration.';
    default:
      return 'An unknown error occurred: ' + errorCode;
  }
}

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const userId = useUserStore((state) => state.userId);
  const { setUserId, resetUserId, setFirstTimeUser } = useUserStore();
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { setEmailAndFirstLaunch, resetApp } = useIsAppFirstLaunchStore();
  const { resetMeasurements } = useUserMeasurementStorage();
  const { resetFavorites } = useFavoritesStore();
  const { resetCart } = useCartStore();

  let errorMsg;

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          await auth().signInWithEmailAndPassword(email, password)
            .then(async () => {
              const userSessionToken = await auth().currentUser?.getIdToken();
              const user = auth().currentUser?.displayName || email;
              const uid = auth().currentUser?.uid || 'invalid'; //invalid 
              setUserId(uid);
              if (userSessionToken) setSession(userSessionToken);
              setEmailAndFirstLaunch(email);
              if (!firstLaunch) {
                Toast.show({
                  type: 'success',
                  text1: "Login Successful",
                  text2: `Welcome back, ${user}!`
                });
              }
              router.push('/');
            })
            .catch((error) => {
              const errorMsg = getErrorMessage(error.code);
              Alert.alert('Login Unsuccessful ⚠️', errorMsg);
            });
        },

        signUp: async (email, password, username, userFullName) => {
          await auth().createUserWithEmailAndPassword(email, password)
            .then(async () => {
              const userSessionToken = await auth().currentUser?.getIdToken();
              await auth().currentUser?.updateProfile({ displayName: username });
              const user = auth().currentUser?.displayName || email;
              setEmailAndFirstLaunch(email);
              const uid = auth().currentUser?.uid || 'invalid';
              setUserId(uid);
              //set this to true to prevent fetching data to first time users
              setFirstTimeUser(true); 
              await createUserDoc({authId: uid, email, username, name: userFullName });
              if (userSessionToken) setSession(userSessionToken);
              Toast.show({
                type: 'success',
                text1: "Registration Successful",
                text2: `Welcome to MeSure, ${user}!`
              });
              router.push('/(auth)/landing');
            })
            .catch((error) => {
              const errorMsg = getErrorMessage(error.code);
              Alert.alert('Registration Unsuccessful ⚠️', errorMsg);
            });
        },

        signOut: () => {
          auth().signOut();
          resetMeasurements();
          resetFavorites();
          resetCart();
          resetUserId();
          setFirstTimeUser(false); //ensure this correctly sets
          setSession(null);
        },

        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
