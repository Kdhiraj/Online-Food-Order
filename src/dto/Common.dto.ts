import {
  OrderStatusForCustomer,
  OrderStatusForVendor,
  OrderStatusForDelivery,
} from "./Vendor.dto";
export interface Pagination {
  page: number;
  size: number;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export type OrderStatus =
  | OrderStatusForCustomer
  | OrderStatusForVendor
  | OrderStatusForDelivery;
