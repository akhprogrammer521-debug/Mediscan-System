import { Request, Response } from "express";
import * as service from "./admin-profile.service";

export const getAdminProfile = async (req: Request, res: Response) => {
  const data = await service.getAdminProfile(req.user!.userId);
  res.json({ success: true, data });
};
