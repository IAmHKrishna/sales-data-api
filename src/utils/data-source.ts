import "reflect-metadata";
import { DataSource } from "typeorm";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { Customer } from "../entities/Customer";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "sales_db",
  synchronize: true,
  logging: false,
  entities: [Order, Product, Customer],
  migrations: [],
  subscribers: [],
});