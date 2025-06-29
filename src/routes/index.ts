import { Router } from "express";
import { refreshData } from "../services/dataRefresh";
import { getRevenue,getRevenueByProduct,getRevenueByCategory,getRevenueByRegion,getTopProductsOverall,
    getTopProductsByCategory,getTopProductsByRegion,getTotalCustomers,getTotalOrders,getAverageOrderValue } from "../services/analytics";

export const router = Router();

router.post("/refresh", refreshData);
router.get("/revenue", getRevenue);
router.get("/revenue/by-product", getRevenueByProduct);
router.get("/revenue/by-category", getRevenueByCategory);
router.get("/revenue/by-region", getRevenueByRegion);
// top N Products:
router.get("/top-products/overall", getTopProductsOverall);
router.get("/top-products/by-category", getTopProductsByCategory);
router.get("/top-products/by-region", getTopProductsByRegion);
// Customer Analysis:
router.get("/customers/total", getTotalCustomers);
router.get("/orders/total", getTotalOrders);
router.get("/orders/average-value", getAverageOrderValue);








