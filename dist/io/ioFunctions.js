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
exports.addMessageToRoomDB = exports.getRoomMessages = exports.leaveRoomHandler = exports.enterRoomHandler = exports.checkRoomHasAPassword = exports.createRoomHandler = exports.getRoomsHandler = void 0;
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
        const allRooms = yield prisma.room.findMany();
        if (!allRooms)
            throw new Error("Something went wrong! Try again later.");
        return allRooms;
    }
    catch (err) {
        console.log(err);
    }
});
exports.createRoomHandler = createRoomHandler;
const checkRoomHasAPassword = (clickedRoomID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield prisma.room.findFirst({
            where: { id: clickedRoomID },
            select: { roomPassword: true },
        });
        if (!room)
            throw new Error("Something went wrong! Try again later!");
        return room.roomPassword;
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkRoomHasAPassword = checkRoomHasAPassword;
const enterRoomHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clickedRoomID, currentUserID } = data;
        const user = yield prisma.user.findFirst({
            where: { id: currentUserID },
            select: { id: true, username: true },
        });
        if (!user)
            throw new Error("Something went wrong! Try again later!");
        const room = yield prisma.room.findFirst({
            where: { id: clickedRoomID },
            select: { name: true, activeUsersIDs: true },
        });
        if (!room)
            throw new Error("Something went wrong! Try again later!");
        const updatedRoom = yield prisma.room.update({
            where: { name: room.name },
            data: { activeUsersIDs: { set: [...room.activeUsersIDs, user.id] } },
        });
        return { joiningRoom: updatedRoom, username: user.username };
    }
    catch (err) {
        console.log(err);
    }
});
exports.enterRoomHandler = enterRoomHandler;
const leaveRoomHandler = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomID, currentUserID } = data;
        const foundRoom = yield prisma.room.findFirst({
            where: { id: roomID },
        });
        if (!foundRoom)
            throw new Error("Something went wrong! Try again later!");
        const updatedActiveUsersIDs = foundRoom.activeUsersIDs.filter((id) => id !== currentUserID);
        const leavingRoom = yield prisma.room.update({
            where: { id: foundRoom.id },
            data: { activeUsersIDs: updatedActiveUsersIDs },
        });
        const userWhoLeft = yield prisma.user.findFirst({
            where: { id: currentUserID },
            select: { username: true },
        });
        if (!userWhoLeft)
            throw new Error("Something went wrong! Try again later!");
        return { leavingRoom, userWhoLeft };
    }
    catch (err) {
        console.log(err);
    }
});
exports.leaveRoomHandler = leaveRoomHandler;
const getRoomMessages = (roomID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundRoom = yield prisma.room.findFirst({
            where: { id: roomID },
            include: {
                roomMsgArr: {
                    include: { sendByUser: { select: { userAvatarImgUrl: true } } },
                },
            },
        });
        if (!foundRoom)
            throw new Error("Something went wrong! Try again later!");
        const newMsgArr = foundRoom.roomMsgArr.map((room) => {
            return {
                id: room.id,
                sendByUserID: room.sendByUserID,
                sendByUserLogo: room.sendByUser.userAvatarImgUrl,
                sendDate: room.sendDate,
                sendInRoomID: room.sendInRoomID,
                textMessage: room.textMessage,
            };
        });
        return newMsgArr;
    }
    catch (err) {
        console.log(err);
    }
    // get room messages searching by room ID
});
exports.getRoomMessages = getRoomMessages;
const addMessageToRoomDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { textMessage, id, sendInRoomID, sendByUserID } = data;
        const createdMessage = yield prisma.message.create({
            data: {
                id: id.toString(),
                textMessage,
                sendByUserID,
                sendInRoomID,
            },
        });
        if (!createdMessage)
            throw new Error("Something went wrong! Try again later!");
        return createdMessage;
    }
    catch (err) {
        console.log(err);
    }
});
exports.addMessageToRoomDB = addMessageToRoomDB;
