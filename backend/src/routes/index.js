import { Router } from "express";
import git from "./git.js";

const router = Router();
router.use("/git", git);

export default router;
