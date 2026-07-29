import { Request, Response } from "express";
import * as service from "./pharmacy.service";
import { pharmacyIdParamSchema } from "./pharmacy.validation";

export const getAllPharmacies = async (_req: Request, res: Response) => {
  res.json({ success: true, data: await service.getAllPharmacies() });
};

export const getPharmacyById = async (req: Request, res: Response) => {
  const { id } = pharmacyIdParamSchema.parse(req.params);
  res.json({
    success: true,
    data: await service.getPharmacyById(Number(id)),
  });
};

export const getPharmacyStock = async (req: Request, res: Response) => {
  const { id } = pharmacyIdParamSchema.parse(req.params);
  res.json({
    success: true,
    data: await service.getPharmacyStock(Number(id)),
  });
};
