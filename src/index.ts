import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import { Server } from "socket.io";

import authRouter from "./routes/authRoute";
import profileRouter from "./routes/profileRoute";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import {
  getRoomsHandler,
  createRoomHandler,
  enterRoomHandler,
  leaveRoomHandler,
} from "./ioUtils/room";
import { create } from "domain";

const prisma = new PrismaClient();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// socket.io
// socket.io
// socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

io.on("connection", async (socket) => {
  console.log(`user connected`);
  const initialRooms = await getRoomsHandler();

  socket.emit("sending rooms", initialRooms);

  socket.on("room added", async (data) => {
    await createRoomHandler(data);
    const updatedAllRooms = await getRoomsHandler();
    socket.emit("sending rooms", updatedAllRooms);
  });

  socket.on("join room", async (data) => {
    const enteringRoom = await enterRoomHandler(data);
    socket.emit("entered room", enteringRoom);
  });

  socket.on("leave room", async (data) => {
    await leaveRoomHandler(data);
    socket.emit("left room");
  });

  socket.on("send-message", (data) => {
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// api
// api
// api
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = error;
  return res.status(status).json({
    status: "error",
    data: {
      message: message,
    },
  });
});

// SPRAWDZIC SCHEMAT PRISMY

// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING

server.listen(process.env.PORT || 3008);
