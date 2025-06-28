import { Request, Response } from "express";
import { AppDataSource } from "../utils/data-source";
import { Order } from "../entities/Order";
import { Between } from "typeorm";

export const getRevenue = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const orders = await orderRepo.find({
      where: {
        dateOfSale: Between(new Date(startDate as string), new Date(endDate as string))
      }
    });

    const totalRevenue = orders.reduce((sum, order) => {
      const priceAfterDiscount = Number(order.unitPrice) * (1 - Number(order.discount));
      return sum + priceAfterDiscount * order.quantitySold + Number(order.shippingCost);
    }, 0);

    res.json({ totalRevenue });
  } catch (error) {
    console.error("Revenue Error:", error);
    res.status(500).json({ error: "Failed to calculate revenue." });
  }
};


export const getRevenueByProduct = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const revenueMap: Record<string, { productId: string; productName: string; totalRevenue: number }> = {};

    for (const order of orders) {
      const revenue = (Number(order.unitPrice) * (1 - Number(order.discount)) * order.quantitySold) + Number(order.shippingCost);
      const key = order.product.productId;

      if (!revenueMap[key]) {
        revenueMap[key] = {
          productId: order.product.productId,
          productName: order.product.name,
          totalRevenue: 0,
        };
      }

      revenueMap[key].totalRevenue += revenue;
    }

    const result = Object.values(revenueMap);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating revenue by product:", error);
    res.status(500).json({ error: "Failed to calculate revenue by product." });
  }
};