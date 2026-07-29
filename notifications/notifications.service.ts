import prisma from "../../config/database";
import { NotificationType, Role } from "@prisma/client";

export const createNotificationForRole = async ({
  toRole,
  title,
  message,
  type = NotificationType.ORDER,
}: {
  toRole: Role;
  title: string;
  message: string;
  type?: NotificationType;
}) => {
  return prisma.notification.create({
    data: {
      toRole,
      title,
      message,
      type,
      isRead: false,
    },
  });
};

export const getNotificationsForUser = async (userId: number) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markNotificationAsRead = async (
  notificationId: number,
  userId: number
) => {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};

export const getUnreadCountForUser = async (userId: number) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};
