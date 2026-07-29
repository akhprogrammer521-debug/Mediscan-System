import { Request, Response } from "express";
import * as service from "./users.service";

export const getAllPatients = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const patients = await service.getAllPatients(search);
  return res.json({ success: true, data: patients });
};


export const getPatientById = async (req: Request, res: Response) => {
  const patient = await service.getPatientById(Number(req.params.id));
  return res.json({ success: true, data: patient });
};

export const togglePatientStatus = async (req: Request, res: Response) => {
  const user = await service.togglePatientStatus(Number(req.params.id));
  return res.json({ success: true, data: user });
};

export const getAllPharmacists = async (_req: Request, res: Response) => {
  const pharmacists = await service.getAllPharmacists();
  return res.json({ success: true, data: pharmacists });
};

export const getPharmacistById = async (req: Request, res: Response) => {
  const pharmacist = await service.getPharmacistById(Number(req.params.id));
  return res.json({ success: true, data: pharmacist });
};

export const togglePharmacistStatus = async (req: Request, res: Response) => {
  const user = await service.togglePharmacistStatus(Number(req.params.id));
  return res.json({ success: true, data: user });
};
