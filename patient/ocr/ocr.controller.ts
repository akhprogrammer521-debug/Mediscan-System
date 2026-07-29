import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { OcrService } from "./ocr.service";
import { BadRequestError } from "../../../common/errors";
import { aiFlaskService } from "../../../common/services/aiFlask.service";
import { auditLog } from "../../../common/services/auditLog.service";
import prisma from "../../../config/database";


export class OcrController {
  static async extractText(req: Request, res: Response) {
  if (!req.file) {
    throw new BadRequestError("No image uploaded");
  }

  const imagePath = req.file.path;
  const imageUrl = `/uploads/${path.basename(imagePath)}`;

  try {
    // ✅ هنا الحل
    const result = await OcrService.scanDrug(imagePath, imageUrl);

    const { scan, drug, analysis, text, ttsText } = result;

    auditLog("PATIENT_SCAN_DRUG", {
      userId: req.user?.userId,
      scanId: scan.id,
      drugId: drug?.id ?? null,
    });

    return res.json({
      success: true,
      data: {
        scan,
        drug,      // ✅ الآن موجود
        analysis,
        text,
        ttsText,
      },
    });
  } finally {
    try {
      fs.unlinkSync(imagePath);
    } catch {
      /* ignore */
    }
  }
}


  static async scanPrescription(req: Request, res: Response) {
  try {
    const imagePath = req.file?.path;
    const imageUrl = req.file?.filename;

    if (!imagePath || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await OcrService.scanPrescription(
      imagePath,
      imageUrl
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("OCR Prescription Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process prescription OCR",
    });
  }
}

static async getScanResult(req: Request, res: Response) {
  const scanId = Number(req.params.id);

  if (!Number.isFinite(scanId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid scan id",
    });
  }

  const scan = await prisma.oCRScan.findUnique({
    where: { id: scanId },
  });

  if (!scan) {
    return res.status(404).json({
      success: false,
      error: "Scan not found",
    });
  }

  const candidates = OcrService["buildSearchCandidates"](
    scan.text
  );

  const drug = await OcrService["matchDrugFromDatabase"](candidates);

  return res.json({
    success: true,
    data: {
      scan,
      drug: drug ?? null,
    },
  });
}

}
