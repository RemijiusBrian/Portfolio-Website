import express from "express";
import * as AdminController from "../controller/adminController";

const router = express.Router();

router.post("/register", AdminController.registerAdmin);

router.post("/login", AdminController.loginAdmin);

router.post("/logout", AdminController.logout);

export default router;