import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
// import multer from "multer";
import { Server } from "socket.io";

import authRouter from "./routes/authRoute";
import profileRouter from "./routes/profileRoute";

import {
  getRoomsHandler,
  createRoomHandler,
  enterRoomHandler,
  leaveRoomHandler,
  getRoomMessages,
  addMessageToRoomDB,
} from "./io/ioFunctions";
import { getIoServer } from "./io/ioInstance";
import { ExtendedError } from "socket.io/dist/namespace";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// socket.io
// socket.io
// socket.io
const server = http.createServer(app);

const io = getIoServer(server);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(
  (error: ExtendedError, _req: Request, res: Response, _next: NextFunction) => {
    // dorobic extended Error class :)
    // const { statusCode, message } = error;
    // return res.status(statusCode || 500).json({
    // status: "error",
    // data: {
    //   message: message,
    // },
    // });
  }
);

// SPRAWDZIC SCHEMAT PRISMY

// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING

server.listen(process.env.PORT || 3008);
