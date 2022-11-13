import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { ExtendedError } from "../types/types";
import { Response } from "express";

const prisma = new PrismaClient();

export const authCheckIfUserExists = async (
  next: NextFunction,
  login: string,
  requestType: "LOGIN" | "REGISTER"
) => {
  const user = await prisma.user.findFirst({
    where: { login },
  });

  if (!user) {
    return next(
      new ExtendedError("Something went wrong! Try again later.", 500)
    );
  }

  if (requestType === "REGISTER") {
    if (user.id) {
      return next(
        new ExtendedError("User with that login already exists!", 409)
      );
    }
  }

  if (requestType === "LOGIN") {
    if (!user.id) {
      return next(
        new ExtendedError("User with that login does not exist!", 400)
      );
    }
  }

  return user;
};
