import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./pharmacist-drugs.controller";

const router = Router();

router.use(authMiddleware, requireRole(Role.PHARMACIST));
router.post("/compare", controller.compareDrugs);

export default router;
