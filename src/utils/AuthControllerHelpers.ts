import { PrismaClient } from "@prisma/client";
import { authCheckIfUsersExistsFuncType, ExtendedError } from "../types/types";

const prisma = new PrismaClient();

export const authCheckIfUserExists: authCheckIfUsersExistsFuncType = async (
  next,
  login,
  requestType
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
