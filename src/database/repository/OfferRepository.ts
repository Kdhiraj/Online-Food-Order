import { CreateOfferInputs } from "../../dto";
import { OfferModel } from "../models";

export class OfferRepository {
  async addOffer(data: CreateOfferInputs) {
    try {
      const offer = await new OfferModel(data).save();
      return offer;
    } catch (error) {
      throw error;
    }
  }

  async findOfferById(offerId: string) {
    try {
      const offer = await OfferModel.findOne({ _id: offerId });
      return offer;
    } catch (error) {
      throw error;
    }
  }
  
  async filterOffer(query: any) {
    try {
      const offer = await OfferModel.find(query);
      return offer;
    } catch (error) {
      throw error;
    }
  }

  async getAllOffers() {
    try {
      const offers = await OfferModel.find().populate({ path: "vendors" });
      return offers;
    } catch (error) {
      throw error;
    }
  }
}
