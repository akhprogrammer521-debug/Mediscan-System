import { Router } from "express";
import { compareDrugs } from "./drug-comparison.controller";

const router = Router();

router.post("/compare", compareDrugs);

export default router;
