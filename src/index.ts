import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import path from "path";
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
} from "./ioUtils/room";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use("/images", express.static(`${__dirname}/images`));

// const fileStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "images");
//   },
//   filename: function (req, file, callback) {
//     callback(null, `${file.filename}-${Math.random().toString().slice(2, 10)}`);
//   },
// });

// app.use(multer({ storage: fileStorage }).any());

// socket.io
// socket.io
// socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "PUT"],
  },
});

// klasa, command handler z enumem
io.on("connection", async (socket) => {
  const initialRooms = await getRoomsHandler();

  socket.emit("sendingInitialRooms", initialRooms);

  socket.on("roomAdded", async (data) => {
    const allRooms = await createRoomHandler(data);
    io.emit("sendingUpdatedRooms", allRooms);
  });

  socket.on("joiningRoom", async (data) => {
    const joiningRoom = await enterRoomHandler(data);
    socket.join(joiningRoom!.id);

    // io.to(joiningRoom!.roomID).emit("userJoined", "userID"); // dorobic pokazywanie ktory user z jakim nickiem dolaczyl do pokoju
    socket.emit("joinedRoom", joiningRoom);
  });

  socket.on("leavingRoom", async (data) => {
    const leavingRoom = await leaveRoomHandler(data);
    socket.leave(leavingRoom!.id);

    // io.to(leavingRoom!.roomID).emit("userLeft", "userID"); // dorobic pokazywanie ktory user z jakim nickiem opuscil pokoj
    socket.emit("leftRoom");
  });

  socket.on("getInitialMessages", async (roomID) => {
    const roomMessages = await getRoomMessages(roomID);
    io.to(roomID).emit("fetchedInitialMessages", roomMessages);
    // socket.emit("fetchedInitialMessages", roomMessages);
  });

  socket.on("sendMessage", async (data) => {
    const sentMessage = await addMessageToRoomDB(data);
    const { sendByUserLogo } = data;

    socket.broadcast.emit("receiveMessage", sentMessage, sendByUserLogo);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// api
// api
// api

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = error;
  return res.status(status || 500).json({
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
