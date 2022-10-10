export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface EditVendorInput {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}
export interface EditVendorService {
  lat?: number;
  lng?: number;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
}
export interface ProcessOrderInputs {
  status: OrderStatusForVendor;
  remarks: string;
  time: number;
}

export enum OrderStatusForVendor {
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
  PREPARING = "PREPARING",
  UNDER_PROCESS = "UNDER_PROCESS",
  READY = "READY",
}

export enum OrderStatusForDelivery {
  ONWAY = "ONWAY",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export enum OrderStatusForCustomer {
  WAITING = "WAITING",
}

export interface CreateOfferInputs {
  offerType: string; //Vendor / Generic
  vendors: [any]; // [dfhdfdkhfjdhkfjodre3]
  title: string; // INR 200 off on week days
  description: string; // any description with terms and condition
  minValue: number; // minimum order amount should be 300
  offerAmount: number; // 200
  startValidity: Date;
  endValidity: Date;
  promocode: string; // WEEK200
  promoType: string; // USER /ALL / BANK / CARD
  bank: [any];
  bins: [any];
  pincode: string; // offer applicable for specific area
  isActive: boolean; //offer is active or not
}
