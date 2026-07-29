import { Request, Response } from "express";
import * as dashboardService from "./patient-dashboard.service";
import { ok } from "../../../common/utils/apiResponse";

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await dashboardService.getDashboard(userId);
  return ok(res, data);
};
