import { Router } from "express";
import {
  changeNameHandler,
  changeLogoHandler,
} from "../controllers/profileController";

const router = Router();

// ZROBIC VALIDATOR
router.route("/change-name").post(changeNameHandler);
router.route("/change-logo").post(changeLogoHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR

export default router;
