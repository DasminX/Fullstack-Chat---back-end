"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loggedInController_1 = require("../controllers/loggedInController");
const is_auth_1 = require("../middleware/is-auth");
const router = (0, express_1.Router)();
router.route("/register").post(is_auth_1.isAuthMiddleware, loggedInController_1.chatViewHandler);
exports.default = router;
