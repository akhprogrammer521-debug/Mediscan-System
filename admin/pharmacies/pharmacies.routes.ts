import { Router } from "express";
import * as controller from "./pharmacies.controller";

const router = Router();

// /admin/pharmacies
router.post("/", controller.createPharmacy);
router.get("/", controller.getAllPharmacies);
router.get("/:id", controller.getPharmacyById);
router.put("/:id", controller.updatePharmacy);
router.delete("/:id", controller.deletePharmacy);
router.patch("/:id/status", controller.togglePharmacyStatus);
router.patch("/:id/reset-password", controller.resetPharmacyPassword)


export default router;
