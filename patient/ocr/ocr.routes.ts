import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./ocr.controller";
import multer from "multer";
import { asyncHandler } from "../../../common/utils/asyncHandler";

const router = Router();
router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post(
  "/scan",
  upload.single("image"),
  asyncHandler(controller.OcrController.extractText)
);

router.post(
  "/scan-prescription",
  upload.single("image"),
  asyncHandler(controller.OcrController.scanPrescription)
);

router.get("/scans/:id", controller.OcrController.getScanResult);

export default router;
