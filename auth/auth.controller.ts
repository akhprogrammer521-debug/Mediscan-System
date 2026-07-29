import { Request, Response } from "express";
import { ZodError } from "zod";
import { loginAdmin, refreshAccessToken } from "./auth.service";
import { loginSchema, refreshTokenSchema } from "./auth.validation";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginAdmin(validatedData.username, validatedData.password);

    return res.json({
      success: true,
      token: result.token,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors.map((e) => e.message).join(", "),
      });
    }

    const message = error instanceof Error ? error.message : "Login failed";
    return res.status(401).json({
      success: false,
      error: message,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    const result = await refreshAccessToken(validatedData.refreshToken);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors.map((e) => e.message).join(", "),
      });
    }

    const message = error instanceof Error ? error.message : "Token refresh failed";
    return res.status(401).json({
      success: false,
      error: message,
    });
  }
};
