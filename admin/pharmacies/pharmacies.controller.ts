import { Request, Response } from "express";
import * as service from "./pharmacies.service";
import {
  pharmacyIdParamSchema,
  updatePharmacySchema,
  toggleStatusSchema,
} from "./pharmacies.validation";

export const createPharmacy = async (req: Request, res: Response) => {
  const pharmacy = await service.createPharmacy(req.body);
  return res.status(201).json({ success: true, data: pharmacy });
};

export const getAllPharmacies = async (_req: Request, res: Response) => {
  const pharmacies = await service.getAllPharmacies();
  return res.json({ success: true, data: pharmacies });
};

export const getPharmacyById = async (req: Request, res: Response) => {
  const pharmacy = await service.getPharmacyById(Number(req.params.id));
  return res.json({ success: true, data: pharmacy });
};

export const updatePharmacy = async (req: Request, res: Response) => {
  const pharmacyId = Number(req.params.id);

  const data = updatePharmacySchema.parse(req.body);

  const pharmacy = await service.updatePharmacy(pharmacyId, data);

  res.json({ success: true, data: pharmacy });
};

export const togglePharmacyStatus = async (req: Request, res: Response) => {
  const pharmacyId = Number(req.params.id);

  const { isActive } = toggleStatusSchema.parse(req.body);

  const result = await service.togglePharmacyStatus(pharmacyId, isActive);

  res.json({ success: true, data: result });
};

export const deletePharmacy = async (req: Request, res: Response) => {
  await service.deletePharmacy(Number(req.params.id));
  return res.status(204).send();
};

export const resetPharmacyPassword = async (req: Request, res: Response) => {
  const pharmacyId = Number(req.params.id)

  const data = await service.resetPharmacyPassword(pharmacyId)

  res.json({
    success: true,
    data,
  })
}
