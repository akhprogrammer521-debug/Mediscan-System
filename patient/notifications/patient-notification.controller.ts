import { Request, Response } from "express";
import * as service from "./patient-notification.service";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await service.getMyNotifications(userId);
  res.json({ success: true, data });
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await service.markAllAsRead(userId);
  res.json({ success: true });
};

export const unreadCount = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const count = await service.unreadCount(userId);
  res.json({ success: true, data: count });
};
