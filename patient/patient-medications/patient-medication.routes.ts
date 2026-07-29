import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import * as controller from "./patient-medication.controller";

const router = Router();

// حماية كل Routes
router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

// CRUD
router.post("/", controller.createMedication);
router.get("/", controller.getMyMedications);
router.get("/:id", controller.getMedicationById);
router.put("/:id", controller.updateMedication);
router.delete("/:id", controller.deleteMedication);

// Status
router.patch("/:id/status", controller.updateMedicationStatus);

// Schedules
router.post("/:id/schedules", controller.addSchedule);
router.patch("/schedules/:scheduleId/taken", controller.markScheduleAsTaken);

export default router;
