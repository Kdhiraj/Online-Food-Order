import { pagination } from "./../middlewares";
import express, { NextFunction, Request, Response } from "express";
import { createVendors, GetDeliveryUsers, GetTransactionById, GetTransactions, getVendorById, getVendors, VerifyDeliveryUser } from "../controllers";

const router = express.Router();
/* ----------------Vendors --------------*/

router.post("/vendors", createVendors);
router.get("/vendors", pagination, getVendors);
router.get("/vendors/:id", getVendorById);


/*--------------- Transactions ------------------*/
router.get('/transactions', GetTransactions)
router.get('/transactions/:id', GetTransactionById)

/*----------------- Delivery -------------------------*/
router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/users', GetDeliveryUsers);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Hello from Admin Route" });
});
export { router as AdminRoute };
