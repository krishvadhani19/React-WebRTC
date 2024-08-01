const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
  socket.on("room:join", (data) => {
    const { email, roomCode } = data;

    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);

    // all users having this roomCode will be notified
    io.to(roomCode).emit("user:joined", { email, id: socket.id });

    // join this socket connection
    socket.join(roomCode);

    // join room and return data
    io.to(socket.id).emit("room:join", data);
  });
});
