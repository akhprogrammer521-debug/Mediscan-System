import { Router } from "express";
import * as controller from "./pharmacist-notification.controller";

const router = Router();

router.get("/", controller.getMyNotifications);
router.get("/unread-count", controller.getUnreadCount);
router.patch("/:id/read", controller.markAsRead);

export default router;
