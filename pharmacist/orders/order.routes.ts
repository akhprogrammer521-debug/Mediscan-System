import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import * as controller from "./order.controller";

const router = Router();

router.get(
  "/",
  requireRole(Role.PHARMACIST),
  controller.getOrdersForPharmacist
);

router.put(
  "/:id/accept",
  requireRole(Role.PHARMACIST),
  controller.acceptOrder
);
router.patch(
  "/:id/status",
  requireRole(Role.PHARMACIST),
  controller.updateOrderStatus
);

export default router;
