import { FoodDoc, VendorDoc, VendorRepository } from "../database";
import { CreateVendorInput, VendorPayload } from "../dto";
import { BadRequestError } from "../errors";
import { Password } from "../utility";

class VendorService {
  private repository;
  constructor() {
    this.repository = new VendorRepository();
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

  async getVendor(vendorId: string) {
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

  async updateVendorData(filter: any, updateData: any, option: any) {
    try {
      const query: any = {
        filter,
        updateData,
        option,
      };
      const vendor = await this.repository.updateVendor(query);
      if (!vendor) {
        throw new BadRequestError("Vendor doesn't exist");
      }
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

  async vendorAvailablInArea(pincode: string) {
    try {
      const filterCriteria = {
        pincode: pincode,
        serviceAvailable: false,
      };

      const orderBy = {
        rating: -1,
      };

      const foods = await this.repository.getVendorFoods(
        filterCriteria,
        orderBy
      );
      return foods;
    } catch (error) {
      throw error;
    }
  }

  async topVendorsInArea(pincode: string) {
    try {
      const filterCriteria = {
        pincode: pincode,
        serviceAvailable: false,
      };

      const orderBy = {
        rating: -1,
      };
      const limit = 10;

      const foods = await this.repository.getVendorFoods(
        filterCriteria,
        orderBy,
        limit
      );
      return foods;
    } catch (error) {
      throw error;
    }
  }

  async foodAvailableIn30Min(pincode: string) {
    try {
      const filterCriteria = {
        pincode: pincode,
        serviceAvailable: false,
      };
      const orderBy = {
        rating: -1,
      };
      const result = await this.repository.getVendorFoods(
        filterCriteria,
        orderBy
      );
      let foodResult: any = [];
      if (result.length > 0) {
        result.map((vendor) => {
          const foods = vendor.foods as [FoodDoc];
          foodResult.push(...foods.filter((food) => food.readyTime <= 30));
        });
      }
      return foodResult;
    } catch (error) {
      throw error;
    }
  }

  async searchFoodsInArea(pincode: string) {
    try {
      const filterCriteria = {
        pincode: pincode,
        serviceAvailable: false,
      };
      const orderBy = {
        rating: -1,
      };

      const result = await this.repository.getVendorFoods(
        filterCriteria,
        orderBy
      );
      let foodResult: any = [];
      if (result.length > 0) {
        result.map((item) => foodResult.push(...item.foods));
      }
      return foodResult;
    } catch (error) {
      throw error;
    }
  }
}

export const vendorService = new VendorService();
