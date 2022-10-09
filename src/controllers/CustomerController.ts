import { NextFunction, Request, Response } from "express";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import { customerService } from "../services";
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
