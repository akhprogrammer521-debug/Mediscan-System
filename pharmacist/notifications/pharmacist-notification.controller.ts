import { Request, Response } from "express";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  getUnreadCountForUser,
} from "../../../modules/notifications/notifications.service";
import { ok } from "../../../common/utils/apiResponse";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const items = await getNotificationsForUser(userId);
  return ok(res, items);
};

export const markAsRead = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const notificationId = Number(req.params.id);

  await markNotificationAsRead(userId, notificationId);
  return ok(res, true);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const count = await getUnreadCountForUser(userId);
  return ok(res, count);
};
