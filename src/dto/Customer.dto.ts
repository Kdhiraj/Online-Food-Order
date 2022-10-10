export interface CreateCustomerInput {
  email: string;
  phone: string;
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



export enum Payment {
  Card = "Card",
  COD = "COD",
  Wallet = "Wallet",
  NetBanking = "NetBanking",
}

export interface CreatePaymentInput {
  amount: string;
  paymentMode: Payment;
  offerId?: string;
}


