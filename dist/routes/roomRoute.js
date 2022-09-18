"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controllers/roomController");
const router = (0, express_1.Router)();
// ZROBIC VALIDATOR
router.route("/").get(roomController_1.getRoomsHandler);
router.route("/create").post(roomController_1.createRoomHandler);
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR
exports.default = router;
