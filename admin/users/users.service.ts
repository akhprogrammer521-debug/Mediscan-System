import prisma from "../../../config/database";
import { Role } from "@prisma/client";


export const getAllPatients = async (search?: string) => {
  return prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { user: { username: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: {
      user: true,
      medicalInfo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }); 
};


export const getPatientById = async (id: number) => {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: { user: true, medicalInfo: true },
  });

  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const togglePatientStatus = async (patientId: number) => {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: { user: true },
  });

  if (!patient) throw new Error("Patient not found");

  return prisma.user.update({
    where: { id: patient.userId },
    data: { isActive: !patient.user.isActive },
  });
};


export const getAllPharmacists = async () => {
  return prisma.pharmacist.findMany({
    include: {
      user: true,
      pharmacy: true,
    },
  });
};

export const getPharmacistById = async (id: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { id },
    include: {
      user: true,
      pharmacy: true,
    },
  });

  if (!pharmacist) throw new Error("Pharmacist not found");
  return pharmacist;
};

export const togglePharmacistStatus = async (pharmacistId: number) => {
  const pharmacist = await prisma.pharmacist.findUnique({
    where: { id: pharmacistId },
    include: { user: true },
  });

  if (!pharmacist) throw new Error("Pharmacist not found");

  return prisma.user.update({
    where: { id: pharmacist.userId },
    data: { isActive: !pharmacist.user.isActive },
  });
};
