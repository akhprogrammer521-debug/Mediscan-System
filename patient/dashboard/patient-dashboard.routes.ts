import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import * as controller from "./patient-dashboard.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getDashboard);


export default router;
    