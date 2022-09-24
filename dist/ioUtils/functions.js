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
exports.enterRoomHandler = exports.createRoomHandler = exports.getRoomsHandler = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRoomsHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma.room.findMany();
        if (rooms.length === 0) {
            return "No rooms found. Create the first one!";
        }
        if (!rooms) {
            throw new Error("Something went wrong! Try again later.");
        }
        return rooms;
    }
    catch (err) {
        console.log(err);
    }
});
exports.getRoomsHandler = getRoomsHandler;
const createRoomHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, logoURL, isPrivate, roomPassword } = data;
        const doesRoomExist = (yield prisma.room.findMany({ where: { name } })).find((el) => el.name === name);
        if (doesRoomExist) {
            throw new Error("Room with that name already exists! Choose different one.");
        }
        const createdRoom = yield prisma.room.create({
            data: { name, logoURL, isPrivate, roomPassword },
        });
        if (!createdRoom)
            throw new Error("Something went wrong! Try again later.");
        return createdRoom;
    }
    catch (err) {
        console.log(err);
    }
});
exports.createRoomHandler = createRoomHandler;
const enterRoomHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomID, currentUserID } = data;
        const user = yield prisma.user.findFirst({
            where: { userID: currentUserID },
        });
        if (!user)
            throw new Error("Something went wrong! Try again later!");
        const room = yield prisma.room.findFirst({
            where: { roomID },
        });
        if (!room)
            throw new Error("Something went wrong! Try again later!");
        let updatedActiveUsersIDs = [];
        if (room.activeUsersIDs && Array.isArray(room.activeUsersIDs)) {
            updatedActiveUsersIDs = [...room.activeUsersIDs, user.userID];
        }
        else {
            updatedActiveUsersIDs.push(user.userID);
        }
        yield prisma.room.update({
            where: { roomID: room.roomID },
            data: { activeUsersIDs: updatedActiveUsersIDs, User: { set: user } },
        });
        return "Successfully joined the room!";
    }
    catch (err) {
        console.log(err);
    }
});
exports.enterRoomHandler = enterRoomHandler;
