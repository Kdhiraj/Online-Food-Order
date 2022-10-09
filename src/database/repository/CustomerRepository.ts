import { CustomerDoc, CustomerModel } from "../models";

export class CustomerRepository {
  async addCustomer(data: CustomerDoc) {
    try {
      const cusotmer = new CustomerModel(data);
      await cusotmer.save();
      return cusotmer;
    } catch (error) {
      throw error;
    }
  }
  async findCustomerById(customerId: string) {
    try {
      const cusotmer = await CustomerModel.findOne({ _id: customerId });
      return cusotmer;
    } catch (error) {
      throw error;
    }
  }
  async findCustomerByEmail(email: string) {
    try {
      const cusotmer = await CustomerModel.findOne({ email });
      return cusotmer;
    } catch (error) {
      throw error;
    }
  }
}
