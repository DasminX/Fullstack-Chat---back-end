export type CreateRoomType = {
  name: string;
  logoURL: string;
  isPrivate: boolean;
  roomPassword: string;
};

export class ExtendedError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

/* 
export class ExtendedError extends Error {
  constructor(message,statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}
 */
