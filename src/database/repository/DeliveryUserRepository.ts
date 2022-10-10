import { CreateDeliveryUserInput } from "../../dto";
import { DeliveryUser } from "../models";

export class DeliveryUserRepository {
  async createDeliveryUser(data: CreateDeliveryUserInput) {
    try {
      const deliveryUser = new DeliveryUser(data).save();
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }
  async findDeliveryUserById(id: string) {
    try {
      const deliveryUser = await DeliveryUser.findOne({ _id: id });
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }
  async findDeliveryUserByEmail(email: string) {
    try {
      const deliveryUser = await DeliveryUser.findOne({ email });
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }
  async filterDeliveryUser(query: any) {
    try {
      const deliveryUser = await DeliveryUser.find(query);
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }
}
