import { BadRequestError, NotFoundError } from "../errors";
import { Password } from "../utility";
import { DeliveryUserRepository } from "./../database";
import {
  CreateDeliveryUserInput,
  EditDeliveryProfileInput,
  EditDeliveryUserService,
  UserLoginInput,
} from "./../dto";

interface NearByDeliveryUser {
  pincode: string;
  verified: boolean;
  isAvailable: boolean;
  lat?: number;
  lng?: number;
}

class DeliveryService {
  private deliveryUserRepository;
  constructor() {
    this.deliveryUserRepository = new DeliveryUserRepository();
  }
  async createDeliveryUser(data: CreateDeliveryUserInput) {
    try {
      const isEmailExist =
        await this.deliveryUserRepository.findDeliveryUserByEmail(data.email);
      if (isEmailExist) {
        throw new BadRequestError("Email ID is alreay exist");
      }
      const result = await this.deliveryUserRepository.createDeliveryUser(data);
      const payload = {
        _id: result._id,
        email: result.email,
        verified: result.verified,
      };

      const token = await Password.GenerateToken(payload);

      return {
        email: result.email,
        verified: result.verified,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  async loginDeliveryUser(data: UserLoginInput) {
    try {
      const { email, password } = data;

      const deliveryUser =
        await this.deliveryUserRepository.findDeliveryUserByEmail(email);
      if (!deliveryUser) {
        throw new BadRequestError("Invalid email ID");
      }
      const isPassowrdMatch = await Password.compare(
        deliveryUser.password,
        password
      );
      if (!isPassowrdMatch) {
        throw new BadRequestError("Incorrect Password");
      }

      const payload = {
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      };
      const token = await Password.GenerateToken(payload);
      return {
        email: deliveryUser.email,
        verified: deliveryUser.verified,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async viewDeliveryUserProfile(deliveryUserId: string) {
    try {
      const deliveryUser =
        await this.deliveryUserRepository.findDeliveryUserById(deliveryUserId);
      if (!deliveryUser) {
        throw new NotFoundError("DeliveryUser not found");
      }
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }
  async editDeliveryUserProfile(
    deliveryUserId: string,
    data: EditDeliveryProfileInput
  ) {
    try {
      const { firstName, lastName, address } = data;
      const deliveryUser = await this.viewDeliveryUserProfile(deliveryUserId);
      deliveryUser.firstName = firstName;
      deliveryUser.lastName = lastName;
      deliveryUser.address = address;
      const updatedProfile = await deliveryUser.save();
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }
  async UpdateDeliveryUserStatus(
    deliveryUserId: string,
    data: EditDeliveryUserService
  ) {
    try {
      const deliveryUser = await this.viewDeliveryUserProfile(deliveryUserId);
      const { lat, lng } = data;
      deliveryUser.isAvailable = !deliveryUser.isAvailable;
      //when service enable by deliveryUser, update his location
      if (lat && lng) {
        deliveryUser.lat = lat;
        deliveryUser.lng = lng;
      }

      await deliveryUser.save();
      return deliveryUser;
    } catch (error) {
      throw error;
    }
  }

  async fetchNearByDeliveryUser(data: NearByDeliveryUser) {
    try {
      const { verified, pincode, isAvailable, lat, lng } = data;
      // TODO fetch nearby delivery user
      const deliveryUser = await this.deliveryUserRepository.filterDeliveryUser(
        { verified, pincode, isAvailable }
      );
      if (deliveryUser.length > 0) {
        return deliveryUser;
      }
      throw new NotFoundError("No DeliveryUser Found");
    } catch (error) {
      throw error;
    }
  }
  async getDeliveryUsers() {
    try {
      const deliveryUsers =
        await this.deliveryUserRepository.filterDeliveryUser({});
      if (deliveryUsers.length > 0) {
        return deliveryUsers;
      }
      throw new NotFoundError("No DeliveryUser Found");
    } catch (error) {
      throw error;
    }
  }
}

export const deliveryService = new DeliveryService();
