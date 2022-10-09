import { updateVendorCoverImage } from "./../controllers/VendorController";
import express, { NextFunction, Request, Response } from "express";

import {
  addFood,
  getFoods,
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VendorLogin);
router.use(Authenticate);
router.get("/profile", getVendorProfile);
router.patch("/profile", updateVendorProfile);
router.patch("/coverimage", images, updateVendorCoverImage);
router.patch("/service", updateVendorService);
router.post("/foods", images, addFood);
router.get("/foods", getFoods);
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Hello from Vendor Route" });
});
export { router as VendorRoute };
