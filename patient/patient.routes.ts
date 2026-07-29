import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import * as controller from "./patient.controller";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { validateBody } from "../../common/middlewares/validate.middleware";

import dashboardRoutes from "./dashboard/patient-dashboard.routes";
import medicalInfoRoutes from "./medical-info/patient-medical-info.routes";
import medicationLogRoutes from "./medications-log/medication-log.routes";
import patientMedicationsRoutes from "./patient-medications/patient-medication.routes";
import compareDrugeRoutes from "./drug-comparison/drug-comparison.routes";
import patientInteractionsRoutes from "./interactions/interactions.routes";
import patientSearchRoutes from "./search/patient-search.routes";
import patientOrdersRoutes from "./orders/order.routes";
import patientOcrRoutes from "./ocr/ocr.routes";
import ttsRoutes from "./tts/tts.routes";
import aiRoutes from "./ai/ai.routes";
import notificationsRoutes from "./notifications/patient-notification.routes";
import settingsRoutes from "./settings/patient-settings.routes";

const router = Router();

//  Step 1
router.post(
  "/register",
  validateBody({
    firstName: { type: "string", required: true, minLen: 1 },
    lastName: { type: "string", required: true, minLen: 1 },
    username: { type: "string", required: true, minLen: 3 },
    email: { type: "string", required: true, minLen: 3 },
    phone: { type: "string", required: true, minLen: 5 },
    password: { type: "string", required: true, minLen: 6 },
  }),
  asyncHandler(controller.registerPatient)
);

router.post(
  "/login",
  validateBody({
    username: { type: "string", required: true, minLen: 3 },
    password: { type: "string", required: true, minLen: 6 },
  }),
  asyncHandler(controller.loginPatient)
);

//  Step 2
router.use("/medical-info", medicalInfoRoutes);

// حماية كل Routes المريض
router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

router.use("/dashboard", dashboardRoutes);

// Profile
router.get("/profile", asyncHandler(controller.getMyProfile));
router.put("/profile", asyncHandler(controller.updateMyProfile));

// Account
router.delete("/account", asyncHandler(controller.deactivateMyAccount));

router.post(
  "/change-password",
  asyncHandler(controller.changeMyPassword)
);



router.use("/medications", patientMedicationsRoutes);
router.use("/medication-logs", medicationLogRoutes);
router.use("/drug-comparison", compareDrugeRoutes);
router.use("/interactions", patientInteractionsRoutes);

router.use("/search", patientSearchRoutes);

// Orders
router.use("/orders", patientOrdersRoutes);

// OCR (scan drug / prescription)
router.use("/ocr", patientOcrRoutes);

router.use("/tts", ttsRoutes);

router.use("/ai", aiRoutes);

router.use("/notifications", notificationsRoutes);

router.use("/settings", settingsRoutes);

export default router;
