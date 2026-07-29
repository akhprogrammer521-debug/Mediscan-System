    import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import * as controller from "./admin-profile.controller";
import { Roles } from "../../../common/constants/roles";

const router = Router();

router.use(authMiddleware, requireRole(Roles.ADMIN));


router.get("/", controller.getAdminProfile);

export default router;
