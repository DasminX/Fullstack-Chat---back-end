"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// import multer from "multer";
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const ioInstance_1 = require("./io/ioInstance");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({
    extended: true,
    limit: process.env.EXPRESS_URLENCODED_LIMIT,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "You exceeded limit of requests per hour. Please try again later.",
});
app.use(limiter);
// socket.io
const server = http_1.default.createServer(app);
const io = (0, ioInstance_1.getIoServer)(server);
app.use("/api/auth", authRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use((error, _req, res, _next) => {
    return res.status(error.statusCode || 500).json({
        status: "error",
        error,
    });
});
server.listen(process.env.PORT || 3008);
