import { Request, Response } from "express";
import * as service from "./pharmacist-drugs.service";

export const compareDrugs = async (req: Request, res: Response) => {
  const { drugAId, drugBId } = req.body;
  const result = await service.compareDrugs(drugAId, drugBId);
  res.json({ success: true, data: result });
};
