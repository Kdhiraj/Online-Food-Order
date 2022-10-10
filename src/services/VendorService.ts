import { EditVendorInput, EditVendorService } from "./../dto";
import { OfferRepository, VendorDoc, VendorRepository } from "../database";
import {
  CreateOfferInputs,
  CreateVendorInput,
  ProcessOrderInputs,
  VendorPayload,
} from "../dto";
import { BadRequestError, NotFoundError } from "../errors";
import { Password } from "../utility";
import { orderService } from "./OrderService";

class VendorService {
  private repository;
  private offerRepository;
  constructor() {
    this.repository = new VendorRepository();
    this.offerRepository = new OfferRepository();
  }

  async createVendor(data: CreateVendorInput) {
    try {
      const {
        name,
        ownerName,
        foodTypes,
        pincode,
        address,
        phone,
        email,
        password,
      } = data;

      const vendorData = {
        name,
        ownerName,
        foodTypes,
        pincode,
        address,
        phone,
        email,
        password,
      } as VendorDoc;

      const existingVendor = await this.repository.findVendorByEmail(email);
      if (existingVendor) {
        throw new BadRequestError("A vandor already exist with this email ID");
      }
      const vendor = await this.repository.createVendor(vendorData);
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  async vendorLogin(email: string, password: string) {
    try {
      const existingUser = await this.repository.findVendorByEmail(email);
      if (!existingUser) {
        throw new BadRequestError("Invalid Email ID");
      }
      const isPasswordMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!isPasswordMatch) {
        throw new BadRequestError("Invalid Password");
      }
      const payload = <VendorPayload>{
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      };
      const token = await Password.GenerateToken(payload);
      return token;
    } catch (error) {
      throw error;
    }
  }

  async updateService(vendorId: string, data: EditVendorService) {
    try {
      const vendor = await this.repository.findVendorById(vendorId);
      const { lat, lng } = data;
      if (!vendor) {
        throw new BadRequestError("Vendor doesn't exist");
      }
      vendor.serviceAvailable = !vendor.serviceAvailable;

      if (lat && lng) {
        vendor.lat = lat;
        vendor.lng = lng;
      }
      //when service enable by vendor update his location
      await vendor.save();
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(vendorId: string, data: EditVendorInput) {
    try {
      const vendor = await this.repository.findVendorById(vendorId);
      const { name, address, phone, foodTypes } = data;
      if (!vendor) {
        throw new BadRequestError("Vendor doesn't exist");
      }
      vendor.name = name;
      vendor.address = address;
      vendor.phone = phone;
      vendor.foodTypes = foodTypes;
      await vendor.save();
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  async updateCoverImage(vendorId: string, images: string[]) {
    try {
      const vendor = await this.repository.findVendorById(vendorId);
      if (!vendor) {
        throw new BadRequestError("Vendor doesn't exist");
      }
      vendor.coverImages?.push(...images);
      const saveResult = await vendor.save();
      return saveResult;
    } catch (error) {
      throw error;
    }
  }

  async viewVendor(vendorId: string) {
    try {
      const vendor = await this.repository.findVendorById(vendorId);
      if (!vendor) {
        throw new BadRequestError("Vendor doesn't exist");
      }
      return vendor;
    } catch (error) {
      throw error;
    }
  }

  async getAllVendors(page: number, size: number) {
    try {
      const limit = size;
      const skip = page * size;
      const vendors = await this.repository.getAllVendors(skip, limit);
      return vendors;
    } catch (error) {
      throw error;
    }
  }

  /*------------------------- Offer Service ----------------------- */
  async addOffer(vendorId: string, offerData: CreateOfferInputs) {
    try {
      const vendor = await this.viewVendor(vendorId);
      if (vendor) {
        offerData.vendors = [vendor];
        const data = await this.offerRepository.addOffer(offerData);
        return data;
      }
    } catch (error) {
      throw error;
    }
  }
  async getCurrentOffers(vendorId: string) {
    try {
      const vendor = await this.viewVendor(vendorId);
      let currentOffers = Array();
      if (vendor) {
        const offers = await this.offerRepository.getAllOffers();

        if (offers.length > 0) {
          offers.map((item) => {
            if (item.vendors) {
              item.vendors.map((vendor) => {
                if (vendor._id.toString() === vendorId) {
                  currentOffers.push(item);
                }
              });
            }

            if (item.offerType === "GENERIC") {
              currentOffers.push(item);
            }
          });
        }
      }
      return currentOffers;
    } catch (error) {
      throw error;
    }
  }

  async updateOfferDetails(
    vendorId: string,
    offerId: string,
    data: CreateOfferInputs
  ) {
    try {
      const vendor = await this.viewVendor(vendorId);

      const {
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promoType,
        startValidity,
        endValidity,
        bank,
        isActive,
        minValue,
      } = data;
      if (vendor) {
        const currentOffer = await this.offerRepository.findOfferById(offerId);
        if (currentOffer) {
          currentOffer.title = title;
          currentOffer.description = description;
          currentOffer.offerType = offerType;
          currentOffer.offerAmount = offerAmount;
          currentOffer.pincode = pincode;
          currentOffer.promoType = promoType;
          currentOffer.startValidity = startValidity;
          currentOffer.endValidity = endValidity;
          currentOffer.bank = bank;
          currentOffer.isActive = isActive;
          currentOffer.minValue = minValue;

          const result = await currentOffer.save();
          return result;
        } else {
          throw new NotFoundError("Offer not found");
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /*------------------------------------Order Section ------------------------ */
  async processCurrentOrder(orderId: string, data: ProcessOrderInputs) {
    try {
      const { status, remarks, time } = data as ProcessOrderInputs; //ACCEPT, REJECT, FAILED, UNDER_PROCESS;
      const order = await orderService.getOrderDetails(orderId);

      order.orderStatus = status;
      order.remarks = remarks;
      if (time) {
        order.readyTime = time;
      }
      const orderResult = await order.save();
      return orderResult;
    } catch (error) {
      throw error;
    }
  }
}

export const vendorService = new VendorService();
