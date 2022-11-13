"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeLogoHandler = exports.changeNameHandler = void 0;
const express_validator_1 = require("express-validator");
const profileControllerHelpers_1 = require("../utils/profileControllerHelpers");
const validateErrors_1 = require("../utils/validateErrors");
const changeNameHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationErrorArr = (0, express_validator_1.validationResult)(req);
        (0, validateErrors_1.validateErrors)(validationErrorArr, "Name must consist of 3-12 characters.", next);
        yield (0, profileControllerHelpers_1.checkIfUserExists)(next, req.userID);
        yield (0, profileControllerHelpers_1.updateUser)(res, next, req.userID, { username: req.body.changedName }, "Username");
    }
    catch (e) {
        next(e);
    }
});
exports.changeNameHandler = changeNameHandler;
const changeLogoHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationErrorArr = (0, express_validator_1.validationResult)(req);
        (0, validateErrors_1.validateErrors)(validationErrorArr, "Wrong logo URL. Try again.", next);
        yield (0, profileControllerHelpers_1.checkIfUserExists)(next, req.userID);
        yield (0, profileControllerHelpers_1.updateUser)(res, next, req.userID, { userAvatarImgUrl: req.body.changedLogoUrl }, "User avatar logo");
    }
    catch (e) {
        next(e);
    }
});
exports.changeLogoHandler = changeLogoHandler;
