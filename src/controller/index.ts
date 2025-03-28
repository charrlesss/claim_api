import express from "express";
import Authentication, { ValidateToken, logout } from "./Authentication";
import { PrismaClient } from "@prisma/client";
import Claims from "./Claims";
import Imbersement from "./Imbersement";
import Report from "./Report";

const router = express.Router();
export const prisma = new PrismaClient(); 




router.use(Authentication);
router.use(ValidateToken);
router.use(Claims);
router.use(Imbersement);
router.use(Report);
router.get("/logout", logout);


export default router;
