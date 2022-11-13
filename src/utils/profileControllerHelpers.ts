import { PrismaClient } from "@prisma/client";
import {
  checkIfUserExistsFuncType,
  ExtendedError,
  updateUserFuncType,
} from "../types/types";

const prisma = new PrismaClient();

export const checkIfUserExists: checkIfUserExistsFuncType = async (
  next,
  userID
) => {
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

export const updateUser: updateUserFuncType = async (
  res,
  next,
  userID,
  dataToBeChanged,
  keyWord
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
