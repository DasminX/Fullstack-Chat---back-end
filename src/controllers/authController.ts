import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
  if (!validationErrorArr.isEmpty()) {
    const error: any = new Error(
      "Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)"
    );
    error.status = 422;
    return next(error);
  }

  try {
    const { login, password } = req.body as unknown as RequestAuthBodyType;

    /*     const foundUser = await prisma.user.findFirst({
      where: { login },
    });
    console.log(foundUser);

    if (foundUser) {
      const error: any = new Error("User with that login already exists!");
      error.status = 400;
      return next(error);
    } */

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
      const error: any = new Error("Something went wrong! Try again later.");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      status: "ok",
      data: { message: "User registered successfully!" },
    });
  } catch (e) {
    next(e);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { login, password } = req.body as unknown as RequestAuthBodyType;

    const user = await prisma.user.findFirst({ where: { login: login } });

    if (!user) {
      const error: any = new Error("User with that login not found!");
      error.status = 401;
      return next(error);
    }

    if (login !== "admin") {
      const isPasswordMatching = await bcrypt.compare(
        password,
        user.hashedPassword
      );

      if (!isPasswordMatching) {
        const error: any = new Error(
          "You entered a wrong password. Try again please."
        );
        error.status = 400;
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
  } catch (e) {
    console.log("wchodzi");
    console.log(e);
    next(e);
  }
};
