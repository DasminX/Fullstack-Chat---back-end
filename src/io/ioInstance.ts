import { Server } from "socket.io";
import {addMessageToRoomDB, createRoomHandler, enterRoomHandler, getRoomMessages, getRoomsHandler, leaveRoomHandler} from "./ioFunctions"; //prettier-ignore

export const getIoServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "OPTIONS"],
    },
  });

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

  return io;
};
