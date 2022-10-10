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
  async customerOrders(customerId: string) {
    try {
      const cusotmer = await CustomerModel.findOne({
        _id: customerId,
      }).populate({
        path: "orders",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "items.food",
          model: "Food",
        },
      });
      return cusotmer?.orders;
    } catch (error) {
      throw error;
    }
  }

  async cartItems(customerId: string) {
    try {
      const cusotmer = await CustomerModel.findOne({
        _id: customerId,
      }).populate({
        path: "cart.food",
      });

      return cusotmer?.cart || [];
    } catch (error) {
      throw error;
    }
  }
}
