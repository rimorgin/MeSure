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

// Favorites Store
interface FavoritesStorage {
  favorites: number[]; // Array of product IDs as numbers
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStorage>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],
        fetchFavorites: async () => {
          try {
            const response = await fetch('/api/favorites');
            const data = await response.json();
            set({ favorites: data });
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        },
        addFavorite: (id) => {
          const { favorites } = get();
          if (!favorites.includes(id)) {
            set({ favorites: [...favorites, id] });
          }
        },
        removeFavorite: (id) => {
          set({ favorites: get().favorites.filter((favId) => favId !== id) });
        },
        isFavorite: (id) => get().favorites.includes(id),
        resetFavorite: () => {
          set({ favorites: [] });
        }
      }),
      {
        name: 'USER_FAVORITES',
        storage: createJSONStorage(() => AsyncStorage),
        onRehydrateStorage:() => {
          
        }
      }
    )
  )
);

// Cart Store
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; // Optional field for product image
}

interface CartStorage {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStorage>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item) => {
          const { cart } = get();
          const existingItem = cart.find((cartItem) => cartItem.id === item.id);

          if (existingItem) {

            set({
              cart: cart.map((cartItem) =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              ),
            });
          } else {
            // Add a new item to the cart
            set({ cart: [...cart, item] });
          }
        },

        removeFromCart: (id) => {
          set({ cart: get().cart.filter((item) => item.id !== id) });
        },

        updateQuantity: (id, quantity) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            get().removeFromCart(id);
          } else {
            set({
              cart: get().cart.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
            });
          }
        },

        clearCart: () => set({ cart: [] }),

        totalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),

        totalPrice: () =>
          get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
      }),
      {
        name: 'USER_CART', // AsyncStorage key
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);