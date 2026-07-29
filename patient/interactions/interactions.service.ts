import prisma from "../../../config/database";
import { MedicationStatus } from "@prisma/client";

const getPatientByUserId = async (userId: number) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) throw new Error("Patient not found");
  return patient;
};

/**
 * IMPORTANT:
 * DrugInteraction عندك محفوظ باتجاه واحد:
 * (drugAId, drugBId) unique
 * لذلك لازم نستعلم بالاتجاهين:
 * (A,B) OR (B,A)
 */
export const getInteractionBetweenTwoDrugs = async (
  drugAId: number,
  drugBId: number
) => {
  if (!Number.isFinite(drugAId) || !Number.isFinite(drugBId)) {
    throw new Error("Invalid drug ids");
  }
  if (drugAId === drugBId) {
    return { hasInteraction: false, interaction: null };
  }

  const interaction = await prisma.drugInteraction.findFirst({
    where: {
      OR: [
        { drugAId, drugBId },
        { drugAId: drugBId, drugBId: drugAId },
      ],
    },
  });

  return {
    hasInteraction: Boolean(interaction),
    interaction: interaction ?? null,
  };
};

/**
 * نعثر على أدوية المريض "النشطة" من PatientMedication
 * ثم نحاول مطابقتها مع جدول Drug العالمي عبر الاسم (contains/insensitive)
 * ثم نبحث عن التداخلات بين drugId المدخل و ids الأدوية النشطة
 */
export const getInteractionsWithMyActiveMeds = async (
  userId: number,
  scannedDrugId: number
) => {
  const patient = await getPatientByUserId(userId);

  const scannedDrug = await prisma.drug.findUnique({
    where: { id: scannedDrugId },
    select: { id: true, name: true, strength: true },
  });
  if (!scannedDrug) throw new Error("Drug not found");

  // 1) احضر أدوية المريض النشطة
  const myActiveMeds = await prisma.patientMedication.findMany({
    where: {
      patientId: patient.id,
      status: MedicationStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      dosage: true,
    },
  });

  if (myActiveMeds.length === 0) {
    return {
      scannedDrug,
      matches: [],
      warnings: [],
    };
  }

  // 2) حاول مطابقة أسماء أدوية المريض مع Drug العالمي
  // ملاحظة: هذا حل مرحلي، لأن عندنا فقط name في PatientMedication.
  const matchedDrugs = await Promise.all(
    myActiveMeds.map(async (m) => {
      const d = await prisma.drug.findFirst({
        where: {
          name: { contains: m.name, mode: "insensitive" },
        },
        select: { id: true, name: true, strength: true },
      });
      return { patientMedication: m, drug: d ?? null };
    })
  );

  const resolved = matchedDrugs.filter((x) => x.drug !== null) as Array<{
    patientMedication: { id: number; name: string; dosage: string };
    drug: { id: number; name: string; strength: string };
  }>;

  if (resolved.length === 0) {
    return {
      scannedDrug,
      matches: [],
      warnings: [],
      note:
        "No matches found between patient medications and global drugs (name matching).",
    };
  }

  const myDrugIds = resolved.map((x) => x.drug.id);

  // 3) استعلام التداخلات (بالجهتين) بين scannedDrug و myDrugIds
  const interactions = await prisma.drugInteraction.findMany({
    where: {
      OR: [
        {
          drugAId: scannedDrug.id,
          drugBId: { in: myDrugIds },
        },
        {
          drugBId: scannedDrug.id,
          drugAId: { in: myDrugIds },
        },
      ],
    },
  });

  // 4) صنع warnings مُنظمة
  const warnings = interactions.map((inter) => {
    const otherId =
      inter.drugAId === scannedDrug.id ? inter.drugBId : inter.drugAId;

    const other = resolved.find((x) => x.drug.id === otherId);

    return {
      severity: inter.severity,
      warning: inter.warning,
      withDrug: other
        ? {
            id: other.drug.id,
            name: other.drug.name,
            strength: other.drug.strength,
            patientMedicationId: other.patientMedication.id,
            patientMedicationName: other.patientMedication.name,
          }
        : { id: otherId },
    };
  });

  return {
    scannedDrug,
    matches: resolved.map((x) => ({
      patientMedicationId: x.patientMedication.id,
      patientMedicationName: x.patientMedication.name,
      resolvedDrug: x.drug,
    })),
    warnings,
  };
};
