import { CartItem } from "./useCartStoreTypes";
import { shippingAddress } from "./useShippingDetailsStoreTypes";

export interface OrderItem {
  orderId: string; // Order ID
  userId: string; // ID of the user who placed the order
  items: CartItem[]; // Items in the order
  totalAmount: number; // Total price of the order
  totalItems: number;
  status: "pending" | "shipped" |"delivered" | "cancelled" | "returned"; // Order status
  createdAt: string; // Timestamp of order creation
  ETA: string;
  shippingAddress: shippingAddress
}

export interface OrderStorage {
  orders: OrderItem[];
  fetchOrders: (orders: any) => Promise<void>;
  addOrder: (userId: string, orderId: string, cartItems: CartItem[], totalAmount: number, totalItems: number, ETA: string, shippingAddress: shippingAddress) => Promise<void>;
  updateOrderStatus: (userId: string, orderId: string, status: "pending" | "completed" | "cancelled") => Promise<void>;
  resetOrders: () => void;
}