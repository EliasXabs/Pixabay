import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1402",
  database: process.env.DB_NAME || "pixabay",
  synchronize: true,
  logging: false,
  entities: [

  ],
  migrations: [],
  subscribers: [],
});
