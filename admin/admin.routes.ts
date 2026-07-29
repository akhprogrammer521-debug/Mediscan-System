import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import dashboardRoutes from "./dashboard/dashboard.routes";
import profileRoutes from "./profile/admin-profile.routes";
import drugsRoutes from "./drugs/drug.routes";
import pharmaciesRoutes from "./pharmacies/pharmacies.routes";
import usersRoutes from "./users/users.routes";
import notificationsRoutes from "./notifications/notification.routes";
import settingsRoutes from "./settings/settings.routes";


const router = Router();

router.use(authMiddleware);
router.use(requireRole(Role.ADMIN));

// Modules
router.use("/dashboard", dashboardRoutes);
router.use("/profile" , profileRoutes);
router.use("/drugs", drugsRoutes);
router.use("/pharmacies", pharmaciesRoutes);
router.use("/users", usersRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/settings", settingsRoutes);
export default router;
