"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    node_env: process.env.NODE_ENV,
    db_port_development: process.env.DB_PORT_DEVELOPMENT,
    db_host_development: process.env.DB_HOST_DEVELOPMENT,
    db_username_development: process.env.DB_USERNAME_DEVELOPMENT,
    db_password_development: process.env.DB_PASSWORD_DEVELOPMENT,
    db_databse_development: process.env.DB_DATABASE_DEVELOPMENT,
    kafka_brokers: process.env.KAFKA_BROKERS,
    kafka_client_id: process.env.KAFKA_CLIENT_ID,
    kafka_group_id: process.env.KAFKA_GROUP_ID
};
