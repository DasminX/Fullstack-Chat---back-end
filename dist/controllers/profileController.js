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
const prisma = new client_1.PrismaClient();
const changeNameHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrorArr = (0, express_validator_1.validationResult)(req);
    if (!validationErrorArr.isEmpty()) {
        const error = new Error("Something went wrong in VALIDATION");
        error.status = 422;
        return next(error);
    }
    try {
        const { changedName } = req.body;
        const user = yield prisma.user.findFirst({
            where: { id: req.userID },
        });
        if (!user) {
            const error = new Error("Not authenticated!");
            error.status = 400;
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
    }
    catch (err) {
        const error = new Error("Something went wrong! Try again later.");
        error.status = 500;
        return next(error);
    }
});
exports.changeNameHandler = changeNameHandler;
const changeLogoHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { changedLogoUrl } = req.body;
        const user = yield prisma.user.findFirst({
            where: { id: req.userID },
        });
        if (!user) {
            const error = new Error("Not authenticated!");
            error.status = 400;
            return next(error);
        }
        yield prisma.user.updateMany({
            data: { userAvatarImgUrl: changedLogoUrl },
            where: { id: req.userID },
        });
        res.status(201).json({
            status: "ok",
            data: { message: "User avatar logo updated successfully!" },
        });
    }
    catch (err) {
        const error = new Error("Something went wrong! Try again later.");
        error.status = 500;
        return next(error);
    }
});
exports.changeLogoHandler = changeLogoHandler;
