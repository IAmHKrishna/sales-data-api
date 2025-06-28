import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./Order";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  address!: string;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Order[];
}