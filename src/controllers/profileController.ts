import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ExtendedError } from "../types/types";
import { validateErrors } from "../utils/catchAsync";

const prisma = new PrismaClient();

type RequestProfileBodyType = {
  changedName?: string;
  changedLogoUrl?: string;
};

export const changeNameHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrorArr = validationResult(req);
  validateErrors(validationErrorArr, "Something went wrong in VALIDATION", 400);

  const { changedName } = req.body as unknown as RequestProfileBodyType;

  const user = await prisma.user.findFirst({
    where: { id: req.userID },
  });

  if (!user) {
    const error: any = new ExtendedError("Not authenticated!", 401);
    return next(error);
  }

  const updatedUser = await prisma.user.update({
    data: { username: changedName },
    where: { id: req.userID },
  });

  res.status(201).json({
    status: "ok",
    data: {
      message: "Username updated successfully!",
      username: updatedUser.username,
    },
  });
};

export const changeLogoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrorArr = validationResult(req);
  validateErrors(validationErrorArr, "Something went wrong in VALIDATION", 400);

  const { changedLogoUrl } = req.body as unknown as RequestProfileBodyType;

  const user = await prisma.user.findFirst({
    where: { id: req.userID },
  });

  if (!user) {
    const error: any = new ExtendedError("Not authenticated!", 401);
    return next(error);
  }

  await prisma.user.update({
    data: { userAvatarImgUrl: changedLogoUrl },
    where: { id: req.userID },
  });

  res.status(201).json({
    status: "ok",
    data: { message: "User avatar logo updated successfully!" },
  });
};
