"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const server_1 = __importDefault(require("../server"));
const systemConfigStore_1 = __importDefault(require("./config/systemConfigStore"));
const NotificationProviderFactory_1 = __importDefault(require("./providers/NotificationProviderFactory"));
const dataSource_1 = require("./db/dataSource");
const config_1 = __importDefault(require("./config"));
const sockets_1 = require("./utils/sockets");
const server = (0, sockets_1.initializeSocket)(server_1.default);
dataSource_1.AppDataSource.initialize()
    .then(async () => {
    await systemConfigStore_1.default.loadConfigs();
    NotificationProviderFactory_1.default.initializeProviders();
    server.listen(config_1.default.port, () => {
        logger_1.default.info(`Listening at port number ${config_1.default.port}`);
        logger_1.default.info(`Database connection established successfully at ${config_1.default.db_databse_development}`);
        logger_1.default.info("socket.io server ready");
    });
})
    .catch((error) => {
    logger_1.default.error("Database connection error", error);
});
