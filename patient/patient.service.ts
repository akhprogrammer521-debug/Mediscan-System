import prisma from "../../config/database";
import bcrypt from "bcryptjs";
import { Role, Gender, Prisma } from "@prisma/client";
import { generateToken } from "../../common/utils/jwt";


export const registerPatient = async (data: any) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: Role.PATIENT,
      },
    });

    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone,
      },
      token,
    };
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      const target = (err.meta?.target as string) || "unique field";
      throw new Error(`${target} already exists`);
    }
    throw err;
  }
};

export const loginPatient = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (!user || user.role !== Role.PATIENT) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  if(!user.isActive) {
    throw new Error("User account is inactive");
  }

  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return { token };
};


const getPatientByUserIdOrThrow = async (userId: number) => {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: { user: true, medicalInfo: true },
  });

  if (!patient) throw new Error("Patient not found");
  return patient;
};


export const getMyProfile = async (userId: number) => {
  const patient = await getPatientByUserIdOrThrow(userId);

  return {
    patient,
    user: patient.user,
  };
};


export const updateMyProfile = async (userId: number, data: any) => {
  const patient = await getPatientByUserIdOrThrow(userId);

  const {
    firstName,
    lastName,
    phone,
    email,
    username,
  } = data;

  const updatedPatient = await prisma.patient.update({
    where: {
      id: patient.id,
    },
    data: {
      firstName,
      lastName,
      phone,

      user: email || username
        ? {
            update: {
              ...(email && { email }),
              ...(username && { username }),
            },
          }
        : undefined,
    },
    include: {
      user: true,
      medicalInfo: true,
    },
  });

  return updatedPatient;
};


export const getMyMedicalInfo = async (userId: number) => {
  const patient = await getPatientByUserIdOrThrow(userId);
  return patient.medicalInfo ?? null;
};

export const upsertMyMedicalInfo = async (userId: number, data: any) => {
  const patient = await getPatientByUserIdOrThrow(userId);

  if (data.gender && !Object.values(Gender).includes(data.gender)) {
    throw new Error("Invalid gender");
  }

  const exists = await prisma.medicalInfo.findUnique({
    where: { patientId: patient.id },
  });

  if (!exists) {
    const missing: string[] = [];
    if (!data.gender) missing.push("gender");
    if (!data.birthDate) missing.push("birthDate");
    if (data.height == null) missing.push("height");
    if (data.weight == null) missing.push("weight");

    if (missing.length) {
      throw new Error(`Missing fields: ${missing.join(", ")}`);
    }
  }

  return prisma.medicalInfo.upsert({
    where: { patientId: patient.id },
    update: {
      gender: data.gender ?? undefined,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      height: data.height ?? undefined,
      weight: data.weight ?? undefined,
      currentMedications: data.currentMedications ?? undefined,
      chronicMedications: data.chronicMedications ?? undefined,
      chronicDiseases: data.chronicDiseases ?? undefined,
      allergies: data.allergies ?? undefined,
    },
    create: {
      patientId: patient.id,
      gender: data.gender,
      birthDate: new Date(data.birthDate),
      height: data.height,
      weight: data.weight,
      currentMedications: data.currentMedications ?? null,
      chronicMedications: data.chronicMedications ?? null,
      chronicDiseases: data.chronicDiseases ?? null,
      allergies: data.allergies ?? null,
    },
  });
};


export const deactivateMyAccount = async (userId: number) => {
  const patient = await getPatientByUserIdOrThrow(userId);

  await prisma.user.update({
    where: { id: patient.userId },
    data: { isActive: false },
  });

  return { message: "Account deactivated" };
};



export const changeMyPassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const patient = await getPatientByUserIdOrThrow(userId);

  const user = patient.user;

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return { message: "Password updated successfully" };
};
