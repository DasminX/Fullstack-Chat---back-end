"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types/types");
const isAuthMiddleware = (req, _res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return next(new types_1.ExtendedError("Not authenticated!", 403));
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN);
        if (typeof decodedToken == "object" && decodedToken != null) {
            if (decodedToken.iat && decodedToken.exp) {
                if (decodedToken.exp < decodedToken.iat)
                    return next(new types_1.ExtendedError("Not authenticated!", 403));
            }
            req.userID = decodedToken.userID;
        }
        else
            throw new types_1.ExtendedError("Something went wrong!", 403);
        next();
    }
    catch (err) {
        next(new types_1.ExtendedError("Something went wrong!", 500));
    }
};
exports.isAuthMiddleware = isAuthMiddleware;
