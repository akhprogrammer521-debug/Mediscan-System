import { Router } from "express";
import { adminLogin, refreshToken } from "./auth.controller";

const router = Router();


router.post("/admin/login", adminLogin);
router.post("/refresh", refreshToken);

export default router;
