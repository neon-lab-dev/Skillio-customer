import "reflect-metadata"
import { DataSource } from "typeorm"
import config from "../config/index";


export const AppDataSource = new DataSource({
  type: 'postgres',
  host:  config.db_host_development,
  port:  Number(config.db_port_development),
  username:  config.db_username_development,
  password: config.db_password_development,
  database:  config.db_databse_development,
  synchronize: true,
  logging: true,
  entities: [
    'src/app/entity/*.ts',
    'src/app/modules/entity/*.ts'
  ],
  migrations: ['src/app/migration/development/*.ts'],
  subscribers: [],
});

