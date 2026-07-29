import prisma from "../../../config/database";
import { Role, SettingScope } from "@prisma/client";

export const getSettings = async (userId: number) => {
  return prisma.systemSetting.findMany({
    where: {
      role: Role.PATIENT,
      userId,
      scope: SettingScope.USER,
    },
  });
};

export const updateSettings = async (
  userId: number,
  settings: { key: string; value: string }[]
) => {
  const ops = settings.map((s) =>
    prisma.systemSetting.upsert({
      where: {
        scope_role_key_userId: {
          scope: SettingScope.USER,
          role: Role.PATIENT,
          key: s.key,
          userId,
        },
      },
      update: { value: s.value },
      create: {
        scope: SettingScope.USER,
        role: Role.PATIENT,
        key: s.key,
        value: s.value,
        userId: userId,
      },
    })
  );

  await prisma.$transaction(ops);
};
