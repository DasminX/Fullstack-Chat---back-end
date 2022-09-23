"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthMiddleware = (req, _res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not authenticated!");
        error.status = 401;
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, "kopamatakawasupersecretkeyhaha");
    }
    catch (err) {
        const error = new Error("Something went wrong!");
        error.status = 500;
        return next(error);
    }
    if (!decodedToken) {
        const error = new Error("Not authenticated!");
        error.status = 401;
        return next(error);
    }
    if (typeof decodedToken === "string") {
        req.userID = decodedToken;
    }
    else {
        req.userID = decodedToken.userID;
    }
    next();
};
exports.isAuthMiddleware = isAuthMiddleware;
