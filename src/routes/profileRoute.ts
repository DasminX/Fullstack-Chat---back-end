import { Router } from "express";
import { isAuthMiddleware } from "../middleware/is-auth";
import {
  changeNameHandler,
  changeLogoHandler,
} from "../controllers/profileController";
import { check } from "express-validator";
import { catchAsync } from "../utils/catchAsync";

const changeNameValidator = check("changedName")
  .exists()
  .isLength({ min: 3, max: 12 });

const changeLogoValidator = check("changedLogoUrl").exists();

const router = Router();

// ZROBIC VALIDATOR
router
  .route("/change-name")
  .put(isAuthMiddleware, changeNameValidator, catchAsync(changeNameHandler));
router
  .route("/change-logo")
  .put(isAuthMiddleware, changeLogoValidator, catchAsync(changeLogoHandler));

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR

export default router;
