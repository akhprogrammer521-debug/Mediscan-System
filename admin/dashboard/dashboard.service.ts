import prisma from "../../../config/database";
import { OrderStatus } from "@prisma/client";

export const getStats = async () => {
  const [
    patientsCount,
    activePatientsCount,
    inactivePatientsCount,
    pharmaciesCount,
    activePharmaciesCount,
    inactivePharmaciesCount,
    pharmacistsCount,
    drugsCount,
    ordersTotal,
    pendingOrders,
    acceptedOrders,
    rejectedOrders,
    completedOrders,
    cancelledOrders,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({
      where: { user: { isActive: true } }
    }),
    prisma.patient.count({
      where: { user: { isActive: false } }
    }),
    prisma.pharmacy.count(),
    prisma.pharmacy.count({
      where: { isActive: true },
    }),
    prisma.pharmacy.count({
      where: { isActive: false },
    }),
    prisma.pharmacist.count(),
    prisma.drug.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.ACCEPTED } }),
    prisma.order.count({ where: { status: OrderStatus.REJECTED } }),
    prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
  ]);

  return {
    counts: {
      patients: patientsCount,
      activePatients: activePatientsCount,
      inactivePatients: inactivePatientsCount,
      pharmacists: pharmacistsCount,
      pharmacies: pharmaciesCount,
      activePharmacies: activePharmaciesCount,
      inactivePharmacies: inactivePharmaciesCount,
      drugs: drugsCount,
      orders: {
        total: ordersTotal,
        pending: pendingOrders,
        accepted: acceptedOrders,
        rejected: rejectedOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
    },
  };
};
