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
const prisma = new client_1.PrismaClient();
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield prisma.user.findFirst({
            where: { email },
        });
        if (foundUser) {
            const error = new Error("User with that e-mail already exists!");
            error.status = 400;
            return next(error);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 14);
        const user = yield prisma.user.create({
            data: {
                email,
                hashedPassword,
                username: `User${Math.random().toString().slice(2, 11)}`,
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
        const { email, password } = req.body;
        const user = yield prisma.user.findFirst({ where: { email } });
        if (!user) {
            const error = new Error("User with that e-mail not found!");
            error.status = 401;
            return next(error);
        }
        const isPasswordMatching = yield bcryptjs_1.default.compare(password, user.hashedPassword);
        if (!isPasswordMatching) {
            const error = new Error("You entered a wrong password. Try again please.");
            error.status = 400;
            return next(error);
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, userID: user.userID }, "kopamatakawasupersecretkeyhaha", { expiresIn: "1h" });
        res.status(200).json({
            status: "ok",
            data: { message: "Logged in successfully!", token },
        });
    }
    catch (e) {
        next(e);
    }
});
exports.loginHandler = loginHandler;
