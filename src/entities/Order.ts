import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: string;

  @Column()
  region!: string;

  @Column()
  dateOfSale!: Date;

  @Column("int")
  quantitySold!: number;

  @Column("decimal")
  unitPrice!: number;

  @Column("decimal")
  discount!: number;

  @Column("decimal")
  shippingCost!: number;

  @Column()
  paymentMethod!: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer!: Customer;

  @ManyToOne(() => Product, (product) => product.orders)
  product!: Product;
}