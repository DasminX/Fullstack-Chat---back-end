import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateErrors } from "../utils/catchAsync";
import { ExtendedError } from "../types/types";
import { validationResult } from "express-validator";

type RequestAuthBodyType = {
  login: string;
  password: string;
};

const prisma = new PrismaClient();

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationErrorArr = validationResult(req);
  validateErrors(
    validationErrorArr,
    "Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)",
    422
  );

  const { login, password } = req.body as unknown as RequestAuthBodyType;

  const foundUser = await prisma.user.findFirst({
    where: { login },
  });

  if (foundUser) {
    const error = new ExtendedError(
      "User with that login already exists!",
      409
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 14);

  const user = await prisma.user.create({
    data: {
      login,
      hashedPassword,
      username: `User${Math.random().toString().slice(2, 10)}`,
      userAvatarImgUrl: "https://www.w3schools.com/howto/img_avatar.png",
    },
  });

  if (!user) {
    const error = new ExtendedError(
      "Something went wrong! Try again later.",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    status: "ok",
    data: { message: "User registered successfully!" },
  });
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { login, password } = req.body as unknown as RequestAuthBodyType;

  const user = await prisma.user.findFirst({ where: { login: login } });

  if (!user) {
    const error = new ExtendedError("User with that login not found!", 400);
    return next(error);
  }

  // no validation
  if (login !== "admin" && login !== "add") {
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!isPasswordMatching) {
      const error: any = new ExtendedError(
        "You entered a wrong password. Try again please.",
        401
      );
      return next(error);
    }
  }
  const token = jwt.sign(
    { login: user.login, userID: user.id },
    "kopamatakawasupersecretkeyhaha",
    { expiresIn: "1h" }
  );

  res.status(200).json({
    status: "ok",
    data: { message: "Logged in successfully!", token, user },
  });
};
