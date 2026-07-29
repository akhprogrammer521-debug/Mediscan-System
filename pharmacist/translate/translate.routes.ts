import { Router } from "express"
import * as controller from "./translate.controller"

const router = Router()
router.post("/translate", controller.translate)

export default router
