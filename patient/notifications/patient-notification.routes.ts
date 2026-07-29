import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./patient-notification.controller";

const router = Router();

router.use(authMiddleware, requireRole(Role.PATIENT));

router.get("/", controller.getMyNotifications);
router.put("/read-all", controller.markAllAsRead); 
router.get("/unread-count", controller.unreadCount); 

export default router;
