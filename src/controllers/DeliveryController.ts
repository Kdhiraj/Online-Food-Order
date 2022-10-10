import { Request, Response, NextFunction } from "express";
import { deliveryService } from "../services";
import { asyncHandler } from "../utility";
import {
  CreateDeliveryUserInput,
  UserLoginInput,
  EditDeliveryProfileInput,
  EditDeliveryUserService,
} from "../dto";

export const DeliverySignUp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as CreateDeliveryUserInput;
    const deliveryUser = await deliveryService.createDeliveryUser(data);
    return res.status(201).json(deliveryUser);
  }
);
export const DeliveryLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as UserLoginInput;
    const response = await deliveryService.loginDeliveryUser(data);
    res.json(response);
  }
);
export const UpdateDeliveryUserStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deliverUser = req.currentUser;
    const data = req.body as EditDeliveryUserService;
    if (deliverUser) {
      const updatedProfile = await deliveryService.UpdateDeliveryUserStatus(
        deliverUser?._id,
        data
      );
      return res.json(updatedProfile);
    }
  }
);
export const GetDeliveryProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deliverUser = req.currentUser;

    if (deliverUser) {
      const profile = await deliveryService.viewDeliveryUserProfile(
        deliverUser?._id
      );
      return res.json(profile);
    }
  }
);
export const EditDeliveryProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deliverUser = req.currentUser;
    const data = req.body as EditDeliveryProfileInput;
    if (deliverUser) {
      const updatedProfile = await deliveryService.editDeliveryUserProfile(
        deliverUser._id,
        data
      );
      return res.json(updatedProfile);
    }
  }
);
