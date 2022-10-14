export type CreateRoomType = {
  name: string;
  logoURL: string;
  isPrivate: boolean;
  roomPassword: string;
};

export class ExtendedError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
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
