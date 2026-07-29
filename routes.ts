import { Router } from "express";

import adminRoutes from "./modules/admin/admin.routes";
import authRoutes from "./modules/auth/auth.routes";
import patientRoutes from "./modules/patient/patient.routes";
import pharmacistRoutes from "./modules/pharmacist/pharmacist.routes";
import pharmacyRoutes from "./modules/pharmacy/pharmacy.routes";
import publicDrugRoutes from "./modules/drug/public-drug.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/admin", adminRoutes);

router.use("/patient", patientRoutes);

router.use("/pharmacist", pharmacistRoutes);

router.use("/pharmacy", pharmacyRoutes);

router.use("/drugs", publicDrugRoutes);


export default router;
