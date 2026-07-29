import { Request, Response } from "express";
import { created, ok } from "../../../common/utils/apiResponse";
import * as service from "./patient-medication.service";

export const createMedication = async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      error: "Medication name is required",
    });
  }

  const result = await service.createMedication(userId, req.body);

  return created(res, result);
};

export const getMyMedications = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const meds = await service.getMyMedications(userId);
  return ok(res, meds);
};

export const getMedicationById = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const med = await service.getMedicationById(userId, Number(req.params.id));
  return ok(res, med);
};

export const updateMedication = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const med = await service.updateMedication(userId, Number(req.params.id), req.body);
  return ok(res, med);
};

export const deleteMedication = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await service.deleteMedication(userId, Number(req.params.id));
  return ok(res, { deleted: true });
};

export const updateMedicationStatus = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const med = await service.updateMedicationStatus(
    userId,
    Number(req.params.id),
    req.body.status
  );
  return ok(res, med);
};

export const addSchedule = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const medicationId = Number(req.params.medicationId);
  const { time, days } = req.body;

  if (!time || !Array.isArray(days) || days.length === 0) {
    return res.status(400).json({
      success: false,
      message: "time and days are required",
    });
  }

  const schedule = await service.addSchedule(
    userId,
    medicationId,
    time,
    days
  );

  res.json({ success: true, data: schedule });
};


export const markScheduleAsTaken = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const schedule = await service.markScheduleAsTaken(
    userId,
    Number(req.params.scheduleId)
  );
  return ok(res, schedule);
};
export const getAdherence = async (req: Request, res: Response) => {
  const data = await service.getMedicationAdherence(req.user!.userId);
  res.json({ success: true, data });
};
