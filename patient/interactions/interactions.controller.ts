import { Request, Response } from "express";
import * as service from "./interactions.service";

export const getInteractionBetweenTwoDrugs = async (req: Request, res: Response) => {
  const drugAId = Number(req.query.drugAId);
  const drugBId = Number(req.query.drugBId);

  const data = await service.getInteractionBetweenTwoDrugs(drugAId, drugBId);
  return res.json({ success: true, data });
};

export const getInteractionsWithMyActiveMeds = async (req: Request, res: Response) => {
  const drugId = Number(req.query.drugId);
  const data = await service.getInteractionsWithMyActiveMeds(req.user!.userId, drugId);
  return res.json({ success: true, data });
};
