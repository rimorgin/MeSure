import React from "react";
import { useStorageState } from "../hooks/useStorageState";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'

const AuthContext = React.createContext<{
  signIn: (usernameOrEmail:string, password:string) => void;
  signUp: (usernameOrEmail:string, password:string) => void;
  signOut: () => void;
  session?: string | null ;
  isLoading: boolean;
}>({
  signIn: () => null,
  signUp: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
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
  return (
    <AuthContext.Provider
      value={{
        //=====================================//
        signIn: async (usernameOrEmail, password) => {
    
            await auth().signInWithEmailAndPassword(usernameOrEmail, password)
            .then(async()=> {
                const userSessionToken = await auth().currentUser?.getIdToken()
                if (userSessionToken) setSession(userSessionToken);
                Toast.show({
                    type: 'success',
                    text1: "Login Successful",
                    text2: `Welcome back, ${usernameOrEmail}!`
                });
                router.push('/');
            })
            .catch((error) => {
                alert("Login failed: " + error.message)
            })
          

          
        },
        //=====================================//
        signUp: async (usernameOrEmail, password) => {
          await auth().createUserWithEmailAndPassword(usernameOrEmail, password)
            .then(()=> {
                setSession(usernameOrEmail +" and "+ password);
                Toast.show({
                    type: 'success',
                    // And I can pass any custom props I want
                    text1: usernameOrEmail,
                    text2: password
                });
                router.push('/');
            })
            .catch((error) => {
                alert("Registration failed: " + error.message)
            })
        },

        //=====================================//
        signOut: () => {
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