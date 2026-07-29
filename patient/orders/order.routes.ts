import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import * as controller from "./order.controller";

const router = Router();

router.use(authMiddleware);


router.post("/", requireRole(Role.PATIENT), controller.createOrder);
router.get(
  "/my",
  requireRole(Role.PATIENT),
  controller.getMyOrders
);
router.delete(
  "/:id",
  requireRole(Role.PATIENT),
  controller.deleteOrder
);


export default router;
