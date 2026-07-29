import { Request, Response } from "express";
import * as service from "./patient-settings.service";

export const getSettings = async (req: Request, res: Response) => {
  const userId = req.user!.id; 
  const data = await service.getSettings(userId);
  res.json({ success: true, data });
};

export const updateSettings = async (req: Request, res: Response) => {
  const userId = req.user!.id; 
  const { settings } = req.body;

  if (!Array.isArray(settings)) {
    return res.status(400).json({
      success: false,
      error: "settings must be an array",
    });
  }

  await service.updateSettings(userId, settings);

  res.json({ success: true });
};
