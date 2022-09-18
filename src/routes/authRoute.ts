import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/authController";

const router = Router();

// ZROBIC VALIDATOR
router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA
export default router;
