import { Router } from "express";
import { refreshData } from "../services/dataRefresh";
import { getRevenue,getRevenueByProduct } from "../services/analytics";

export const router = Router();

router.post("/refresh", refreshData);
router.get("/revenue", getRevenue);
router.get("/revenue/by-product", getRevenueByProduct);


