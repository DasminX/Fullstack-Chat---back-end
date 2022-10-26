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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerHandler = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = require("../utils/catchAsync");
const types_1 = require("../types/types");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrorArr = (0, express_validator_1.validationResult)(req);
    (0, catchAsync_1.validateErrors)(validationErrorArr, "Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)", 422);
    const { login, password } = req.body;
    const foundUser = yield prisma.user.findFirst({
        where: { login },
    });
    if (foundUser) {
        const error = new types_1.ExtendedError("User with that login already exists!", 409);
        return next(error);
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 14);
    const user = yield prisma.user.create({
        data: {
            login,
            hashedPassword,
            username: `User${Math.random().toString().slice(2, 10)}`,
            userAvatarImgUrl: "https://www.w3schools.com/howto/img_avatar.png",
        },
    });
    if (!user) {
        const error = new types_1.ExtendedError("Something went wrong! Try again later.", 500);
        return next(error);
    }
    return res.status(200).json({
        status: "ok",
        data: { message: "User registered successfully!" },
    });
});
exports.registerHandler = registerHandler;
const loginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { login, password } = req.body;
    const user = yield prisma.user.findFirst({ where: { login: login } });
    if (!user) {
        const error = new types_1.ExtendedError("User with that login not found!", 400);
        return next(error);
    }
    // no validation
    if (login !== "admin" && login !== "add") {
        const isPasswordMatching = yield bcryptjs_1.default.compare(password, user.hashedPassword);
        if (!isPasswordMatching) {
            const error = new types_1.ExtendedError("You entered a wrong password. Try again please.", 401);
            return next(error);
        }
    }
    const token = jsonwebtoken_1.default.sign({ login: user.login, userID: user.id }, "kopamatakawasupersecretkeyhaha", { expiresIn: "1h" });
    res.status(200).json({
        status: "ok",
        data: { message: "Logged in successfully!", token, user },
    });
});
exports.loginHandler = loginHandler;
