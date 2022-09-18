import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

type RequestRoomBodyType = {
  name: string;
};

export const getRoomsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const roomsQuery = prisma.room;

  const roomsLength = await roomsQuery.count();
  const rooms = await roomsQuery.findMany();

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
    const error: any = new Error("Something went wrong! Try again later.");
    error.status = 500;
    return next(error);
  }

  return res.status(200).json({
    status: "ok",
    data: { message: "Rooms successfully fetched!", rooms, roomsLength },
  });
};

export const createRoomHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrorArr = validationResult(req);
  if (!validationErrorArr.isEmpty()) {
    const error: any = new Error("Something went wrong in VALIDATION");
    error.status = 422;
    return next(error);
  }
  try {
    const { name } = req.body as unknown as RequestRoomBodyType;

    const doesRoomExist = (
      await prisma.room.findMany({ where: { name } })
    ).find((el) => el.name === name);

    if (doesRoomExist) {
      const error: any = new Error(
        "Room with that name already exists! Choose different one."
      );
      error.status = 400;
      return next(error);
    }

    const room = await prisma.room.create({ data: { name } });

    return res.status(200).json({
      status: "ok",
      data: { message: "Room successfully created!", room },
    });
  } catch (connectionError) {
    const error: any = new Error("Something went wrong! Try again later.");
    error.status = 500;
    return next(error);
  }
};
