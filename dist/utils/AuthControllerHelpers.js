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
exports.authCheckIfUserExists = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types/types");
const prisma = new client_1.PrismaClient();
const authCheckIfUserExists = (next, login, requestType) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: { login },
    });
    if (!user) {
        return next(new types_1.ExtendedError("Something went wrong! Try again later.", 500));
    }
    if (requestType === "REGISTER") {
        if (user.id) {
            return next(new types_1.ExtendedError("User with that login already exists!", 409));
        }
    }
    if (requestType === "LOGIN") {
        if (!user.id) {
            return next(new types_1.ExtendedError("User with that login does not exist!", 400));
        }
    }
    return user;
});
exports.authCheckIfUserExists = authCheckIfUserExists;
