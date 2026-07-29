import { Request, Response } from "express";
import * as service from "./pharmacist-dashboard.service";

export const getDashboard = async (req: Request, res: Response) => {
  const data = await service.getDashboard(req.user!.userId);
  res.json({ success: true, data });
};
