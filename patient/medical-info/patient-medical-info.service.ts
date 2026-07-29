import prisma from "../../../config/database";
import { Gender } from "@prisma/client";

const getPatientByUserId = async (userId: number) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) throw new Error("Patient not found");
  return patient;
};

export const getMyMedicalInfo = async (userId: number) => {
  const patient = await getPatientByUserId(userId);

  return prisma.medicalInfo.findUnique({
    where: { patientId: patient.id },
  });
};

export const upsertMyMedicalInfo = async (userId: number, data: any) => {
  const patient = await getPatientByUserId(userId);

  if (!Object.values(Gender).includes(data.gender)) {
    throw new Error("Invalid gender");
  }

  if (!data.birthDate || !data.height || !data.weight) {
    throw new Error("Missing required medical fields");
  }

  return prisma.medicalInfo.upsert({
    where: { patientId: patient.id },
    update: {
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      currentMedications: data.currentMedications ?? null,
      chronicMedications: data.chronicMedications ?? null,
      chronicDiseases: data.chronicDiseases ?? null,
      allergies: data.allergies ?? null,
    },
    create: {
      patientId: patient.id,
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      currentMedications: data.currentMedications ?? null,
      chronicMedications: data.chronicMedications ?? null,
      chronicDiseases: data.chronicDiseases ?? null,
      allergies: data.allergies ?? null,
    },
  });
};


