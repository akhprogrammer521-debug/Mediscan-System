import { Router } from "express";
import * as controller from "./drug.controller";

const router = Router();

// /admin/drugs
router.post("/", controller.createDrug );
router.get("/", controller.getAllDrugs);
router.get("/:id", controller.getDrugById);
router.put("/:id", controller.updateDrug);
router.delete("/:id", controller.deleteDrug);

export default router;
