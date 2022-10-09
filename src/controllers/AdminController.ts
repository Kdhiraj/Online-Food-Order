import { CreateVendorInput } from "../dto/Vendor.dto";
import { Request, Response, NextFunction } from "express";
import { vendorService } from "../services";
import { asyncHandler } from "../utility";
import { Pagination } from "../dto";



export const createVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = <CreateVendorInput>req.body;
    const vendor = await vendorService.createVendor(data);
    res.json(vendor);
  }
);

export const getVendors = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, size } = req.pagination as Pagination;
    const vendors = await vendorService.getAllVendors(page, size);
    const response = {
      page,
      size,
      totalPage: Math.ceil(vendors.length / size),
      content: vendors,
    };
    res.json(response);
  }
);

export const getVendorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;
    const vendor = await vendorService.getVendor(vendorId);
    res.json(vendor);
  }
);
