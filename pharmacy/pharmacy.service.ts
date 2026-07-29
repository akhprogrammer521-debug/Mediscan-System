import prisma from "../../config/database";

export const getAllPharmacies = async () => {
  return prisma.pharmacy.findMany();
};

export const getPharmacyById = async (id: number) => {
  const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });
  if (!pharmacy) throw new Error("Pharmacy not found");
  return pharmacy;
};

export const getPharmacyStock = async (pharmacyId: number) => {
  return prisma.pharmacyStock.findMany({
    where: { pharmacyId },
    include: { drug: true },
  });
};
