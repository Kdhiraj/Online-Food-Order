import { VendorDoc, VendorModel } from "../models";

export class VendorRepository {
  async createVendor(data: VendorDoc) {
    try {
      const vendor = new VendorModel(data);
      await vendor.save();
      return vendor;
    } catch (error) {
      throw error;
    }
  }
  async findVendorById(id: string) {
    try {
      const vendor = await VendorModel.findOne({ _id: id }).populate({
        path: "foods",
      });
      return vendor;
    } catch (error) {
      throw error;
    }
  }
  async findVendorByEmail(email: string) {
    try {
      const vendor = await VendorModel.findOne({ email }).populate({
        path: "foods",
      });
      return vendor;
    } catch (error) {
      throw error;
    }
  }
  async getAllVendors(skip: number, limit: number) {
    try {
      const vendor = await VendorModel.find({})
        .populate({ path: "foods" })
        .skip(skip)
        .limit(limit);
      return vendor;
    } catch (error) {
      throw error;
    }
  }
 
  async getVendorFoods(query: any, orderBy?: any, limit?: number) {
    try {
      let foods = VendorModel.find(query).populate({ path: "foods" });
      if (orderBy) {
        foods.sort(orderBy);
      }
      if (limit) {
        foods.limit(limit);
      }
      const result = await foods;
      return result;
    } catch (error) {
      throw error;
    }
  }
}
