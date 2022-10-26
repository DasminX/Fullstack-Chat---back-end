import { PrismaClient } from "@prisma/client";
import { CreateRoomType } from "../types/types";

const prisma = new PrismaClient();

export const getRoomsHandler = async () => {
  try {
    const rooms = await prisma.room.findMany();

    if (rooms.length === 0) {
      return "No rooms found. Create the first one!";
    }

    if (!rooms) {
      throw new Error("Something went wrong! Try again later.");
    }

    return rooms;
  } catch (err) {
    console.log(err);
  }
};

export const createRoomHandler = async (data: CreateRoomType) => {
  try {
    const { name, logoURL, isPrivate, roomPassword } = data;

    const doesRoomExist = (
      await prisma.room.findMany({ where: { name } })
    ).find((el) => el.name === name);

    if (doesRoomExist) {
      throw new Error(
        "Room with that name already exists! Choose different one."
      );
    }

    const createdRoom = await prisma.room.create({
      data: { name, logoURL, isPrivate, roomPassword },
    });

    if (!createdRoom) throw new Error("Something went wrong! Try again later.");

    const allRooms = await prisma.room.findMany();

    if (!allRooms) throw new Error("Something went wrong! Try again later.");

    return allRooms;
  } catch (err) {
    console.log(err);
  }
};

export const checkRoomHasAPassword = async (clickedRoomID: string) => {
  try {
    const room = await prisma.room.findFirst({
      where: { id: clickedRoomID },
      select: { roomPassword: true, isPrivate: true },
    });

    if (!room) throw new Error("Something went wrong! Try again later!");

    return { password: room.roomPassword, isPrivate: room.isPrivate };
  } catch (err) {
    console.log(err);
  }
};

export const enterRoomHandler = async (data: {
  currentUserID: string;
  clickedRoomID: string;
}) => {
  try {
    const { clickedRoomID, currentUserID } = data;

    const user = await prisma.user.findFirst({
      where: { id: currentUserID },
      select: { id: true, username: true },
    });

    if (!user) throw new Error("Something went wrong! Try again later!");

    const room = await prisma.room.findFirst({
      where: { id: clickedRoomID },
      select: { name: true, activeUsersIDs: true },
    });

    if (!room) throw new Error("Something went wrong! Try again later!");

    const updatedRoom = await prisma.room.update({
      where: { name: room.name },
      data: { activeUsersIDs: { set: [...room.activeUsersIDs, user.id] } },
    });

    return { joiningRoom: updatedRoom, username: user.username };
  } catch (err) {
    console.log(err);
  }
};

export const leaveRoomHandler = async (data: {
  roomID: string;
  currentUserID: string;
}) => {
  try {
    const { roomID, currentUserID } = data;

    const foundRoom = await prisma.room.findFirst({
      where: { id: roomID },
    });

    if (!foundRoom) throw new Error("Something went wrong! Try again later!");

    const updatedActiveUsersIDs = foundRoom.activeUsersIDs.filter(
      (id) => id !== currentUserID
    );

    const leavingRoom = await prisma.room.update({
      where: { id: foundRoom.id },
      data: { activeUsersIDs: updatedActiveUsersIDs },
    });

    const userWhoLeft = await prisma.user.findFirst({
      where: { id: currentUserID },
      select: { username: true },
    });

    if (!userWhoLeft) throw new Error("Something went wrong! Try again later!");

    return { leavingRoom, userWhoLeft };
  } catch (err) {
    console.log(err);
  }
};

export const getRoomMessages = async (roomID: string) => {
  try {
    const foundRoom = await prisma.room.findFirst({
      where: { id: roomID },
      include: {
        roomMsgArr: {
          include: { sendByUser: { select: { userAvatarImgUrl: true } } },
        },
      },
    });

    if (!foundRoom) throw new Error("Something went wrong! Try again later!");

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
  } catch (err) {
    console.log(err);
  }
  // get room messages searching by room ID
};

export const addMessageToRoomDB = async (data: {
  id: number;
  sendByUserID: string;
  sendInRoomID: string;
  textMessage: string;
  sendDate: string;
}) => {
  try {
    const { textMessage, id, sendInRoomID, sendByUserID } = data;

    const createdMessage = await prisma.message.create({
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
  } catch (err) {
    console.log(err);
  }
};
