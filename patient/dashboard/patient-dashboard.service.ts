import prisma from "../../../config/database";
import { OrderStatus, MedicationStatus } from "@prisma/client";

export const getDashboard = async (userId: number) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeMedications,
    currentOrders,
    todayDoses,
    notifications,
  ] = await Promise.all([
    prisma.patientMedication.count({
      where: {
        patientId: patient.id,
        status: MedicationStatus.ACTIVE,
      },
    }),

    prisma.order.count({
      where: {
        patientId: patient.id,
        status: { in: [OrderStatus.PENDING, OrderStatus.ACCEPTED] },
      },
    }),

    prisma.medicationDoseLog.count({
      where: {
        patientId: patient.id,
        date: today,
      },
    }),

    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    stats: {
      activeMedications,
      currentOrders,
      todayDoses,
      notificationsCount: notifications.length,
    },
    notifications,
  };
};
