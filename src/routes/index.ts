import { Router } from "express";
import { refreshData } from "../services/dataRefresh";
import { getRevenue,getRevenueByProduct,getRevenueByCategory,getRevenueByRegion } from "../services/analytics";

export const router = Router();

router.post("/refresh", refreshData);
router.get("/revenue", getRevenue);
router.get("/revenue/by-product", getRevenueByProduct);
router.get("/revenue/by-category", getRevenueByCategory);
router.get("/revenue/by-region", getRevenueByRegion);




