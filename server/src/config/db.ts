import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User.js";
import { Favourite } from '../models/Favourite.js';
import dotenv from 'dotenv';

dotenv.config();

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
      User,
      Favourite
  ],
  migrations: [],
  subscribers: [],
});
