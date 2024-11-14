import { create } from 'zustand';
import RNFS from 'react-native-fs';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Zustand store definition
interface AppFirstLaunch {
  firstLaunch: boolean;
  showIntro: boolean;
  email: string | null;
  setFirstLaunch: () => void;
  hideIntro: () => void;
  setEmailAndFirstLaunch: (email: string) => void;
  resetApp: () => void; // for debugging only
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
        showIntro: true,
        email: null,
        
        setFirstLaunch: () => set({ firstLaunch: false }),
        hideIntro: () => set({ showIntro: false }),
        // Set email and update firstLaunch if email is new
        setEmailAndFirstLaunch: async (email) => {
          const isNew = await isEmailNew(email);
          set({ email, firstLaunch: isNew });
        },
        resetApp: () => set({ firstLaunch: true, showIntro: true }),
      }),
      {
        name: 'FIRST_LAUNCH',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

interface ImageStorage {
  images: string[] | null;
  fetchImages: () => Promise<void>;
  addImage: (id: string, uri: string) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
}

const imagesDirectoryPath = `${RNFS.DocumentDirectoryPath}/images`;

// Ensure the images directory exists
const ensureImagesDirectoryExists = async () => {
  const exists = await RNFS.exists(imagesDirectoryPath);
  if (!exists) {
    await RNFS.mkdir(imagesDirectoryPath);
  }
};

// Helper function to fetch all images
const getAllImages = async (): Promise<string[]> => {
  await ensureImagesDirectoryExists();
  const files = await RNFS.readDir(imagesDirectoryPath);
  return files.map((file) => file.path);
};

// Zustand store for image storage
export const useImageStorage = create<ImageStorage>((set) => ({
  images: null,

  fetchImages: async () => {
    const imagePaths = await getAllImages();
    set({ images: imagePaths });
  },

  addImage: async (id, uri) => {
    await ensureImagesDirectoryExists();
    const targetPath = `${imagesDirectoryPath}/${id}.jpg`;
    await RNFS.copyFile(uri, targetPath);
    const updatedImages = await getAllImages();
    set({ images: updatedImages });
  },

  removeImage: async (id) => {
    const imagePath = `${imagesDirectoryPath}/${id}.jpg`;
    const exists = await RNFS.exists(imagePath);
    if (exists) {
      await RNFS.unlink(imagePath);
    }
    const updatedImages = await getAllImages();
    set({ images: updatedImages });
  },
}));

// Zustand store definition for theme
interface ColorSchemeStorage {
  theme: 'light' | 'dark' | null;
  toggleTheme: (newTheme: 'light' | 'dark' | null) => void;
}

// Zustand store for theme
export const useColorSchemeStore = create<ColorSchemeStorage>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light', // default theme is 'light'

        // Toggle function to switch themes
        toggleTheme: (newTheme) => 
          set((state) => ({
            theme: newTheme ?? (state.theme === 'light' ? 'dark' : 'light'),
          })),
      }),
      {
        name: 'COLOR_SCHEME', // storage key for AsyncStorage
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);