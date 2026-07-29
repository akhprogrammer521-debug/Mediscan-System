import { Request, Response } from "express";
import * as service from "./patient-medical-info.service";
import { ok, created } from "../../../common/utils/apiResponse";

export const getMyMedicalInfo = async (req: Request, res: Response) => {
  const data = await service.getMyMedicalInfo(req.user!.userId);
  return ok(res, data);
};

export const upsertMyMedicalInfo = async (req: Request, res: Response) => {
  const data = await service.upsertMyMedicalInfo(req.user!.userId, req.body);
  return created(res, data);
};
