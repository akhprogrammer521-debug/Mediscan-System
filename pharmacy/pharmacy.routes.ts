import { Router } from "express";
import * as controller from "./pharmacy.controller";
import pharmacistDrugRoutes from "./drugs/pharmacist-drugs.routes";

const router = Router();

router.get("/", controller.getAllPharmacies);
router.get("/:id", controller.getPharmacyById);
router.get("/:id/stock", controller.getPharmacyStock);
router.use("/drugs", pharmacistDrugRoutes);

export default router;
