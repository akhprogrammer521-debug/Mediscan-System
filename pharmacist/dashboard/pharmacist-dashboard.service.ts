import prisma from "../../../config/database";
import { OrderStatus } from "@prisma/client";

export const getDashboard = async (userId: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId },
  });

  if (!pharmacist) {
    throw new Error("Pharmacist not found");
  }

  const pharmacy = await prisma.pharmacy.findUnique({
    where: { pharmacistId: pharmacist.id },
  });

  const [
    pendingOrders,
    completedOrders,
    rejectedOrders,
    stockCount,
    notifications,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        OR: [
          { pharmacistId: pharmacist.id },
          { pharmacistId: null },
        ],
        status: OrderStatus.PENDING,
      },
    }),
    prisma.order.count({
      where: {
        pharmacistId: pharmacist.id,
        status: OrderStatus.COMPLETED,
      },
    }),
    prisma.order.count({
      where: {
        pharmacistId: pharmacist.id,
        status: OrderStatus.REJECTED,
      },
    }),
    prisma.pharmacyStock.count({
      where: { pharmacyId: pharmacy?.id },
    }),
    prisma.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: { equals: null }, toRole: "PHARMACIST" },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);


  return {
    pharmacy,
    stats: {
      pendingOrders,
      completedOrders,
      rejectedOrders,
      stockCount,
    },
    notifications,
  };
};
