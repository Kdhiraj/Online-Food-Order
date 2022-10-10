import { CreateVendorInput } from "../dto/Vendor.dto";
import { Request, Response, NextFunction } from "express";
import { vendorService, txnService, deliveryService } from "../services";
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
    const vendor = await vendorService.viewVendor(vendorId);
    res.json(vendor);
  }
);
/* -------------------------------- Transaction -------------------------*/
export const GetTransactions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await txnService.getAllTransaction();
    res.json(transactions);
  }
);

export const GetTransactionById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const txnId = req.params.id;
    if (txnId) {
      const transaction = await txnService.viewTransactionDetails(txnId);
      res.json(transaction);
    }
  }
);

/* -------------------------------Delivery User ------------------------*/

export const VerifyDeliveryUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id, status } = req.body;

    if (_id) {
      const profile = await deliveryService.viewDeliveryUserProfile(_id);

      if (profile) {
        profile.verified = status;
        const result = await profile.save();

        return res.status(200).json(result);
      }
    }

    return res.json({ message: "Unable to verify Delivery User" });
  }
);

export const GetDeliveryUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUsers = await deliveryService.getDeliveryUsers();
    res.json(deliveryUsers);
  }
);
