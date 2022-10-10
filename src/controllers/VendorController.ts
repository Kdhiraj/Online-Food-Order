import { CreateOfferInputs } from "./../dto/Vendor.dto";
import { NextFunction, Request, Response } from "express";
import { foodService, orderService, vendorService } from "../services";
import { asyncHandler } from "../utility";
import {
  EditVendorInput,
  EditVendorService,
  ProcessOrderInputs,
  VendorLoginInput,
  CreateFoodInput,
} from "./../dto";

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
      const vendor = await vendorService.viewVendor(user._id);
      return res.json(vendor);
    }
  }
);
export const updateVendorProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.currentUser;
    if (vendor) {
      const data = <EditVendorInput>req.body;
      const vendorProfile = await vendorService.updateProfile(vendor._id, data);
      res.json(vendorProfile);
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
    const vendor = req.currentUser;
    if (vendor) {
      const data = req.body as EditVendorService;
      const updatedResponse = await vendorService.updateService(
        vendor._id,
        data
      );
      res.json(updatedResponse);
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

/* ----------------------------- Orders ------------------------------ */

export const GetCurrentOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.currentUser;

    if (vendor) {
      const orders = await orderService.vendorOrders(vendor._id);
      return res.json(orders);
    }
  }
);

export const GetOrderDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    if (orderId) {
      const order = await orderService.getOrderDetails(orderId);
      res.json(order);
    }
  }
);

export const ProcessOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const data = req.body as ProcessOrderInputs;
    if (orderId && data) {
      const result = await vendorService.processCurrentOrder(orderId, data);
      return res.json(result);
    }
    res.json({ message: "Unable to process order" });
  }
);

/* --------------------   Offer Section ----------------------- */

export const GetOffers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.currentUser;
    if (vendor) {
      const currentOffers = await vendorService.getCurrentOffers(vendor._id);
      return res.json(currentOffers);
    }
  }
);

export const AddOffer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.currentUser;
    const offerData = req.body as CreateOfferInputs;
    if (vendor) {
      const offer = await vendorService.addOffer(vendor._id, offerData);
      return res.json(offer);
    }
  }
);

export const EditOffer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.currentUser;
    const offerId = req.params.id;
    const data = req.body as CreateOfferInputs;
    if (vendor) {
      const updatedOffer = await vendorService.updateOfferDetails(
        vendor._id,
        offerId,
        data
      );
      res.json(updatedOffer);
    }
  }
);
