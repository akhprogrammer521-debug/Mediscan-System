import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { OcrService } from "./ocr.service";
import { BadRequestError } from "../../../common/errors";
import { ok } from "../../../common/utils/apiResponse";
import { auditLog } from "../../../common/services/auditLog.service";

export class OcrController {
  static async extractText(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequestError("No image uploaded");
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${path.basename(imagePath)}`;

    try {
      const { scan, drug, analysis, text, ttsText } =
        await OcrService.scanDrug(imagePath, imageUrl);


      auditLog("PATIENT_SCAN_DRUG", {
        userId: req.user?.userId,
        scanId: scan.id,
        drugId: drug?.id ?? null,
      });

      return ok(res, {
        scan,
        drug,
        analysis,
        text,
        ttsText,
      });
    } finally {
      try {
        fs.unlinkSync(imagePath);
      } catch { }
    }
  }

  static async scanPrescription(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequestError("No image uploaded");
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${path.basename(imagePath)}`;

    try {
      const { prescription, text, translated } =
        await OcrService.scanPrescription(imagePath, imageUrl);

      auditLog("PATIENT_SCAN_PRESCRIPTION", {
        userId: req.user?.userId,
        prescriptionId: prescription.id,
      });

      return ok(res, { prescription, text, translated });
    } finally {
      try {
        fs.unlinkSync(imagePath);
      } catch { }
    }
    
  }
}