import {
  CustomerDoc,
  CustomerRepository,
  OfferRepository,
  TransactionRepository,
} from "../database";
import { GenerateOtp, onRequestOTP, Password } from "../utility";
import {
  CartItem,
  CreateCustomerInput,
  CustomerPayload,
  EditCustomerProfileInput,
  UserLoginInput,
  CreatePaymentInput,
} from "../dto";
import { NotFoundError, BadRequestError } from "../errors";
import { foodService } from "./FoodService";
import { txnService } from "./TransactionService";

class CustomerService {
  private customerRepository;
  private offerRepository;
  constructor() {
    this.customerRepository = new CustomerRepository();
    this.offerRepository = new OfferRepository();
  }

  async customerSignup(data: CreateCustomerInput) {
    try {
      const { email, phone, password } = data;
      const isEmailExist = await this.customerRepository.findCustomerByEmail(
        email
      );
      if (isEmailExist) {
        throw new BadRequestError(
          "A customer already exist with this email ID"
        );
      }
      const { otp, expiry } = await GenerateOtp();
      const customerData = {
        email,
        password,
        phone,
        otp,
        otp_expiry: expiry,
      } as CustomerDoc;

      const customer = await this.customerRepository.addCustomer(customerData);

      if (customer) {
        // send OTP to customer

        // await onRequestOTP(otp, phone);

        //Generate the Token
        const payload = {
          _id: <string>customer._id,
          email: customer.email,
          verified: customer.verified,
        } as CustomerPayload;

        const token = await Password.GenerateToken(payload);

        // Send the result
        const response = {
          token,
          verified: customer.verified,
          email: customer.email,
          otp,
        };
        return response;
      } else {
        throw new BadRequestError("Unable to add customer");
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyCustomer(customerId: string, otp: number) {
    try {
      const profile = await this.customerRepository.findCustomerById(
        customerId
      );
      if (profile) {
        if (profile.otp === otp && profile.otp_expiry >= new Date()) {
          profile.verified = true;
          const updatedCustomerResponse = await profile.save();
          //Generate the Token

          const payload = {
            _id: updatedCustomerResponse._id,
            email: updatedCustomerResponse.email,
            verified: updatedCustomerResponse.verified,
          } as CustomerPayload;

          const token = await Password.GenerateToken(payload);
          return {
            token,
            email: updatedCustomerResponse.email,
            verified: updatedCustomerResponse.verified,
          };
        } else {
          throw new BadRequestError("Otp is wrong or expired!");
        }
      } else {
        throw new NotFoundError("Customer not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async customerLogin(data: UserLoginInput) {
    try {
      const { email, password } = data;
      const customer = await this.customerRepository.findCustomerByEmail(email);
      if (!customer) {
        throw new BadRequestError("Invalid email ID");
      }
      const passwordMatch = await Password.compare(customer.password, password);
      if (!passwordMatch) {
        throw new BadRequestError("Incorrect password");
      }
      const payload = {
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      } as CustomerPayload;

      const token = await Password.GenerateToken(payload);

      return { token, email: customer.email, verified: customer.verified };
    } catch (error) {
      throw error;
    }
  }

  async resendOTP(customerId: string) {
    try {
      const customer = await this.customerRepository.findCustomerById(
        customerId
      );
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }
      const { otp, expiry } = await GenerateOtp();
      customer.otp = otp;
      customer.otp_expiry = expiry;
      await customer.save();
      //send OTP to customer mobile
      // await onRequestOTP(otp, customer.phone);
      return {
        otp,
      };
    } catch (error) {
      throw error;
    }
  }

  async customerProfile(customerId: string) {
    try {
      const customer = await this.customerRepository.findCustomerById(
        customerId
      );
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }
      return customer;
    } catch (error) {
      throw error;
    }
  }

  async editProfile(customerId: string, data: EditCustomerProfileInput) {
    try {
      const { firstName, lastName, address } = data;
      const customer = await this.customerRepository.findCustomerById(
        customerId
      );
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }
      customer.firstName = firstName;
      customer.lastName = lastName;
      customer.address = address;
      const updatedCustomerResponse = await customer.save();

      return updatedCustomerResponse;
    } catch (error) {
      throw error;
    }
  }

  async myOrders(customerId: string) {
    try {
      const customer = await this.customerRepository.findCustomerById(
        customerId
      );
      if (!customer) {
        throw new NotFoundError("Customer not found");
      }
      const orders = await this.customerRepository.customerOrders(customer._id);
      return orders;
    } catch (error) {
      throw error;
    }
  }

  /*-----------------Cart Service ------------------------- */

  async addToCart(data: CartItem, customerId: string) {
    try {
      const { _id, unit } = data;
      let cartItems = Array();
      const customer = await this.customerProfile(customerId);
      const food = await foodService.foodDetails(_id);
      if (food) {
        if (customer) {
          //check for cart items
          cartItems = customer.cart!;

          if (cartItems.length > 0) {
            // check and update unit
            let existFoodItems = cartItems.filter(
              (item) => item.food._id.toString() === _id
            );
            if (existFoodItems.length > 0) {
              const index = cartItems.indexOf(existFoodItems[0]);

              if (unit > 0) {
                // At index add cart item
                cartItems[index] = { food, unit };
              } else {
                // At index remove cart item
                cartItems.splice(index, 1);
              }
            } else {
              cartItems.push({ food, unit });
            }
          } else {
            // add item to cart
            cartItems.push({ food, unit });
          }
          if (cartItems) {
            customer.cart = cartItems as any;
            const cartResult = await customer.save();
            return cartResult.cart;
          }
        }
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async cartItems(customerId: string) {
    try {
      const customer = await this.customerProfile(customerId);
      const cartItems = await this.customerRepository.cartItems(customer._id);
      return cartItems;
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(customerId: string) {
    try {
      const customer = await this.customerProfile(customerId);
      const cartItems = await this.customerRepository.cartItems(customer._id);
      if (cartItems.length === 0) {
        throw new BadRequestError("Cart is already Empty");
      } else {
        customer.cart = [] as any;
        const cartResult = await customer.save();
        return cartResult;
      }
    } catch (error) {
      throw error;
    }
  }
  /* ---------------------------- Offer ------------------------*/

  async verifyOffer(offerId: string, customerId: string) {
    try {
      const customer = await this.customerProfile(customerId);
      const appliedOffer = await this.offerRepository.findOfferById(offerId);
      if (!appliedOffer) {
        throw new BadRequestError("Offer in not valid");
      } else {
        return appliedOffer;
      }
    } catch (error) {
      throw error;
    }
  }
  /* ---------------------------- Payment ------------------------*/

  async payment(customerId: string, data: CreatePaymentInput) {
    try {
      const { amount, paymentMode, offerId } = data;
      let payableAmount = Number(amount);

      const customer = await this.customerProfile(customerId);

      if (offerId) {
        const appliedOffer = await this.offerRepository.findOfferById(offerId);
        if (!appliedOffer) {
          throw new BadRequestError("Offer in not valid");
        }
        if (appliedOffer.isActive) {
          payableAmount = payableAmount - appliedOffer.offerAmount;
        }
      }
      // perform payment gateway charge api
      
      // create record on transaction
      const txnInput = {
        customer: customer._id,
        vendorId: "",
        orderId: "",
        orderValue: payableAmount,
        offerUsed: offerId || "NA",
        status: "OPEN", //OPEN /FAILED / SUCCESS come from payment gateway
        paymentMode: paymentMode,
        paymentResponse: "Payment is cash on Delivery",
      };
      const transaction = await txnService.createTransaction(txnInput);
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}

export const customerService = new CustomerService();
