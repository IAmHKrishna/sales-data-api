import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @OneToMany(() => Order, (order) => order.product)
  orders!: Order[];
}