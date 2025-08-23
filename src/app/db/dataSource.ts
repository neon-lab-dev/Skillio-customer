import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "../config/index";

const isTest = config.node_env === 'test';
const isProduction = config.node_env === 'production';

if(!isTest && !(config.db_port_development || config.db_port_production)) {
    throw new Error('Database port is not loaded from .env.dev');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: isTest ? 'localhost' : (isProduction ? config.db_host_production : config.db_host_development),
  port: isTest ? 5433 : (isProduction ? Number(config.db_port_production) : Number(config.db_port_development)),
  username: isTest ? 'postgres' : (isProduction ? config.db_username_production : config.db_username_development),
  password: isTest ? 'postgres' : (isProduction ? config.db_password_production : config.db_password_development),
  database: isTest ? 'skilio-auth' : (isProduction ? config.db_databse_production : config.db_databse_development),
  synchronize: isTest ? true : false,
  logging: true,
  entities: isProduction ? ['dist/entity/*.js'] : ['src/app/entity/*.ts'],
  migrations: isTest ? ['src/app/test/migration/*.ts'] : (isProduction ? ['src/app/migration/production/*.ts'] : ['src/app/migration/development/*.ts']),
  subscribers: [],
});

