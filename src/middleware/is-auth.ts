import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ExtendedError } from "../types/types";

export const isAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return next(new ExtendedError("Not authenticated!", 403));
  }

  const token = authHeader.split(" ")[1];

  let decodedToken: jwt.JwtPayload | string;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_TOKEN as string);
    if (typeof decodedToken == "object" && decodedToken != null) {
      if (decodedToken.iat && decodedToken.exp) {
        if (decodedToken.exp < decodedToken.iat)
          return next(new ExtendedError("Not authenticated!", 403));
      }
      req.userID = decodedToken.userID;
    } else throw new ExtendedError("Something went wrong!", 403);

    next();
  } catch (err) {
    next(new ExtendedError("Something went wrong!", 500));
  }
};
