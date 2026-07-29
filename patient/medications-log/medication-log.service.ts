import prisma from "../../../config/database";
import { createNotification } from "../../../common/services/notification.service";
import { NotificationType } from "@prisma/client";

const getPatientByUserId = async (userId?: number) => {
  if (!userId) {
    throw new Error("Unauthorized: userId missing");
  }

  const patient = await prisma.patient.findUnique({
    where: { userId },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }
  

  return patient;
};

const normalizeDate = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const markDoseAsTaken = async (
  userId: number,
  scheduleId: number
) => {
  const patient = await getPatientByUserId(userId);

  const schedule = await prisma.medicationSchedule.findFirst({
    where: {
      id: scheduleId,
      patientMedication: {
        patientId: patient.id,
      },
    },
    include: {
      patientMedication: true,
    },
  });

  if (!schedule) throw new Error("Schedule not found");

  const today = normalizeDate();

  const existingLog = await prisma.medicationLog.findFirst({
    where: {
      scheduleId,
      date: today,
    },
  });

  if (existingLog) {
    return existingLog;
  }

  const log = await prisma.medicationLog.create({
    data: {
      patientMedicationId: schedule.patientMedicationId,
      scheduleId,
      date: today,
      takenAt: new Date(),
    },
  });

  await createNotification({
    userId: patient.userId,
    title: "تم تسجيل الجرعة",
    message: `تم تسجيل تناول دواء ${schedule.patientMedication.name}`,
    type: NotificationType.SYSTEM,
  });

  return log;

};
