import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";

type Rule =
  | { type: "string"; required?: boolean; minLen?: number; maxLen?: number }
  | { type: "number"; required?: boolean; min?: number; max?: number }
  | { type: "boolean"; required?: boolean };

type Schema = Record<string, Rule>;

export const validateBody = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const body: any = req.body || {};
    const errors: string[] = [];

    for (const [key, rule] of Object.entries(schema)) {
      const value = body[key];
      const isMissing = value === undefined || value === null || value === "";

      if (rule.required && isMissing) {
        errors.push(`${key} is required`);
        continue;
      }

      if (isMissing) continue;

      if (rule.type === "string") {
        if (typeof value !== "string") errors.push(`${key} must be a string`);
        if (rule.minLen !== undefined && typeof value === "string" && value.length < rule.minLen)
          errors.push(`${key} must be at least ${rule.minLen} chars`);
        if (rule.maxLen !== undefined && typeof value === "string" && value.length > rule.maxLen)
          errors.push(`${key} must be at most ${rule.maxLen} chars`);
      }

      if (rule.type === "number") {
        if (typeof value !== "number" || Number.isNaN(value)) errors.push(`${key} must be a number`);
        if (rule.min !== undefined && typeof value === "number" && value < rule.min)
          errors.push(`${key} must be >= ${rule.min}`);
        if (rule.max !== undefined && typeof value === "number" && value > rule.max)
          errors.push(`${key} must be <= ${rule.max}`);
      }

      if (rule.type === "boolean") {
        if (typeof value !== "boolean") errors.push(`${key} must be a boolean`);
      }
    }

    if (errors.length) {
      return next(new BadRequestError(errors.join(", ")));
    }

    return next();
  };
};
