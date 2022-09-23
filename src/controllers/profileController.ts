import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

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
  if (!validationErrorArr.isEmpty()) {
    const error: any = new Error("Something went wrong in VALIDATION");
    error.status = 422;
    return next(error);
  }

  try {
    const { changedName } = req.body as unknown as RequestProfileBodyType;

    const user = await prisma.user.findFirst({
      where: { userID: req.userID },
    });

    if (!user) {
      const error: any = new Error("Not authenticated!");
      error.status = 400;
      return next(error);
    }

    const updatedUser = await prisma.user.update({
      data: { username: changedName },
      where: { userID: req.userID },
    });

    res.status(201).json({
      status: "ok",
      data: {
        message: "Username updated successfully!",
        username: updatedUser.username,
      },
    });
  } catch (err) {
    const error: any = new Error("Something went wrong! Try again later.");
    error.status = 500;
    return next(error);
  }
};

export const changeLogoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { changedLogoUrl } = req.body as unknown as RequestProfileBodyType;

    const user = await prisma.user.findFirst({
      where: { userID: req.userID },
    });

    if (!user) {
      const error: any = new Error("Not authenticated!");
      error.status = 400;
      return next(error);
    }

    await prisma.user.updateMany({
      data: { userAvatarImgUrl: changedLogoUrl },
      where: { userID: req.userID },
    });

    res.status(201).json({
      status: "ok",
      data: { message: "User avatar logo updated successfully!" },
    });
  } catch (err) {
    const error: any = new Error("Something went wrong! Try again later.");
    error.status = 500;
    return next(error);
  }
};
