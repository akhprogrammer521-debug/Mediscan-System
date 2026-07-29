import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./notification.controller";

const router = Router();

router.use(authMiddleware);
requireRole(Role.ADMIN)

router.get("/", controller.getAdminNotifications)
router.patch("/:id/read", controller.markNotificationAsRead)

export default router;
