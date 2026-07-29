import prisma from "../../../config/database";
import { Role } from "@prisma/client";

export const getMyNotifications = async (userId: number) => {
  return prisma.notification.findMany({
    where: {
  userId,
  OR: [
    { toRole: Role.PATIENT },
    { toRole: null },
  ],
},
orderBy:{
  createdAt:"desc"
}
  });
};

export const markAllAsRead = async (userId: number) => {
  return prisma.notification.updateMany({
   where: {
  userId,
  isRead: false,
  OR: [
    { toRole: Role.PATIENT },
    { toRole: null },
  ],
   },

    data: { isRead: true },
  });
};

export const unreadCount = async (userId: number) => {
  return prisma.notification.count({
    where: {
  userId,
  isRead: false,
  OR: [
    { toRole: Role.PATIENT },
    { toRole: null },
  ],
}

  });
};
