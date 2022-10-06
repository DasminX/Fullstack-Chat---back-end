import { PrismaClient } from "@prisma/client";

type CreateRoomType = {
  name: string;
  logoURL: string;
  isPrivate: boolean;
  roomPassword: string;
};

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

    return createdRoom;
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

    return updatedRoom;
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

    const leftRoom = await prisma.room.update({
      where: { id: foundRoom.id },
      data: { activeUsersIDs: updatedActiveUsersIDs },
    });

    return leftRoom;
  } catch (err) {
    console.log(err);
  }
};

export const getRoomMessages = async (data: { roomID: string }) => {
  try {
    const { roomID } = data;

    const foundRoom = await prisma.room.findFirst({
      where: { id: roomID },
    });

    if (!foundRoom) throw new Error("Something went wrong! Try again later!");

    console.log(foundRoom);
    return foundRoom;
  } catch (err) {
    console.log(err);
  }
  // get room messages searching by room ID
};

export const addMessageToRoomDB = async (
  data: { textMessage: string; id: number },
  roomID: string,
  userID: string
) => {
  try {
    const { textMessage, id } = data;

    const createdMessage = await prisma.message.create({
      data: {
        id: id.toString(),
        textMessage,
        sendByUserID: userID,
        sendInRoomID: roomID,
      },
    });

    if (!createdMessage)
      throw new Error("Something went wrong! Try again later!");

    return createdMessage;
  } catch (err) {
    console.log(err);
  }
};
