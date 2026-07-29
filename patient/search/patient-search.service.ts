import prisma from "../../../config/database";


const ensureActivePharmacy = async (pharmacyId: number) => {
  const pharmacy = await prisma.pharmacy.findUnique({
    where: { id: pharmacyId, isActive: true },
  });
  if (!pharmacy) throw new Error("Pharmacy not found or inactive");
  return pharmacy;
};

export const getPharmaciesByDrug = async (drugId: number) => {
  return prisma.pharmacyStock.findMany({
    where: {
      drugId,
      pharmacy: {
        isActive: true,
      },
      quantity: {
        gt: 0,
      },
    },
    include: {
      pharmacy: {
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          latitude: true,
          longitude: true,
        },
      },
      drug: {
        select: {
          id: true,
          name: true,
          strength: true,
        },
      },
    },
    orderBy: {
      quantity: "desc",
    },
  });
};


export const getDrugsByPharmacy = async (pharmacyId: number) => {
  await ensureActivePharmacy(pharmacyId);

  return prisma.pharmacyStock.findMany({
    where: {
      pharmacyId,
      quantity: {
        gt: 0,
      },
    },
    include: {
      drug: {
        select: {
          id: true,
          name: true,
          strength: true,
          description: true,
        },
      },
      customDrug: {
        select: {
          id: true,
          name: true,
          strength: true,
        },
      },
    },
    orderBy: [
      {
        drug: {
          name: "asc",
        },
      },
    ],
  });
};
