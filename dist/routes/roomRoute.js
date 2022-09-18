"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const roomController_1 = require("../controllers/roomController");
const is_auth_1 = require("../middleware/is-auth");
const createRoomValidator = (0, express_validator_1.check)("name").isLength({ min: 3, max: 20 });
const router = (0, express_1.Router)();
// ZROBIC VALIDATOR
router.route("/").get(is_auth_1.isAuthMiddleware, roomController_1.getRoomsHandler);
router
    .route("/create")
    .post(is_auth_1.isAuthMiddleware, createRoomValidator, roomController_1.createRoomHandler);
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR
exports.default = router;
