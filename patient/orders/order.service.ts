import { Prisma } from "@prisma/client";
import { createNotificationForRole } from "../../../modules/notifications/notifications.service";
import { Role } from "@prisma/client";
import { NotificationType } from "@prisma/client";
import { createNotification } from "../../../common/services/notification.service";
import prisma from "../../../config/database";


export const createOrder = async (
  patientId: number,
  data: {
    pharmacyId: number;
    quantity: number;
    prescriptionImage?: string | null;
    drugId?: number;
    customDrugId?: number;
  }
) => {
  const pharmacyId = Number(data.pharmacyId);
  const quantity = Number(data.quantity);

  if (!Number.isFinite(pharmacyId) || pharmacyId <= 0) {
    throw new Error("معرّف الصيدلية غير صحيح");
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("الكمية غير صحيحة");
  }

  const drugId = data.drugId ? Number(data.drugId) : null;
  const customDrugId = data.customDrugId ? Number(data.customDrugId) : null;

  let resolvedDrugId = drugId;
  let resolvedCustomDrugId = customDrugId;

  if (!resolvedDrugId && !resolvedCustomDrugId && (data as any).drugName) {
    const rawName = String((data as any).drugName).trim();
    const name = rawName.replace(/\s+\d.*$/, "").trim();

    const drug = await prisma.drug.findFirst({
      where: {
        name: { contains: name },
      },
      select: { id: true },
    });

    if (drug) {
      resolvedDrugId = drug.id;
    } else {
      const customDrug = await prisma.customPharmacyDrug.findFirst({
        where: {
          name: { contains: name },
        },
        select: { id: true },
      });

      if (customDrug) {
        resolvedCustomDrugId = customDrug.id;
      }
    }
  }

  if (!resolvedDrugId && !resolvedCustomDrugId) {
    throw new Error("لم يتم تحديد دواء صالح");
  }


  
  const pharmacy = await prisma.pharmacy.findFirst({
    where: { id: pharmacyId, isActive: true },
    select: { id: true },
  });

  if (!pharmacy) {
    throw new Error("الصيدلية غير موجودة أو غير فعالة");
  }

 
  let resolvedDrugName = "";

  if (drugId) {
    const drug = await prisma.drug.findUnique({
      where: { id: drugId },
      select: { name: true, strength: true },
    });

    if (!drug) {
      throw new Error("الدواء غير موجود");
    }

    resolvedDrugName = `${drug.name} ${drug.strength}`.trim();
  }

  if (customDrugId) {
    const customDrug = await prisma.customPharmacyDrug.findUnique({
      where: { id: customDrugId },
      select: { name: true },
    });

    if (!customDrug) {
      throw new Error("الدواء المخصص غير موجود");
    }

    resolvedDrugName = customDrug.name.trim();
  }

  
  const stockWhere: Prisma.PharmacyStockWhereInput = {
    pharmacyId,
    quantity: { gte: quantity },
    ...(resolvedDrugId ? { drugId: resolvedDrugId } : {}),
    ...(resolvedCustomDrugId ? { customDrugId: resolvedCustomDrugId } : {}),

  };

  const stock = await prisma.pharmacyStock.findFirst({
    where: stockWhere,
    select: { id: true },
  });

  if (!stock) {
    throw new Error("الدواء غير متوفر في هذه الصيدلية");
  }

  
  const order = await prisma.order.create({
    data: {
      patientId,
      pharmacyId,
      drugName: resolvedDrugName,
      quantity,
      status: "PENDING",
      prescriptionImage: data.prescriptionImage ?? null,
    },
  });
  const patient = await prisma.patient.findUnique({
  where: { id: patientId },
  include: { user: true },
});

if (!patient) {
  throw new Error("Patient not found");
}


  await createNotification({
  userId: patient.userId,
  title: "تم إنشاء طلب جديد",
  message: "تم إرسال طلبك إلى الصيدلية",
  type: NotificationType.ORDER,
});


await createNotificationForRole({
  toRole: Role.PHARMACIST,
  title: "طلب دواء جديد",
  message: "يوجد طلب جديد بانتظار المراجعة",
  type: NotificationType.ORDER,
});
  return order;
};


export const getMyOrders = async (patientId: number) => {
  return prisma.order.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    include: {
      pharmacy: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  });
};


export const cancelOrder = async (patientId: number, orderId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      patientId,
      status: "PENDING",
    },
  });

  if (!order) {
    throw new Error("لا يمكن إلغاء هذا الطلب");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
};
