import prisma from "../../config/database";
import { OrderStatus } from "@prisma/client";

const getPharmacistByUserIdOrThrow = async (userId: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { userId },
    include: { pharmacy: true },
  });

  if (!pharmacist) throw new Error("Pharmacist not found");
  if (!pharmacist.pharmacy) throw new Error("Pharmacy not found");

  return pharmacist;
};


export const getMyProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      isActive: true,

      pharmacist: {
        select: {
          id: true,
          pharmacy: {
            select: {
              id: true,
              name: true,
              isActive: true,
              phone: true,
              address: true,
              licenseNumber: true,
              licenseExpiresAt: true,
            },
          },
        },
      },
    },
  })
}

export const updateMyProfile = async (
  userId: number,
  data: {
    username?: string
    email?: string
    pharmacyName?: string
    phone?: string
    address?: string
  }
) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId)

  await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      email: data.email,
    },
  })

  if (pharmacist.pharmacy) {
    await prisma.pharmacy.update({
      where: { id: pharmacist.pharmacy.id },
      data: {
        name: data.pharmacyName,
        phone: data.phone,
        address: data.address,
      },
    })
  }

  
  const profile = await getMyProfile(userId)

  if (!profile) {
    throw new Error('Profile not found after update')
  }

  return profile

}


export const getMyStock = async (userId: number) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId);

  return prisma.pharmacyStock.findMany({
    where: { pharmacyId: pharmacist.pharmacy!.id },
    include: { drug: true , customDrug: true },
  });
};

export const addDrugToStock = async (
  userId: number,
  data: {
    drugId?: number
    customDrug?: {
      name: string
      strength?: string
      price: number
      notes?: string
    }
    quantity: number
  }
) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId)

  if (!data.drugId && !data.customDrug) {
    throw new Error("يجب اختيار دواء أو إنشاء دواء مخصص")
  }

  if (data.drugId && data.customDrug) {
    throw new Error("لا يمكن اختيار دواء عام ومخصص معًا")
  }

  if (data.drugId) {
    return prisma.pharmacyStock.create({
      data: {
        pharmacyId: pharmacist.pharmacy!.id,
        drugId: data.drugId,
        quantity: data.quantity,
        price: data.customDrug?.price ?? 0,
      },
    })
  }

  const customDrug = await prisma.customPharmacyDrug.create({
    data: {
      pharmacyId: pharmacist.pharmacy!.id,
      name: data.customDrug!.name,
      strength: data.customDrug!.strength,
      price: data.customDrug!.price,
      notes: data.customDrug!.notes,
    },
  })

  return prisma.pharmacyStock.create({
    data: {
      pharmacyId: pharmacist.pharmacy!.id,
      customDrugId: customDrug.id,
      quantity: data.quantity,
      price: customDrug.price,
    },
  })
}


export const updateStock = async (
  userId: number,
  stockId: number,
  data: {
    quantity: number
    price: number
  }
) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId)

  const stock = await prisma.pharmacyStock.findUnique({
    where: { id: stockId },
  })

  if (!stock || stock.pharmacyId !== pharmacist.pharmacy!.id) {
    return null
  }

  return prisma.pharmacyStock.update({
    where: { id: stockId },
    data: {
      quantity: data.quantity,
      price: data.price,
    },
    include: {
      drug: true,
      customDrug: true,
    },
  })
}

export const removeFromStock = async (userId: number, stockId: number) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId)

  const stock = await prisma.pharmacyStock.findUnique({
    where: { id: stockId },
  })

  if (!stock || stock.pharmacyId !== pharmacist.pharmacy!.id) {
    return null
  }

  if (stock.customDrugId) {
    await prisma.customPharmacyDrug.delete({
      where: { id: stock.customDrugId },
    })
  }

  return prisma.pharmacyStock.delete({
    where: { id: stockId },
  })
}

export const getMyOrders = async (userId: number) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId);

  return prisma.order.findMany({
    where: {
      OR: [
        { pharmacistId: pharmacist.id },
        { pharmacistId: null },
      ],
    },
    include: { patient: true },
    orderBy: { createdAt: "desc" },
  });
};

export const updateOrderStatus = async (
  userId: number,
  orderId: number,
  status: OrderStatus
) => {
  const pharmacist = await getPharmacistByUserIdOrThrow(userId);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.pharmacistId !== pharmacist.id) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      pharmacistId: pharmacist.id,
    },
  });
};
