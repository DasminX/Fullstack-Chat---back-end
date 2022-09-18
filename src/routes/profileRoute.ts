import { Router } from "express";
import { isAuthMiddleware } from "../middleware/is-auth";
import {
  changeNameHandler,
  changeLogoHandler,
} from "../controllers/profileController";
import { check } from "express-validator";

const changeNameValidator = check("changedName")
  .exists()
  .isLength({ min: 3, max: 12 });

const changeLogoValidator = check("changedName").exists();

const router = Router();

// ZROBIC VALIDATOR
router
  .route("/change-name")
  .post(isAuthMiddleware, changeNameValidator, changeNameHandler);
router
  .route("/change-logo")
  .post(isAuthMiddleware, changeLogoValidator, changeLogoHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR

export default router;
