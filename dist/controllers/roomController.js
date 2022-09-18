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
exports.createRoomHandler = exports.getRoomsHandler = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRoomsHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roomsQuery = prisma.room;
    const roomsLength = yield roomsQuery.count();
    const rooms = yield roomsQuery.findMany();
    if (roomsLength === 0) {
        return res.status(200).json({
            status: "ok",
            data: {
                message: "No rooms found. Create the first one!",
                rooms: null,
                roomsLength,
            },
        });
    }
    if (!rooms) {
        const error = new Error("Something went wrong! Try again later.");
        error.status = 500;
        return next(error);
    }
    return res.status(200).json({
        status: "ok",
        data: { message: "Rooms successfully fetched!", rooms, roomsLength },
    });
});
exports.getRoomsHandler = getRoomsHandler;
const createRoomHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const doesRoomExist = (yield prisma.room.findMany({ where: { name } })).find((el) => el.name === name);
        if (doesRoomExist) {
            const error = new Error("Room with that name already exists! Choose different one.");
            error.status = 400;
            return next(error);
        }
        const room = yield prisma.room.create({ data: { name } });
        return res.status(200).json({
            status: "ok",
            data: { message: "Room successfully created!", room },
        });
    }
    catch (connectionError) {
        const error = new Error("Something went wrong! Try again later.");
        error.status = 500;
        return next(error);
    }
});
exports.createRoomHandler = createRoomHandler;
