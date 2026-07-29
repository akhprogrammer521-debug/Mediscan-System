import prisma from "../../../config/database";

export const compareDrugs = async (drugAId: number, drugBId: number) => {
  const [drugA, drugB] = await Promise.all([
    prisma.drug.findUnique({ where: { id: drugAId } }),
    prisma.drug.findUnique({ where: { id: drugBId } }),
  ]);

  if (!drugA || !drugB) {
    throw new Error("Drug not found");
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
    drugA,
    drugB,
    interaction: interaction
      ? {
          severity: interaction.severity,
          warning: interaction.warning,
        }
      : null,
  };
};
