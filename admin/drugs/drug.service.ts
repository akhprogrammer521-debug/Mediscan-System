import prisma from "../../../config/database";

export const createDrug = async (data: any) => {
  return prisma.drug.create({
    data: {
      name: data.name,
      strength: data.strength,
      description: data.description,

      composition: data.composition,
      indications: data.indications,
      contraindications: data.contraindications,
      dosage: data.dosage,
      warnings: data.warnings,
      sideEffects: data.sideEffects,
      interactions: data.interactions,
      overdose: data.overdose,
    },
  });
};

export const getAllDrugs = async () => {
  return prisma.drug.findMany({
    orderBy: { name: "asc" },
  });
};

export const getDrugById = async (id: number) => {
  const drug = await prisma.drug.findUnique({ where: { id } });
  if (!drug) throw new Error("Drug not found");
  return drug;
};

export const updateDrug = async (id: number, data: any) => {
  await getDrugById(id);

  return prisma.drug.update({
    where: { id },
    data: {
      name: data.name,
      strength: data.strength,
      description: data.description,

      composition: data.composition,
      indications: data.indications,
      contraindications: data.contraindications,
      dosage: data.dosage,
      warnings: data.warnings,
      sideEffects: data.sideEffects,
      interactions: data.interactions,
      overdose: data.overdose,
    },
  });
};

export const deleteDrug = async (id: number) => {
  // تحقق إذا الدواء مستخدم
  const used = await prisma.pharmacyStock.findFirst({
    where: { drugId: id },
  })

  if (used) {
    throw new Error('لا يمكن حذف الدواء لأنه مستخدم في طلبات')
  }

  return prisma.drug.delete({
    where: { id },
  })
};
