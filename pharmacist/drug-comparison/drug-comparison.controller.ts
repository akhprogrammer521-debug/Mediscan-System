import { Request, Response } from "express";
import * as service from "./drug-comparison.service";

export const compareDrugs = async (req: Request, res: Response) => {
  const { drugAName, drugBName } = req.body;

  if (!drugAName || !drugBName) {
    return res.status(400).json({
      success: false,
      error: "يجب إدخال اسم الدواءين",
    });
  }

  const result = await service.compareDrugsByName(drugAName, drugBName);

  if (!result.success) {
    return res.status(404).json(result);
  }

  return res.json(result);
};
