
export interface user {
  userId: string;
  userFullName?: string;
  userEmail?: string;
  userEmailVerified?: boolean;
  userDisplayName?: string; 
  userContactNo?: string;
  firstTimeUser: boolean;
  requestToDelete?: boolean;
  fetchUserData: () => Promise<UserData | null>;
  setUserId: (userId: string) => void;
  setUserFullName: (userId: string, userFullName: string) => Promise<void>;
  setFirstTimeUser: (firstTimeUser: boolean) => void;
  getUserDetails: (userId: string) => Promise<void>;
  setUserDisplayName: (userId: string, userDisplayName: string) => Promise<void>;
  setUserEmail: (userId: string, userEmail: string) => Promise<void>;
  setUserEmailVerified: (isEmailVerified: boolean) => void;
  setUserContactNo: (userId: string, userContactNo: string) => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  cancelAccountDeletion: () => Promise<void>;
  resetUserId: () => void;
}


interface Order {
  ETA: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  orderId: string;
  shippingAddress: {
    addressType: string;
    contactNo: string;
    fullName: string;
    postalCode: string;
    rpcb: string; // Region, Province, City, Barangay
    streetBldgHouseNo: string;
  };
  status: string;
  totalAmount: number;
  totalItems: number;
  userId: string;
}

interface ShippingDetail {
  addressType: string;
  contactNo: string;
  defaultAddress: boolean;
  fullName: string;
  id: string;
  postalCode: string;
  rpcb: string;
  streetBldgHouseNo: string;
}

interface PaymentMethods {
  cardNumber: number;
  cvv: number;
  holderName: string;
  expirationDate: string;
  cardType: string;
}

export interface UserData {
  authId: string;
  cart: any[]; // Replace `any` with the appropriate cart item type if known
  contactNo: string;
  email: string;
  favorites: any[]; // Replace `any` with the appropriate favorite item type if known
  measurements: Record<string, any>; // Replace `any` with specific measurement properties if known
  name: string;
  orders: Order[];
  profile: string;
  shippingDetails: ShippingDetail[];
  username: string;
  paymentMethods: PaymentMethods[];
}
