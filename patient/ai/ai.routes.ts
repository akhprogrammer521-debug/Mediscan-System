import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import * as controller from "./ai.controller";

const router = Router();
router.use(authMiddleware);

router.post("/chat", controller.chat);

export default router;
