export interface CreateDeliveryUserInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  pincode: string;
}


export interface EditDeliveryUserService {
  lat?: number;
  lng?: number;
}


export interface EditDeliveryProfileInput {
  firstName: string;
  lastName: string;
  address: string;
}