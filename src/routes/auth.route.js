
import express from "express";
const router = express.Router();

import * as authController from "../controllers/auth.controller.js";

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);

export default router;
