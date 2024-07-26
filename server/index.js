const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
const io = new Server();

const port = 8000;

// middlewares
app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on("connection", (socket) => {
  socket.on((data) => {
    const { roomId, emailId } = data;
    console.log({ emailId, socketId: socket?.io });
    emailToSocketMapping(emailId, socket?.id);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });
});

app.listen(port, () => console.log(`Server running at port ${port}`));
io.listen(8001);
