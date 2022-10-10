import { NextFunction, Request, Response } from "express";
import {
  CartItem,
  CreateCustomerInput,
  CreatePaymentInput,
  EditCustomerProfileInput,
  OrderInputs,
  UserLoginInput,
} from "../dto";
import { customerService, orderService } from "../services";
import { asyncHandler } from "../utility";

export const CustomerSignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as CreateCustomerInput;
    const response = await customerService.customerSignup(data);
    return res.status(201).json(response);
  }
);
export const CustomerVerify = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.currentUser;
    if (customer) {
      const response = await customerService.verifyCustomer(customer._id, otp);
      return res.status(200).json(response);
    }
  }
);
export const RequestOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const otp = await customerService.resendOTP(customer._id);

      return res.json({
        message: "OTP sent to your registered Mobile Number!",
        otp,
      });
    }
  }
);
export const CustomerLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as UserLoginInput;
    const response = await customerService.customerLogin(data);
    res.json(response);
  }
);

export const GetCustomerProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const result = await customerService.customerProfile(customer._id);
      return res.json(result);
    }
  }
);

export const EditCustomerProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const data = req.body as EditCustomerProfileInput;
      const response = await customerService.editProfile(customer?._id, data);
      return res.json(response);
    }
  }
);
/* ------------------- Cart Section --------------------- */
export const AddToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    const data = req.body as CartItem;
    if (customer) {
      const cartResult = await customerService.addToCart(data, customer._id);
      return res.json(cartResult);
    }
  }
);

export const GetCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const cartResult = await customerService.cartItems(customer._id);
      return res.json(cartResult);
    }
  }
);

export const DeleteCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const cartResult = await customerService.removeFromCart(customer._id);
      return res.json(cartResult);
    }
  }
);

/* ------------------- Order Section --------------------- */
export const CreateOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    const data = req.body as OrderInputs;
    if (customer) {
      const orders = await orderService.placeOrder(data, customer._id);
      return res.status(201).json(orders);
    }
  }
);

export const GetOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    if (customer) {
      const orders = await customerService.myOrders(customer._id);
      res.json(orders);
    }
  }
);

export const GetOrderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    if (orderId) {
      const orderDetail = await orderService.getOrderDetails(orderId);
      return res.json(orderDetail);
    }
  }
);

/*---------------------- Offer Section ------------------------*/

export const VerifyOffer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const offerId = req.params.id;
    const customer = req.currentUser;

    if (customer) {
      const appliedOffer = await customerService.verifyOffer(
        offerId,
        customer._id
      );
      if (appliedOffer) {
        return res.json({ message: "Offer is valid", offer: appliedOffer });
      }
    }
  }
);

/*----------------------- Payment -------------------------*/

export const CreatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.currentUser;
    const data = req.body as CreatePaymentInput;
    data;

    if (customer) {
      const transaction = await customerService.payment(customer._id, data);
      return res.json(transaction);
    }
  }
);
