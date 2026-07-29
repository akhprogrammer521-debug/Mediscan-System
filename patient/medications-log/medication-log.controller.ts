import { Request, Response } from "express";
import * as service from "./medication-log.service";

export const markDoseAsTaken = async (req: Request, res: Response) => {
  const scheduleId = Number(req.params.scheduleId);

  if (!scheduleId) {
    return res.status(400).json({ message: "Invalid schedule id" });
  }

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = await service.markDoseAsTaken(
    req.user.userId,
    scheduleId
  );

  res.json(result);
};

