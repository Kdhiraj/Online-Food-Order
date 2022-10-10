import { FoodDoc, OfferRepository, VendorRepository } from "../database";
import { BadRequestError } from "../errors";

class ShoppingService {
  private repository;
  private offerRepository;
  constructor() {
    this.repository = new VendorRepository();
    this.offerRepository = new OfferRepository();
  }

  async vendorAvailablInArea(pincode: string) {
    try {
      const filterCriteria = {
        pincode: pincode,
        serviceAvailable: true,
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
        serviceAvailable: true,
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
        serviceAvailable: true,
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
        serviceAvailable: true,
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

  /*-------------------- Offer ----------------------- */
  async offersAvailableInArea(pincode: string) {
    try {
      const query = {
        pincode,
      };
      const offers = await this.offerRepository.filterOffer(query);
      return offers;
    } catch (error) {
      throw error;
    }
  }
}

export const shoppingService = new ShoppingService();
