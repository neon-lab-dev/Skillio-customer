import logger from "./utils/logger";
import "./mapper-init";
import "reflect-metadata";
import app from "../server";
import systemConfigStore from "./config/systemConfigStore";
import NotificationProviderFactory from "./providers/NotificationProviderFactory";
import { AppDataSource } from "./db/dataSource";
import config from "./config";
import { initializeSocket } from "./utils/sockets";
import { Producer } from "./kafka/producer/producer";
import { Consumer } from "./kafka/consumer/consumer";
import { Cron } from "./modules/planAggregator/cron/cron";

const server=initializeSocket(app);

const prodcuer= new Producer()
const consumer= new Consumer()
const cron:Cron = new Cron();

AppDataSource.initialize()
  .then(async () => {
    await systemConfigStore.loadConfigs();
    NotificationProviderFactory.initializeProviders();

    await consumer.loadConsumers()
    await prodcuer.connect()

    await cron.planAggregatorCron();


    server.listen(config.port, () => {
      logger.info(`Listening at port number ${config.port}`);
      logger.info(`Database connection established successfully at ${config.db_databse_development}`);
      logger.info("socket.io server ready")
    });
  })
  .catch((error) => {
    logger.error(" connection error", error);
  });