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
exports.getIoServer = void 0;
const socket_io_1 = require("socket.io");
const ioFunctions_1 = require("./ioFunctions"); //prettier-ignore
const getIoServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST", "OPTIONS"],
        },
    });
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        const initialRooms = yield (0, ioFunctions_1.getRoomsHandler)();
        socket.emit("sendingInitialRooms", initialRooms);
        socket.on("roomAdded", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const allRooms = yield (0, ioFunctions_1.createRoomHandler)(data);
            io.emit("sendingUpdatedRooms", allRooms);
        }));
        socket.on("joiningRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const joiningRoom = yield (0, ioFunctions_1.enterRoomHandler)(data);
            socket.join(joiningRoom.id);
            // io.to(joiningRoom!.roomID).emit("userJoined", "userID"); // dorobic pokazywanie ktory user z jakim nickiem dolaczyl do pokoju
            socket.emit("joinedRoom", joiningRoom);
        }));
        socket.on("leavingRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const leavingRoom = yield (0, ioFunctions_1.leaveRoomHandler)(data);
            socket.leave(leavingRoom.id);
            // io.to(leavingRoom!.roomID).emit("userLeft", "userID"); // dorobic pokazywanie ktory user z jakim nickiem opuscil pokoj
            socket.emit("leftRoom");
        }));
        socket.on("getInitialMessages", (roomID) => __awaiter(void 0, void 0, void 0, function* () {
            const roomMessages = yield (0, ioFunctions_1.getRoomMessages)(roomID);
            io.to(roomID).emit("fetchedInitialMessages", roomMessages);
            // socket.emit("fetchedInitialMessages", roomMessages);
        }));
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const sentMessage = yield (0, ioFunctions_1.addMessageToRoomDB)(data);
            const { sendByUserLogo } = data;
            socket.broadcast.emit("receiveMessage", sentMessage, sendByUserLogo);
        }));
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    }));
    return io;
};
exports.getIoServer = getIoServer;
