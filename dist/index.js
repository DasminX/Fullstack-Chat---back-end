"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const socket_io_1 = require("socket.io");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// socket.io
// socket.io
// socket.io
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "OPTIONS"],
    },
});
io.on("connection", (socket) => {
    console.log(`user connected`);
    socket.on("send-message", (data) => {
        socket.broadcast.emit("receive-message", data);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
// api
// api
// api
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use("/api/auth", authRoute_1.default);
app.use("/api/rooms", roomRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use((error, _req, res, _next) => {
    const { status, message } = error;
    return res.status(status).json({
        status: "error",
        data: {
            message: message,
        },
    });
});
// SPRAWDZIC SCHEMAT PRISMY
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
server.listen(process.env.PORT || 3008);
