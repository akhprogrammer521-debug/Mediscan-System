import { Router } from "express"
import * as controller from "../admin/drugs/drug.controller"
import { authMiddleware } from "../../common/middlewares/auth.middleware"

const router = Router()

// 🔓 قراءة فقط (ADMIN + PHARMACIST)
router.get("/", authMiddleware, controller.getAllDrugs)
router.get("/:id", authMiddleware, controller.getDrugById)

export default router
