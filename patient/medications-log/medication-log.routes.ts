import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./medication-log.controller";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

router.post(
  "/schedules/:scheduleId/taken",
  controller.markDoseAsTaken
);

export default router;
