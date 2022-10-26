import { Server } from "socket.io";
import {addMessageToRoomDB, checkRoomHasAPassword, createRoomHandler, enterRoomHandler, getRoomMessages, getRoomsHandler, leaveRoomHandler} from "./ioFunctions"; //prettier-ignore

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
      // PRIVATE ROOM APP V2
      // const roomPrivacy = await checkRoomHasAPassword(data.currentRoomID);

      // if (!roomPrivacy) return;

      // if (!roomPrivacy.isPrivate) {
      const joiningRoomRes = await enterRoomHandler(data);
      if (!joiningRoomRes) return;

      socket.join(joiningRoomRes.joiningRoom!.id);

      socket.emit(
        "joinedRoom",
        joiningRoomRes.joiningRoom,
        `User ${joiningRoomRes.username} has joined the room.`
      );
      // } else {
      //   socket.emit("roomPasswordPrompt", roomPrivacy.password);
      // }
    });

    socket.on("leavingRoom", async (data) => {
      const responseObj = await leaveRoomHandler(data);
      if (!responseObj) return;

      socket.leave(responseObj.leavingRoom.id);
      socket.emit(
        "leftRoom",
        responseObj.leavingRoom.id,
        `User ${responseObj.userWhoLeft.username} has left the room.`
      );
    });

    socket.on("getInitialMessages", async (roomID) => {
      const roomMessages = await getRoomMessages(roomID);
      io.to(roomID).emit("fetchedInitialMessages", roomMessages);
      // socket.emit("fetchedInitialMessages", roomMessages);
    });

    socket.on("sendMessage", async (data) => {
      const sentMessage = await addMessageToRoomDB(data);
      const { sendByUserLogo } = data;

      socket.broadcast
        .to(sentMessage!.sendInRoomID)
        .emit("receiveMessage", sentMessage, sendByUserLogo);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};
