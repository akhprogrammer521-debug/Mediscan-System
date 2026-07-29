export const Roles = {
  ADMIN: "ADMIN",
  PATIENT: "PATIENT",
  PHARMACIST: "PHARMACIST",
} as const;

export type RoleType = typeof Roles[keyof typeof Roles];
