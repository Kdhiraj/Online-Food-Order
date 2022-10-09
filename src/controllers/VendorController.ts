import { CreateFoodInput } from "./../dto/Food.dto";
import mongoose from "mongoose";

import {
  EditVendorInput,
  EditVendorService,
  VendorLoginInput,
} from "./../dto/Vendor.dto";
import { NextFunction, Request, Response } from "express";
import { foodService, vendorService } from "../services";
import { asyncHandler } from "../utility";

export const VendorLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInput>req.body;
    const token = await vendorService.vendorLogin(email, password);
    res.json(token);
  }
);

export const getVendorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const vendor = await vendorService.getVendor(user._id);
      return res.json(vendor);
    }
  }
);
export const updateVendorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const { name, address, phone, foodTypes } = <EditVendorInput>req.body;

      const filter = {
        _id: new mongoose.Types.ObjectId(user._id),
      };

      const updateData: EditVendorInput = {
        name,
        address,
        phone,
        foodTypes,
      };
      const option = {
        new: true,
      };

      const vendor = await vendorService.updateVendorData(
        filter,
        updateData,
        option
      );
      res.json(vendor);
    }
  }
);

export const updateVendorCoverImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const vendorId: string = user._id;
      let images: string[] = [];

      const files = req.files as [Express.Multer.File];
      if (files.length > 0) {
        images = files.map((file: Express.Multer.File) => file.originalname);
        const vendor = await vendorService.updateCoverImage(vendorId, images);
        return res.json(vendor);
      }
    }
  }
);

export const updateVendorService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const { serviceAvailable } = <EditVendorService>req.body;

      const filter = {
        _id: new mongoose.Types.ObjectId(user._id),
      };

      const updateData: EditVendorService = {
        serviceAvailable,
      };
      const option = {
        new: true,
      };

      const vendor = await vendorService.updateVendorData(
        filter,
        updateData,
        option
      );
      res.json(vendor);
    }
  }
);
export const addFood = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const vendorId: string = user._id;
      let images: string[] = [];
      const files = req.files as [Express.Multer.File];
      if (files.length > 0) {
        images = files.map((file: Express.Multer.File) => file.originalname);
      }
      const data = <CreateFoodInput>req.body;
      const result = await foodService.addFood(vendorId, data, images);
      res.json(result);
    }
  }
);
export const getFoods = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;
    if (user) {
      const vendorId: string = user._id;
      const result = await foodService.getFoods(vendorId);
      res.json(result);
    }
  }
);
