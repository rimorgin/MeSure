export interface PaymentMethods {
    cardNumber: string;
    cvv: string;
    holderName: string;
    expirationDate: string;
    cardType: string;
    defaultPaymentMethod: boolean;
}

// Define the Zustand store
export interface PaymentMethodsStore {
  paymentMethods: PaymentMethods[];
  fetchPaymentMethods: (paymentMethods: PaymentMethods[]) => Promise<void>;
  addPaymentMethod: (userId: string, paymentMethod: PaymentMethods) => Promise<void>;
  updatePaymentMethod: (userId: string, updatedPaymentMethod: PaymentMethods) => Promise<void>;
  removePaymentMethod: (userId: string, paymentMethod: PaymentMethods) => Promise<void>;
  resetPaymentMethod: () => void;
}