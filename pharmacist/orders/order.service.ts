import prisma from "../../../config/database";
import { NotificationType, OrderStatus } from "@prisma/client";
import { createNotification } from "../../../common/services/notification.service";


const getPharmacistByUserIdOrThrow = async (userId: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId },
  });
  if (!pharmacist) throw new Error("Pharmacist not found");
  return pharmacist;
};

export const getOrdersForPharmacist = async (userId: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId },
    include: { pharmacy: true },
  });

  if (!pharmacist || !pharmacist.pharmacy) {
    throw new Error("Pharmacist or pharmacy not found");
  }

  return prisma.order.findMany({
    where: {
      pharmacyId: pharmacist.pharmacy.id,
      OR: [
        { pharmacistId: null },          
        { pharmacistId: pharmacist.id }, 
      ],
    },
    include: {
      patient: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const acceptOrder = async (
  pharmacistUserId: number,
  orderId: number
) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId: pharmacistUserId },
    include: { pharmacy: true },
  });

  if (!pharmacist?.pharmacy) {
    throw new Error("Pharmacy not found");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      pharmacyId: pharmacist.pharmacy.id,
      status: OrderStatus.PENDING,
    },
  });

  if (!order) throw new Error("Order not found");

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.ACCEPTED,
      pharmacistId: pharmacist.id,
    },
  });
};

export const updateOrderStatus = async (
  userId: number,
  orderId: number,
  status: OrderStatus
) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId },
    include: { pharmacy: true },
  });

  if (!pharmacist || !pharmacist.pharmacy) {
    throw new Error("Pharmacist or pharmacy not found");
  }

  // 🔒 جلب الطلب فقط إذا كان من نفس الصيدلية
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      pharmacyId: pharmacist.pharmacy.id,
    },
    include: {
      patient: {
        include: { user: true },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 🔑 ربط الطلب بالصيدلي إن لم يكن مربوطًا
  if (!order.pharmacistId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { pharmacistId: pharmacist.id },
    });
  }
  // 🔒 منع صيدلي آخر
  else if (order.pharmacistId !== pharmacist.id) {
    throw new Error("Order not found");
  }

  // ⛔ لا تعدل طلب غير معلق
  if (order.status !== OrderStatus.PENDING && status === OrderStatus.ACCEPTED) {
    throw new Error("لا يمكن قبول طلب غير معلق");
  }

  // ✅ تحديث الحالة
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // 🔔 إشعار المريض
  if (order.patient?.user) {
    await createNotification({
  userId: order.patient.userId,
  title: "تحديث حالة الطلب",
  message: "تم قبول طلبك من الصيدلية",
  type: NotificationType.ORDER,
});

  }

  return updatedOrder;
};
