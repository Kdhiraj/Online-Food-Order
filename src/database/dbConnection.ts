const mongoose = require("mongoose");
const { MONGO_URI } = require("../config");
import { logger } from "../utility";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Connection to DB successfully");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
