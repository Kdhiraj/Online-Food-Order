import { app } from "./app";
import { PORT } from "./config";
import dbConnection from "./database/dbConnection";
import { logger } from "./utility";

const startServer = async () => {
  dbConnection();
  app
    .listen(PORT, () => {
      logger.info(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      logger.error(err);
      process.exit(1);
    });
};

startServer();
