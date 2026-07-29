import { Request, Response } from "express";
import * as service from "./patient-search.service";


export const getPharmaciesByDrug = async (req: Request, res: Response) => {
  const drugId = Number(req.params.drugId);
  const data = await service.getPharmaciesByDrug(drugId);
  res.json({ success: true, data });
};


export const getDrugsByPharmacy = async (req: Request, res: Response) => {
  const pharmacyId = Number(req.params.pharmacyId);
  const data = await service.getDrugsByPharmacy(pharmacyId);
  res.json({ success: true, data });
};
