import { Server } from "socket.io";

export const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      console.log(`Socket ${socket.id} joining room ${roomId}`);
      socket.join(roomId);
    });
  });

  return io;
};
