import prisma from "../../../config/database"
import { Role, SettingScope } from "@prisma/client"

export const getSettings = async (userId: number, pharmacyId?: number) => {
  const where: any[] = [
    {
      role: Role.PHARMACIST,
      scope: SettingScope.USER,
      userId,
    },
  ]

  if (typeof pharmacyId === "number") {
    where.push({
      role: Role.PHARMACIST,
      scope: SettingScope.PHARMACY,
      pharmacyId,
    })
  }

  return prisma.systemSetting.findMany({
    where: { OR: where },
    orderBy: { key: "asc" },
  })
}

export const updateSettings = async (
  userId: number,
  pharmacyId: number | undefined,
  settings: { key: string; value: string }[]
) => {
  const ops = settings.map((s) => {
    // USER scope
    if (!pharmacyId) {
      return prisma.systemSetting.upsert({
        where: {
          scope_role_key_userId: {
            scope: SettingScope.USER,
            role: Role.PHARMACIST,
            key: s.key,
            userId,
          },
        },
        update: { value: s.value },
        create: {
          scope: SettingScope.USER,
          role: Role.PHARMACIST,
          key: s.key,
          value: s.value,
          userId,
        },
      })
    }

    // PHARMACY scope
    return prisma.systemSetting.upsert({
      where: {
        scope_role_key_pharmacyId: {
          scope: SettingScope.PHARMACY,
          role: Role.PHARMACIST,
          key: s.key,
          pharmacyId,
        },
      },
      update: { value: s.value },
      create: {
        scope: SettingScope.PHARMACY,
        role: Role.PHARMACIST,
        key: s.key,
        value: s.value,
        pharmacyId,
      },
    })
  })

  await prisma.$transaction(ops)
}
