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


export const getRevenueByCategory = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const revenueMap: Record<string, number> = {};

    for (const order of orders) {
      const revenue =
        (Number(order.unitPrice) * (1 - Number(order.discount)) * order.quantitySold) +
        Number(order.shippingCost);

      const category = order.product.category;

      revenueMap[category] = (revenueMap[category] || 0) + revenue;
    }

    const result = Object.entries(revenueMap).map(([category, totalRevenue]) => ({
      category,
      totalRevenue: Number(totalRevenue.toFixed(4)),
    }));

    console.log(result, "result");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating revenue by category:", error);
    res.status(500).json({ error: "Failed to calculate revenue by category" });
  }
};


export const getRevenueByRegion = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const revenueMap: Record<string, number> = {};

    for (const order of orders) {
      const revenue =
        (Number(order.unitPrice) * (1 - Number(order.discount)) * order.quantitySold) +
        Number(order.shippingCost);

      const region = order.region;

      revenueMap[region] = (revenueMap[region] || 0) + revenue;
    }

    const result = Object.entries(revenueMap).map(([region, totalRevenue]) => ({
      region,
      totalRevenue: Number(totalRevenue.toFixed(4)),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating revenue by region:", error);
    res.status(500).json({ error: "Failed to calculate revenue by region" });
  }
};


export const getTopProductsOverall = async (req: Request, res: Response) => {
  const { startDate, endDate, limit = 5 } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const productMap: Record<string, { productName: string; quantity: number }> = {};

    for (const order of orders) {
      const pid = order.product.productId;
      if (!productMap[pid]) {
        productMap[pid] = { productName: order.product.name, quantity: 0 };
      }
      productMap[pid].quantity += order.quantitySold;
    }

    const sorted = Object.entries(productMap)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, Number(limit));

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Top products error:", error);
    res.status(500).json({ error: "Failed to calculate top products" });
  }
};


export const getTopProductsByCategory = async (req: Request, res: Response) => {
  const { startDate, endDate, category, limit = 5 } = req.query;

  if (!startDate || !endDate || !category) {
    return res.status(400).json({ error: "startDate, endDate and category are required" });
  }

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", { start: startDate, end: endDate })
      .andWhere("product.category = :category", { category })
      .getMany();

    const productMap: Record<string, { productName: string; quantity: number }> = {};

    for (const order of orders) {
      const pid = order.product.productId;
      if (!productMap[pid]) {
        productMap[pid] = { productName: order.product.name, quantity: 0 };
      }
      productMap[pid].quantity += order.quantitySold;
    }

    const sorted = Object.entries(productMap)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, Number(limit));

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Top by category error:", error);
    res.status(500).json({ error: "Failed to calculate top products by category" });
  }
};


export const getTopProductsByRegion = async (req: Request, res: Response) => {
  const { startDate, endDate, region, limit = 5 } = req.query;

  if (!startDate || !endDate || !region) {
    return res.status(400).json({ error: "startDate, endDate and region are required" });
  }

  try {
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.product", "product")
      .where("order.dateOfSale BETWEEN :start AND :end", { start: startDate, end: endDate })
      .andWhere("order.region = :region", { region })
      .getMany();

    const productMap: Record<string, { productName: string; quantity: number }> = {};

    for (const order of orders) {
      const pid = order.product.productId;
      if (!productMap[pid]) {
        productMap[pid] = { productName: order.product.name, quantity: 0 };
      }
      productMap[pid].quantity += order.quantitySold;
    }

    const sorted = Object.entries(productMap)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, Number(limit));

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Top by region error:", error);
    res.status(500).json({ error: "Failed to calculate top products by region" });
  }
};



