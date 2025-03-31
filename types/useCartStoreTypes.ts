export interface CartItem {
  id:number;
  img?: string;
  name?: string;
  size: number;
  quantity: number;
  price: string;
}
// Update CartStorage interface if necessary
export interface CartStorage {
  cart: CartItem[];
  checkOutCartItems: CartItem[];
  fetchCart: (cart: CartItem[]) => Promise<void>;
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