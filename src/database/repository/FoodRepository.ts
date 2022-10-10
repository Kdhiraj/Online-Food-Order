import { FoodDoc, FoodModel } from "../models";

export class FoodRepository {
  async addFood(data: FoodDoc) {
    try {
      const food = new FoodModel(data);
      await food.save();
      return food;
    } catch (error) {
      throw error;
    }
  }
  async getFoods(vendorId: string) {
    try {
      const foods = await FoodModel.find({ vendorId });
      return foods;
    } catch (error) {
      throw error;
    }
  }
  async findFoodById(foodId: string) {
    try {
      const food = await FoodModel.findOne({ _id: foodId });
      return food;
    } catch (error) {
      throw error;
    }
  }
}
