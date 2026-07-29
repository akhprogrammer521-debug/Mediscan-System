import { BadRequestError } from "../errors/AppError";

export const requireString = (value: unknown, field: string) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BadRequestError(`${field} is required`);
  }
  return value.trim();
};

export const requireNumber = (value: unknown, field: string) => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    throw new BadRequestError(`${field} must be a number`);
  }
  return num;
};

export const optionalString = (value: unknown) => {
  if (value == null) return undefined;
  if (typeof value !== "string") return String(value);
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};
