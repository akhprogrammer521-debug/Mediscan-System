import prisma from "../../../config/database"
import { Role } from "@prisma/client"

export const getNotificationsForRole = (role: Role) => {
  return prisma.notification.findMany({
    where: { toRole: role },
    orderBy: { createdAt: "desc" },
  })
}

export const markAsRead = (id: number) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  })
}
