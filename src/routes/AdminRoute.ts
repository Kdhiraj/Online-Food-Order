import { pagination } from "./../middlewares";
import express, { NextFunction, Request, Response } from "express";
import { createVendors, getVendorById, getVendors } from "../controllers";

const router = express.Router();

router.post("/vendors", createVendors);
router.get("/vendors", pagination, getVendors);
router.get("/vendors/:id", getVendorById);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Hello from Admin Route" });
});
export { router as AdminRoute };
