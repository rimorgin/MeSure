// a Zustand store for managing the state of an application's first launch. 

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand store definition 
interface AppFirstLaunch {
  firstLaunch: boolean;
  setFirstLaunch: () => void;
  resetFirstLaunch: () => void;
}

//Zustand implementation
export const useIsAppFirstLaunchStore = create<AppFirstLaunch>()(
  devtools(
    persist(
      (set) => ({
        firstLaunch: true,
        setFirstLaunch: () => set({ firstLaunch: false }),
        resetFirstLaunch: () => set({ firstLaunch: true }),
      }),
      {
        name: 'FIRST_LAUNCH',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
