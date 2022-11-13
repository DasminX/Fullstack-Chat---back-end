"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const is_auth_1 = require("../middleware/is-auth");
const profileController_1 = require("../controllers/profileController");
const changeNameValidator = (0, express_validator_1.check)("changedName")
    .exists()
    .isLength({ min: 3, max: 12 });
const changeLogoValidator = (0, express_validator_1.check)("changedLogoUrl").exists();
const router = (0, express_1.Router)();
router
    .route("/change-name")
    .put(is_auth_1.isAuthMiddleware, changeNameValidator, profileController_1.changeNameHandler);
router
    .route("/change-logo")
    .put(is_auth_1.isAuthMiddleware, changeLogoValidator, profileController_1.changeLogoHandler);
//SPRAWDZIC CZY NA PEWNO DOBRZE WSZYSTKO LOGIKA
// SPRAWDZIC CZY NA PEWNO TOKEN DOBRZE DZIALA I DODAC GO DO MDWR
exports.default = router;
