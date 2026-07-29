import prisma from "../../config/database";
import { NotificationType, Role } from "@prisma/client";
import { emitToUser } from "../../socket";

type CreateNotificationInput = {
  userId: number;
  toRole?: Role; 
  type: NotificationType;
  title: string;
  message: string;
};

export async function createNotification(input: CreateNotificationInput) {
  const notif = await prisma.notification.create({
    data: {
      userId: input.userId,
      toRole: input.toRole ?? Role.PATIENT,
      type: input.type,
      title: input.title,
      message: input.message,
    },
  });

  // Realtime emit
  emitToUser(input.userId, "notification:new", notif);

  return notif;
}

