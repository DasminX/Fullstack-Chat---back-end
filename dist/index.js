"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// import multer from "multer";
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const ioInstance_1 = require("./io/ioInstance");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({
    extended: true,
    limit: process.env.EXPRESS_URLENCODED_LIMIT,
}));
app.use(express_1.default.json());
// socket.io
// socket.io
// socket.io
const server = http_1.default.createServer(app);
const io = (0, ioInstance_1.getIoServer)(server);
app.use("/api/auth", authRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use((error, _req, res, _next) => {
    return res.status(error.statusCode || 500).json({
        status: "error",
        data: {
            message: error.message,
            stack: error.stack,
        },
    });
});
server.listen(process.env.PORT || 3008);
