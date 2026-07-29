import { Router } from "express";
import { authMiddleware } from "../../../common/middlewares/auth.middleware";
import { requireRole } from "../../../common/middlewares/role.middleware";
import { Role } from "@prisma/client";
import * as controller from "./patient-search.controller";

const router = Router();

// كل البحث محمي
router.use(authMiddleware);
router.use(requireRole(Role.PATIENT));

// DRUG → PHARMACIES
router.get(
  "/drugs/:drugId/pharmacies",
  controller.getPharmaciesByDrug
);

// PHARMACY → DRUGS
router.get(
  "/pharmacies/:pharmacyId/drugs",
  controller.getDrugsByPharmacy
);

export default router;
