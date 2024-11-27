import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';


interface user {
  userId: string;
  userFullName?: string; 
  firstTimeUser: boolean;
  setUserId: (userId: string) => void;
  setUserFullName: (userFullName: string) => void;
  setFirstTimeUser: (firstTimeUser: boolean) => void;
  getUserFullName: (userId: string) => void;
  resetUserId: () => void;
}

export const useUserStore = create<user>()(
  devtools(
    persist(
      (set, get) => ({
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
        resetUserId:() =>  set({ userId: '' }),
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
  setFingerMeasurements: (userId: string, measurements: FingerMeasurements) => Promise<void>;
  setWristMeasurement: (userId: string, size: string) => Promise<void>;
  resetMeasurements: () => void;
}

// Create the Zustand store
interface UserMeasurementStorage {
  fingerMeasurements: FingerMeasurements;
  wristMeasurement: string;
  fetchMeasurements: (userId: string) => Promise<void>;
  setFingerMeasurements: (userId: string, measurements: FingerMeasurements) => Promise<void>;
  setWristMeasurement: (userId: string, size: string) => Promise<void>;
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

        // Fetch measurements from Firestore and update Zustand state
        fetchMeasurements: async (userId: string) => {
          try {
            const userDoc = await firestore().collection('user').doc(userId).get();
            const measurements = userDoc.data()?.measurements;

            if (measurements) {
              set({
                fingerMeasurements: measurements.fingerMeasurements || {
                  thumb: '',
                  index: '',
                  middle: '',
                  ring: '',
                  pinky: '',
                },
                wristMeasurement: measurements.wristMeasurement || '',
              });
            }
          } catch (error) {
            console.error('Error fetching measurements:', error);
          }
        },
        // Action to set finger measurements
        setFingerMeasurements: async (userId, measurements) => {
          try {
            // Update Firestore
            await firestore()
              .collection('user')
              .doc(userId)
              .set(
                { measurements: { fingerMeasurements: measurements } },
                { merge: true }
              );

            // Update Zustand state
            set({ fingerMeasurements: measurements });
          } catch (error) {
            console.error('Error updating finger measurements:', error);
          }
        },

        // Action to set wrist measurement
        setWristMeasurement: async (userId, size) => {
          try {
            // Update Firestore
            await firestore()
              .collection('user')
              .doc(userId)
              .set(
                { measurements: { wristMeasurement: size } },
                { merge: true } 
              );

            // Update Zustand state
            set({ wristMeasurement: size });
          } catch (error) {
            console.error('Error updating wrist measurement:', error);
          }
        },

        // Action to reset all measurements
        resetMeasurements: () => {
          set({
            fingerMeasurements: {
              thumb: '',
              index: '',
              middle: '',
              ring: '',
              pinky: '',
            },
            wristMeasurement: '',
          });
        },
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
  fetchFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, favoriteId: number) => Promise<void>;
  removeFavorite: (userId: string, favoriteId: number) => Promise<void>;
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
          
            
            //console.log('favs', userFavorites)

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
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Item added to favorites successfully!',
                })
              });
          } catch (error) {
            console.error('Error adding favorite:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Adding item to favorites unsuccessful!',
            })
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
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Item removed to favorites successfully!',
              })
          } catch (error) {
            console.error('Error removing favorite:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Removing item to favorites unsuccessful!',
            })
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
export interface CartItem {
  id:number;
  img?: string;
  name?: string;
  size: number;
  quantity: number;
  price: string;
}
// Update CartStorage interface if necessary
interface CartStorage {
  cart: CartItem[];
  checkOutCartItems: CartItem[];
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, cartItem: CartItem) => Promise<void>;
  removeFromCart: (userId: string, cartItemId: number, cartItemSize: number, cartItemQty: number, cartItemPrice: string, noToastNotif?: boolean) => Promise<void>;
  updateQuantity: (userId: string, cartItemId: number, cartItemQty: number, cartItemSize: number, cartItemPrice: string) => Promise<void>;
  addCheckOutCartItems: (cartItem: CartItem[]) => void;
  resetCart: () => void;
  resetCheckOutCartItems: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  checkOutTotalPrice: () => number;
  checkOutTotalItems: () => number;
}

// Your Zustand store implementation
export const useCartStore = create<CartStorage>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        checkOutCartItems: [],
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
            //const rawCart = snapshot.data()?.cart || [];
            //const rawCartIds = rawCart.map((item: CartItem ) => item.id);
            //console.log('Extracted Cart IDs:', rawCartIds); 
            //const cartItems = await Promise.all(rawCartIds.map((id: number) => {

            //}));
            const userCartItems = snapshot.data()?.cart
            //console.log('full cart:', userCartItems)
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
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Item added to cart successfully!',
            })
          } catch (error) {
            console.error('Error adding to cart:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Adding item to cart unsuccessful!',
            })
          }
        },
        removeFromCart: async (userId: string, id: number, size: number, quantity: number, price: string, noToastNotif?: boolean) => {
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
            if (!noToastNotif) {
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Item removed to cart successfully!',
              })
            }
          } catch (error) {
            console.error('Error removing from cart:', error);
            if (!noToastNotif) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Removing item to cart unsuccessful!',
              })
            }
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
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Item quantity updated successfully!',
              })
            }
          } catch (error) {
            console.error('Error updating quantity:', error);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Updating item quantity unsuccessful!',
            })
          }
        },
        addCheckOutCartItems: (cartItems: CartItem[]) => {
            set({ checkOutCartItems: cartItems }); // Directly set the array
        },
        resetCart: async () => {
          try {
            set({ cart: [] });
          } catch (error) {
            console.error('Error clearing cart:', error);
          }
        },  
        resetCheckOutCartItems:() => {
            set({ checkOutCartItems: [] });
        },
        totalItems: () =>
          get().cart.reduce((total, item) => total + item.quantity, 0),

        totalPrice: () =>
          get().cart.reduce(
            (total, item) => total + parseFloat(item.price) * item.quantity,
            0
          ),
        checkOutTotalPrice: () => {
          return get().checkOutCartItems.reduce(
            (total, item) => total + parseFloat(item.price) * item.quantity, 0
            )
          },
        checkOutTotalItems: () =>
          get().checkOutCartItems.reduce((total, item) => total + item.quantity, 0),
      }),
      {
        name: 'USER_CART',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);


export interface OrderItem {
  orderId: string; // Order ID
  userId: string; // ID of the user who placed the order
  items: CartItem[]; // Items in the order
  totalAmount: number; // Total price of the order
  status: "pending" | "completed" | "cancelled"; // Order status
  createdAt: string; // Timestamp of order creation
  ETA: string;
}

interface OrderStorage {
  orders: OrderItem[];
  fetchOrders: (userId: string) => Promise<void>;
  addOrder: (userId: string, orderId: string, cartItems: CartItem[], totalAmount: number, ETA: string) => Promise<void>;
  updateOrderStatus: (userId: string, orderId: string, status: "pending" | "completed" | "cancelled") => Promise<void>;
  resetOrders: () => void;
}

export const useOrderStore = create<OrderStorage>()(
  devtools(
    persist(
      (set, get) => ({
        orders: [],

        // Fetch orders for a specific user
        fetchOrders: async (userId: string) => {
          try {
            const snapshot = await firestore()
              .collection("user")
              .doc(userId)
              .get();

            if (!snapshot.exists) {
              console.log("No user found");
              set({ orders: [] });
              return;
            }

            const userOrders: OrderItem[] = snapshot.data()?.orders || [];
            set({ orders: userOrders });
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        },

        // Add a new order for the user
        addOrder: async (userId: string, orderId: string, cartItems: CartItem[], totalAmount: number, ETA: string) => {
          try {
            const newOrder: OrderItem = {
              orderId, 
              userId,
              items: cartItems,
              totalAmount,
              status: "pending",
              createdAt: new Date().toISOString(),
              ETA: ETA
            };

            // Fetch user document and update orders
            const userDocRef = firestore().collection("user").doc(userId);
            

            // Add the new order to the existing orders array
            await userDocRef.update({
              orders: firestore.FieldValue.arrayUnion(newOrder),
            });

            // Update local state
            set((state) => ({
              orders: [...state.orders, newOrder],
            }));

            console.log("Order placed successfully!");
          } catch (error) {
            console.error("Error adding order:", error);
          }
        },

        // Update order status for a user
        updateOrderStatus: async (userId: string, orderId: string, status: "pending" | "completed" | "cancelled") => {
          try {
            const userDocRef = firestore().collection("user").doc(userId);

            // Fetch user document and update the status of the specific order
            const userDoc = await userDocRef.get();
            const orders = userDoc.data()?.orders || [];

            const updatedOrders = orders.map((order: OrderItem) =>
              order.orderId === orderId ? { ...order, status } : order
            );

            // Update Firestore with the modified orders array
            await userDocRef.update({ orders: updatedOrders });

            // Update local state
            set((state) => ({
              orders: updatedOrders,
            }));

            console.log(`Order ${orderId} status updated to ${status}`);
          } catch (error) {
            console.error("Error updating order status:", error);
          }
        },

        // Reset all orders (local state only)
        resetOrders: () => {
          set({ orders: [] });
        },
      }),
      {
        name: "USER_ORDERS",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

interface shippingAddress {
  fullName: string;
  contactNo: string;
  addressType: string;
  defaultAddress: boolean;
  streetBldgHouseNo: string;
  postalCode: string;
  rpcb: string; // Region, province, city, barangay
}

interface shippingDetailsStore {
  shippingDetails: shippingAddress[]; 
  fetchShippingDetails: (userId: string) => Promise<void>;
  addShippingDetails: (userId: string, newShippingAddress: shippingAddress[]) => Promise<void>;
  removeShippingDetails: (userId: string, shippingAddressToRemove: shippingAddress) => Promise<void>;
  updateShippingDetails: (userId: string, updatedShippingAddress: shippingAddress) => Promise<void>;
}

export const useShippingDetailsStore = create<shippingDetailsStore>()(
  devtools(
    persist(
      (set, get) => ({
        shippingDetails: [], // Initialize as an empty array of shippingAddress
        fetchShippingDetails: async (userId: string) => {
          try {
            const snapshot = await firestore()
              .collection("user")
              .doc(userId)
              .get();

            if (!snapshot.exists) {
              console.log("No user found");
              set({ shippingDetails: [] });
              return;
            }

            const userShippingDetails: shippingAddress[] = snapshot.data()?.shippingDetails || [];
            set({ shippingDetails: userShippingDetails });
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        },
        // Add new shipping details
        addShippingDetails: async (userId: string, newShippingDetails: shippingAddress[]) => {
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              shippingDetails: firestore.FieldValue.arrayUnion(...newShippingDetails)
            })
            .then(() => {
              const { shippingDetails } = get();
              set({
                shippingDetails: [...shippingDetails, ...newShippingDetails]
              });
            });
        },

        // Remove shipping details
        removeShippingDetails: async (userId: string, shippingDetailsToRemove: shippingAddress) => {
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              shippingDetails: firestore.FieldValue.arrayRemove(shippingDetailsToRemove)
            })
            .then(() => {
              const { shippingDetails } = get();
              set({
                shippingDetails: shippingDetails.filter(
                  (item) => item.postalCode !== shippingDetailsToRemove.postalCode
                )
              });
            });
        },

        // Update existing shipping details
        updateShippingDetails: async (userId: string, updatedShippingDetail: shippingAddress) => {
          const { shippingDetails } = get();
          
          // Remove the old shipping address from Firestore
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              shippingDetails: firestore.FieldValue.arrayRemove(
                shippingDetails.find((item) => item.postalCode === updatedShippingDetail.postalCode)
              )
            });

          // Add the updated shipping address to Firestore
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              shippingDetails: firestore.FieldValue.arrayUnion(updatedShippingDetail)
            })
            .then(() => {
              set({
                shippingDetails: shippingDetails.map((item) =>
                  item.postalCode === updatedShippingDetail.postalCode
                    ? updatedShippingDetail
                    : item
                )
              });
            });
        }
      }),
      {
        name: 'SHIPPING_DETAILS', // Unique name for the storage
        storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      }
    )
  )
);
