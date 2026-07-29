import { Response } from "express";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: string };

export const ok = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data } satisfies ApiSuccess<T>);
};

export const created = <T>(res: Response, data: T) => ok(res, data, 201);
