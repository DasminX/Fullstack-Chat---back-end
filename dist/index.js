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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const socket_io_1 = require("socket.io");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const room_1 = require("./ioUtils/room");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
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
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`user connected`);
    const initialRooms = yield (0, room_1.getRoomsHandler)();
    socket.emit("sending rooms", initialRooms);
    socket.on("room added", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_1.createRoomHandler)(data);
        const updatedAllRooms = yield (0, room_1.getRoomsHandler)();
        socket.emit("sending rooms", updatedAllRooms);
    }));
    socket.on("join room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const enteringRoom = yield (0, room_1.enterRoomHandler)(data);
        socket.emit("entered room", enteringRoom);
    }));
    socket.on("leave room", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, room_1.leaveRoomHandler)(data);
        socket.emit("left room");
    }));
    socket.on("send-message", (data) => {
        socket.broadcast.emit("receive-message", data);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
}));
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
