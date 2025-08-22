"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const index_1 = __importDefault(require("../config/index"));
const isTest = index_1.default.node_env === 'test';
const isProduction = index_1.default.node_env === 'production';
if (!isTest && !(index_1.default.db_port_development || index_1.default.db_port_production)) {
    throw new Error('Database port is not loaded from .env.dev');
}
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: isTest ? 'localhost' : (isProduction ? index_1.default.db_host_production : index_1.default.db_host_development),
    port: isTest ? 5433 : (isProduction ? Number(index_1.default.db_port_production) : Number(index_1.default.db_port_development)),
    username: isTest ? 'postgres' : (isProduction ? index_1.default.db_username_production : index_1.default.db_username_development),
    password: isTest ? 'postgres' : (isProduction ? index_1.default.db_password_production : index_1.default.db_password_development),
    database: isTest ? 'skilio-auth' : (isProduction ? index_1.default.db_databse_production : index_1.default.db_databse_development),
    synchronize: isTest ? true : false,
    logging: true,
    entities: isProduction ? ['dist/entity/*.js'] : ['src/app/entity/*.ts'],
    migrations: isTest ? ['src/app/test/migration/*.ts'] : (isProduction ? ['src/app/migration/production/*.ts'] : ['src/app/migration/development/*.ts']),
    subscribers: [],
});
