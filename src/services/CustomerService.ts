import { BadRequestError } from "./../errors/bad-request-error";
import { CustomerDoc, CustomerRepository } from "../database";
import { GenerateOtp, onRequestOTP, Password } from "../utility";
import {
  CreateCustomerInput,
  CustomerPayload,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import { NotFoundError } from "../errors";

class CustomerService {
  private customerRepository;
  constructor() {
    this.customerRepository = new CustomerRepository();
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
}

export const customerService = new CustomerService();
