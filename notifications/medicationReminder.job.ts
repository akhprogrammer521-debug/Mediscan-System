import prisma from "../../config/database";
import { NotificationType, Role } from "@prisma/client";
import { createNotification } from "../../common/services/notification.service";


const weekDays: ("SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT")[] = [
  "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT",
];

const normalizeDate = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export async function medicationReminderJob() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const todayKey = weekDays[now.getDay()];
  const today = normalizeDate();

  const schedules = await prisma.medicationSchedule.findMany({
    where: {
      time: currentTime,
      days: { contains: todayKey },
      patientMedication: { status: "ACTIVE" },
    },
    include: {
      patientMedication: {
        include: {
          patient: { include: { user: true } },
        },
      },
      logs: { where: { date: today } },
    },
  });

  for (const s of schedules) {
    if (s.logs.length > 0) continue;

    const userId = s.patientMedication.patient.userId;

    const exists = await prisma.notification.findFirst({
      where: {
        userId,
        type: NotificationType.SYSTEM,
        title: "تذكير دواء",
        createdAt: { gte: today },
      },
    });

    if (exists) continue;

    await createNotification({
      userId,
      type: NotificationType.SYSTEM,
      title: "تذكير دواء",
      message: `حان وقت تناول دواء ${s.patientMedication.name} (${s.patientMedication.dosage})`,
    });
  }
}
