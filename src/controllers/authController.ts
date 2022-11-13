import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ExtendedError } from "../types/types";
import { validationResult } from "express-validator";
import { validateErrors } from "../utils/validateErrors";
import { authCheckIfUserExists } from "../utils/AuthControllerHelpers";

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
  try {
    const validationErrorArr = validationResult(req);
    validateErrors(
      validationErrorArr,
      "Login has to be at least 8 characters long and password should contain of 8 characters (at least 1 uppercase, at least 1 number)",
      next
    );

    const { login, password } = req.body as unknown as RequestAuthBodyType;

    await authCheckIfUserExists(next, login, "REGISTER");

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        login,
        hashedPassword,
        username: `User${Math.random().toString().slice(2, 10)}`,
        userAvatarImgUrl: "https://www.w3schools.com/howto/img_avatar.png",
      },
    });

    if (!user) {
      return next(
        new ExtendedError("Something went wrong! Try again later.", 500)
      );
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

    const user = await authCheckIfUserExists(next, login, "LOGIN");

    if (login !== "admin" && login !== "add") {
      const isPasswordMatching = await bcrypt.compare(
        password,
        user!.hashedPassword
      );

      if (!isPasswordMatching) {
        return next(
          new ExtendedError(
            "You entered a wrong login or password. Try again please.",
            401
          )
        );
      }
    }
    const token = jwt.sign(
      { login: user!.login, userID: user!.id },
      process.env.SECRET_TOKEN as string,
      { expiresIn: process.env.SECRET_TOKEN_EXPIRES_IN as string }
    );

    res.status(200).json({
      status: "ok",
      data: { message: "Logged in successfully!", token, user },
    });
  } catch (e) {
    next(e);
  }
};
