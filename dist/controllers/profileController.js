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
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const types_1 = require("../types/types");
const catchAsync_1 = require("../utils/catchAsync");
const prisma = new client_1.PrismaClient();
const changeNameHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrorArr = (0, express_validator_1.validationResult)(req);
    (0, catchAsync_1.validateErrors)(validationErrorArr, "Something went wrong in VALIDATION", 400);
    const { changedName } = req.body;
    const user = yield prisma.user.findFirst({
        where: { id: req.userID },
    });
    if (!user) {
        const error = new types_1.ExtendedError("Not authenticated!", 401);
        return next(error);
    }
    const updatedUser = yield prisma.user.update({
        data: { username: changedName },
        where: { id: req.userID },
    });
    res.status(201).json({
        status: "ok",
        data: {
            message: "Username updated successfully!",
            username: updatedUser.username,
        },
    });
});
exports.changeNameHandler = changeNameHandler;
const changeLogoHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrorArr = (0, express_validator_1.validationResult)(req);
    (0, catchAsync_1.validateErrors)(validationErrorArr, "Something went wrong in VALIDATION", 400);
    const { changedLogoUrl } = req.body;
    const user = yield prisma.user.findFirst({
        where: { id: req.userID },
    });
    if (!user) {
        const error = new types_1.ExtendedError("Not authenticated!", 401);
        return next(error);
    }
    yield prisma.user.update({
        data: { userAvatarImgUrl: changedLogoUrl },
        where: { id: req.userID },
    });
    res.status(201).json({
        status: "ok",
        data: { message: "User avatar logo updated successfully!" },
    });
});
exports.changeLogoHandler = changeLogoHandler;
