import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./patient-medical-info.controller";
import { asyncHandler } from "../../../common/utils/asyncHandler";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

router.get("/", asyncHandler(controller.getMyMedicalInfo));
router.post("/", asyncHandler(controller.upsertMyMedicalInfo));

export default router;
