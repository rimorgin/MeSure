import { create } from 'zustand';
import RNFS from 'react-native-fs';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

interface userId {
  userId: string;
  userFullName?: string; 
  firstTimeUser: boolean;
  setUserId: (userId: string) => void;
  setUserFullName: (userFullName: string) => void;
  setFirstTimeUser: (firstTimeUser: boolean) => void;
  getUserFullName: (userId: string) => void;
  resetUserId: () => void;
}

export const useUserIdStore = create<userId>()(
  devtools(
    persist(
      (set) => ({
        userId: '',
        userFullName: '',
        firstTimeUser: false,
        setUserId: (userId: string) => set({ userId }),
        setUserFullName: (userFullName: string) => set({ userFullName }),
        setFirstTimeUser(firstTimeUser) {
            set({ firstTimeUser: firstTimeUser });
        },
        getUserFullName: async (userId: string) => {
          const snapshot = await firestore()
              .collection(`user`)
              .doc(userId)
              .get();
          const userFullName = snapshot.data()?.name
          set({userFullName: userFullName})
        },
        resetUserId:() =>  set({ userId: '' })
      }),
      {
        name: 'USER_ID', // Unique name for the storage
        storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      }
    )
  )
)

interface FingerMeasurements {
  thumb: string;
  index: string;
  middle: string;
  ring: string;
  pinky: string;
}

interface UserMeasurementStorage {
  fingerMeasurements: FingerMeasurements;
  wristMeasurement: string;
  setFingerMeasurements: (measurements: FingerMeasurements) => void;
  setWristMeasurement: (size: string) => void;
  resetMeasurements: () => void;
}

// Create the Zustand store
export const useUserMeasurementStorage = create<UserMeasurementStorage>()(
  devtools(
    persist(
      (set) => ({
        fingerMeasurements: {
          thumb: '',
          index: '',
          middle: '',
          ring: '',
          pinky: '',
        },
        wristMeasurement: '',
        
        // Action to set finger measurements
        setFingerMeasurements: (measurements) =>
          set({ fingerMeasurements: measurements }),
        
        // Action to set wrist size
        setWristMeasurement: (size) =>
          set({ wristMeasurement: size }),

        // Action to reset all measurements
        resetMeasurements: () =>
          set({
            fingerMeasurements: {
              thumb: '',
              index: '',
              middle: '',
              ring: '',
              pinky: '',
            },
            wristMeasurement: '',
          }),
      }),
      {
        name: 'USER_MEASUREMENTS', // Unique name for the storage
        storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      }
    )
  )
);

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
          set({ email, firstLaunch: isNew, showIntro: isNew });
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
export const useImageStorage = create<ImageStorage>()(
  devtools(
    persist(
      (set,get) => ({
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
      }),
      {
        name: 'APP_IMAGES',
        storage: createJSONStorage(() => AsyncStorage),
      }
    ) 
  )
)

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

//completed implementation on firebase firestore

interface FavoritesItem {
  id: number;
  name: string;
  img?: string;
  price: string;
}

// Favorites Store
interface FavoritesStorage {
  favorites: number[]; // Array of FavoritesItem objects
  fetchFavorites: (userId: string) => void;
  addFavorite: (userId: string, favoriteId: number) => void;
  removeFavorite: (userId: string, favoriteId: number) => void;
  isFavorite: (id: number) => boolean;
  resetFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStorage>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],

        fetchFavorites: async (userId: string) => {
          try {
            const snapshot = await firestore()
              .collection(`user`)
              .doc(userId)
              .get();
            //console.log('userId', userId)
            const userFavorites = snapshot.data()?.favorites; 
          
            
            console.log('favs', userFavorites)

            // Set the favorites to include full product data
            set({ favorites: userFavorites });
          } catch (error) {
            console.error('Error fetching favorites:', error);
          }
        },

        addFavorite: async (userId: string, favoriteId: number) => {
          try {
            await firestore()
              .collection(`user`)
              .doc(userId)
              .update({ favorites: firestore.FieldValue.arrayUnion(favoriteId) })
              .then(() => {
                const { favorites } = get();
                // Update local state to include the full favorite item
                set({ favorites: [...favorites, favoriteId] });
              });
          } catch (error) {
            console.error('Error adding favorite:', error);
          }
        },

        removeFavorite: async (userId: string, favoriteId: number) => {
          try {
            await firestore()
              .collection(`user`)
              .doc(userId)
              .update({ favorites: firestore.FieldValue.arrayRemove(favoriteId) })
              .then(() => {
                const { favorites } = get();
                // Remove the favorite item based on the id
                set({ favorites: favorites.filter((favIds) => favIds !== favoriteId) });
              });
          } catch (error) {
            console.error('Error removing favorite:', error);
          }
        },

        isFavorite: (id: number | string) => {
          const parsedId = typeof id === 'string' ? parseInt(id, 10) : id;
          return get().favorites.includes(parsedId);
        },
        resetFavorites: () => {
          set({favorites: []})
        }
      }),
      {
        name: 'USER_FAVORITES',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);


// Cart Store
interface CartItem {
  id:number;
  size: number;
  quantity: number;
  price: string;
}
// Update CartStorage interface if necessary
interface CartStorage {
  cart: CartItem[];
  fetchCart: (userId: string) => void;
  addToCart: (userId: string, cartItem: CartItem) => void;
  removeFromCart: (userId: string, cartItemId: number, cartItemSize: number, cartItemQty: number, cartItemPrice: string) => void;
  updateQuantity: (userId: string, cartItemId: number, cartItemQty: number, cartItemSize: number, cartItemPrice: string) => void;
  resetCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

// Your Zustand store implementation
export const useCartStore = create<CartStorage>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        fetchCart: async (userId: string) => {
          try {
            const snapshot = await firestore()
              .collection(`user`)
              .doc(userId)
              .get()

            if (!snapshot.exists) {
              console.error('user cart does not exists');
              set({ cart: [] }); // Set cart to an empty array if the user does not exist     
              return;
            }
            const rawCart = snapshot.data()?.cart || [];
            const rawCartIds = rawCart.map((item: CartItem ) => item.id);
            console.log('Extracted Cart IDs:', rawCartIds); 
            const cartItems = await Promise.all(rawCartIds.map((id: number) => {

            }));
            const userCartItems = snapshot.data()?.cart
            console.log('full cart:', userCartItems)
            set({ cart: userCartItems });
          } catch (error) {
            console.error('Error fetching cart:', error);
          }
        },

        addToCart: async (userId: string, cartItem: CartItem) => {
          try {
            // Fetch the current cart
            const userDoc = await firestore().collection('user').doc(userId).get();
            const cart = userDoc.data()?.cart || [];

            // Check if the item already exists in the cart
            const existingItemIndex = cart.findIndex(
              (item: CartItem) => item.id === cartItem.id && item.size === cartItem.size
            );

            let updatedCart;

            if (existingItemIndex !== -1) {
              // If the item exists, update its quantity
              const existingItem = cart[existingItemIndex];
              updatedCart = cart.map((item: CartItem, index: number) =>
                index === existingItemIndex
                  ? { ...existingItem, quantity: existingItem.quantity + cartItem.quantity }
                  : item
              );
            } else {
              // If the item does not exist, add it to the cart
              updatedCart = [...cart, cartItem];
            }

            // Write the updated cart back to Firestore
            await firestore().collection('user').doc(userId).update({ cart: updatedCart });

            // Update the local state
            set({ cart: updatedCart });
          } catch (error) {
            console.error('Error adding to cart:', error);
          }
        },
        removeFromCart: async (userId: string, id: number, size: number, quantity: number, price: string) => {
          try {
            // Remove the item from Firestore using arrayRemove with id, size, quantity, and price
            await firestore()
              .collection('user')
              .doc(userId)
              .update({
                cart: firestore.FieldValue.arrayRemove({
                  id: id,       // product id
                  size: size,   // product size
                  quantity: quantity, // quantity of the product
                  price: price  // price of the product
                })
              });

            // Update the local cart state by filtering out the item with matching id and size
            set({
              cart: get().cart.filter((item) => !(item.id === id && item.size === size && item.quantity === quantity && item.price === price))
            });
          } catch (error) {
            console.error('Error removing from cart:', error);
          }
        },
        updateQuantity: async (userId: string, cartItemId: number, cartItemQty: number, cartItemSize: number, cartItemPrice: string) => {
          try {
            if (cartItemQty <= 0) {
              // If quantity is 0 or less, remove the item from the cart
              await get().removeFromCart(userId, cartItemId, cartItemSize, cartItemQty, cartItemPrice);
            } else {
              // Update the quantity of the cart item
              const userDoc = await firestore().collection('user').doc(userId).get();
              const cart = userDoc.data()?.cart || [];

              // Update the specific cart item based on id and size
              const updatedCart = cart.map((cartItem: CartItem) =>
                cartItem.id === cartItemId && cartItem.size === cartItemSize
                  ? { ...cartItem, quantity: cartItemQty } // Update the quantity
                  : cartItem
              );

              // Write the updated cart back to Firestore
              await firestore().collection('user').doc(userId).update({ cart: updatedCart });

              // Update the local state with the updated cart
              set({ cart: updatedCart });
            }
          } catch (error) {
            console.error('Error updating quantity:', error);
          }
        },

        /*
        resetCart: async (userId: string) => {
          try {
            const cartSnapshot = await firestore()
              .collection(`user/${userId}/cart`)
              .get();

            const batch = firestore().batch();
            cartSnapshot.docs.forEach((doc) => {
              batch.delete(doc.ref);
            });
            await batch.commit();

            set({ cart: [] });
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        },
        */
        resetCart: async () => {
          try {
            set({ cart: [] });
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        },  
        totalItems: () =>
          get().cart.reduce((total, item) => total + item.quantity, 0),

        totalPrice: () =>
          get().cart.reduce(
            (total, item) => total + parseFloat(item.price) * item.quantity,
            0
          ),
      }),
      {
        name: 'USER_CART',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
