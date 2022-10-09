export interface CreateCustomerInput {
  email: string;
  phone: string;
  password: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface EditCustomerProfileInput {
  firstName: string;
  lastName: string;
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface CartItem {
  _id: string;
  unit: number;
}

export interface OrderInputs {
  txnId: string;
  amount: string;
  items: [CartItem];
}

export interface CreateDeliveryUserInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  pincode: string;
}
