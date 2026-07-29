import prisma from "../../config/database";
import bcrypt from "bcryptjs";
import { generateToken } from "../../common/utils/jwt";
import { Role } from "@prisma/client";

export const loginPharmacistService = async (
  username: string,
  password: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      username,
      role: Role.PHARMACIST,
      isActive: true,
    },
    include: {
      pharmacist: {
        include: {
          pharmacy: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.pharmacist || !user.pharmacist.pharmacy) {
    throw new Error("Pharmacy not linked");
  }

  if (!user.pharmacist.pharmacy.isActive) {
    throw new Error("Pharmacy account is inactive");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return {
    success: true,
    token,
    pharmacist: {
      id: user.pharmacist.id,
      pharmacyId: user.pharmacist.pharmacy.id,
      pharmacyName: user.pharmacist.pharmacy.name,
    },
  };
};
