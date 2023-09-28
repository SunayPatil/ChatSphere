const connectToMongo = require("./database");
connectToMongo();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

// ------------------socket io------------------
const http = require("http");
const userRoute = require("./Routes/UserRoutes");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(express.json());

app.use("/user", userRoute);

io.on("connection", (socket) => {
  // emit to particular room
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_msg", (data) => {
    // Broadcast the message to the specified rooms

    data.room.forEach((room) => {
      socket.to(room).emit("receive_msg", data);
    });
  });

  // Handle disconnections
  socket.on("disconnect", () => {});
});

server.listen(port, () => {
  console.log(`Chat backend app listening at http://localhost:${port}`);
});
