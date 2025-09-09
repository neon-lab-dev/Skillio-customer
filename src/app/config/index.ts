import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  node_env: process.env.NODE_ENV,
  db_port_development: process.env.DB_PORT_DEVELOPMENT,
  db_host_development: process.env.DB_HOST_DEVELOPMENT,
  db_username_development: process.env.DB_USERNAME_DEVELOPMENT,
  db_password_development: process.env.DB_PASSWORD_DEVELOPMENT,
  db_databse_development: process.env.DB_DATABASE_DEVELOPMENT
};
