import * as service from "./notification.service"
import { Request, Response } from "express"

export const getAdminNotifications = async (_req: Request, res: Response) => {
  const data = await service.getNotificationsForRole("ADMIN")
  res.json({ success: true, data })
}

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const data = await service.markAsRead(Number(req.params.id))
  res.json({ success: true, data })
}



