import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "../config/index";

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db_host_development,
  port: Number(config.db_port_development),
  username: config.db_username_development,
  password: config.db_password_development,
  database: config.db_databse_development,
  ssl: isProduction &&{ rejectUnauthorized: false },
  synchronize: true,
  logging: true,
  entities: isProduction ? ['dist/app/entity/*.js']: ['src/app/entity/*.ts'],
  migrations: isProduction? ['dist/migration/development/*.js']: ['src/app/migration/development/*.ts'],
  subscribers: [],
});