import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type RequestAuthBodyType = {
  email: string;
  password: string;
};

const prisma = new PrismaClient();

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as unknown as RequestAuthBodyType;

    const foundUser = await prisma.user.findFirst({
      where: { email },
    });

    if (foundUser) {
      const error: any = new Error("User with that e-mail already exists!");
      error.status = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 14);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        username: `User${Math.random().toString().slice(2, 11)}`,
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
    const { email, password } = req.body as unknown as RequestAuthBodyType;

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      const error: any = new Error("User with that e-mail not found!");
      error.status = 401;
      return next(error);
    }

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

    const token = jwt.sign(
      { email: user.email, userID: user.userID },
      "kopamatakawasupersecretkeyhaha",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "ok",
      data: { message: "Logged in successfully!", token },
    });
  } catch (e) {
    next(e);
  }
};
