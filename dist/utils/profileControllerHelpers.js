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
exports.updateUser = exports.checkIfUserExists = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types/types");
const prisma = new client_1.PrismaClient();
const checkIfUserExists = (next, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({
        where: { id: userID },
        select: { id: true },
    });
    if (!user) {
        return next(new types_1.ExtendedError("Something went wrong! Try again later.", 500));
    }
});
exports.checkIfUserExists = checkIfUserExists;
const updateUser = (res, next, userID, dataToBeChanged, keyWord) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prisma.user.update({
        data: dataToBeChanged,
        where: { id: userID },
    });
    if (!updatedUser) {
        return next(new types_1.ExtendedError("Something went wrong! Try again later.", 500));
    }
    res.status(201).json({
        status: "ok",
        data: {
            message: `${keyWord} updated successfully!`,
            updatedUser,
        },
    });
});
exports.updateUser = updateUser;
