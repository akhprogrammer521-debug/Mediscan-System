import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { getAdminSettings, updateAdminSettings } from "./settings.controller";
const router = Router();

router.use(authMiddleware);

router.get("/", getAdminSettings)
router.put("/", updateAdminSettings)


export default router;
