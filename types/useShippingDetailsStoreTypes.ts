export interface shippingAddress {
  id: string;
  fullName: string;
  contactNo: string;
  addressType: string;
  defaultAddress: boolean;
  streetBldgHouseNo: string;
  postalCode: string;
  rpcb: string; // Region, province, city, barangay
}

export interface shippingDetailsStore {
  shippingDetails: shippingAddress[]; 
  fetchShippingDetails: (shippingAddress: shippingAddress[]) => Promise<void>;
  addShippingDetails: (userId: string, newShippingAddress: shippingAddress) => Promise<void>;
  removeShippingDetails: (userId: string, shippingAddressToRemove: shippingAddress) => Promise<void>;
  updateShippingDetails: (userId: string, updatedShippingAddress: shippingAddress) => Promise<void>;
  resetShippingDetails: () => void;
}

export interface ShippingAddressForm {
  fullName: string;
  contactNo: string;
  rpcb: string; // Region, Province, City, Barangay
  postalCode: string;
  streetBldgHouseNo: string;
  addressType: 'home' | 'work';
  defaultAddress: boolean;
  setField: <K extends keyof ShippingAddressForm>(
    field: K,
    value: ShippingAddressForm[K]
  ) => void;
  resetShippingAddressForm: () => void;
}