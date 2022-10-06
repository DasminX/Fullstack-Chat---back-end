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
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validationErrorArr = (0, express_validator_1.validationResult)(req);
    if (!validationErrorArr.isEmpty()) {
        const error = new Error("Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)");
        error.status = 422;
        return next(error);
    }
    try {
        const { login, password } = req.body;
        /*
        const foundUser = await prisma.user.findFirst({
          where: { login },
        }); */
        const foundUser = yield prisma.user.findFirst({ where: { login } });
        console.log(foundUser);
        if (foundUser) {
            const error = new Error("User with that login already exists!");
            error.status = 400;
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
            const error = new Error("Something went wrong! Try again later.");
            error.status = 404;
            return next(error);
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
        const user = yield prisma.user.findFirst({ where: { login: login } });
        if (!user) {
            const error = new Error("User with that login not found!");
            error.status = 401;
            return next(error);
        }
        const isPasswordMatching = yield bcryptjs_1.default.compare(password, user.hashedPassword);
        if (!isPasswordMatching) {
            const error = new Error("You entered a wrong password. Try again please.");
            error.status = 400;
            return next(error);
        }
        const token = jsonwebtoken_1.default.sign({ login: user.login, userID: user.id }, "kopamatakawasupersecretkeyhaha", { expiresIn: "1h" });
        res.status(200).json({
            status: "ok",
            data: { message: "Logged in successfully!", token, user },
        });
    }
    catch (e) {
        console.log("wchodzi");
        console.log(e);
        next(e);
    }
});
exports.loginHandler = loginHandler;
