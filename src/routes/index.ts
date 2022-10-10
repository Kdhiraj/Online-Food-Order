import express from "express";
import { AdminRoute } from "./AdminRoute";
import { CustomerRoute } from "./CustomerRoute";
import { DeliveryRoute } from "./DeliveryRoute";
import { ShoppingRoute } from "./ShoppingRoute";
import { VendorRoute } from "./VendorRoute";
const router = express.Router();

router.use("/vendor", VendorRoute);
router.use("/admin", AdminRoute);
router.use("/customer", CustomerRoute);
router.use("/delivery", DeliveryRoute);
router.use(ShoppingRoute);

export { router as Routes };
