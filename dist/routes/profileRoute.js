"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_auth_1 = require("../middleware/is-auth");
const profileController_1 = require("../controllers/profileController");
const express_validator_1 = require("express-validator");
const catchAsync_1 = require("../utils/catchAsync");
const changeNameValidator = (0, express_validator_1.check)("changedName")
    .exists()
    .isLength({ min: 3, max: 12 });
const changeLogoValidator = (0, express_validator_1.check)("changedLogoUrl").exists();
const router = (0, express_1.Router)();
// ZROBIC VALIDATOR
router
    .route("/change-name")
    .put(is_auth_1.isAuthMiddleware, changeNameValidator, (0, catchAsync_1.catchAsync)(profileController_1.changeNameHandler));
router
    .route("/change-logo")
    .put(is_auth_1.isAuthMiddleware, changeLogoValidator, (0, catchAsync_1.catchAsync)(profileController_1.changeLogoHandler));
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR
exports.default = router;
