import { Request, Response } from "express";
import * as service from "./drug.service";

export const createDrug = async (req: Request, res: Response) => {
  const drug = await service.createDrug(req.body);
  return res.status(201).json({ success: true, data: drug });
};

export const getAllDrugs = async (_req: Request, res: Response) => {
  const drugs = await service.getAllDrugs();
  return res.json({ success: true, data: drugs });
};

export const getDrugById = async (req: Request, res: Response) => {
  const drug = await service.getDrugById(Number(req.params.id));
  return res.json({ success: true, data: drug });
};

export const updateDrug = async (req: Request, res: Response) => {
  const drug = await service.updateDrug(Number(req.params.id), req.body);
  return res.json({ success: true, data: drug });
};

export const deleteDrug = async (req: Request, res: Response) => {
  try {
    await service.deleteDrug(Number(req.params.id))
    return res.status(204).send()
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      error: e.message,
    })
  }
};
