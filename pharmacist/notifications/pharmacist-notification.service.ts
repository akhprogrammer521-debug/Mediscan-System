import prisma from "../../../config/database";
import { Role } from "@prisma/client";

export const getNotificationsForUser = async (userId: number) => {
  return prisma.notification.findMany({
    where: {
      OR: [
        { userId },
        { userId: null, toRole: Role.PHARMACIST }, 
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

export const markNotificationAsRead = async (
  userId: number,
  notificationId: number
) => {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      OR: [
        { userId },
        { userId: null, toRole: Role.PHARMACIST },
      ],
    },
    data: {
      isRead: true,
    },
  });
};


export const getUnreadCountForUser = async (userId: number) => {
  return prisma.notification.count({
    where: {
      isRead: false,
      OR: [
        { userId },
        { userId: null, toRole: Role.PHARMACIST },
      ],
    },
  });
};
