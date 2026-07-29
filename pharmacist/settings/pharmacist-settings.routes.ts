import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./pharmacist-settings.controller";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PHARMACIST));

router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);

export default router;
