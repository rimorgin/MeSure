import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand store definition
interface AppFirstLaunch {
  firstLaunch: boolean;
  email: string | null;
  setFirstLaunch: () => void;
  setEmailAndFirstLaunch: (email: string) => void;
  resetFirstLaunch: () => void;
}

// Helper function to check if email is new
const isEmailNew = async (email: string): Promise<boolean> => {
  const storedEmails = await AsyncStorage.getItem('loggedEmails');
  const loggedEmails = storedEmails ? JSON.parse(storedEmails) : [];

  if (loggedEmails.includes(email)) {
    return false; // Email has logged in before
  } else {
    loggedEmails.push(email);
    await AsyncStorage.setItem('loggedEmails', JSON.stringify(loggedEmails));
    return true; // Email is new
  }
};

// Zustand implementation
export const useIsAppFirstLaunchStore = create<AppFirstLaunch>()(
  devtools(
    persist(
      (set) => ({
        firstLaunch: true,
        email: null,
        
        setFirstLaunch: () => set({ firstLaunch: false }),
        // Set email and update firstLaunch if email is new
        setEmailAndFirstLaunch: async (email) => {
          const isNew = await isEmailNew(email);
          set({ email, firstLaunch: isNew });
        },
        resetFirstLaunch: () => set({ firstLaunch: true }),
      }),
      {
        name: 'FIRST_LAUNCH',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
