import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { user, UserData } from '@/types/userStoreTypes';
import { UserMeasurementStorage } from '@/types/userMeasurementStoreTypes';
import { AppFirstLaunch } from '@/types/useIsAppFirstLaunchStoreTypes';
import { isEmailNew } from '@/utils/isEmailNew';
import { ColorSchemeStorage } from '@/types/useColorSchemeStoreTypes';
import { FavoritesStorage } from '@/types/useFavoritesStoreTypes';
import { CartItem, CartStorage } from '@/types/useCartStoreTypes';
import { OrderItem, OrderStorage } from '@/types/useOrderStoreTypes';
import { shippingAddress, ShippingAddressForm, shippingDetailsStore } from '@/types/useShippingDetailsStoreTypes';
import { PaymentMethods, PaymentMethodsStore } from '@/types/usePaymentMethodsStoreTypes';

export const useUserStore = create<user>()(
  devtools(
    persist(
      (set, get) => ({
        userId: '',
        userFullName: '',
        userDisplayName: '',
        userEmail: '',
        userEmailVerified: false,
        userContactNo: '',
        firstTimeUser: false,
        requestToDelete: false,
        fetchUserData: async (): Promise<UserData | null> => {
          const { userId } = get(); 
          if (!userId) {
            console.warn('No userId found in state.');
            return null; // Early exit if userId is not set
          }
          try {
            const snapshot = await firestore().collection('user').doc(userId).get();

            if (snapshot.exists) {
              const data = snapshot.data();
              if (data) {
                return data as UserData; // Type assertion to UserData
              }
            }
            console.warn('No document found for the provided userId or data is undefined.');
            return null; // Handle cases where document exists but data is undefined
          } catch (error) {
            console.error('Error fetching user data:', error);
            throw error; // Properly propagate the error
          }
        },

        setUserId: (userId: string) => set({ userId }),
        setUserFullName: async (userId: string, userFullName: string) => {
          await firestore()
            .collection('user')
            .doc(userId)
            .update({name: userFullName})
          set({ userFullName: userFullName })},
        setFirstTimeUser(firstTimeUser) {
            set({ firstTimeUser: firstTimeUser });
        },
        getUserDetails: async (userId: string) => {
          const snapshot = await firestore()
              .collection(`user`)
              .doc(userId)
              .get();
          
          const userFullName = snapshot.data()?.name
          const userContactNo = snapshot.data()?.contactNo
          const userDisplayName = snapshot.data()?.displayName
          const userEmail = snapshot.data()?.email
          set({
            userFullName: userFullName,
            userContactNo: userContactNo,
            userDisplayName: userDisplayName,
            userEmail: userEmail
          })
        },
        setUserDisplayName: async (userId: string, userDisplayName: string) => {
          await auth()
            .currentUser?.updateProfile({
            displayName: userDisplayName,  
          })
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              username: userDisplayName,
            })
          set({ userDisplayName: userDisplayName})
        },
        setUserEmail: async (userId: string, userEmail: string) => {
          
          await auth().currentUser?.verifyBeforeUpdateEmail(userEmail);
          await firestore().collection('user').doc(userId).update({email: userEmail})
          set({ 
            userEmail: userEmail,
            userEmailVerified: false
          });
        },
        setUserContactNo: async (userId: string, userContactNo: string) => {
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              contactNo: userContactNo,
            })
          set({ userContactNo: userContactNo });
        },
        setUserEmailVerified:(isEmailVerified) => {
            set({ userEmailVerified: isEmailVerified });
        },
        requestAccountDeletion: async () => {
          const { userEmail } = get()
          const now = new Date();

          const requestDate = `${
              now.getMonth() + 1
          }/${now.getDate()}/${now.getFullYear()} ${
              now.getHours() % 12 || 12
          }:${now.getMinutes().toString().padStart(2, '0')}:${
              now.getSeconds().toString().padStart(2, '0')
          } ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

          await firestore()
            .collection('requestForAccountDeletions')
            .doc(userEmail)
            .set({
              requestToDelete: true,
              requestDate: requestDate
            })

          set({ requestToDelete: true });
        },
        cancelAccountDeletion: async () => {
          const { userEmail } = get()
          await firestore()
            .collection('requestForAccountDeletions')
            .doc(userEmail)
            .delete()

          set({ requestToDelete: false });
        },
        resetUserId:() =>  set({ 
          userId: '',
          userFullName: '',
          userDisplayName: '',
          userEmail: '',
          userEmailVerified: false,
          userContactNo: '',
          requestToDelete: false
         }),
      }),
      {
        name: 'USER_ID', // Unique name for the storage
        storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      }
    )
  )
)

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
        fetchMeasurements: async (measurements: any) => {
          try {
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
export const useFavoritesStore = create<FavoritesStorage>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],

        fetchFavorites: async (favorites) => {
          try {
            if (favorites && Array.isArray(favorites)) {
              set({ favorites: favorites });
            }
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


// Your Zustand store implementation
export const useCartStore = create<CartStorage>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        checkOutCartItems: [],
        fetchCart: async (cart) => {
          try {
            if (cart && Array.isArray(cart)) {
              set({ cart: cart });
            }
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


export const useOrderStore = create<OrderStorage>()(
  devtools(
    persist(
      (set, get) => ({
        orders: [],

        // Fetch orders for a specific user
        fetchOrders: async (orders) => {
          try {
            if (orders && Array.isArray(orders)) {
              set({ orders: orders });
            }
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        },

        // Add a new order for the user
        addOrder: async (userId: string, orderId: string, cartItems: CartItem[], totalAmount: number, totalItems: number, ETA: string, shippingAddress: shippingAddress) => {
          try {
            const newOrder: OrderItem = {
              orderId, 
              userId,
              items: cartItems,
              totalAmount,
              totalItems,
              status: "pending",
              createdAt: new Date().toISOString(),
              ETA: ETA,
              shippingAddress: shippingAddress
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

            //console.log("Order placed successfully!");
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

export const useShippingDetailsStore = create<shippingDetailsStore>()(
  devtools(
    persist(
      (set, get) => ({
        shippingDetails: [], // Initialize as an empty array of shippingAddress
        fetchShippingDetails: async (shippingDetails) => {
          try {
            if (shippingDetails && Array.isArray(shippingDetails)) {
              set({ shippingDetails: shippingDetails });
            }
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        },
        // Add new shipping details
        addShippingDetails: async (userId: string, newShippingDetails: shippingAddress) => {
          await firestore()
            .collection('user')
            .doc(userId)
            .update({
              shippingDetails: firestore.FieldValue.arrayUnion(newShippingDetails)
            })
            .then(() => {
              const { shippingDetails } = get();
              set({
                shippingDetails: [...shippingDetails, newShippingDetails]
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
                shippingDetails.find((item) => item.id === updatedShippingDetail.id)
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
        },
        resetShippingDetails:()  => {
            set({ shippingDetails: [] });
        },
      }),
      {
        name: 'SHIPPING_DETAILS', // Unique name for the storage
        storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence
      }
    )
  )
);

export const useAddressFormStore = create<ShippingAddressForm>((set) => ({
  fullName: '',
  contactNo: '',
  rpcb: '',
  postalCode: '',
  streetBldgHouseNo: '',
  addressType: 'home',
  defaultAddress: false,
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  resetShippingAddressForm: () =>
    set({
      fullName: '',
      contactNo: '',
      rpcb: '',
      postalCode: '',
      streetBldgHouseNo: '',
      addressType: 'home',
      defaultAddress: false,
    }),
}));

export const usePaymentMethodsStore = create<PaymentMethodsStore>()(
  devtools(
    persist(
      (set, get) => ({
        paymentMethods: [],
        
        // Function to fetch payment methods
        fetchPaymentMethods: async (paymentMethods: PaymentMethods[]) => {
          set({ paymentMethods: paymentMethods });
        },

        // Add a new payment method and automatically identify card type
        addPaymentMethod: async (userId: string, addedPaymentMethod: PaymentMethods) => {
         await firestore()
          .collection('user')
          .doc(userId)
          .update({
            paymentMethods: firebase.firestore.FieldValue.arrayUnion(addedPaymentMethod),
          }) 
          set((state) => ({
              paymentMethods: [...state.paymentMethods, addedPaymentMethod],
          }));
        },
       // Update an existing payment method
        updatePaymentMethod: async (userId: string, updatedPaymentMethod: PaymentMethods) => {
          try {
            // Get the current user document
            const userDocRef = firestore().collection('user').doc(userId);
            
            // Fetch the current user's payment methods to find the one that needs to be updated
            const userDoc = await userDocRef.get();
            if (!userDoc.exists) {
              console.log("User not found!");
              return;
            }

            // Fetch the existing payment methods array from the document
            const currentPaymentMethods = userDoc.data()?.paymentMethods || [];

            // Find the index of the payment method to update based on card number
            const paymentMethodIndex = currentPaymentMethods.findIndex((method: { cardNumber: string; }) => method.cardNumber === updatedPaymentMethod.cardNumber);

            if (paymentMethodIndex === -1) {
              console.log("Payment method not found!");
              return;
            }

            // Update the specific payment method
            currentPaymentMethods[paymentMethodIndex] = updatedPaymentMethod;

            // Now, update the Firestore document with the modified payment methods array
            await userDocRef.update({
              paymentMethods: currentPaymentMethods,
            });

            // Update the store state with the new payment methods list
            set((state) => ({
              paymentMethods: currentPaymentMethods,
            }));

            console.log("Payment method updated successfully");
          } catch (error) {
            console.error("Error updating payment method: ", error);
          }
        },

        // Remove a payment method
        removePaymentMethod: async (userId: string, removedPaymentMethod: PaymentMethods) => {
          try {
            // 1. Remove the payment method from the local state
            set((state) => {
              const updatedPaymentMethods = state.paymentMethods.filter((method) => 
                method.cardNumber !== removedPaymentMethod.cardNumber // Filter out the method to remove
              );

              return { paymentMethods: updatedPaymentMethods };
            });

            // 2. Remove the payment method from Firestore
            const userDocRef = firestore().collection('user').doc(userId);
            
            await userDocRef.update({
              paymentMethods: firebase.firestore.FieldValue.arrayRemove(removedPaymentMethod), // Remove the specific payment method
            });

            console.log("Payment method removed successfully");
          } catch (error) {
            console.error("Error removing payment method: ", error);
          }
        },

        resetPaymentMethod: () => {
          set({ paymentMethods: [] });
        }
      }),
      {
        name: 'PAYMENT_METHODS', // Key for storage 
        storage: createJSONStorage(() => AsyncStorage), 
      }
    )
  )
);