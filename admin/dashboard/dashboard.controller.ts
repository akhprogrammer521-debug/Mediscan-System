import { Request, Response } from "express";
import { getStats } from "./dashboard.service";

export const getDashboardStats = async (_req: Request, res: Response) => {
  const stats = await getStats();
  return res.json({
    success: true,
    data: stats,
  });
};
  