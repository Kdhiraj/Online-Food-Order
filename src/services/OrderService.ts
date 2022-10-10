import { OrderStatusForCustomer } from "./../dto/Vendor.dto";
import {
  FoodModel,
  OrderDoc,
  OrderRepository,
  TransactionRepository,
} from "../database";
import { CartItem, OrderInputs, OrderStatus } from "../dto";
import { BadRequestError, NotFoundError } from "../errors";
import { generateRandomId } from "../utility";
import { customerService } from "./CustomerService";
import { txnService } from "./TransactionService";
import { vendorService } from "./VendorService";
import { deliveryService } from "./DeliveryService";

class OrderService {
  private orderRepository;
  private transactionRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.transactionRepository = new TransactionRepository();
  }

  /* ------------------- Delivery Notification --------------------- */

  async assignOrderForDelivery(orderId: string, vendorId: string) {
    // find the vendor
    const vendor = await vendorService.viewVendor(vendorId);
    if (vendor) {
      const areaCode = vendor.pincode;
      const vendorLat = vendor.lat;
      const vendorLng = vendor.lng;

      //find the nearest available Delivery person from vendor location
      const deliveryUser = {
        pincode: areaCode,
        verified: true,
        isAvailable: true,
        lat: vendorLat,
        lng: vendorLng,
      };
      const deliveryPerson = await deliveryService.fetchNearByDeliveryUser(
        deliveryUser
      );

      if (deliveryPerson) {
        // Check the nearest delivery person and assign the order

        const currentOrder = await this.getOrderDetails(orderId);
        if (currentOrder) {
          //update Delivery ID
          currentOrder.deliveryId = deliveryPerson[0]._id;
          await currentOrder.save();

          //Notify to vendor for received new order firebase push notification
        }
      }
    }
  }
  /* -----------------Order Service --------------------- */
  async placeOrder(data: OrderInputs, customerId: string) {
    try {
      const { txnId, amount, items } = data;
      const { status, currentTransaction } =
        await txnService.validateTransaction(txnId);
      if (!status) {
        throw new BadRequestError("Error while creating order");
      }

      const customer = await customerService.customerProfile(customerId);

      const orderId = generateRandomId();
      //Grab order items from request [{id: x, unit: xx}]
      const carts: [CartItem] = items;
      const foods = await FoodModel.find()
        .where("_id")
        .in(carts.map((item) => item._id))
        .exec();
      //Calculate order amount
      let cartItems = Array();
      let netAmount = 0.0;
      let vendorId: any;

      foods.map((food) => {
        carts.map(({ _id, unit }) => {
          if (food._id == _id) {
            vendorId = food.vendorId;
            netAmount += food.price * unit;
            cartItems.push({ food, unit });
          }
        });
      });

      if (cartItems) {
        //Create Order with Item description
        const orderData = {
          orderId: orderId,
          vendorId: vendorId,
          items: cartItems,
          totalAmount: netAmount,
          paidAmount: amount,
          orderDate: new Date(),
          orderStatus: OrderStatusForCustomer.WAITING,
          readyTime: 45,
        };
        const currentOrder = await this.orderRepository.addOrder(orderData);
        // Finally update order to user account
        customer.cart = [] as any;
        customer.orders?.push(currentOrder);

        if (currentTransaction) {
          currentTransaction.vendorId = vendorId;
          currentTransaction.orderId = orderId;
          currentTransaction.status = "CONFIRMED";
          await currentTransaction.save();
        }

        await this.assignOrderForDelivery(currentOrder._id, vendorId);
        await customer.save();
        return currentOrder;
      }
    } catch (error) {
      throw error;
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const order = await this.orderRepository.getOrderById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  async vendorOrders(vendorId: string) {
    try {
      const orders = await this.orderRepository.vendorOrders(vendorId);
      if (orders.length > 0) {
        return orders;
      }
      throw new NotFoundError("No Order Found");
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
