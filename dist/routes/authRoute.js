"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const authValidator = [
    (0, express_validator_1.check)("login").trim().isLength({ min: 8, max: 16 }),
    (0, express_validator_1.check)("password")
        .isLength({ min: 8 })
        .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1 }),
];
// ZROBIC VALIDATOR
router.route("/register").post(authValidator, authController_1.registerHandler);
router.route("/login").post(authValidator, authController_1.loginHandler);
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA
exports.default = router;
