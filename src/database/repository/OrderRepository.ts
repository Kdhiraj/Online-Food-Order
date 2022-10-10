import { OrderModel } from "../models";

export class OrderRepository {
  async addOrder(orderData: any) {
    try {
      const order = new OrderModel(orderData);
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await OrderModel.findOne({ _id: orderId }).populate(
        "items.food"
      );
      return order;
    } catch (error) {
      throw error;
    }
  }
  
  async vendorOrders(vendorId: string) {
    try {
      const order = await OrderModel.find({ vendorId: vendorId })
        .sort({ createdAt: -1 })
        .populate("items.food");
      return order;
    } catch (error) {
      throw error;
    }
  }
}
