import { Router } from "express";
import { body } from "express-validator";
import {
  createRoomHandler,
  getRoomsHandler,
} from "../controllers/roomController";
import { isAuthMiddleware } from "../middleware/is-auth";

const createRoomValidator = body("name").isLength({ min: 3, max: 20 });

const router = Router();

// ZROBIC VALIDATOR
router.route("/").get(isAuthMiddleware, getRoomsHandler);
router
  .route("/create")
  .post(isAuthMiddleware, createRoomValidator, createRoomHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR

export default router;
