const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("room:join", (data) => {
    const { email, roomCode } = data;

    // new user is joining the room
    socket.join(roomCode);

    // using socket.to and not io.to as socket.to will send message to everyone on this roomCode and not the current socket user
    socket.to(roomCode).emit("user:joined", { email, id: socket.id });

    // when user disconnects this will notify to all except the current socket user
    // socket.on("disconnect", () => {
    //   socket.to(roomId).emit("user-disconnected", { id: socket.id });
    // });

    // sending message to all having this socket Id
    io.to(socket.id).emit("room:join", data);
    // this also means the same of emitting to all having this socket but the socket is unique to the new joined user
    // socket.emit("room:join", data);

    /**
     * socket event for placing call from a peer
     * The peer is sending an offer to all the users of with the particular roomCode
     * This incoming-call event is triggered to all users except the one sending in that room
     */
    socket.on("user:call", ({ to, offer }) => {
      io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    /**
     * socket event to accept call
     */
    socket.on("call:accepted", ({ callerId, ans }) => {
      io.to(callerId).emit("call:accepted", { from: socket.id, ans });
    });

    /**
     *
     */
    socket.on("peer:nego:needed", ({ offer, to }) => {
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    /**
     *
     */
    socket.on("peer:nego:done", ({ to, ans }) => {
      io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });
  });
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
