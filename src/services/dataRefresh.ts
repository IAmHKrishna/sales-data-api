import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { AppDataSource } from "../utils/data-source";
import { Customer } from "../entities/Customer";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";

export const refreshData = async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../../sample.csv");

  const customerRepo = AppDataSource.getRepository(Customer);
  const productRepo = AppDataSource.getRepository(Product);
  const orderRepo = AppDataSource.getRepository(Order);

  try {
    const results: any[] = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", (data) => {
      results.push(data);
    });

    stream.on("end", async () => {
      for (const row of results) {
        const {
          "Order ID": orderId,
          "Product ID": productId,
          "Customer ID": customerId,
          "Product Name": productName,
          Category: category,
          Region: region,
          "Date of Sale": dateOfSale,
          "Quantity Sold": quantitySold,
          "Unit Price": unitPrice,
          Discount: discount,
          "Shipping Cost": shippingCost,
          "Payment Method": paymentMethod,
          "Customer Name": customerName,
          "Customer Email": customerEmail,
          "Customer Address": customerAddress
        } = row;

        let customer = await customerRepo.findOneBy({ customerId });
        if (!customer) {
          customer = customerRepo.create({ customerId, name: customerName, email: customerEmail, address: customerAddress });
          await customerRepo.save(customer);
        }

        let product = await productRepo.findOneBy({ productId });
        if (!product) {
          product = productRepo.create({ productId, name: productName, category });
          await productRepo.save(product);
        }

        const order = orderRepo.create({
          orderId,
          region,
          dateOfSale: new Date(dateOfSale),
          quantitySold: parseInt(quantitySold),
          unitPrice: parseFloat(unitPrice),
          discount: parseFloat(discount),
          shippingCost: parseFloat(shippingCost),
          paymentMethod,
          customer,
          product
        });

        await orderRepo.save(order);
      }

      res.status(200).json({ message: "CSV data refreshed successfully", totalRecords: results.length });
    });

    stream.on("error", (err) => {
      console.error("Stream Error:", err);
      res.status(500).json({ error: "Failed to process CSV file." });
    });

  } catch (error) {
    console.error("Refresh Error:", error);
    res.status(500).json({ error: "Failed to refresh data." });
  }
};