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
  roomID: string;
  currentUserID: string;
}) => {
  try {
    const { roomID, currentUserID } = data;

    const user = await prisma.user.findFirst({
      where: { userID: currentUserID },
    });

    if (!user) throw new Error("Something went wrong! Try again later!");

    const room = await prisma.room.findFirst({
      where: { roomID },
    });

    if (!room) throw new Error("Something went wrong! Try again later!");

    let updatedActiveUsersIDs: string[] = [];

    if (room.activeUsersIDs && Array.isArray(room.activeUsersIDs)) {
      updatedActiveUsersIDs = [...room.activeUsersIDs, user.userID];
    } else {
      updatedActiveUsersIDs.push(user.userID);
    }

    const updatedRoom = await prisma.room.update({
      where: { roomID: room.roomID },
      data: { activeUsersIDs: updatedActiveUsersIDs },
    });

    return updatedRoom;
  } catch (err) {
    console.log(err);
  }
};

export const leaveRoomHandler = async (data: {
  currentUserID: string;
  roomID: string;
}) => {
  try {
    const { currentUserID, roomID } = data;

    const foundRoom = await prisma.room.findFirst({
      where: { roomID },
    });

    if (!foundRoom) throw new Error("Something went wrong! Try again later!");
    console.log(foundRoom.activeUsersIDs);

    const updatedActiveUsersIDs = foundRoom.activeUsersIDs.filter(
      (id) => id !== currentUserID
    );

    console.log(updatedActiveUsersIDs);

    await prisma.room.update({
      where: { roomID },
      data: { activeUsersIDs: updatedActiveUsersIDs },
    });

    return "Succesfully updated!";
  } catch (err) {
    console.log(err);
  }
};
