import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { OcrController } from "./ocr.controller";
import multer from "multer";
import { asyncHandler } from "../../../common/utils/asyncHandler";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PHARMACIST));

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post(
  "/scan",
  upload.single("image"),
  asyncHandler(OcrController.extractText)
);

router.post(
  "/scan-prescription",
  upload.single("image"),
  asyncHandler(OcrController.scanPrescription)
);

export default router;
