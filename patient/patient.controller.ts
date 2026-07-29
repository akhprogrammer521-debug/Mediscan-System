import { Request, Response } from "express";
import * as service from "./patient.service";
import { ok } from "../../common/utils/apiResponse";
import { auditLog } from "../../common/services/auditLog.service";

// AUTH
export const registerPatient = async (req: Request, res: Response) => {
  const result = await service.registerPatient(req.body);
  res.status(201).json({ success: true, data: result });
};

export const loginPatient = async (req: Request, res: Response) => {
  const result = await service.loginPatient(req.body);
  res.json({ success: true, data: result });
};

// PROFILE
export const getMyProfile = async (req: Request, res: Response) => {
  const data = await service.getMyProfile(req.user!.userId);
  res.json({ success: true, data });
};

export const updateMyProfile = async (req: Request, res: Response) => {
  const data = await service.updateMyProfile(req.user!.userId, req.body);
  res.json({ success: true, data });
};

// MEDICAL INFO
export const getMyMedicalInfo = async (req: Request, res: Response) => {
  const data = await service.getMyMedicalInfo(req.user!.userId);
  res.json({ success: true, data });
};

export const upsertMyMedicalInfo = async (req: Request, res: Response) => {
  const data = await service.upsertMyMedicalInfo(req.user!.userId, req.body);
  res.json({ success: true, data });
};

// ACCOUNT
export const deactivateMyAccount = async (req: Request, res: Response) => {
  const data = await service.deactivateMyAccount(req.user!.userId);
  auditLog("PATIENT_DEACTIVATE_ACCOUNT", { userId: req.user!.userId });
  return ok(res, data);
};


// PASSWORD
export const changeMyPassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const data = await service.changeMyPassword(
    req.user!.userId,
    currentPassword,
    newPassword
  );

  return ok(res, data);
};
