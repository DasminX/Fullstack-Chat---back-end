import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { ExtendedError } from "../types/types";
import { Response } from "express";

const prisma = new PrismaClient();

export const checkIfUserExists = async (next: NextFunction, userID: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userID },
    select: { id: true },
  });

  if (!user) {
    return next(
      new ExtendedError("Something went wrong! Try again later.", 500)
    );
  }
};

export const updateUser = async (
  res: Response,
  next: NextFunction,
  userID: string,
  dataToBeChanged: any,
  keyWord: string
) => {
  const updatedUser = await prisma.user.update({
    data: dataToBeChanged,
    where: { id: userID },
  });

  if (!updatedUser) {
    return next(
      new ExtendedError("Something went wrong! Try again later.", 500)
    );
  }

  res.status(201).json({
    status: "ok",
    data: {
      message: `${keyWord} updated successfully!`,
      updatedUser,
    },
  });
};
