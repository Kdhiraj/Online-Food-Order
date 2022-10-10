import { FoodRepository, VendorRepository } from "../database";
import { CreateFoodInput } from "../dto";
import { BadRequestError } from "../errors";

class FoodService {
  private vendorRepository;
  private foodRepository;

  constructor() {
    this.vendorRepository = new VendorRepository();
    this.foodRepository = new FoodRepository();
  }

  async addFood(
    vendorId: string,
    foodInput: CreateFoodInput,
    images: string[]
  ) {
    try {
      const vendor = await this.vendorRepository.findVendorById(vendorId);
      if (!vendor) {
        throw new BadRequestError("Vendor not found");
      }
      const { name, description, category, foodType, readyTime, price } =
        foodInput;

      const foodData: any = {
        vendorId: vendor._id,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        rating: 0,
        images: images,
      };
      const food = await this.foodRepository.addFood(foodData);
      vendor.foods.push(food);
      const result = await vendor.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getFoods(vendorId: string) {
    try {
      const vendor = await this.vendorRepository.findVendorById(vendorId);
      if (!vendor) {
        throw new BadRequestError("Vendor not found");
      }
      const foods = this.foodRepository.getFoods(vendor._id);
      return foods;
    } catch (error) {
      throw error;
    }
  }
  
  async foodDetails(foodId: string) {
    try {
      const food = await this.foodRepository.findFoodById(foodId);
      if (!food) {
        throw new BadRequestError("Food not found");
      }

      return food;
    } catch (error) {
      throw error;
    }
  }
}

export const foodService = new FoodService();
