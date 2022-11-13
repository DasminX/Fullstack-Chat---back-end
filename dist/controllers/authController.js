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
const types_1 = require("../types/types");
const express_validator_1 = require("express-validator");
const validateErrors_1 = require("../utils/validateErrors");
const AuthControllerHelpers_1 = require("../utils/AuthControllerHelpers");
const prisma = new client_1.PrismaClient();
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationErrorArr = (0, express_validator_1.validationResult)(req);
        (0, validateErrors_1.validateErrors)(validationErrorArr, "Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)", next);
        const { login, password } = req.body;
        yield (0, AuthControllerHelpers_1.authCheckIfUserExists)(next, login, "REGISTER");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = yield prisma.user.create({
            data: {
                login,
                hashedPassword,
                username: `User${Math.random().toString().slice(2, 10)}`,
                userAvatarImgUrl: "https://www.w3schools.com/howto/img_avatar.png",
            },
        });
        if (!user) {
            return next(new types_1.ExtendedError("Something went wrong! Try again later.", 500));
        }
        return res.status(200).json({
            status: "ok",
            data: { message: "User registered successfully!" },
        });
    }
    catch (e) {
        next(e);
    }
});
exports.registerHandler = registerHandler;
const loginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { login, password } = req.body;
        const user = yield (0, AuthControllerHelpers_1.authCheckIfUserExists)(next, login, "LOGIN");
        if (login !== "admin" && login !== "add") {
            const isPasswordMatching = yield bcryptjs_1.default.compare(password, user.hashedPassword);
            if (!isPasswordMatching) {
                return next(new types_1.ExtendedError("You entered a wrong login or password. Try again please.", 401));
            }
        }
        const token = jsonwebtoken_1.default.sign({ login: user.login, userID: user.id }, process.env.SECRET_TOKEN, { expiresIn: process.env.SECRET_TOKEN_EXPIRES_IN });
        res.status(200).json({
            status: "ok",
            data: { message: "Logged in successfully!", token, user },
        });
    }
    catch (e) {
        next(e);
    }
});
exports.loginHandler = loginHandler;
