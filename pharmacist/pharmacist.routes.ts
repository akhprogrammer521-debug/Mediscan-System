import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { requireRole } from "../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";

import * as controller from "./pharmacist.controller";
import dashboardRoutes from "./dashboard/pharmacist-dashboard.routes";
import notificationRoutes from "./notifications/pharmacist-notification.routes";
import pharmacistOrderRoutes from "./orders/order.routes";
import settingsRoutes from "./settings/pharmacist-settings.routes";
import ocrRoutes from "./ocr/ocr.routes"
import aiRoutes from "./ai/ai.routes"
import translateRoutes from "./translate/translate.routes"
import drugCompareRoutes from "../patient/drug-comparison/drug-comparison.routes";

const router = Router();

router.post("/login", controller.loginPharmacist);

router.use(authMiddleware);
router.use(requireRole(Role.PHARMACIST));

router.get("/profile", controller.getMyProfile);
router.put('/profile', controller.updateMyProfile)
router.use("/dashboard", dashboardRoutes);

router.get("/stock", controller.getMyStock);
router.post("/stock", controller.addDrugToStock);
router.put("/stock/:stockId", controller.updateStockHandler);
router.delete("/stock/:id", controller.removeFromStock);

router.use("/orders", pharmacistOrderRoutes);
router.use("/ocr" , ocrRoutes);
router.use("/ai" , aiRoutes);
router.use("/translate", translateRoutes)

router.use("/notifications", notificationRoutes);

router.use("/settings", settingsRoutes);

router.use("/drugs", drugCompareRoutes);

export default router;
