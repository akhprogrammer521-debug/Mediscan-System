import prisma from "../../../config/database";
import { randomBytes } from "crypto"
import { hashPassword } from "../../../common/utils/password";
import { Role } from "@prisma/client";

export const createPharmacy = async (data: any) => {
  if (!data.email) {
    throw new Error("Email is required for pharmacist user");
  }

  if (!data.username || !data.password) {
    throw new Error("Username and password are required");
  }

  if (!data.name) {
    throw new Error("Pharmacy name is required");
  }

  return prisma.$transaction(async (tx) => {
   
    const user = await tx.user.create({
      data: {

        username: data.username,
        email: data.email,
        password: await hashPassword(data.password),
        role: Role.PHARMACIST,
      },
    });

    
    const pharmacist = await tx.pharmacist.create({
      data: {
        userId: user.id,
      },
    });


      
    
    const pharmacy = await tx.pharmacy.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude ??null,
        longitude: data.longitude ?? null,
        licenseNumber: data.licenseNumber,

        ...(data.licenseIssuedAt && {
      licenseIssuedAt: new Date(data.licenseIssuedAt),
    }),

    ...(data.licenseExpiresAt && {
      licenseExpiresAt: new Date(data.licenseExpiresAt),
    }),

       
        pharmacist: {
          connect: { id: pharmacist.id },
        },
      },
    });

    return pharmacy;
  });
};


export const getAllPharmacies = async () => {
  return prisma.pharmacy.findMany({
    
    include: {
      pharmacist: {
        include: {
          user: true,
        },
      },
    },
  });
};


export const getPharmacyById = async (id: number) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id },
    include: {
      pharmacist: {
        include: { user: true },
      },
    },
  });

  if (!pharmacy) {
    throw new Error("Pharmacy not found");
  }

  return pharmacy;
};


export const updatePharmacy = async (id: number, data: any) => {
  await getPharmacyById(id);

  const updateData: any = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.latitude !== undefined) updateData.latitude = data.latitude;
  if (data.longitude !== undefined) updateData.longitude = data.longitude;
  if (data.licenseNumber !== undefined)
    updateData.licenseNumber = data.licenseNumber;

  if (data.licenseIssuedAt) {
    updateData.licenseIssuedAt = new Date(data.licenseIssuedAt);
  }

  if (data.licenseExpiresAt) {
    updateData.licenseExpiresAt = new Date(data.licenseExpiresAt);
  }

  return prisma.pharmacy.update({
    where: { id },
    data: updateData,
  });
};


export const deletePharmacy = async (id: number) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id },
    include: {
      pharmacist: {
        include: { user: true },
      },
    },
  });

  if (!pharmacy) throw new Error("Pharmacy not found");

  return prisma.$transaction(async (tx) => {
    
    await tx.pharmacy.update({
      where: { id },
      data: { isActive: false },
    });

    
    await tx.user.update({
      where: { id: pharmacy.pharmacist.userId },
      data: { isActive: false },
    });

    return { success: true };
  });
};


export const togglePharmacyStatus = async (
  pharmacyId: number,
  isActive: boolean
) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: pharmacyId },
    include: {
      pharmacist: { include: { user: true } },
    },
  });

  if (!pharmacy) throw new Error("Pharmacy not found");

  return prisma.$transaction(async (tx) => {
    await tx.pharmacy.update({
      where: { id: pharmacyId },
      data: { isActive },
    });

    await tx.user.update({
      where: { id: pharmacy.pharmacist.userId },
      data: { isActive },
    });

    return { success: true };
  });
};


export const resetPharmacyPassword = async (pharmacyId: number) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: pharmacyId },
    include: {
      pharmacist: {
        include: { user: true },
      },
    },
  })

  if (!pharmacy) {
    throw new Error("Pharmacy not found")
  }

  
  const newPassword = randomBytes(6).toString("base64")

  const hashed = await hashPassword(newPassword)

  await prisma.user.update({
    where: { id: pharmacy.pharmacist.user.id },
    data: { password: hashed },
  })

  return {
    username: pharmacy.pharmacist.user.username,
    password: newPassword,
  }
}

