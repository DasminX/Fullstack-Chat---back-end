import { Router } from "express";
import { body } from "express-validator";
import { loginHandler, registerHandler } from "../controllers/authController";

const router = Router();

const authValidator = [
  body("email").exists().trim().isEmail(),
  body("password")
    .exists()
    .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1 }),
];

// ZROBIC VALIDATOR
router.route("/register").post(authValidator, registerHandler);
router.route("/login").post(authValidator, loginHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA
export default router;
