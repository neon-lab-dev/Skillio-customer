"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const index_1 = __importDefault(require("../config/index"));
const isProduction = process.env.NODE_ENV === 'production';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: index_1.default.db_host_development,
    port: Number(index_1.default.db_port_development),
    username: index_1.default.db_username_development,
    password: index_1.default.db_password_development,
    database: index_1.default.db_databse_development,
    ssl: isProduction && { rejectUnauthorized: false },
    synchronize: true,
    logging: true,
    entities: isProduction ? ['dist/app/entity/*.js'] : ['src/app/entity/*.ts'],
    migrations: isProduction ? ['dist/migration/development/*.js'] : ['src/app/migration/development/*.ts'],
    subscribers: [],
});
