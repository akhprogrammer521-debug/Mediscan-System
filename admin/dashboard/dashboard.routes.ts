import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller";

const router = Router();

// GET /admin/dashboard
router.get("/", getDashboardStats);

export default router;
