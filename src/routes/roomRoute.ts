import { Router } from "express";
import {
  createRoomHandler,
  getRoomsHandler,
} from "../controllers/roomController";

const router = Router();

// ZROBIC VALIDATOR
router.route("/").get(getRoomsHandler);
router.route("/create").post(createRoomHandler);

//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA

// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR

export default router;
