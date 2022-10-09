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
const cors_1 = __importDefault(require("cors"));
// import multer from "multer";
const socket_io_1 = require("socket.io");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const room_1 = require("./ioUtils/room");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// app.use("/images", express.static(`${__dirname}/images`));
// const fileStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "images");
//   },
//   filename: function (req, file, callback) {
//     callback(null, `${file.filename}-${Math.random().toString().slice(2, 10)}`);
//   },
// });
// app.use(multer({ storage: fileStorage }).any());
// socket.io
// socket.io
// socket.io
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "OPTIONS", "PUT"],
    },
});
// klasa, command handler z enumem
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const initialRooms = yield (0, room_1.getRoomsHandler)();
    socket.emit("sendingInitialRooms", initialRooms);
    socket.on("roomAdded", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const allRooms = yield (0, room_1.createRoomHandler)(data);
        io.emit("sendingUpdatedRooms", allRooms);
    }));
    socket.on("joiningRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const joiningRoom = yield (0, room_1.enterRoomHandler)(data);
        socket.join(joiningRoom.id);
        // io.to(joiningRoom!.roomID).emit("userJoined", "userID"); // dorobic pokazywanie ktory user z jakim nickiem dolaczyl do pokoju
        socket.emit("joinedRoom", joiningRoom);
    }));
    socket.on("leavingRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const leavingRoom = yield (0, room_1.leaveRoomHandler)(data);
        socket.leave(leavingRoom.id);
        // io.to(leavingRoom!.roomID).emit("userLeft", "userID"); // dorobic pokazywanie ktory user z jakim nickiem opuscil pokoj
        socket.emit("leftRoom");
    }));
    socket.on("getInitialMessages", (roomID) => __awaiter(void 0, void 0, void 0, function* () {
        const roomMessages = yield (0, room_1.getRoomMessages)(roomID);
        io.to(roomID).emit("fetchedInitialMessages", roomMessages);
        // socket.emit("fetchedInitialMessages", roomMessages);
    }));
    socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const sentMessage = yield (0, room_1.addMessageToRoomDB)(data);
        const { sendByUserLogo } = data;
        socket.broadcast.emit("receiveMessage", sentMessage, sendByUserLogo);
    }));
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
}));
// api
// api
// api
app.use("/api/auth", authRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
app.use((error, _req, res, _next) => {
    const { status, message } = error;
    return res.status(status || 500).json({
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
