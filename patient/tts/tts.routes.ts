import { Router } from "express";
import { asyncHandler } from "../../../common/utils/asyncHandler";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import { TtsController } from "./tts.controller";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

router.post("/speak", asyncHandler(TtsController.speak));

export default router;
