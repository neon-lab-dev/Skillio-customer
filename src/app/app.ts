import logger from "./utils/logger";
import "./mapper-init";
import "reflect-metadata";
import app from "../server";
import systemConfigStore from "./config/systemConfigStore";
import NotificationProviderFactory from "./providers/NotificationProviderFactory";
import { AppDataSource } from "./db/dataSource";
import config from "./config";
import { initializeSocket } from "./utils/sockets";

const server=initializeSocket(app);

AppDataSource.initialize()
  .then(async () => {
    await systemConfigStore.loadConfigs();
    NotificationProviderFactory.initializeProviders();

    server.listen(config.port, () => {
      logger.info(`Listening at port number ${config.port}`);
      logger.info(`Database connection established successfully at ${config.db_databse_development}`);
      logger.info("socket.io server ready")
    }); 
  })
  .catch((error) => {
    logger.error("Database connection error", error);
  });