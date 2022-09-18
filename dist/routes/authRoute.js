"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// ZROBIC VALIDATOR
router.route("/register").post(authController_1.registerHandler);
router.route("/login").post(authController_1.loginHandler);
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA
exports.default = router;
