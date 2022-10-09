import { NextFunction, Request, Response } from "express";
import { vendorService } from "../services";
import { asyncHandler } from "../utility";

export const GetFoodAvailability = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    const foods = await vendorService.vendorAvailablInArea(pincode);
    if (foods.length > 0) {
      return res.status(200).json(foods);
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  }
);
export const GetTopRestaurants = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    const foods = await vendorService.topVendorsInArea(pincode);
    if (foods.length > 0) {
      return res.status(200).json(foods);
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  }
);

export const GetFoodsIn30Min = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    const foods = await vendorService.foodAvailableIn30Min(pincode);
    if (foods.length > 0) {
      return res.status(200).json(foods);
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  }
);

export const RestaurantById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await vendorService.getVendor(id);

    if (result) {
      return res.status(200).json(result);
    }

    return res.status(404).json({ msg: "Data Not found!" });
  }
);

export const SearchFoods = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;
    const foods = await vendorService.searchFoodsInArea(pincode);
    if (foods.length > 0) {
      return res.status(200).json(foods);
    }
    return res.status(404).json({ msg: "Data Not found!" });
  }
);
export const GetAvailableOffers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
