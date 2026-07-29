import prisma from "../../../config/database";

export const compareDrugsByName = async (
  drugAName: string,
  drugBName: string
) => {
  const drugA = await prisma.drug.findFirst({
    where: {
      name: {
        contains: drugAName.toLowerCase(),
      },
    },
  });

  const drugB = await prisma.drug.findFirst({
    where: {
      name: {
        contains: drugBName.toLowerCase(),
      },
    },
  });

  if (!drugA || !drugB) {
    return {
      success: false,
      error: "أحد الدواءين غير موجود في قاعدة البيانات",
    };
  }

  const interaction = await prisma.drugInteraction.findFirst({
    where: {
      OR: [
        { drugAId: drugA.id, drugBId: drugB.id },
        { drugAId: drugB.id, drugBId: drugA.id },
      ],
    },
  });

  return {
    success: true,
    data: {
      drugA,
      drugB,
      interaction,
    },
  };
};
