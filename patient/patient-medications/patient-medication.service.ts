import prisma from "../../../config/database";
import { MedicationStatus, NotificationType } from "@prisma/client";
import { createNotification } from "../../../common/services/notification.service";


type WeekDay =
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT"
  | "SUN";

const getPatientByUserId = async (userId: number) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) throw new Error("Patient not found");
  return patient;
};


const resolveDrugByName = async (name: string) => {
  return prisma.drug.findFirst({
    where: {
      name: { contains: name },
    },
    select: { id: true, name: true, strength: true },
  });
};


export const createMedication = async (userId: number, data: any) => {
  const patient = await getPatientByUserId(userId);

  const medication = await prisma.patientMedication.create({
    data: {
      patientId: patient.id,
      name: data.name,
      dosage: data.dosage,
      reason: data.reason,
      notes: data.notes,
      status: MedicationStatus.ACTIVE,
    },
  });

  if (Array.isArray(data.schedules) && data.schedules.length > 0) {
    await prisma.medicationSchedule.createMany({
      data: data.schedules.map(
        (s: { time: string; days: WeekDay[] }) => ({
          patientMedicationId: medication.id,
          time: s.time,
          days: s.days.join(","),
        })
      ),
    });
  }


  await createNotification({
    userId: patient.userId,
    title: "تمت إضافة دواء",
    message: `تمت إضافة دواء ${medication.name} إلى جدولك`,
    type: NotificationType.SYSTEM,
  });

  const newDrug = await resolveDrugByName(data.name);

  if (!newDrug) {
    return { medication, warnings: [] };
  }

  const activeMeds = await prisma.patientMedication.findMany({
    where: {
      patientId: patient.id,
      status: MedicationStatus.ACTIVE,
      id: { not: medication.id },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (activeMeds.length === 0) {
    return { medication, warnings: [] };
  }

  const resolved = await Promise.all(
    activeMeds.map(async (m) => {
      const d = await resolveDrugByName(m.name);
      return d
        ? { patientMedicationId: m.id, patientMedicationName: m.name, drug: d }
        : null;
    })
  );

  const matched = resolved.filter(Boolean) as Array<{
    patientMedicationId: number;
    patientMedicationName: string;
    drug: { id: number; name: string; strength: string };
  }>;

  if (matched.length === 0) {
    return { medication, warnings: [] };
  }

  const drugIds = matched.map((x) => x.drug.id);

  const interactions = await prisma.drugInteraction.findMany({
    where: {
      OR: [
        {
          drugAId: newDrug.id,
          drugBId: { in: drugIds },
        },
        {
          drugBId: newDrug.id,
          drugAId: { in: drugIds },
        },
      ],
    },
  });

  const warnings = interactions.map((inter) => {
    const otherId =
      inter.drugAId === newDrug.id ? inter.drugBId : inter.drugAId;

    const other = matched.find((x) => x.drug.id === otherId);

    return {
      severity: inter.severity,
      warning: inter.warning,
      withDrug: other
        ? {
          drugId: other.drug.id,
          drugName: other.drug.name,
          strength: other.drug.strength,
          patientMedicationId: other.patientMedicationId,
          patientMedicationName: other.patientMedicationName,
        }
        : { drugId: otherId },
    };
  });

  if (warnings.length > 0) {
    for (const w of warnings) {
      await createNotification({
        userId: patient.userId,
        type: NotificationType.SYSTEM,
        title: "تحذير دوائي",
        message: `تحذير: لا يُنصح بتناول ${medication.name} مع ${w.withDrug.patientMedicationName}`,
      });
    }

  }

  return {
    medication,
    warnings,
  };

}

export const getMyMedications = async (userId: number) => {
  const patient = await getPatientByUserId(userId);

  return prisma.patientMedication.findMany({
    where: { patientId: patient.id },
    include: {
      schedules: {
        include: {
          logs: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getMedicationById = async (userId: number, medicationId: number) => {
  const patient = await getPatientByUserId(userId);

  const med = await prisma.patientMedication.findFirst({
    where: { id: medicationId, patientId: patient.id },
    include: { schedules: true },
  });

  if (!med) throw new Error("Medication not found");
  return med;
};

export const updateMedication = async (
  userId: number,
  medicationId: number,
  data: any
) => {
  await getMedicationById(userId, medicationId);

  const medication = await prisma.patientMedication.update({
    where: { id: medicationId },
    data: {
      name: data.name,
      dosage: data.dosage,
      reason: data.reason,
      notes: data.notes,
      status: data.status,
    },
  });


  if (Array.isArray(data.schedules)) {

    const schedules = await prisma.medicationSchedule.findMany({
      where: { patientMedicationId: medicationId },
      select: { id: true },
    });

    const scheduleIds = schedules.map(s => s.id);

    if (scheduleIds.length > 0) {
      await prisma.medicationLog.deleteMany({
        where: {
          scheduleId: { in: scheduleIds },
        },
      });
    }

    await prisma.medicationSchedule.deleteMany({
      where: { patientMedicationId: medicationId },
    });

    if (data.schedules.length > 0) {
      await prisma.medicationSchedule.createMany({
        data: data.schedules.map(
          (s: { time: string; days: string[] }) => ({
            patientMedicationId: medicationId,
            time: s.time,
            days: s.days.join(","),
          })
        ),
      });
    }
  }

  return medication;
};

export const deleteMedication = async (userId: number, medicationId: number) => {
  await getMedicationById(userId, medicationId);
  return prisma.patientMedication.delete({ where: { id: medicationId } });
};

export const updateMedicationStatus = async (
  userId: number,
  medicationId: number,
  status: MedicationStatus
) => {
  await getMedicationById(userId, medicationId);

  return prisma.patientMedication.update({
    where: { id: medicationId },
    data: { status },
  });
};


const isValidHHmm = (time: string) => /^\d{2}:\d{2}$/.test(time);

export const addSchedule = async (
  userId: number,
  medicationId: number,
  time: string,
  days: WeekDay[]
) => {
  await getMedicationById(userId, medicationId);

  if (!time || !isValidHHmm(time)) {
    throw new Error("Invalid time format. Expected HH:mm");
  }

  if (!days || days.length === 0) {
    throw new Error("At least one day must be selected");
  }

  return prisma.medicationSchedule.create({
    data: {
      patientMedicationId: medicationId,
      time,
      days: days.join(","),
    },
  });
};

export const markScheduleAsTaken = async (
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
    select: {
      id: true,
      patientMedicationId: true,
      days: true,
    },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekDayMap: WeekDay[] = [
    "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
  ];

  const todayKey = weekDayMap[new Date().getDay()];
  const allowedDays = schedule.days.split(",");

  if (!allowedDays.includes(todayKey)) {
    throw new Error("This medication is not scheduled for today");
  }


  const existingLog = await prisma.medicationLog.findFirst({
    where: {
      scheduleId: schedule.id,
      date: today,
    },
  });

  if (existingLog) {
    return existingLog;
  }

  return prisma.medicationLog.create({
    data: {
      scheduleId: schedule.id,
      patientMedicationId: schedule.patientMedicationId,
      date: today,
      takenAt: new Date(),
    },
  });
};



export const getMedicationAdherence = async (userId: number) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) throw new Error("Patient not found");

  const schedules = await prisma.medicationSchedule.findMany({
    where: { patientMedication: { patientId: patient.id } },
    include: { logs: true },
  });

  let total = 0;
  let taken = 0;

  schedules.forEach((s) => {
    total += s.logs.length;
    taken += s.logs.filter((l) => l.takenAt).length;
  });

  return {
    totalDoses: total,
    takenDoses: taken,
    adherenceRate: total ? Math.round((taken / total) * 100) : 0,
  };
};