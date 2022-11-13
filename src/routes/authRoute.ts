import { Router } from "express";
import { check } from "express-validator";
import { loginHandler, registerHandler } from "../controllers/authController";

const router = Router();

const authValidator = [
  check("login").trim().isLength({ min: 8, max: 16 }),
  check("password")
    .isLength({ min: 8, max: 20 })
    .isStrongPassword({ minNumbers: 1 }),
];

router.route("/register").post(authValidator, registerHandler);
router.route("/login").post(authValidator, loginHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA
export default router;
