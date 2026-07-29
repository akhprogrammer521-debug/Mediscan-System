import prisma from "../../../config/database"
import { Role } from "@prisma/client"

export const getSettingsForRole = (role: Role) => {
  return prisma.systemSetting.findMany({ where: { role } })
}

export const updateSettingsForRole = async (
  role: Role,
  settings: { key: string; value: string }[]
) => {
  return prisma.$transaction(
    settings.map((s) =>
      prisma.systemSetting.upsert({
        where: {
          scope_role_key: {
            scope: "GLOBAL",
            role,
            key: s.key,
          },
        },

        update: {
          value: s.value,
        },
        create: {
          scope: "GLOBAL",
          role,
          key: s.key,
          value: s.value,
          userId: null,
        },
      })
    )
  )
}
