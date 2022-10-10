import { updateVendorCoverImage } from "./../controllers/VendorController";
import express, { NextFunction, Request, Response } from "express";

import {
  addFood,
  getFoods,
  GetCurrentOrders,
  getVendorProfile,
  updateVendorProfile,
  updateVendorService,
  VendorLogin,
  GetOrderDetails,
  ProcessOrder,
  AddOffer,
  GetOffers,
  EditOffer

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


/* --------------------- Orders ------------------- */
router.get('/orders', GetCurrentOrders);
router.put('/orders/:id/process', ProcessOrder);
router.get('/orders/:id', GetOrderDetails)
 

/*----------------------- Offers ------------------- */
router.get('/offers', GetOffers);
router.post('/offers', AddOffer);
router.put('/offers/:id', EditOffer)



export { router as VendorRoute };
