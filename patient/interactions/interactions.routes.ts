import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./interactions.controller";

const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

router.get("/between", controller.getInteractionBetweenTwoDrugs);
router.get("/with-my-meds", controller.getInteractionsWithMyActiveMeds);

export default router;
