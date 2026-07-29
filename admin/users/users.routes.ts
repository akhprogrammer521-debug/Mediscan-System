import { Router } from "express";
import * as controller from "./users.controller";

const router = Router();

// /admin/users
router.get("/patients", controller.getAllPatients);
router.get("/patients/:id", controller.getPatientById);
router.patch("/patients/:id/status", controller.togglePatientStatus);

router.get("/pharmacists", controller.getAllPharmacists);
router.get("/pharmacists/:id", controller.getPharmacistById);
router.patch("/pharmacists/:id/status", controller.togglePharmacistStatus);

export default router;
